import { useEffect, useState } from 'react'
import { useParams, Link }    from 'react-router-dom'
import { CheckCircle2, XCircle, AlertTriangle, Loader2, Shield } from 'lucide-react'
import { certificateApi } from '@/lib/apiServices'

export default function VerifyPage() {
  const { certificateId } = useParams()
  const [phase, setPhase] = useState('loading')   // loading | valid | revoked | notfound | error
  const [cert,  setCert]  = useState(null)

  useEffect(() => {
    if (!certificateId) {
      setPhase('notfound')
      return
    }
    certificateApi.verify(certificateId)
      .then(res => {
        const c = res.data
        setCert(c)
        setPhase(c.revoked ? 'revoked' : 'valid')
      })
      .catch(err => {
        if (err?.response?.status === 404) setPhase('notfound')
        else                               setPhase('error')
      })
  }, [certificateId])

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4">

      {/* Brand strip */}
      <Link to="/iso-27001" className="mb-8 flex items-center gap-2 group">
        <Shield size={22} className="text-gold" />
        <span className="font-serif font-semibold text-ink tracking-wide text-lg group-hover:text-gold transition-colors">
          ISO-Audit360
        </span>
      </Link>

      <div className="card max-w-lg w-full text-center py-10 px-8">

        {/* ── Loading ── */}
        {phase === 'loading' && (
          <div className="flex flex-col items-center gap-4 py-4">
            <Loader2 size={32} className="text-gold animate-spin" />
            <p className="text-ink-muted text-sm">Verifying certificate…</p>
          </div>
        )}

        {/* ── Valid ── */}
        {phase === 'valid' && cert && (
          <div className="animate-fade-up space-y-6">
            <div className="flex justify-center">
              <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-semibold text-sm tracking-wide">
                <CheckCircle2 size={16} /> VALID CERTIFICATE
              </span>
            </div>

            <div>
              <p className="text-3xl font-serif font-bold text-ink mt-2">{cert.fullName}</p>
              <p className="text-sm text-ink-muted mt-1">has successfully passed the</p>
              <p className="text-base font-semibold text-gold mt-1">ISO 27001 — {cert.trackLabel}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-left bg-surface rounded-lg p-4">
              <div>
                <p className="text-xs text-ink-muted">Score</p>
                <p className="text-base font-semibold text-ink">{cert.score}%</p>
              </div>
              <div>
                <p className="text-xs text-ink-muted">Date awarded</p>
                <p className="text-base font-semibold text-ink">
                  {new Date(cert.awardedOn).toLocaleDateString('en-GB', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <div className="bg-surface rounded-lg px-4 py-3">
              <p className="text-xs text-ink-muted mb-1">Certificate ID</p>
              <p className="font-mono text-base text-gold">{cert.certificateId}</p>
            </div>
          </div>
        )}

        {/* ── Revoked ── */}
        {phase === 'revoked' && cert && (
          <div className="animate-fade-up space-y-6">
            <div className="flex justify-center">
              <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-red-50 border border-red-200 text-red-700 font-semibold text-sm tracking-wide">
                <XCircle size={16} /> CERTIFICATE REVOKED
              </span>
            </div>

            <div>
              <p className="text-2xl font-serif font-bold text-ink mt-2">{cert.fullName}</p>
              <p className="text-sm text-ink-muted mt-1">ISO 27001 — {cert.trackLabel}</p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-left">
              <p className="text-xs font-semibold text-red-700 mb-1">Reason for revocation</p>
              <p className="text-sm text-red-700">{cert.revokedReason || 'No reason provided.'}</p>
              {cert.revokedAt && (
                <p className="text-xs text-red-500 mt-2">
                  Revoked on {new Date(cert.revokedAt).toLocaleDateString('en-GB', {
                    day: 'numeric', month: 'long', year: 'numeric'
                  })}
                </p>
              )}
            </div>

            <div className="bg-surface rounded-lg px-4 py-3">
              <p className="text-xs text-ink-muted mb-1">Certificate ID</p>
              <p className="font-mono text-base text-ink-secondary">{cert.certificateId}</p>
            </div>
          </div>
        )}

        {/* ── Not found ── */}
        {phase === 'notfound' && (
          <div className="animate-fade-up space-y-4 py-4">
            <AlertTriangle size={36} className="text-gold mx-auto" />
            <h1 className="text-xl font-semibold text-ink">Certificate Not Found</h1>
            <p className="text-sm text-ink-muted">
              No certificate was found for ID{' '}
              <span className="font-mono text-ink">{certificateId}</span>.
              Please double-check the ID or QR code and try again.
            </p>
          </div>
        )}

        {/* ── Error ── */}
        {phase === 'error' && (
          <div className="animate-fade-up space-y-4 py-4">
            <AlertTriangle size={36} className="text-gold mx-auto" />
            <h1 className="text-xl font-semibold text-ink">Verification Unavailable</h1>
            <p className="text-sm text-ink-muted">
              Could not reach the verification service. Please try again in a moment.
            </p>
          </div>
        )}

      </div>

      <p className="mt-8 text-xs text-ink-muted text-center max-w-sm">
        This certificate verification service is provided by ISO-Audit360.
        The information shown above reflects the official record at time of verification.
      </p>

    </div>
  )
}

