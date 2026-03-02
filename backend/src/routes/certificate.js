const router  = require('express').Router()
const { authenticate } = require('../middlewares/authenticate')

// GET /api/certificates/verify/:certId  (PUBLIC — no auth)
router.get('/verify/:certId', async (req, res, next) => {
  try {
    // TODO: Phase 5
    res.status(501).json({ message: 'Not implemented yet' })
  } catch (err) { next(err) }
})

// GET /api/certificates/:certId  (protected)
router.get('/:certId', authenticate, async (req, res, next) => {
  try {
    res.status(501).json({ message: 'Not implemented yet' })
  } catch (err) { next(err) }
})

module.exports = router
