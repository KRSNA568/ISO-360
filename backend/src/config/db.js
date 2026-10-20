const { Pool } = require('pg')
const { resolveSslConfig } = require('./dbSsl')

const ssl = resolveSslConfig()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000,
})

if (ssl === false && process.env.NODE_ENV !== 'test') {
  console.warn('⚠  Postgres: connecting without SSL — local development only')
}

pool.on('error', (err) => {
  console.error('PostgreSQL pool error:', err)
})

module.exports = pool
