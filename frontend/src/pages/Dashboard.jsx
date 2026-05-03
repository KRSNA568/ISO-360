import { EXAM_CONFIG } from '@27001certified/shared/constants'
import { Clock, Award, BookOpen, Zap, ChevronRight, RotateCcw, Download, ExternalLink } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import AppNavbar from '@/components/layout/AppNavbar'
import { useAuth } from '@/context/AuthContext'
import { userApi } from '@/lib/apiServices'
import { cn } from '@/lib/cn'


// ─── Track data ─────────────────────────────────────────────────────────────────────────

const TRACKS = [
  {
    slug:        'associate',
    name:        'Associate',
    subtitle:    'ISMS Foundation',
    desc:        'Clauses 4-10 · Risk methodology · Leadership requirements',
    accentClass: 'border-blue-200 bg-blue-50',
    iconClass:   'text-blue-600 bg-blue-100',
    icon:        BookOpen,
    questions:   EXAM_CONFIG.associate.TOTAL_QUESTIONS,
    time:        `${EXAM_CONFIG.associate.EXAM_DURATION_SECONDS / 60} min`,
    pass:        `${EXAM_CONFIG.associate.PASS_THRESHOLD_PCT}%`,
  },
  {
    slug:        'professional',
    name:        'Professional',
    subtitle:    'Lead Auditor',
    desc:        'Annex A Controls · ISO 19011 · Non-conformity scenarios',
    accentClass: 'border-amber-200 bg-amber-50',
    iconClass:   'text-amber-700 bg-amber-100',
    icon:        Zap,
    questions:   EXAM_CONFIG.professional.TOTAL_QUESTIONS,
    time:        `${EXAM_CONFIG.professional.EXAM_DURATION_SECONDS / 60} min`,
    pass:        `${EXAM_CONFIG.professional.PASS_THRESHOLD_PCT}%`,
  },
]

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub }) {
  return (
    <div className="card py-5">
      <p className="text-2xl font-serif font-bold text-ink">{value}</p>
      <p className="text-xs text-ink-muted font-medium mt-0.5">{label}</p>
      {sub && <p className="text-xs text-ink-muted mt-1">{sub}</p>}
    </div>
  )
}

// ─── Track Card ───────────────────────────────────────────────────────────────

function TrackCard({ track }) {
  const Icon = track.icon
  return (
    <div className={cn('card border-2 flex flex-col gap-4', track.accentClass)}>
      <div className="flex items-start gap-3">
        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0', track.iconClass)}>
          <Icon size={18} />
        </div>
        <div>
          <h3 className="font-semibold text-ink">{track.name}</h3>
          <p className="text-xs text-ink-muted font-medium">{track.subtitle}</p>
        </div>
      </div>

      <p className="text-sm text-ink-muted leading-relaxed">{track.desc}</p>

      <div className="flex gap-4 text-xs text-ink-muted">
        <span className="flex items-center gap-1"><Award size={11} /> {track.questions} questions</span>
        <span className="flex items-center gap-1"><Clock size={11} /> {track.time}</span>
        <span>{track.pass} pass</span>
      </div>

      <Link
        to={`/generate/${track.slug}`}
        className="btn btn-primary btn-sm w-full justify-center mt-auto"
      >
        Start Exam <ChevronRight size={14} />
      </Link>
    </div>
  )
}

// ─── Certificates Card ───────────────────────────────────────────────────────────

function CertificatesSection({ certs, loading }) {
  if (loading) {
    return (
      <div className="card">
        <h2 className="text-base font-semibold text-ink mb-5">My Certificates</h2>
        <div className="py-6 text-center text-ink-muted text-sm animate-pulse">Loading…</div>
      </div>
    )
  }

  if (!certs.length) {return null}  // Don't show section if no certs yet

  const TRACK_LABEL = { associate: 'Associate', professional: 'Professional' }


  return (
    <div className="card">
      <h2 className="text-base font-semibold text-ink mb-5">My Certificates</h2>
      <div className="space-y-3">
        {certs.map((c) => {
          const date    = new Date(c.awarded_on || c.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
          const revoked = c.revoked
          return (
            <div
              key={c.certificate_id}
              className={cn(
                'flex items-center justify-between gap-4 p-4 rounded-lg border',
                revoked ? 'border-red-200 bg-red-50/50 opacity-60' : 'border-gold/20 bg-gradient-to-r from-surface to-surface-raised'
              )}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className={cn('w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0', revoked ? 'bg-red-100' : 'bg-gold/10')}>
                  <Award size={14} className={revoked ? 'text-red-500' : 'text-gold'} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink truncate">
                    ISO 27001 — {TRACK_LABEL[c.track] || c.track}
                    {revoked && <span className="ml-2 text-xs text-red-500 font-normal">(Revoked)</span>}
                  </p>
                  <p className="text-xs text-ink-muted font-mono">{c.certificate_id}</p>
                  <p className="text-xs text-ink-muted mt-0.5">Awarded {date}</p>
                </div>
              </div>

              {!revoked && (
                <div className="flex items-center gap-2 flex-shrink-0">
                  {c.r2_url_landscape && (
                    <a
                      href={c.r2_url_landscape}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-md text-ink-muted hover:text-ink hover:bg-surface-raised transition-all"
                      title="Download certificate"
                    >
                      <Download size={14} />
                    </a>
                  )}
                  <Link
                    to={`/verify/${c.certificate_id}`}
                    className="p-1.5 rounded-md text-ink-muted hover:text-gold hover:bg-surface-raised transition-all"
                    title="Verify certificate"
                  >
                    <ExternalLink size={14} />
                  </Link>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Attempts Table ──────────────────────────────────────────────────────────────────────

function AttemptsTable({ attempts, loading }) {
  if (loading) {
    return (
      <div className="py-12 text-center text-ink-muted text-sm animate-pulse">Loading attempts…</div>
    )
  }

  if (!attempts.length) {
    return (
      <div className="py-12 text-center">
        <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center mx-auto mb-3">
          <RotateCcw size={20} className="text-ink-muted" />
        </div>
        <p className="text-sm text-ink-muted">No attempts yet. Choose a track above to begin.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs text-ink-muted font-medium uppercase tracking-wider">
            <th className="pb-3 pr-4">Track</th>
            <th className="pb-3 pr-4">Score</th>
            <th className="pb-3 pr-4">Result</th>
            <th className="pb-3 pr-4">Date</th>
            <th className="pb-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {attempts.map((a) => {
            const pct      = a.total_questions ? Math.round((a.score / a.total_questions) * 100) : null
            const passed   = a.status === 'completed' && pct !== null && pct >= 80
            const trackLabel = a.track === 'associate' ? 'Associate' : 'Professional'
            const date     = new Date(a.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })

            return (
              <tr key={a.id} className="hover:bg-surface/50 transition-colors">
                <td className="py-3 pr-4 font-medium text-ink">{trackLabel}</td>
                <td className="py-3 pr-4 text-ink-muted">
                  {pct !== null ? `${pct}% (${a.score}/${a.total_questions})` : '—'}
                </td>
                <td className="py-3 pr-4">
                  {a.status === 'completed' ? (
                    <span className={passed ? 'badge-pass' : 'badge-fail'}>
                      {passed ? 'Pass' : 'Fail'}
                    </span>
                  ) : (
                    <span className="text-xs text-ink-muted capitalize">{a.status}</span>
                  )}
                </td>
                <td className="py-3 pr-4 text-ink-muted">{date}</td>
                <td className="py-3 text-right">
                  {a.status === 'completed' && (
                    <Link
                      to={`/results/${a.id}`}
                      className="text-xs text-gold hover:text-gold-dark font-medium transition-colors"
                    >
                      View →
                    </Link>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const { user }          = useAuth()
  const [attempts,   setAttempts]   = useState([])
  const [attLoading, setAttLoading] = useState(true)
  const [stats,      setStats]      = useState(user?.stats || null)
  const [certs,      setCerts]      = useState([])
  const [certLoading, setCertLoading] = useState(true)

  useEffect(() => { document.title = 'Dashboard | 27001certified' }, [])

  useEffect(() => {
    // Fresh stats — auth context may be stale after completing an exam
    userApi.getMe()
      .then(r => setStats(r.data.stats))
      .catch(() => {})

    userApi.getAttempts()
      .then(r => setAttempts(r.data.data || []))
      .catch(() => {})
      .finally(() => setAttLoading(false))

    userApi.getCertificates()
      .then(r => setCerts(r.data.data || []))
      .catch(() => {})
      .finally(() => setCertLoading(false))
  }, [])

  const firstName = user?.full_name?.split(' ')[0] || 'there'

  return (
    <div className="min-h-screen bg-surface">
      <AppNavbar />

      <main className="max-w-5xl mx-auto px-6 py-10 space-y-10">

        {/* Welcome strip */}
        <div>
          <span className="overline">Dashboard</span>
          <h1 className="text-display font-serif font-bold text-ink mt-1">
            Welcome back, {firstName}.
          </h1>
          <p className="text-ink-muted mt-2 text-sm">
            Ready for your next exam? Choose a track below.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <StatCard label="Total Attempts"  value={stats?.total_attempts ?? '—'} />
          <StatCard label="Exams Passed"    value={stats?.total_passed   ?? '—'} />
          <StatCard
            label="Pass Rate"
            value={
              stats?.total_attempts
                ? `${Math.round(((stats.total_passed || 0) / stats.total_attempts) * 100)}%`
                : '—'
            }
            sub={stats?.total_attempts ? `${stats.total_attempts} attempts` : 'No attempts yet'}
          />
        </div>

        {/* Tracks */}
        <div>
          <h2 className="text-base font-semibold text-ink mb-4">Choose Your Track</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {TRACKS.map(t => <TrackCard key={t.slug} track={t} />)}
          </div>
        </div>

        {/* Certificates */}
        <CertificatesSection certs={certs} loading={certLoading} />

        {/* Attempt history */}
        <div className="card">
          <h2 className="text-base font-semibold text-ink mb-5">Attempt History</h2>
          <AttemptsTable attempts={attempts} loading={attLoading} />
        </div>

      </main>
    </div>
  )
}

