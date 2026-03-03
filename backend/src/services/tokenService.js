/**
 * tokenService.js
 * JWT access token + refresh token helpers.
 *
 * Refresh tokens are stored as SHA-256 hashes in the refresh_tokens table.
 * The raw token is returned to the client once and never persisted in plain form.
 */
const jwt    = require('jsonwebtoken')
const crypto = require('crypto')
const pool   = require('../config/db')

// ── Config ────────────────────────────────────────────────────────────────────

const ACCESS_SECRET  = () => process.env.JWT_SECRET
const REFRESH_SECRET = () => process.env.REFRESH_TOKEN_SECRET
const ACCESS_TTL     = () => process.env.JWT_EXPIRES_IN        || '24h'
const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000 // 7 days in ms

// ── Access token ──────────────────────────────────────────────────────────────

/**
 * Sign a short-lived JWT access token.
 * @param {{ id, email, role, email_verified }} user
 * @returns {string} signed JWT
 */
function signAccessToken(user) {
  return jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    ACCESS_SECRET(),
    { expiresIn: ACCESS_TTL() }
  )
}

// ── Refresh token ─────────────────────────────────────────────────────────────

/**
 * Generate a random refresh token and return both the raw value and its hash.
 * @returns {{ raw: string, hash: string }}
 */
function generateRefreshToken() {
  const raw  = crypto.randomBytes(48).toString('hex')
  const hash = crypto.createHash('sha256').update(raw).digest('hex')
  return { raw, hash }
}

/**
 * Persist a refresh token hash into the DB.
 */
async function saveRefreshToken(userId, hash, ip, userAgent) {
  const expiresAt = new Date(Date.now() + REFRESH_TTL_MS)
  await pool.query(
    `INSERT INTO refresh_tokens (user_id, token_hash, expires_at, ip_address, user_agent)
     VALUES ($1, $2, $3, $4, $5)`,
    [userId, hash, expiresAt, ip || null, userAgent || null]
  )
}

/**
 * Validate a raw refresh token, revoke it, issue a new one (rotation).
 * @returns {{ userId: string, newRaw: string }} or throws
 */
async function rotateRefreshToken(rawToken, ip, userAgent) {
  const hash = crypto.createHash('sha256').update(rawToken).digest('hex')

  const { rows } = await pool.query(
    `SELECT id, user_id, expires_at, revoked
     FROM refresh_tokens
     WHERE token_hash = $1`,
    [hash]
  )

  if (rows.length === 0) throw Object.assign(new Error('Refresh token not found'), { status: 401 })
  const record = rows[0]

  if (record.revoked)                         throw Object.assign(new Error('Refresh token revoked'), { status: 401 })
  if (new Date(record.expires_at) < new Date()) throw Object.assign(new Error('Refresh token expired'), { status: 401 })

  // Revoke old token
  await pool.query('UPDATE refresh_tokens SET revoked = TRUE WHERE id = $1', [record.id])

  // Issue new token
  const { raw: newRaw, hash: newHash } = generateRefreshToken()
  await saveRefreshToken(record.user_id, newHash, ip, userAgent)

  return { userId: record.user_id, newRaw }
}

/**
 * Revoke all refresh tokens for a user (logout all devices).
 */
async function revokeAllRefreshTokens(userId) {
  await pool.query(
    'UPDATE refresh_tokens SET revoked = TRUE WHERE user_id = $1 AND revoked = FALSE',
    [userId]
  )
}

module.exports = {
  signAccessToken,
  generateRefreshToken,
  saveRefreshToken,
  rotateRefreshToken,
  revokeAllRefreshTokens,
}
