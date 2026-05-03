/**
 * certificateService.js
 * Generates certificate images (1920×1080 landscape + 1080×1080 square),
 * uploads them to Supabase Storage, and writes a row to the `certificates` table.
 *
 * Degrades gracefully when Supabase credentials are absent — the DB row is still
 * inserted with null image URLs so the UI can detect the pending state.
 */

const sharp    = require('sharp')
const qrcode   = require('qrcode')
const pool     = require('../config/db')
const { getStorageClient, BUCKET } = require('../config/storage')

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Escape XML/SVG special characters in user-supplied strings */
function esc(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/** Truncate a name if extremely long so it fits on one SVG line */
function truncate(str, max = 42) {
  return str.length > max ? str.slice(0, max - 1) + '…' : str
}

/** Generate a QR code PNG as a base64 string */
async function makeQrBase64(url) {
  const buf = await qrcode.toBuffer(url, {
    type:   'png',
    width:  240,
    margin: 1,
    color:  { dark: '#1a1d27', light: '#ffffff' },
  })
  return buf.toString('base64')
}

/**
 * Build the full SVG string for the landscape certificate (1920 × 1080).
 */
function buildLandscapeSvg({ name, trackLabel, score, dateLabel, certId, qrBase64, verifyUrl }) {
  const safeName  = esc(truncate(name, 40))
  const safeTrack = esc(trackLabel)
  const safeScore = esc(score)
  const safeDate  = esc(dateLabel)
  const safeCert  = esc(certId)

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
     width="1920" height="1080" viewBox="0 0 1920 1080">

  <!-- Background -->
  <rect width="1920" height="1080" fill="#0f1117"/>

  <!-- Outer gold border -->
  <rect x="28" y="28" width="1864" height="1024" fill="none" stroke="#c9a84c" stroke-width="3"/>
  <!-- Inner thin border -->
  <rect x="40" y="40" width="1840" height="1000" fill="none" stroke="#c9a84c" stroke-width="1" stroke-opacity="0.35"/>

  <!-- Corner accents -->
  <rect x="28" y="28"   width="60" height="60" fill="#c9a84c" fill-opacity="0.15"/>
  <rect x="1832" y="28"   width="60" height="60" fill="#c9a84c" fill-opacity="0.15"/>
  <rect x="28" y="992"  width="60" height="60" fill="#c9a84c" fill-opacity="0.15"/>
  <rect x="1832" y="992" width="60" height="60" fill="#c9a84c" fill-opacity="0.15"/>

  <!-- Brand / header -->
  <text x="960" y="140" font-family="serif" font-size="24" fill="#c9a84c"
        text-anchor="middle" letter-spacing="10">27001CERTIFIED</text>
  <text x="960" y="220" font-family="serif" font-size="60" fill="#ffffff"
        text-anchor="middle" letter-spacing="4">Certificate of Achievement</text>

  <!-- Top divider -->
  <line x1="300" y1="256" x2="1620" y2="256" stroke="#c9a84c" stroke-width="1.5"/>

  <!-- Body text -->
  <text x="960" y="330" font-family="serif" font-size="26" fill="#9ca3af" text-anchor="middle">
    This is to certify that
  </text>

  <text x="960" y="460" font-family="serif" font-size="80" fill="#ffffff" text-anchor="middle"
        font-weight="bold">
    ${safeName}
  </text>

  <text x="960" y="544" font-family="serif" font-size="26" fill="#9ca3af" text-anchor="middle">
    has successfully passed the
  </text>

  <text x="960" y="626" font-family="serif" font-size="42" fill="#c9a84c" text-anchor="middle">
    ISO 27001 — ${safeTrack}
  </text>

  <text x="960" y="700" font-family="serif" font-size="24" fill="#9ca3af" text-anchor="middle">
    examination on ${safeDate} with a score of ${safeScore}%
  </text>

  <!-- Bottom divider -->
  <line x1="300" y1="744" x2="1620" y2="744" stroke="#c9a84c" stroke-width="1.5"/>

  <!-- Certificate ID (bottom-left) -->
  <text x="100" y="850" font-family="monospace" font-size="18" fill="#6b7280">Certificate ID</text>
  <text x="100" y="884" font-family="monospace" font-size="26" fill="#c9a84c">${safeCert}</text>

  <text x="100" y="940" font-family="monospace" font-size="16" fill="#4b5563">
    Verify at: ${esc(verifyUrl)}
  </text>

  <!-- QR code (bottom-right) -->
  <image href="data:image/png;base64,${qrBase64}" x="1620" y="800" width="220" height="220"/>
  <text x="1730" y="1050" font-family="monospace" font-size="16" fill="#6b7280"
        text-anchor="middle">Scan to verify</text>

</svg>`
}

/**
 * Build the full SVG string for the square certificate (1080 × 1080).
 */
function buildSquareSvg({ name, trackLabel, score, dateLabel, certId, qrBase64, verifyUrl }) {
  const safeName  = esc(truncate(name, 32))
  const safeTrack = esc(trackLabel)
  const safeScore = esc(score)
  const safeDate  = esc(dateLabel)
  const safeCert  = esc(certId)

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
     width="1080" height="1080" viewBox="0 0 1080 1080">

  <!-- Background -->
  <rect width="1080" height="1080" fill="#0f1117"/>

  <!-- Outer gold border -->
  <rect x="24" y="24" width="1032" height="1032" fill="none" stroke="#c9a84c" stroke-width="3"/>
  <rect x="36" y="36" width="1008" height="1008" fill="none" stroke="#c9a84c" stroke-width="1" stroke-opacity="0.35"/>

  <!-- Corner accents -->
  <rect x="24" y="24"   width="50" height="50" fill="#c9a84c" fill-opacity="0.15"/>
  <rect x="1006" y="24"  width="50" height="50" fill="#c9a84c" fill-opacity="0.15"/>
  <rect x="24" y="1006"  width="50" height="50" fill="#c9a84c" fill-opacity="0.15"/>
  <rect x="1006" y="1006" width="50" height="50" fill="#c9a84c" fill-opacity="0.15"/>

  <!-- Brand -->
  <text x="540" y="110" font-family="serif" font-size="20" fill="#c9a84c"
        text-anchor="middle" letter-spacing="8">27001CERTIFIED</text>
  <text x="540" y="192" font-family="serif" font-size="42" fill="#ffffff"
        text-anchor="middle" letter-spacing="2">Certificate of Achievement</text>

  <!-- Top divider -->
  <line x1="160" y1="222" x2="920" y2="222" stroke="#c9a84c" stroke-width="1.5"/>

  <!-- Body -->
  <text x="540" y="286" font-family="serif" font-size="22" fill="#9ca3af" text-anchor="middle">
    This is to certify that
  </text>

  <text x="540" y="396" font-family="serif" font-size="58" fill="#ffffff" text-anchor="middle"
        font-weight="bold">
    ${safeName}
  </text>

  <text x="540" y="462" font-family="serif" font-size="22" fill="#9ca3af" text-anchor="middle">
    has successfully passed the
  </text>

  <text x="540" y="534" font-family="serif" font-size="34" fill="#c9a84c" text-anchor="middle">
    ISO 27001 — ${safeTrack}
  </text>

  <text x="540" y="596" font-family="serif" font-size="20" fill="#9ca3af" text-anchor="middle">
    on ${safeDate} · Score: ${safeScore}%
  </text>

  <!-- Bottom divider -->
  <line x1="160" y1="634" x2="920" y2="634" stroke="#c9a84c" stroke-width="1.5"/>

  <!-- QR + cert id -->
  <image href="data:image/png;base64,${qrBase64}" x="430" y="660" width="200" height="200"/>

  <text x="540" y="900" font-family="monospace" font-size="16" fill="#6b7280" text-anchor="middle">
    ${safeCert}
  </text>
  <text x="540" y="930" font-family="monospace" font-size="14" fill="#4b5563" text-anchor="middle">
    Scan QR or visit ${esc(verifyUrl)} to verify
  </text>

</svg>`
}

// ── Core: render SVG → JPEG buffer via sharp ──────────────────────────────────

async function svgToJpeg(svgString, width, height) {
  return sharp(Buffer.from(svgString))
    .resize(width, height, { fit: 'fill' })
    .jpeg({ quality: 92, mozjpeg: true })
    .toBuffer()
}

// ── Upload a buffer to Supabase Storage ──────────────────────────────────────

async function uploadToStorage(path, buffer, contentType = 'image/jpeg') {
  const supabase = getStorageClient()

  if (!supabase) {
    console.warn(`[Cert] Supabase storage not configured — skipping upload of ${path}`)
    return null
  }

  const bucket = BUCKET()

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, buffer, { contentType, upsert: true, cacheControl: '31536000' })

  if (error) {throw new Error(`Storage upload failed (${path}): ${error.message}`)}

  const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path)
  return publicUrl
}

// ── Generate a unique certificate_id ─────────────────────────────────────────

async function generateUniqueCertId(prefix) {
  for (let attempt = 0; attempt < 10; attempt++) {
    const suffix = Math.random().toString(36).slice(2, 10).toUpperCase()
    const certId = `${prefix}${suffix}`
    const { rows } = await pool.query(
      'SELECT 1 FROM certificates WHERE certificate_id = $1',
      [certId]
    )
    if (rows.length === 0) {return certId}
  }
  throw new Error('Failed to generate unique certificate ID after 10 attempts')
}

// ── Main export: generateCertificate ─────────────────────────────────────────

/**
 * Generate certificate images, upload to R2, and insert a DB row.
 *
 * @param {object} params
 * @param {string} params.sessionId
 * @param {string} params.userId
 * @param {string} params.track            'associate' | 'professional'
 * @param {string} params.fullName         candidate name
 * @param {number} params.score            raw correct count
 * @param {number} params.totalQuestions
 * @param {Date|string} params.awardedOn
 * @returns {Promise<object>}              inserted certificate row
 */
async function generateCertificate({ sessionId, userId, track, fullName, score, totalQuestions, awardedOn }) {
  const CERT_ID_PREFIX = 'ISO27-2026-'

  // 1. Prevent duplicate cert for same session
  const { rows: existing } = await pool.query(
    'SELECT * FROM certificates WHERE exam_session_id = $1',
    [sessionId]
  )
  if (existing.length > 0) {
    console.log(`[Cert] Certificate already exists for session ${sessionId}: ${existing[0].certificate_id}`)
    return existing[0]
  }

  // 2. Generate unique cert ID
  const certId = await generateUniqueCertId(CERT_ID_PREFIX)

  // 3. Prepare shared template data
  const trackLabel = track === 'associate' ? 'Associate — ISMS Foundation' : 'Professional — Lead Auditor'
  const scorePct   = Math.round((score / totalQuestions) * 100)
  const dateLabel  = new Date(awardedOn).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
  const verifyUrl  = `${(process.env.FRONTEND_URL || 'https://27001certified.app').replace(/\/$/, '')}/verify/${certId}`

  console.log(`[Cert] 🏆 Generating certificate ${certId} for session ${sessionId}`)

  // 4. Generate QR code
  const qrBase64 = await makeQrBase64(verifyUrl)

  const templateData = { name: fullName, trackLabel, score: scorePct, dateLabel, certId, qrBase64, verifyUrl }

  // 5. Render images (errors here are non-fatal — we insert null URLs)
  let landscapeBuffer = null
  let squareBuffer    = null

  try {
    const [ls, sq] = await Promise.all([
      svgToJpeg(buildLandscapeSvg(templateData), 1920, 1080),
      svgToJpeg(buildSquareSvg(templateData),    1080, 1080),
    ])
    landscapeBuffer = ls
    squareBuffer    = sq
  } catch (err) {
    console.error('[Cert] ⚠ Image generation failed:', err.message)
  }

  // 6. Upload to R2
  const prefix    = `certs/${userId}/${certId}`
  let landscapeUrl = null
  let squareUrl    = null

  if (landscapeBuffer && squareBuffer) {
    try {
      ;[landscapeUrl, squareUrl] = await Promise.all([
        uploadToStorage(`${prefix}/landscape.jpg`, landscapeBuffer),
        uploadToStorage(`${prefix}/square.jpg`,    squareBuffer),
      ])
    } catch (err) {
      console.error('[Cert] ⚠ Storage upload failed:', err.message)
    }
  }

  // 7. Insert certificate row
  const { rows: inserted } = await pool.query(
    `INSERT INTO certificates
       (certificate_id, user_id, exam_session_id, track, full_name, score,
        awarded_on, r2_url_landscape, r2_url_square)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *`,
    [certId, userId, sessionId, track, fullName, scorePct, new Date(awardedOn), landscapeUrl, squareUrl]
  )

  console.log(`[Cert] ✅ Certificate ${certId} saved (landscape=${landscapeUrl ? 'uploaded' : 'pending'})`)
  return inserted[0]
}

// ── revokeCertificate ─────────────────────────────────────────────────────────

/**
 * Revoke a certificate. The `:id` can be the DB uuid OR the certificate_id string.
 *
 * @param {string} certIdOrUuid   certificate_id (e.g. ISO27-2026-XXXX) or uuid
 * @param {string} adminUserId    uuid of the admin performing the revocation
 * @param {string} reason         short human-readable reason
 * @returns {Promise<object>}     updated certificate row
 */
async function revokeCertificate(certIdOrUuid, adminUserId, reason = '') {
  const { rows } = await pool.query(
    `UPDATE certificates
     SET revoked        = TRUE,
         revoked_reason = $2,
         revoked_at     = NOW(),
         revoked_by     = $3
     WHERE (id::text = $1 OR certificate_id = $1)
       AND revoked = FALSE
     RETURNING *`,
    [certIdOrUuid, reason, adminUserId]
  )

  if (rows.length === 0) {
    // Either not found or already revoked
    const { rows: check } = await pool.query(
      `SELECT * FROM certificates WHERE id::text = $1 OR certificate_id = $1`,
      [certIdOrUuid]
    )
    if (check.length === 0) {throw Object.assign(new Error('Certificate not found'), { status: 404 })}
    if (check[0].revoked)   {throw Object.assign(new Error('Certificate already revoked'), { status: 409 })}
    throw new Error('Revocation failed')
  }

  console.log(`[Cert] 🚫 Certificate ${rows[0].certificate_id} revoked by admin ${adminUserId}: ${reason}`)
  return rows[0]
}

module.exports = { generateCertificate, revokeCertificate }
