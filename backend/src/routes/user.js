/**
 * routes/user.js — Phase 1
 * All routes require authentication.
 *
 * GET    /api/user/me        — profile + attempt summary
 * PATCH  /api/user/me        — update editable fields
 * DELETE /api/user/me        — soft delete (GDPR erasure)
 * GET    /api/user/attempts  — paginated exam session history
 */
const router = require('express').Router()
const { z }  = require('zod')
const pool   = require('../config/db')
const { authenticate }        = require('../middlewares/authenticate')
const { revokeAllRefreshTokens } = require('../services/tokenService')

router.use(authenticate)

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

// ── 1.8  GET /me ─────────────────────────────────────────────────────────────

router.get('/me', async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT
         u.id, u.full_name, u.email, u.company, u.job_role, u.country,
         u.email_verified, u.role, u.created_at,
         COUNT(es.id)                                       AS total_attempts,
         COUNT(es.id) FILTER (WHERE es.passed = TRUE)       AS total_passed,
         MAX(es.created_at)                                 AS last_attempt_at
       FROM users u
       LEFT JOIN exam_sessions es
         ON es.user_id = u.id AND es.status = 'completed'
       WHERE u.id = $1 AND u.deleted_at IS NULL
       GROUP BY u.id`,
      [req.user.sub]
    )

    if (!rows.length) return res.status(404).json({ error: 'User not found.' })

    const u = rows[0]
    res.json({
      id:             u.id,
      full_name:      u.full_name,
      email:          u.email,
      company:        u.company        || null,
      job_role:       u.job_role       || null,
      country:        u.country        || null,
      email_verified: u.email_verified,
      role:           u.role,
      created_at:     u.created_at,
      stats: {
        total_attempts: parseInt(u.total_attempts, 10),
        total_passed:   parseInt(u.total_passed,   10),
        last_attempt_at: u.last_attempt_at || null,
      },
    })
  } catch (err) { next(err) }
})

// ── 1.9  PATCH /me ───────────────────────────────────────────────────────────

const patchSchema = z.object({
  full_name: z.string().min(2).max(100).optional(),
  company:   z.string().max(100).nullable().optional(),
  job_role:  z.string().max(100).nullable().optional(),
  country:   z.string().max(60).nullable().optional(),
}).strict()

router.patch('/me', async (req, res, next) => {
  try {
    const data = validate(patchSchema, req.body)
    if (Object.keys(data).length === 0) {
      return res.status(400).json({ error: 'No fields provided to update.' })
    }

    // Build SET clause dynamically from provided fields only
    const fields  = Object.keys(data)
    const values  = Object.values(data)
    const setClause = fields.map((f, i) => `"${f}" = $${i + 1}`).join(', ')

    const { rows } = await pool.query(
      `UPDATE users
       SET ${setClause}, updated_at = NOW()
       WHERE id = $${fields.length + 1} AND deleted_at IS NULL
       RETURNING id, full_name, email, company, job_role, country, email_verified, role, updated_at`,
      [...values, req.user.sub]
    )

    if (!rows.length) return res.status(404).json({ error: 'User not found.' })
    res.json(rows[0])
  } catch (err) { next(err) }
})

// ── 1.10  DELETE /me ─────────────────────────────────────────────────────────

router.delete('/me', async (req, res, next) => {
  try {
    // Soft delete — real PII purge scheduled separately (GDPR 30-day window)
    const { rows } = await pool.query(
      `UPDATE users SET deleted_at = NOW(), updated_at = NOW()
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING id`,
      [req.user.sub]
    )
    if (!rows.length) return res.status(404).json({ error: 'User not found.' })

    await revokeAllRefreshTokens(req.user.sub)

    res.json({ message: 'Account scheduled for deletion. You have been logged out.' })
  } catch (err) { next(err) }
})

// ── 1.11  GET /attempts ──────────────────────────────────────────────────────

router.get('/attempts', async (req, res, next) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page  || '1',  10))
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit || '10', 10)))
    const offset = (page - 1) * limit

    const { rows: countRows } = await pool.query(
      `SELECT COUNT(*) FROM exam_sessions
       WHERE user_id = $1 AND status IN ('completed','expired','aborted')`,
      [req.user.sub]
    )
    const total = parseInt(countRows[0].count, 10)

    const { rows: sessions } = await pool.query(
      `SELECT
         id, track, status, score, passed,
         tab_violations, suspicious,
         started_at, completed_at, expires_at, created_at
       FROM exam_sessions
       WHERE user_id = $1 AND status IN ('completed','expired','aborted')
       ORDER BY created_at DESC
       LIMIT $2 OFFSET $3`,
      [req.user.sub, limit, offset]
    )

    res.json({
      data:       sessions,
      pagination: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit),
      },
    })
  } catch (err) { next(err) }
})

module.exports = router
