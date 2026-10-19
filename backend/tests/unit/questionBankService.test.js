/**
 * tests/unit/questionBankService.test.js
 *
 * Exam integrity invariants for drawing from the static question bank:
 *   1. Correct draw size per track, no repeated questions
 *   2. Options are shuffled but correct_option still points at the right answer
 *   3. The correct answer is not always in the same position
 *   4. The bank itself is never mutated by a draw
 */

const { drawQuestions } = require('../../src/services/questionBankService')
const associateBank     = require('../../src/data/associate-questions')
const professionalBank  = require('../../src/data/professional-questions')

const LETTERS = ['A', 'B', 'C', 'D']
const BANKS   = { associate: associateBank, professional: professionalBank }
const SIZES   = { associate: 50, professional: 100 }

function correctText(q) {
  return q.options[LETTERS.indexOf(q.correct_option)]
}

describe.each(Object.keys(BANKS))('drawQuestions(%s)', (track) => {
  const bankById = new Map(BANKS[track].map((q) => [q.id, q]))

  it('draws the configured number of unique questions', () => {
    const drawn = drawQuestions(track)
    expect(drawn).toHaveLength(SIZES[track])
    expect(new Set(drawn.map((q) => q.id)).size).toBe(drawn.length)
  })

  it('keeps correct_option pointing at the original correct answer after shuffling', () => {
    for (const q of drawQuestions(track)) {
      const original = bankById.get(q.id)
      expect(q.options).toHaveLength(4)
      expect([...q.options].sort()).toEqual([...original.options].sort())
      expect(correctText(q)).toBe(correctText(original))
    }
  })

  it('spreads the correct answer across positions', () => {
    const counts = { A: 0, B: 0, C: 0, D: 0 }
    for (let i = 0; i < 4; i++) {
      for (const q of drawQuestions(track)) {counts[q.correct_option]++}
    }
    // Uniform shuffle → each letter expected ~25%; fail only if one dominates.
    const total = Object.values(counts).reduce((a, b) => a + b, 0)
    for (const letter of LETTERS) {
      expect(counts[letter] / total).toBeGreaterThan(0.1)
      expect(counts[letter] / total).toBeLessThan(0.4)
    }
  })

  it('does not mutate the bank', () => {
    const snapshot = JSON.stringify(BANKS[track])
    drawQuestions(track)
    expect(JSON.stringify(BANKS[track])).toBe(snapshot)
  })
})
