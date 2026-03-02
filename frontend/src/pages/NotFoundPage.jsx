import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4 p-8">
      <span className="overline">404</span>
      <h1 className="text-display font-semibold text-ink">Page not found</h1>
      <p className="text-ink-secondary">
        This page doesn&apos;t exist or has been moved.
      </p>
      <Link to="/iso-27001" className="btn btn-primary btn-md mt-4">
        ← Back to Home
      </Link>
    </div>
  )
}
