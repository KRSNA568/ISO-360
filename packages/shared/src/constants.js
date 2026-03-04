/**
 * @file constants.js
 * Shared constants used by both frontend and backend.
 * Import: const { TRACKS, SESSION_STATUS, ... } = require('@iso-audit360/shared/constants')
 */

// ── Exam Tracks ──────────────────────────────────────────────────────────────
const TRACKS = Object.freeze({
  ASSOCIATE:    'associate',
  PROFESSIONAL: 'professional',
})

// ── Session Status ───────────────────────────────────────────────────────────
const SESSION_STATUS = Object.freeze({
  GENERATING: 'generating',
  READY:      'ready',
  ACTIVE:     'active',
  COMPLETED:  'completed',
  EXPIRED:    'expired',
  ABORTED:    'aborted',
})

// ── Question Difficulty ──────────────────────────────────────────────────────
const DIFFICULTY = Object.freeze({
  EASY:   'easy',
  MEDIUM: 'medium',
  HARD:   'hard',
})

// ── Answer Options ───────────────────────────────────────────────────────────
const ANSWER_OPTIONS = Object.freeze(['A', 'B', 'C', 'D'])

// ── User Roles ───────────────────────────────────────────────────────────────
const ROLES = Object.freeze({
  USER:  'user',
  ADMIN: 'admin',
})

// ── Exam Configuration (per track) ─────────────────────────────────────────
const EXAM_CONFIG = Object.freeze({
   associate: Object.freeze({
    TOTAL_QUESTIONS:       50,     // 5 threads × 10 questions
    QUESTIONS_PER_THREAD:  10,
    TOTAL_THREADS:         5,
    EXAM_DURATION_SECONDS: 900,    // 15 minutes
    PASS_THRESHOLD:        40,     // 80% of 50
    PASS_THRESHOLD_PCT:    80,
  }),
  professional: Object.freeze({
    TOTAL_QUESTIONS:       100,    // 5 threads × 20 questions
    QUESTIONS_PER_THREAD:  20,
    TOTAL_THREADS:         5,
    EXAM_DURATION_SECONDS: 1800,   // 30 minutes
    PASS_THRESHOLD:        80,     // 80% of 100
    PASS_THRESHOLD_PCT:    80,
  }),
})

// ── Retake Policy ────────────────────────────────────────────────────────────
const RETAKE_POLICY = Object.freeze({
  MAX_ATTEMPTS_PER_30_DAYS: 3,
  COOLDOWN_HOURS:           24,
})

// ── AI Generation (Groq — free tier, OpenAI-compatible) ─────────────────────
const AI_CONFIG = Object.freeze({
  THREAD_TIMEOUT_MS:    60000,  // 60 seconds per thread
  RETRY_BACKOFF_MS:     3000,   // delay before retry
  MAX_FAILED_THREADS:   2,      // abort session if > 2 threads fail
  TEMPERATURE:          0.7,
  MAX_TOKENS_PER_THREAD:8000,   // enough for 20-question professional threads
  MODEL:                'llama-3.3-70b-versatile',
  BASE_URL:             'https://api.groq.com/openai/v1',
})

// ── Difficulty Distribution (base: per 10 questions — scales proportionally) ─
// Computed dynamically in promptBuilder via getDifficultyDistribution(n).
const DIFFICULTY_DISTRIBUTION = Object.freeze({
  easy:   3,  // 30%
  medium: 5,  // 50%
  hard:   2,  // 20%
})

// ── Domain Thread Map ────────────────────────────────────────────────────────
const THREAD_DOMAINS = Object.freeze({
  associate: {
    1: 'Context of the Organization & Scope (Clauses 4–5)',
    2: 'Planning & Risk Assessment (Clause 6)',
    3: 'Support — Competence, Awareness & Communication (Clause 7)',
    4: 'Operational Planning & Control (Clause 8)',
    5: 'Performance Evaluation, Internal Audit & Improvement (Clauses 9–10)',
  },
  professional: {
    1: 'Annex A.5 — Organizational Controls',
    2: 'Annex A.6 — People Controls & Annex A.7 — Physical Controls',
    3: 'Annex A.8 — Technological Controls',
    4: 'Nonconformity Scenario Auditing — Applied Case Studies',
    5: 'ISO 19011 Audit Principles — Conducting & Reporting ISO 27001 Audits',
  },
})

// ── OTP Configuration ────────────────────────────────────────────────────────
const OTP_CONFIG = Object.freeze({
  LENGTH:             6,
  EXPIRY_MINUTES:     10,
  MAX_ATTEMPTS:       5,
  MAX_RESEND_PER_HR:  3,
})

// ── Certificate ID format ────────────────────────────────────────────────────
const CERT_ID_PREFIX = 'ISO27-2026-'

// ── Suspicious Session Thresholds ────────────────────────────────────────────
const INTEGRITY_THRESHOLDS = Object.freeze({
  SUSPICIOUS_AVG_SECONDS_PER_Q: 4,    // avg < 4s/question → suspicious
  SUSPICIOUS_TAB_VIOLATIONS:    3,    // tab violations ≥ 3 → suspicious
  SUSPICIOUS_TOTAL_SECONDS:     300,  // completed in < 5 min (any exam) → suspicious
})

module.exports = {
  TRACKS,
  SESSION_STATUS,
  DIFFICULTY,
  ANSWER_OPTIONS,
  ROLES,
  EXAM_CONFIG,
  RETAKE_POLICY,
  AI_CONFIG,
  DIFFICULTY_DISTRIBUTION,
  THREAD_DOMAINS,
  OTP_CONFIG,
  CERT_ID_PREFIX,
  INTEGRITY_THRESHOLDS,
}
