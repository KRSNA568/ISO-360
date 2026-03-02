const Redis = require('ioredis')

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  lazyConnect: true,
  retryStrategy: (times) => {
    if (times > 5) return null
    return Math.min(times * 200, 2000)
  },
})

redis.on('connect',  () => console.log('✅  Redis connected'))
redis.on('error',    (err) => console.warn('Redis error:', err.message))

module.exports = redis
