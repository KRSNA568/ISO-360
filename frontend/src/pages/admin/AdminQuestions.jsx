import { Plus, Pencil, Archive, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'

import { adminApi } from '@/lib/apiServices'

function Badge({ children, color }) {
  const map = { green: 'bg-green-100 text-green-700', red: 'bg-red-100 text-red-700', gray: 'bg-surface text-ink-muted', yellow: 'bg-yellow-100 text-yellow-700', blue: 'bg-blue-100 text-blue-700' }
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${map[color] || map.gray}`}>{children}</span>
}

const DIFFICULTY_COL = { easy: 'green', medium: 'yellow', hard: 'red' }
const DOMAINS = ['Organisational','People','Physical','Technological','Governance','Risk','Compliance','BCP','Other']
const THREADS = ['Annex A','Clause 4','Clause 5','Clause 6','Clause 7','Clause 8','Clause 9','Clause 10','Other']
const BLANK_Q = { stem: '', option_a: '', option_b: '', option_c: '', option_d: '', correct_option: 'A', explanation: '', clause_ref: '', difficulty: 'medium', domain: '', track: 'associate', thread: '', source: '' }
const PAGE_SIZE = 50

function QuestionModal({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || BLANK_Q)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState(null)

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  async function submit(e) {
    e.preventDefault()
    if (!form.stem.trim()) {return setErr('Stem is required.')}
    setSaving(true)
    try { await onSave(form) }
    catch (e) { setErr(e?.response?.data?.error || 'Failed to save.'); setSaving(false) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
      <form onSubmit={submit} className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 my-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-ink">{initial ? 'Edit Question' : 'Add Question'}</h2>
          <button type="button" onClick={onClose} className="text-ink-muted hover:text-ink text-xl leading-none">&times;</button>
        </div>

        {err && <p className="text-sm text-red-600 mb-3">{err}</p>}

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-ink-muted mb-1">Stem *</label>
            <textarea className="input w-full text-sm h-24 resize-none" value={form.stem} onChange={set('stem')} required />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {['a','b','c','d'].map(opt => (
              <div key={opt}>
                <label className="block text-xs font-medium text-ink-muted mb-1">Option {opt.toUpperCase()}</label>
                <input className="input w-full text-sm" value={form[`option_${opt}`]} onChange={set(`option_${opt}`)} required />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-ink-muted mb-1">Correct Option</label>
              <select className="input w-full text-sm" value={form.correct_option} onChange={set('correct_option')}>
                {['A','B','C','D'].map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-muted mb-1">Difficulty</label>
              <select className="input w-full text-sm" value={form.difficulty} onChange={set('difficulty')}>
                {['easy','medium','hard'].map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-ink-muted mb-1">Track</label>
              <select className="input w-full text-sm" value={form.track} onChange={set('track')}>
                <option value="associate">Associate</option>
                <option value="professional">Professional</option>
                <option value="both">Both</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-muted mb-1">Domain</label>
              <select className="input w-full text-sm" value={form.domain} onChange={set('domain')}>
                <option value="">— select —</option>
                {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-ink-muted mb-1">Thread / Topic</label>
              <select className="input w-full text-sm" value={form.thread} onChange={set('thread')}>
                <option value="">— optional —</option>
                {THREADS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-muted mb-1">Clause Ref</label>
              <input className="input w-full text-sm" value={form.clause_ref} onChange={set('clause_ref')} placeholder="e.g. A.8.1" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-muted mb-1">Explanation</label>
            <textarea className="input w-full text-sm h-20 resize-none" value={form.explanation} onChange={set('explanation')} />
          </div>

          <div>
            <label className="block text-xs font-medium text-ink-muted mb-1">Source</label>
            <input className="input w-full text-sm" value={form.source} onChange={set('source')} placeholder="Optional source reference" />
          </div>
        </div>

        <div className="flex gap-3 justify-end mt-5">
          <button type="button" onClick={onClose} className="btn btn-outline btn-sm">Cancel</button>
          <button type="submit" disabled={saving} className="btn btn-gold btn-sm disabled:opacity-50">
            {saving ? 'Saving…' : 'Save Question'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default function AdminQuestions() {
  useEffect(() => { document.title = 'Question Bank | Admin' }, [])

  const [questions, setQuestions] = useState([])
  const [total, setTotal]         = useState(0)
  const [page, setPage]           = useState(1)
  const [track, setTrack]         = useState('')
  const [domain, setDomain]       = useState('')
  const [difficulty, setDiff]     = useState('')
  const [search, setSearch]       = useState('')
  const [showRetired, setShowRet] = useState(false)
  const [loading, setLoading]     = useState(true)
  const [modal, setModal]         = useState(null)  // 'add' | { ...question }
  const [flash, setFlash]         = useState(null)

  const flash$ = (msg, type = 'success') => {
    setFlash({ msg, type })
    setTimeout(() => setFlash(null), 3000)
  }

  const load = useCallback(() => {
    setLoading(true)
    const p = { page, limit: PAGE_SIZE }
    if (track)      {p.track = track}
    if (domain)     {p.domain = domain}
    if (difficulty) {p.difficulty = difficulty}
    if (search)     {p.search = search}
    if (showRetired) {p.retired = 'true'}
    adminApi.getQuestions(p)
      .then(r => { setQuestions(r.data.questions); setTotal(r.data.total) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [page, track, domain, difficulty, search, showRetired])

  useEffect(() => { load() }, [load])

  async function handleSave(form) {
    if (modal === 'add') {
      await adminApi.addQuestion(form)
      flash$('Question added.')
    } else {
      await adminApi.editQuestion(modal.id, form)
      flash$('Question updated.')
    }
    setModal(null)
    load()
  }

  async function handleRetire(id) {
    if (!confirm('Archive/retire this question? It will no longer appear in new exams.')) {return}
    try {
      await adminApi.retireQuestion(id)
      flash$('Question archived.')
      load()
    } catch { flash$('Failed to archive.', 'error') }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-bold text-ink">Question Bank</h1>
        <button onClick={() => setModal('add')} className="btn btn-gold btn-sm flex items-center gap-1.5">
          <Plus size={14} /> Add Question
        </button>
      </div>
      <p className="text-sm text-ink-muted mb-6">{total} questions</p>

      {flash && (
        <div className={`mb-4 px-4 py-2 rounded-lg text-sm font-medium ${flash.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {flash.msg}
        </div>
      )}

      <div className="flex gap-3 mb-5 flex-wrap items-center">
        <input
          className="input text-sm w-56"
          placeholder="Search stem…"
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
        />
        <select className="input text-sm" value={track} onChange={e => { setTrack(e.target.value); setPage(1) }}>
          <option value="">All tracks</option>
          <option value="associate">Associate</option>
          <option value="professional">Professional</option>
        </select>
        <select className="input text-sm" value={domain} onChange={e => { setDomain(e.target.value); setPage(1) }}>
          <option value="">All domains</option>
          {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
        <select className="input text-sm" value={difficulty} onChange={e => { setDiff(e.target.value); setPage(1) }}>
          <option value="">All difficulties</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <label className="flex items-center gap-1.5 text-sm text-ink-muted cursor-pointer">
          <input type="checkbox" checked={showRetired} onChange={e => { setShowRet(e.target.checked); setPage(1) }} />
          Show retired
        </label>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-xs text-ink-muted uppercase tracking-wide">
              <th className="px-4 py-3 text-left w-1/2">Stem</th>
              <th className="px-4 py-3 text-left">Track</th>
              <th className="px-4 py-3 text-left">Domain</th>
              <th className="px-4 py-3 text-center">Difficulty</th>
              <th className="px-4 py-3 text-center">Used</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-ink-muted animate-pulse">Loading…</td></tr>
            ) : questions.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-ink-muted">No questions found.</td></tr>
            ) : questions.map(q => (
              <tr key={q.id} className={`border-b border-border last:border-0 hover:bg-surface/50 ${q.retired ? 'opacity-50' : ''}`}>
                <td className="px-4 py-3 text-ink leading-tight">
                  {q.stem?.slice(0, 100)}{q.stem?.length > 100 ? '…' : ''}
                  {q.clause_ref && <span className="ml-2 text-xs text-ink-muted font-mono">{q.clause_ref}</span>}
                </td>
                <td className="px-4 py-3 capitalize text-ink-muted">{q.track}</td>
                <td className="px-4 py-3 text-ink-muted">{q.domain || '—'}</td>
                <td className="px-4 py-3 text-center">
                  <Badge color={DIFFICULTY_COL[q.difficulty] || 'gray'}>{q.difficulty}</Badge>
                </td>
                <td className="px-4 py-3 text-center text-ink-muted">{q.times_used ?? '—'}</td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    {!q.retired && (
                      <>
                        <button onClick={() => setModal(q)} className="text-ink-muted hover:text-ink" title="Edit"><Pencil size={14} /></button>
                        <button onClick={() => handleRetire(q.id)} className="text-ink-muted hover:text-red-500" title="Archive"><Archive size={14} /></button>
                      </>
                    )}
                    {q.retired && <Badge color="gray">Retired</Badge>}
                  </div>
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
        <QuestionModal
          initial={modal === 'add' ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}
