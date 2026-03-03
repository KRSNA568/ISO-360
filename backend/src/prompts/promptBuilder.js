/**
 * @file promptBuilder.js
 * Shared prompt construction utilities for all AI generation threads.
 * Used by GenerationService to build OpenAI messages arrays.
 */
const { DIFFICULTY_DISTRIBUTION, AI_CONFIG } = require('@iso-audit360/shared/constants')

/**
 * Build the system prompt that establishes the AI persona.
 * @returns {string}
 */
function buildSystemPrompt() {
  return `You are a senior ISO 27001:2022 Lead Auditor Examination Designer with 15+ years of experience designing professional certification assessments. Your questions are used in high-stakes certification exams administered to GRC professionals and ISMS consultants.

Your role is strictly as an examination designer — not as a tutor or explainer. You write questions that assess genuine auditor judgment and applied knowledge, not rote memorization.

CRITICAL RULES YOU MUST FOLLOW:
1. NEVER reproduce text verbatim from the ISO 27001:2022 standard. Always paraphrase clause concepts in your own words.
2. Every question must present a real-world audit scenario or applied judgment situation — not a pure definition test.
3. Wrong answer options (distractors) MUST represent plausible mistakes an inexperienced auditor might make. Avoid obviously wrong options.
4. Do NOT include tricks, wordplay, double negatives, or "which of the following is NOT" constructions.
5. Each question must be self-contained and answerable without reference to other questions.
6. Ensure the explanation clearly states WHY the correct answer is correct and WHY each distractor is wrong.
7. Difficulty distribution: ${DIFFICULTY_DISTRIBUTION.easy} easy, ${DIFFICULTY_DISTRIBUTION.medium} medium, ${DIFFICULTY_DISTRIBUTION.hard} hard per set of 10.
8. You MUST return ONLY valid JSON conforming to the specified schema — no prose, no markdown, no apologies.`
}

/**
 * Build the output format instruction block (JSON schema reminder).
 * @param {string} track - 'associate' | 'professional'
 * @param {number} thread - 1–5
 * @param {string} idPrefix - e.g. 'A' or 'P'
 * @param {number} startSeq - starting sequence number for IDs
 * @returns {string}
 */
function buildSchemaInstruction(track, thread, idPrefix, startSeq = 1) {
  return `
Return your response as a JSON object with this exact structure:
{
  "questions": [
    {
      "id": "${idPrefix}-T${thread}-${String(startSeq).padStart(4, '0')}",
      "thread": ${thread},
      "domain": "<domain name>",
      "stem": "<question text — minimum 20 characters, maximum 800 characters>",
      "options": ["<Option A text>", "<Option B text>", "<Option C text>", "<Option D text>"],
      "correct_option": "<A|B|C|D>",
      "explanation": "<minimum 50 characters explaining why the correct answer is correct and why each wrong option is incorrect>",
      "clause_ref": "<ISO 27001:2022 Clause X.X or Annex A control reference>",
      "difficulty": "<easy|medium|hard>"
    }
  ]
}

Rules for IDs: Use sequential IDs starting from ${idPrefix}-T${thread}-${String(startSeq).padStart(4, '0')}.
Rules for options: All 4 options must be plausible. One must be clearly correct when you know the standard. Distractors should represent common auditor misconceptions.
Rules for explanations: Must be at least 2 sentences. Must reference the clause. Must explain why each wrong option falls short.`
}

/**
 * Builds the full messages array for OpenAI API call.
 * @param {object} params
 * @param {string} params.systemPrompt - the role-setting prompt
 * @param {string} params.userPrompt - the thread-specific question generation request
 * @returns {Array<{role: string, content: string}>}
 */
function buildMessages({ systemPrompt, userPrompt }) {
  return [
    { role: 'system',    content: systemPrompt },
    { role: 'user',      content: userPrompt },
  ]
}

/**
 * Standard OpenAI call config for all threads.
 */
const OPENAI_CALL_CONFIG = {
  model:           AI_CONFIG.MODEL,
  temperature:     AI_CONFIG.TEMPERATURE,
  max_tokens:      AI_CONFIG.MAX_TOKENS_PER_THREAD,
  response_format: { type: 'json_object' },
}

module.exports = {
  buildSystemPrompt,
  buildSchemaInstruction,
  buildMessages,
  OPENAI_CALL_CONFIG,
}
