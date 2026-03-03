/**
 * @file utils.js
 * Pure utility functions shared by frontend and backend.
 */

const crypto = typeof window !== 'undefined'
  ? { subtle: window.crypto.subtle }
  : require('crypto')

/**
 * Generate a certificate ID in format ISO27-2026-XXXXXXXX (8 uppercase hex chars).
 * @returns {string}
 */
function generateCertificateId() {
  const hex = Math.random().toString(16).substring(2, 10).toUpperCase().padEnd(8, '0')
  return `ISO27-2026-${hex}`
}

/**
 * Formats a score + pass threshold into a human-readable string.
 * @param {number} score
 * @param {number} total
 * @returns {string}  e.g. "42 / 50 (84%)"
 */
function formatScore(score, total = 50) {
  const pct = Math.round((score / total) * 100)
  return `${score} / ${total} (${pct}%)`
}

/**
 * Converts milliseconds into mm:ss string.
 * @param {number} ms
 * @returns {string}
 */
function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

/**
 * Returns how many seconds remain on a timer.
 * @param {string|Date} expiresAt  — ISO date string or Date
 * @param {string|Date} [serverNow] — if provided, use this as "now" (for drift correction)
 * @returns {number}  seconds remaining (min 0)
 */
function getRemainingSeconds(expiresAt, serverNow) {
  const expMs  = new Date(expiresAt).getTime()
  const nowMs  = serverNow ? new Date(serverNow).getTime() : Date.now()
  return Math.max(0, Math.floor((expMs - nowMs) / 1000))
}

/**
 * Checks whether a retake is allowed given the attempt history.
 * @param {Array<{created_at: string, track: string}>} attempts - sorted newest first
 * @param {string} track
 * @param {{ MAX_ATTEMPTS_PER_30_DAYS: number, COOLDOWN_HOURS: number }} policy
 * @returns {{ allowed: boolean, reason?: string, cooldown_remaining_s?: number }}
 */
function checkRetakeEligibility(attempts, track, policy) {
  const { MAX_ATTEMPTS_PER_30_DAYS, COOLDOWN_HOURS } = policy
  const now = Date.now()
  const window30d = 30 * 24 * 60 * 60 * 1000
  const cooldownMs = COOLDOWN_HOURS * 60 * 60 * 1000

  const trackAttempts = attempts.filter((a) => a.track === track)
  const recentAttempts = trackAttempts.filter(
    (a) => now - new Date(a.created_at).getTime() < window30d
  )

  if (recentAttempts.length >= MAX_ATTEMPTS_PER_30_DAYS) {
    return { allowed: false, reason: 'max_attempts_reached' }
  }

  if (trackAttempts.length > 0) {
    const lastAttemptMs = new Date(trackAttempts[0].created_at).getTime()
    const elapsed = now - lastAttemptMs
    if (elapsed < cooldownMs) {
      return {
        allowed: false,
        reason: 'cooldown_active',
        cooldown_remaining_s: Math.ceil((cooldownMs - elapsed) / 1000),
      }
    }
  }

  return { allowed: true }
}

module.exports = {
  generateCertificateId,
  formatScore,
  formatDuration,
  getRemainingSeconds,
  checkRetakeEligibility,
}
