import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Shield, Search, ArrowRight } from 'lucide-react'

export default function VerifyLandingPage() {
  const [certId, setCertId]   = useState('')
  const [error,  setError]    = useState('')
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = certId.trim().toUpperCase()
    if (!trimmed) {
      setError('Please enter a certificate ID.')
      return
    }
    navigate(`/verify/${trimmed}`)
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6">

      {/* Brand */}
      <Link to="/iso-27001" className="mb-10 flex items-center gap-2 group">
        <Shield size={24} className="text-gold" />
        <span className="font-serif font-bold text-xl text-ink tracking-wide group-hover:text-gold transition-colors">
          27001<span className="text-gold">certified</span>
        </span>
      </Link>

      <div className="card max-w-md w-full px-8 py-10 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-5">
          <div className="w-14 h-14 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
            <Shield size={26} className="text-gold" />
          </div>
        </div>

        <h1 className="text-2xl font-serif font-bold text-ink mb-2">
          Verify a Certificate
        </h1>
        <p className="text-sm text-ink-muted mb-8 leading-relaxed">
          Enter the certificate ID to instantly verify its authenticity and view the holder's details.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              id="cert-id-input"
              type="text"
              value={certId}
              onChange={(e) => { setCertId(e.target.value); setError('') }}
              placeholder="e.g. ISO27-2026-ABCD1234"
              className="w-full px-4 py-3 rounded-lg border border-border bg-surface text-ink font-mono text-sm placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-gold/40 focus:border-gold transition-colors uppercase"
              autoComplete="off"
              spellCheck={false}
            />
            {error && (
              <p className="mt-2 text-xs text-red-500 text-left">{error}</p>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-md w-full justify-center"
          >
            <Search size={15} />
            Verify Certificate
            <ArrowRight size={15} />
          </button>
        </form>

        <p className="mt-6 text-xs text-ink-muted leading-relaxed">
          Certificate IDs are found on your digital certificate or in your results email.
          They follow the format <span className="font-mono">ISO27-2026-XXXXXXXX</span>.
        </p>
      </div>

      {/* CTA */}
      <p className="mt-8 text-sm text-ink-muted text-center">
        Don't have a certificate yet?{' '}
        <Link to="/login?register=1" className="text-gold hover:underline font-medium">
          Take the free exam →
        </Link>
      </p>

      <p className="mt-6 text-xs text-ink-muted text-center max-w-sm">
        This verification service is provided by 27001certified. Results reflect the official record at time of verification.
      </p>
    </div>
  )
}
