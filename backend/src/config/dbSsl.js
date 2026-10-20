/**
 * SSL policy for the Postgres pool.
 *
 * Managed Postgres (Render, Supabase) terminates TLS with a certificate chain
 * Node does not trust, so we keep SSL on with verification relaxed. A local
 * Postgres is usually built without TLS and aborts the handshake with
 * "server does not support SSL", which makes the API unusable in local dev.
 *
 * Resolution order outside production:
 *   1. DATABASE_SSL — `disable`/`off`/`false`/`0` turns SSL off, any other
 *      value (`require`, `true`, …) turns it on.
 *   2. `sslmode=` in the connection string, read the same way.
 *   3. Host-based default — off for localhost, on for everything else.
 *
 * Production always gets relaxed SSL. Nothing here can switch it off.
 */

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', '0.0.0.0', '::1', '[::1]'])
const SSL_OFF     = new Set(['disable', 'disabled', 'off', 'false', 'no', '0'])

// SSL on, certificate chain unverified — what the managed providers need.
const RELAXED_SSL = { rejectUnauthorized: false }

function parseUrl(connectionString) {
  if (!connectionString) {return null}
  try {
    return new URL(connectionString)
  } catch {
    // Unparseable (e.g. an unescaped password); fall back to the safe default.
    return null
  }
}

function readSetting(value) {
  const setting = String(value || '').trim().toLowerCase()
  if (!setting) {return null}
  return SSL_OFF.has(setting) ? false : RELAXED_SSL
}

function resolveSslConfig(env = process.env) {
  if (env.NODE_ENV === 'production') {return RELAXED_SSL}

  const fromEnv = readSetting(env.DATABASE_SSL)
  if (fromEnv !== null) {return fromEnv}

  const url = parseUrl(env.DATABASE_URL)
  if (!url) {return RELAXED_SSL}

  const fromUrl = readSetting(url.searchParams.get('sslmode'))
  if (fromUrl !== null) {return fromUrl}

  return LOCAL_HOSTS.has(url.hostname.toLowerCase()) ? false : RELAXED_SSL
}

module.exports = { resolveSslConfig, RELAXED_SSL }
