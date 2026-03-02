const router  = require('express').Router()
const { authenticate } = require('../middlewares/authenticate')

router.use(authenticate)

// GET /api/user/me
router.get('/me', async (req, res, next) => {
  try {
    // TODO: Phase 1
    res.status(501).json({ message: 'Not implemented yet' })
  } catch (err) { next(err) }
})

// PATCH /api/user/me
router.patch('/me', async (req, res, next) => {
  try {
    res.status(501).json({ message: 'Not implemented yet' })
  } catch (err) { next(err) }
})

// DELETE /api/user/me
router.delete('/me', async (req, res, next) => {
  try {
    res.status(501).json({ message: 'Not implemented yet' })
  } catch (err) { next(err) }
})

// GET /api/user/attempts
router.get('/attempts', async (req, res, next) => {
  try {
    res.status(501).json({ message: 'Not implemented yet' })
  } catch (err) { next(err) }
})

module.exports = router
