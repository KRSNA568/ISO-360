/**
 * emailService.js
 * Thin wrapper around the Resend SDK for all transactional emails.
 * Resend client is initialised lazily so the app starts even without the key configured.
 */
const { Resend } = require('resend')

let _resend = null
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY)
  return _resend
}

const FROM   = () => process.env.EMAIL_FROM || 'onboarding@resend.dev'
const APP    = 'ISO-Audit360'

// ── Helpers ──────────────────────────────────────────────────────────────────

function otpHtml(name, code, purposeLabel, expiryMinutes) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:sans-serif;background:#0f1117;color:#e5e7eb;padding:40px">
  <div style="max-width:480px;margin:0 auto;background:#1a1d27;border-radius:8px;padding:40px;border:1px solid #2d3148">
    <h1 style="color:#c9a84c;font-size:22px;margin-top:0">${APP}</h1>
    <p style="color:#9ca3af">Hi ${name},</p>
    <p>${purposeLabel}</p>
    <div style="background:#0f1117;border-radius:6px;padding:24px;text-align:center;margin:24px 0">
      <span style="font-size:36px;font-weight:700;letter-spacing:12px;color:#c9a84c">${code}</span>
    </div>
    <p style="color:#6b7280;font-size:13px">This code expires in <strong>${expiryMinutes} minutes</strong>. Do not share it with anyone.</p>
    <hr style="border-color:#2d3148;margin:24px 0">
    <p style="color:#4b5563;font-size:12px">If you did not request this, ignore this email. — ${APP} Team</p>
  </div>
</body>
</html>`
}

// ── Exports ───────────────────────────────────────────────────────────────────

/**
 * Send email verification OTP.
 * @param {string} to    recipient email
 * @param {string} name  recipient full name
 * @param {string} code  6-digit OTP
 */
async function sendOtpEmail(to, name, code) {
  return getResend().emails.send({
    from: FROM(),
    to,
    subject: `${code} is your ${APP} verification code`,
    html: otpHtml(
      name,
      code,
      'Enter the code below to verify your email address and activate your account.',
      15
    ),
  })
}

/**
 * Send password reset OTP.
 * @param {string} to    recipient email
 * @param {string} name  recipient full name
 * @param {string} code  6-digit OTP
 */
async function sendPasswordResetEmail(to, name, code) {
  return getResend().emails.send({
    from: FROM(),
    to,
    subject: `${code} — Reset your ${APP} password`,
    html: otpHtml(
      name,
      code,
      'Use the code below to reset your password. If you did not request a password reset, you can safely ignore this email.',
      60
    ),
  })
}

module.exports = { sendOtpEmail, sendPasswordResetEmail }
