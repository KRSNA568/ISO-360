/**
 * e2e/exam.spec.js
 *
 * Playwright tests for critical exam-integrity flows.
 * All tests use page.route() to mock the backend so they run without a live
 * database, but they exercise the real ExamPage component logic.
 *
 * Flows covered:
 *   1. Double-click submit → exactly one submission fires
 *   2. Timer auto-submit when clock reaches zero
 *   3. Tab-violation escalation (3 rapid tab events → force-submit modal)
 *   4. 401 response during submit → redirected to login
 *   5. Expired session on mount → immediate redirect to results
 */

const { test, expect } = require('@playwright/test');

// ── Shared test data ──────────────────────────────────────────────────────────

const SESSION_ID = 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee';

/** Access token payload that the AuthContext interceptor returns on profile fetch. */
const MOCK_USER = {
  id:             'user-uuid-0001',
  full_name:      'QA Candidate',
  email:          'qa@27001certified.in',
  email_verified: true,
  role:           'user',
};

/** A minimal active exam session that expires 60 seconds from now. */
function buildActiveSession(overrides = {}) {
  const now        = Date.now();
  const expiresAt  = new Date(now + 60_000).toISOString();  // 60s left
  return {
    id:           SESSION_ID,
    status:       'active',
    track:        'associate',
    expires_at:   expiresAt,
    tab_violations: 0,
    questions: Array.from({ length: 5 }, (_, i) => ({
      id:      `q-${i + 1}`,
      stem:    `Question ${i + 1}: Which clause covers risk assessment?`,
      options: { A: 'Clause 5', B: 'Clause 6', C: 'Clause 8', D: 'Clause 9' },
    })),
    ...overrides,
  };
}

/** A submit response (200 OK). */
const SUBMIT_OK = {
  message:    'Exam submitted successfully.',
  session_id: SESSION_ID,
  score:      4,
  total:      5,
  passed:     true,
};

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Mock the /api/user/me endpoint so AuthContext considers the user logged-in.
 */
async function mockAuth(page) {
  await page.route('**/api/user/me', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ user: MOCK_USER }) }),
  );
}

/**
 * Mock the exam start endpoint returning an active session.
 */
async function mockSessionStart(page, session) {
  await page.route(`**/api/session/${SESSION_ID}/start`, (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(session) }),
  );
}

/**
 * Mock the session status poll (used before start).
 */
async function mockSessionStatus(page, session) {
  await page.route(`**/api/session/${SESSION_ID}/status`, (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(session) }),
  );
}

/**
 * Navigate to the exam page for the test session.
 * Waits until the first question is visible.
 */
async function goToExam(page) {
  await page.goto(`/exam/${SESSION_ID}`);
  // Wait for either a question stem or an error/redirect indicator
  await page.waitForSelector(
    'text=/Question|Which clause|Clause/i, text=/expired|submit|results/i',
    { timeout: 15_000 },
  );
}

// ── Tests ─────────────────────────────────────────────────────────────────────

test.describe('ExamPage — double-click submit prevention', () => {
  test('fires exactly one submit request on rapid double-click', async ({ page }) => {
    const session = buildActiveSession();
    await mockAuth(page);
    await mockSessionStatus(page, session);
    await mockSessionStart(page, session);

    // Count how many times /submit is actually called
    let submitCount = 0;
    await page.route(`**/api/session/${SESSION_ID}/submit`, async (route) => {
      submitCount++;
      await route.fulfill({
        status:      200,
        contentType: 'application/json',
        body:        JSON.stringify(SUBMIT_OK),
      });
    });

    // Heartbeat — return 200 silently
    await page.route(`**/api/session/${SESSION_ID}/heartbeat`, (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '{}' }),
    );

    await goToExam(page);

    // Find the submit button and double-click it
    const submitBtn = page.locator('button').filter({ hasText: /submit exam|submit|finish/i }).first();
    await expect(submitBtn).toBeVisible({ timeout: 10_000 });
    await submitBtn.dblclick();

    // Allow time for both potential requests to fire
    await page.waitForTimeout(1_500);

    expect(submitCount).toBe(1);
  });
});

test.describe('ExamPage — 401 during submit → redirect to login', () => {
  test('navigates to /login when submit returns 401', async ({ page }) => {
    const session = buildActiveSession();
    await mockAuth(page);
    await mockSessionStatus(page, session);
    await mockSessionStart(page, session);

    await page.route(`**/api/session/${SESSION_ID}/submit`, (route) =>
      route.fulfill({ status: 401, contentType: 'application/json', body: JSON.stringify({ error: 'Unauthorized' }) }),
    );

    await page.route(`**/api/session/${SESSION_ID}/heartbeat`, (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '{}' }),
    );

    // Also mock the token refresh endpoint to fail so axios interceptor gives up
    await page.route('**/api/auth/refresh', (route) =>
      route.fulfill({ status: 401, contentType: 'application/json', body: JSON.stringify({ error: 'Invalid refresh token' }) }),
    );

    await goToExam(page);

    const submitBtn = page.locator('button').filter({ hasText: /submit exam|submit|finish/i }).first();
    await expect(submitBtn).toBeVisible({ timeout: 10_000 });
    await submitBtn.click();

    // The 401 should eventually send the user to /login
    await expect(page).toHaveURL(/login/, { timeout: 12_000 });
  });
});

test.describe('ExamPage — expired session on mount', () => {
  test('redirects to /results immediately when session is already expired', async ({ page }) => {
    // Session that expired 5 minutes ago
    const expiredSession = buildActiveSession({
      expires_at: new Date(Date.now() - 300_000).toISOString(),
      status:     'active',
    });

    await mockAuth(page);
    await mockSessionStatus(page, expiredSession);
    await mockSessionStart(page, expiredSession);

    await page.route(`**/api/session/${SESSION_ID}/submit`, (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(SUBMIT_OK) }),
    );

    await page.goto(`/exam/${SESSION_ID}`);

    // Should redirect to results for this session
    await expect(page).toHaveURL(new RegExp(`results/${SESSION_ID}`), { timeout: 10_000 });
  });
});

test.describe('ExamPage — tab violation escalation', () => {
  test('shows forced-submit warning after 3 tab-violation heartbeat failures', async ({ page }) => {
    const session = buildActiveSession();
    await mockAuth(page);
    await mockSessionStatus(page, session);
    await mockSessionStart(page, session);

    // Return 403 for heartbeat 3 times to simulate escalation
    let heartbeatCount = 0;
    await page.route(`**/api/session/${SESSION_ID}/heartbeat`, (route) => {
      heartbeatCount++;
      // Return a tab-violation payload
      route.fulfill({
        status:      200,
        contentType: 'application/json',
        body:        JSON.stringify({ tab_violations: heartbeatCount, max_violations: 3 }),
      });
    });

    await page.route(`**/api/session/${SESSION_ID}/submit`, (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(SUBMIT_OK) }),
    );

    await goToExam(page);

    // Simulate 3 visibility-change events (tab-switch simulation)
    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => {
        Object.defineProperty(document, 'visibilityState', { value: 'hidden', configurable: true });
        document.dispatchEvent(new Event('visibilitychange'));
        Object.defineProperty(document, 'visibilityState', { value: 'visible', configurable: true });
        document.dispatchEvent(new Event('visibilitychange'));
      });
      await page.waitForTimeout(300);
    }

    // After 3 violations, ExamPage should show a warning/modal or auto-submit
    const warningVisible = await page.locator(
      'text=/tab|violation|warning|suspicious|submitted/i',
    ).first().isVisible().catch(() => false);

    const onResults = page.url().includes('/results');

    // Either a warning is shown or the exam was auto-submitted
    expect(warningVisible || onResults).toBe(true);
  });
});

test.describe('ExamPage — timer auto-submit', () => {
  test('auto-submits and navigates away when exam time reaches zero', async ({ page }) => {
    // Session with only 3 seconds remaining
    const session = buildActiveSession({
      expires_at: new Date(Date.now() + 3_000).toISOString(),
    });

    await mockAuth(page);
    await mockSessionStatus(page, session);
    await mockSessionStart(page, session);

    let autoSubmitted = false;
    await page.route(`**/api/session/${SESSION_ID}/submit`, (route) => {
      autoSubmitted = true;
      route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(SUBMIT_OK) });
    });

    await page.route(`**/api/session/${SESSION_ID}/heartbeat`, (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '{}' }),
    );

    await goToExam(page);

    // Wait up to 15s for auto-submit (session expires in 3s)
    await page.waitForURL(new RegExp(`results/${SESSION_ID}`), { timeout: 15_000 });
    expect(autoSubmitted).toBe(true);
  });
});
