import { Link } from 'react-router-dom'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-ink text-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link to="/iso-27001" className="text-gold text-sm hover:underline mb-8 inline-block">← Back to Home</Link>

        <h1 className="text-4xl font-serif font-bold mb-2">Terms of Service</h1>
        <p className="text-white/45 text-sm mb-10">Effective date: May 2026 · Governing law: India</p>

        <div className="space-y-8 text-white/75 text-sm leading-relaxed">

          <section>
            <h2 className="text-white text-xl font-semibold mb-3">1. Eligibility</h2>
            <p>You must be at least 13 years old to create an account. By registering you confirm you meet this requirement.</p>
          </section>

          <section>
            <h2 className="text-white text-xl font-semibold mb-3">2. Account Responsibility</h2>
            <p>You are responsible for maintaining the confidentiality of your login credentials. Notify us immediately at <a href="mailto:support@27001certified.in" className="text-gold hover:underline">support@27001certified.in</a> if you suspect unauthorised access.</p>
          </section>

          <section>
            <h2 className="text-white text-xl font-semibold mb-3">3. Exam Integrity</h2>
            <p className="mb-2">The exams use timed sessions and integrity monitoring. The following are prohibited:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Using unauthorised resources, aids, or automation tools during an exam.</li>
              <li>Sharing exam questions or answers.</li>
              <li>Creating multiple accounts to circumvent retake limits.</li>
              <li>Tampering with or intercepting exam sessions.</li>
            </ul>
            <p className="mt-2">Violations may result in permanent account suspension and certificate revocation.</p>
          </section>

          <section>
            <h2 className="text-white text-xl font-semibold mb-3">4. Certificates</h2>
            <p>Certificates issued by 27001certified are <strong className="text-white">platform credentials</strong> that demonstrate applied knowledge of ISO 27001:2022. They are not accredited certifications from an official standards body (ISO, BSI, etc.) and are not a substitute for formal accredited certification.</p>
            <p className="mt-2">We reserve the right to revoke certificates if evidence of integrity violations is discovered after issuance.</p>
          </section>

          <section>
            <h2 className="text-white text-xl font-semibold mb-3">5. Retake Policy</h2>
            <ul className="list-disc list-inside space-y-1">
              <li><strong className="text-white">Associate track:</strong> 3 attempts per rolling 30-day window. 24-hour cooldown between attempts.</li>
              <li><strong className="text-white">Professional track:</strong> 3 attempts per rolling 30-day window. 48-hour cooldown between attempts.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white text-xl font-semibold mb-3">6. Acceptable Use</h2>
            <p className="mb-2">You may not use the platform to:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Harass, impersonate, or harm other users.</li>
              <li>Attempt to reverse-engineer, scrape, or stress-test the platform without permission.</li>
              <li>Upload or transmit malicious code.</li>
              <li>Violate any applicable law or regulation.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-white text-xl font-semibold mb-3">7. Intellectual Property</h2>
            <p>All exam content, question banks, platform software, and branding are proprietary to 27001certified. You may not reproduce or redistribute exam content without written permission.</p>
          </section>

          <section>
            <h2 className="text-white text-xl font-semibold mb-3">8. Limitation of Liability</h2>
            <p>To the maximum extent permitted by applicable law, 27001certified is not liable for indirect, incidental, or consequential damages arising from use or inability to use the platform.</p>
          </section>

          <section>
            <h2 className="text-white text-xl font-semibold mb-3">9. Governing Law</h2>
            <p>These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts of India.</p>
          </section>

          <section>
            <h2 className="text-white text-xl font-semibold mb-3">10. Changes</h2>
            <p>Material changes will be communicated by email at least 14 days before taking effect.</p>
          </section>

        </div>
      </div>
    </div>
  )
}
