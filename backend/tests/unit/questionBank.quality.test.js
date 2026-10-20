/**
 * tests/unit/questionBank.quality.test.js
 *
 * Content-quality guard for the static question banks. Options are shuffled at
 * draw time, so position no longer gives the answer away — but length still
 * can: if the correct option is usually the longest, a candidate can pass by
 * picking the longest option. These limits keep that tell close to chance.
 *
 *   - Correct option strictly longest in ≤ 35% of a track (chance ≈ 25%)
 *     and ≤ 50% of any one thread
 *   - Correct option > 1.5× the average distractor length in ≤ 15% of a track
 *   - Structural: 4 distinct non-empty options, valid key, unique ids/stems,
 *     30 questions per thread
 */

const associateBank    = require('../../src/data/associate-questions')
const professionalBank = require('../../src/data/professional-questions')

const LETTERS = ['A', 'B', 'C', 'D']
const BANKS   = { associate: associateBank, professional: professionalBank }

const MAX_LONGEST_SHARE_TRACK  = 0.35
const MAX_LONGEST_SHARE_THREAD = 0.5
const MAX_OUTSIZED_SHARE_TRACK = 0.15
const OUTSIZED_RATIO           = 1.5

function lengths(q) {
  const correctIdx = LETTERS.indexOf(q.correct_option)
  const correct    = q.options[correctIdx].length
  const others     = q.options.filter((_, i) => i !== correctIdx).map((o) => o.length)
  return { correct, others }
}

function isStrictlyLongest(q) {
  const { correct, others } = lengths(q)
  return others.every((len) => correct > len)
}

function isOutsized(q) {
  const { correct, others } = lengths(q)
  const mean = others.reduce((a, b) => a + b, 0) / others.length
  return correct > OUTSIZED_RATIO * mean
}

function pct(n) {
  return `${Math.round(n * 100)}%`
}

describe.each(Object.keys(BANKS))('%s question bank', (track) => {
  const bank = BANKS[track]

  it('has well-formed questions', () => {
    for (const q of bank) {
      expect(q.options).toHaveLength(4)
      expect(q.options.every((o) => typeof o === 'string' && o.trim().length > 0)).toBe(true)
      expect(new Set(q.options.map((o) => o.trim().toLowerCase())).size).toBe(4)
      expect(LETTERS).toContain(q.correct_option)
    }
    expect(new Set(bank.map((q) => q.id)).size).toBe(bank.length)
    expect(new Set(bank.map((q) => q.stem.trim().toLowerCase())).size).toBe(bank.length)
  })

  it('has 30 questions in each of the 5 threads', () => {
    for (let t = 1; t <= 5; t++) {
      expect(bank.filter((q) => q.thread === t)).toHaveLength(30)
    }
  })

  it(`does not make the correct option the longest in more than ${pct(MAX_LONGEST_SHARE_TRACK)} of questions`, () => {
    const offenders = bank.filter(isStrictlyLongest)
    const share     = offenders.length / bank.length
    if (share > MAX_LONGEST_SHARE_TRACK) {
      throw new Error(
        `Correct option is strictly longest in ${offenders.length}/${bank.length} (${pct(share)}). ` +
        `Lengthen distractors in e.g.: ${offenders.slice(0, 10).map((q) => q.id).join(', ')}`,
      )
    }
  })

  it(`keeps every thread at or below ${pct(MAX_LONGEST_SHARE_THREAD)} correct-is-longest`, () => {
    for (let t = 1; t <= 5; t++) {
      const threadQs  = bank.filter((q) => q.thread === t)
      const offenders = threadQs.filter(isStrictlyLongest)
      const share     = offenders.length / threadQs.length
      if (share > MAX_LONGEST_SHARE_THREAD) {
        throw new Error(`Thread ${t}: correct option is strictly longest in ${offenders.length}/${threadQs.length} (${pct(share)})`)
      }
    }
  })

  it(`limits outsized correct options (> ${OUTSIZED_RATIO}× distractor average) to ${pct(MAX_OUTSIZED_SHARE_TRACK)}`, () => {
    const offenders = bank.filter(isOutsized)
    const share     = offenders.length / bank.length
    if (share > MAX_OUTSIZED_SHARE_TRACK) {
      throw new Error(
        `Correct option is > ${OUTSIZED_RATIO}× the distractor average in ${offenders.length}/${bank.length} (${pct(share)}). ` +
        `e.g.: ${offenders.slice(0, 10).map((q) => q.id).join(', ')}`,
      )
    }
  })
})
