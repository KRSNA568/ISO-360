import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate }      from 'react-router-dom'
import api                             from '@/lib/api'

/**
 * Fire-and-forget abort call using fetch + keepalive so it survives tab close.
 * Cannot use axios here because the browser cancels async tasks on unload.
 */
function fireAbort(sessionId) {
  if (!sessionId) return
  const token = localStorage.getItem('token')
  fetch(`/api/session/${sessionId}/abort`, {
    method:    'POST',
    keepalive: true,
    headers: {
      'Content-Type':  'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  }).catch(() => {})
}

// ── Config ────────────────────────────────────────────────────────────────────
const TRACK_LABELS = {
  associate:    'Associate',
  professional: 'Professional',
}

const TRACK_TOTALS = {
  associate:    50,
  professional: 100,
}

// ISO wisdom tips shown while generating
const WISDOM_TIPS = [
  'ISO 27001:2022 has 93 Annex A controls across 4 categories: Organizational, People, Physical, and Technological.',
  'Clause 6.1.3 requires a Statement of Applicability (SoA) listing all 93 controls with inclusion/exclusion justifications.',
  'A "major nonconformity" signals a systemic failure or the complete absence of a required element — not just a single lapse.',
  'Risk treatment options: Modify (apply controls), Retain (accept), Avoid (stop the activity), or Share (insurance/outsourcing).',
  'ISO 19011:2018 governs audit principles: integrity, fair presentation, due professional care, confidentiality, and independence.',
  'A.8.12 (Data Leakage Prevention) and A.5.7 (Threat Intelligence) are both brand-new controls introduced in ISO 27001:2022.',
  'Clause 9.3 management review has prescribed inputs (9.3.2) AND prescribed outputs (9.3.3). Both must be documented.',
  'Correction fixes the symptom. Corrective action identifies and eliminates the root cause.',
  'Auditor independence means not auditing your own work — it does NOT mean you must be external to the organization.',
  'The Statement of Applicability must justify BOTH included controls (why applied) AND excluded controls (why not applicable).',
  'Clause 7.2 requires organisations to EVALUATE the effectiveness of competence-building actions, not just deliver training.',
  'A.8.11 (Data Masking) is new in 2022. Test environments should never be populated with unmasked production data.',
]

// ── Circular SVG progress ring ────────────────────────────────────────────────
function CircularProgress({ percent }) {
  const size         = 180
  const strokeWidth  = 10
  const radius       = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const offset       = circumference - (percent / 100) * circumference

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="-rotate-90"
      aria-hidden="true"
    >
      {/* Track ring */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#2A2A2A"
        strokeWidth={strokeWidth}
      />
      {/* Progress ring */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#C9A84C"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
      />
    </svg>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function GenerationPage() {
  const { track }  = useParams()
  const navigate   = useNavigate()

  const [sessionId, setSessionId] = useState(null)
  const [status,    setStatus]    = useState('idle')
  const [progress,  setProgress]  = useState({ questionsGenerated: 0, totalQuestions: TRACK_TOTALS[track] || 50, percent: 0 })
  const [tipIndex,  setTipIndex]  = useState(0)
  const [error,     setError]     = useState(null)

  const pollRef    = useRef(null)
  const sessionRef = useRef(null)  // Keep a ref to the latest status so cleanup closures always read the current value
  const statusRef   = useRef('idle')
  const creationStartedRef = useRef(false)  // StrictMode guard — prevent double-create

  // Keep statusRef in sync with the status state
  useEffect(() => { statusRef.current = status }, [status])

  // Abort on tab close / page reload (fires before unload)
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (statusRef.current === 'generating') {
        fireAbort(sessionRef.current)
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [])
  // Rotate wisdom tip every 8 seconds
  useEffect(() => {
    const t = setInterval(
      () => setTipIndex((i) => (i + 1) % WISDOM_TIPS.length),
      8000,
    )
    return () => clearInterval(t)
  }, [])

  // On mount: create session → start polling
  useEffect(() => {
    if (!['associate', 'professional'].includes(track)) {
      navigate('/dashboard')
      return
    }
    // StrictMode in dev calls effects twice (mount → cleanup → remount).
    // This ref persists across the remount so we only ever fire one create.
    if (creationStartedRef.current) return
    creationStartedRef.current = true
    createSession()
    return () => {
      clearInterval(pollRef.current)
      // Abort generation when user navigates away from this page
      if (statusRef.current === 'generating') {
        fireAbort(sessionRef.current)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track])

  async function createSession() {
    try {
      const res = await api.post('/session/create', { track })
      const { sessionId: sid } = res.data
      sessionRef.current = sid
      setSessionId(sid)
      setStatus('generating')
      startPolling(sid)
    } catch (err) {
      const apiErr = err.response?.data
      // 409 = session already exists — resume polling
      if (err.response?.status === 409 && apiErr?.sessionId) {
        const sid = apiErr.sessionId
        sessionRef.current = sid
        setSessionId(sid)
        setStatus('generating')
        startPolling(sid)
        return
      }
      setError(apiErr?.error || 'Could not start exam generation. Please try again.')
      setStatus('error')
    }
  }

  function startPolling(sid) {
    clearInterval(pollRef.current)
    pollRef.current = setInterval(() => pollStatus(sid), 4000)
  }

  async function pollStatus(sid) {
    try {
      const res  = await api.get(`/session/${sid}/status`)
      const data = res.data
      setProgress(data.progress)
      setStatus(data.status)

      if (data.status === 'ready') {
        clearInterval(pollRef.current)
        setTimeout(() => navigate(`/exam/${sid}`), 800)
      } else if (data.status === 'aborted') {
        clearInterval(pollRef.current)
      }
    } catch {
      // swallow transient poll errors — retry on next interval
    }
  }

  const trackLabel = TRACK_LABELS[track] || track
  const etaText =
    track === 'professional'
      ? 'Professional exam takes ~4–5 min to generate. This is a one-time wait per attempt.'
      : 'Associate exam takes ~1–2 min to generate.'

  // ── Error / Aborted ──────────────────────────────────────────────────────
  if (status === 'aborted' || status === 'error') {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-red-900/30 border border-red-700/40 flex items-center justify-center mx-auto mb-6">
            <svg className="w-7 h-7 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">Generation Failed</h2>
          <p className="text-ink-muted text-sm mb-8 leading-relaxed">
            {error || 'The AI could not complete exam generation. This is usually a temporary issue — please try again.'}
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-8 py-2.5 bg-gold text-ink font-semibold rounded-lg hover:bg-gold-light transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  // ── Generating state ──────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-ink flex flex-col items-center justify-center px-4 gap-10">

      {/* Header */}
      <div className="text-center">
        <p className="text-gold text-xs font-semibold tracking-[0.2em] uppercase mb-2">
          ISO 27001:2022 Certification
        </p>
        <h1 className="text-2xl font-bold text-white">
          {trackLabel} Track
        </h1>
        <p className="text-ink-muted text-sm mt-1">
          {progress.totalQuestions} questions · {track === 'professional' ? '30' : '15'} minutes
        </p>
      </div>

      {/* Circular progress ring */}
      <div className="relative flex items-center justify-center">
        <CircularProgress percent={progress.percent} />
        {/* Centre label */}
        <div className="absolute flex flex-col items-center select-none">
          <span className="text-4xl font-bold text-gold leading-none">
            {progress.percent}%
          </span>
          <span className="text-ink-muted text-xs mt-1.5">
            {progress.questionsGenerated} / {progress.totalQuestions} q
          </span>
        </div>
      </div>

      {/* Animated status label */}
      <div className="flex items-center gap-2.5">
        <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
        <span className="text-white text-sm font-medium tracking-wide">
          Generating Exam…
        </span>
      </div>

      {/* Wisdom tip card */}
      <div className="max-w-sm w-full bg-exam-surface border border-exam-border rounded-xl px-5 py-4 text-center">
        <p className="text-gold text-[10px] font-semibold tracking-[0.18em] uppercase mb-2">
          Did you know?
        </p>
        <p className="text-ink-muted text-sm leading-relaxed min-h-[3rem]">
          {WISDOM_TIPS[tipIndex]}
        </p>
      </div>

      {/* ETA note */}
      <p className="text-ink-muted text-xs text-center max-w-xs leading-relaxed">
        {etaText}
      </p>

    </div>
  )
}
