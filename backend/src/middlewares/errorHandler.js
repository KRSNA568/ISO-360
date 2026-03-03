function errorHandler(err, req, res, _next) {
  const status  = err.status || err.statusCode || 500
  const message = err.message || 'Internal server error'

  if (process.env.NODE_ENV !== 'production') {
    console.error(`[ERROR] ${req.method} ${req.path} — ${status}:`, err.message)
  }

  res.status(status).json({
    error: message,
    ...(err.details && { details: err.details }),
    ...(process.env.NODE_ENV === 'development' && status >= 500 && { stack: err.stack }),
  })
}

module.exports = { errorHandler }
