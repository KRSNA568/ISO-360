const express = require('express')
const cors    = require('cors')
const helmet  = require('helmet')
const morgan  = require('morgan')

const authRouter        = require('./routes/auth')
const userRouter        = require('./routes/user')
const sessionRouter     = require('./routes/session')
const resultsRouter     = require('./routes/results')
const certificateRouter = require('./routes/certificate')
const adminRouter       = require('./routes/admin')
const { errorHandler } = require('./middlewares/errorHandler')

const app = express()

// ── Security & Parsing ──────────────────────────────────────────────────────
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}))
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))

// ── Logging ─────────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'))
}

// ── Health check ────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth',          authRouter)
app.use('/api/user',          userRouter)
app.use('/api/session',       sessionRouter)
app.use('/api/results',       resultsRouter)
app.use('/api/certificates',  certificateRouter)
app.use('/api/admin',         adminRouter)

// ── 404 ──────────────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// ── Global error handler ──────────────────────────────────────────────────────
app.use(errorHandler)

module.exports = app
