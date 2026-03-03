import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, AlertTriangle } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { userApi } from '@/lib/apiServices'
import AppNavbar from '@/components/layout/AppNavbar'
import { cn } from '@/lib/cn'

// ─── Schema ───────────────────────────────────────────────────────────────────

const profileSchema = z.object({
  full_name: z.string().min(2, 'Full name is required'),
  company:   z.string().max(120).optional(),
  job_role:  z.string().max(80).optional(),
  country:   z.string().max(80).optional(),
})

// ─── Small helpers ────────────────────────────────────────────────────────────

function Label({ children }) {
  return <label className="block text-sm font-medium text-ink mb-1">{children}</label>
}

function FieldError({ msg }) {
  if (!msg) return null
  return <p className="text-xs text-red-600 mt-1">{msg}</p>
}

function Flash({ type, msg }) {
  if (!msg) return null
  const styles = type === 'success'
    ? 'bg-green-50 border-green-200 text-green-800'
    : 'bg-red-50 border-red-200 text-red-700'
  return (
    <div className={cn('rounded-md border px-4 py-3 text-sm', styles)}>{msg}</div>
  )
}

// ─── Profile Form ─────────────────────────────────────────────────────────────

function ProfileForm() {
  const { user, updateUser } = useAuth()
  const [flash, setFlash]   = useState({ type: '', msg: '' })

  const { register, handleSubmit, formState: { errors, isSubmitting, isDirty } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: user?.full_name || '',
      company:   user?.company  || '',
      job_role:  user?.job_role || '',
      country:   user?.country  || '',
    },
  })

  async function onSubmit(data) {
    // Strip empty strings
    const payload = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== '')
    )
    try {
      const res = await userApi.updateMe(payload)
      updateUser(res.data)
      setFlash({ type: 'success', msg: 'Profile updated.' })
    } catch (e) {
      setFlash({ type: 'error', msg: e.response?.data?.error || 'Update failed.' })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card space-y-5">
      <h2 className="text-base font-semibold text-ink">Profile Information</h2>

      <div>
        <Label>Full Name</Label>
        <input
          {...register('full_name')}
          className={cn('input', errors.full_name && 'input-error')}
        />
        <FieldError msg={errors.full_name?.message} />
      </div>

      <div>
        <Label>Company</Label>
        <input
          {...register('company')}
          placeholder="Optional"
          className="input"
        />
      </div>

      <div>
        <Label>Job Role</Label>
        <input
          {...register('job_role')}
          placeholder="Optional"
          className="input"
        />
      </div>

      <div>
        <Label>Country</Label>
        <input
          {...register('country')}
          placeholder="Optional"
          className="input"
        />
      </div>

      <div>
        <Label>Email</Label>
        <input value={user?.email || ''} disabled className="input opacity-50 cursor-not-allowed" />
        <p className="text-xs text-ink-muted mt-1">Email cannot be changed.</p>
      </div>

      <Flash {...flash} />

      <button
        type="submit"
        disabled={isSubmitting || !isDirty}
        className="btn btn-primary btn-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : 'Save Changes'}
      </button>
    </form>
  )
}

// ─── Danger Zone ──────────────────────────────────────────────────────────────

function DangerZone() {
  const navigate        = useNavigate()
  const { user, logout } = useAuth()
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting]     = useState(false)
  const [error, setError]           = useState('')

  async function handleDelete() {
    setDeleting(true)
    setError('')
    try {
      await userApi.deleteMe()
      await logout()
      navigate('/iso-27001', { replace: true })
    } catch (e) {
      setError(e.response?.data?.error || 'Delete failed. Please try again.')
      setDeleting(false)
    }
  }

  return (
    <div className="card border-red-200">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0">
          <AlertTriangle size={16} className="text-red-600" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-red-800">Delete Account</h2>
          <p className="text-sm text-ink-muted mt-0.5">
            Permanently delete your account and all associated data. This cannot be undone.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 mb-4">
          {error}
        </div>
      )}

      {!confirming ? (
        <button
          onClick={() => setConfirming(true)}
          className="btn btn-md border border-red-300 text-red-600 bg-white hover:bg-red-50 transition-colors"
        >
          Delete My Account
        </button>
      ) : (
        <div className="space-y-3">
          <p className="text-sm font-medium text-red-700">
            Are you sure? Your account for <strong>{user?.email}</strong> will be permanently deleted.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="btn btn-md bg-red-600 text-white hover:bg-red-700 active:scale-[0.98] disabled:opacity-60"
            >
              {deleting ? <Loader2 size={15} className="animate-spin" /> : 'Yes, delete my account'}
            </button>
            <button
              onClick={() => setConfirming(false)}
              className="btn btn-outline btn-md"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-surface">
      <AppNavbar />

      <main className="max-w-2xl mx-auto px-6 py-10 space-y-8">
        <div>
          <span className="overline">Account</span>
          <h1 className="text-display font-serif font-bold text-ink mt-1">Profile Settings</h1>
        </div>

        <ProfileForm />
        <DangerZone />
      </main>
    </div>
  )
}
