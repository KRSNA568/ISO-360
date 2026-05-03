/**
 * purge.js — scheduled data-retention jobs
 *
 * Hard-delete users (and cascade) that were soft-deleted > 90 days ago.
 * Also prunes expired refresh tokens and stale OTPs.
 *
 * Intended to be called by the scheduler in server.js (or a cron service).
 * Safe to run multiple times concurrently — all deletes are idempotent.
 */

const pool   = require('../config/db')
const logger = require('../lib/logger')

const HARD_DELETE_GRACE_DAYS = 90

async function purgeDeletedUsers() {
  const cutoff = new Date(Date.now() - HARD_DELETE_GRACE_DAYS * 24 * 60 * 60 * 1000)
  const { rowCount } = await pool.query(
    `DELETE FROM users WHERE deleted_at IS NOT NULL AND deleted_at < $1`,
    [cutoff],
  )
  if (rowCount > 0) {
    logger.info({ deletedCount: rowCount, job: 'purgeDeletedUsers' }, 'Hard-deleted soft-deleted users')
  }
  return rowCount
}

async function purgeExpiredRefreshTokens() {
  const { rowCount } = await pool.query(
    `DELETE FROM refresh_tokens WHERE expires_at < NOW()`,
  )
  if (rowCount > 0) {
    logger.info({ deletedCount: rowCount, job: 'purgeExpiredRefreshTokens' }, 'Pruned expired refresh tokens')
  }
  return rowCount
}

async function purgeExpiredOtps() {
  // Keep OTPs for 24 hours after expiry for audit trail, then hard-delete
  const { rowCount } = await pool.query(
    `DELETE FROM otps WHERE expires_at < NOW() - INTERVAL '24 hours'`,
  )
  if (rowCount > 0) {
    logger.info({ deletedCount: rowCount, job: 'purgeExpiredOtps' }, 'Pruned expired OTP records')
  }
  return rowCount
}

async function runAllPurgeJobs() {
  logger.info('Starting scheduled purge jobs')
  try {
    await Promise.all([
      purgeDeletedUsers(),
      purgeExpiredRefreshTokens(),
      purgeExpiredOtps(),
    ])
    logger.info('Purge jobs completed')
  } catch (err) {
    logger.error({ err }, 'Purge job failed')
  }
}

module.exports = { runAllPurgeJobs, purgeDeletedUsers, purgeExpiredRefreshTokens, purgeExpiredOtps }
