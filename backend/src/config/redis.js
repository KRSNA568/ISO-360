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
    incr:   () => Promise.reject(new Error('Redis not configured (HTTP URL)')),
    expire: () => Promise.reject(new Error('Redis not configured')),
    ttl:    () => Promise.reject(new Error('Redis not configured')),
    get:    () => Promise.reject(new Error('Redis not configured')),
    set:    () => Promise.reject(new Error('Redis not configured')),
    del:    () => Promise.reject(new Error('Redis not configured')),
    on:     () => {},
  }
  console.warn(
    isHttpUrl
      ? '⚠  Redis: REDIS_URL is HTTP/HTTPS (Upstash REST). ioredis needs rediss://:<token>@host:6379. Rate limits fail-open.'
      : '⚠  Redis: REDIS_URL not set. Running without Redis — rate limits fail-open.',
  )
} else {
  redis = new Redis(url, {
    // lazyConnect=false so we get a startup warning immediately on bad credentials
    lazyConnect:          false,
    enableReadyCheck:     true,
    maxRetriesPerRequest: 3,
    retryStrategy: (times) => {
      if (times > 5) return null          // stop retrying after 5 attempts
      return Math.min(times * 300, 3000)  // exponential back-off up to 3s
    },
    tls: url.startsWith('rediss://') ? {} : undefined,
  })
  redis.on('ready',  () => console.log('✅  Redis connected'))
  redis.on('error',  (err) => console.warn('⚠  Redis error:', err.message))
  redis.on('close',  () => console.warn('⚠  Redis connection closed'))
}

module.exports = redis
