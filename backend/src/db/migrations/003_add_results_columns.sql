-- ============================================================
-- Migration 003: Add result columns for scoring + AI reports
-- ============================================================
-- topic_breakdown holds per-domain performance after exam submission.
-- ai_report holds the Groq-generated 1-page markdown report.
-- Both are nullable — populated only after session is 'completed'.

ALTER TABLE exam_sessions
  ADD COLUMN IF NOT EXISTS topic_breakdown  JSONB,
  ADD COLUMN IF NOT EXISTS ai_report        TEXT;
