const router  = require('express').Router()
const { authenticate } = require('../middlewares/authenticate')

// GET /api/results/:sessionId  (protected)
router.get('/:sessionId', authenticate, async (req, res, next) => {
  try {
    // TODO: Phase 4
    res.status(501).json({ message: 'Not implemented yet' })
  } catch (err) { next(err) }
})

// POST /api/questions/:qId/flag  (protected)
router.post('/questions/:qId/flag', authenticate, async (req, res, next) => {
  try {
    res.status(501).json({ message: 'Not implemented yet' })
  } catch (err) { next(err) }
})

module.exports = router
