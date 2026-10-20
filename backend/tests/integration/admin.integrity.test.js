/**
 * tests/integration/admin.integrity.test.js
 *
 * Admin integrity audit for certificates issued before answer shuffling:
 *   1. Admin-only
 *   2. Audit returns computed evidence (s/question, % A answers) and total
 *   3. Bulk revoke validates input, revokes each id, audit-logs, reports failures
 */

const request = require('supertest')
const jwt     = require('jsonwebtoken')

jest.mock('../../src/config/db', () => ({
  query:   jest.fn(),
  connect: jest.fn(),
}))

jest.mock('../../src/services/certificateService', () => ({
  revokeCertificate: jest.fn(),
}))

jest.mock('../../src/services/emailService', () => ({
  sendRevocationEmail: jest.fn().mockResolvedValue(true),
}))

const pool = require('../../src/config/db')
const { revokeCertificate } = require('../../src/services/certificateService')
const app  = require('../../src/app')

const JWT_SECRET = process.env.JWT_SECRET || 'test_jwt_secret_do_not_use_in_prod'
const token = (role) => jwt.sign({ sub: '00000000-0000-0000-0000-00000000a0a0', role }, JWT_SECRET, { expiresIn: '1h' })
const ADMIN = `Bearer ${token('admin')}`
const USER  = `Bearer ${token('user')}`

const CERT_1 = '11111111-1111-1111-1111-111111111111'
const CERT_2 = '22222222-2222-2222-2222-222222222222'

beforeEach(() => {
  jest.clearAllMocks()
  pool.query.mockResolvedValue({ rows: [] }) // default: audit-log inserts, email lookups
})

describe('GET /api/admin/certificates/integrity-audit', () => {
  it('rejects non-admins', async () => {
    const res = await request(app).get('/api/admin/certificates/integrity-audit').set('Authorization', USER)
    expect(res.status).toBe(403)
  })

  it('returns pre-fix certificates with computed evidence', async () => {
    pool.query.mockResolvedValueOnce({
      rows: [{
        id: CERT_1, certificate_id: 'ISO27-2026-AAAA0001', track: 'associate', full_name: 'Fast Clicker',
        score: 50, email: 'f@example.com', tab_violations: 0, suspicious: false, suspicious_reason: null,
        duration_secs: 150, total_questions: 50, answered: 50, a_answers: 50, total_count: '7',
      }],
    })

    const res = await request(app)
      .get('/api/admin/certificates/integrity-audit?track=associate')
      .set('Authorization', ADMIN)

    expect(res.status).toBe(200)
    expect(res.body.total).toBe(7)
    expect(res.body.certificates[0]).toMatchObject({ secs_per_question: 3, a_answer_pct: 100 })
    expect(res.body.certificates[0]).not.toHaveProperty('total_count')
    expect(pool.query.mock.calls[0][1]).toEqual(['associate', 50, 0])
  })

  it('returns total 0 when nothing matches', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] })
    const res = await request(app).get('/api/admin/certificates/integrity-audit').set('Authorization', ADMIN)
    expect(res.body).toEqual({ certificates: [], total: 0 })
  })
})

describe('POST /api/admin/certificates/bulk-revoke', () => {
  it.each([
    [{ ids: [], reason: 'x' }],
    [{ ids: [CERT_1] }],
    [{ ids: [CERT_1], reason: '   ' }],
    [{ ids: ['not-a-uuid'], reason: 'x' }],
    [{ ids: Array(101).fill(CERT_1), reason: 'x' }],
  ])('returns 400 for invalid body %j', async (body) => {
    const res = await request(app).post('/api/admin/certificates/bulk-revoke').set('Authorization', ADMIN).send(body)
    expect(res.status).toBe(400)
    expect(revokeCertificate).not.toHaveBeenCalled()
  })

  it('revokes each certificate, audit-logs it, and reports failures', async () => {
    revokeCertificate
      .mockResolvedValueOnce({ certificate_id: 'ISO27-2026-AAAA0001', user_id: 'u1', full_name: 'A' })
      .mockRejectedValueOnce(Object.assign(new Error('Certificate already revoked'), { status: 409 }))

    const res = await request(app)
      .post('/api/admin/certificates/bulk-revoke')
      .set('Authorization', ADMIN)
      .send({ ids: [CERT_1, CERT_2, CERT_1], reason: 'Pre-fix pass, all-A in 3s/question' })

    expect(res.status).toBe(200)
    expect(revokeCertificate).toHaveBeenCalledTimes(2) // duplicate id ignored
    expect(res.body.revoked).toEqual([{ id: CERT_1, certificateId: 'ISO27-2026-AAAA0001' }])
    expect(res.body.failed).toEqual([{ id: CERT_2, error: 'Certificate already revoked' }])

    const auditInserts = pool.query.mock.calls.filter(([sql]) => sql.includes('INSERT INTO admin_audit_log'))
    expect(auditInserts).toHaveLength(1)
    expect(auditInserts[0][1][1]).toBe('revoke_certificate')
  })
})
