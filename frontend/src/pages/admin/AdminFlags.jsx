import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'

import { adminApi } from '@/lib/apiServices'

function Badge({ children, color }) {
  const map = { green: 'bg-green-100 text-green-700', red: 'bg-red-100 text-red-700', gray: 'bg-surface text-ink-muted', yellow: 'bg-yellow-100 text-yellow-700', blue: 'bg-blue-100 text-blue-700', purple: 'bg-purple-100 text-purple-700' }
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${map[color] || map.gray}`}>{children}</span>
}

const STATUS_META = {
  open:       { color: 'yellow', label: 'Open' },
  reviewed:   { color: 'green',  label: 'Reviewed' },
  dismissed:  { color: 'gray',   label: 'Dismissed' },
  escalated:  { color: 'red',    label: 'Escalated' },
}
const PAGE_SIZE = 50

function ReviewModal({ flag, onClose, onDone }) {
  const [note, setNote]     = useState(flag.admin_note || '')
  const [action, setAction] = useState('')
  const [saving, setSaving] = useState(false)
  const [err, setErr]       = useState(null)

  async function submit() {
    if (!action) {return setErr('Select an action.')}
    setSaving(true)
    try {
      await adminApi.updateFlag(flag.id, { status: action, admin_note: note })
      onDone()
    } catch { setErr('Failed to update.'); setSaving(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-ink">Review Flag</h2>
          <button onClick={onClose} className="text-ink-muted hover:text-ink text-xl leading-none">&times;</button>
        </div>

        <div className="bg-surface rounded-lg p-3 mb-4 text-sm space-y-1">
          <p className="font-medium text-ink">{flag.user_full_name} <span className="text-ink-muted font-normal">({flag.user_email})</span></p>
          <p className="text-ink-muted text-xs">{flag.session_track?.toUpperCase()} session</p>
          <p className="text-ink mt-1 leading-snug">Q: {flag.question_stem?.slice(0, 120)}{flag.question_stem?.length > 120 ? '…' : ''}</p>
          <p className="text-ink-muted italic mt-1">&ldquo;{flag.flag_reason}&rdquo;</p>
        </div>

        {err && <p className="text-sm text-red-600 mb-3">{err}</p>}

        <div className="mb-4">
          <label className="block text-xs font-medium text-ink-muted mb-1">Admin Note (optional)</label>
          <textarea className="input w-full text-sm h-20 resize-none" value={note} onChange={e => setNote(e.target.value)} placeholder="Internal note…" />
        </div>

        <div className="flex gap-2 mb-5">
          {['reviewed', 'dismissed', 'escalated'].map(s => (
            <button
              key={s}
              onClick={() => setAction(s)}
              className={`btn btn-sm border capitalize ${action === s ? 'border-gold text-gold bg-gold/10' : 'border-border text-ink-muted'}`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="btn btn-outline btn-sm">Cancel</button>
          <button onClick={submit} disabled={saving || !action} className="btn btn-gold btn-sm disabled:opacity-50">
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function AdminFlags() {
  useEffect(() => { document.title = 'Question Flags | Admin' }, [])

  const [flags, setFlags]       = useState([])
  const [total, setTotal]       = useState(0)
  const [page, setPage]         = useState(1)
  const [status, setStatus]     = useState('open')
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState(null)
  const [flash, setFlash]       = useState(null)

  const flash$ = (msg, type = 'success') => {
    setFlash({ msg, type })
    setTimeout(() => setFlash(null), 3000)
  }

  const load = useCallback(() => {
    setLoading(true)
    const p = { page, limit: PAGE_SIZE }
    if (status) {p.status = status}
    adminApi.getFlags(p)
      .then(r => { setFlags(r.data.flags); setTotal(r.data.total) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [page, status])

  useEffect(() => { load() }, [load])

  function handleDone() {
    setModal(null)
    flash$('Flag updated.')
    load()
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-ink mb-1">Question Flags</h1>
      <p className="text-sm text-ink-muted mb-6">{total} — user-reported question issues</p>

      {flash && (
        <div className={`mb-4 px-4 py-2 rounded-lg text-sm font-medium ${flash.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {flash.msg}
        </div>
      )}

      {/* Status tab strip */}
      <div className="flex gap-1 mb-5 border-b border-border">
        {['open', 'escalated', 'reviewed', 'dismissed', ''].map(s => (
          <button
            key={s || 'all'}
            onClick={() => { setStatus(s); setPage(1) }}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${status === s ? 'border-gold text-gold' : 'border-transparent text-ink-muted hover:text-ink'}`}
          >
            {s ? (STATUS_META[s]?.label || s) : 'All'}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-ink-muted uppercase tracking-wide">
              <th className="px-4 py-3 text-left">User</th>
              <th className="px-4 py-3 text-left">Track</th>
              <th className="px-4 py-3 text-left w-1/3">Question</th>
              <th className="px-4 py-3 text-left">Reason</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-ink-muted animate-pulse">Loading…</td></tr>
            ) : flags.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-ink-muted">No flags found.</td></tr>
            ) : flags.map(f => {
              const sm = STATUS_META[f.status] || { color: 'gray', label: f.status }
              return (
                <tr key={f.id} className="border-b border-border last:border-0 hover:bg-surface/50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink">{f.user_full_name}</p>
                    <p className="text-xs text-ink-muted">{f.user_email}</p>
                  </td>
                  <td className="px-4 py-3 capitalize text-ink-muted">{f.session_track || '—'}</td>
                  <td className="px-4 py-3 text-ink leading-tight text-xs">
                    {f.question_stem?.slice(0, 80)}{f.question_stem?.length > 80 ? '…' : ''}
                  </td>
                  <td className="px-4 py-3 text-xs text-ink-muted italic max-w-xs truncate">
                    {f.flag_reason}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge color={sm.color}>{sm.label}</Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-ink-muted">{new Date(f.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-center">
                    <button onClick={() => setModal(f)} className="btn btn-outline btn-sm text-xs">Review</button>
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

      {modal && <ReviewModal flag={modal} onClose={() => setModal(null)} onDone={handleDone} />}
    </div>
  )
}
