import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams }                   from 'react-router-dom'
import api                                          from '@/lib/api'

// ── Browser fingerprint (privacy-safe: no external lib) ──────────────────
async function getBrowserFingerprint() {
  const raw = [
    navigator.userAgent,
    `${screen.width}x${screen.height}`,
    screen.colorDepth,
    Intl.DateTimeFormat().resolvedOptions().timeZone,
    navigator.language,
    navigator.hardwareConcurrency ?? '',
    navigator.platform ?? '',
  ].join('|')
  try {
    const buf  = new TextEncoder().encode(raw)
    const hash = await crypto.subtle.digest('SHA-256', buf)
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('')
  } catch {
    return btoa(raw).slice(0, 40)
  }
}

// ── Utilities ─────────────────────────────────────────────────────────────────
function formatTime(secs) {
  const m = Math.floor(Math.max(0, secs) / 60)
  const s = Math.max(0, secs) % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

// ── Sub-components ────────────────────────────────────────────────────────────
function OptionButton({ letter, text, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={[
        'w-full text-left flex items-start gap-4 px-5 py-4 rounded-lg border transition-all duration-150',
        selected
          ? 'border-gold bg-gold/10 text-white'
          : 'border-exam-border bg-exam-surface text-ink-muted hover:border-gold/40 hover:text-white',
      ].join(' ')}
    >
      <span className={[
        'flex-shrink-0 w-7 h-7 rounded-full border flex items-center justify-center text-xs font-bold mt-0.5',
        selected ? 'border-gold bg-gold text-ink' : 'border-exam-border text-ink-muted',
      ].join(' ')}>
        {letter}
      </span>
      <span className="text-sm leading-relaxed">{text}</span>
    </button>
  )
}

function NavDot({ index, current, answered, onClick }) {
  const n = index + 1
  let cls = 'w-8 h-8 rounded-md text-xs font-semibold select-none transition-all duration-100 '
  if (index === current)   cls += 'bg-gold text-ink'
  else if (answered)       cls += 'bg-gold/20 text-gold border border-gold/30 hover:bg-gold/30'
  else                     cls += 'bg-exam-surface border border-exam-border text-ink-muted hover:border-gold/40 hover:text-white'
  return (
    <button
      type="button"
      onClick={onClick}
      className={cls + ' flex items-center justify-center'}
      title={`Jump to question ${n}`}
    >
      {n}
    </button>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ExamPage() {
  const { sessionId } = useParams()
  const navigate      = useNavigate()

  const [phase,      setPhase]      = useState('loading')  // loading | ready_to_start | exam | submitting | error
  const [questions,  setQuestions]  = useState([])
  const [answers,    setAnswers]    = useState({})          // { questionId: 'A'|'B'|'C'|'D' }
  const [current,    setCurrent]    = useState(0)
  const [remaining,  setRemaining]  = useState(0)
  const [track,      setTrack]      = useState('')

  useEffect(() => { document.title = 'Exam | 27001certified' }, [])
  const [confirmBox, setConfirmBox] = useState(false)
  const [errorMsg,   setErrorMsg]   = useState('')
  const [tabWarnings,       setTabWarnings]       = useState(0)  // 0 | 1 | 2
  const [tabWarningVisible, setTabWarningVisible] = useState(false)
  const [fingerprintWarning, setFingerprintWarning] = useState(false)

  const TAB_WARNING_MAX = 2  // auto-submit on the 3rd violation
  const DEVTOOLS_CHECK_INTERVAL = 2000 // ms between DevTools size checks
  const DEVTOOLS_THRESHOLD      = 160  // px difference to flag DevTools

  const tickRef        = useRef(null)
  const answersRef     = useRef({})   // always-fresh ref used in submit closure
  const submittedRef   = useRef(false)
  const tabWarningsRef = useRef(0)    // always-fresh count for the submit closure
  const devtoolsRef    = useRef(null) // interval id for devtools polling
  const sessionFpRef   = useRef(null) // stored fingerprint from session start

  // Keep answersRef in sync
  useEffect(() => { answersRef.current = answers }, [answers])
  // Keep tabWarningsRef in sync
  useEffect(() => { tabWarningsRef.current = tabWarnings }, [tabWarnings])

  // ── Persist tab warnings to sessionStorage ─────────────────────────────
  useEffect(() => {
    if (sessionId && tabWarnings > 0) {
      sessionStorage.setItem(`tabWarnings_${sessionId}`, String(tabWarnings))
    }
  }, [tabWarnings, sessionId])

  // ── Load exam on mount ─────────────────────────────────────────────────────
  useEffect(() => {
    startExam()
    return () => clearInterval(tickRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId])

  // ── Shared violation handler — used by tab-switch, fullscreen exit, and DevTools ──
  function recordViolation() {
    api.post(`/session/${sessionId}/heartbeat`).catch(() => {})

    const next = tabWarningsRef.current + 1
    tabWarningsRef.current = next
    setTabWarnings(next)

    if (next > TAB_WARNING_MAX) {
      submitExam(true)
    } else {
      setTabWarningVisible(true)
    }
  }

  // ── Tab-switch detection ───────────────────────────────────────────────────
  useEffect(() => {
    const onVisibility = () => {
      if (document.visibilityState === 'hidden' && phase === 'exam') {
        recordViolation()
      }
    }
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, sessionId])

  // ── Fullscreen enforcement ─────────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'exam') return

    // Only attach exit-listener — fullscreen is requested via user click in enterExam()
    const onFsChange = () => {
      // If user exits fullscreen during exam, treat as a violation
      if (!document.fullscreenElement && phase === 'exam' && !submittedRef.current) {
        recordViolation()
        // Re-request fullscreen after the warning is dismissed
        setTimeout(() => {
          if (phase === 'exam' && !submittedRef.current) {
            el.requestFullscreen().catch(() => {})
          }
        }, 500)
      }
    }
    document.addEventListener('fullscreenchange', onFsChange)

    return () => {
      document.removeEventListener('fullscreenchange', onFsChange)
      // Exit fullscreen on cleanup (submit / navigate away)
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {})
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, sessionId])

  // ── Keyboard shortcut blocking ─────────────────────────────────────────────
  useEffect(() => {
    if (phase !== 'exam') return
    const onKeyDown = (e) => {
      const ctrl = e.ctrlKey || e.metaKey
      const shift = e.shiftKey
      // Block: F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U, Ctrl+S
      if (
        e.key === 'F12' ||
        (ctrl && shift && ['I', 'i', 'J', 'j', 'C', 'c'].includes(e.key)) ||
        (ctrl && !shift && ['u', 'U', 's', 'S'].includes(e.key))
      ) {
        e.preventDefault()
        e.stopPropagation()
      }
    }
    document.addEventListener('keydown', onKeyDown, true)
    return () => document.removeEventListener('keydown', onKeyDown, true)
  }, [phase])

  // ── DevTools detection (viewport size heuristic) ───────────────────────────
  useEffect(() => {
    if (phase !== 'exam') return
    let devtoolsOpen = false
    devtoolsRef.current = setInterval(() => {
      const widthDiff  = window.outerWidth  - window.innerWidth
      const heightDiff = window.outerHeight - window.innerHeight
      const opened = widthDiff > DEVTOOLS_THRESHOLD || heightDiff > DEVTOOLS_THRESHOLD
      // Only trigger once per DevTools open (not every 2s while it stays open)
      if (opened && !devtoolsOpen) {
        devtoolsOpen = true
        recordViolation()
      } else if (!opened) {
        devtoolsOpen = false
      }
    }, DEVTOOLS_CHECK_INTERVAL)
    return () => clearInterval(devtoolsRef.current)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, sessionId])

  async function startExam() {
    try {
      const fingerprint = await getBrowserFingerprint()
      sessionFpRef.current = fingerprint
      const res = await api.post(`/session/${sessionId}/start`, { device_fingerprint: fingerprint })
      const { questions: qs, remaining: rem, track: t, savedAnswers,
              tabViolations: serverViolations, deviceFingerprint: storedFp } = res.data

      // ── Restore tab warnings from sessionStorage or server (whichever is higher) ──
      const storedLocal  = parseInt(sessionStorage.getItem(`tabWarnings_${sessionId}`)) || 0
      const serverCount  = serverViolations || 0
      const restored     = Math.max(storedLocal, serverCount)
      if (restored > 0) {
        tabWarningsRef.current = restored
        setTabWarnings(restored)
        if (restored > TAB_WARNING_MAX) {
          // Already exceeded max — auto-submit immediately
          setPhase('submitting')
          await api.post(`/session/${sessionId}/submit`)
          navigate(`/results/${sessionId}`, { replace: true })
          return
        }
      }

      // ── Fingerprint mismatch detection on resume ──
      if (storedFp && storedFp !== fingerprint) {
        setFingerprintWarning(true)
        // Count as a violation — different device continuing the session
        api.post(`/session/${sessionId}/heartbeat`).catch(() => {})
      }

      setQuestions(qs)
      setRemaining(rem)
      setTrack(t)
      setAnswers(savedAnswers || {})
      setPhase('ready_to_start')
    } catch (err) {
      const data = err.response?.data
      // Already completed — go straight to results
      if (err.response?.status === 400 && data?.redirect) {
        navigate(data.redirect, { replace: true })
        return
      }
      // Session wiped by concurrent create (StrictMode / double-click) — go to dashboard
      if (err.response?.status === 409 && data?.code === 'SESSION_EMPTY') {
        navigate('/dashboard', { replace: true })
        return
      }
      setErrorMsg(data?.error || 'Could not load exam. Please try again.')
      setPhase('error')
    }
  }

  // ── Enter exam (user clicked → valid gesture for fullscreen) ───────────────
  function enterExam() {
    const el = document.documentElement
    if (el.requestFullscreen && !document.fullscreenElement) {
      el.requestFullscreen().catch(() => {})
    }
    setPhase('exam')
    beginCountdown(remaining)
  }

  function beginCountdown(startSecs) {
    let secs = startSecs
    clearInterval(tickRef.current)
    tickRef.current = setInterval(() => {
      secs -= 1
      setRemaining(secs)
      if (secs <= 0) {
        clearInterval(tickRef.current)
        submitExam(true)
      }
    }, 1000)
  }

  // ── Answer selection — can change or deselect on current question ──────
  function selectAnswer(questionId, option) {
    const existing = answers[questionId]
    const newOption = existing === option ? null : option   // same click = deselect

    setAnswers((prev) => {
      const next = { ...prev }
      if (newOption === null) delete next[questionId]
      else next[questionId] = newOption
      return next
    })

    // Sync to server: null removes answer, A-D upserts it
    api.post(`/session/${sessionId}/answer`, { questionId, selectedOption: newOption }).catch(() => {})
  }

  // ── Submit ─────────────────────────────────────────────────────────────────
  const submitExam = useCallback(async (autoSubmit = false) => {
    if (submittedRef.current) return
    submittedRef.current = true
    clearInterval(tickRef.current)
    clearInterval(devtoolsRef.current)
    setPhase('submitting')
    setConfirmBox(false)

    // Clean up sessionStorage
    sessionStorage.removeItem(`tabWarnings_${sessionId}`)

    // Exit fullscreen
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {})
    }

    try {
      await api.post(`/session/${sessionId}/submit`)
      navigate(`/results/${sessionId}`, { replace: true })
    } catch (err) {
      const data = err.response?.data
      if (data?.alreadyScored) {
        navigate(`/results/${sessionId}`, { replace: true })
        return
      }
      setErrorMsg(data?.error || 'Submit failed. Please try again.')
      setPhase('error')
      submittedRef.current = false
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, navigate])
  // ── Prevent copy / paste / right-click on exam page ────────────────────────
  useEffect(() => {
    if (phase !== 'exam') return
    const block = (e) => e.preventDefault()
    document.addEventListener('copy',         block)
    document.addEventListener('cut',          block)
    document.addEventListener('paste',        block)
    document.addEventListener('contextmenu',  block)
    return () => {
      document.removeEventListener('copy',        block)
      document.removeEventListener('cut',         block)
      document.removeEventListener('paste',       block)
      document.removeEventListener('contextmenu', block)
    }
  }, [phase])
  // ── Derived ────────────────────────────────────────────────────────────────
  const q             = questions[current] || null
  const answeredCount = Object.keys(answers).length
  const totalQ        = questions.length
  const timerRed      = remaining <= 60
  const progressPct   = totalQ > 0 ? Math.round((answeredCount / totalQ) * 100) : 0

  // ── Loading ────────────────────────────────────────────────────────────────
  if (phase === 'loading') {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="w-3 h-3 rounded-full bg-gold animate-ping" />
          <span className="text-ink-muted text-sm">Loading exam…</span>
        </div>
      </div>
    )
  }

  // ── Ready to start (fullscreen prompt) ─────────────────────────────────────
  if (phase === 'ready_to_start') {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9m11.25-5.25v4.5m0-4.5h-4.5m4.5 0L15 9m-11.25 11.25v-4.5m0 4.5h4.5m-4.5 0L9 15m11.25 5.25v-4.5m0 4.5h-4.5m4.5 0L15 15" />
            </svg>
          </div>
          <h2 className="text-white font-semibold text-xl mb-3">Exam Ready</h2>
          <p className="text-ink-muted text-sm leading-relaxed mb-2">
            Your exam will run in <span className="text-white font-medium">fullscreen mode</span>.
          </p>
          <div className="text-ink-muted text-xs leading-relaxed mb-8 space-y-1">
            <p>⚠️ Exiting fullscreen, switching tabs, or opening DevTools will count as a violation.</p>
            <p>After <span className="text-red-400 font-semibold">3 violations</span>, your exam will be auto-submitted.</p>
          </div>
          <button
            onClick={enterExam}
            className="px-8 py-3 bg-gold text-ink font-bold rounded-lg hover:bg-gold-light transition-colors text-sm"
          >
            Enter Fullscreen & Begin Exam
          </button>
        </div>
      </div>
    )
  }

  // ── Error ──────────────────────────────────────────────────────────────────
  if (phase === 'error') {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <p className="text-white font-semibold mb-2">Something went wrong</p>
          <p className="text-ink-muted text-sm mb-6">{errorMsg}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2 bg-gold text-ink font-semibold rounded-lg hover:bg-gold-light transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  // ── Submitting spinner ─────────────────────────────────────────────────────
  if (phase === 'submitting') {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <span className="w-3 h-3 rounded-full bg-gold animate-ping" />
          <span className="text-ink-muted text-sm">Submitting exam…</span>
        </div>
      </div>
    )
  }

  // ── Confirm submit dialog ──────────────────────────────────────────────────
  const unanswered = totalQ - answeredCount

  return (
    <div className="h-screen bg-ink flex flex-col">

      {/* ── Top bar: timer + progress ── */}
      <div className="sticky top-0 z-30 bg-ink border-b border-exam-border px-4 md:px-8 py-3 flex items-center justify-between gap-4">
        {/* Track label */}
        <span className="text-gold text-xs font-semibold tracking-widest uppercase hidden sm:block">
          ISO 27001 · {track === 'professional' ? 'Professional' : 'Associate'}
        </span>

        {/* Timer */}
        <div className={[
          'flex items-center gap-2 font-mono text-2xl font-bold tabular-nums',
          timerRed ? 'text-red-400' : 'text-white',
        ].join(' ')}>
          {timerRed && <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />}
          {formatTime(remaining)}
        </div>

        {/* Progress + submit */}
        <div className="flex items-center gap-4">
          <span className="text-ink-muted text-xs hidden sm:block">
            {answeredCount}/{totalQ} answered
          </span>
          <button
            onClick={() => setConfirmBox(true)}
            className="px-4 py-1.5 bg-gold text-ink text-xs font-bold rounded-lg hover:bg-gold-light transition-colors"
          >
            Submit
          </button>
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div className="h-0.5 bg-exam-border">
        <div
          className="h-full bg-gold transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* ── Main layout ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Question navigator sidebar (desktop) ── */}
        <aside className="hidden lg:flex flex-col w-52 border-r border-exam-border bg-exam-surface p-4 gap-3 overflow-y-auto">
          <p className="text-ink-muted text-xs font-semibold tracking-wider uppercase mb-1">
            Questions
          </p>
          <div className="flex flex-wrap gap-1.5">
            {questions.map((q, i) => (
              <NavDot
                key={q.id}
                index={i}
                current={current}
                answered={!!answers[q.id]}
                onClick={() => setCurrent(i)}
              />
            ))}
          </div>
          <div className="mt-auto pt-4 border-t border-exam-border space-y-1.5 text-xs text-ink-muted">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-gold" /> Current
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-gold/20 border border-gold/30" /> Answered
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-exam-surface border border-exam-border" /> Unanswered
            </div>
          </div>
        </aside>

        {/* ── Question panel ── */}
        <main className="flex-1 overflow-y-auto px-4 md:px-10 py-8">
          {q && (
            <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">

              {/* Question header */}
              <div className="flex items-center justify-between">
                <span className="text-gold text-xs font-semibold tracking-widest uppercase">
                  Question {current + 1} of {totalQ}
                </span>
                <span className={[
                  'text-xs px-2 py-0.5 rounded-full border font-medium',
                  q.difficulty === 'easy'   ? 'border-green-700/40 text-green-400'  :
                  q.difficulty === 'hard'   ? 'border-red-700/40   text-red-400'    :
                                              'border-yellow-700/40 text-yellow-400',
                ].join(' ')}>
                  {q.difficulty}
                </span>
              </div>

              {/* Clause ref */}
              {q.clause_ref && (
                <p className="text-xs text-ink-muted font-mono">{q.clause_ref}</p>
              )}

              {/* Stem */}
              <p className="text-white text-base leading-relaxed font-medium">
                {q.stem}
              </p>

              {/* Options */}
              <div className="space-y-3">
                {['A', 'B', 'C', 'D'].map((letter, idx) => (
                  <OptionButton
                    key={letter}
                    letter={letter}
                    text={q.options[idx]}
                    selected={answers[q.id] === letter}
                    onClick={() => selectAnswer(q.id, letter)}
                  />
                ))}
              </div>

              {/* Next only — no back navigation, no jumping ahead */}
              <div className="flex justify-end pt-4">
                {current < totalQ - 1 ? (
                  <button
                    onClick={() => setCurrent((i) => i + 1)}
                    className="px-5 py-2 rounded-lg bg-exam-surface border border-exam-border text-white text-sm hover:border-gold/50 transition-all"
                  >
                    Next →
                  </button>
                ) : (
                  <button
                    onClick={() => setConfirmBox(true)}
                    className="px-5 py-2 rounded-lg bg-gold text-ink text-sm font-bold hover:bg-gold-light transition-colors"
                  >
                    Finish & Submit
                  </button>
                )}
              </div>
            </div>
          )}
        </main>

        {/* ── Mobile question navigator (horizontal scroll bar) ── */}
        <div className="lg:hidden fixed bottom-0 inset-x-0 bg-exam-surface border-t border-exam-border px-4 py-2 overflow-x-auto">
          <div className="flex gap-1.5 min-w-max">
            {questions.map((q, i) => (
              <NavDot
                key={q.id}
                index={i}
                current={current}
                answered={!!answers[q.id]}
                onClick={() => setCurrent(i)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ── Tab-switch / fullscreen / DevTools warning overlay ── */}
      {tabWarningVisible && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center px-4">
          <div className="bg-exam-surface border border-red-700/60 rounded-xl p-8 max-w-sm w-full shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-900/40 border border-red-700/50 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
              </div>
              <h2 className="text-white font-semibold text-lg">Integrity Violation</h2>
            </div>

            <p className="text-ink-muted text-sm leading-relaxed mb-2">
              Leaving the exam window, exiting fullscreen, or opening developer tools is not allowed.
            </p>
            <div className="flex items-center gap-2 mb-6">
              {[1, 2].map((n) => (
                <div
                  key={n}
                  className={[
                    'flex-1 h-2 rounded-full',
                    n <= tabWarnings ? 'bg-red-500' : 'bg-exam-border',
                  ].join(' ')}
                />
              ))}
              <span className="text-xs text-red-400 font-semibold ml-1 tabular-nums">
                {tabWarnings} / {TAB_WARNING_MAX}
              </span>
            </div>

            <p className="text-xs text-red-400 font-medium mb-5">
              {tabWarnings < TAB_WARNING_MAX
                ? `Warning ${tabWarnings} of ${TAB_WARNING_MAX}. One more violation will auto-submit your exam.`
                : `This is your final warning. The next violation will immediately submit your exam.`}
            </p>

            <button
              onClick={() => {
                setTabWarningVisible(false)
                // Re-request fullscreen when returning to exam
                const el = document.documentElement
                if (el.requestFullscreen && !document.fullscreenElement) {
                  el.requestFullscreen().catch(() => {})
                }
              }}
              className="w-full py-2.5 rounded-lg bg-gold text-ink text-sm font-bold hover:bg-gold-light transition-colors"
            >
              Return to Exam
            </button>
          </div>
        </div>
      )}

      {/* ── Fingerprint mismatch warning ── */}
      {fingerprintWarning && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center px-4">
          <div className="bg-exam-surface border border-yellow-700/60 rounded-xl p-8 max-w-sm w-full shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-yellow-900/40 border border-yellow-700/50 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
              </div>
              <h2 className="text-white font-semibold text-lg">Device Mismatch</h2>
            </div>
            <p className="text-ink-muted text-sm leading-relaxed mb-2">
              This session was started on a different device or browser. Continuing from a different device has been flagged.
            </p>
            <p className="text-xs text-yellow-400 font-medium mb-5">
              This incident has been recorded and may affect your exam results.
            </p>
            <button
              onClick={() => setFingerprintWarning(false)}
              className="w-full py-2.5 rounded-lg bg-gold text-ink text-sm font-bold hover:bg-gold-light transition-colors"
            >
              I Understand
            </button>
          </div>
        </div>
      )}

      {/* ── Confirm submit modal ── */}
      {confirmBox && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
          <div className="bg-exam-surface border border-exam-border rounded-xl p-8 max-w-sm w-full shadow-xl">
            <h2 className="text-white font-semibold text-lg mb-2">Submit Exam?</h2>
            {unanswered > 0 ? (
              <p className="text-ink-muted text-sm mb-6">
                You have <span className="text-yellow-400 font-semibold">{unanswered} unanswered question{unanswered > 1 ? 's' : ''}</span>.
                Unanswered questions count as incorrect.
              </p>
            ) : (
              <p className="text-ink-muted text-sm mb-6">
                All {totalQ} questions answered. Ready to submit?
              </p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmBox(false)}
                className="flex-1 py-2.5 rounded-lg border border-exam-border text-ink-muted text-sm hover:border-gold/40 hover:text-white transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => submitExam(false)}
                className="flex-1 py-2.5 rounded-lg bg-gold text-ink text-sm font-bold hover:bg-gold-light transition-colors"
              >
                Submit Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
