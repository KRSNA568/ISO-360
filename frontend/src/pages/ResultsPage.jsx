import { useEffect, useRef, useState } from 'react'
import { Link, useParams }             from 'react-router-dom'
import {
  CheckCircle2, XCircle, RotateCcw, LayoutDashboard,
  TrendingUp, FileText, AlertTriangle, BookOpen, Flag, Shield,
} from 'lucide-react'
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Radar, ResponsiveContainer,
} from 'recharts'
import AppNavbar    from '@/components/layout/AppNavbar'
import { resultsApi } from '@/lib/apiServices'

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Shorten a full domain name to 2 meaningful words for radar axis labels */
function shortDomain(name = '') {
  const clean = name
    .replace(/\s*\([^)]+\)/g, '')    // strip "(Clauses …)"
    .replace(/\s*[–—].*/, '')          // strip "— subtitle"
    .trim()
  const STOP = new Set(['of','the','&','and','in','a','for'])
  const words = clean.split(/\s+/).filter(w => !STOP.has(w.toLowerCase()))
  return words.slice(0, 2).join(' ') || clean.split(' ').slice(0, 2).join(' ')
}

/** Colour a % score for progress bars */
function scoreColor(pct) {
  if (pct >= 80) return 'bg-emerald-500'
  if (pct >= 60) return 'bg-gold'
  return 'bg-red-500'
}

/** Very simple markdown → JSX. Handles ##, ###, **bold**, - bullets */
function MarkdownBlock({ content }) {
  if (!content) return null

  function parseInline(str) {
    const parts = str.split(/(\*\*[^*]+\*\*)/)
    return parts.map((p, i) =>
      p.startsWith('**') && p.endsWith('**')
        ? <strong key={i} className="font-semibold text-ink">{p.slice(2, -2)}</strong>
        : p
    )
  }

  const elements = []
  let listItems  = []
  let key        = 0

  const flushList = () => {
    if (listItems.length) {
      elements.push(
        <ul key={key++} className="space-y-1.5 my-3 ml-4">
          {listItems}
        </ul>
      )
      listItems = []
    }
  }

  for (const rawLine of content.split('\n')) {
    const line = rawLine.trimEnd()

    if (line.startsWith('## ')) {
      flushList()
      elements.push(
        <h2 key={key++} className="text-base font-semibold text-ink mt-6 mb-2 pb-1.5 border-b border-border flex items-center gap-2">
          <span className="w-1 h-4 rounded-full bg-gold flex-shrink-0" />
          {parseInline(line.slice(3))}
        </h2>
      )
    } else if (line.startsWith('### ')) {
      flushList()
      elements.push(
        <h3 key={key++} className="text-sm font-semibold text-ink-secondary mt-4 mb-1.5">
          {parseInline(line.slice(4))}
        </h3>
      )
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      listItems.push(
        <li key={key++} className="flex items-start gap-2 text-sm text-ink-secondary leading-relaxed">
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
          <span>{parseInline(line.slice(2))}</span>
        </li>
      )
    } else if (line === '') {
      flushList()
    } else {
      flushList()
      elements.push(
        <p key={key++} className="text-sm text-ink-secondary leading-relaxed my-1.5">
          {parseInline(line)}
        </p>
      )
    }
  }
  flushList()

  return <div className="markdown-body">{elements}</div>
}

// ── Skeleton component ────────────────────────────────────────────────────────
function Skeleton({ className = '' }) {
  return (
    <div
      className={`rounded bg-gradient-to-r from-border via-surface-raised to-border bg-[length:200%_100%] animate-shimmer ${className}`}
    />
  )
}

// ── Suspicion Banner ──────────────────────────────────────────────────────────
function SuspicionBanner({ reason }) {
  return (
    <div className="card border border-amber-200 bg-amber-50">
      <div className="flex items-start gap-3">
        <Shield size={16} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-800">Session Flagged for Review</p>
          <p className="text-xs text-amber-700 mt-1 leading-relaxed">
            One or more integrity signals were detected during this session.
            Your result is recorded but has been marked for admin review.
          </p>
          {reason && (
            <p className="text-xs text-amber-600 mt-2 font-mono bg-amber-100 px-2 py-1.5 rounded">
              {reason}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Question Review ───────────────────────────────────────────────────────────
function QuestionReview({ questions, sessionId }) {
  const [expanded, setExpanded] = useState(null)
  const [flagged,  setFlagged]  = useState({})
  const [flagging, setFlagging] = useState({})

  async function handleFlag(q) {
    if (flagged[q.id] || flagging[q.id]) return
    setFlagging(prev => ({ ...prev, [q.id]: true }))
    try {
      await resultsApi.flagQuestion(q.id, {
        sessionId,
        questionStem: q.stem,
        reason: 'Inaccuracy reported by candidate',
      })
      setFlagged(prev => ({ ...prev, [q.id]: true }))
    } catch {
      // non-fatal
    } finally {
      setFlagging(prev => ({ ...prev, [q.id]: false }))
    }
  }

  if (!questions?.length) return null

  const correctCount = questions.filter(q => q.correct).length

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-5">
        <BookOpen size={16} className="text-gold" />
        <h2 className="text-base font-semibold text-ink">Question Review</h2>
        <span className="ml-auto text-xs text-ink-muted">
          {correctCount}/{questions.length} correct
        </span>
      </div>

      <div className="space-y-2">
        {questions.map((q, idx) => {
          const isOpen = expanded === q.id
          return (
            <div
              key={q.id}
              className={`rounded-lg border transition-colors ${
                q.correct ? 'border-emerald-200' : 'border-red-200'
              }`}
            >
              {/* Collapsed row */}
              <button
                onClick={() => setExpanded(isOpen ? null : q.id)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-surface-raised transition-colors rounded-lg"
              >
                <span className="text-xs font-mono text-ink-muted flex-shrink-0 w-7">
                  Q{idx + 1}
                </span>
                <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                  q.correct ? 'bg-emerald-500' : 'bg-red-500'
                }`}>
                  {q.correct ? '✓' : '✗'}
                </span>
                <span className="flex-1 text-sm text-ink truncate">{q.stem}</span>
                <div className="flex-shrink-0 flex items-center gap-2">
                  {q.clauseRef && (
                    <span className="text-xs text-ink-muted hidden sm:inline">{q.clauseRef}</span>
                  )}
                  <span className="text-ink-muted text-xs">{isOpen ? '▲' : '▼'}</span>
                </div>
              </button>

              {/* Expanded detail */}
              {isOpen && (
                <div className="border-t border-border px-4 py-4 space-y-4">
                  {/* Full stem */}
                  <p className="text-sm text-ink leading-relaxed">{q.stem}</p>

                  {/* Options */}
                  {Object.keys(q.options || {}).length > 0 && (
                    <div className="space-y-2">
                      {Object.entries(q.options).map(([key, val]) => {
                        const isUser    = q.userAnswer    === key
                        const isCorrect = q.correctOption === key
                        let cls = 'border-border text-ink-secondary bg-transparent'
                        if (isCorrect)                cls = 'border-emerald-400 bg-emerald-50 text-emerald-800'
                        else if (isUser && !isCorrect) cls = 'border-red-400 bg-red-50 text-red-800'
                        return (
                          <div
                            key={key}
                            className={`flex items-start gap-2 px-3 py-2.5 rounded border text-sm ${cls}`}
                          >
                            <span className="font-semibold flex-shrink-0">{key}.</span>
                            <span className="flex-1">{val}</span>
                            {isCorrect && (
                              <span className="ml-auto flex-shrink-0 text-xs font-semibold text-emerald-700">
                                ✓ Correct
                              </span>
                            )}
                            {isUser && !isCorrect && (
                              <span className="ml-auto flex-shrink-0 text-xs font-semibold text-red-700">
                                Your answer
                              </span>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {/* Explanation */}
                  {q.explanation && (
                    <div className="bg-surface rounded-lg px-3 py-3">
                      <p className="text-xs font-semibold text-ink-secondary mb-1">Explanation</p>
                      <p className="text-sm text-ink-secondary leading-relaxed">{q.explanation}</p>
                    </div>
                  )}

                  {/* Clause ref + Flag button */}
                  <div className="flex items-center justify-between gap-2">
                    {q.clauseRef ? (
                      <span className="text-xs text-ink-muted">
                        ISO 27001:2022 — {q.clauseRef}
                      </span>
                    ) : <span />}
                    <button
                      onClick={() => handleFlag(q)}
                      disabled={flagged[q.id] || flagging[q.id]}
                      className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded border transition-colors ${
                        flagged[q.id]
                          ? 'border-gold text-gold cursor-default'
                          : 'border-border text-ink-muted hover:border-gold hover:text-gold'
                      }`}
                    >
                      <Flag size={11} />
                      {flagged[q.id] ? 'Flagged' : flagging[q.id] ? '…' : 'Flag inaccuracy'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Domain Breakdown ──────────────────────────────────────────────────────────
function DomainBreakdown({ topicBreakdown }) {
  const entries = Object.entries(topicBreakdown).sort(([a], [b]) => Number(a) - Number(b))

  const radarData = entries.map(([, d]) => ({
    subject:  shortDomain(d.domain),
    score:    d.pct,
    fullMark: 100,
  }))

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp size={16} className="text-gold" />
        <h2 className="text-base font-semibold text-ink">Domain Performance</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-center">

        {/* Radar chart — hidden on small screens */}
        <div className="hidden md:block h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData} cx="50%" cy="50%" outerRadius="70%">
              <PolarGrid stroke="#E5E5E3" />
              <PolarAngleAxis
                dataKey="subject"
                tick={{ fontSize: 11, fill: '#7A7A7A', fontFamily: 'Inter, system-ui, sans-serif' }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fontSize: 9, fill: '#7A7A7A' }}
                tickCount={4}
              />
              <Radar
                dataKey="score"
                stroke="#C9A84C"
                fill="rgba(201,168,76,0.20)"
                strokeWidth={2}
                dot={{ r: 3, fill: '#C9A84C' }}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Progress bars */}
        <div className="space-y-4">
          {entries.map(([thread, d]) => (
            <div key={thread}>
              <div className="flex justify-between items-baseline mb-1.5">
                <span className="text-xs font-medium text-ink-secondary leading-snug pr-2 line-clamp-1">
                  {d.domain}
                </span>
                <span className="text-xs font-semibold text-ink flex-shrink-0">
                  {d.correct}/{d.total}
                  <span className="text-ink-muted font-normal ml-1">({d.pct}%)</span>
                </span>
              </div>
              <div className="h-2 bg-surface rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${scoreColor(d.pct)}`}
                  style={{ width: `${d.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

// ── AI Report ─────────────────────────────────────────────────────────────────
function AIReport({ aiReport }) {
  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-5">
        <FileText size={16} className="text-gold" />
        <h2 className="text-base font-semibold text-ink">AI Performance Analysis</h2>
        {!aiReport && (
          <span className="ml-auto flex items-center gap-1.5 text-xs text-ink-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse-ring" />
            Generating…
          </span>
        )}
      </div>

      {aiReport ? (
        <div className="animate-fade-in">
          <MarkdownBlock content={aiReport} />
        </div>
      ) : (
        <div className="space-y-3 py-2">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <Skeleton className="h-3 w-4/5" />
          <Skeleton className="h-4 w-1/2 mt-5" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-4 w-2/5 mt-5" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-11/12" />
          <p className="text-xs text-ink-muted text-center pt-4">
            Your personalised report is being generated — this takes ~15 seconds.
          </p>
        </div>
      )}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ResultsPage() {
  const { sessionId } = useParams()
  const [data,  setData]  = useState(null)
  const [phase, setPhase] = useState('loading')   // loading | ready | error
  const [errMsg, setErrMsg] = useState('')
  const pollRef = useRef(null)

  const fetchReport = async () => {
    try {
      const res = await resultsApi.get(sessionId)
      const d   = res.data
      setData(d)
      setPhase('ready')

      // Stop polling once aiReport arrives
      if (d.aiReport && pollRef.current) {
        clearInterval(pollRef.current)
        pollRef.current = null
      }
    } catch (err) {
      if (phase === 'loading') {
        setErrMsg(err?.response?.data?.error || 'Could not load results.')
        setPhase('error')
      }
      // Silently skip poll failures once page is visible
    }
  }

  useEffect(() => {
    fetchReport()
    // Start polling for AI report every 4 s
    pollRef.current = setInterval(fetchReport, 4000)
    return () => {
      if (pollRef.current) clearInterval(pollRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId])

  // Stop polling once AI report is ready (also handles late poll arrival)
  useEffect(() => {
    if (data?.aiReport && pollRef.current) {
      clearInterval(pollRef.current)
      pollRef.current = null
    }
  }, [data?.aiReport])

  // ── Loading ──────────────────────────────────────────────────────────────
  if (phase === 'loading') {
    return (
      <div className="min-h-screen bg-surface">
        <AppNavbar />
        <div className="max-w-4xl mx-auto px-6 py-16 space-y-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-72 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (phase === 'error') {
    return (
      <div className="min-h-screen bg-surface">
        <AppNavbar />
        <div className="max-w-4xl mx-auto px-6 py-24 text-center">
          <AlertTriangle size={36} className="text-gold mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-ink mb-2">Results Unavailable</h1>
          <p className="text-ink-muted text-sm mb-8">{errMsg}</p>
          <Link to="/dashboard" className="btn btn-primary btn-md">
            <LayoutDashboard size={15} /> Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  // ── Ready ────────────────────────────────────────────────────────────────
  const { track, score, totalQuestions, passed, passPct, passThresholdPct, topicBreakdown, aiReport, completedAt, suspicious, suspiciousReason, questionReviews } = data
  const trackLabel = track === 'associate' ? 'Associate — ISMS Foundation' : 'Professional — Lead Auditor'
  const dateLabel  = completedAt
    ? new Date(completedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    : ''

  return (
    <div className="min-h-screen bg-surface">
      <AppNavbar />

      <main className="max-w-4xl mx-auto px-6 py-10 space-y-6 animate-fade-up">

        {/* ── Hero score card ───────────────────────────────────────────── */}
        <div className="card text-center py-10">
          {/* Pass / Fail badge */}
          <div className="flex justify-center mb-6">
            {passed ? (
              <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold text-sm tracking-wide">
                <CheckCircle2 size={16} /> PASSED
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-red-50 border border-red-200 text-red-700 font-semibold text-sm tracking-wide">
                <XCircle size={16} /> NOT PASSED
              </span>
            )}
          </div>

          {/* Score */}
          <div className="animate-count-up">
            <p className="text-hero font-serif font-bold text-ink leading-none mb-2 tabular-nums">
              {score}
              <span className="text-4xl text-ink-muted font-sans font-normal">/{totalQuestions}</span>
            </p>
            <p className="text-3xl font-bold text-ink mb-1">{passPct}%</p>
            <p className="text-xs text-ink-muted font-medium">
              Required to pass: {passThresholdPct}%
            </p>
          </div>

          {/* Meta */}
          <div className="mt-6 pt-6 border-t border-border space-y-1">
            <span className="badge-track">{trackLabel}</span>
            {dateLabel && <p className="text-xs text-ink-muted mt-2">{dateLabel}</p>}
          </div>
        </div>

        {/* ── Suspicion banner (shown only when flagged) ────────────────── */}
        {suspicious && (
          <SuspicionBanner reason={suspiciousReason} />
        )}

        {/* ── Domain breakdown ────────────────────────────────────── */}
        {topicBreakdown && Object.keys(topicBreakdown).length > 0 && (
          <DomainBreakdown topicBreakdown={topicBreakdown} />
        )}

        {/* ── AI Report ──────────────────────────────────────────── */}
        <AIReport aiReport={aiReport} />

        {/* ── Per-question review ────────────────────────────────── */}
        {questionReviews?.length > 0 && (
          <QuestionReview questions={questionReviews} sessionId={sessionId} />
        )}

        {/* ── Actions ──────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 pb-4">
          <Link
            to={`/generate/${track}`}
            className="btn btn-primary btn-md flex-1 justify-center"
          >
            <RotateCcw size={15} /> Retake Exam
          </Link>
          <Link
            to="/dashboard"
            className="btn btn-outline btn-md flex-1 justify-center"
          >
            <LayoutDashboard size={15} /> Back to Dashboard
          </Link>
        </div>

      </main>
    </div>
  )
}

