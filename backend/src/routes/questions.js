const express  = require('express')
const pool     = require('../config/db')
const { authenticate } = require('../middlewares/authenticate')

const router = express.Router()

router.use(authenticate)

// ── POST /api/questions/:id/flag ─────────────────────────────────────────────
// User reports an inaccuracy on a question from the results review.
// Body: { sessionId, questionStem, reason? }
router.post('/:questionId/flag', async (req, res, next) => {
  try {
    const { questionId }                  = req.params
    const { sessionId, questionStem = '', reason = 'Inaccuracy reported by candidate' } = req.body
    const userId = req.user.sub

    if (!sessionId) {
      return res.status(400).json({ error: 'sessionId is required.' })
    }

    // Verify the session belongs to this user
    const { rows: sessionRows } = await pool.query(
      `SELECT id FROM exam_sessions WHERE id = $1 AND user_id = $2 AND status = 'completed'`,
      [sessionId, userId],
    )
    if (sessionRows.length === 0) {
      return res.status(404).json({ error: 'Session not found or not completed.' })
    }

    // Prevent duplicate flags from the same user on the same question+session
    const { rows: existing } = await pool.query(
      `SELECT id FROM question_flags WHERE exam_session_id = $1 AND user_id = $2 AND question_id = $3`,
      [sessionId, userId, questionId],
    )
    if (existing.length > 0) {
      return res.json({ ok: true, duplicate: true })
    }

    await pool.query(
      `INSERT INTO question_flags (exam_session_id, user_id, question_id, question_stem, flag_reason)
       VALUES ($1, $2, $3, $4, $5)`,
      [sessionId, userId, questionId, questionStem.slice(0, 1000), reason.slice(0, 500)],
    )

    console.log(`[Flag] ℹ  ${questionId} flagged by user ${userId} in session ${sessionId}`)
    return res.json({ ok: true })
  } catch (err) { next(err) }
})

module.exports = router
