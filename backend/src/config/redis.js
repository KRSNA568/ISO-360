const Redis = require('ioredis')

const url       = process.env.REDIS_URL || ''
const isHttpUrl = url.startsWith('http://') || url.startsWith('https://')

let redis

if (isHttpUrl || !url) {
  /**
   * Dummy client — all methods return rejected promises so every caller
   * fails-open without crashing.  This fires when:
   *   a) REDIS_URL is not set (local dev without Redis)
   *   b) REDIS_URL is still the Upstash REST/HTTPS URL (misconfiguration)
   *      → fix: use  rediss://:<token>@<host>.upstash.io:6379
   */
  redis = {
    healthy: false,
    incr:    () => Promise.reject(new Error('Redis not configured (HTTP URL)')),
    expire:  () => Promise.reject(new Error('Redis not configured')),
    ttl:     () => Promise.reject(new Error('Redis not configured')),
    get:     () => Promise.reject(new Error('Redis not configured')),
    set:     () => Promise.reject(new Error('Redis not configured')),
    del:     () => Promise.reject(new Error('Redis not configured')),
    on:      () => {},
  }
  console.warn(
    isHttpUrl
      ? '⚠  Redis: REDIS_URL is HTTP/HTTPS (Upstash REST). ioredis needs rediss://:<token>@host:6379. OTP rate limits will fail-closed in production.'
      : '⚠  Redis: REDIS_URL not set. Running without Redis — OTP rate limits will fail-closed in production.',
  )
} else {
  const client = new Redis(url, {
    lazyConnect:          false,
    enableReadyCheck:     true,
    maxRetriesPerRequest: 3,
    retryStrategy: (times) => {
      if (times > 5) {return null}
      return Math.min(times * 300, 3000)
    },
    tls: url.startsWith('rediss://') ? {} : undefined,
  })
  client.healthy = false
  client.on('ready',  () => { client.healthy = true;  console.log('✅  Redis connected') })
  client.on('error',  (err) => { client.healthy = false; console.warn('⚠  Redis error:', err.message) })
  client.on('close',  () => { client.healthy = false; console.warn('⚠  Redis connection closed') })
  redis = client
}

module.exports = redis
