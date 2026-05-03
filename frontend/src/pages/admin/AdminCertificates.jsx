import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'

import { adminApi } from '@/lib/apiServices'

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

const PAGE_SIZE = 50

export default function AdminCertificates() {
  useEffect(() => { document.title = 'Certificates | Admin' }, [])

  const [certs, setCerts]       = useState([])
  const [total, setTotal]       = useState(0)
  const [page, setPage]         = useState(1)
  const [track, setTrack]       = useState('')
  const [revoked, setRevoked]   = useState('')
  const [loading, setLoading]   = useState(true)
  const [modal, setModal]       = useState(null)  // { id, certId }
  const [reason, setReason]     = useState('')
  const [acting, setActing]     = useState(false)
  const [flash, setFlash]       = useState(null)

  const flash$ = (msg, type = 'success') => {
    setFlash({ msg, type })
    setTimeout(() => setFlash(null), 3000)
  }

  const load = useCallback(() => {
    setLoading(true)
    const p = { page, limit: PAGE_SIZE }
    if (track)   {p.track = track}
    if (revoked) {p.revoked = revoked}
    adminApi.getCertificates(p)
      .then(r => { setCerts(r.data.certificates); setTotal(r.data.total) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [page, track, revoked])

  useEffect(() => { load() }, [load])

  async function handleRevoke() {
    if (!reason.trim()) {return}
    setActing(true)
    try {
      await adminApi.revokeCertificate(modal.id, { reason })
      flash$('Certificate revoked.')
      setModal(null)
      setReason('')
      load()
    } catch { flash$('Failed to revoke.', 'error') }
    setActing(false)
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-ink mb-1">Certificates</h1>
      <p className="text-sm text-ink-muted mb-6">{total} total</p>

      {flash && (
        <div className={`mb-4 px-4 py-2 rounded-lg text-sm font-medium ${flash.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {flash.msg}
        </div>
      )}

      <div className="flex gap-3 mb-5">
        <select className="input text-sm" value={track} onChange={e => { setTrack(e.target.value); setPage(1) }}>
          <option value="">All tracks</option>
          <option value="associate">Associate</option>
          <option value="professional">Professional</option>
        </select>
        <select className="input text-sm" value={revoked} onChange={e => { setRevoked(e.target.value); setPage(1) }}>
          <option value="">All</option>
          <option value="false">Active only</option>
          <option value="true">Revoked only</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-ink-muted uppercase tracking-wide">
              <th className="px-4 py-3 text-left">Cert ID</th>
              <th className="px-4 py-3 text-left">Holder</th>
              <th className="px-4 py-3 text-left">Track</th>
              <th className="px-4 py-3 text-center">Score</th>
              <th className="px-4 py-3 text-left">Awarded</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-center">Download</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-ink-muted animate-pulse">Loading…</td></tr>
            ) : certs.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-ink-muted">No certificates found.</td></tr>
            ) : certs.map(c => (
              <tr key={c.id} className="border-b border-border last:border-0 hover:bg-surface/50">
                <td className="px-4 py-3 font-mono text-xs text-ink-muted">{c.certificate_id}</td>
                <td className="px-4 py-3">
                  <p className="font-medium text-ink">{c.full_name}</p>
                  <p className="text-xs text-ink-muted">{c.email}</p>
                </td>
                <td className="px-4 py-3 capitalize text-ink-muted">{c.track}</td>
                <td className="px-4 py-3 text-center font-semibold text-ink">{c.score ?? '—'}</td>
                <td className="px-4 py-3 text-xs text-ink-muted">{new Date(c.issued_at || c.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-center">
                  {c.revoked
                    ? <Badge color="red">Revoked</Badge>
                    : <Badge color="green">Active</Badge>
                  }
                </td>
                <td className="px-4 py-3 text-center">
                  {c.r2_url_landscape && (
                    <a href={c.r2_url_landscape} target="_blank" rel="noopener noreferrer" className="text-gold hover:underline inline-flex items-center gap-1">
                      <ExternalLink size={13} /> PDF
                    </a>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  {!c.revoked && (
                    <button
                      onClick={() => setModal({ id: c.id, certId: c.certificate_id })}
                      className="btn btn-sm text-red-600 border border-red-200 hover:bg-red-50"
                    >
                      Revoke
                    </button>
                  )}
                </td>
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

      {modal && (
        <Modal title={`Revoke ${modal.certId}`} onClose={() => { setModal(null); setReason('') }}>
          <p className="text-sm text-ink-muted mb-3">This will revoke the certificate and notify the holder by email. This action cannot be undone.</p>
          <textarea
            className="input w-full text-sm h-24 resize-none mb-4"
            placeholder="Reason for revocation (required)…"
            value={reason}
            onChange={e => setReason(e.target.value)}
          />
          <div className="flex gap-3 justify-end">
            <button onClick={() => { setModal(null); setReason('') }} className="btn btn-outline btn-sm">Cancel</button>
            <button
              onClick={handleRevoke}
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
