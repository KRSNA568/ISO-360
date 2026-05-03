const router = require('express').Router()
const { z }  = require('zod')

const pool               = require('../config/db')
const { authenticate }   = require('../middlewares/authenticate')
const { sessionCreateLimiter } = require('../middlewares/rateLimiter')
// const { generate }       = require('../services/generationService')  // AI generation — kept but disabled; switch back by uncommenting
const { generateReport } = require('../services/reportService')
const { drawQuestions }  = require('../services/questionBankService')
const {
  EXAM_CONFIG,
  RETAKE_POLICY,
  THREAD_DOMAINS,
  INTEGRITY_THRESHOLDS,
} = require('@27001certified/shared/constants')

router.use(authenticate)

// ── Helpers ──────────────────────────────────────────────────────────────────
function stripAnswers(q) {
  // eslint-disable-next-line no-unused-vars
  const { correct_option, explanation, ...safe } = q
  return safe
}

function buildAnswerMap(answersArray) {
  const map = {}
  for (const a of (answersArray || [])) {
    if (a.question_id && a.selected_option) {map[a.question_id] = a.selected_option}
  }
  return map
}

// ── GET /api/session/history ──────────────────────────────────────────────────
// Must be registered BEFORE /:id routes so Express doesn't treat 'history' as an id.
router.get('/history', async (req, res, next) => {
  try {
    const userId = req.user.sub

    const { rows } = await pool.query(
      `SELECT id, track, score, passed, topic_breakdown, ai_report,
              completed_at, created_at
       FROM exam_sessions
       WHERE user_id = $1 AND status = 'completed'
       ORDER BY completed_at DESC
       LIMIT 20`,
      [userId],
    )

    return res.json(
      rows.map((s) => ({
        sessionId:      s.id,
        track:          s.track,
        score:          s.score,
        totalQuestions: EXAM_CONFIG[s.track].TOTAL_QUESTIONS,
        passed:         s.passed,
        passPct:        Math.round((s.score / EXAM_CONFIG[s.track].TOTAL_QUESTIONS) * 100),
        completedAt:    s.completed_at,
        hasReport:      !!s.ai_report,
      })),
    )
  } catch (err) { next(err) }
})

// ── POST /api/session/create ──────────────────────────────────────────────────
const createSchema = z.object({
  track: z.enum(['associate', 'professional']),
})

router.post('/create', sessionCreateLimiter, async (req, res, next) => {
  try {
    const parsed = createSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ error: 'track must be "associate" or "professional"' })
    }

    const { track } = parsed.data
    const userId    = req.user.sub
    const clientIp  = (req.headers['x-forwarded-for']?.split(',')[0]?.trim()) || req.ip || null
    const userAgent = req.headers['user-agent'] || null

    // 1. Prevent duplicate: return existing generating/ready session
    const { rows: active } = await pool.query(
      `SELECT id, jsonb_array_length(questions) AS qlen
       FROM exam_sessions
       WHERE user_id = $1 AND track = $2 AND status IN ('generating', 'ready')
       ORDER BY created_at DESC LIMIT 1`,
      [userId, track],
    )
    if (active.length > 0) {
      const existingSession = active[0]
      // If the existing session has no questions (race condition wiped them),
      // abort it so we can create a fresh one instead of returning a broken session.
      if (!existingSession.qlen || existingSession.qlen === 0) {
        await pool.query(
          `UPDATE exam_sessions SET status = 'aborted' WHERE id = $1`,
          [existingSession.id],
        )
        console.warn(`[Session] ⚠ Aborted empty session ${existingSession.id} — will create a fresh one.`)
        // fall through to create a new session
      } else {
        return res.status(409).json({
          error:     'You already have an active session for this track.',
          sessionId: existingSession.id,
        })
      }
    }

    // 2. Retake limit — configurable via env, defaults to shared constants
    const retakeMax  = parseInt(process.env.RETAKE_MAX_ATTEMPTS  || RETAKE_POLICY.MAX_ATTEMPTS_PER_30_DAYS)
    const retakeDays = parseInt(process.env.RETAKE_WINDOW_DAYS   || 30)
    const { rows: recent } = await pool.query(
      `SELECT COUNT(*) AS cnt FROM exam_sessions
       WHERE user_id = $1 AND track = $2
         AND status NOT IN ('aborted')
         AND created_at > NOW() - ($3 || ' days')::interval`,
      [userId, track, retakeDays],
    )
    if (parseInt(recent[0].cnt) >= retakeMax) {
      return res.status(429).json({
        error: `Maximum of ${retakeMax} attempts per ${retakeDays} days reached.`,
      })
    }

    // 3. Same-IP cross-user detection: ≥3 distinct users from same IP in 24h → log
    if (clientIp) {
      const { rows: ipRows } = await pool.query(
        `SELECT COUNT(DISTINCT user_id) AS cnt FROM exam_sessions
         WHERE ip_address = $1 AND created_at > NOW() - INTERVAL '24 hours'`,
        [clientIp],
      )
      if (parseInt(ipRows[0].cnt) >= 3) {
        console.warn(`[Security] ⚠ IP ${clientIp} has ${ipRows[0].cnt} distinct users in 24h`)
      }
    }

    // 4. Draw questions synchronously from the static question bank
    const drawnQuestions = drawQuestions(track)

    // 5. Create the session row with questions pre-filled and status=ready
    const { rows } = await pool.query(
      `INSERT INTO exam_sessions
         (user_id, track, status, ip_address, user_agent, questions, generation_method)
       VALUES ($1, $2, 'ready', $3, $4, $5::jsonb, 'bank')
       RETURNING id`,
      [userId, track, clientIp, userAgent, JSON.stringify(drawnQuestions)],
    )
    const sessionId = rows[0].id

    // 6. Wipe questions from all previous sessions for this user+track.
    //    Keeps the rows (score history / retake counter) but removes the
    //    questions jsonb so old answers can't be extracted from the DB.
    //    Only wipe sessions that are fully done — never touch 'active' sessions.
    await pool.query(
      `UPDATE exam_sessions
       SET questions = '[]'::jsonb
       WHERE user_id = $1 AND track = $2 AND id <> $3
         AND status IN ('completed', 'expired', 'aborted')`,
      [userId, track, sessionId],
    )

    // ── AI generation disabled — static bank is used instead ─────────────────
    // generate(sessionId, userId, track).catch((err) =>
    //   console.error(`[Session] Generation error for ${sessionId}:`, err.message),
    // )

    console.log(`[Session] 📋 Session ${sessionId} ready from bank (${drawnQuestions.length}q, track=${track})`)

    return res.status(202).json({
      sessionId,
      track,
      status:         'ready',
      totalQuestions: EXAM_CONFIG[track].TOTAL_QUESTIONS,
      message:        'Exam ready. Questions drawn from question bank.',
    })
  } catch (err) { next(err) }
})

// ── GET /api/session/:id/status ───────────────────────────────────────────────
router.get('/:id/status', async (req, res, next) => {
  try {
    const { id } = req.params
    const userId = req.user.sub

    const { rows } = await pool.query(
      `SELECT id, track, status,
              jsonb_array_length(questions) AS questions_generated
       FROM exam_sessions
       WHERE id = $1 AND user_id = $2`,
      [id, userId],
    )

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Session not found.' })
    }

    const session        = rows[0]
    const totalQuestions = EXAM_CONFIG[session.track].TOTAL_QUESTIONS
    const generated      = parseInt(session.questions_generated) || 0
    const percent        = Math.min(100, Math.round((generated / totalQuestions) * 100))

    return res.json({
      sessionId: session.id,
      track:     session.track,
      status:    session.status,   // generating | ready | aborted
      progress:  {
        questionsGenerated: generated,
        totalQuestions,
        percent,
      },
    })
  } catch (err) { next(err) }
})

// ── POST /api/session/:id/abort ─────────────────────────────────────────────
// Called by the frontend when the user navigates away during generation.
// Only transitions generating → aborted; harmless if already in another state.
router.post('/:id/abort', async (req, res, next) => {
  try {
    const { id } = req.params
    const userId = req.user.sub

    const { rows } = await pool.query(
      `UPDATE exam_sessions
       SET status = 'aborted'
       WHERE id = $1 AND user_id = $2 AND status = 'generating'
       RETURNING id`,
      [id, userId],
    )

    if (rows.length === 0) {
      // Session was not generating (already ready, aborted, or not owned by user)
      return res.status(200).json({ message: 'Session not in generating state — no change.' })
    }

    console.log(`[Session] ⛔ Session ${id} aborted by user ${userId}`)
    return res.json({ message: 'Session aborted.' })
  } catch (err) { next(err) }
})

// ── POST /api/session/:id/start ──────────────────────────────────────────────
// Transitions ready → active. Returns questions stripped of correct answers.
// If already active (browser refresh/resume), returns remaining time + saved answers.
router.post('/:id/start', async (req, res, next) => {
  try {
    const { id } = req.params
    const userId = req.user.sub

    const { rows } = await pool.query(
      `SELECT id, track, status, questions, answers,
              EXTRACT(EPOCH FROM (expires_at - NOW()))::int AS remaining,
              tab_violations, device_fingerprint
       FROM exam_sessions
       WHERE id = $1 AND user_id = $2`,
      [id, userId],
    )

    if (rows.length === 0) {return res.status(404).json({ error: 'Session not found.' })}

    const session = rows[0]

    // Resume: already active (e.g. page refresh)
    if (session.status === 'active') {
      if ((session.remaining || 0) <= 0) {
        return res.status(410).json({ error: 'Session has expired.', redirect: `/results/${id}` })
      }
      return res.json({
        questions:        (session.questions || []).map(stripAnswers),
        remaining:        Math.max(0, session.remaining || 0),
        track:            session.track,
        savedAnswers:     buildAnswerMap(session.answers || []),
        tabViolations:    session.tab_violations || 0,
        deviceFingerprint: session.device_fingerprint || null,
      })
    }

    // Already completed — send to results
    if (session.status === 'completed') {
      return res.status(400).json({ error: 'Session already completed.', redirect: `/results/${id}` })
    }

    if (session.status !== 'ready') {
      return res.status(400).json({ error: `Cannot start a session with status "${session.status}".` })
    }

    // Guard: questions must be present (race condition / StrictMode double-create can wipe them)
    if (!session.questions || session.questions.length === 0) {
      return res.status(409).json({
        error: 'This session has no questions (likely wiped by a concurrent session). Please start a new exam.',
        code:  'SESSION_EMPTY',
      })
    }

    const config            = EXAM_CONFIG[session.track]
    const deviceFingerprint = req.body?.device_fingerprint || null

    await pool.query(
      `UPDATE exam_sessions
       SET status             = 'active',
           started_at         = NOW(),
           expires_at         = NOW() + ($1 || ' seconds')::interval,
           device_fingerprint = $3
       WHERE id = $2`,
      [config.EXAM_DURATION_SECONDS, id, deviceFingerprint],
    )

    console.log(`[Session] ▶ Session ${id} started (track=${session.track})`)

    return res.json({
      questions:    (session.questions || []).map(stripAnswers),
      remaining:    config.EXAM_DURATION_SECONDS,
      track:        session.track,
      savedAnswers: {},
    })
  } catch (err) { next(err) }
})

// ── POST /api/session/:id/answer ──────────────────────────────────────────────
// Upserts a single answer in real time.
const answerSchema = z.object({
  questionId:     z.string().min(1),
  selectedOption: z.enum(['A', 'B', 'C', 'D']).nullable(),
})

router.post('/:id/answer', async (req, res, next) => {
  try {
    const { id } = req.params
    const userId = req.user.sub

    const parsed = answerSchema.safeParse(req.body)
    if (!parsed.success) {
      return res.status(400).json({ error: 'questionId (string) and selectedOption (A–D) are required.' })
    }
    const { questionId, selectedOption } = parsed.data

    // null selectedOption = deselect (remove answer); A-D = upsert
    let answerQuery, answerParams
    if (selectedOption === null) {
      answerQuery = `UPDATE exam_sessions
       SET answers = COALESCE(
           (SELECT jsonb_agg(elem) FROM jsonb_array_elements(answers) elem
            WHERE elem->>'question_id' != $3),
           '[]'::jsonb
         )
       WHERE id = $1 AND user_id = $2 AND status = 'active'`
      answerParams = [id, userId, questionId]
    } else {
      answerQuery = `UPDATE exam_sessions
       SET answers = COALESCE(
           (SELECT jsonb_agg(elem) FROM jsonb_array_elements(answers) elem
            WHERE elem->>'question_id' != $3),
           '[]'::jsonb
         ) || jsonb_build_array(
           jsonb_build_object(
             'question_id',     $3::text,
             'selected_option', $4::text,
             'answered_at',     to_char(NOW(), 'YYYY-MM-DD"T"HH24:MI:SS"Z"')
           )
         )
       WHERE id = $1 AND user_id = $2 AND status = 'active'`
      answerParams = [id, userId, questionId, selectedOption]
    }
    const { rowCount } = await pool.query(answerQuery, answerParams)

    if (rowCount === 0) {
      return res.status(400).json({ error: 'Session not found or not active.' })
    }

    return res.json({ ok: true })
  } catch (err) { next(err) }
})

// ── POST /api/session/:id/submit ──────────────────────────────────────────────
// Scores the exam, marks completed, fires AI report generation async.
// Wrapped in a transaction with SELECT FOR UPDATE to prevent double-scoring.
router.post('/:id/submit', async (req, res, next) => {
  let client
  try {
    client = await pool.connect()
    const { id } = req.params
    const userId = req.user.sub

    await client.query('BEGIN')

    // Lock the session row — prevents concurrent submits from double-scoring
    const { rows } = await client.query(
      `SELECT id, track, status, questions, answers, tab_violations, started_at
       FROM exam_sessions
       WHERE id = $1 AND user_id = $2
       FOR UPDATE`,
      [id, userId],
    )

    if (rows.length === 0) {
      await client.query('ROLLBACK')
      return res.status(404).json({ error: 'Session not found.' })
    }

    const session = rows[0]

    // Idempotent: already scored — safe to return without re-scoring
    if (session.status === 'completed') {
      await client.query('ROLLBACK')
      return res.json({ sessionId: id, alreadyScored: true })
    }

    if (!['active', 'expired'].includes(session.status)) {
      await client.query('ROLLBACK')
      return res.status(400).json({ error: `Cannot submit a session with status "${session.status}".` })
    }

    const questions = session.questions || []
    const answers   = session.answers   || []
    const config    = EXAM_CONFIG[session.track]
    const answerMap = buildAnswerMap(answers)

    // ── Score ──────────────────────────────────────────────────────────────
    const topicBreakdown = {}
    let   correctCount   = 0

    for (const q of questions) {
      const thread = String(q.thread)
      if (!topicBreakdown[thread]) {
        topicBreakdown[thread] = {
          domain:  q.domain || THREAD_DOMAINS[session.track]?.[parseInt(thread)] || `Domain ${thread}`,
          correct: 0,
          total:   0,
          pct:     0,
        }
      }
      topicBreakdown[thread].total++
      if (answerMap[q.id] === q.correct_option) {
        correctCount++
        topicBreakdown[thread].correct++
      }
    }

    for (const t of Object.values(topicBreakdown)) {
      t.pct = t.total > 0 ? Math.round((t.correct / t.total) * 100) : 0
    }

    const passed   = correctCount >= config.PASS_THRESHOLD
    const scorePct = Math.round((correctCount / config.TOTAL_QUESTIONS) * 100)

    // ── Integrity signals ──────────────────────────────────────────────────
    const durationSecs  = session.started_at
      ? Math.round((Date.now() - new Date(session.started_at).getTime()) / 1000)
      : config.EXAM_DURATION_SECONDS
    const avgSecsPerQ   = questions.length > 0 ? durationSecs / questions.length : 0
    const tabViolations = session.tab_violations || 0

    const suspiciousReasons = []
    if (avgSecsPerQ < INTEGRITY_THRESHOLDS.SUSPICIOUS_AVG_SECONDS_PER_Q)
      {suspiciousReasons.push(`avg ${avgSecsPerQ.toFixed(1)}s/question (threshold: ${INTEGRITY_THRESHOLDS.SUSPICIOUS_AVG_SECONDS_PER_Q}s)`)}
    if (tabViolations >= INTEGRITY_THRESHOLDS.SUSPICIOUS_TAB_VIOLATIONS)
      {suspiciousReasons.push(`${tabViolations} tab violations`)}
    if (durationSecs < INTEGRITY_THRESHOLDS.SUSPICIOUS_TOTAL_SECONDS)
      {suspiciousReasons.push(`completed in ${durationSecs}s (threshold: ${INTEGRITY_THRESHOLDS.SUSPICIOUS_TOTAL_SECONDS}s)`)}

    const suspicious       = suspiciousReasons.length > 0
    const suspiciousReason = suspicious ? suspiciousReasons.join('; ') : null

    // ── Build per-question review (stored in answers column post-submit) ──────
    const reviews = questions.map(q => ({
      id:            q.id,
      stem:          q.stem,
      options:       q.options || {},
      userAnswer:    answerMap[q.id] || null,
      correctOption: q.correct_option,
      correct:       answerMap[q.id] === q.correct_option,
      explanation:   q.explanation || null,
      clauseRef:     q.clause_ref  || null,
      domain:        q.domain      || null,
      thread:        q.thread,
    }))

    // ── Persist within transaction ─────────────────────────────────────────
    await client.query(
      `UPDATE exam_sessions
       SET status             = 'completed',
           score              = $2,
           passed             = $3,
           topic_breakdown    = $4::jsonb,
           completed_at       = NOW(),
           suspicious         = $5,
           suspicious_reason  = $6,
           questions          = '[]'::jsonb,
           answers            = $7::jsonb
       WHERE id = $1`,
      [id, correctCount, passed, JSON.stringify(topicBreakdown), suspicious, suspiciousReason, JSON.stringify(reviews)],
    )

    await client.query('COMMIT')

    console.log(
      `[Session] ✅ ${id} completed — ${correctCount}/${config.TOTAL_QUESTIONS} ` +
      `(${scorePct}%) ${passed ? 'PASS' : 'FAIL'}` +
      (suspicious ? ' ⚠ flagged suspicious' : ''),
    )

    // Fire AI report async (non-blocking, after commit)
    generateReport(id, session.track, correctCount, passed, topicBreakdown).catch(() => {})

    // Fire certificate generation async if candidate passed
    if (passed) {
      pool.query('SELECT full_name, email FROM users WHERE id = $1', [userId])
        .then(async ({ rows: uRows }) => {
          const fullName  = uRows.length > 0 ? uRows[0].full_name : 'Candidate'
          const userEmail = uRows.length > 0 ? uRows[0].email     : null

          const { generateCertificate }  = require('../services/certificateService')
          const { sendCertificateEmail } = require('../services/emailService')

          try {
            const cert = await generateCertificate({
              sessionId:      id,
              userId,
              track:          session.track,
              fullName,
              score:          correctCount,
              totalQuestions: config.TOTAL_QUESTIONS,
              awardedOn:      new Date(),
            })

            if (cert && userEmail) {
              const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:3000').replace(/\/$/, '')
              const verifyUrl   = `${frontendUrl}/verify/${cert.certificate_id}`
              const trackLabel  = session.track === 'associate'
                ? 'Associate — ISMS Foundation'
                : 'Professional — Lead Auditor'
              await sendCertificateEmail(
                userEmail, fullName, cert.certificate_id,
                trackLabel, cert.r2_url_landscape, verifyUrl
              ).catch(() => {})
            }
          } catch (certErr) {
            console.error('[Cert] async generation failed for session', id, ':', certErr.message)
            // Mark cert as failed so frontend can show status instead of infinite spinner
            pool.query(
              'UPDATE exam_sessions SET cert_failed = TRUE WHERE id = $1',
              [id],
            ).catch(() => {})
          }
        })
        .catch(err => console.error('[Cert] user lookup failed for session', id, ':', err.message))
    }

    return res.json({
      sessionId:      id,
      score:          correctCount,
      totalQuestions: config.TOTAL_QUESTIONS,
      passed,
      passPct:        scorePct,
      passThreshold:  config.PASS_THRESHOLD,
    })
  } catch (err) {
    await client?.query('ROLLBACK').catch(() => {})
    next(err)
  } finally {
    client?.release()
  }
})

// ── POST /api/session/:id/heartbeat ──────────────────────────────────────────
// Increments tab_violations when user switches away from exam tab.
router.post('/:id/heartbeat', async (req, res, next) => {
  try {
    const { id } = req.params
    const userId = req.user.sub

    await pool.query(
      `UPDATE exam_sessions
       SET tab_violations = tab_violations + 1
       WHERE id = $1 AND user_id = $2 AND status = 'active'`,
      [id, userId],
    )

    return res.json({ ok: true })
  } catch (err) { next(err) }
})

// ── GET /api/session/:id/report ───────────────────────────────────────────────
// Returns score + topic breakdown + AI report for a completed session.
// ai_report may be null for a few seconds after submit while Groq generates it.
router.get('/:id/report', async (req, res, next) => {
  try {
    const { id } = req.params
    const userId = req.user.sub

    const { rows } = await pool.query(
      `SELECT s.id, s.track, s.status, s.score, s.passed,
              s.topic_breakdown, s.ai_report, s.completed_at,
              s.suspicious, s.suspicious_reason, s.answers, s.cert_failed,
              c.certificate_id, c.r2_url_landscape, c.r2_url_square, c.revoked
       FROM exam_sessions s
       LEFT JOIN certificates c ON c.exam_session_id = s.id
       WHERE s.id = $1 AND s.user_id = $2`,
      [id, userId],
    )

    if (rows.length === 0) {return res.status(404).json({ error: 'Session not found.' })}

    const s = rows[0]
    if (s.status !== 'completed') {
      return res.status(400).json({ error: `Session is not completed (status: ${s.status}).` })
    }

    const config = EXAM_CONFIG[s.track]

    return res.json({
      sessionId:        s.id,
      track:            s.track,
      score:            s.score,
      totalQuestions:   config.TOTAL_QUESTIONS,
      passed:           s.passed,
      passPct:          Math.round((s.score / config.TOTAL_QUESTIONS) * 100),
      passThreshold:    config.PASS_THRESHOLD,
      passThresholdPct: config.PASS_THRESHOLD_PCT,
      topicBreakdown:   s.topic_breakdown  || {},
      aiReport:         s.ai_report        || null,   // null = still generating, client polls
      completedAt:      s.completed_at,
      suspicious:       s.suspicious       || false,
      suspiciousReason: s.suspicious_reason || null,
      questionReviews:  s.answers          || [],     // full per-question review with revealed answers
      // Certificate — null=still generating, status:'failed'=generation error
      certificate: s.certificate_id
        ? {
            certificateId: s.certificate_id,
            landscapeUrl:  s.r2_url_landscape || null,
            squareUrl:     s.r2_url_square    || null,
            revoked:       s.revoked          || false,
            status:        'issued',
          }
        : s.cert_failed
          ? { status: 'failed' }
          : null,
    })
  } catch (err) { next(err) }
})

module.exports = router
