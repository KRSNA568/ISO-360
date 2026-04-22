/**
 * @file schemas.js
 * AJV-compatible JSON Schema for the Question object.
 * Used by backend (ajv validation) and frontend (form validation reference).
 * Import: const { QUESTION_SCHEMA, QUESTION_ARRAY_SCHEMA } = require('@27001certified/shared/schemas')
 */

/**
 * JSON Schema for a single Question object.
 * Matches the format returned by OpenAI and stored in exam_sessions.questions JSONB.
 */
const QUESTION_SCHEMA = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  required: ['id', 'thread', 'domain', 'stem', 'options', 'correct_option', 'explanation', 'clause_ref', 'difficulty'],
  additionalProperties: false,
  properties: {
    id: {
      type: 'string',
      pattern: '^[AP]-T[1-5]-[0-9]{4}$',
      description: 'Unique question ID: A or P (track), T1-T5 (thread), 4-digit sequence',
      examples: ['A-T1-0023', 'P-T3-0007'],
    },
    thread: {
      type: 'integer',
      minimum: 1,
      maximum: 5,
      description: 'AI generation thread index (corresponds to domain)',
    },
    domain: {
      type: 'string',
      minLength: 5,
      description: 'ISO 27001 domain name for this question',
    },
    stem: {
      type: 'string',
      minLength: 20,
      maxLength: 1000,
      description: 'The question text. Must not reproduce ISO standard verbatim.',
    },
    options: {
      type: 'array',
      items: { type: 'string', minLength: 5, maxLength: 500 },
      minItems: 4,
      maxItems: 4,
      description: 'Four answer options [A, B, C, D] in order',
    },
    correct_option: {
      type: 'string',
      enum: ['A', 'B', 'C', 'D'],
      description: 'Which option index is correct',
    },
    explanation: {
      type: 'string',
      minLength: 30,
      maxLength: 1500,
      description: 'Why the correct answer is correct. Should reference clause.',
    },
    clause_ref: {
      type: 'string',
      minLength: 3,
      maxLength: 100,
      description: 'ISO 27001:2022 clause reference, e.g. "Clause 6.1.2"',
    },
    difficulty: {
      type: 'string',
      enum: ['easy', 'medium', 'hard'],
    },
  },
}

/**
 * JSON Schema for an array of 10 questions (one AI thread output).
 */
const THREAD_QUESTIONS_SCHEMA = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  required: ['questions'],
  properties: {
    questions: {
      type: 'array',
      items: QUESTION_SCHEMA,
      minItems: 10,
      maxItems: 10,
    },
  },
}

/**
 * JSON Schema for a full exam (50 questions = 5 threads merged).
 */
const EXAM_QUESTIONS_SCHEMA = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'array',
  items: QUESTION_SCHEMA,
  minItems: 50,
  maxItems: 50,
}

/**
 * JSON Schema for an answer submission object.
 */
const ANSWER_SCHEMA = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  type: 'object',
  required: ['q_id', 'answer', 'time_taken_ms'],
  additionalProperties: false,
  properties: {
    q_id:          { type: 'string', pattern: '^[AP]-T[1-5]-[0-9]{4}$' },
    answer:        { type: 'string', enum: ['A', 'B', 'C', 'D'] },
    time_taken_ms: { type: 'integer', minimum: 0, maximum: 30000 },
  },
}

/**
 * JSON Schema for a buffer question (same as Question but with track field added).
 */
const BUFFER_QUESTION_SCHEMA = {
  ...QUESTION_SCHEMA,
  required: [...QUESTION_SCHEMA.required, 'track'],
  properties: {
    ...QUESTION_SCHEMA.properties,
    track: {
      type: 'string',
      enum: ['associate', 'professional'],
    },
  },
}

module.exports = {
  QUESTION_SCHEMA,
  THREAD_QUESTIONS_SCHEMA,
  EXAM_QUESTIONS_SCHEMA,
  ANSWER_SCHEMA,
  BUFFER_QUESTION_SCHEMA,
}
