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
    res.status(501).json({ message: 'Not implemented yet' })
  } catch (err) { next(err) }
})

// GET /api/admin/kpis
router.get('/kpis', async (req, res, next) => {
  try {
    res.status(501).json({ message: 'Not implemented yet' })
  } catch (err) { next(err) }
})

module.exports = router
