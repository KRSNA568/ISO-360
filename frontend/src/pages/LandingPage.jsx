// TODO: Phase 1 — Landing page with hero, stats, tracks, certificate preview, testimonials, FAQ
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <span className="overline">ISO 27001:2022 · Free Certification · 2026</span>
          <h1 className="text-hero font-serif font-bold text-ink mt-4">
            ISO-Audit360
          </h1>
          <p className="text-xl text-ink-secondary mt-4 max-w-xl mx-auto">
            The ISO 27001:2022 Lead Auditor exam you can&apos;t cheat.
          </p>
          <a href="/login" className="btn btn-primary btn-xl mt-8 inline-flex">
            Verify Identity &amp; Start Audit →
          </a>
        </div>
      </div>
    </div>
  )
}
