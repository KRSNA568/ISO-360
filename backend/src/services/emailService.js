/**
 * emailService.js
 * Thin wrapper around the Resend SDK for all transactional emails.
 * Resend client is initialised lazily so the app starts even without the key configured.
 */
const { Resend } = require('resend')

let _resend = null
function getResend() {
  if (!_resend) {_resend = new Resend(process.env.RESEND_API_KEY)}
  return _resend
}

const FROM   = () => process.env.EMAIL_FROM || 'onboarding@resend.dev'
const APP    = '27001certified'

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

/**
 * Send certificate award email with download links.
 * @param {string} to              recipient email
 * @param {string} name            recipient full name
 * @param {string} certId          certificate ID string
 * @param {string} trackLabel      human-readable track
 * @param {string} landscapeUrl    R2 landscape image URL (may be null)
 * @param {string} verifyUrl       public verify page URL
 */
async function sendCertificateEmail(to, name, certId, trackLabel, landscapeUrl, verifyUrl) {
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:sans-serif;background:#0f1117;color:#e5e7eb;padding:40px">
  <div style="max-width:560px;margin:0 auto;background:#1a1d27;border-radius:8px;padding:40px;border:1px solid #2d3148">
    <h1 style="color:#c9a84c;font-size:22px;margin-top:0">${APP}</h1>
    <p style="color:#9ca3af">Congratulations, ${name}!</p>
    <p>You have successfully earned your <strong style="color:#c9a84c">${trackLabel}</strong> certificate.</p>
    <div style="background:#0f1117;border-radius:6px;padding:20px;margin:24px 0;text-align:center">
      <p style="color:#6b7280;font-size:12px;margin:0 0 6px">Certificate ID</p>
      <p style="font-family:monospace;font-size:20px;color:#c9a84c;margin:0">${certId}</p>
    </div>
    <div style="text-align:center;margin:24px 0">
      <a href="${verifyUrl}" style="display:inline-block;padding:12px 28px;background:#c9a84c;color:#0f1117;border-radius:6px;font-weight:700;text-decoration:none">View Certificate</a>
    </div>
    ${landscapeUrl ? `<p style="text-align:center"><a href="${landscapeUrl}" style="color:#c9a84c;font-size:13px">Download certificate image</a></p>` : ''}
    <hr style="border-color:#2d3148;margin:24px 0">
    <p style="color:#4b5563;font-size:12px">This certificate confirms your achievement. Keep this email for your records. — ${APP} Team</p>
  </div>
</body>
</html>`

  return getResend().emails.send({
    from:    FROM(),
    to,
    subject: `🏆 Your ${APP} certificate is ready — ${certId}`,
    html,
  })
}

/**
 * Send certificate revocation notice.
 * @param {string} to      recipient email
 * @param {string} name    recipient full name
 * @param {string} certId  certificate ID string
 * @param {string} reason  revocation reason
 */
async function sendRevocationEmail(to, name, certId, reason) {
  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:sans-serif;background:#0f1117;color:#e5e7eb;padding:40px">
  <div style="max-width:560px;margin:0 auto;background:#1a1d27;border-radius:8px;padding:40px;border:1px solid #2d3148">
    <h1 style="color:#c9a84c;font-size:22px;margin-top:0">${APP}</h1>
    <p style="color:#9ca3af">Hello ${name},</p>
    <p>Your certificate <strong style="font-family:monospace">${certId}</strong> has been revoked.</p>
    <div style="background:#1f0e0e;border:1px solid #7f1d1d;border-radius:6px;padding:16px;margin:20px 0">
      <p style="color:#fca5a5;font-size:13px;margin:0"><strong>Reason:</strong> ${reason}</p>
    </div>
    <p style="color:#6b7280;font-size:13px">If you believe this is an error, please contact support.</p>
    <hr style="border-color:#2d3148;margin:24px 0">
    <p style="color:#4b5563;font-size:12px">— ${APP} Team</p>
  </div>
</body>
</html>`

  return getResend().emails.send({
    from:    FROM(),
    to,
    subject: `Notice: Your ${APP} certificate ${certId} has been revoked`,
    html,
  })
}

module.exports = { sendOtpEmail, sendPasswordResetEmail, sendCertificateEmail, sendRevocationEmail }
