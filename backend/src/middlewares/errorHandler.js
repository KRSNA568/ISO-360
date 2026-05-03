const logger = require('../lib/logger')

function errorHandler(err, req, res, _next) {
  const status      = err.status || err.statusCode || 500
  const isProduction = process.env.NODE_ENV === 'production'

  if (status >= 500) {
    logger.error({ err, method: req.method, path: req.path, status }, err.message)
  } else if (!isProduction) {
    logger.debug({ method: req.method, path: req.path, status }, err.message)
  }

  // Never expose internal detail on 5xx in production
  const message = (isProduction && status >= 500)
    ? 'Internal server error'
    : (err.message || 'Internal server error')

  res.status(status).json({
    error: message,
    ...(err.details && { details: err.details }),
    ...(!isProduction && status >= 500 && { stack: err.stack }),
  })
}

module.exports = { errorHandler }
