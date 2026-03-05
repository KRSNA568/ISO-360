-- Migration 005: Add `retired` flag to buffer_questions (soft-delete for admin)
-- Also adds `source` and `tags` columns for richer admin question management.

ALTER TABLE buffer_questions
  ADD COLUMN IF NOT EXISTS retired     BOOLEAN  NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS source      TEXT,
  ADD COLUMN IF NOT EXISTS tags        TEXT[]   NOT NULL DEFAULT '{}';

CREATE INDEX IF NOT EXISTS idx_buffer_questions_retired ON buffer_questions(retired);
CREATE INDEX IF NOT EXISTS idx_buffer_questions_track_retired ON buffer_questions(track, retired);
