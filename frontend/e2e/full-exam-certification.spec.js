/**
 * e2e/full-exam-certification.spec.js
 *
 * End-to-end simulation of the complete certification journey:
 *   Register → Verify OTP (magic bypass) → Dashboard → Generate session
 *   → Answer all 50 Associate questions correctly → Submit → Results → Certificate
 *
 * Prerequisites:
 *   - Local backend running on port 5000 (NODE_ENV != production)
 *   - Local frontend running on port 3000 (or E2E_BASE_URL)
 *   - Real database with migrations applied
 *   - The backend OTP dev bypass accepts '000000' in non-production
 */

const { test, expect } = require('@playwright/test')
const path = require('path')

// ── Build answer map from the static question bank ───────────────────────────
// Keys are trimmed question stems; values are correct option letters A-D.
const associateBank   = require(path.resolve(__dirname, '../../backend/src/data/associate-questions'))
const professionalBank = require(path.resolve(__dirname, '../../backend/src/data/professional-questions'))

const ANSWER_MAP = {}
;[...associateBank, ...professionalBank].forEach((q) => {
  ANSWER_MAP[q.stem.trim()] = q.correct_option
})

// ── Test account ──────────────────────────────────────────────────────────────
const TEST_USER = {
  full_name: 'E2E Automation Bot',
  email:     `e2e-bot-${Date.now()}@27001certified.test`,
  password:  'E2ePassword123!',
  company:   '27001certified QA',
}

// ─────────────────────────────────────────────────────────────────────────────

test.describe.serial('Full Exam Certification Journey — Associate Track', () => {

  // ── Step 1: Register ──────────────────────────────────────────────────────
  test('1. Register a new account', async ({ page }) => {
    await page.goto('/iso-27001')

    // Click the primary CTA
    await page.getByRole('link', { name: /start.*certification|get started|create.*account/i }).first().click()
    await expect(page).toHaveURL(/login/, { timeout: 8_000 })

    // Switch to Register tab if not already on it
    const registerTab = page.getByRole('button', { name: /register|sign up|create account/i })
    if (await registerTab.isVisible()) {
      await registerTab.click()
    }

    // Fill registration form
    await page.locator('input[name="full_name"], input[placeholder*="name" i]').first().fill(TEST_USER.full_name)
    await page.locator('input[name="email"], input[type="email"]').first().fill(TEST_USER.email)
    await page.locator('input[name="password"], input[type="password"]').first().fill(TEST_USER.password)

    // Company field is optional — fill if visible
    const companyInput = page.locator('input[name="company"], input[placeholder*="company" i]')
    if (await companyInput.isVisible()) {
      await companyInput.fill(TEST_USER.company)
    }

    // Accept terms checkbox if present
    const termsBox = page.locator('input[type="checkbox"]').first()
    if (await termsBox.isVisible() && !(await termsBox.isChecked())) {
      await termsBox.check()
    }

    await page.locator('button[type="submit"]').first().click()

    // Should land on OTP verification screen
    await expect(page.getByText(/check your email|verification code|enter.*code/i).first()).toBeVisible({ timeout: 10_000 })
  })

  // ── Step 2: Verify OTP with magic bypass ──────────────────────────────────
  test('2. Verify email with magic OTP 000000', async ({ page }) => {
    // Navigate back to login — the OTP screen state should still be there,
    // or we just land on login again and the stored user_id in page state handles it.
    // If state was lost between tests, navigate to login directly.
    if (!page.url().includes('login')) {
      await page.goto('/login')
    }

    // Wait for OTP inputs
    await page.waitForSelector(
      'input[maxlength="1"], input[name*="otp"], input[name*="code"], input[placeholder*="code" i]',
      { timeout: 5_000 }
    ).catch(() => null)

    const singleOtpInput = page.locator('input[name*="otp"], input[name*="code"], input[placeholder*="code" i], input[maxlength="6"]').first()
    const digitInputs    = page.locator('input[maxlength="1"]')
    const digitCount     = await digitInputs.count()

    if (digitCount >= 6) {
      // Individual digit inputs
      for (let i = 0; i < 6; i++) {
        await digitInputs.nth(i).fill('0')
      }
    } else if (await singleOtpInput.isVisible()) {
      await singleOtpInput.fill('000000')
    }

    const verifyBtn = page.getByRole('button', { name: /verify|confirm|submit/i }).first()
    await verifyBtn.click()

    // Should land on dashboard
    await expect(page).toHaveURL(/dashboard/, { timeout: 12_000 })
    await expect(page.getByText(/associate|start exam/i).first()).toBeVisible({ timeout: 5_000 })
  })

  // ── Step 3: Start Associate exam ─────────────────────────────────────────
  test('3. Navigate to exam generation and wait for session', async ({ page }) => {
    await page.goto('/dashboard')

    // Click Start Exam on the Associate track card
    const startBtn = page.locator('a[href="/generate/associate"], a').filter({ hasText: /start exam/i }).first()
    await expect(startBtn).toBeVisible({ timeout: 8_000 })
    await startBtn.click()

    // GenerationPage creates the session and redirects to /exam/:id
    // Wait up to 30s for the redirect since session creation includes question drawing
    await expect(page).toHaveURL(/\/exam\//, { timeout: 30_000 })

    // Exam page should show the first question
    await expect(page.getByTestId('question-stem')).toBeVisible({ timeout: 15_000 })
    console.log('✅ Exam started — question 1 is visible')
  })

  // ── Step 4: Answer all 50 questions correctly ─────────────────────────────
  test('4. Answer all 50 questions using the correct answer from the bank', async ({ page }) => {
    // Re-navigate to current exam URL (Playwright serial tests share browser state)
    // The previous test left us on /exam/:id — just make sure we're still there
    await expect(page).toHaveURL(/\/exam\//, { timeout: 5_000 })

    const TOTAL_QUESTIONS = 50
    let answered = 0
    let skipped  = 0

    for (let i = 0; i < TOTAL_QUESTIONS; i++) {
      // Wait for the question stem to be visible
      const stemEl = page.getByTestId('question-stem')
      await expect(stemEl).toBeVisible({ timeout: 10_000 })

      const stemText = (await stemEl.textContent())?.trim() || ''
      const correct  = ANSWER_MAP[stemText]

      if (correct) {
        // Click the option button for the correct letter
        const optionBtn = page.locator(`[data-option="${correct}"]`)
        await expect(optionBtn).toBeVisible({ timeout: 5_000 })
        await optionBtn.click()
        answered++
        console.log(`  Q${i + 1}: "${stemText.slice(0, 60)}…" → ${correct}`)
      } else {
        // Fallback: pick 'A' if stem not found in bank (shouldn't happen)
        console.warn(`  Q${i + 1}: stem not in answer map — defaulting to A. Stem: "${stemText.slice(0, 80)}"`)
        await page.locator('[data-option="A"]').click()
        skipped++
      }

      // Navigate to next question (or finish on last)
      if (i < TOTAL_QUESTIONS - 1) {
        await page.getByRole('button', { name: /next/i }).click()
        // Small wait to let the question transition render
        await page.waitForTimeout(200)
      }
    }

    console.log(`✅ Answered ${answered}/${TOTAL_QUESTIONS} from bank | ${skipped} fallback-to-A`)

    // On the last question, click "Finish & Submit"
    await page.getByRole('button', { name: /finish.*submit|submit/i }).first().click()
  })

  // ── Step 5: Confirm submission dialog ────────────────────────────────────
  test('5. Confirm the submit dialog', async ({ page }) => {
    // A confirmation dialog/modal appears — confirm it
    const confirmBtn = page.getByRole('button', { name: /submit exam|yes.*submit|confirm/i })
    await expect(confirmBtn).toBeVisible({ timeout: 8_000 })
    await confirmBtn.click()

    // Should redirect to results page
    await expect(page).toHaveURL(/\/results\//, { timeout: 20_000 })
    console.log('✅ Exam submitted — on results page')
  })

  // ── Step 6: Verify results show a pass ───────────────────────────────────
  test('6. Results page shows a passing score', async ({ page }) => {
    await expect(page).toHaveURL(/\/results\//, { timeout: 5_000 })

    // Wait for the results to load (AI report + score)
    await expect(page.getByText(/passed|you passed|congratulations/i).first()).toBeVisible({ timeout: 30_000 })

    // Score should be ≥ 40/50
    const scoreText = await page.getByText(/\d+\s*\/\s*50/).first().textContent().catch(() => null)
    if (scoreText) {
      const match = scoreText.match(/(\d+)\s*\/\s*50/)
      if (match) {
        const score = parseInt(match[1], 10)
        console.log(`✅ Score: ${score}/50`)
        expect(score).toBeGreaterThanOrEqual(40)
      }
    }
  })

  // ── Step 7: Certificate is issued ────────────────────────────────────────
  test('7. Certificate is issued and publicly verifiable', async ({ page }) => {
    await expect(page).toHaveURL(/\/results\//, { timeout: 5_000 })

    // Poll up to 60s for certificate (it's generated async)
    const certId = await page.getByText(/ISO27-\d{4}-[AP]-\w+/).first().textContent({ timeout: 60_000 })
    expect(certId).toBeTruthy()
    console.log(`✅ Certificate issued: ${certId?.trim()}`)

    // Verify the public verify page works
    const verifyUrl = `/verify/${certId?.trim()}`
    await page.goto(verifyUrl)

    await expect(page.getByText(/valid|verified|certificate found/i).first()).toBeVisible({ timeout: 10_000 })
    console.log(`✅ Public verification passed at ${verifyUrl}`)
  })

})
