import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { authApi } from '@/lib/apiServices'
import OtpInput from '@/components/ui/OtpInput'
import { cn } from '@/lib/cn'

// ─── Zod schemas ─────────────────────────────────────────────────────────────

const COUNTRIES = [
  'Afghanistan','Albania','Algeria','Argentina','Australia','Austria','Bangladesh',
  'Belgium','Bolivia','Brazil','Bulgaria','Cambodia','Canada','Chile','China',
  'Colombia','Croatia','Czech Republic','Denmark','Ecuador','Egypt','Ethiopia',
  'Finland','France','Germany','Ghana','Greece','Guatemala','Hungary','India',
  'Indonesia','Iran','Iraq','Ireland','Israel','Italy','Japan','Jordan','Kazakhstan',
  'Kenya','Malaysia','Mexico','Morocco','Netherlands','New Zealand','Nigeria',
  'Norway','Pakistan','Peru','Philippines','Poland','Portugal','Romania','Russia',
  'Saudi Arabia','Serbia','Singapore','South Africa','South Korea','Spain',
  'Sri Lanka','Sweden','Switzerland','Tanzania','Thailand','Turkey','Uganda',
  'Ukraine','United Arab Emirates','United Kingdom','United States','Uzbekistan',
  'Venezuela','Vietnam','Zimbabwe',
]

const registerSchema = z.object({
  full_name:        z.string().min(2, 'Full name required').max(100),
  email:            z.string().email('Invalid email'),
  password:         z.string()
    .min(8, 'At least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
  confirm_password: z.string().min(1, 'Please confirm your password'),
  company:          z.string().max(100).optional(),
  job_role:         z.string().max(100).optional(),
  country:          z.string().max(60).optional(),
}).refine((d) => d.password === d.confirm_password, {
  message: 'Passwords do not match',
  path:    ['confirm_password'],
})

const loginSchema = z.object({
  email:    z.string().email('Invalid email'),
  password: z.string().min(1, 'Password required'),
})

const forgotSchema = z.object({
  email: z.string().email('Invalid email'),
})

const resetSchema = z.object({
  new_password: z.string()
    .min(8, 'At least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
})

// ─── Small helpers ────────────────────────────────────────────────────────────

function FieldError({ msg }) {
  if (!msg) return null
  return <p className="text-xs text-red-600 mt-1">{msg}</p>
}

function ApiError({ msg }) {
  if (!msg) return null
  return (
    <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
      {msg}
    </div>
  )
}

function PasswordInput({ registration, placeholder = 'Password', error }) {
  const [show, setShow] = useState(false)
  return (
    <div className="relative">
      <input
        type={show ? 'text' : 'password'}
        placeholder={placeholder}
        {...registration}
        className={cn('input pr-11', error && 'input-error')}
      />
      <button
        type="button"
        onClick={() => setShow(s => !s)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink transition-colors"
      >
        {show ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  )
}

// ─── Resend timer hook ────────────────────────────────────────────────────────

function useResendTimer(seconds = 60) {
  const [remaining, setRemaining] = useState(0)
  const timerRef = useRef(null)

  function start() {
    setRemaining(seconds)
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setRemaining(r => {
        if (r <= 1) { clearInterval(timerRef.current); return 0 }
        return r - 1
      })
    }, 1000)
  }

  useEffect(() => () => clearInterval(timerRef.current), [])

  return { remaining, start, canResend: remaining === 0 }
}

// ─── Screen: Register ─────────────────────────────────────────────────────────

function PasswordStrength({ password }) {
  if (!password) return null
  const hasLen   = password.length >= 8
  const hasUpper = /[A-Z]/.test(password)
  const hasNum   = /[0-9]/.test(password)
  const hasSpec  = /[^A-Za-z0-9]/.test(password)
  const score = [hasLen, hasUpper, hasNum, hasSpec].filter(Boolean).length
  const levels = [
    { label: 'Weak',   color: 'bg-red-500'    },
    { label: 'Fair',   color: 'bg-orange-400'  },
    { label: 'Good',   color: 'bg-yellow-400'  },
    { label: 'Strong', color: 'bg-green-500'   },
  ]
  const { label, color } = levels[Math.max(0, score - 1)]
  return (
    <div className="mt-1.5 space-y-1">
      <div className="flex gap-1">
        {levels.map((l, i) => (
          <div
            key={l.label}
            className={cn('h-1 flex-1 rounded-full transition-colors', i < score ? color : 'bg-border')}
          />
        ))}
      </div>
      <p className="text-xs text-ink-muted">
        Strength: <span className={cn('font-medium', score <= 1 ? 'text-red-500' : score === 2 ? 'text-orange-400' : score === 3 ? 'text-yellow-500' : 'text-green-600')}>{label}</span>
      </p>
    </div>
  )
}

function RegisterScreen({ onSuccess }) {
  const [apiError, setApiError] = useState('')
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(registerSchema),
  })
  const passwordValue = useWatch({ control, name: 'password', defaultValue: '' })

  async function onSubmit(data) {
    setApiError('')
    // Strip empty optional strings before sending
    const payload = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== '' && v !== undefined)
    )
    try {
      const res = await authApi.register(payload)
      onSuccess(res.data.user_id, data.email)
    } catch (e) {
      const code = e.response?.data?.code
      if (code === 'EMAIL_EXISTS') {
        setApiError('An account with this email already exists. Sign in instead.')
      } else {
        setApiError(e.response?.data?.error || 'Registration failed. Please try again.')
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Required fields */}
      <div>
        <input
          placeholder="Full Name *"
          {...register('full_name')}
          className={cn('input', errors.full_name && 'input-error')}
        />
        <FieldError msg={errors.full_name?.message} />
      </div>
      <div>
        <input
          placeholder="Professional Email *"
          type="email"
          {...register('email')}
          className={cn('input', errors.email && 'input-error')}
        />
        <FieldError msg={errors.email?.message} />
      </div>
      <div>
        <PasswordInput registration={register('password')} placeholder="Password *" error={errors.password} />
        <FieldError msg={errors.password?.message} />
        <PasswordStrength password={passwordValue} />
      </div>
      <div>
        <PasswordInput registration={register('confirm_password')} placeholder="Confirm Password *" error={errors.confirm_password} />
        <FieldError msg={errors.confirm_password?.message} />
      </div>

      {/* Optional profile fields */}
      <div className="border-t border-border pt-4 space-y-3">
        <p className="text-xs text-ink-muted font-medium">Optional — you can fill these later</p>
        <input
          placeholder="Company / Organisation"
          {...register('company')}
          className="input"
        />
        <input
          placeholder="Job Role (e.g. CISO, GRC Analyst)"
          {...register('job_role')}
          className="input"
        />
        <select {...register('country')} className="input" defaultValue="">
          <option value="">Country (optional)</option>
          {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <ApiError msg={apiError} />

      <button type="submit" disabled={isSubmitting} className="btn btn-gold btn-md w-full justify-center">
        {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Create Account →'}
      </button>
    </form>
  )
}

// ─── Screen: OTP Verify ───────────────────────────────────────────────────────

function OtpScreen({ userId, email, purpose = 'email_verify', onSuccess, onBack }) {
  const [code, setCode]         = useState('')
  const [loading, setLoading]   = useState(false)
  const [apiError, setApiError] = useState('')
  const { remaining, start, canResend } = useResendTimer(60)

  useEffect(() => { start() }, []) // eslint-disable-line

  async function submit() {
    if (code.trim().length < 6) return setApiError('Enter the full 6-digit code.')
    setLoading(true)
    setApiError('')
    try {
      const res = await authApi.verifyOtp({ user_id: userId, code: code.trim(), purpose })
      onSuccess(res.data)
    } catch (e) {
      const ec = e.response?.data?.code
      if (ec === 'OTP_EXPIRED')      setApiError('Code has expired. Click resend to get a new one.')
      else if (ec === 'INVALID_OTP') setApiError('Incorrect code. Please try again.')
      else setApiError(e.response?.data?.error || 'Verification failed.')
      setCode('')
    } finally {
      setLoading(false)
    }
  }

  async function resend() {
    if (!canResend) return
    setApiError('')
    try {
      await authApi.resendOtp({ email, purpose })
      start()
    } catch (e) {
      setApiError(e.response?.data?.error || 'Could not resend code.')
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-ink-muted text-center">
        We sent a 6-digit code to <strong className="text-ink">{email}</strong>
      </p>

      <OtpInput value={code} onChange={setCode} disabled={loading} error={!!apiError} />

      <ApiError msg={apiError} />

      <button
        onClick={submit}
        disabled={loading || code.trim().length < 6}
        className="btn btn-gold btn-md w-full justify-center"
      >
        {loading ? <Loader2 size={16} className="animate-spin" /> : 'Verify Code →'}
      </button>

      <div className="text-center text-sm text-ink-muted">
        {canResend ? (
          <button onClick={resend} className="text-gold hover:text-gold-dark font-medium transition-colors">
            Resend code
          </button>
        ) : (
          <span>Resend in {remaining}s</span>
        )}
      </div>

      {onBack && (
        <button onClick={onBack} className="flex items-center gap-1 text-sm text-ink-muted hover:text-ink transition-colors mx-auto">
          <ArrowLeft size={13} /> Back
        </button>
      )}
    </div>
  )
}

// ─── Screen: Login ────────────────────────────────────────────────────────────

function LoginScreen({ onSuccess, onForgot, onRegister }) {
  const [apiError, setApiError]                     = useState('')
  const [unverifiedId, setUnverifiedId]             = useState(null) // for auto-resend OTP flow
  const { register, handleSubmit, getValues, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data) {
    setApiError('')
    try {
      const res = await authApi.login(data)
      onSuccess(res.data)
    } catch (e) {
      const ec = e.response?.data?.code
      if (ec === 'EMAIL_NOT_VERIFIED') {
        // Auto-redirect to OTP screen
        setUnverifiedId(e.response.data.user_id)
      } else if (ec === 'INVALID_CREDENTIALS') {
        setApiError('Incorrect email or password.')
      } else if (ec === 'ACCOUNT_BLOCKED') {
        setApiError('Your account has been blocked. Contact support.')
      } else {
        setApiError(e.response?.data?.error || 'Login failed.')
      }
    }
  }

  if (unverifiedId) {
    return (
      <OtpScreen
        userId={unverifiedId}
        email={getValues('email')}
        purpose="email_verify"
        onSuccess={onSuccess}
        onBack={() => setUnverifiedId(null)}
      />
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <input
          placeholder="Email"
          type="email"
          {...register('email')}
          className={cn('input', errors.email && 'input-error')}
        />
        <FieldError msg={errors.email?.message} />
      </div>
      <div>
        <PasswordInput registration={register('password')} error={errors.password} />
        <FieldError msg={errors.password?.message} />
      </div>

      <div className="text-right">
        <button type="button" onClick={onForgot} className="text-sm text-gold hover:text-gold-dark transition-colors">
          Forgot password?
        </button>
      </div>

      <ApiError msg={apiError} />

      <button type="submit" disabled={isSubmitting} className="btn btn-gold btn-md w-full justify-center">
        {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Sign In →'}
      </button>

      <p className="text-sm text-ink-muted text-center">
        No account?{' '}
        <button type="button" onClick={onRegister} className="text-gold hover:text-gold-dark font-medium transition-colors">
          Create one free
        </button>
      </p>
    </form>
  )
}

// ─── Screen: Forgot Password ──────────────────────────────────────────────────

function ForgotScreen({ onSuccess, onBack }) {
  const [apiError, setApiError] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(forgotSchema),
  })

  async function onSubmit(data) {
    setApiError('')
    try {
      await authApi.forgotPassword(data)
      onSuccess(data.email)
    } catch (e) {
      setApiError(e.response?.data?.error || 'Request failed. Try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <p className="text-sm text-ink-muted">
        Enter your registered email and we'll send a reset code.
      </p>
      <div>
        <input
          placeholder="Email"
          type="email"
          {...register('email')}
          className={cn('input', errors.email && 'input-error')}
        />
        <FieldError msg={errors.email?.message} />
      </div>

      <ApiError msg={apiError} />

      <button type="submit" disabled={isSubmitting} className="btn btn-gold btn-md w-full justify-center">
        {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Send Reset Code →'}
      </button>

      <button type="button" onClick={onBack} className="flex items-center gap-1 text-sm text-ink-muted hover:text-ink transition-colors mx-auto">
        <ArrowLeft size={13} /> Back to Sign In
      </button>
    </form>
  )
}

// ─── Screen: Reset Password ───────────────────────────────────────────────────

function ResetScreen({ email, onSuccess, onBack }) {
  const [code, setCode]         = useState('')
  const [apiError, setApiError] = useState('')
  const { remaining, start, canResend } = useResendTimer(60)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(resetSchema),
  })

  useEffect(() => { start() }, []) // eslint-disable-line

  async function onSubmit(data) {
    if (code.trim().length < 6) return setApiError('Enter the full 6-digit code.')
    setApiError('')
    try {
      await authApi.resetPassword({ email, code: code.trim(), new_password: data.new_password })
      onSuccess()
    } catch (e) {
      const ec = e.response?.data?.code
      if (ec === 'INVALID_OTP') setApiError('Incorrect or expired code.')
      else setApiError(e.response?.data?.error || 'Reset failed. Please try again.')
    }
  }

  async function resend() {
    if (!canResend) return
    try {
      await authApi.forgotPassword({ email })
      start()
    } catch {/* silent */}
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <p className="text-sm text-ink-muted text-center">
        Enter the code sent to <strong className="text-ink">{email}</strong> and choose a new password.
      </p>

      <OtpInput value={code} onChange={setCode} error={!!apiError && code.length > 0} />

      <div>
        <PasswordInput registration={register('new_password')} placeholder="New Password" error={errors.new_password} />
        <FieldError msg={errors.new_password?.message} />
      </div>

      <ApiError msg={apiError} />

      <button type="submit" disabled={isSubmitting} className="btn btn-gold btn-md w-full justify-center">
        {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Reset Password →'}
      </button>

      <div className="text-center text-sm text-ink-muted">
        {canResend ? (
          <button type="button" onClick={resend} className="text-gold hover:text-gold-dark font-medium transition-colors">
            Resend code
          </button>
        ) : (
          <span>Resend in {remaining}s</span>
        )}
      </div>

      <button type="button" onClick={onBack} className="flex items-center gap-1 text-sm text-ink-muted hover:text-ink transition-colors mx-auto">
        <ArrowLeft size={13} /> Back
      </button>
    </form>
  )
}

// ─── Screen: Success ──────────────────────────────────────────────────────────

function SuccessScreen({ message, action }) {
  return (
    <div className="text-center space-y-4 py-4">
      <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto">
        <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <p className="text-sm text-ink-muted">{message}</p>
      {action}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const TITLES = {
  register: { heading: 'Create your free account',    sub: 'Start your ISO 27001:2022 journey' },
  otp:      { heading: 'Verify your email',           sub: 'Check your inbox for the 6-digit code' },
  login:    { heading: 'Welcome back',                sub: 'Sign in to your account' },
  forgot:   { heading: 'Reset your password',         sub: '' },
  reset:    { heading: 'Choose a new password',       sub: '' },
  done:     { heading: 'Password updated',            sub: '' },
}

export default function LoginPage() {
  const navigate      = useNavigate()
  const [params]      = useSearchParams()
  const { login }     = useAuth()

  const defaultMode   = params.get('register') ? 'register' : 'login'
  const [mode, setMode]       = useState(defaultMode)
  const [userId, setUserId]   = useState('')

  useEffect(() => {
    const titles = { login: 'Sign In', register: 'Create Account', otp: 'Verify Email', forgot: 'Reset Password', reset: 'New Password', done: 'Password Updated' }
    document.title = `${titles[mode] || 'Sign In'} | 27001certified`
  }, [mode])
  const [email, setEmail]     = useState('')

  function handleRegisterSuccess(uid, em) {
    setUserId(uid)
    setEmail(em)
    setMode('otp')
  }

  function handleOtpSuccess(data) {
    login(data.access_token, data.refresh_token, data.user)
    navigate('/dashboard', { replace: true })
  }

  function handleLoginSuccess(data) {
    login(data.access_token, data.refresh_token, data.user)
    navigate('/dashboard', { replace: true })
  }

  function handleForgotSuccess(em) {
    setEmail(em)
    setMode('reset')
  }

  function handleResetSuccess() {
    setMode('done')
  }

  const { heading, sub } = TITLES[mode]

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <Link to="/iso-27001" className="font-serif font-bold text-xl text-ink mb-8 hover:opacity-75 transition-opacity">
        27001<span className="text-gold">certified</span>
      </Link>

      <div className="card w-full max-w-md">
        {/* Header */}
        <div className="mb-6">
          <span className="gold-line" />
          <h1 className="text-xl font-semibold text-ink">{heading}</h1>
          {sub && <p className="text-sm text-ink-muted mt-1">{sub}</p>}
        </div>

        {/* Content */}
        {mode === 'register' && (
          <RegisterScreen onSuccess={handleRegisterSuccess} />
        )}

        {mode === 'otp' && (
          <OtpScreen
            userId={userId}
            email={email}
            purpose="email_verify"
            onSuccess={handleOtpSuccess}
            onBack={() => setMode('register')}
          />
        )}

        {mode === 'login' && (
          <LoginScreen
            onSuccess={handleLoginSuccess}
            onForgot={() => setMode('forgot')}
            onRegister={() => setMode('register')}
          />
        )}

        {mode === 'forgot' && (
          <ForgotScreen
            onSuccess={handleForgotSuccess}
            onBack={() => setMode('login')}
          />
        )}

        {mode === 'reset' && (
          <ResetScreen
            email={email}
            onSuccess={handleResetSuccess}
            onBack={() => setMode('forgot')}
          />
        )}

        {mode === 'done' && (
          <SuccessScreen
            message="Your password has been updated. You can now sign in with your new password."
            action={
              <button
                onClick={() => setMode('login')}
                className="btn btn-gold btn-md mx-auto"
              >
                Sign In →
              </button>
            }
          />
        )}

        {/* Footer toggle */}
        {(mode === 'register') && (
          <p className="text-sm text-ink-muted text-center mt-6">
            Already have an account?{' '}
            <button onClick={() => setMode('login')} className="text-gold hover:text-gold-dark font-medium transition-colors">
              Sign in
            </button>
          </p>
        )}
      </div>
    </div>
  )
}

