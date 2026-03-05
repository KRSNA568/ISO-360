/**
 * storage.js
 * Supabase Storage client for certificate image uploads.
 * Initialised lazily — app starts cleanly even before the bucket is created.
 */
const { createClient } = require('@supabase/supabase-js')

let _client = null

function getStorageClient() {
  if (_client) return _client

  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    console.warn('[Storage] ⚠  SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set — certificate uploads will be skipped.')
    return null
  }

  _client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })

  return _client
}

const BUCKET = () => process.env.SUPABASE_CERT_BUCKET || 'certificates'

module.exports = { getStorageClient, BUCKET }
