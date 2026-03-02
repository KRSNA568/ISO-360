const router = require('express').Router()

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
  try {
    // TODO: Phase 1 — validate body, create user, send OTP
    res.status(501).json({ message: 'Not implemented yet' })
  } catch (err) { next(err) }
})

// POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res, next) => {
  try {
    // TODO: Phase 1 — validate OTP, issue JWT
    res.status(501).json({ message: 'Not implemented yet' })
  } catch (err) { next(err) }
})

// POST /api/auth/resend-otp
router.post('/resend-otp', async (req, res, next) => {
  try {
    res.status(501).json({ message: 'Not implemented yet' })
  } catch (err) { next(err) }
})

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    res.status(501).json({ message: 'Not implemented yet' })
  } catch (err) { next(err) }
})

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res, next) => {
  try {
    res.status(501).json({ message: 'Not implemented yet' })
  } catch (err) { next(err) }
})

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res, next) => {
  try {
    res.status(501).json({ message: 'Not implemented yet' })
  } catch (err) { next(err) }
})

module.exports = router
