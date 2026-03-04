-- Migration 002: Fix score constraint to support Professional track (100 questions)
-- The original constraint capped score at 50 (Associate only).
-- Professional track can score 0–100.

ALTER TABLE exam_sessions
  DROP CONSTRAINT IF EXISTS exam_sessions_score_check;

ALTER TABLE exam_sessions
  ADD CONSTRAINT exam_sessions_score_check
    CHECK (score >= 0 AND score <= 100);
