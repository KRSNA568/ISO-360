const express = require('express')
const cors    = require('cors')
const helmet  = require('helmet')
const morgan  = require('morgan')

const authRouter        = require('./routes/auth')
const userRouter        = require('./routes/user')
const sessionRouter     = require('./routes/session')

const certificateRouter = require('./routes/certificate')
const adminRouter       = require('./routes/admin')
const questionsRouter   = require('./routes/questions')
const { errorHandler } = require('./middlewares/errorHandler')

const app = express()


// ── Health checks (before CORS — no Origin header from load balancers) ───────
app.get('/api/live', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

async function readyHandler(_req, res) {
  try {
    await require('./config/db').query('SELECT 1')
    res.json({ status: 'ok', db: 'ok', timestamp: new Date().toISOString() })
  } catch {
    res.status(503).json({ status: 'degraded', db: 'error', timestamp: new Date().toISOString() })
  }
}
app.get('/api/ready',  readyHandler)
app.get('/api/health', readyHandler)

// ── Security & Parsing ──────────────────────────────────────────────────────
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'none'"],
      frameAncestors: ["'none'"],
    },
  },
}))
const ALLOWED_ORIGINS = (process.env.FRONTEND_URL || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim().replace(/\/$/, ''))
  .filter(Boolean)

const IS_PROD = process.env.NODE_ENV === 'production'

app.use(cors({
  origin(origin, callback) {
    if (!origin) {
      // No Origin = infra probe / server-to-server. Allow in dev; silently
      // deny CORS headers in prod (request still reaches the route handler).
      return callback(null, !IS_PROD)
    }
    // In dev, allow any localhost port so Vite port-shifts don't break the API
    if (!IS_PROD && /^https?:\/\/localhost(:\d+)?$/.test(origin)) {
      return callback(null, true)
    }
    if (ALLOWED_ORIGINS.includes(origin)) {return callback(null, true)}
    return callback(null, false)
  },
  credentials: true,
}))
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))

// ── Logging ─────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'))
}

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth',          authRouter)
app.use('/api/user',          userRouter)
app.use('/api/session',       sessionRouter)

app.use('/api/certificates',  certificateRouter)
app.use('/api/admin',         adminRouter)
app.use('/api/questions',     questionsRouter)

// ── 404 ──────────────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// ── Global error handler ──────────────────────────────────────────────────────
app.use(errorHandler)

module.exports = app
