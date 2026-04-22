/**
 * r2.js
 * Cloudflare R2 client — S3-compatible via AWS SDK v3.
 * Returns null when credentials are not configured so the app starts cleanly
 * in development before the bucket is provisioned.
 */
const { S3Client } = require('@aws-sdk/client-s3')

let _client = null

function getR2Client() {
  if (_client) return _client

  const accountId  = process.env.R2_ACCOUNT_ID
  const accessKey  = process.env.R2_ACCESS_KEY_ID
  const secretKey  = process.env.R2_SECRET_ACCESS_KEY

  if (!accountId || !accessKey || !secretKey) {
    console.warn('[R2] ⚠ Credentials not configured — certificate uploads will be skipped.')
    return null
  }

  _client = new S3Client({
    region:   'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId:     accessKey,
      secretAccessKey: secretKey,
    },
  })

  return _client
}

const BUCKET     = () => process.env.R2_BUCKET_NAME  || '27001certified-certs'
const PUBLIC_URL = () => process.env.R2_PUBLIC_URL   || ''

module.exports = { getR2Client, BUCKET, PUBLIC_URL }
