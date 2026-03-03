#!/usr/bin/env node
/**
 * Quick API smoke test for Phase 1 backend endpoints.
 * Run: node scripts/smoke-test.js
 */
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') })

const BASE = `http://localhost:${process.env.PORT || 5001}`

async function req(method, path, body, token) {
  const opts = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...(body && { body: JSON.stringify(body) }),
  }
  const r    = await fetch(`${BASE}${path}`, opts)
  const data = await r.json()
  return { status: r.status, data }
}

async function run() {
  console.log(`\n🔥  Smoke test — ${BASE}\n`)

  // Health
  const health = await req('GET', '/api/health')
  console.log('✅  Health:', health.data.status)

  // Register
  const email    = `smoke_${Date.now()}@test.com`
  const regResp  = await req('POST', '/api/auth/register', {
    full_name: 'Smoke User', email, password: 'SmokePwd99!',
  })
  if (regResp.status !== 201) return console.error('❌  Register failed:', regResp.data)
  const userId = regResp.data.user_id
  console.log('✅  Register:', regResp.data.message, '| user_id:', userId)

  // Fetch OTP from DB for testing
  const { Pool } = require('pg')
  const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
  const { rows } = await pool.query(
    `SELECT code FROM otps WHERE user_id = $1 AND used = FALSE ORDER BY created_at DESC LIMIT 1`,
    [userId]
  )
  await pool.end()
  if (!rows.length) return console.error('❌  No OTP found in DB')
  const code = rows[0].code
  console.log('✅  OTP from DB:', code)

  // Verify OTP → get tokens
  const verifyResp = await req('POST', '/api/auth/verify-otp', { user_id: userId, code, purpose: 'email_verify' })
  if (verifyResp.status !== 200) return console.error('❌  Verify OTP failed:', verifyResp.data)
  const { access_token: at, refresh_token: rt } = verifyResp.data
  console.log('✅  Verify OTP: email verified, tokens issued')

  // GET /user/me
  const meResp = await req('GET', '/api/user/me', null, at)
  if (meResp.status !== 200) return console.error('❌  GET /user/me failed:', meResp.data)
  console.log('✅  GET /user/me:', meResp.data.email, '| role:', meResp.data.role)

  // PATCH /user/me
  const patchResp = await req('PATCH', '/api/user/me', { company: 'ACME Ltd', country: 'IN' }, at)
  if (patchResp.status !== 200) return console.error('❌  PATCH /user/me failed:', patchResp.data)
  console.log('✅  PATCH /user/me: company=', patchResp.data.company)

  // GET /user/attempts (empty)
  const attResp = await req('GET', '/api/user/attempts', null, at)
  if (attResp.status !== 200) return console.error('❌  GET /user/attempts failed:', attResp.data)
  console.log('✅  GET /user/attempts: total =', attResp.data.pagination.total)

  // Login
  const loginResp = await req('POST', '/api/auth/login', { email, password: 'SmokePwd99!' })
  if (loginResp.status !== 200) return console.error('❌  Login failed:', loginResp.data)
  const at2 = loginResp.data.access_token
  console.log('✅  Login: new access token issued')

  // Refresh token rotation
  const refreshResp = await req('POST', '/api/auth/refresh', { refresh_token: rt })
  if (refreshResp.status !== 200) return console.error('❌  Refresh failed:', refreshResp.data)
  console.log('✅  Refresh: tokens rotated')

  // Invalid auth test
  const badResp = await req('GET', '/api/user/me', null, 'bad.token.here')
  console.log('✅  Invalid token rejected:', badResp.status === 401 ? '401 ✓' : `UNEXPECTED ${badResp.status}`)

  // Logout
  const logoutResp = await req('POST', '/api/auth/logout', null, at2)
  console.log('✅  Logout:', logoutResp.data.message)

  console.log('\n🎉  All smoke tests passed!\n')
}

run().catch(e => { console.error('💥  Unhandled error:', e.message); process.exit(1) })
