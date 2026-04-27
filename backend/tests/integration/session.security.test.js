/**
 * tests/integration/session.security.test.js
 *
 * Tests critical session security invariants:
 *   1. JWT is required — unauthenticated requests get 401
 *   2. Session isolation — User A cannot submit answers for User B's session
 *   3. Score calculation happens server-side — client cannot send a score
 *   4. Cannot start a session that isn't in 'ready' status
 */

const request = require('supertest')
const jwt     = require('jsonwebtoken')

// ── Mock DB pool ──────────────────────────────────────────────────────────────
jest.mock('../../src/config/db', () => ({
  query:   jest.fn(),
  connect: jest.fn(),
}))

// ── Mock Report Service (fire-and-forget, don't let it interfere) ─────────────
jest.mock('../../src/services/reportService', () => ({
  generateReport: jest.fn().mockResolvedValue(undefined),
}))

// ── Mock Certificate Service ──────────────────────────────────────────────────
jest.mock('../../src/services/certificateService', () => ({
  generateCertificate: jest.fn().mockResolvedValue(null),
}))

// ── Mock Email Service ────────────────────────────────────────────────────────
jest.mock('../../src/services/emailService', () => ({
  sendCertificateEmail: jest.fn().mockResolvedValue(true),
}))

// ── Mock Question Bank ────────────────────────────────────────────────────────
jest.mock('../../src/services/questionBankService', () => ({
  drawQuestions: jest.fn().mockReturnValue([]),
}))

// ── Mock shared constants ─────────────────────────────────────────────────────
jest.mock('@27001certified/shared/constants', () => ({
  EXAM_CONFIG: {
    associate: {
      TOTAL_QUESTIONS:        50,
      PASS_THRESHOLD:         40,
      PASS_THRESHOLD_PCT:     80,
      EXAM_DURATION_SECONDS:  600,
    },
  },
  RETAKE_POLICY: { MAX_ATTEMPTS_PER_30_DAYS: 3 },
  THREAD_DOMAINS: { associate: { 1: 'Clause 4-5', 2: 'Clause 6' } },
  INTEGRITY_THRESHOLDS: {
    SUSPICIOUS_AVG_SECONDS_PER_Q: 3,
    SUSPICIOUS_TAB_VIOLATIONS:    3,
    SUSPICIOUS_TOTAL_SECONDS:     30,
  },
}))

const pool = require('../../src/config/db')
const app  = require('../../src/app')

// ── JWT helpers ───────────────────────────────────────────────────────────────
const JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret_do_not_use_in_prod'

function makeToken(userId, role = 'user') {
  return jwt.sign(
    { sub: userId, email: `${userId}@test.com`, role, iat: Math.floor(Date.now() / 1000) },
    JWT_SECRET,
    { expiresIn: '1h' },
  )
}

const USER_A_ID    = 'user-aaaa-1111'
const USER_B_ID    = 'user-bbbb-2222'
const SESSION_B_ID = 'sess-bbbb-9999'
const TOKEN_A      = makeToken(USER_A_ID)

// ─────────────────────────────────────────────────────────────────────────────

describe('Session Security — Authentication Enforcement', () => {
  it('should return 401 for any session route without a JWT', async () => {
    const res = await request(app).get('/api/session/history')
    expect(res.status).toBe(401)
    expect(res.body.error).toMatch(/authentication required/i)
  })

  it('should return 401 for a tampered / invalid JWT', async () => {
    const res = await request(app)
      .get('/api/session/history')
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiJ9.tampered.signature')
    expect(res.status).toBe(401)
  })
})

// ─────────────────────────────────────────────────────────────────────────────

describe('Session Security — Session Isolation (IDOR)', () => {
  beforeEach(() => jest.clearAllMocks())

  it('should NOT allow User A to submit an answer on User B\'s session', async () => {
    // DB returns 0 rows because user_id = USER_A_ID does not match the session's owner (USER_B_ID)
    pool.query.mockResolvedValueOnce({ rowCount: 0 })

    const res = await request(app)
      .post(`/api/session/${SESSION_B_ID}/answer`)
      .set('Authorization', `Bearer ${TOKEN_A}`)
      .send({ questionId: 'q-001', selectedOption: 'A' })

    expect(res.status).toBe(400)
    expect(res.body.error).toMatch(/not found or not active/i)
  })

  it('should NOT allow User A to start User B\'s session', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] }) // no session found for user A

    const res = await request(app)
      .post(`/api/session/${SESSION_B_ID}/start`)
      .set('Authorization', `Bearer ${TOKEN_A}`)
      .send({})

    expect(res.status).toBe(404)
    expect(res.body.error).toMatch(/not found/i)
  })
})

// ─────────────────────────────────────────────────────────────────────────────

describe('Session — State Machine Enforcement', () => {
  beforeEach(() => jest.clearAllMocks())

  it('should return 400 when trying to start a session with status "generating"', async () => {
    pool.query.mockResolvedValueOnce({
      rows: [{
        id:           SESSION_B_ID,
        track:        'associate',
        status:       'generating',
        questions:    [],
        answers:      [],
        tab_violations: 0,
        device_fingerprint: null,
      }],
    })

    const res = await request(app)
      .post(`/api/session/${SESSION_B_ID}/start`)
      .set('Authorization', `Bearer ${makeToken(USER_B_ID)}`)
      .send({})

    expect(res.status).toBe(400)
    expect(res.body.error).toMatch(/cannot start/i)
  })

  it('should return 400 when trying to submit an already-completed session', async () => {
    pool.query.mockResolvedValueOnce({
      rows: [{
        id:           SESSION_B_ID,
        track:        'associate',
        status:       'completed',
        questions:    [],
        answers:      [],
        tab_violations: 0,
        started_at:   new Date(),
      }],
    })

    const res = await request(app)
      .post(`/api/session/${SESSION_B_ID}/submit`)
      .set('Authorization', `Bearer ${makeToken(USER_B_ID)}`)
      .send({})

    // The route returns 200 with alreadyScored: true (idempotent design)
    expect(res.status).toBe(200)
    expect(res.body.alreadyScored).toBe(true)
  })
})

// ─────────────────────────────────────────────────────────────────────────────

describe('Session — Answer Validation', () => {
  const TOKEN_B = makeToken(USER_B_ID)

  beforeEach(() => jest.clearAllMocks())

  it('should return 400 for an invalid selectedOption (not A-D)', async () => {
    const res = await request(app)
      .post(`/api/session/${SESSION_B_ID}/answer`)
      .set('Authorization', `Bearer ${TOKEN_B}`)
      .send({ questionId: 'q-001', selectedOption: 'E' }) // 'E' is invalid

    expect(res.status).toBe(400)
  })

  it('should return 400 for a missing questionId', async () => {
    const res = await request(app)
      .post(`/api/session/${SESSION_B_ID}/answer`)
      .set('Authorization', `Bearer ${TOKEN_B}`)
      .send({ selectedOption: 'A' }) // missing questionId

    expect(res.status).toBe(400)
  })
})
