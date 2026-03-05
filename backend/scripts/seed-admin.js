/**
 * seed-admin.js
 * Creates the initial admin user.
 * Run: node scripts/seed-admin.js
 *
 * Reads credentials from env vars or CLI args:
 *   ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME
 *
 * Can also be invoked as:
 *   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD=secret node scripts/seed-admin.js
 */
require('dotenv').config()
const { Pool } = require('pg')
const bcrypt = require('bcryptjs')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
})

async function seedAdmin() {
  const email    = process.env.ADMIN_EMAIL    || 'admin@iso-audit360.com'
  const password = process.env.ADMIN_PASSWORD || 'ChangeMe!2026'
  const name     = process.env.ADMIN_NAME     || 'Platform Admin'

  if (password === 'ChangeMe!2026') {
    console.warn('⚠  Using default password. Set ADMIN_PASSWORD in .env before using in production.')
  }

  const client = await pool.connect()
  try {
    const passwordHash = await bcrypt.hash(password, 12)

    // Upsert: insert new admin OR promote existing user to admin and update password
    const result = await client.query(
      `INSERT INTO users (full_name, email, password_hash, email_verified, role)
       VALUES ($1, $2, $3, true, 'admin')
       ON CONFLICT (email) DO UPDATE
         SET role          = 'admin',
             email_verified = true,
             password_hash  = EXCLUDED.password_hash,
             full_name      = EXCLUDED.full_name
       RETURNING id, email, role`,
      [name, email, passwordHash]
    )

    const admin = result.rows[0]
    console.log('✅  Admin user ready:')
    console.log(`    ID:    ${admin.id}`)
    console.log(`    Email: ${admin.email}`)
    console.log(`    Role:  ${admin.role}`)
    console.log('\n  ⚠  Store these credentials securely and change the password immediately.')
  } finally {
    client.release()
    await pool.end()
  }
}

seedAdmin().catch((err) => {
  console.error('Seed failed:', err.message)
  process.exit(1)
})
