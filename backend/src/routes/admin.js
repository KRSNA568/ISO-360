/**
 * admin.js — Phase 6 Admin Portal Routes
 * All routes require: authenticate + requireAdmin middleware
 * Every write action auto-logs to admin_audit_log
 */
const router = require('express').Router()
const crypto = require('crypto')
const { authenticate } = require('../middlewares/authenticate')
const { requireAdmin }  = require('../middlewares/requireAdmin')
const pool = require('../config/db')

router.use(authenticate, requireAdmin)

// ─── Shared helpers ───────────────────────────────────────────────────────────

async function auditLog(adminId, action, targetType, targetId, metadata, ip) {
  try {
    await pool.query(
      `INSERT INTO admin_audit_log
         (admin_id, action, target_type, target_id, metadata, ip_address)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [adminId, action, targetType, String(targetId),
       metadata ? JSON.stringify(metadata) : null, ip || null]
    )
  } catch (err) {
    console.error('[auditLog] write failed:', err.message)
  }
}

function pageParams(query) {
  const size   = Math.min(parseInt(query.limit)  || 50, 100)
  const offset = (Math.max(parseInt(query.page) || 1, 1) - 1) * size
  return { size, offset }
}

// ─── Users ────────────────────────────────────────────────────────────────────

// GET /api/admin/users?search=&page=&limit=&blocked=
router.get('/users', async (req, res, next) => {
  try {
    const { search = '', blocked } = req.query
    const { size, offset } = pageParams(req.query)
    const params = []
    const conds  = ['u.deleted_at IS NULL']

    if (search.trim()) {
      params.push(`%${search.trim()}%`)
      conds.push(`(u.email ILIKE $${params.length} OR u.full_name ILIKE $${params.length})`)
    }
    if (blocked === 'true')  conds.push('u.blocked = TRUE')
    if (blocked === 'false') conds.push('u.blocked = FALSE')

    const where = 'WHERE ' + conds.join(' AND ')
    params.push(size, offset)
    const pL = params.length - 1, pO = params.length

    const { rows } = await pool.query(`
      SELECT u.id, u.full_name, u.email, u.company, u.job_role, u.country,
             u.role, u.email_verified, u.blocked, u.blocked_reason, u.blocked_at,
             u.created_at,
             COUNT(DISTINCT es.id) FILTER (WHERE es.status = 'completed') AS exam_count,
             COUNT(DISTINCT c.id)  FILTER (WHERE c.revoked = FALSE)        AS cert_count
      FROM users u
      LEFT JOIN exam_sessions es ON es.user_id = u.id
      LEFT JOIN certificates  c  ON c.user_id  = u.id
      ${where}
      GROUP BY u.id
      ORDER BY u.created_at DESC
      LIMIT $${pL} OFFSET $${pO}
    `, params)

    const cp = params.slice(0, -2)
    const { rows: cr } = await pool.query(`SELECT COUNT(*) FROM users u ${where}`, cp)
    res.json({ users: rows, total: parseInt(cr[0].count) })
  } catch (err) { next(err) }
})

// POST /api/admin/users/:id/block
router.post('/users/:id/block', async (req, res, next) => {
  try {
    const { id } = req.params
    const { reason = 'Blocked by administrator' } = req.body
    const { rows } = await pool.query(
      `UPDATE users SET blocked = TRUE, blocked_reason = $1, blocked_at = NOW()
       WHERE id = $2 AND role != 'admin' AND deleted_at IS NULL
       RETURNING id, full_name, email, blocked, blocked_at`,
      [reason, id]
    )
    if (!rows.length) return res.status(404).json({ error: 'User not found or cannot block an admin.' })
    await auditLog(req.user.sub, 'block_user', 'user', id, { reason }, req.ip)
    res.json({ message: 'User blocked.', user: rows[0] })
  } catch (err) { next(err) }
})

// POST /api/admin/users/:id/unblock
router.post('/users/:id/unblock', async (req, res, next) => {
  try {
    const { id } = req.params
    const { rows } = await pool.query(
      `UPDATE users SET blocked = FALSE, blocked_reason = NULL, blocked_at = NULL
       WHERE id = $1 AND deleted_at IS NULL
       RETURNING id, full_name, email, blocked`,
      [id]
    )
    if (!rows.length) return res.status(404).json({ error: 'User not found.' })
    await auditLog(req.user.sub, 'unblock_user', 'user', id, {}, req.ip)
    res.json({ message: 'User unblocked.', user: rows[0] })
  } catch (err) { next(err) }
})

// ─── Sessions ─────────────────────────────────────────────────────────────────

// GET /api/admin/sessions?track=&status=&suspicious=&page=&limit=
router.get('/sessions', async (req, res, next) => {
  try {
    const { track, status, suspicious } = req.query
    const { size, offset } = pageParams(req.query)
    const params = []
    const conds  = []

    if (track)                 { params.push(track);  conds.push(`es.track = $${params.length}`) }
    if (status)                { params.push(status); conds.push(`es.status = $${params.length}`) }
    if (suspicious === 'true') { conds.push('es.suspicious = TRUE') }

    const where = conds.length ? 'WHERE ' + conds.join(' AND ') : ''
    params.push(size, offset)
    const pL = params.length - 1, pO = params.length

    const { rows } = await pool.query(`
      SELECT es.id, es.track, es.status, es.score, es.passed, es.tab_violations,
             es.suspicious, es.suspicious_reason, es.ip_address, es.user_agent,
             es.generation_method, es.started_at, es.completed_at, es.created_at,
             jsonb_array_length(es.questions) AS qlen,
             u.id AS user_id, u.full_name, u.email
      FROM exam_sessions es
      JOIN users u ON u.id = es.user_id
      ${where}
      ORDER BY es.created_at DESC
      LIMIT $${pL} OFFSET $${pO}
    `, params)

    const cp = params.slice(0, -2)
    const { rows: cr } = await pool.query(
      `SELECT COUNT(*) FROM exam_sessions es JOIN users u ON u.id = es.user_id ${where}`, cp
    )
    res.json({ sessions: rows, total: parseInt(cr[0].count) })
  } catch (err) { next(err) }
})

// GET /api/admin/sessions/:id
router.get('/sessions/:id', async (req, res, next) => {
  try {
    const { rows } = await pool.query(`
      SELECT es.*, u.full_name, u.email
      FROM exam_sessions es
      JOIN users u ON u.id = es.user_id
      WHERE es.id = $1
    `, [req.params.id])
    if (!rows.length) return res.status(404).json({ error: 'Session not found.' })
    res.json(rows[0])
  } catch (err) { next(err) }
})

// POST /api/admin/sessions/:id/flag
router.post('/sessions/:id/flag', async (req, res, next) => {
  try {
    const { id } = req.params
    const { suspicious_reason = 'Flagged by administrator' } = req.body
    const { rows } = await pool.query(
      `UPDATE exam_sessions SET suspicious = TRUE, suspicious_reason = $1
       WHERE id = $2 RETURNING id, suspicious, suspicious_reason`,
      [suspicious_reason, id]
    )
    if (!rows.length) return res.status(404).json({ error: 'Session not found.' })
    await auditLog(req.user.sub, 'flag_session', 'session', id, { suspicious_reason }, req.ip)
    res.json({ message: 'Session flagged.', session: rows[0] })
  } catch (err) { next(err) }
})

// ─── Certificates ─────────────────────────────────────────────────────────────

// GET /api/admin/certificates?revoked=&track=&page=&limit=
router.get('/certificates', async (req, res, next) => {
  try {
    const { revoked, track } = req.query
    const { size, offset } = pageParams(req.query)
    const params = []
    const conds  = []

    if (track)             { params.push(track); conds.push(`c.track = $${params.length}`) }
    if (revoked === 'true')  conds.push('c.revoked = TRUE')
    if (revoked === 'false') conds.push('c.revoked = FALSE')

    const where = conds.length ? 'WHERE ' + conds.join(' AND ') : ''
    params.push(size, offset)
    const pL = params.length - 1, pO = params.length

    const { rows } = await pool.query(`
      SELECT c.id, c.certificate_id, c.track, c.full_name, c.score, c.awarded_on,
             c.revoked, c.revoked_reason, c.revoked_at, c.r2_url_landscape, c.created_at,
             u.id AS user_id, u.email
      FROM certificates c
      JOIN users u ON u.id = c.user_id
      ${where}
      ORDER BY c.created_at DESC
      LIMIT $${pL} OFFSET $${pO}
    `, params)

    const cp = params.slice(0, -2)
    const { rows: cr } = await pool.query(
      `SELECT COUNT(*) FROM certificates c JOIN users u ON u.id = c.user_id ${where}`, cp
    )
    res.json({ certificates: rows, total: parseInt(cr[0].count) })
  } catch (err) { next(err) }
})

// ─── Question Flags ───────────────────────────────────────────────────────────

// GET /api/admin/flags?status=open&page=&limit=
router.get('/flags', async (req, res, next) => {
  try {
    const { status = 'open' } = req.query
    const { size, offset } = pageParams(req.query)
    const { rows } = await pool.query(`
      SELECT qf.id, qf.question_id, qf.question_stem, qf.flag_reason, qf.status,
             qf.admin_note, qf.created_at, qf.reviewed_at,
             u.full_name AS user_name, u.email AS user_email,
             es.track
      FROM question_flags qf
      JOIN users         u  ON u.id  = qf.user_id
      JOIN exam_sessions es ON es.id = qf.exam_session_id
      WHERE qf.status = $1
      ORDER BY qf.created_at DESC
      LIMIT $2 OFFSET $3
    `, [status, size, offset])
    const { rows: cr } = await pool.query(
      'SELECT COUNT(*) FROM question_flags WHERE status = $1', [status]
    )
    res.json({ flags: rows, total: parseInt(cr[0].count) })
  } catch (err) { next(err) }
})

// PATCH /api/admin/flags/:id
router.patch('/flags/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const { status, admin_note } = req.body
    if (!['reviewed', 'dismissed', 'escalated'].includes(status)) {
      return res.status(400).json({ error: 'status must be reviewed | dismissed | escalated' })
    }
    const { rows } = await pool.query(`
      UPDATE question_flags
      SET status = $1, admin_note = $2, reviewed_by = $3, reviewed_at = NOW()
      WHERE id = $4
      RETURNING id, status, admin_note, reviewed_at
    `, [status, admin_note || null, req.user.sub, id])
    if (!rows.length) return res.status(404).json({ error: 'Flag not found.' })
    await auditLog(req.user.sub, `flag_${status}`, 'question_flag', id, { admin_note }, req.ip)
    res.json({ message: 'Flag updated.', flag: rows[0] })
  } catch (err) { next(err) }
})

// ─── Certificates: revoke ─────────────────────────────────────────────────────

// POST /api/admin/certificates/:id/revoke
router.post('/certificates/:id/revoke', async (req, res, next) => {
  try {
    const { id }  = req.params
    const { reason = 'Revoked by administrator' } = req.body
    const adminId = req.user.sub

    const { revokeCertificate } = require('../services/certificateService')
    const cert = await revokeCertificate(id, adminId, reason)

    await auditLog(adminId, 'revoke_certificate', 'certificate', id, { reason }, req.ip)

    const { sendRevocationEmail } = require('../services/emailService')
    pool.query('SELECT email FROM users WHERE id = $1', [cert.user_id])
      .then(({ rows }) => {
        if (rows.length) return sendRevocationEmail(rows[0].email, cert.full_name, cert.certificate_id, reason)
      })
      .catch(err => console.error('[Admin] revocation email failed:', err.message))

    res.json({ message: 'Certificate revoked.', certificateId: cert.certificate_id, revokedAt: cert.revoked_at })
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.message })
    next(err)
  }
})

// ─── Question Bank ────────────────────────────────────────────────────────────

// GET /api/admin/questions?track=&domain=&difficulty=&retired=false&search=
router.get('/questions', async (req, res, next) => {
  try {
    const { track, domain, difficulty, retired = 'false', search } = req.query
    const { size, offset } = pageParams(req.query)
    const params = []
    const conds  = []

    conds.push(retired === 'true' ? 'bq.retired = TRUE' : 'bq.retired = FALSE')
    if (track)      { params.push(track);         conds.push(`bq.track = $${params.length}`) }
    if (domain)     { params.push(domain);        conds.push(`bq.domain = $${params.length}`) }
    if (difficulty) { params.push(difficulty);    conds.push(`bq.difficulty = $${params.length}`) }
    if (search)     { params.push(`%${search}%`); conds.push(`bq.stem ILIKE $${params.length}`) }

    const where = 'WHERE ' + conds.join(' AND ')
    params.push(size, offset)
    const pL = params.length - 1, pO = params.length

    const { rows } = await pool.query(`
      SELECT bq.id, bq.question_id, bq.track, bq.thread, bq.domain, bq.stem,
             bq.options, bq.correct_option, bq.explanation, bq.clause_ref,
             bq.difficulty, bq.times_used, bq.retired, bq.source, bq.tags,
             bq.created_at, bq.updated_at
      FROM buffer_questions bq
      ${where}
      ORDER BY bq.track ASC, bq.domain ASC, bq.question_id ASC
      LIMIT $${pL} OFFSET $${pO}
    `, params)

    const cp = params.slice(0, -2)
    const { rows: cr } = await pool.query(`SELECT COUNT(*) FROM buffer_questions bq ${where}`, cp)
    res.json({ questions: rows, total: parseInt(cr[0].count) })
  } catch (err) { next(err) }
})

// POST /api/admin/questions
router.post('/questions', async (req, res, next) => {
  try {
    const { question_id, track, thread = 1, domain = 'General', stem, options,
            correct_option, explanation, clause_ref = '', difficulty = 'medium',
            source = '', tags = [] } = req.body

    if (!track || !stem || !options || !correct_option || !explanation) {
      return res.status(400).json({ error: 'track, stem, options, correct_option, explanation are required.' })
    }
    if (!['A','B','C','D'].includes(correct_option)) {
      return res.status(400).json({ error: 'correct_option must be A, B, C or D.' })
    }

    const crypto = require('crypto')
    const stem_hash = crypto.createHash('sha256').update(stem.toLowerCase().trim()).digest('hex')
    const qid = question_id || `${track.charAt(0).toUpperCase()}-T${thread}-${Date.now()}`

    const { rows } = await pool.query(`
      INSERT INTO buffer_questions
        (question_id, track, thread, domain, stem, options, correct_option,
         explanation, clause_ref, difficulty, stem_hash, source, tags, added_by)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)
      RETURNING *
    `, [qid, track, thread, domain, stem, JSON.stringify(options), correct_option,
        explanation, clause_ref, difficulty, stem_hash, source, tags, req.user.sub])

    await auditLog(req.user.sub, 'add_question', 'question', rows[0].id, { question_id: qid, track }, req.ip)
    res.status(201).json({ message: 'Question added.', question: rows[0] })
  } catch (err) { next(err) }
})

// PATCH /api/admin/questions/:id
router.patch('/questions/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const allowed = ['stem','options','correct_option','explanation','clause_ref','difficulty','domain','source','tags']
    const fields  = Object.keys(req.body).filter(k => allowed.includes(k))
    if (!fields.length) return res.status(400).json({ error: 'Nothing to update.' })

    const params = []
    const sets   = fields.map(f => {
      params.push(f === 'options' ? JSON.stringify(req.body[f]) : req.body[f])
      return `${f} = $${params.length}`
    })
    params.push(id)

    const { rows } = await pool.query(
      `UPDATE buffer_questions SET ${sets.join(', ')}, updated_at = NOW()
       WHERE id = $${params.length} AND retired = FALSE
       RETURNING *`,
      params
    )
    if (!rows.length) return res.status(404).json({ error: 'Question not found or already retired.' })
    await auditLog(req.user.sub, 'edit_question', 'question', id, { fields }, req.ip)
    res.json({ message: 'Question updated.', question: rows[0] })
  } catch (err) { next(err) }
})

// DELETE /api/admin/questions/:id  (soft-retire)
router.delete('/questions/:id', async (req, res, next) => {
  try {
    const { id } = req.params
    const { rows } = await pool.query(
      'UPDATE buffer_questions SET retired = TRUE, updated_at = NOW() WHERE id = $1 RETURNING id, question_id',
      [id]
    )
    if (!rows.length) return res.status(404).json({ error: 'Question not found.' })
    await auditLog(req.user.sub, 'retire_question', 'question', id, { question_id: rows[0].question_id }, req.ip)
    res.json({ message: 'Question retired.', questionId: rows[0].question_id })
  } catch (err) { next(err) }
})

// ─── KPIs ─────────────────────────────────────────────────────────────────────

// GET /api/admin/kpis
router.get('/kpis', async (req, res, next) => {
  try {
    const [users, sessions, certs, chart, questions, flags] = await Promise.all([
      pool.query(`
        SELECT
          COUNT(*)                                            AS total,
          COUNT(*) FILTER (WHERE email_verified = TRUE)      AS verified,
          COUNT(*) FILTER (WHERE blocked = TRUE)             AS blocked,
          COUNT(*) FILTER (WHERE created_at >= CURRENT_DATE) AS today
        FROM users WHERE deleted_at IS NULL
      `),
      pool.query(`
        SELECT
          COUNT(*) AS total,
          COUNT(*) FILTER (WHERE status = 'active')                                           AS active,
          COUNT(*) FILTER (WHERE status = 'completed')                                        AS completed,
          COUNT(*) FILTER (WHERE suspicious = TRUE)                                           AS suspicious,
          COUNT(*) FILTER (WHERE status='completed' AND track='associate')                    AS assoc_total,
          COUNT(*) FILTER (WHERE status='completed' AND track='associate'    AND passed=TRUE) AS assoc_passed,
          COUNT(*) FILTER (WHERE status='completed' AND track='professional')                 AS prof_total,
          COUNT(*) FILTER (WHERE status='completed' AND track='professional' AND passed=TRUE) AS prof_passed,
          ROUND(AVG(score) FILTER (WHERE status='completed' AND track='associate'),    1)     AS assoc_avg_score,
          ROUND(AVG(score) FILTER (WHERE status='completed' AND track='professional'), 1)     AS prof_avg_score
        FROM exam_sessions
      `),
      pool.query(`SELECT COUNT(*) AS total, COUNT(*) FILTER (WHERE revoked = FALSE) AS active FROM certificates`),
      pool.query(`
        SELECT DATE(created_at) AS day, COUNT(*) AS count
        FROM exam_sessions
        WHERE created_at >= NOW() - INTERVAL '30 days'
        GROUP BY DATE(created_at) ORDER BY day ASC
      `),
      pool.query(`SELECT COUNT(*) AS total, COUNT(*) FILTER (WHERE retired = FALSE) AS active FROM buffer_questions`),
      pool.query(`SELECT COUNT(*) AS open FROM question_flags WHERE status = 'open'`),
    ])
    res.json({
      users:     users.rows[0],
      sessions:  sessions.rows[0],
      certs:     certs.rows[0],
      chart:     chart.rows,
      questions: questions.rows[0],
      flags:     flags.rows[0],
    })
  } catch (err) { next(err) }
})

// ─── Audit Log ────────────────────────────────────────────────────────────────

// GET /api/admin/audit-log?action=&target_type=&page=&limit=
router.get('/audit-log', async (req, res, next) => {
  try {
    const { action, target_type } = req.query
    const { size, offset } = pageParams(req.query)
    const params = []
    const conds  = []

    if (action)      { params.push(action);      conds.push(`al.action = $${params.length}`) }
    if (target_type) { params.push(target_type); conds.push(`al.target_type = $${params.length}`) }

    const where = conds.length ? 'WHERE ' + conds.join(' AND ') : ''
    params.push(size, offset)
    const pL = params.length - 1, pO = params.length

    const { rows } = await pool.query(`
      SELECT al.id, al.action, al.target_type, al.target_id, al.metadata,
             al.ip_address, al.created_at,
             u.full_name AS admin_name, u.email AS admin_email
      FROM admin_audit_log al
      JOIN users u ON u.id = al.admin_id
      ${where}
      ORDER BY al.created_at DESC
      LIMIT $${pL} OFFSET $${pO}
    `, params)

    const cp = params.slice(0, -2)
    const { rows: cr } = await pool.query(
      `SELECT COUNT(*) FROM admin_audit_log al JOIN users u ON u.id = al.admin_id ${where}`, cp
    )
    res.json({ logs: rows, total: parseInt(cr[0].count) })
  } catch (err) { next(err) }
})

module.exports = router
