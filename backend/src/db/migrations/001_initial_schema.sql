-- ============================================================
-- ISO-Audit360.com — Initial Database Schema
-- Migration: 001_initial_schema.sql
-- Applied to: Supabase PostgreSQL 16
-- Date: 2026-03-04
-- Author: Phase 0 setup
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";   -- gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pg_trgm";    -- fast LIKE search on emails/names

-- ============================================================
-- TABLE: users
-- ============================================================
CREATE TABLE users (
  id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name       TEXT        NOT NULL,
  email           TEXT        UNIQUE NOT NULL,
  password_hash   TEXT,                             -- nullable: set on first login setup
  company         TEXT,
  job_role        TEXT,
  country         TEXT,
  email_verified  BOOLEAN     NOT NULL DEFAULT FALSE,
  role            TEXT        NOT NULL DEFAULT 'user'
                              CHECK (role IN ('user', 'admin')),
  -- Admin-managed blocking (PRD-ADMIN §4.4)
  blocked         BOOLEAN     NOT NULL DEFAULT FALSE,
  blocked_reason  TEXT,
  blocked_at      TIMESTAMPTZ,
  -- Soft-delete for GDPR right-to-erasure
  deleted_at      TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email        ON users(email);
CREATE INDEX idx_users_created_at   ON users(created_at);
CREATE INDEX idx_users_blocked      ON users(blocked);
CREATE INDEX idx_users_deleted_at   ON users(deleted_at) WHERE deleted_at IS NULL;
-- Trigram index for partial-match admin search
CREATE INDEX idx_users_email_trgm   ON users USING gin (email gin_trgm_ops);
CREATE INDEX idx_users_name_trgm    ON users USING gin (full_name gin_trgm_ops);

-- ============================================================
-- TABLE: otps
-- ============================================================
CREATE TABLE otps (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  code        CHAR(6)     NOT NULL,
  purpose     TEXT        NOT NULL DEFAULT 'email_verify'
                          CHECK (purpose IN ('email_verify', 'password_reset')),
  expires_at  TIMESTAMPTZ NOT NULL,
  used        BOOLEAN     NOT NULL DEFAULT FALSE,
  attempts    INTEGER     NOT NULL DEFAULT 0,       -- track wrong-guess count (max 5)
  ip_address  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_otps_user_id    ON otps(user_id);
CREATE INDEX idx_otps_expires_at ON otps(expires_at);

-- ============================================================
-- TABLE: refresh_tokens
-- ============================================================
CREATE TABLE refresh_tokens (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash  TEXT        UNIQUE NOT NULL,    -- SHA-256 of the raw token
  expires_at  TIMESTAMPTZ NOT NULL,
  revoked     BOOLEAN     NOT NULL DEFAULT FALSE,
  ip_address  TEXT,
  user_agent  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_refresh_tokens_user_id    ON refresh_tokens(user_id);
CREATE INDEX idx_refresh_tokens_expires_at ON refresh_tokens(expires_at);

-- ============================================================
-- TABLE: exam_sessions
-- ============================================================
CREATE TABLE exam_sessions (
  id                    UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id               UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  track                 TEXT        NOT NULL CHECK (track IN ('associate', 'professional')),
  status                TEXT        NOT NULL DEFAULT 'generating'
                                    CHECK (status IN (
                                      'generating', 'ready', 'active',
                                      'completed', 'expired', 'aborted'
                                    )),
  -- Generation metadata
  generation_method     TEXT                                      -- 'ai' | 'buffer' | 'mixed'
                                    CHECK (generation_method IN ('ai', 'buffer', 'mixed')),
  generation_errors     JSONB       NOT NULL DEFAULT '[]',        -- thread-level error log
  -- Exam content
  questions             JSONB       NOT NULL DEFAULT '[]',        -- 50 QuestionObject[]
  answers               JSONB       NOT NULL DEFAULT '[]',        -- AnswerObject[]
  -- Results
  score                 INTEGER     CHECK (score >= 0 AND score <= 50),
  passed                BOOLEAN,
  -- Integrity signals
  tab_violations        INTEGER     NOT NULL DEFAULT 0,
  ip_address            TEXT,
  user_agent            TEXT,
  device_fingerprint    TEXT,
  -- Admin flags (PRD-ADMIN §5.6)
  suspicious            BOOLEAN     NOT NULL DEFAULT FALSE,
  suspicious_reason     TEXT,
  aborted_by_admin      BOOLEAN     NOT NULL DEFAULT FALSE,
  aborted_reason        TEXT,
  -- Timestamps
  started_at            TIMESTAMPTZ,
  completed_at          TIMESTAMPTZ,
  expires_at            TIMESTAMPTZ,   -- started_at + 600 seconds
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_exam_sessions_user_id    ON exam_sessions(user_id);
CREATE INDEX idx_exam_sessions_status     ON exam_sessions(status);
CREATE INDEX idx_exam_sessions_track      ON exam_sessions(track);
CREATE INDEX idx_exam_sessions_created_at ON exam_sessions(created_at);
CREATE INDEX idx_exam_sessions_suspicious ON exam_sessions(suspicious) WHERE suspicious = TRUE;

-- ============================================================
-- TABLE: certificates
-- ============================================================
CREATE TABLE certificates (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_id      TEXT        UNIQUE NOT NULL,  -- e.g. ISO27-2026-A1B2C3D4
  user_id             UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  exam_session_id     UUID        UNIQUE NOT NULL REFERENCES exam_sessions(id),
  track               TEXT        NOT NULL CHECK (track IN ('associate', 'professional')),
  full_name           TEXT        NOT NULL,          -- snapshot at time of award
  score               INTEGER     NOT NULL,
  awarded_on          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  r2_url_landscape    TEXT,                          -- 1920×1080 JPEG in Cloudflare R2
  r2_url_square       TEXT,                          -- 1080×1080 JPEG in Cloudflare R2
  -- Revocation (PRD-ADMIN §6.4)
  revoked             BOOLEAN     NOT NULL DEFAULT FALSE,
  revoked_reason      TEXT,
  revoked_at          TIMESTAMPTZ,
  revoked_by          UUID        REFERENCES users(id),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_certificates_certificate_id ON certificates(certificate_id);
CREATE INDEX idx_certificates_user_id        ON certificates(user_id);
CREATE INDEX idx_certificates_awarded_on     ON certificates(awarded_on);
CREATE INDEX idx_certificates_revoked        ON certificates(revoked);
CREATE INDEX idx_certificates_cert_id_trgm   ON certificates USING gin (certificate_id gin_trgm_ops);

-- ============================================================
-- TABLE: question_fingerprints
-- (Prevents question overlap across a user's last 3 attempts)
-- ============================================================
CREATE TABLE question_fingerprints (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  track            TEXT        NOT NULL CHECK (track IN ('associate', 'professional')),
  stem_hash        TEXT        NOT NULL,  -- SHA-256 of the question stem (lowercase trimmed)
  thread           INTEGER     NOT NULL CHECK (thread BETWEEN 1 AND 5),
  exam_session_id  UUID        NOT NULL REFERENCES exam_sessions(id) ON DELETE CASCADE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_fingerprints_user_track ON question_fingerprints(user_id, track);
CREATE INDEX idx_fingerprints_stem_hash  ON question_fingerprints(stem_hash);

-- ============================================================
-- TABLE: question_flags
-- (Users flag inaccurate questions from the results screen)
-- ============================================================
CREATE TABLE question_flags (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_session_id  UUID        NOT NULL REFERENCES exam_sessions(id) ON DELETE CASCADE,
  user_id          UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_id      TEXT        NOT NULL,   -- e.g. "A-T1-0012"
  question_stem    TEXT        NOT NULL,   -- full stem at time of flagging
  flag_reason      TEXT        NOT NULL    CHECK (length(flag_reason) <= 500),
  status           TEXT        NOT NULL DEFAULT 'open'
                               CHECK (status IN ('open', 'reviewed', 'dismissed', 'escalated')),
  admin_note       TEXT,
  reviewed_by      UUID        REFERENCES users(id),
  reviewed_at      TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_question_flags_question_id ON question_flags(question_id);
CREATE INDEX idx_question_flags_status      ON question_flags(status);
CREATE INDEX idx_question_flags_user_id     ON question_flags(user_id);

-- ============================================================
-- TABLE: question_blocklist
-- (Escalated questions are blocked from future AI generations)
-- ============================================================
CREATE TABLE question_blocklist (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  stem_hash    TEXT        UNIQUE NOT NULL,
  question_id  TEXT,
  reason       TEXT,
  added_by     UUID        NOT NULL REFERENCES users(id),
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_blocklist_stem_hash ON question_blocklist(stem_hash);

-- ============================================================
-- TABLE: buffer_questions
-- (Pre-validated fallback questions for AI generation failure)
-- ============================================================
CREATE TABLE buffer_questions (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id   TEXT        UNIQUE NOT NULL,  -- e.g. "A-T1-B001"
  track         TEXT        NOT NULL CHECK (track IN ('associate', 'professional')),
  thread        INTEGER     NOT NULL CHECK (thread BETWEEN 1 AND 5),
  domain        TEXT        NOT NULL,
  stem          TEXT        NOT NULL,
  options       JSONB       NOT NULL,          -- ["Option A", "Option B", "Option C", "Option D"]
  correct_option TEXT       NOT NULL CHECK (correct_option IN ('A', 'B', 'C', 'D')),
  explanation   TEXT        NOT NULL,
  clause_ref    TEXT        NOT NULL,
  difficulty    TEXT        NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  stem_hash     TEXT        NOT NULL,          -- for blocklist cross-check
  times_used    INTEGER     NOT NULL DEFAULT 0,
  added_by      UUID        NOT NULL REFERENCES users(id),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_buffer_track_thread ON buffer_questions(track, thread);

-- ============================================================
-- TABLE: admin_audit_log
-- (Tamper-evident log of all admin write actions)
-- ============================================================
CREATE TABLE admin_audit_log (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id     UUID        NOT NULL REFERENCES users(id),
  action       TEXT        NOT NULL,  -- e.g. 'revoke_certificate', 'block_user'
  target_type  TEXT        NOT NULL,  -- 'certificate' | 'user' | 'session' | 'question'
  target_id    TEXT        NOT NULL,  -- uuid or id of affected resource
  metadata     JSONB,                 -- before/after state, reason, etc.
  ip_address   TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_log_admin_id   ON admin_audit_log(admin_id);
CREATE INDEX idx_audit_log_created_at ON admin_audit_log(created_at);
CREATE INDEX idx_audit_log_target     ON admin_audit_log(target_type, target_id);

-- ============================================================
-- FUNCTION: auto-update updated_at timestamps
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_buffer_updated_at
  BEFORE UPDATE ON buffer_questions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY (enable but configure via Supabase UI)
-- ============================================================
ALTER TABLE users              ENABLE ROW LEVEL SECURITY;
ALTER TABLE otps               ENABLE ROW LEVEL SECURITY;
ALTER TABLE refresh_tokens     ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_sessions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates       ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_fingerprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_flags     ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_blocklist ENABLE ROW LEVEL SECURITY;
ALTER TABLE buffer_questions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_log    ENABLE ROW LEVEL SECURITY;

-- NOTE: RLS policies are managed server-side because our backend uses a
-- service-role key (bypasses RLS). Policies are added as documentation
-- and for direct DB access auditing only.
