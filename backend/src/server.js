// Load .env only in local dev/test — Render & production inject env vars natively
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') })
}
const app  = require('./app')
const pool = require('./config/db')
const { runAllPurgeJobs } = require('./jobs/purge')

// Fail fast if critical secrets are missing or too short
;['JWT_SECRET', 'REFRESH_TOKEN_SECRET'].forEach((key) => {
  if (!process.env[key] || process.env[key].length < 32) {
    console.error(`[server] FATAL: ${key} is missing or shorter than 32 characters. Refusing to start.`)
    process.exit(1)
  }
})

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => {
  console.log(`\n🚀  27001certified API running on http://localhost:${PORT}`)
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}\n`)

  // Run purge jobs once on start, then every 24 hours
  if (process.env.NODE_ENV !== 'test') {
    runAllPurgeJobs()
    setInterval(runAllPurgeJobs, 24 * 60 * 60 * 1000)
  }
})

// ── Graceful shutdown ────────────────────────────────────────────────────────
function shutdown(signal) {
  console.log(`\n[server] ${signal} received — shutting down gracefully…`)
  server.close(async () => {
    try { await pool.end() } catch { /* ignore */ }
    console.log('[server] All connections closed. Bye.')
    process.exit(0)
  })
  // Force-exit if graceful close takes longer than 10 s
  setTimeout(() => { console.error('[server] Forced exit after timeout.'); process.exit(1) }, 10_000)
}

process.on('SIGTERM', () => shutdown('SIGTERM'))
process.on('SIGINT',  () => shutdown('SIGINT'))
