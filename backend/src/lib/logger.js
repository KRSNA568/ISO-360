const pino = require('pino')

const isProduction = process.env.NODE_ENV === 'production'

const logger = pino({
  level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
  ...(isProduction
    ? {}
    : { transport: { target: 'pino-pretty', options: { colorize: true } } }),
  redact: {
    paths: ['req.headers.authorization', 'body.password', 'body.new_password', 'body.refresh_token'],
    censor: '[REDACTED]',
  },
})

// Lazy Sentry init — only when SENTRY_DSN is configured
if (process.env.SENTRY_DSN) {
  try {
    const Sentry = require('@sentry/node')
    Sentry.init({ dsn: process.env.SENTRY_DSN, environment: process.env.NODE_ENV || 'development' })
    logger.info('Sentry error tracking enabled')
  } catch {
    logger.warn('SENTRY_DSN set but @sentry/node not installed — skipping Sentry init')
  }
}

module.exports = logger
