require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') })
const app  = require('./app')
const pool = require('./config/db')

const PORT = process.env.PORT || 5000

const server = app.listen(PORT, () => {
  console.log(`\n🚀  27001certified API running on http://localhost:${PORT}`)
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}\n`)
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
