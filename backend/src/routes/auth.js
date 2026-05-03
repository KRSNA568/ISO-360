/**
 * routes/auth.js — Phase 1
 * POST /api/auth/register
 * POST /api/auth/verify-otp
 * POST /api/auth/resend-otp
 * POST /api/auth/login
 * POST /api/auth/refresh
 * POST /api/auth/logout
 * POST /api/auth/forgot-password
 * POST /api/auth/reset-password
 */
const router  = require('express').Router()
const bcrypt  = require('bcryptjs')
const crypto  = require('crypto')
const { z }   = require('zod')

const pool          = require('../config/db')
const redis         = require('../config/redis')
const { sendOtpEmail, sendPasswordResetEmail } = require('../services/emailService')
const {
  signAccessToken,
  generateRefreshToken,
  saveRefreshToken,
  rotateRefreshToken,
  revokeAllRefreshTokens,
} = require('../services/tokenService')
const { authLimiter, otpIpLimiter, resetLimiter, refreshLimiter } = require('../middlewares/rateLimiter')
const { authenticate } = require('../middlewares/authenticate')

// ── Helpers ───────────────────────────────────────────────────────────────────

const BCRYPT_ROUNDS    = 12
const OTP_EXPIRY_MIN   = 15
const OTP_RESET_MIN    = 60
const OTP_MAX_ATTEMPTS = 5
const OTP_EMAIL_MAX    = 3

function makeOtp() {
  return String(crypto.randomInt(100000, 999999))
}

function validate(schema, body) {
  const result = schema.safeParse(body)
  if (!result.success) {
    const err = new Error('Validation error')
    err.status  = 422
    err.details = result.error.errors.map((e) => ({ field: e.path.join('.'), message: e.message }))
    throw err
  }
  return result.data
}

async function checkEmailOtpLimit(email) {
  // In production, if Redis is unhealthy we cannot enforce per-email OTP limits —
  // fail closed to prevent spam rather than silently allowing unlimited OTPs.
  if (!redis.healthy && process.env.NODE_ENV === 'production') {
    const err = new Error('OTP service temporarily unavailable. Please try again in a moment.')
    err.status = 503
    throw err
  }

  try {
    const key   = `otp_count:${email.toLowerCase()}`
    const count = await redis.incr(key)
    if (count === 1) {await redis.expire(key, 3600)}
    if (count > OTP_EMAIL_MAX) {
      const ttl = await redis.ttl(key)
      const err = new Error(`OTP limit reached. Try again in ${Math.ceil(ttl / 60)} minutes.`)
      err.status = 429
      throw err
    }
  } catch (err) {
    if (err.status === 429 || err.status === 503) {throw err}
    // Redis unavailable in non-production — fail open, IP-level rate limit still applies
    console.warn('[auth] Redis unavailable for OTP rate limit, skipping per-email check:', err.message)
  }
}

function safeUser(u) {
  return {
    id:             u.id,
    full_name:      u.full_name,
    email:          u.email,
    company:        u.company  || null,
    job_role:       u.job_role || null,
    country:        u.country  || null,
    email_verified: u.email_verified,
    role:           u.role,
    created_at:     u.created_at,
  }
}

// ── Validation schemas ────────────────────────────────────────────────────────

const registerSchema = z.object({
  full_name: z.string().min(2).max(100),
  email:     z.string().email(),
  password:  z.string().min(8).max(128),
  company:   z.string().max(100).optional(),
  job_role:  z.string().max(100).optional(),
  country:   z.string().max(60).optional(),
})

const verifyOtpSchema = z.object({
  user_id: z.string().uuid(),
  code:    z.string().length(6).regex(/^\d{6}$/),
  purpose: z.enum(['email_verify', 'password_reset']).default('email_verify'),
})

const resendOtpSchema = z.object({
  email:   z.string().email(),
  purpose: z.enum(['email_verify', 'password_reset']).default('email_verify'),
})

const loginSchema = z.object({
  email:    z.string().email(),
  password: z.string().min(1),
})

const forgotSchema = z.object({
  email: z.string().email(),
})

const resetSchema = z.object({
  email:        z.string().email(),
  code:         z.string().length(6).regex(/^\d{6}$/),
  new_password: z.string().min(12).max(128),
})

// ── 1.1  POST /register ───────────────────────────────────────────────────────

router.post('/register', authLimiter, async (req, res, next) => {
  try {
    const data = validate(registerSchema, req.body)

    const { rows: existing } = await pool.query(
      `SELECT id FROM users WHERE email = $1 AND deleted_at IS NULL`,
      [data.email.toLowerCase()]
    )
    if (existing.length) {
      return res.status(409).json({ error: 'An account with this email already exists.' })
    }

    const passwordHash = await bcrypt.hash(data.password, BCRYPT_ROUNDS)

    const { rows } = await pool.query(
      `INSERT INTO users (full_name, email, password_hash, company, job_role, country)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, full_name, email, email_verified, role, created_at`,
      [
        data.full_name.trim(),
        data.email.toLowerCase(),
        passwordHash,
        data.company  || null,
        data.job_role || null,
        data.country  || null,
      ]
    )
    const user = rows[0]

    await checkEmailOtpLimit(user.email)

    const code      = makeOtp()
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MIN * 60 * 1000)
    await pool.query(
      `INSERT INTO otps (user_id, code, purpose, expires_at, ip_address)
       VALUES ($1, $2, 'email_verify', $3, $4)`,
      [user.id, code, expiresAt, req.ip]
    )

    await sendOtpEmail(user.email, user.full_name, code)

    res.status(201).json({
      message: 'Registration successful. Check your email for the verification code.',
      user_id: user.id,
    })
  } catch (err) { next(err) }
})

// ── 1.2  POST /verify-otp ─────────────────────────────────────────────────────

router.post('/verify-otp', authLimiter, async (req, res, next) => {
  try {
    const data = validate(verifyOtpSchema, req.body)

    const { rows: otps } = await pool.query(
      `SELECT id, code, attempts, expires_at
       FROM otps
       WHERE user_id = $1 AND purpose = $2 AND used = FALSE
       ORDER BY created_at DESC LIMIT 1`,
      [data.user_id, data.purpose]
    )

    const fail = (msg, status = 400) => { const e = new Error(msg); e.status = status; throw e }

    if (!otps.length)               {fail('No active code found. Please request a new one.')}
    const otp = otps[0]
    if (new Date(otp.expires_at) < new Date()) {fail('Code has expired. Please request a new one.')}
    if (otp.attempts >= OTP_MAX_ATTEMPTS)       {fail('Too many incorrect attempts. Request a new code.')}

    if (otp.code !== data.code) {
      await pool.query('UPDATE otps SET attempts = attempts + 1 WHERE id = $1', [otp.id])
      const remaining = OTP_MAX_ATTEMPTS - (otp.attempts + 1)
      return res.status(400).json({
        error: `Incorrect code. ${remaining} attempt${remaining !== 1 ? 's' : ''} remaining.`,
      })
    }

    await pool.query('UPDATE otps SET used = TRUE WHERE id = $1', [otp.id])

    if (data.purpose === 'password_reset') {
      return res.json({ message: 'Code verified.', user_id: data.user_id, verified: true })
    }

    const { rows } = await pool.query(
      `UPDATE users SET email_verified = TRUE, updated_at = NOW()
       WHERE id = $1 AND deleted_at IS NULL RETURNING *`,
      [data.user_id]
    )
    if (!rows.length) {fail('User not found.', 404)}
    const user = rows[0]

    const accessToken = signAccessToken(user)
    const { raw: refreshRaw, hash: refreshHash } = generateRefreshToken()
    await saveRefreshToken(user.id, refreshHash, req.ip, req.headers['user-agent'])

    res.json({
      message:       'Email verified successfully.',
      access_token:  accessToken,
      refresh_token: refreshRaw,
      user:          safeUser(user),
    })
  } catch (err) { next(err) }
})

// ── 1.3  POST /resend-otp ─────────────────────────────────────────────────────

router.post('/resend-otp', otpIpLimiter, async (req, res, next) => {
  try {
    const data = validate(resendOtpSchema, req.body)

    const { rows: users } = await pool.query(
      `SELECT id, full_name, email, email_verified FROM users
       WHERE email = $1 AND deleted_at IS NULL`,
      [data.email.toLowerCase()]
    )

    if (!users.length) {return res.json({ message: 'If an account exists, a new code has been sent.' })}
    const user = users[0]

    if (data.purpose === 'email_verify' && user.email_verified) {
      return res.json({ message: 'Email is already verified.' })
    }

    await checkEmailOtpLimit(user.email)

    await pool.query(
      `UPDATE otps SET used = TRUE WHERE user_id = $1 AND purpose = $2 AND used = FALSE`,
      [user.id, data.purpose]
    )

    const code      = makeOtp()
    const expiryMin = data.purpose === 'password_reset' ? OTP_RESET_MIN : OTP_EXPIRY_MIN
    const expiresAt = new Date(Date.now() + expiryMin * 60 * 1000)

    await pool.query(
      `INSERT INTO otps (user_id, code, purpose, expires_at, ip_address) VALUES ($1,$2,$3,$4,$5)`,
      [user.id, code, data.purpose, expiresAt, req.ip]
    )

    if (data.purpose === 'password_reset') {
      await sendPasswordResetEmail(user.email, user.full_name, code)
    } else {
      await sendOtpEmail(user.email, user.full_name, code)
    }

    res.json({ message: 'A new verification code has been sent.', user_id: user.id })
  } catch (err) { next(err) }
})

// ── Per-account brute-force guard (Redis-backed, fail-open) ──────────────────
const LOGIN_MAX_FAILURES  = 10   // lock after 10 wrong passwords
const LOGIN_LOCKOUT_SECS  = 900  // 15-minute lockout

async function checkLoginBruteForce(userId) {
  try {
    const key   = `login_fail:${userId}`
    const count = await redis.incr(key)
    if (count === 1) {await redis.expire(key, LOGIN_LOCKOUT_SECS)}
    if (count > LOGIN_MAX_FAILURES) {
      const ttl = await redis.ttl(key)
      const err = new Error(`Too many failed login attempts. Try again in ${Math.ceil(ttl / 60)} minutes.`)
      err.status = 429
      throw err
    }
  } catch (err) {
    if (err.status === 429) {throw err}
    // Redis unavailable — fail open, IP-level rate limit still protects
    console.warn('[auth] Redis unavailable for brute-force check, failing open:', err.message)
  }
}

async function clearLoginBruteForce(userId) {
  try { await redis.del(`login_fail:${userId}`) } catch { /* fail-open */ }
}

// ── 1.4  POST /login ──────────────────────────────────────────────────────────

router.post('/login', authLimiter, async (req, res, next) => {
  try {
    const data = validate(loginSchema, req.body)
    const INVALID = 'Invalid email or password.'

    const { rows } = await pool.query(
      `SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL`,
      [data.email.toLowerCase()]
    )
    if (!rows.length) {return res.status(401).json({ error: INVALID })}
    const user = rows[0]

    if (user.blocked) {
      return res.status(403).json({ error: 'Your account has been suspended. Contact support.' })
    }
    if (!user.password_hash) {return res.status(401).json({ error: INVALID })}

    const match = await bcrypt.compare(data.password, user.password_hash)
    if (!match) {
      await checkLoginBruteForce(user.id).catch(() => {})
      return res.status(401).json({ error: INVALID })
    }

    // Successful password match — clear any brute-force counter
    await clearLoginBruteForce(user.id)

    if (!user.email_verified) {
      // Auto-resend verification OTP on login attempt with unverified account
      try {
        await checkEmailOtpLimit(user.email)
        await pool.query(
          `UPDATE otps SET used = TRUE WHERE user_id = $1 AND purpose = 'email_verify' AND used = FALSE`,
          [user.id]
        )
        const code = makeOtp()
        const expiresAt = new Date(Date.now() + OTP_EXPIRY_MIN * 60 * 1000)
        await pool.query(
          `INSERT INTO otps (user_id, code, purpose, expires_at, ip_address) VALUES ($1,$2,'email_verify',$3,$4)`,
          [user.id, code, expiresAt, req.ip]
        )
        await sendOtpEmail(user.email, user.full_name, code)
      } catch (_) { /* swallow — don't block login response */ }

      return res.status(403).json({
        error:   'Email not verified. A new code has been sent.',
        code:    'EMAIL_NOT_VERIFIED',
        user_id: user.id,
      })
    }

    const accessToken = signAccessToken(user)
    const { raw: refreshRaw, hash: refreshHash } = generateRefreshToken()
    await saveRefreshToken(user.id, refreshHash, req.ip, req.headers['user-agent'])

    res.json({
      access_token:  accessToken,
      refresh_token: refreshRaw,
      user:          safeUser(user),
    })
  } catch (err) { next(err) }
})

// ── 1.5  POST /refresh ────────────────────────────────────────────────────────

router.post('/refresh', refreshLimiter, async (req, res, next) => {
  try {
    const { refresh_token } = req.body
    if (!refresh_token) {return res.status(400).json({ error: 'refresh_token is required.' })}

    const { userId, newRaw } = await rotateRefreshToken(refresh_token, req.ip, req.headers['user-agent'])

    const { rows } = await pool.query(
      `SELECT * FROM users WHERE id = $1 AND deleted_at IS NULL AND blocked = FALSE`,
      [userId]
    )
    if (!rows.length) {return res.status(401).json({ error: 'User not found or suspended.' })}

    res.json({
      access_token:  signAccessToken(rows[0]),
      refresh_token: newRaw,
    })
  } catch (err) { next(err) }
})

// ── POST /logout ──────────────────────────────────────────────────────────────

router.post('/logout', authenticate, async (req, res, next) => {
  try {
    await revokeAllRefreshTokens(req.user.sub)
    res.json({ message: 'Logged out successfully.' })
  } catch (err) { next(err) }
})

// ── 1.6  POST /forgot-password ────────────────────────────────────────────────

router.post('/forgot-password', resetLimiter, async (req, res, next) => {
  try {
    const data = validate(forgotSchema, req.body)
    const OK   = { message: 'If an account exists, a password reset code has been sent.' }

    const { rows } = await pool.query(
      `SELECT id, full_name, email FROM users WHERE email = $1 AND deleted_at IS NULL`,
      [data.email.toLowerCase()]
    )
    if (!rows.length) {return res.json(OK)}
    const user = rows[0]

    try { await checkEmailOtpLimit(user.email) } catch (_) { return res.json(OK) }

    await pool.query(
      `UPDATE otps SET used = TRUE WHERE user_id = $1 AND purpose = 'password_reset' AND used = FALSE`,
      [user.id]
    )
    const code      = makeOtp()
    const expiresAt = new Date(Date.now() + OTP_RESET_MIN * 60 * 1000)
    await pool.query(
      `INSERT INTO otps (user_id, code, purpose, expires_at, ip_address) VALUES ($1,$2,'password_reset',$3,$4)`,
      [user.id, code, expiresAt, req.ip]
    )
    try {
      await sendPasswordResetEmail(user.email, user.full_name, code)
    } catch (emailErr) {
      const e = new Error('Failed to send reset email. Please try again later.')
      e.status = 503
      return next(e)
    }

    res.json({ ...OK, user_id: user.id })
  } catch (err) { next(err) }
})

// ── 1.7  POST /reset-password ─────────────────────────────────────────────────

router.post('/reset-password', resetLimiter, async (req, res, next) => {
  try {
    const data = validate(resetSchema, req.body)
    const fail = (msg) => { const e = new Error(msg); e.status = 400; throw e }

    // Look up user by email
    const { rows: users } = await pool.query(
      `SELECT id FROM users WHERE email = $1 AND deleted_at IS NULL LIMIT 1`,
      [data.email.toLowerCase()]
    )
    if (!users.length) {fail('Invalid or expired reset code.')}
    const userId = users[0].id

    const { rows: otps } = await pool.query(
      `SELECT id, code, attempts, expires_at FROM otps
       WHERE user_id = $1 AND purpose = 'password_reset' AND used = FALSE
       ORDER BY created_at DESC LIMIT 1`,
      [userId]
    )

    if (!otps.length)                             {fail('No active reset code. Please request a new one.')}
    if (new Date(otps[0].expires_at) < new Date()) {fail('Reset code has expired.')}
    if (otps[0].attempts >= OTP_MAX_ATTEMPTS)      {fail('Too many incorrect attempts. Request a new code.')}

    if (otps[0].code !== data.code) {
      await pool.query('UPDATE otps SET attempts = attempts + 1 WHERE id = $1', [otps[0].id])
      return res.status(400).json({ error: 'Incorrect code.' })
    }

    await pool.query('UPDATE otps SET used = TRUE WHERE id = $1', [otps[0].id])

    const passwordHash = await bcrypt.hash(data.new_password, BCRYPT_ROUNDS)
    await pool.query(
      `UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2`,
      [passwordHash, userId]
    )
    await revokeAllRefreshTokens(userId)

    res.json({ message: 'Password updated successfully. Please log in.' })
  } catch (err) { next(err) }
})

// ── Change Password (authenticated) ──────────────────────────────────────────

const changePasswordSchema = z.object({
  current_password: z.string().min(1),
  new_password:     z.string().min(8).max(128)
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
})

router.post('/change-password', authenticate, async (req, res, next) => {
  try {
    const data = validate(changePasswordSchema, req.body)

    const { rows } = await pool.query(
      'SELECT password_hash FROM users WHERE id = $1 AND deleted_at IS NULL',
      [req.user.sub]
    )
    if (!rows.length) {return res.status(404).json({ error: 'User not found.' })}

    const match = await bcrypt.compare(data.current_password, rows[0].password_hash)
    if (!match) {return res.status(400).json({ error: 'Current password is incorrect.', code: 'WRONG_CURRENT_PASSWORD' })}

    // Prevent reuse of the same password
    const same = await bcrypt.compare(data.new_password, rows[0].password_hash)
    if (same) {return res.status(400).json({ error: 'New password must be different from your current password.', code: 'SAME_PASSWORD' })}

    const newHash = await bcrypt.hash(data.new_password, BCRYPT_ROUNDS)
    await pool.query(
      'UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2',
      [newHash, req.user.sub]
    )

    res.json({ message: 'Password updated successfully.' })
  } catch (err) { next(err) }
})

module.exports = router
