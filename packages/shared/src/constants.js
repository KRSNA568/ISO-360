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

// ── Exam Configuration ───────────────────────────────────────────────────────
const EXAM_CONFIG = Object.freeze({
  TOTAL_QUESTIONS:       50,    // total questions per exam
  QUESTIONS_PER_THREAD:  10,    // questions per AI thread
  TOTAL_THREADS:         5,     // parallel AI generation threads
  EXAM_DURATION_SECONDS: 600,   // 10 minutes total
  PER_QUESTION_LIMIT_S:  15,    // soft per-question guide (not hard-enforced client-side)
  PASS_THRESHOLD:        40,    // min correct answers to pass (80%)
  PASS_THRESHOLD_PCT:    80,    // percentage
})

// ── Retake Policy ────────────────────────────────────────────────────────────
const RETAKE_POLICY = Object.freeze({
  MAX_ATTEMPTS_PER_30_DAYS: 3,
  COOLDOWN_HOURS:           24,
})

// ── AI Generation ────────────────────────────────────────────────────────────
const AI_CONFIG = Object.freeze({
  THREAD_TIMEOUT_MS:    45000,  // 45 seconds per thread
  RETRY_BACKOFF_MS:     5000,   // delay before retry
  MAX_FAILED_THREADS:   2,      // abort session if > 2 threads fail
  TEMPERATURE:          0.8,
  MAX_TOKENS_PER_THREAD:4000,
  MODEL:                'gpt-4o',
})

// ── Difficulty Distribution per thread ──────────────────────────────────────
const DIFFICULTY_DISTRIBUTION = Object.freeze({
  easy:   3,  // 30% of 10 questions
  medium: 5,  // 50%
  hard:   2,  // 20%
})

// ── Domain Thread Map ────────────────────────────────────────────────────────
const THREAD_DOMAINS = Object.freeze({
  associate: {
    1: 'Context of the Organization & Scope (Clauses 4–5)',
    2: 'Planning & Risk Assessment (Clause 6)',
    3: 'Support, Operation & Controls (Clauses 7–8)',
    4: 'Performance Evaluation & Audit (Clause 9)',
    5: 'Improvement, Incident & Continual Review (Clause 10 + Annex A)',
  },
  professional: {
    1: 'Advanced Risk Management & Treatment (ISO 27005)',
    2: 'Lead Auditor Competency & Audit Program Management',
    3: 'Evidence-based Audit Techniques & Nonconformity Handling',
    4: 'Information Security Controls Deep-Dive (Annex A 8–9)',
    5: 'Regulatory, Legal & Supplier Chain Compliance',
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
  SUSPICIOUS_AVG_SECONDS_PER_Q: 4,    // avg < 4s → suspicious
  SUSPICIOUS_TAB_VIOLATIONS:    3,    // tab violations ≥ 3 → suspicious
  SUSPICIOUS_TOTAL_SECONDS:     180,  // completed in < 3 min → suspicious
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
