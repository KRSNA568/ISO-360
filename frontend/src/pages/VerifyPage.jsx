// TODO: Phase 5 — Public certificate verification page (no auth required)
import { useParams } from 'react-router-dom'

export default function VerifyPage() {
  const { certificateId } = useParams()

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="card max-w-lg w-full text-center">
        <p className="overline mb-4">Certificate Lookup</p>
        <p className="font-mono text-sm text-ink-secondary">{certificateId}</p>
      </div>
    </div>
  )
}
