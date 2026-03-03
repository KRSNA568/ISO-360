require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') })
const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000,
  idleTimeoutMillis: 5000,
})

pool
  .query('SELECT current_database(), current_user, version()')
  .then(r => {
    const row = r.rows[0]
    console.log('✅ Connected!')
    console.log('   DB:  ', row.current_database)
    console.log('   User:', row.current_user)
    console.log('   PG:  ', row.version.split(' ').slice(0, 2).join(' '))
    pool.end()
  })
  .catch(e => {
    console.error('❌ Connection failed:', e.message)
    console.error('   DATABASE_URL set?', !!process.env.DATABASE_URL)
    console.error('   URL preview:', process.env.DATABASE_URL?.replace(/:([^:@]{3})[^:@]*@/, ':***@'))
    process.exit(1)
  })
