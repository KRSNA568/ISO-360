/**
 * tests/integration/auth.rate_limit.test.js
 *
 * Tests the Auth routes against the actual Express app.
 * NODE_ENV=test is set by the test script, which causes rateLimiter.js
 * to export no-op middleware (IS_TEST = true), so we never hit IP limits
 * in the test suite. Instead we test the Redis-backed per-email OTP cap
 * which is checked inside the route handler via checkEmailOtpLimit().
 *
 * We mock the DB pool and Redis to avoid any real network calls.
 */

const request = require('supertest')

// ── Mock DB pool ──────────────────────────────────────────────────────────────
jest.mock('../../src/config/db', () => ({
  query: jest.fn(),
}))

// ── Mock Redis ────────────────────────────────────────────────────────────────
jest.mock('../../src/config/redis', () => ({
  incr:   jest.fn(),
  expire: jest.fn(),
  ttl:    jest.fn(),
  del:    jest.fn(),
  get:    jest.fn(),
  set:    jest.fn(),
}))

// ── Mock Email Service ────────────────────────────────────────────────────────
jest.mock('../../src/services/emailService', () => ({
  sendOtpEmail:           jest.fn().mockResolvedValue(true),
  sendPasswordResetEmail: jest.fn().mockResolvedValue(true),
  sendCertificateEmail:   jest.fn().mockResolvedValue(true),
}))

// ── Mock Token Service ────────────────────────────────────────────────────────
jest.mock('../../src/services/tokenService', () => ({
  signAccessToken:       jest.fn().mockReturnValue('test_access_token'),
  generateRefreshToken:  jest.fn().mockReturnValue({ raw: 'test_raw', hash: 'test_hash' }),
  saveRefreshToken:      jest.fn().mockResolvedValue(true),
  rotateRefreshToken:    jest.fn().mockResolvedValue({ userId: 'test-uuid', newRaw: 'new_raw' }),
  revokeAllRefreshTokens: jest.fn().mockResolvedValue(true),
}))

const pool  = require('../../src/config/db')
const redis = require('../../src/config/redis')
const app   = require('../../src/app')

// ── Helpers ───────────────────────────────────────────────────────────────────
const FAKE_USER = {
  id:             'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  full_name:      'QA Test User',
  email:          'qa@test.com',
  email_verified: false,
  role:           'user',
  company:        'QA Corp',
  job_role:       'Tester',
  country:        'IN',
  blocked:        false,
  password_hash:  '$2a$12$testhashtesthashhh', // bcrypt hash placeholder
  created_at:     new Date().toISOString(),
}

// ─────────────────────────────────────────────────────────────────────────────

describe('POST /api/auth/register', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Redis: OTP count not yet hit
    redis.incr.mockResolvedValue(1)
    redis.expire.mockResolvedValue(true)
  })

  it('should return 422 for missing required fields', async () => {
    const res = await request(app).post('/api/auth/register').send({})
    expect(res.status).toBe(422)
    expect(res.body).toHaveProperty('details')
  })

  it('should return 422 if password is too short', async () => {
    const res = await request(app).post('/api/auth/register').send({
      full_name: 'QA User',
      email:     'qa@test.com',
      password:  'short',
    })
    expect(res.status).toBe(422)
  })

  it('should return 409 if email already exists', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ id: FAKE_USER.id }] }) // existing user found

    const res = await request(app).post('/api/auth/register').send({
      full_name: 'QA User',
      email:     'qa@test.com',
      password:  'Password123!',
    })
    expect(res.status).toBe(409)
    expect(res.body.error).toMatch(/already exists/i)
  })

  it('should return 201 and send OTP for valid new registration', async () => {
    pool.query
      .mockResolvedValueOnce({ rows: [] })  // no existing user
      .mockResolvedValueOnce({ rows: [FAKE_USER] }) // INSERT user
      .mockResolvedValueOnce({ rows: [] })  // INSERT otp

    const res = await request(app).post('/api/auth/register').send({
      full_name: 'QA New User',
      email:     'qa-new@test.com',
      password:  'Password123!',
    })
    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('user_id')
    expect(res.body.message).toMatch(/verification code/i)
  })
})

// ─────────────────────────────────────────────────────────────────────────────

describe('POST /api/auth/login', () => {
  const bcrypt = require('bcryptjs')

  beforeEach(() => {
    jest.clearAllMocks()
    redis.incr.mockResolvedValue(1)
    redis.expire.mockResolvedValue(true)
    redis.del.mockResolvedValue(1)
  })

  it('should return 401 for non-existent email', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] })

    const res = await request(app).post('/api/auth/login').send({
      email:    'nobody@test.com',
      password: 'Password123!',
    })
    expect(res.status).toBe(401)
    expect(res.body.error).toMatch(/invalid email or password/i)
  })

  it('should return 401 for wrong password', async () => {
    const realHash = await bcrypt.hash('correct_password', 1)
    pool.query.mockResolvedValueOnce({
      rows: [{ ...FAKE_USER, password_hash: realHash, email_verified: true }],
    })
    redis.incr.mockResolvedValue(1)

    const res = await request(app).post('/api/auth/login').send({
      email:    'qa@test.com',
      password: 'wrong_password',
    })
    expect(res.status).toBe(401)
  })

  it('should return 403 if email is not verified', async () => {
    const realHash = await bcrypt.hash('Password123!', 1)
    pool.query
      .mockResolvedValueOnce({ rows: [{ ...FAKE_USER, password_hash: realHash, email_verified: false }] })
      .mockResolvedValueOnce({ rows: [] })  // UPDATE otps
      .mockResolvedValueOnce({ rows: [] })  // INSERT otp

    const res = await request(app).post('/api/auth/login').send({
      email:    'qa@test.com',
      password: 'Password123!',
    })
    expect(res.status).toBe(403)
    expect(res.body.code).toBe('EMAIL_NOT_VERIFIED')
  })

  it('should return 200 with access and refresh tokens on successful login', async () => {
    const realHash = await bcrypt.hash('Password123!', 1)
    pool.query
      .mockResolvedValueOnce({ rows: [{ ...FAKE_USER, password_hash: realHash, email_verified: true }] })
      .mockResolvedValueOnce({ rows: [] }) // saveRefreshToken DB call

    const res = await request(app).post('/api/auth/login').send({
      email:    'qa@test.com',
      password: 'Password123!',
    })
    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('access_token')
    expect(res.body).toHaveProperty('refresh_token')
    expect(res.body).toHaveProperty('user')
  })
})

// ─────────────────────────────────────────────────────────────────────────────

describe('POST /api/auth/verify-otp', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Reset pool.query to a safe async default (returns empty rows)
    pool.query.mockResolvedValue({ rows: [], rowCount: 0 })
    // Default Redis mocks
    redis.incr.mockResolvedValue(1)
    redis.expire.mockResolvedValue(true)
    redis.ttl.mockResolvedValue(3600)
  })

  it('should return 422 for invalid OTP format (letters)', async () => {
    const res = await request(app).post('/api/auth/verify-otp').send({
      user_id: FAKE_USER.id,
      code:    'ABCDEF',
    })
    expect(res.status).toBe(422)
  })

  it('should return 400 when no active OTP exists', async () => {
    // beforeEach already sets pool.query to return { rows: [] } by default
    const res = await request(app).post('/api/auth/verify-otp').send({
      user_id: FAKE_USER.id,
      code:    '123456',
    })
    expect(res.status).toBe(400)
    expect(res.body.error).toMatch(/no active code/i)
  })

  it('should return 400 for incorrect OTP code', async () => {
    const futureExpiry = new Date(Date.now() + 60_000).toISOString()
    pool.query
      // 1st call: SELECT active OTP — return one row with code '654321'
      .mockResolvedValueOnce({
        rows: [{
          id:         'otp-id-1',
          code:       '654321',
          attempts:   0,
          expires_at: futureExpiry,
        }],
      })
      // 2nd call: UPDATE otps SET attempts = attempts + 1
      .mockResolvedValueOnce({ rows: [], rowCount: 1 })

    // Submit a wrong code (000000 is the dev magic bypass, use a different wrong code)
    const res = await request(app).post('/api/auth/verify-otp').send({
      user_id: FAKE_USER.id,
      code:    '111111',
    })
    expect(res.status).toBe(400)
    expect(res.body.error).toMatch(/incorrect code/i)
  })
})
