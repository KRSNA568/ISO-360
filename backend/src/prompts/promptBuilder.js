/**
 * @file promptBuilder.js
 * Shared prompt construction utilities for all AI generation threads.
 * Uses Groq (OpenAI-compatible API) with llama-3.3-70b-versatile — free tier.
 * Used by GenerationService to build messages arrays and create the AI client.
 */
const { AI_CONFIG } = require('@iso-audit360/shared/constants')

/**
 * Compute difficulty distribution proportionally for any question count.
 * Ratio: 30% easy, 50% medium, 20% hard.
 * @param {number} questionsCount
 * @returns {{ easy: number, medium: number, hard: number }}
 */
function getDifficultyDistribution(questionsCount) {
  const easy   = Math.floor(questionsCount * 0.3)
  const hard   = Math.floor(questionsCount * 0.2)
  const medium = questionsCount - easy - hard
  return { easy, medium, hard }
}

/**
 * Build the system prompt that establishes the AI persona.
 * @param {number} [questionsCount=10]
 * @returns {string}
 */
function buildSystemPrompt(questionsCount = 10) {
  const dist = getDifficultyDistribution(questionsCount)
  return `You are a senior ISO 27001:2022 Lead Auditor Examination Designer with 15+ years of experience designing professional certification assessments. Your questions are used in high-stakes certification exams administered to GRC professionals and ISMS consultants.

Your role is strictly as an examination designer — not as a tutor or explainer. You write questions that assess genuine auditor judgment and applied knowledge, not rote memorization.

CRITICAL RULES YOU MUST FOLLOW:
1. NEVER reproduce text verbatim from the ISO 27001:2022 standard. Always paraphrase clause concepts in your own words.
2. Every question must present a real-world audit scenario or applied judgment situation — not a pure definition test.
3. Wrong answer options (distractors) MUST represent plausible mistakes an inexperienced auditor might make. Avoid obviously wrong options.
4. Do NOT include tricks, wordplay, double negatives, or "which of the following is NOT" constructions.
5. Each question must be self-contained and answerable without reference to other questions.
6. Ensure the explanation clearly states WHY the correct answer is correct and WHY each distractor is wrong.
7. Difficulty distribution: ${dist.easy} easy, ${dist.medium} medium, ${dist.hard} hard across the ${questionsCount} questions.
8. You MUST return ONLY valid JSON conforming to the specified schema — no prose, no markdown, no apologies.`
}

/**
 * Build the output format instruction block (JSON schema reminder).
 * @param {string} track - 'associate' | 'professional'
 * @param {number} thread - 1–5
 * @param {string} idPrefix - e.g. 'A' or 'P'
 * @param {number} startSeq - starting sequence number for IDs
 * @param {number} [questionsCount=10] - exact number of questions to generate
 * @returns {string}
 */
function buildSchemaInstruction(track, thread, idPrefix, startSeq = 1, questionsCount = 10) {
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

Generate exactly ${questionsCount} question objects in the "questions" array.
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
/**
 * Standard AI call config for Groq (OpenAI-compatible).
 * Use with: new OpenAI({ apiKey: process.env.GROQ_API_KEY, baseURL: AI_CONFIG.BASE_URL })
 */
const AI_CALL_CONFIG = {
  model:           AI_CONFIG.MODEL,
  temperature:     AI_CONFIG.TEMPERATURE,
  max_tokens:      AI_CONFIG.MAX_TOKENS_PER_THREAD,
  response_format: { type: 'json_object' },
}

/**
 * Create and return a Groq client (OpenAI-compatible).
 * Uses the openai package pointed at Groq's API endpoint — no extra dependencies.
 * @returns {import('openai').OpenAI}
 */
function createAIClient() {
  const { OpenAI } = require('openai')
  return new OpenAI({
    apiKey:  process.env.GROQ_API_KEY,
    baseURL: AI_CONFIG.BASE_URL,
  })
}

module.exports = {
  buildSystemPrompt,
  buildSchemaInstruction,
  buildMessages,
  getDifficultyDistribution,
  createAIClient,
  AI_CALL_CONFIG,
  // legacy alias so any existing code referencing OPENAI_CALL_CONFIG still works
  OPENAI_CALL_CONFIG: undefined,
}
