import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

import { ContentNavbar } from '@/components/layout/ContentNavbar'
import { CLAUSES } from '@/data/clauses'
import { clauseIndexSeo, clausePath } from '@/lib/clausePages'
import { ANNEX_A_PATH } from '@/lib/contentPages'
import { useSeo } from '@/lib/seo'

export default function ClauseIndexPage() {
  useSeo(clauseIndexSeo())

  return (
    <div className="min-h-screen bg-ink">
      <ContentNavbar />

      <header className="pt-32 pb-14 px-6 text-center border-b border-white/10">
        <div className="max-w-3xl mx-auto">
          <span className="inline-flex items-center rounded-full border border-gold/50 px-4 py-1 text-xs text-gold mb-6 uppercase tracking-widest font-semibold">
            ISO/IEC 27001:2022 reference
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white leading-tight mb-5">
            ISMS requirements: Clauses 4–10
          </h1>
          <p className="text-white/60 text-lg leading-relaxed">
            The clauses are the mandatory management-system requirements every certified ISMS must meet.
            Each guide explains the sub-clauses in plain English, the evidence auditors look for and the
            nonconformities we see most often. For the security controls themselves, see the{' '}
            <Link to={ANNEX_A_PATH} className="text-gold hover:underline">Annex A control library</Link>.
          </p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-14">
        <ol className="space-y-3">
          {CLAUSES.map((c) => (
            <li key={c.number}>
              <Link
                to={clausePath(c)}
                className="group flex items-start gap-5 rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4 hover:border-gold/50 hover:bg-white/[0.06] transition-colors"
              >
                <span className="font-serif text-3xl font-bold text-gold w-10 shrink-0">{c.number}</span>
                <span>
                  <span className="block text-white font-semibold mb-1 group-hover:text-gold transition-colors">{c.title}</span>
                  <span className="block text-sm text-white/55 leading-relaxed">{c.intro}</span>
                </span>
                <ArrowRight size={18} className="ml-auto mt-1 shrink-0 text-white/30 group-hover:text-gold" />
              </Link>
            </li>
          ))}
        </ol>

        <section className="mt-14 rounded-2xl border border-gold/30 bg-gold/5 p-8 text-center">
          <h2 className="text-2xl font-serif font-bold text-white mb-2">Know the clauses?</h2>
          <p className="text-white/60 mb-6">
            The free Associate exam tests Clauses 4–10 — 50 questions, with a verifiable certificate when you pass.
          </p>
          <Link to="/login?register=1" className="btn btn-gold">
            Take the free exam <ArrowRight size={16} className="ml-2" />
          </Link>
        </section>
      </main>
    </div>
  )
}
