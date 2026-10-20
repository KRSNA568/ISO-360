import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'

import { adminApi } from '@/lib/apiServices'

// Thresholds for highlighting — evidence for review, not an automatic verdict.
const HIGH_A_PCT   = 95
const FAST_SECS_PQ = 6

function Badge({ children, color }) {
  const map = { green: 'bg-green-100 text-green-700', red: 'bg-red-100 text-red-700', gray: 'bg-surface text-ink-muted', yellow: 'bg-yellow-100 text-yellow-700' }
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${map[color] || map.gray}`}>{children}</span>
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-ink">{title}</h2>
          <button onClick={onClose} className="text-ink-muted hover:text-ink text-xl leading-none">&times;</button>
        </div>
        {children}
      </div>
    </div>
  )
}

function formatDuration(secs) {
  if (secs === null || secs === undefined) {return '—'}
  const m = Math.floor(secs / 60)
  const s = secs % 60
  return `${m}m ${String(s).padStart(2, '0')}s`
}

const PAGE_SIZE = 50

export default function AdminIntegrity() {
  useEffect(() => { document.title = 'Integrity Audit | Admin' }, [])

  const [certs, setCerts]       = useState([])
  const [total, setTotal]       = useState(0)
  const [page, setPage]         = useState(1)
  const [track, setTrack]       = useState('')
  const [loading, setLoading]   = useState(true)
  const [selected, setSelected] = useState(() => new Set())
  const [modal, setModal]       = useState(false)
  const [reason, setReason]     = useState('')
  const [acting, setActing]     = useState(false)
  const [flash, setFlash]       = useState(null)

  const flash$ = (msg, type = 'success') => {
    setFlash({ msg, type })
    setTimeout(() => setFlash(null), 4000)
  }

  const load = useCallback(() => {
    setLoading(true)
    const p = { page, limit: PAGE_SIZE }
    if (track) {p.track = track}
    adminApi.getIntegrityAudit(p)
      .then(r => { setCerts(r.data.certificates); setTotal(r.data.total) })
      .catch(() => flash$('Failed to load audit.', 'error'))
      .finally(() => setLoading(false))
  }, [page, track])

  useEffect(() => { load() }, [load])

  function toggle(id) {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(id)) {next.delete(id)} else {next.add(id)}
      return next
    })
  }

  const allOnPageSelected = certs.length > 0 && certs.every(c => selected.has(c.id))
  function toggleAll() {
    setSelected(prev => {
      const next = new Set(prev)
      certs.forEach(c => (allOnPageSelected ? next.delete(c.id) : next.add(c.id)))
      return next
    })
  }

  async function handleBulkRevoke() {
    if (!reason.trim() || selected.size === 0) {return}
    setActing(true)
    try {
      const { data } = await adminApi.bulkRevokeCertificates({ ids: [...selected], reason })
      const msg = `Revoked ${data.revoked.length}` + (data.failed.length ? `, ${data.failed.length} failed` : '')
      flash$(msg, data.failed.length ? 'error' : 'success')
      setSelected(new Set())
      setModal(false)
      setReason('')
      load()
    } catch { flash$('Bulk revoke failed.', 'error') }
    setActing(false)
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-ink mb-1">Integrity Audit</h1>
      <p className="text-sm text-ink-muted mb-2">{total} active certificates issued before answer options were shuffled</p>
      <p className="text-xs text-ink-muted mb-6 max-w-3xl">
        Until the answer-key fix, every correct answer was option A, so answering A throughout passed the exam.
        Genuine passes from that period are also all-A, so a high A-share alone proves nothing — weigh it with
        time per question, tab violations and existing flags. Rows are sorted most suspicious first.
      </p>

      {flash && (
        <div className={`mb-4 px-4 py-2 rounded-lg text-sm font-medium ${flash.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {flash.msg}
        </div>
      )}

      <div className="flex gap-3 mb-5 items-center">
        <select className="input text-sm w-auto" value={track} onChange={e => { setTrack(e.target.value); setPage(1) }}>
          <option value="">All tracks</option>
          <option value="associate">Associate</option>
          <option value="professional">Professional</option>
        </select>
        <button
          onClick={() => setModal(true)}
          disabled={selected.size === 0}
          className="btn btn-sm whitespace-nowrap text-red-600 border border-red-200 hover:bg-red-50 disabled:opacity-40"
        >
          Revoke selected ({selected.size})
        </button>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-ink-muted uppercase tracking-wide">
              <th className="px-4 py-3 text-left">
                <input type="checkbox" aria-label="Select all on page" checked={allOnPageSelected} onChange={toggleAll} />
              </th>
              <th className="px-4 py-3 text-left">Holder</th>
              <th className="px-4 py-3 text-left">Track</th>
              <th className="px-4 py-3 text-center">Score</th>
              <th className="px-4 py-3 text-center">Time</th>
              <th className="px-4 py-3 text-center">s / question</th>
              <th className="px-4 py-3 text-center">Answered A</th>
              <th className="px-4 py-3 text-center">Tab switches</th>
              <th className="px-4 py-3 text-left">Flags</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9} className="px-4 py-8 text-center text-ink-muted animate-pulse">Loading…</td></tr>
            ) : certs.length === 0 ? (
              <tr><td colSpan={9} className="px-4 py-8 text-center text-ink-muted">No pre-fix certificates to review.</td></tr>
            ) : certs.map(c => {
              const highA = c.a_answer_pct !== null && c.a_answer_pct >= HIGH_A_PCT
              const fast  = c.secs_per_question !== null && c.secs_per_question < FAST_SECS_PQ
              return (
                <tr key={c.id} className="border-b border-border last:border-0 hover:bg-surface/50">
                  <td className="px-4 py-3">
                    <input type="checkbox" aria-label={`Select ${c.certificate_id}`} checked={selected.has(c.id)} onChange={() => toggle(c.id)} />
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink">{c.full_name}</p>
                    <p className="text-xs text-ink-muted">{c.email}</p>
                    <p className="font-mono text-xs text-ink-muted">{c.certificate_id}</p>
                  </td>
                  <td className="px-4 py-3 capitalize text-ink-muted">{c.track}</td>
                  <td className="px-4 py-3 text-center font-semibold text-ink">{c.score}/{c.total_questions}</td>
                  <td className="px-4 py-3 text-center text-ink-muted">{formatDuration(c.duration_secs)}</td>
                  <td className={`px-4 py-3 text-center ${fast ? 'font-semibold text-red-600' : 'text-ink-muted'}`}>
                    {c.secs_per_question ?? '—'}
                  </td>
                  <td className={`px-4 py-3 text-center ${highA ? 'font-semibold text-red-600' : 'text-ink-muted'}`}>
                    {c.a_answer_pct === null ? '—' : `${c.a_answer_pct}%`}
                    <span className="block text-xs text-ink-muted font-normal">{c.a_answers}/{c.answered}</span>
                  </td>
                  <td className="px-4 py-3 text-center text-ink-muted">{c.tab_violations}</td>
                  <td className="px-4 py-3">
                    {c.suspicious
                      ? <span title={c.suspicious_reason || ''}><Badge color="yellow">Suspicious</Badge></span>
                      : <Badge color="gray">—</Badge>}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4 text-sm text-ink-muted">
        <span>Showing {Math.min((page - 1) * PAGE_SIZE + 1, total)}–{Math.min(page * PAGE_SIZE, total)} of {total}</span>
        <div className="flex gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn btn-outline btn-sm disabled:opacity-40"><ChevronLeft size={14} /></button>
          <button onClick={() => setPage(p => p + 1)} disabled={page * PAGE_SIZE >= total} className="btn btn-outline btn-sm disabled:opacity-40"><ChevronRight size={14} /></button>
        </div>
      </div>

      {modal && (
        <Modal title={`Revoke ${selected.size} certificate${selected.size === 1 ? '' : 's'}`} onClose={() => { setModal(false); setReason('') }}>
          <p className="text-sm text-ink-muted mb-3">
            Each holder is notified by email and every revocation is written to the audit log. This cannot be undone.
          </p>
          <textarea
            className="input w-full text-sm h-24 resize-none mb-4"
            placeholder="Reason for revocation (required)…"
            value={reason}
            onChange={e => setReason(e.target.value)}
          />
          <div className="flex gap-3 justify-end">
            <button onClick={() => { setModal(false); setReason('') }} className="btn btn-outline btn-sm">Cancel</button>
            <button
              onClick={handleBulkRevoke}
              disabled={acting || !reason.trim()}
              className="btn btn-sm bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
            >
              {acting ? 'Revoking…' : 'Confirm Revoke'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
