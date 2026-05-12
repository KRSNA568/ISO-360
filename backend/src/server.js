// Load .env only in local dev/test — Render & production inject env vars natively
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') })
}
const fs   = require('fs')
const path = require('path')
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

// ── Auto-migrate at startup ──────────────────────────────────────────────────
async function runMigrations() {
  const client = await pool.connect()
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS _migrations (
        id SERIAL PRIMARY KEY, filename TEXT UNIQUE NOT NULL,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `)
    const dir   = path.join(__dirname, 'db/migrations')
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.sql')).sort()
    for (const file of files) {
      const { rows } = await client.query('SELECT id FROM _migrations WHERE filename = $1', [file])
      if (rows.length > 0) { continue }
      const sql = fs.readFileSync(path.join(dir, file), 'utf8')
      await client.query('BEGIN')
      try {
        await client.query(sql)
        await client.query('INSERT INTO _migrations (filename) VALUES ($1)', [file])
        await client.query('COMMIT')
        console.log(`[migrate] ✅ Applied: ${file}`)
      } catch (err) {
        await client.query('ROLLBACK')
        console.error(`[migrate] ❌ Failed: ${file}`, err.message)
        throw err
      }
    }
  } finally {
    client.release()
  }
}

const PORT = process.env.PORT || 5000

runMigrations()
  .then(() => {
    const server = app.listen(PORT, () => {
      console.log(`\n🚀  27001certified API running on http://localhost:${PORT}`)
      console.log(`   Environment: ${process.env.NODE_ENV || 'development'}\n`)

      // Run purge jobs once on start, then every 24 hours
      if (process.env.NODE_ENV !== 'test') {
        runAllPurgeJobs()
        setInterval(runAllPurgeJobs, 24 * 60 * 60 * 1000)
      }
    })

    // ── Graceful shutdown ──────────────────────────────────────────────────
    function shutdown(signal) {
      console.log(`\n[server] ${signal} received — shutting down gracefully…`)
      server.close(async () => {
        try { await pool.end() } catch { /* ignore */ }
        console.log('[server] All connections closed. Bye.')
        process.exit(0)
      })
      setTimeout(() => { console.error('[server] Forced exit after timeout.'); process.exit(1) }, 10_000)
    }
    process.on('SIGTERM', () => shutdown('SIGTERM'))
    process.on('SIGINT',  () => shutdown('SIGINT'))
  })
  .catch(err => {
    console.error('[migrate] Fatal — refusing to start:', err.message)
    process.exit(1)
  })

