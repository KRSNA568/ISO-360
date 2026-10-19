/**
 * tests/integration/certificate.verify.test.js
 *
 * Public certificate verification (no auth):
 *   1. Returns the holder's name so a verifier can match it to a person
 *   2. Never exposes score or email
 *   3. 404 for an unknown certificate ID
 */

const request = require('supertest')

// ── Mock DB pool ──────────────────────────────────────────────────────────────
jest.mock('../../src/config/db', () => ({
  query: jest.fn(),
}))

const pool = require('../../src/config/db')
const app  = require('../../src/app')

describe('GET /api/certificates/verify/:certId', () => {
  beforeEach(() => jest.clearAllMocks())

  it('returns holder name but not score or email', async () => {
    pool.query.mockResolvedValueOnce({
      rows: [{
        certificate_id: 'ISO27-2026-ABCD1234',
        full_name:      'Jane Auditor',
        track:          'professional',
        awarded_on:     new Date('2026-05-01T00:00:00Z'),
        revoked:        false,
        revoked_reason: null,
        revoked_at:     null,
        // Defensive: even if the query ever selected these, they must not leak
        score:          92,
        email:          'jane@example.com',
      }],
    })

    const res = await request(app).get('/api/certificates/verify/ISO27-2026-ABCD1234')

    expect(res.status).toBe(200)
    expect(res.body.fullName).toBe('Jane Auditor')
    expect(res.body.valid).toBe(true)
    expect(res.body).not.toHaveProperty('score')
    expect(res.body).not.toHaveProperty('email')
    expect(JSON.stringify(res.body)).not.toContain('jane@example.com')
  })

  it('returns 404 for an unknown certificate ID', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] })

    const res = await request(app).get('/api/certificates/verify/ISO27-2026-NOPE0000')

    expect(res.status).toBe(404)
  })
})
