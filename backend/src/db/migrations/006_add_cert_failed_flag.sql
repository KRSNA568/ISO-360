-- Migration 006: Add cert_failed flag to exam_sessions so frontend can
-- distinguish "cert still generating" from "cert generation failed".

ALTER TABLE exam_sessions
  ADD COLUMN IF NOT EXISTS cert_failed BOOLEAN NOT NULL DEFAULT FALSE;
