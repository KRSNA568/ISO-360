# ISO-Audit360 / 27001certified Project Guide

This repository is a monorepo for an ISO 27001:2022 certification platform. It contains a Node/Express backend, a Vite/React frontend, and a small shared package used by both sides.

The product branding is mixed across files: the root package is `iso-audit360`, many backend/frontend files still say `27001certified`, and the public API spec describes `ISO-Audit360`. Treat those names as the same project unless a file clearly indicates otherwise.

## What The App Does

The platform lets users:

- Register, verify email with OTP, log in, and manage their profile.
- Start ISO 27001 exams on two tracks: `associate` and `professional`.
- Answer timed questions, submit the exam, and receive a score breakdown.
- Receive an AI-generated performance report after submission.
- Earn a certificate if they pass, then verify it publicly.
- View blog content and use a public certificate verification page.
- Use an admin portal to manage users, sessions, certificates, flags, and audit logs.

The exam experience is intentionally integrity-focused. The backend tracks tab violations, suspicious completion timing, retake limits, and question flags.

## Monorepo Layout

- `backend/` Express API, database access, services, migrations, tests, and scripts.
- `frontend/` React/Vite SPA, routing, page components, Playwright E2E tests, static assets.
- `packages/shared/` constants, schemas, and utility helpers shared by both apps.
- `openapi.yaml` API contract and route reference.
- `TESTING.md` test workflow and coverage notes.
- `SEO_*.md` and `PRD*` files are product and SEO planning docs, not runtime code.

## Primary Entry Points

- `backend/src/server.js` starts the API server, loads local env in non-production, and handles graceful shutdown.
- `backend/src/app.js` wires security middleware, CORS, JSON parsing, health check, routers, 404s, and the error handler.
- `frontend/src/main.jsx` boots the React app.
- `frontend/src/App.jsx` defines all frontend routes and auth/admin route grouping.

## How To Run

Root package scripts:

- `npm run dev` runs frontend and backend together.
- `npm run build` builds frontend then backend.
- `npm run lint` runs both linters.
- `npm run format` runs both formatters.
- `npm test` runs backend tests.
- `npm run test:e2e` runs frontend Playwright tests.

Per workspace:

- `cd backend && npm run dev` starts the API with nodemon.
- `cd backend && npm test` runs Jest integration tests.
- `cd frontend && npm run dev` starts Vite.
- `cd frontend && npm run test:e2e` runs Playwright.

Important local defaults:

- Backend listens on port `5000` unless `PORT` is set.
- Frontend is Vite-based, so the dev server is usually on `5173`.
- Backend CORS defaults to `FRONTEND_URL=http://localhost:3000` if not set, so local dev usually needs `FRONTEND_URL` pointed at the real frontend origin.

## Environment Variables

Common backend env vars used in code:

- `DATABASE_URL` PostgreSQL connection string.
- `DATABASE_SSL` optional SSL override for local development: `disable` turns SSL off, `require` forces it on. Unset, SSL stays on everywhere except a localhost `DATABASE_URL`. Ignored in production, which always uses SSL with the chain unverified.
- `JWT_SECRET` access-token signing secret.
- `REFRESH_TOKEN_SECRET` refresh-token signing secret.
- `JWT_EXPIRES_IN` access-token TTL, default `24h`.
- `FRONTEND_URL` comma-separated allowlist for CORS and verify links.
- `REDIS_URL` Redis endpoint. If missing or still an HTTP/HTTPS Upstash URL, rate-limits fail open.
- `RESEND_API_KEY` email provider key.
- `EMAIL_FROM` sender address for transactional emails.
- `SUPABASE_URL` Supabase URL for certificate storage.
- `SUPABASE_SERVICE_ROLE_KEY` Supabase service role key.
- `SUPABASE_CERT_BUCKET` certificate bucket name, default `certificates`.
- `RETAKE_MAX_ATTEMPTS` override for retake policy.
- `RETAKE_WINDOW_DAYS` override for the retake window.
- `GROQ_API_KEY` used by the Groq/OpenAI-compatible client for AI reports and generation helpers.
- `NODE_ENV` controls logging, error detail, and local env loading.
- `PORT` API port.

Test-only env vars are described in `TESTING.md`, including `TEST_DATABASE_URL`, `TEST_REDIS_URL`, `TEST_REDIS_TOKEN`, `TEST_JWT_SECRET`, and `TEST_REFRESH_TOKEN_SECRET`.

## Backend Architecture

### Middleware And Infrastructure

- `backend/src/middlewares/authenticate.js` requires a Bearer JWT and verifies it with `JWT_SECRET`.
- `backend/src/middlewares/requireAdmin.js` guards admin routes.
- `backend/src/middlewares/rateLimiter.js` handles auth and OTP limits.
- `backend/src/middlewares/errorHandler.js` sends structured JSON errors and only includes stack traces in development for 5xx errors.
- `backend/src/config/db.js` is a `pg` pool with SSL enabled.
- `backend/src/config/redis.js` creates a real Redis client when the URL is a `rediss://` style endpoint; otherwise it returns a fail-open dummy client.
- `backend/src/config/storage.js` lazily creates a Supabase storage client.

### Route Map

Registered in `backend/src/app.js`:

- `GET /api/health` health check plus a live DB probe.
- `/api/auth` authentication and account recovery.
- `/api/user` profile and account management.
- `/api/session` exam lifecycle.
- `/api/certificates` certificate lookups and verification.
- `/api/admin` admin portal operations.
- `/api/questions` candidate question flags.

### Auth Routes

`backend/src/routes/auth.js` covers:

- `POST /api/auth/register` creates a user and sends OTP.
- `POST /api/auth/verify-otp` verifies OTP and returns access and refresh tokens.
- `POST /api/auth/resend-otp` resends OTP with per-email and per-IP limits.
- `POST /api/auth/login` handles email/password login.
- `POST /api/auth/refresh` rotates refresh tokens.
- `POST /api/auth/logout` revokes refresh tokens.
- `POST /api/auth/forgot-password` and `POST /api/auth/reset-password` support password recovery.

Implementation details worth preserving:

- Passwords are hashed with bcrypt.
- OTPs are six digits.
- Refresh tokens are stored hashed, never in plaintext.
- Redis per-email OTP counting is best-effort; if Redis is unavailable, the app logs a warning and continues with IP-based protection.

### User Routes

`backend/src/routes/user.js` provides:

- `GET /api/user/me` profile plus attempt summary.
- `PATCH /api/user/me` update editable profile fields.
- `DELETE /api/user/me` soft delete and revoke refresh tokens.
- `GET /api/user/attempts` paginated attempt history.
- `GET /api/user/certificates` certificate list for the signed-in user.

### Session Routes

`backend/src/routes/session.js` is the exam engine. Key endpoints:

- `GET /api/session/history` completed session history for the user.
- `POST /api/session/create` creates a new session from the static question bank.
- `GET /api/session/:id/status` polls session progress.
- `POST /api/session/:id/abort` aborts a generating session.
- `POST /api/session/:id/start` transitions a ready session to active and returns questions without answers.
- `POST /api/session/:id/answer` upserts one answer at a time.
- `POST /api/session/:id/submit` scores the exam, persists results, and kicks off async report/certificate work.
- `POST /api/session/:id/heartbeat` increments tab violation count.
- `GET /api/session/:id/report` returns score, topic breakdown, AI report, suspicious flags, question reviews, and certificate info.

Important behavior:

- Exam sessions are drawn from the static question bank; AI generation is currently commented out in the creation flow.
- `create` prevents duplicate active sessions for the same user and track.
- Retake limits use shared defaults unless overridden by env vars.
- When an exam is submitted, the backend clears `questions` from the completed session and keeps a full review in `answers`.
- `submit` fires `generateReport(...)` asynchronously and, if the candidate passed, generates a certificate and sends the award email asynchronously.
- Suspicious scoring is based on average seconds per question, tab violations, and very short completion time.

### Certificate Routes

`backend/src/routes/certificate.js` exposes:

- `GET /api/certificates/verify/:certId` public verification for QR scans and the public verify page.
- `GET /api/certificates/:certId` authenticated full certificate details for the owner.

### Question Flag Routes

`backend/src/routes/questions.js` exposes:

- `POST /api/questions/:questionId/flag` for candidates to report a question issue from the results review screen.

### Admin Routes

`backend/src/routes/admin.js` exposes the admin portal. Main groups:

- Users: list, block, unblock.
- Sessions: list, inspect, and flag suspicious sessions.
- Certificates: list issued certificates.
- Flags: list and review question flags.
- Audit logging: every write action is recorded in `admin_audit_log`.

Admin routes require both authentication and admin authorization.

## Services

`backend/src/services/` contains the business logic that routes depend on:

- `tokenService.js` signs access tokens and manages refresh token rotation and revocation.
- `emailService.js` sends OTPs, password reset emails, certificate emails, and revocation notices using Resend.
- `questionBankService.js` draws randomized exam questions from the static banks in `backend/src/data/`.
- `reportService.js` generates a markdown AI performance report after submission.
- `certificateService.js` creates certificate records and image assets.
- `generationService.js` remains in the tree, but current session creation uses the question bank flow instead of live generation.

## Shared Package

`packages/shared` is the source of truth for shared constants and schemas.

### Constants

`packages/shared/src/constants.js` defines:

- Tracks: `associate`, `professional`.
- Session states: `generating`, `ready`, `active`, `completed`, `expired`, `aborted`.
- Exam configuration:
  - Associate: 50 questions, 15 minutes, 40 pass threshold.
  - Professional: 100 questions, 30 minutes, 80 pass threshold.
- Retake policy defaults.
- AI config defaults for Groq/OpenAI-compatible calls.
- Thread-domain mappings for both tracks.
- OTP and suspicious-session thresholds.
- Certificate ID prefix.

### Schemas And Utils

`packages/shared/src/schemas.js` defines JSON schemas for question, answer, and exam question payloads.
`packages/shared/src/utils.js` provides helpers for certificate IDs, score formatting, timer math, and retake eligibility.

If you change exam shape, question format, or allowed states, update the shared package first so both frontend and backend stay aligned.

## Frontend Architecture

The frontend is a React SPA using React Router, Tailwind, Radix UI primitives, Framer Motion, Lucide icons, Axios-based API wrappers, and React Hook Form + Zod for form validation.

### Routes In `frontend/src/App.jsx`

Public:

- `/` redirects to `/iso-27001`.
- `/iso-27001` landing page.
- `/login` auth page.
- `/verify` public verify landing page.
- `/verify/:certificateId` public certificate verification page.
- `/blog` blog index.
- `/blog/:slug` blog post page.

Protected:

- `/dashboard`
- `/profile`
- `/generate/:track`
- `/exam/:sessionId`
- `/results/:sessionId`

Admin:

- `/admin`
- `/admin/users`
- `/admin/sessions`
- `/admin/certificates`
- `/admin/questions`
- `/admin/flags`
- `/admin/audit-log`

`NoIndex` injects a temporary `noindex, nofollow` meta tag on private routes.

### Key Frontend Areas

- `frontend/src/context/AuthContext.jsx` stores auth state.
- `frontend/src/lib/api.js` and `frontend/src/lib/apiServices.js` wrap API calls.
- `frontend/src/components/auth/` contains auth-related UI.
- `frontend/src/components/layout/` contains shared page chrome.
- `frontend/src/components/ui/` contains reusable UI primitives.
- `frontend/src/pages/admin/` contains the admin portal pages.

The landing page is intentionally polished and marketing-heavy. Keep the visual language deliberate rather than generic if you touch it.

### Blog

- Blog content is **static**, defined in `frontend/src/data/blogs.js` (array of posts with `slug`, `title`, `excerpt`, `content` as sanitized HTML, `author`, `date`, `imageUrl`, `readTime`). There is no blog CMS or backend route.
- `frontend/src/pages/BlogPage.jsx` renders the index and exports the shared `BlogNavbar`; `frontend/src/pages/BlogPostPage.jsx` renders a single post and sanitizes `content` with DOMPurify.
- Hero images are **local SVGs** in `frontend/public/blog/` (themed to the dark + gold "Aureate Cyber" look), referenced by root-relative path. Do not reintroduce hotlinked Unsplash URLs.
- Both `BlogNavbar` (in `BlogPage.jsx`) and the landing page `Navbar` (in `LandingPage.jsx`) have a `md`-breakpoint mobile hamburger menu: desktop links hidden below `md`, slide-down panel, body-scroll lock while open, auto-close on route change. Keep the two in sync if you change nav links.
- SEO caveat: the frontend is a client-rendered SPA with no prerendering or per-page meta, so blog content is weak for search/AI crawlers. Per-route titles/canonical and post URLs in `public/sitemap.xml` are still outstanding.

## Data And Domain Concepts

The core domain is ISO 27001 exam management. Important entities used throughout the codebase include:

- `users`
- `otps`
- `refresh_tokens`
- `exam_sessions`
- `certificates`
- `question_flags`
- `admin_audit_log`

Exam questions are thread-based and track-based. Answer reviews keep the selected answer, the correct option, the explanation, the clause reference, the domain, and the thread for post-exam review.

Certificates are publicly verifiable by certificate ID, and revoked certificates remain visible with revoked metadata.

## Testing

The testing strategy is already documented in `TESTING.md`, but the practical summary is:

- Backend Jest integration tests live in `backend/tests/integration/`.
- Frontend Playwright tests live in `frontend/e2e/`.
- Load tests are in `backend/tests/load/artillery.yml` and should not be run casually against production.

When you change backend behavior, run the backend test suite or at least a focused test command first. When you change routes, forms, or critical flows in the frontend, use Playwright or at minimum a build/lint pass.

## Coding And Change Guidance

- Prefer small, local edits that preserve the current architecture.
- Keep backend validation in sync with shared schemas and constants.
- Do not break the public API contract described by `openapi.yaml` unless you update the spec too.
- Be careful with auth, refresh token rotation, and admin authorization. Those paths are security-sensitive.
- Be careful with question/session lifecycle changes. A small regression there can break exam start, resume, submit, or verification.
- If you add a new exam state, route, or data field, update the shared constants/schemas and any UI that depends on it.
- If you touch email, certificate generation, or storage code, remember those integrations are lazy-initialized and may be unavailable in local dev.
- If you touch frontend routing, remember private pages should remain noindexed.

## Key Files To Know

- `openapi.yaml` API contract.
- `backend/src/app.js` Express app wiring.
- `backend/src/routes/auth.js` auth and recovery.
- `backend/src/routes/session.js` exam flow.
- `backend/src/routes/admin.js` admin portal.
- `backend/src/services/reportService.js` AI report generation.
- `backend/src/services/certificateService.js` certificates.
- `packages/shared/src/constants.js` exam rules and thresholds.
- `frontend/src/App.jsx` routing and route protection.
- `frontend/src/pages/LandingPage.jsx` public marketing page.
- `frontend/src/pages/Dashboard.jsx` user dashboard and exam entry point.
- `TESTING.md` test instructions.

## Practical Mental Model

When you work in this repo, think in this order:

1. Shared constants and schemas define the rules.
2. Backend routes implement the state transitions.
3. Services encapsulate side effects like tokens, email, reports, and certificates.
4. Frontend pages consume the route outputs and guide the user through the exam and admin flows.

If something feels ambiguous, check `openapi.yaml`, `packages/shared`, and the route/service file that owns the behavior before changing anything.