/**
 * rateLimiter.js
 * express-rate-limit instances for auth endpoints.
 *
 * otpEmailBurst  — max 3 OTP requests per email per hour (checked in-route via Redis)
 * authLimiter    — general: 20 attempts per 15 min per IP (login, register)
 * otpIpLimiter   — strict: 10 OTP requests per 15 min per IP
 */
const rateLimit = require('express-rate-limit')

// ── General auth rate limit (login, register) — 20 req / 15 min per IP ───────
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again later.' },
  keyGenerator: (req) => req.ip,
})

// ── OTP send rate limit — 10 req / 15 min per IP ─────────────────────────────
const otpIpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many OTP requests from this IP. Try again later.' },
  keyGenerator: (req) => req.ip,
})

// ── Password reset rate limit — 5 req / 60 min per IP ────────────────────────
const resetLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many password reset requests. Try again in an hour.' },
})

module.exports = { authLimiter, otpIpLimiter, resetLimiter }
