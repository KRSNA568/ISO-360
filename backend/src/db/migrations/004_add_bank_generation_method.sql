-- Migration 004: Allow 'bank' as a valid generation_method value.
-- The original inline CHECK constraint in 001_initial_schema only permitted
-- 'ai' | 'buffer' | 'mixed'. PostgreSQL auto-names inline constraints as
-- <table>_<column>_check, so we drop by that name and recreate with 'bank'.

ALTER TABLE exam_sessions
  DROP CONSTRAINT IF EXISTS exam_sessions_generation_method_check;

ALTER TABLE exam_sessions
  ADD CONSTRAINT exam_sessions_generation_method_check
    CHECK (generation_method IN ('ai', 'buffer', 'mixed', 'bank'));
