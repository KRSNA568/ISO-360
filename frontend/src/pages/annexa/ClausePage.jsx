import { ArrowLeft, ArrowRight, AlertTriangle, ClipboardCheck, Link2 } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'

import { ContentNavbar } from '@/components/layout/ContentNavbar'
import { CONTROLS_BY_ID } from '@/data/annexA'
import { CLAUSES, CLAUSES_BY_SLUG } from '@/data/clauses'
import { CLAUSES_PATH, clausePath, clauseSeo } from '@/lib/clausePages'
import { controlPath } from '@/lib/contentPages'
import { useSeo } from '@/lib/seo'

function BulletList({ items }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-white/75 leading-relaxed">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold/70" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

function ClauseArticle({ clause }) {
  useSeo(clauseSeo(clause))

  const index    = CLAUSES.indexOf(clause)
  const prev     = CLAUSES[index - 1]
  const next     = CLAUSES[index + 1]
  const controls = clause.controls.map((id) => CONTROLS_BY_ID[id]).filter(Boolean)

  return (
    <div className="min-h-screen bg-ink">
      <ContentNavbar />

      <article className="pt-28 pb-20 px-6 max-w-3xl mx-auto">
        <nav aria-label="Breadcrumb" className="text-xs text-white/40 mb-8 flex flex-wrap items-center gap-2">
          <Link to={CLAUSES_PATH} className="hover:text-gold transition-colors">ISO 27001 clauses</Link>
          <span>/</span>
          <span className="text-white/60">Clause {clause.number}</span>
        </nav>

        <header className="mb-10 border-b border-white/10 pb-8">
          <span className="inline-block rounded-full border border-gold/40 px-3 py-1 text-xs font-semibold text-gold mb-4">
            ISO 27001:2022 Clause {clause.number}
          </span>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-white leading-tight mb-5">
            Clause {clause.number}: {clause.title}
          </h1>
          <p className="text-lg text-white/75 leading-relaxed">{clause.intro}</p>
        </header>

        <section className="mb-12 space-y-6">
          {clause.subclauses.map((s) => (
            <div key={s.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
              <h2 className="text-lg font-serif font-bold text-white mb-2">
                <span className="font-mono text-gold mr-2">{s.id}</span>{s.title}
              </h2>
              <p className="text-white/70 leading-relaxed">{s.summary}</p>
            </div>
          ))}
        </section>

        <section className="mb-10">
          <h2 className="flex items-center gap-2 text-xl font-serif font-bold text-white mb-4">
            <ClipboardCheck size={20} className="text-gold" /> Audit evidence an auditor will ask for
          </h2>
          <BulletList items={clause.evidence} />
        </section>

        <section className="mb-10">
          <h2 className="flex items-center gap-2 text-xl font-serif font-bold text-white mb-4">
            <AlertTriangle size={20} className="text-gold" /> Common nonconformities
          </h2>
          <BulletList items={clause.ncs} />
        </section>

        {controls.length > 0 && (
          <section className="mb-12">
            <h2 className="flex items-center gap-2 text-xl font-serif font-bold text-white mb-4">
              <Link2 size={20} className="text-gold" /> Related Annex A controls
            </h2>
            <ul className="flex flex-wrap gap-2">
              {controls.map((c) => (
                <li key={c.id}>
                  <Link
                    to={controlPath(c)}
                    className="inline-block rounded-lg border border-white/10 px-3 py-2 text-sm text-white/80 hover:border-gold/50 hover:text-white transition-colors"
                  >
                    <span className="font-mono text-gold mr-1.5">A.{c.id}</span>{c.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <aside className="rounded-2xl border border-gold/30 bg-gold/5 p-6 mb-12">
          <h2 className="text-lg font-serif font-bold text-white mb-2">Test your clause knowledge</h2>
          <p className="text-white/60 text-sm mb-4">
            The free Associate exam covers Clauses 4–10. Pass and get a verifiable certificate for your LinkedIn profile.
          </p>
          <Link to="/login?register=1" className="btn btn-gold btn-sm">Take the free exam</Link>
        </aside>

        <nav aria-label="Clause navigation" className="flex justify-between gap-4 border-t border-white/10 pt-8 text-sm">
          {prev ? (
            <Link to={clausePath(prev)} className="flex items-center gap-2 text-white/60 hover:text-gold transition-colors">
              <ArrowLeft size={16} /> Clause {prev.number} <span className="hidden sm:inline">{prev.title}</span>
            </Link>
          ) : <span />}
          {next ? (
            <Link to={clausePath(next)} className="flex items-center gap-2 text-right text-white/60 hover:text-gold transition-colors">
              Clause {next.number} <span className="hidden sm:inline">{next.title}</span> <ArrowRight size={16} />
            </Link>
          ) : <span />}
        </nav>

        <p className="mt-10 text-xs text-white/30 leading-relaxed">
          Clause numbers and titles follow ISO/IEC 27001:2022 (with Amendment 1:2024). The summaries on this
          page are our own plain-English interpretation, not the text of the standard.
        </p>
      </article>
    </div>
  )
}

export default function ClausePage() {
  const { slug } = useParams()
  const clause = CLAUSES_BY_SLUG[slug]
  if (!clause) {return <Navigate to={CLAUSES_PATH} replace />}
  return <ClauseArticle key={clause.number} clause={clause} />
}
