const router  = require('express').Router()
const { authenticate } = require('../middlewares/authenticate')

router.use(authenticate)

// POST /api/session/create
router.post('/create', async (req, res, next) => {
  try {
    // TODO: Phase 2
    res.status(501).json({ message: 'Not implemented yet' })
  } catch (err) { next(err) }
})

// GET /api/session/:id/status
router.get('/:id/status', async (req, res, next) => {
  try {
    res.status(501).json({ message: 'Not implemented yet' })
  } catch (err) { next(err) }
})

// POST /api/session/:id/start
router.post('/:id/start', async (req, res, next) => {
  try {
    // TODO: Phase 3
    res.status(501).json({ message: 'Not implemented yet' })
  } catch (err) { next(err) }
})

// POST /api/session/:id/answer
router.post('/:id/answer', async (req, res, next) => {
  try {
    res.status(501).json({ message: 'Not implemented yet' })
  } catch (err) { next(err) }
})

// POST /api/session/:id/heartbeat
router.post('/:id/heartbeat', async (req, res, next) => {
  try {
    res.status(501).json({ message: 'Not implemented yet' })
  } catch (err) { next(err) }
})

module.exports = router
