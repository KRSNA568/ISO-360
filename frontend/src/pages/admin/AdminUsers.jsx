import { Search, ShieldOff, ShieldCheck, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'

import { adminApi } from '@/lib/apiServices'

function Badge({ children, color }) {
  const map = { green: 'bg-green-100 text-green-700', red: 'bg-red-100 text-red-700', gray: 'bg-surface text-ink-muted', yellow: 'bg-yellow-100 text-yellow-700' }
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${map[color] || map.gray}`}>{children}</span>
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
        <h2 className="text-base font-semibold text-ink">{title}</h2>
        {children}
        <button onClick={onClose} className="text-xs text-ink-muted hover:text-ink mt-2">Cancel</button>
      </div>
    </div>
  )
}

const PAGE_SIZE = 50

export default function AdminUsers() {
  useEffect(() => { document.title = 'Users | Admin' }, [])

  const [users, setUsers]       = useState([])
  const [total, setTotal]       = useState(0)
  const [page, setPage]         = useState(1)
  const [search, setSearch]     = useState('')
  const [blocked, setBlocked]   = useState('')
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState(null)   // { type: 'block'|'unblock', user }
  const [reason, setReason]     = useState('')
  const [acting, setActing]     = useState(false)
  const [flash, setFlash]       = useState('')

  const load = useCallback(() => {
    setLoading(true)
    adminApi.getUsers({ search, page, limit: PAGE_SIZE, ...(blocked ? { blocked } : {}) })
      .then(r => { setUsers(r.data.users); setTotal(r.data.total) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [search, page, blocked])

  useEffect(() => { load() }, [load])

  async function doBlock() {
    setActing(true)
    try {
      await adminApi.blockUser(modal.user.id, { reason: reason || 'Blocked by administrator' })
      setFlash(`${modal.user.full_name} blocked.`)
      setModal(null); setReason(''); load()
    } catch (e) {
      setFlash(e.response?.data?.error || 'Failed.')
    }
    setActing(false)
  }

  async function doUnblock(user) {
    try {
      await adminApi.unblockUser(user.id)
      setFlash(`${user.full_name} unblocked.`)
      load()
    } catch (e) {
      setFlash(e.response?.data?.error || 'Failed.')
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-ink mb-1">Users</h1>
      <p className="text-sm text-ink-muted mb-6">{total} total</p>

      {flash && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-green-50 border border-green-200 text-sm text-green-700">
          {flash}
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            className="input pl-9 w-64 text-sm"
            placeholder="Search name or email…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
          />
        </div>
        <select className="input text-sm" value={blocked} onChange={e => { setBlocked(e.target.value); setPage(1) }}>
          <option value="">All users</option>
          <option value="false">Active only</option>
          <option value="true">Blocked only</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-ink-muted uppercase tracking-wide">
              <th className="px-4 py-3 text-left">Name / Email</th>
              <th className="px-4 py-3 text-left">Company / Role</th>
              <th className="px-4 py-3 text-left">Country</th>
              <th className="px-4 py-3 text-center">Exams</th>
              <th className="px-4 py-3 text-center">Certs</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-left">Joined</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-ink-muted animate-pulse">Loading…</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-ink-muted">No users found.</td></tr>
            ) : users.map(u => (
              <tr key={u.id} className="border-b border-border last:border-0 hover:bg-surface/50">
                <td className="px-4 py-3">
                  <p className="font-medium text-ink">{u.full_name}</p>
                  <p className="text-xs text-ink-muted">{u.email}</p>
                </td>
                <td className="px-4 py-3 text-ink-muted">{u.company || u.job_role || '—'}</td>
                <td className="px-4 py-3 text-ink-muted">{u.country || '—'}</td>
                <td className="px-4 py-3 text-center">{u.exam_count}</td>
                <td className="px-4 py-3 text-center">{u.cert_count}</td>
                <td className="px-4 py-3 text-center">
                  {u.blocked
                    ? <Badge color="red">Blocked</Badge>
                    : u.email_verified
                    ? <Badge color="green">Active</Badge>
                    : <Badge color="yellow">Unverified</Badge>
                  }
                </td>
                <td className="px-4 py-3 text-ink-muted text-xs">{new Date(u.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  {u.blocked ? (
                    <button onClick={() => doUnblock(u)} className="btn btn-outline btn-sm text-xs gap-1">
                      <ShieldCheck size={13} /> Unblock
                    </button>
                  ) : u.role !== 'admin' ? (
                    <button onClick={() => { setModal({ type: 'block', user: u }); setReason('') }} className="btn btn-sm text-xs gap-1 bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-md px-3 h-9">
                      <ShieldOff size={13} /> Block
                    </button>
                  ) : (
                    <Badge color="gray">Admin</Badge>
                  )}
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
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn btn-outline btn-sm disabled:opacity-40">
            <ChevronLeft size={14} />
          </button>
          <button onClick={() => setPage(p => p + 1)} disabled={page * PAGE_SIZE >= total} className="btn btn-outline btn-sm disabled:opacity-40">
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      {/* Block modal */}
      {modal?.type === 'block' && (
        <Modal title={`Block ${modal.user.full_name}?`} onClose={() => setModal(null)}>
          <p className="text-sm text-ink-muted">They will be unable to log in or take exams. This is reversible.</p>
          <textarea
            className="input w-full mt-2 text-sm h-20 resize-none"
            placeholder="Reason (optional)"
            value={reason}
            onChange={e => setReason(e.target.value)}
          />
          <button onClick={doBlock} disabled={acting} className="btn btn-sm w-full justify-center bg-red-600 text-white hover:bg-red-700 mt-2">
            {acting ? <Loader2 size={14} className="animate-spin" /> : 'Confirm Block'}
          </button>
        </Modal>
      )}
    </div>
  )
}
