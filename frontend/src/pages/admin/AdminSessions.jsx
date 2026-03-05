import { useState, useEffect, useCallback } from 'react'
import { adminApi } from '@/lib/apiServices'
import { X, ChevronLeft, ChevronRight, AlertTriangle, Loader2 } from 'lucide-react'

function Badge({ children, color }) {
  const map = { green: 'bg-green-100 text-green-700', red: 'bg-red-100 text-red-700', gray: 'bg-surface text-ink-muted', yellow: 'bg-yellow-100 text-yellow-700', blue: 'bg-blue-100 text-blue-700' }
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${map[color] || map.gray}`}>{children}</span>
}

const STATUS_COLORS = { active: 'blue', completed: 'green', expired: 'gray', aborted: 'gray', generating: 'yellow', ready: 'yellow' }
const PAGE_SIZE = 50

export default function AdminSessions() {
  useEffect(() => { document.title = 'Sessions | Admin' }, [])

  const [sessions, setSessions] = useState([])
  const [total, setTotal]       = useState(0)
  const [page, setPage]         = useState(1)
  const [track, setTrack]       = useState('')
  const [status, setStatus]     = useState('')
  const [suspicious, setSusp]   = useState('')
  const [loading, setLoading]   = useState(true)
  const [detail, setDetail]     = useState(null)  // full session object
  const [detailLoading, setDL]  = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    const p = { page, limit: PAGE_SIZE }
    if (track)      p.track = track
    if (status)     p.status = status
    if (suspicious) p.suspicious = suspicious
    adminApi.getSessions(p)
      .then(r => { setSessions(r.data.sessions); setTotal(r.data.total) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [page, track, status, suspicious])

  useEffect(() => { load() }, [load])

  async function openDetail(id) {
    setDL(true)
    try {
      const r = await adminApi.getSession(id)
      setDetail(r.data)
    } catch { setDetail(null) }
    setDL(false)
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-ink mb-1">Sessions</h1>
      <p className="text-sm text-ink-muted mb-6">{total} total — click a row to inspect</p>

      {/* Filters */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <select className="input text-sm" value={track} onChange={e => { setTrack(e.target.value); setPage(1) }}>
          <option value="">All tracks</option>
          <option value="associate">Associate</option>
          <option value="professional">Professional</option>
        </select>
        <select className="input text-sm" value={status} onChange={e => { setStatus(e.target.value); setPage(1) }}>
          <option value="">All statuses</option>
          {['generating','ready','active','completed','expired','aborted'].map(s => (
            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
          ))}
        </select>
        <select className="input text-sm" value={suspicious} onChange={e => { setSusp(e.target.value); setPage(1) }}>
          <option value="">All</option>
          <option value="true">Suspicious only</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-ink-muted uppercase tracking-wide">
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Track</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-center">Score</th>
              <th className="px-4 py-3 text-center">Tab Viol.</th>
              <th className="px-4 py-3 text-center">Qs</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-center">Flags</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-ink-muted animate-pulse">Loading…</td></tr>
            ) : sessions.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-ink-muted">No sessions found.</td></tr>
            ) : sessions.map(s => (
              <tr
                key={s.id}
                className="border-b border-border last:border-0 hover:bg-surface/50 cursor-pointer"
                onClick={() => openDetail(s.id)}
              >
                <td className="px-4 py-3">
                  <p className="font-medium text-ink">{s.full_name}</p>
                  <p className="text-xs text-ink-muted">{s.email}</p>
                </td>
                <td className="px-4 py-3 capitalize text-ink-muted">{s.track}</td>
                <td className="px-4 py-3">
                  <Badge color={STATUS_COLORS[s.status] || 'gray'}>{s.status}</Badge>
                </td>
                <td className="px-4 py-3 text-center">
                  {s.score !== null
                    ? <span className={s.passed ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>{s.score}</span>
                    : '—'
                  }
                </td>
                <td className="px-4 py-3 text-center">
                  {parseInt(s.tab_violations) > 0
                    ? <span className="text-yellow-600 font-semibold">{s.tab_violations}</span>
                    : <span className="text-ink-muted">0</span>
                  }
                </td>
                <td className="px-4 py-3 text-center text-ink-muted">{s.qlen}</td>
                <td className="px-4 py-3 text-xs text-ink-muted">{new Date(s.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-center">
                  {s.suspicious && <AlertTriangle size={14} className="text-red-500 mx-auto" />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4 text-sm text-ink-muted">
        <span>Showing {Math.min((page - 1) * PAGE_SIZE + 1, total)}–{Math.min(page * PAGE_SIZE, total)} of {total}</span>
        <div className="flex gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn btn-outline btn-sm disabled:opacity-40"><ChevronLeft size={14} /></button>
          <button onClick={() => setPage(p => p + 1)} disabled={page * PAGE_SIZE >= total} className="btn btn-outline btn-sm disabled:opacity-40"><ChevronRight size={14} /></button>
        </div>
      </div>

      {/* Detail panel */}
      {(detailLoading || detail) && (
        <div className="fixed inset-0 z-50 flex items-start justify-end bg-black/40" onClick={() => setDetail(null)}>
          <div
            className="bg-white h-full w-full max-w-xl overflow-y-auto shadow-2xl p-6 relative"
            onClick={e => e.stopPropagation()}
          >
            <button onClick={() => setDetail(null)} className="absolute top-4 right-4 text-ink-muted hover:text-ink">
              <X size={18} />
            </button>

            {detailLoading ? (
              <div className="flex items-center justify-center h-full"><Loader2 size={20} className="animate-spin text-ink-muted" /></div>
            ) : (
              <>
                <h2 className="text-lg font-bold text-ink mb-1">Session Detail</h2>
                <p className="text-xs text-ink-muted mb-4 font-mono">{detail.id}</p>

                <div className="space-y-2 text-sm mb-6">
                  {[
                    ['User', `${detail.full_name} (${detail.email})`],
                    ['Track', detail.track],
                    ['Status', detail.status],
                    ['Score', detail.score !== null ? `${detail.score} — ${detail.passed ? 'PASS' : 'FAIL'}` : '—'],
                    ['Tab Violations', detail.tab_violations],
                    ['Generation', detail.generation_method || '—'],
                    ['IP', detail.ip_address || '—'],
                    ['User Agent', detail.user_agent ? detail.user_agent.slice(0, 60) + '…' : '—'],
                    ['Started', detail.started_at ? new Date(detail.started_at).toLocaleString() : '—'],
                    ['Completed', detail.completed_at ? new Date(detail.completed_at).toLocaleString() : '—'],
                    ['Suspicious', detail.suspicious ? `YES — ${detail.suspicious_reason}` : 'No'],
                  ].map(([k, v]) => (
                    <div key={k} className="flex gap-2">
                      <span className="text-ink-muted w-32 shrink-0">{k}</span>
                      <span className="text-ink font-medium">{v}</span>
                    </div>
                  ))}
                </div>

                {detail.questions?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-ink mb-3">Questions ({detail.questions.length})</h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {detail.questions.map((q, i) => {
                        const ans = detail.answers?.find?.(a => a.question_id === q.id || a.questionId === q.id)
                        return (
                          <div key={q.id} className={`text-xs p-3 rounded-lg border ${ans?.answer === q.correct_option ? 'border-green-200 bg-green-50' : ans?.answer ? 'border-red-200 bg-red-50' : 'border-border bg-surface'}`}>
                            <p className="font-medium text-ink mb-1">Q{i + 1}: {q.stem}</p>
                            <p className="text-ink-muted">Correct: <strong>{q.correct_option}</strong>{ans?.answer ? ` · Answered: ${ans.answer}` : ' · No answer'}</p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
