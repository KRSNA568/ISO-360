import { useState, useEffect, useCallback } from 'react'
import { adminApi } from '@/lib/apiServices'
import { ChevronLeft, ChevronRight, ChevronDown, ChevronRight as ChevronRt } from 'lucide-react'

const ACTION_COLOR = {
  block_user:    'bg-red-100 text-red-700',
  unblock_user:  'bg-green-100 text-green-700',
  revoke_cert:   'bg-red-100 text-red-700',
  flag_session:  'bg-yellow-100 text-yellow-700',
  update_flag:   'bg-blue-100 text-blue-700',
  add_question:  'bg-green-100 text-green-700',
  edit_question: 'bg-blue-100 text-blue-700',
  retire_question:'bg-yellow-100 text-yellow-700',
}

const ACTIONS = ['block_user','unblock_user','revoke_cert','flag_session','update_flag','add_question','edit_question','retire_question']
const TARGET_TYPES = ['user','session','certificate','question','flag']
const PAGE_SIZE = 50

function MetaCell({ meta }) {
  const [open, setOpen] = useState(false)
  if (!meta || Object.keys(meta).length === 0) return <span className="text-ink-muted">—</span>
  return (
    <div>
      <button onClick={() => setOpen(o => !o)} className="text-xs text-ink-muted hover:text-ink flex items-center gap-0.5">
        {open ? <ChevronDown size={11} /> : <ChevronRt size={11} />} JSON
      </button>
      {open && (
        <pre className="mt-1 text-xs bg-surface rounded p-2 max-w-xs overflow-x-auto text-ink-muted">
          {JSON.stringify(meta, null, 2)}
        </pre>
      )}
    </div>
  )
}

export default function AdminAuditLog() {
  useEffect(() => { document.title = 'Audit Log | Admin' }, [])

  const [rows, setRows]         = useState([])
  const [total, setTotal]       = useState(0)
  const [page, setPage]         = useState(1)
  const [action, setAction]     = useState('')
  const [targetType, setTType]  = useState('')
  const [loading, setLoading]   = useState(true)

  const load = useCallback(() => {
    setLoading(true)
    const p = { page, limit: PAGE_SIZE }
    if (action)     p.action = action
    if (targetType) p.target_type = targetType
    adminApi.getAuditLog(p)
      .then(r => { setRows(r.data.logs); setTotal(r.data.total) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [page, action, targetType])

  useEffect(() => { load() }, [load])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-ink mb-1">Audit Log</h1>
      <p className="text-sm text-ink-muted mb-6">{total} records — read only</p>

      <div className="flex gap-3 mb-5 flex-wrap">
        <select className="input text-sm" value={action} onChange={e => { setAction(e.target.value); setPage(1) }}>
          <option value="">All actions</option>
          {ACTIONS.map(a => <option key={a} value={a}>{a}</option>)}
        </select>
        <select className="input text-sm" value={targetType} onChange={e => { setTType(e.target.value); setPage(1) }}>
          <option value="">All target types</option>
          {TARGET_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-ink-muted uppercase tracking-wide">
              <th className="px-4 py-3 text-left">Timestamp</th>
              <th className="px-4 py-3 text-left">Admin</th>
              <th className="px-4 py-3 text-left">Action</th>
              <th className="px-4 py-3 text-left">Target</th>
              <th className="px-4 py-3 text-left">Target ID</th>
              <th className="px-4 py-3 text-left">Metadata</th>
              <th className="px-4 py-3 text-left">IP</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-ink-muted animate-pulse">Loading…</td></tr>
            ) : rows.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-ink-muted">No log entries found.</td></tr>
            ) : rows.map(r => (
              <tr key={r.id} className="border-b border-border last:border-0 hover:bg-surface/50">
                <td className="px-4 py-3 text-xs text-ink-muted whitespace-nowrap">
                  {new Date(r.created_at).toLocaleString()}
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-ink text-xs">{r.admin_name}</p>
                  <p className="text-xs text-ink-muted">{r.admin_email}</p>
                </td>
                <td className="px-4 py-3">
                  <span className={`font-mono text-xs px-2 py-0.5 rounded ${ACTION_COLOR[r.action] || 'bg-surface text-ink-muted'}`}>
                    {r.action}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-ink-muted capitalize">{r.target_type || '—'}</td>
                <td className="px-4 py-3 font-mono text-xs text-ink-muted">
                  {r.target_id ? r.target_id.slice(0, 8) + '…' : '—'}
                </td>
                <td className="px-4 py-3">
                  <MetaCell meta={r.metadata} />
                </td>
                <td className="px-4 py-3 text-xs text-ink-muted font-mono">{r.ip_address || '—'}</td>
              </tr>
            ))}
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
    </div>
  )
}
