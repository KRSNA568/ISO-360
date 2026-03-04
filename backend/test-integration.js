/**
 * Integration test — run with: node test-integration.js
 * Tests: register → verify → login → session lifecycle → scoring flow
 */
require('dotenv').config({ path: require('path').resolve(__dirname, '.env') })
const http = require('http')
const pool = require('./src/config/db')

const EMAIL = `testuser_${Date.now()}@example.com`
const PASS  = 'TestPass123!'

function req(method, path, body, token) {
  return new Promise((resolve) => {
    const data = body ? JSON.stringify(body) : null
    const opts = {
      hostname: 'localhost',
      port:     5001,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(data  ? { 'Content-Length': Buffer.byteLength(data) } : {}),
      },
    }
    const r = http.request(opts, (res) => {
      let raw = ''
      res.on('data', (d) => { raw += d })
      res.on('end', () => {
        try   { resolve({ status: res.statusCode, body: JSON.parse(raw) }) }
        catch { resolve({ status: res.statusCode, body: raw }) }
      })
    })
    r.on('error', (e) => resolve({ error: e.message }))
    if (data) r.write(data)
    r.end()
  })
}

function pass(label, ok, detail = '') {
  const icon = ok ? '✅' : '❌'
  console.log(`  ${icon}  ${label}${detail ? '  →  ' + detail : ''}`)
  if (!ok) process.exitCode = 1
}

;(async () => {
  console.log('\n══════════════════════════════════════════')
  console.log('  ISO-Audit360 Integration Test')
  console.log('══════════════════════════════════════════\n')

  // ── 1. Auth guard ──────────────────────────────────────────────────────────
  console.log('1. Auth guards')
  const noAuth = await req('GET',  '/api/session/history')
  pass('No token → 401',           noAuth.status === 401)

  const badToken = await req('POST', '/api/session/create', { track: 'associate' }, 'bad.token.here')
  pass('Bad token → 401',          badToken.status === 401)

  const badTrack = await req('POST', '/api/session/create', { track: 'expert' })
  pass('No token + bad track → 401', badTrack.status === 401)

  // ── 2. Register ────────────────────────────────────────────────────────────
  console.log('\n2. Register')
  const reg = await req('POST', '/api/auth/register', { email: EMAIL, full_name: 'Test User', password: PASS })
  pass('Register 201',     reg.status === 201, reg.body?.message || reg.body?.error)

  const regDup = await req('POST', '/api/auth/register', { email: EMAIL, full_name: 'Test 2', password: PASS })
  pass('Duplicate register 409', regDup.status === 409)

  // ── 3. Login before verify ─────────────────────────────────────────────────
  console.log('\n3. Login (unverified)')
  const login1 = await req('POST', '/api/auth/login', { email: EMAIL, password: PASS })
  pass('Login → 403 unverified',   login1.status === 403, login1.body?.user_id ? `user_id=${login1.body.user_id}` : login1.body?.error)
  const userId = login1.body?.user_id || reg.body?.user_id

  // ── 4. Verify email OTP ────────────────────────────────────────────────────
  console.log('\n4. Email verification')
  const { rows: otpRows } = await pool.query(
    `SELECT code FROM otps WHERE user_id=$1 AND purpose='email_verify' AND used=FALSE ORDER BY created_at DESC LIMIT 1`,
    [userId],
  )
  const otp = otpRows[0]?.code
  pass('OTP found in DB', !!otp, otp || 'MISSING')

  if (otp) {
    const wrongOtp = await req('POST', '/api/auth/verify-otp', { user_id: userId, code: '000000', purpose: 'email_verify' })
    pass('Wrong OTP → 422/400/401', [422, 400, 401].includes(wrongOtp.status))

    const verify = await req('POST', '/api/auth/verify-otp', { user_id: userId, code: otp, purpose: 'email_verify' })
    pass('Correct OTP → 200',       verify.status === 200, verify.body?.message || verify.body?.error)
  }

  // ── 5. Login after verify ──────────────────────────────────────────────────
  console.log('\n5. Login (verified)')
  const login2 = await req('POST', '/api/auth/login', { email: EMAIL, password: PASS })
  pass('Login 200 + token',         login2.status === 200 && !!login2.body?.access_token)

  const wrongPass = await req('POST', '/api/auth/login', { email: EMAIL, password: 'WrongPass!' })
  pass('Wrong password → 401',      wrongPass.status === 401)

  const token = login2.body?.access_token
  if (!token) { console.log('\n❌  No token — cannot continue.\n'); await pool.end(); return }

  // ── 6. Profile ─────────────────────────────────────────────────────────────
  console.log('\n6. User profile')
  const profile = await req('GET', '/api/user/me', null, token)
  pass('Profile 200',               profile.status === 200)
  pass('Profile has email',         profile.body?.email === EMAIL)

  // ── 7. Session history (empty) ─────────────────────────────────────────────
  console.log('\n7. Session history (empty)')
  const hist0 = await req('GET', '/api/session/history', null, token)
  pass('History 200',               hist0.status === 200)
  pass('History is empty array',    Array.isArray(hist0.body) && hist0.body.length === 0)

  // ── 8. Create session ──────────────────────────────────────────────────────
  console.log('\n8. Create session')
  const create = await req('POST', '/api/session/create', { track: 'associate' }, token)
  pass('Create 202',                create.status === 202, JSON.stringify(create.body).slice(0, 80))
  const sid = create.body?.sessionId
  pass('Has sessionId',             !!sid, sid)
  pass('status=ready (bank)',        create.body?.status === 'ready')
  pass('totalQuestions=50',         create.body?.totalQuestions === 50)

  // ── 9. Duplicate create ────────────────────────────────────────────────────
  console.log('\n9. Duplicate session guard')
  const dup = await req('POST', '/api/session/create', { track: 'associate' }, token)
  pass('Duplicate → 409',           dup.status === 409)
  pass('409 returns sessionId',     !!dup.body?.sessionId)

  // ── 10. Status check ───────────────────────────────────────────────────────
  console.log('\n10. Status polling')
  const status1 = await req('GET', `/api/session/${sid}/status`, null, token)
  pass('Status 200',                status1.status === 200)
  pass('Has progress object',       !!status1.body?.progress)
  pass('percent is number',         typeof status1.body?.progress?.percent === 'number')

  // ── 11. Status shows ready immediately (bank mode) ───────────────────────
  console.log('\n11. Status (bank — immediately ready)')
  const statusReady = await req('GET', `/api/session/${sid}/status`, null, token)
  pass('status=ready immediately',   statusReady.body?.status === 'ready')
  pass('percent=100 (all drawn)',    statusReady.body?.progress?.percent === 100)

  // ── 12. Answer with no active session ─────────────────────────────────────
  console.log('\n12. Answer guard')
  const badAnswer = await req('POST', `/api/session/${sid}/answer`,
    { questionId: 'A-T1-0001', selectedOption: 'A' }, token)
  pass('Answer on non-active → 400', badAnswer.status === 400)

  const badOption = await req('POST', `/api/session/${sid}/answer`,
    { questionId: 'A-T1-0001', selectedOption: 'Z' }, token)
  pass('Invalid option Z → 400',    badOption.status === 400)

  // ── 13. Abort ──────────────────────────────────────────────────────────────
  console.log('\n13. Abort')
  const abort1 = await req('POST', `/api/session/${sid}/abort`, null, token)
  pass('Abort ready session → 200', abort1.status === 200, abort1.body?.message)

  const abort2 = await req('POST', `/api/session/${sid}/abort`, null, token)
  pass('Abort idempotent → 200',    abort2.status === 200, abort2.body?.message)

  // ── 14. Inject a ready session directly in DB ──────────────────────────────
  // We bypass AI generation to test the exam engine synchronously
  console.log('\n14. Forced-ready session (DB injection)')
  const MOCK_QUESTIONS = Array.from({ length: 10 }, (_, i) => ({
    id:             `A-T1-${String(i + 1).padStart(4, '0')}`,
    thread:         1,
    domain:         'Context of the Organization',
    stem:           `Mock question stem number ${i + 1} — long enough for validation purposes here.`,
    options:        ['Option A text', 'Option B text', 'Option C text', 'Option D text'],
    correct_option: 'A',
    explanation:    'This is the explanation. Option A is correct because the ISO standard requires it. B is wrong.',
    clause_ref:     'ISO 27001:2022 Clause 4.1',
    difficulty:     'medium',
  }))

  const { rows: injected } = await pool.query(
    `INSERT INTO exam_sessions (user_id, track, status, questions, generation_method)
     SELECT id, 'associate', 'ready', $1::jsonb, 'ai'
     FROM users WHERE email = $2
     RETURNING id`,
    [JSON.stringify(MOCK_QUESTIONS), EMAIL],
  )
  const testSid = injected[0]?.id
  pass('Mock session created',      !!testSid, testSid)

  // ── 15. Start exam ─────────────────────────────────────────────────────────
  console.log('\n15. Start exam')
  const start = await req('POST', `/api/session/${testSid}/start`, null, token)
  pass('Start 200',                 start.status === 200, JSON.stringify(start.body).slice(0, 80))
  pass('Questions array returned',  Array.isArray(start.body?.questions))
  pass('10 questions',              start.body?.questions?.length === 10)
  pass('correct_option stripped',   !start.body?.questions?.[0]?.correct_option, 'Answers hidden ✓')
  pass('explanation stripped',      !start.body?.questions?.[0]?.explanation, 'Explanations hidden ✓')
  pass('remaining > 0',             (start.body?.remaining || 0) > 0)

  // ── 16. Resume (start again) ───────────────────────────────────────────────
  console.log('\n16. Resume exam')
  const resume = await req('POST', `/api/session/${testSid}/start`, null, token)
  pass('Resume 200',                resume.status === 200)
  pass('Still 10 questions',        resume.body?.questions?.length === 10)

  // ── 17. Save answers ───────────────────────────────────────────────────────
  console.log('\n17. Save answers')
  for (let i = 0; i < 10; i++) {
    const qid = `A-T1-${String(i + 1).padStart(4, '0')}`
    const ans = await req('POST', `/api/session/${testSid}/answer`,
      { questionId: qid, selectedOption: 'A' }, token)
    if (i === 0) pass('First answer 200', ans.status === 200)
    if (i === 9) pass('Last answer 200',  ans.status === 200)
  }

  // ── 18. Heartbeat ──────────────────────────────────────────────────────────
  console.log('\n18. Heartbeat (tab violation)')
  const hb = await req('POST', `/api/session/${testSid}/heartbeat`, null, token)
  pass('Heartbeat 200',             hb.status === 200)
  const { rows: hbRow } = await pool.query('SELECT tab_violations FROM exam_sessions WHERE id=$1', [testSid])
  pass('tab_violations incremented', hbRow[0]?.tab_violations === 1)

  // ── 19. Submit ─────────────────────────────────────────────────────────────
  console.log('\n19. Submit')
  const submit = await req('POST', `/api/session/${testSid}/submit`, null, token)
  pass('Submit 200',                submit.status === 200, JSON.stringify(submit.body).slice(0, 100))
  pass('score=10 (all correct)',    submit.body?.score === 10)
  pass('passed=false (10/50<80%)',   submit.body?.passed === false)
  pass('totalQuestions=50 (config)',  submit.body?.totalQuestions === 50)

  // Idempotent submit
  const submit2 = await req('POST', `/api/session/${testSid}/submit`, null, token)
  pass('Submit idempotent',         submit2.status === 200 && submit2.body?.alreadyScored === true)

  // ── 20. Questions wiped after submit ──────────────────────────────────────
  console.log('\n20. Questions wiped post-submit')
  const { rows: wipedRow } = await pool.query(
    `SELECT jsonb_array_length(questions) AS qlen FROM exam_sessions WHERE id=$1`, [testSid])
  pass('questions = [] after submit', wipedRow[0]?.qlen === 0)

  // ── 21. Report ─────────────────────────────────────────────────────────────
  console.log('\n21. Report')
  const report = await req('GET', `/api/session/${testSid}/report`, null, token)
  pass('Report 200',                report.status === 200)
  pass('Has topicBreakdown',        typeof report.body?.topicBreakdown === 'object')
  pass('score matches',             report.body?.score === 10)
  pass('passed=false (10/50)',       report.body?.passed === false)
  pass('aiReport null or string',   report.body?.aiReport === null || typeof report.body?.aiReport === 'string',
    report.body?.aiReport ? 'AI report ready ✓' : 'AI report still generating (expected)')

  // ── 22. History after completion ───────────────────────────────────────────
  console.log('\n22. Session history (after completion)')
  const hist1 = await req('GET', '/api/session/history', null, token)
  pass('History 200',               hist1.status === 200)
  pass('One completed entry',       Array.isArray(hist1.body) && hist1.body.length === 1)
  pass('Entry has score',           typeof hist1.body?.[0]?.score === 'number')
  pass('Entry has passPct',         typeof hist1.body?.[0]?.passPct === 'number')

  // ── 23. Start after completed ──────────────────────────────────────────────
  console.log('\n23. Start completed session')
  const startDone = await req('POST', `/api/session/${testSid}/start`, null, token)
  pass('Start completed → 400',     startDone.status === 400)
  pass('Redirect hint present',     !!startDone.body?.redirect)

  // ── Done ───────────────────────────────────────────────────────────────────
  console.log('\n══════════════════════════════════════════')
  console.log(process.exitCode ? '  SOME TESTS FAILED' : '  ALL TESTS PASSED ✅')
  console.log('══════════════════════════════════════════\n')
  await pool.end()
})()
