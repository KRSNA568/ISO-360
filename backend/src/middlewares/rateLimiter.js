/**
 * rateLimiter.js
 * express-rate-limit instances for auth endpoints.
 *
 * otpEmailBurst  — max 3 OTP requests per email per hour (checked in-route via Redis)
 * authLimiter    — general: 20 attempts per 15 min per IP (login, register)
 * otpIpLimiter   — strict: 10 OTP requests per 15 min per IP
 */
const rateLimit = require('express-rate-limit')

// In the test environment skip all rate limiting so the integration
// test suite can run multiple times without hitting the in-memory counter.
const IS_TEST = process.env.NODE_ENV === 'test'
const noLimit = (_req, _res, next) => next()

// ── General auth rate limit (login, register) — 20 req / 15 min per IP ───────
const authLimiter = IS_TEST ? noLimit : rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' },
  keyGenerator: (req) => req.ip,
})

// ── OTP send rate limit — 10 req / 15 min per IP ─────────────────────────────
const otpIpLimiter = IS_TEST ? noLimit : rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many OTP requests from this IP. Try again later.' },
  keyGenerator: (req) => req.ip,
})

// ── Password reset rate limit — 5 req / 60 min per IP ─────────────────────────
const resetLimiter = IS_TEST ? noLimit : rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many password reset requests. Try again in an hour.' },
})

// ── Session create rate limit — 10 creates / hour per user ─────────────────────
const sessionCreateLimiter = IS_TEST ? noLimit : rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many exam sessions created. Try again in an hour.' },
  keyGenerator: (req) => req.user?.sub || req.ip,
})

// ── Refresh token rate limit — 30 req / 15 min per IP ─────────────────────────
const refreshLimiter = IS_TEST ? noLimit : rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many token refresh requests. Please try again later.' },
  keyGenerator: (req) => req.ip,
})

// ── Admin write rate limit — 60 mutations / 15 min per admin ──────────────────
const adminWriteLimiter = IS_TEST ? noLimit : rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many admin write requests. Slow down.' },
  keyGenerator: (req) => req.user?.sub || req.ip,
})

module.exports = { authLimiter, otpIpLimiter, resetLimiter, sessionCreateLimiter, refreshLimiter, adminWriteLimiter }
