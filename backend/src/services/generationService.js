/**
 * @file generationService.js
 * Orchestrates sequential AI question generation across all threads.
 * Uses Groq (free tier) with llama-3.3-70b-versatile via OpenAI-compatible API.
 *
 * Strategy:
 *   Associate    →  5 jobs × 10q = 50  questions  (5 domains, 1 call each)
 *   Professional → 10 jobs × 10q = 100 questions  (5 domains, 2 calls each)
 *
 * All calls are sequential with a 15-second gap to stay within Groq's
 * 6,000 tokens/minute free-tier rate limit.
 * On HTTP 429, the retry waits 45 seconds automatically.
 */

const crypto = require('crypto')
const pool   = require('../config/db')
const { createAIClient, buildMessages, AI_CALL_CONFIG } = require('../prompts/promptBuilder')
const { EXAM_CONFIG, AI_CONFIG }                        = require('@iso-audit360/shared/constants')

// ── Thread modules ────────────────────────────────────────────────────────────
const THREAD_MODULES = {
  associate: [
    require('../prompts/associate/thread-1'),
    require('../prompts/associate/thread-2'),
    require('../prompts/associate/thread-3'),
    require('../prompts/associate/thread-4'),
    require('../prompts/associate/thread-5'),
  ],
  professional: [
    require('../prompts/professional/thread-1'),
    require('../prompts/professional/thread-2'),
    require('../prompts/professional/thread-3'),
    require('../prompts/professional/thread-4'),
    require('../prompts/professional/thread-5'),
  ],
}

// ── Utilities ─────────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

/**
 * Returns true if the session has been marked 'aborted' in the DB.
 * Called between jobs so generation stops cleanly when the user leaves.
 */
async function isAborted(sessionId) {
  const { rows } = await pool.query(
    'SELECT status FROM exam_sessions WHERE id = $1',
    [sessionId],
  )
  return rows[0]?.status === 'aborted'
}

function stemHash(stem) {
  return crypto.createHash('sha256').update(stem.trim().toLowerCase()).digest('hex')
}

/**
 * Validate that Groq returned well-formed questions.
 */
function validateQuestions(questions, expectedCount) {
  if (!Array.isArray(questions) || questions.length !== expectedCount) return false
  return questions.every(
    (q) =>
      typeof q.stem === 'string' &&
      q.stem.length >= 20 &&
      Array.isArray(q.options) &&
      q.options.length === 4 &&
      ['A', 'B', 'C', 'D'].includes(q.correct_option) &&
      typeof q.explanation === 'string' &&
      q.explanation.length >= 50 &&
      ['easy', 'medium', 'hard'].includes(q.difficulty) &&
      typeof q.clause_ref === 'string' &&
      q.clause_ref.length > 0,
  )
}

// ── Job list ──────────────────────────────────────────────────────────────────
/**
 * Build the ordered list of AI jobs for the track.
 * Each job = one Groq API call generating exactly 10 questions.
 *
 * Associate   ( 5 jobs): domains 1-5, part 1 only
 * Professional (10 jobs): domains 1-5 part 1, then domains 1-5 part 2
 *   → first 5 jobs cover all domains once (50q) so early progress is visible
 */
function buildJobList(track) {
  const jobs = []
  if (track === 'associate') {
    for (let i = 0; i < 5; i++) {
      jobs.push({ threadIndex: i, part: 1, startSeq: 1 })
    }
  } else {
    // Interleaved: all domains part 1 first, then all part 2
    for (let i = 0; i < 5; i++) {
      jobs.push({ threadIndex: i, part: 1, startSeq: 1 })
    }
    for (let i = 0; i < 5; i++) {
      jobs.push({ threadIndex: i, part: 2, startSeq: 11 })
    }
  }
  return jobs
}

// ── Single AI call ────────────────────────────────────────────────────────────
const QUESTIONS_PER_JOB = 10

async function runJob(client, threadModule, job) {
  const { systemPrompt, userPrompt } = threadModule.buildPrompt(job.startSeq, QUESTIONS_PER_JOB)

  // Part 2: instruct the model to generate fresh scenarios, not repeat Part 1
  const finalUserPrompt =
    job.part === 2
      ? userPrompt +
        '\n\nIMPORTANT: This is PART 2 OF 2 for this domain. Generate 10 COMPLETELY DIFFERENT ' +
        'questions. Use different sub-topics, different organization types (e.g. healthcare vs. ' +
        'fintech vs. manufacturing), and entirely different scenario contexts from Part 1. ' +
        'No scenario, situation, or example should repeat.'
      : userPrompt

  const messages = buildMessages({ systemPrompt, userPrompt: finalUserPrompt })

  const response = await client.chat.completions.create({
    ...AI_CALL_CONFIG,
    messages,
  })

  const raw    = response.choices[0]?.message?.content
  const parsed = JSON.parse(raw)
  const qs     = parsed?.questions

  if (!validateQuestions(qs, QUESTIONS_PER_JOB)) {
    throw new Error(
      `Validation failed: got ${Array.isArray(qs) ? qs.length : typeof qs}, ` +
      `expected ${QUESTIONS_PER_JOB} valid questions`,
    )
  }

  return qs
}

// ── Fingerprint helpers ───────────────────────────────────────────────────────
/**
 * Get all stem hashes from this user's previous exams on this track.
 * Used to filter out repeated questions.
 */
async function getExistingHashes(userId, track) {
  const { rows } = await pool.query(
    'SELECT stem_hash FROM question_fingerprints WHERE user_id = $1 AND track = $2',
    [userId, track],
  )
  return new Set(rows.map((r) => r.stem_hash))
}

/**
 * Persist fingerprints for all generated questions.
 * Prunes fingerprints older than the last 3 exam sessions for this user+track.
 */
async function saveFingerprints(sessionId, userId, track, questions) {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    for (const q of questions) {
      await client.query(
        `INSERT INTO question_fingerprints (user_id, track, stem_hash, thread, exam_session_id)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT DO NOTHING`,
        [userId, track, stemHash(q.stem), q.thread || 1, sessionId],
      )
    }

    // Keep only the 3 most-recent exam sessions worth of fingerprints
    await client.query(
      `DELETE FROM question_fingerprints
       WHERE user_id = $1 AND track = $2
         AND exam_session_id NOT IN (
           SELECT exam_session_id
           FROM (
             SELECT exam_session_id, MAX(created_at) AS last_used
             FROM question_fingerprints
             WHERE user_id = $1 AND track = $2
             GROUP BY exam_session_id
             ORDER BY last_used DESC
             LIMIT 3
           ) recent
         )`,
      [userId, track],
    )

    await client.query('COMMIT')
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
}

// ── Main entry point ──────────────────────────────────────────────────────────
/**
 * Generate all questions for a session. Called fire-and-forget from the route.
 * Updates exam_sessions.questions in-place after each job so the status
 * endpoint can return live progress.
 *
 * @param {string} sessionId
 * @param {string} userId
 * @param {'associate'|'professional'} track
 */
async function generate(sessionId, userId, track) {
  const groqClient    = createAIClient()
  const threadModules = THREAD_MODULES[track]
  const jobs          = buildJobList(track)
  const existingHashes = await getExistingHashes(userId, track)

  let failedJobs   = 0
  const allQuestions = []

  console.log(`[Gen] ▶ Session ${sessionId} | track=${track} | ${jobs.length} jobs queued`)

  for (let i = 0; i < jobs.length; i++) {
    // Stop immediately if the user aborted while we were sleeping or between jobs
    if (await isAborted(sessionId)) {
      console.log(`[Gen] ⛔ Session ${sessionId} aborted by user — stopping generation`)
      return
    }

    const job          = jobs[i]
    const threadModule = threadModules[job.threadIndex]
    let   questions    = null
    let   attempt      = 0

    while (attempt < 2 && !questions) {
      try {
        if (attempt > 0) {
          console.log(`[Gen]   ↻ Retry job ${i + 1}/${jobs.length}`)
          await sleep(AI_CONFIG.RETRY_BACKOFF_MS)
        }
        questions = await runJob(groqClient, threadModule, job)
      } catch (err) {
        // Groq 429: rate-limited — wait 45s then retry once
        const is429 =
          err?.status === 429 ||
          String(err?.message).includes('429') ||
          String(err?.message).toLowerCase().includes('rate limit') ||
          String(err?.message).toLowerCase().includes('rate_limit')

        if (is429 && attempt === 0) {
          console.warn(`[Gen]   ⚠ Rate limited on job ${i + 1} — waiting 45s then retrying`)
          await sleep(45000)
          // Re-check abort after the long wait
          if (await isAborted(sessionId)) {
            console.log(`[Gen] ⛔ Session ${sessionId} aborted during rate-limit wait`)
            return
          }
        } else {
          console.error(`[Gen]   ✗ Job ${i + 1} attempt ${attempt + 1} failed:`, err.message)
        }
        attempt++
      }
    }

    if (!questions) {
      failedJobs++
      console.warn(`[Gen]   ✗ Job ${i + 1} failed permanently (total failures: ${failedJobs})`)

      if (failedJobs > AI_CONFIG.MAX_FAILED_THREADS) {
        console.error(`[Gen] ✗ Aborting session ${sessionId} — too many failures`)
        await pool.query(
          `UPDATE exam_sessions
           SET status = 'aborted',
               generation_errors = $1::jsonb
           WHERE id = $2`,
          [JSON.stringify([`Aborted after ${failedJobs} job failures`]), sessionId],
        )
        return
      }
      continue // skip this job, keep going
    }

    // Filter questions already seen in previous exams (deduplication)
    const fresh = questions.filter((q) => !existingHashes.has(stemHash(q.stem)))
    if (fresh.length < questions.length) {
      console.log(
        `[Gen]   ↩ Filtered ${questions.length - fresh.length} duplicate(s) from job ${i + 1}`,
      )
    }
    // Fallback: if ALL were filtered (very unlikely early on), keep originals
    const toAdd = fresh.length > 0 ? fresh : questions

    allQuestions.push(...toAdd)

    // Persist this batch immediately — enables live progress tracking
    await pool.query(
      `UPDATE exam_sessions
       SET questions = questions || $1::jsonb
       WHERE id = $2`,
      [JSON.stringify(toAdd), sessionId],
    )

    console.log(
      `[Gen]   ✓ Job ${i + 1}/${jobs.length} done ` +
      `(thread ${job.threadIndex + 1}, part ${job.part}) ` +
      `→ ${allQuestions.length} total`,
    )

    // Rate-limit gap between calls — skip after the last job
    if (i < jobs.length - 1) {
      await sleep(15000) // 15s: ~5k tokens settle comfortably within the 60s window
      // Re-check abort after the inter-job gap
      if (await isAborted(sessionId)) {
        console.log(`[Gen] ⛔ Session ${sessionId} aborted during inter-job gap`)
        return
      }
    }
  }

  // Save fingerprints (non-fatal)
  try {
    await saveFingerprints(sessionId, userId, track, allQuestions)
    console.log(`[Gen]   ✓ Fingerprints saved for ${allQuestions.length} questions`)
  } catch (err) {
    console.warn('[Gen]   ⚠ Fingerprint save failed (non-fatal):', err.message)
  }

  // Mark session ready
  await pool.query(
    `UPDATE exam_sessions
     SET status = 'ready', generation_method = 'ai'
     WHERE id = $1`,
    [sessionId],
  )

  console.log(
    `[Gen] ✅ Session ${sessionId} READY — ${allQuestions.length} questions generated`,
  )
}

module.exports = { generate }
