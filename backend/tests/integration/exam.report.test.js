/**
 * tests/integration/exam.report.test.js
 *
 * Tests the Groq-powered reportService.generateReport() in isolation.
 *
 * We mock:
 *   - The DB pool (no real Supabase calls)
 *   - The Groq AI client (no real API calls, no billing)
 *
 * This verifies that generateReport():
 *   1. Calls the Groq client with the correct structure
 *   2. Strips <think>…</think> blocks from reasoning models
 *   3. Saves the cleaned report to the DB
 *   4. Handles an empty Groq response gracefully (non-fatal)
 *   5. Handles a Groq API error gracefully (non-fatal — doesn't throw)
 */

// ── Mock DB pool ──────────────────────────────────────────────────────────────
jest.mock('../../src/config/db', () => ({
  query: jest.fn(),
}))

// ── Mock the AI client factory ────────────────────────────────────────────────
// reportService calls createAIClient() which returns an OpenAI-compatible client.
// We intercept it and replace chat.completions.create with a Jest mock.
const mockCreate = jest.fn()
jest.mock('../../src/prompts/promptBuilder', () => ({
  createAIClient: jest.fn(() => ({
    chat: {
      completions: {
        create: mockCreate,
      },
    },
  })),
}))

// ── Mock shared constants ─────────────────────────────────────────────────────
jest.mock('@27001certified/shared/constants', () => ({
  EXAM_CONFIG: {
    associate: {
      TOTAL_QUESTIONS:    50,
      PASS_THRESHOLD:     40,
      PASS_THRESHOLD_PCT: 80,
    },
    professional: {
      TOTAL_QUESTIONS:    100,
      PASS_THRESHOLD:     80,
      PASS_THRESHOLD_PCT: 80,
    },
  },
  THREAD_DOMAINS: {},
  AI_CONFIG:      { MODEL: 'llama-3.3-70b-versatile' },
}))

const pool = require('../../src/config/db')
const { generateReport } = require('../../src/services/reportService')

// ── Sample data ───────────────────────────────────────────────────────────────
const SESSION_ID = 'sess-1234-abcd'
const TOPIC_BREAKDOWN = {
  '1': { domain: 'Clause 4 — Context',     correct: 8, total: 10, pct: 80 },
  '2': { domain: 'Clause 6 — Risk',        correct: 6, total: 10, pct: 60 },
  '3': { domain: 'Clause 7 — Support',     correct: 9, total: 10, pct: 90 },
  '4': { domain: 'Clause 8 — Operations',  correct: 7, total: 10, pct: 70 },
  '5': { domain: 'Clause 9-10 — Improvement', correct: 9, total: 10, pct: 90 },
}

// ─────────────────────────────────────────────────────────────────────────────

describe('reportService.generateReport()', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    pool.query.mockResolvedValue({ rows: [], rowCount: 1 })
  })

  it('should call Groq with system + user messages and save report to DB', async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: '## Overall Result\nYou passed!' } }],
    })

    await generateReport(SESSION_ID, 'associate', 39, true, TOPIC_BREAKDOWN)

    // Groq was called once
    expect(mockCreate).toHaveBeenCalledTimes(1)
    const callArgs = mockCreate.mock.calls[0][0]
    expect(callArgs.messages).toHaveLength(2)
    expect(callArgs.messages[0].role).toBe('system')
    expect(callArgs.messages[1].role).toBe('user')

    // DB was updated with the report
    expect(pool.query).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE exam_sessions'),
      expect.arrayContaining([SESSION_ID]),
    )
  })

  it('should strip <think>…</think> reasoning blocks from Groq response', async () => {
    const rawWithThink =
      '<think>Let me think through the scoring carefully...\n</think>\n## Overall Result\nYou passed!'
    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: rawWithThink } }],
    })

    await generateReport(SESSION_ID, 'associate', 42, true, TOPIC_BREAKDOWN)

    const savedReport = pool.query.mock.calls[0][1][0]
    expect(savedReport).not.toMatch(/<think>/i)
    expect(savedReport).toMatch(/## Overall Result/)
  })

  it('should NOT throw when Groq returns an empty response (non-fatal)', async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: '' } }],
    })

    // Should resolve without throwing
    await expect(
      generateReport(SESSION_ID, 'associate', 30, false, TOPIC_BREAKDOWN)
    ).resolves.toBeUndefined()
  })

  it('should NOT throw when Groq API call itself rejects (non-fatal)', async () => {
    mockCreate.mockRejectedValueOnce(new Error('Groq API rate limit exceeded'))

    // Should silently catch and log, not crash the exam submit flow
    await expect(
      generateReport(SESSION_ID, 'associate', 30, false, TOPIC_BREAKDOWN)
    ).resolves.toBeUndefined()

    // DB should NOT have been called (error happened before the save)
    expect(pool.query).not.toHaveBeenCalled()
  })

  it('should include weak domain names in the user prompt when score < 70%', async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: '## Overall Result\nYou need improvement.' } }],
    })

    // Thread 2 has 60% — below 70% threshold
    await generateReport(SESSION_ID, 'associate', 39, false, TOPIC_BREAKDOWN)

    const userPrompt = mockCreate.mock.calls[0][0].messages[1].content
    expect(userPrompt).toMatch(/WEAK AREAS IDENTIFIED/i)
    expect(userPrompt).toMatch(/Clause 6 — Risk/)
  })

  it('should NOT include weak domain section when all domains are >= 70%', async () => {
    mockCreate.mockResolvedValueOnce({
      choices: [{ message: { content: '## Overall Result\nExcellent!' } }],
    })

    const strongBreakdown = {
      '1': { domain: 'Domain 1', correct: 8, total: 10, pct: 80 },
      '2': { domain: 'Domain 2', correct: 8, total: 10, pct: 80 },
    }
    await generateReport(SESSION_ID, 'associate', 45, true, strongBreakdown)

    const userPrompt = mockCreate.mock.calls[0][0].messages[1].content
    expect(userPrompt).not.toMatch(/WEAK AREAS IDENTIFIED/i)
  })
})
