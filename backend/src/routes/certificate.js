const router  = require('express').Router()
const { authenticate } = require('../middlewares/authenticate')
const pool = require('../config/db')

// ── GET /api/certificates/verify/:certId  (PUBLIC — no auth) ─────────────────
// Used by the public VerifyPage and QR code scans.
router.get('/verify/:certId', async (req, res, next) => {
  try {
    const { certId } = req.params

    const { rows } = await pool.query(
      `SELECT certificate_id, full_name, track, score, awarded_on,
              revoked, revoked_reason, revoked_at
       FROM certificates
       WHERE certificate_id = $1`,
      [certId]
    )

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Certificate not found.' })
    }

    const cert = rows[0]
    return res.json({
      certificateId: cert.certificate_id,
      fullName:      cert.full_name,
      track:         cert.track,
      trackLabel:    cert.track === 'associate'
                       ? 'Associate — ISMS Foundation'
                       : 'Professional — Lead Auditor',
      score:         cert.score,
      awardedOn:     cert.awarded_on,
      valid:         !cert.revoked,
      revoked:       cert.revoked,
      revokedReason: cert.revoked_reason || null,
      revokedAt:     cert.revoked_at     || null,
    })
  } catch (err) { next(err) }
})

// ── GET /api/certificates/:certId  (authenticated) ───────────────────────────
// Returns the full cert record including image URLs for the results page.
router.get('/:certId', authenticate, async (req, res, next) => {
  try {
    const { certId } = req.params
    const userId = req.user.sub

    const { rows } = await pool.query(
      `SELECT c.*
       FROM certificates c
       WHERE c.certificate_id = $1
         AND c.user_id = $2`,
      [certId, userId]
    )

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Certificate not found.' })
    }

    const c = rows[0]
    return res.json({
      certificateId:    c.certificate_id,
      fullName:         c.full_name,
      track:            c.track,
      trackLabel:       c.track === 'associate'
                          ? 'Associate — ISMS Foundation'
                          : 'Professional — Lead Auditor',
      score:            c.score,
      awardedOn:        c.awarded_on,
      valid:            !c.revoked,
      revoked:          c.revoked,
      revokedReason:    c.revoked_reason || null,
      landscapeUrl:     c.r2_url_landscape || null,
      squareUrl:        c.r2_url_square    || null,
      examSessionId:    c.exam_session_id,
    })
  } catch (err) { next(err) }
})

module.exports = router
