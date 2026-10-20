import { Search, ArrowRight } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'

import { ContentNavbar } from '@/components/layout/ContentNavbar'
import { CONTROLS, THEMES } from '@/data/annexA'
import { annexIndexSeo, controlPath } from '@/lib/contentPages'
import { useSeo } from '@/lib/seo'

export default function AnnexAIndexPage() {
  useSeo(annexIndexSeo())
  const [query, setQuery] = useState('')

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase()
    const match = (c) => !q || `a.${c.id} ${c.id} ${c.title}`.toLowerCase().includes(q)
    return Object.entries(THEMES)
      .map(([key, theme]) => ({ key, theme, controls: CONTROLS.filter((c) => c.theme === key && match(c)) }))
      .filter((g) => g.controls.length > 0)
  }, [query])

  const newCount = CONTROLS.filter((c) => c.isNew).length

  return (
    <div className="min-h-screen bg-ink">
      <ContentNavbar />

      <header className="pt-32 pb-14 px-6 text-center border-b border-white/10">
        <div className="max-w-3xl mx-auto">
          <span className="inline-flex items-center rounded-full border border-gold/50 px-4 py-1 text-xs text-gold mb-6 uppercase tracking-widest font-semibold">
            ISO/IEC 27001:2022 reference
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white leading-tight mb-5">
            Annex A controls, explained
          </h1>
          <p className="text-white/60 text-lg leading-relaxed mb-8">
            What each control is for, how to implement it, the evidence an auditor will ask for, and the
            nonconformities we see most often. {CONTROLS.length} controls covered
            {newCount > 0 && <>, including {newCount} new in the 2022 revision</>}. Looking for the
            management-system requirements? See <Link to="/iso-27001/clauses" className="text-gold hover:underline">Clauses 4–10</Link>.
          </p>
          <label className="relative block max-w-md mx-auto">
            <span className="sr-only">Search controls</span>
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by number or name, e.g. 8.13 or backup"
              className="w-full bg-white/5 border border-white/15 rounded-full pl-11 pr-5 py-3 text-white placeholder-white/40 focus:outline-none focus:border-gold/60"
            />
          </label>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-14 space-y-14">
        {groups.length === 0 && (
          <p className="text-center text-white/50">No controls match “{query}”.</p>
        )}
        {groups.map(({ key, theme, controls }) => (
          <section key={key} id={key} className="scroll-mt-24">
            <h2 className="text-2xl font-serif font-bold text-white mb-1">{theme.label}</h2>
            <p className="text-white/40 text-sm mb-6">
              Annex A {theme.prefix}.{theme.range[0]}–{theme.prefix}.{theme.range[1]}
            </p>
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {controls.map((c) => (
                <li key={c.id}>
                  <Link
                    to={controlPath(c)}
                    className="group flex h-full items-start gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 hover:border-gold/50 hover:bg-white/[0.06] transition-colors"
                  >
                    <span className="font-mono text-gold text-sm pt-0.5 shrink-0">A.{c.id}</span>
                    <span className="text-white/85 text-sm leading-snug group-hover:text-white">
                      {c.title}
                      {c.isNew && (
                        <span className="ml-2 inline-block rounded bg-gold/15 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gold align-middle">
                          New
                        </span>
                      )}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <section className="rounded-2xl border border-gold/30 bg-gold/5 p-8 text-center">
          <h2 className="text-2xl font-serif font-bold text-white mb-2">Know your Annex A?</h2>
          <p className="text-white/60 mb-6">
            Prove it with the free Professional exam — 100 questions on Annex A controls, nonconformity
            scenarios and ISO 19011 audit practice, with a verifiable certificate.
          </p>
          <Link to="/login?register=1" className="btn btn-gold">
            Take the free exam <ArrowRight size={16} className="ml-2" />
          </Link>
        </section>
      </main>
    </div>
  )
}
