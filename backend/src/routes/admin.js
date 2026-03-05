const router  = require('express').Router()
const { authenticate } = require('../middlewares/authenticate')
const { requireAdmin } = require('../middlewares/requireAdmin')

router.use(authenticate, requireAdmin)

// GET /api/admin/users
router.get('/users', async (req, res, next) => {
  try {
    // TODO: Phase 6
    res.status(501).json({ message: 'Not implemented yet' })
  } catch (err) { next(err) }
})

// POST /api/admin/users/:id/block
router.post('/users/:id/block', async (req, res, next) => {
  try {
    res.status(501).json({ message: 'Not implemented yet' })
  } catch (err) { next(err) }
})

// GET /api/admin/sessions
router.get('/sessions', async (req, res, next) => {
  try {
    res.status(501).json({ message: 'Not implemented yet' })
  } catch (err) { next(err) }
})

// GET /api/admin/flags
router.get('/flags', async (req, res, next) => {
  try {
    res.status(501).json({ message: 'Not implemented yet' })
  } catch (err) { next(err) }
})

// POST /api/admin/certificates/:id/revoke
router.post('/certificates/:id/revoke', async (req, res, next) => {
  try {
    const { id } = req.params                          // certificate_id string OR uuid
    const { reason = 'Revoked by administrator' } = req.body
    const adminUserId = req.user.sub

    const { revokeCertificate } = require('../services/certificateService')
    const cert = await revokeCertificate(id, adminUserId, reason)

    // Send revocation email async (non-blocking)
    const pool = require('../config/db')
    const { sendRevocationEmail } = require('../services/emailService')
    pool.query('SELECT email FROM users WHERE id = $1', [cert.user_id])
      .then(({ rows }) => {
        if (rows.length > 0) {
          return sendRevocationEmail(rows[0].email, cert.full_name, cert.certificate_id, reason)
        }
      })
      .catch(err => console.error('[Admin] revocation email failed:', err.message))

    return res.json({
      message:       'Certificate revoked.',
      certificateId: cert.certificate_id,
      revokedAt:     cert.revoked_at,
      revokedReason: cert.revoked_reason,
    })
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.message })
    next(err)
  }
})

// GET /api/admin/kpis
router.get('/kpis', async (req, res, next) => {
  try {
    res.status(501).json({ message: 'Not implemented yet' })
  } catch (err) { next(err) }
})

module.exports = router
