/**
 * @file questionBankService.js
 * Draws a randomised set of exam questions from the static question bank.
 *
 * Bank sizes (each): 150 questions / 5 threads = 30 per thread
 *
 * Draw counts per exam:
 *   Associate    → 10 questions per thread × 5 threads =  50 total
 *   Professional → 20 questions per thread × 5 threads = 100 total
 *
 * Each call shuffles the per-thread pool independently so every session
 * sees a different subset and ordering.
 */

const associateBank    = require('../data/associate-questions')
const professionalBank = require('../data/professional-questions')

/** Questions to draw per thread per exam. */
const DRAW_PER_THREAD = {
  associate:    10,
  professional: 20,
}

// ── Helpers ────────────────────────────────────────────────────────────────────

/** Fisher-Yates shuffle — returns a new array, does not mutate input. */
function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// ── Public API ─────────────────────────────────────────────────────────────────

/**
 * Draw a randomised set of exam questions from the static bank.
 * Returns questions grouped by thread (thread 1 first, then 2, …).
 *
 * @param {string} track  'associate' | 'professional'
 * @returns {Object[]}    Flat array of question objects.
 * @throws {Error}        If track is unknown or bank is empty.
 */
function drawQuestions(track) {
  const bank = track === 'associate' ? associateBank : professionalBank

  if (!Array.isArray(bank) || bank.length === 0) {
    throw new Error(`[QuestionBank] Bank for track "${track}" is empty or not loaded.`)
  }

  const perThread = DRAW_PER_THREAD[track]
  if (!perThread) {
    throw new Error(`[QuestionBank] Unknown track: "${track}"`)
  }

  // Group questions by thread number.
  const byThread = {}
  for (const q of bank) {
    const t = q.thread
    if (!byThread[t]) {byThread[t] = []}
    byThread[t].push(q)
  }

  // Shuffle each thread's pool and draw the required count, then flatten.
  const drawn = []
  for (const threadNum of Object.keys(byThread).sort((a, b) => Number(a) - Number(b))) {
    const shuffled = shuffle(byThread[threadNum])
    drawn.push(...shuffled.slice(0, perThread))
  }

  // Final full shuffle so thread grouping is not visible to users.
  return shuffle(drawn)
}

module.exports = { drawQuestions }
