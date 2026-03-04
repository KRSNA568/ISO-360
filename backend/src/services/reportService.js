/**
 * @file reportService.js
 * Generates a personalised 1-page AI performance report after exam submission.
 * Called fire-and-forget from the submit endpoint.
 * Uses the same Groq client as generationService.
 */

const pool   = require('../config/db')
const { createAIClient } = require('../prompts/promptBuilder')
const { EXAM_CONFIG, THREAD_DOMAINS } = require('@iso-audit360/shared/constants')

/**
 * Generate and persist an AI report for a completed session.
 *
 * @param {string} sessionId
 * @param {'associate'|'professional'} track
 * @param {number} score           - number of correct answers
 * @param {boolean} passed
 * @param {object} topicBreakdown  - { "1": { domain, correct, total, pct }, ... }
 */
async function generateReport(sessionId, track, score, passed, topicBreakdown) {
  try {
    const config      = EXAM_CONFIG[track]
    const trackLabel  = track === 'professional' ? 'Professional' : 'Associate'
    const scorePct    = Math.round((score / config.TOTAL_QUESTIONS) * 100)
    const passLabel   = passed ? 'PASSED ✓' : 'FAILED ✗'

    // Build domain performance lines
    const domainLines = Object.entries(topicBreakdown)
      .sort(([a], [b]) => Number(a) - Number(b))
      .map(([, d]) => `- ${d.domain}: ${d.correct}/${d.total} (${d.pct}%)`)
      .join('\n')

    // Identify weak areas (< 70%)
    const weakDomains = Object.values(topicBreakdown)
      .filter((d) => d.pct < 70)
      .map((d) => d.domain)

    const systemPrompt =
      `You are a senior ISO 27001:2022 Lead Auditor writing a concise, professional performance ` +
      `report for a certification exam candidate. Use clear and constructive language. ` +
      `Be specific about ISO 27001:2022 clauses and Annex A controls in your recommendations. ` +
      `Your report must use markdown formatting with the exact section headings provided.`

    const userPrompt =
      `Generate a 1-page performance report for the following ISO 27001:2022 ${trackLabel} exam result.\n\n` +
      `EXAM RESULT:\n` +
      `- Result: ${passLabel}\n` +
      `- Score: ${score}/${config.TOTAL_QUESTIONS} (${scorePct}%)\n` +
      `- Pass threshold: ${config.PASS_THRESHOLD_PCT}% (${config.PASS_THRESHOLD}/${config.TOTAL_QUESTIONS})\n` +
      `- Track: ${trackLabel}\n\n` +
      `DOMAIN PERFORMANCE:\n${domainLines}\n\n` +
      (weakDomains.length > 0
        ? `WEAK AREAS IDENTIFIED (below 70%):\n${weakDomains.map((d) => `- ${d}`).join('\n')}\n\n`
        : '') +
      `Write the report with EXACTLY these section headings (use ## prefix):\n` +
      `## Overall Result\n` +
      `## Performance by Domain\n` +
      `## Strengths\n` +
      `## Areas for Improvement\n` +
      `## Study Recommendations\n` +
      `## Next Steps\n\n` +
      `Keep each section to 2–4 sentences. Make study recommendations specific — name the exact ISO 27001:2022 clauses or Annex A controls to revisit. ` +
      `If the candidate passed, acknowledge it but still highlight improvement opportunities.`

    const client   = createAIClient()
    const response = await client.chat.completions.create({
      model:       'meta-llama/llama-4-maverick-17b-128e-instruct',
      temperature: 0.5,
      max_tokens:  1200,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userPrompt },
      ],
    })

    const raw    = response.choices[0]?.message?.content?.trim()
    if (!raw) throw new Error('Empty response from Groq')

    // Strip any <think>…</think> reasoning blocks just in case
    const report = raw.replace(/<think>[\s\S]*?<\/think>/gi, '').trim()
    if (!report) throw new Error('Report was empty after stripping reasoning block')

    await pool.query(
      'UPDATE exam_sessions SET ai_report = $1 WHERE id = $2',
      [report, sessionId],
    )

    console.log(`[Report] ✅ Report saved for session ${sessionId}`)
  } catch (err) {
    console.error(`[Report] ✗ Failed for session ${sessionId}:`, err.message)
    // Non-fatal — the results page handles null ai_report gracefully
  }
}

module.exports = { generateReport }
