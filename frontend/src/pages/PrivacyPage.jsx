import { Link } from 'react-router-dom'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-ink text-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link to="/iso-27001" className="text-gold text-sm hover:underline mb-8 inline-block">← Back to Home</Link>

        <h1 className="text-4xl font-serif font-bold mb-2">Privacy Policy</h1>
        <p className="text-white/45 text-sm mb-10">Effective date: May 2026 · Last updated: May 2026</p>

        <div className="prose prose-invert prose-sm max-w-none space-y-8 text-white/75">

          <section>
            <h2 className="text-white text-xl font-semibold mb-3">Data Controller</h2>
            <p>27001certified (operated by Krishna Mahajan). Contact: <a href="mailto:privacy@27001certified.app" className="text-gold hover:underline">privacy@27001certified.app</a></p>
          </section>

          <section>
            <h2 className="text-white text-xl font-semibold mb-3">What We Collect</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li><strong className="text-white">Full name and email address</strong> — account creation, certificate issuance, transactional email.</li>
              <li><strong className="text-white">Password</strong> — stored as a bcrypt hash; we never see your plaintext password.</li>
              <li><strong className="text-white">Exam answers and scores</strong> — scoring, certificate generation, AI performance reports.</li>
              <li><strong className="text-white">IP address</strong> — OTP rate limiting, brute-force protection, fraud prevention.</li>
              <li><strong className="text-white">Browser / device information</strong> — session integrity checks.</li>
            </ul>
            <p className="mt-3">We do <strong className="text-white">not</strong> collect payment card data — no paid features exist at launch.</p>
          </section>

          <section>
            <h2 className="text-white text-xl font-semibold mb-3">Sub-processors</h2>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-2 pr-4 text-white font-medium">Processor</th>
                  <th className="text-left py-2 pr-4 text-white font-medium">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  ['Supabase', 'Database hosting, certificate file storage'],
                  ['Resend', 'Transactional email'],
                  ['Groq', 'AI report generation'],
                  ['Render', 'Application hosting'],
                  ['Upstash', 'Redis rate limiting'],
                ].map(([name, role]) => (
                  <tr key={name}>
                    <td className="py-2 pr-4 font-medium text-white/85">{name}</td>
                    <td className="py-2">{role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section>
            <h2 className="text-white text-xl font-semibold mb-3">Data Retention</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>Active account data is kept until you delete your account.</li>
              <li>After deletion, all data is hard-deleted within <strong className="text-white">90 days</strong>.</li>
              <li>OTP records are purged after 24 hours.</li>
              <li>Server request logs are retained for 30 days by our hosting provider.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white text-xl font-semibold mb-3">Your Rights</h2>
            <p>Under India&apos;s DPDP Act 2023, you can request access to, correction of, or erasure of your personal data. Email <a href="mailto:privacy@27001certified.app" className="text-gold hover:underline">privacy@27001certified.app</a>. We will acknowledge within 48 hours and resolve within 30 days.</p>
          </section>

          <section>
            <h2 className="text-white text-xl font-semibold mb-3">Cookies</h2>
            <p>We use <code className="text-gold">localStorage</code> for session tokens. No third-party tracking cookies are set.</p>
          </section>

        </div>
      </div>
    </div>
  )
}
