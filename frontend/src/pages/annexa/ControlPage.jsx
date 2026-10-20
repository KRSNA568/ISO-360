import { ArrowLeft, ArrowRight, CheckCircle2, ClipboardCheck, AlertTriangle, Target } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'

import { ContentNavbar } from '@/components/layout/ContentNavbar'
import { CONTROLS, CONTROLS_BY_ID, CONTROLS_BY_SLUG, THEMES } from '@/data/annexA'
import { ANNEX_A_PATH, controlPath, controlSeo } from '@/lib/contentPages'
import { useSeo } from '@/lib/seo'

function Section({ icon: Icon, title, items }) {
  return (
    <section className="mb-10">
      <h2 className="flex items-center gap-2 text-xl font-serif font-bold text-white mb-4">
        <Icon size={20} className="text-gold" /> {title}
      </h2>
      <ul className="space-y-3">
        {items.map((item) => (
          <li key={item} className="flex gap-3 text-white/75 leading-relaxed">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold/70" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

function ControlArticle({ control }) {
  useSeo(controlSeo(control))

  const index   = CONTROLS.indexOf(control)
  const prev    = CONTROLS[index - 1]
  const next    = CONTROLS[index + 1]
  const theme   = THEMES[control.theme]
  const related = control.related.map((id) => CONTROLS_BY_ID[id]).filter(Boolean)

  return (
    <div className="min-h-screen bg-ink">
      <ContentNavbar />

      <article className="pt-28 pb-20 px-6 max-w-3xl mx-auto">
        <nav aria-label="Breadcrumb" className="text-xs text-white/40 mb-8 flex flex-wrap items-center gap-2">
          <Link to={ANNEX_A_PATH} className="hover:text-gold transition-colors">Annex A controls</Link>
          <span>/</span>
          <Link to={`${ANNEX_A_PATH}#${control.theme}`} className="hover:text-gold transition-colors">{theme.label}</Link>
          <span>/</span>
          <span className="text-white/60">A.{control.id}</span>
        </nav>

        <header className="mb-10 border-b border-white/10 pb-8">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="rounded-full border border-gold/40 px-3 py-1 text-xs font-semibold text-gold">
              ISO 27001:2022 Annex A {control.id}
            </span>
            {control.isNew && (
              <span className="rounded-full bg-gold/15 px-3 py-1 text-xs font-semibold text-gold">New in 2022</span>
            )}
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-white leading-tight mb-5">
            A.{control.id} {control.title}
          </h1>
          <p className="text-lg text-white/75 leading-relaxed">{control.purpose}</p>
        </header>

        <Section icon={Target}         title="How to implement it"                 items={control.implement} />
        <Section icon={ClipboardCheck} title="Audit evidence an auditor will ask for" items={control.evidence} />
        <Section icon={AlertTriangle}  title="Common nonconformities"               items={control.ncs} />

        {related.length > 0 && (
          <section className="mb-12">
            <h2 className="flex items-center gap-2 text-xl font-serif font-bold text-white mb-4">
              <CheckCircle2 size={20} className="text-gold" /> Related controls
            </h2>
            <ul className="flex flex-wrap gap-2">
              {related.map((r) => (
                <li key={r.id}>
                  <Link
                    to={controlPath(r)}
                    className="inline-block rounded-lg border border-white/10 px-3 py-2 text-sm text-white/80 hover:border-gold/50 hover:text-white transition-colors"
                  >
                    <span className="font-mono text-gold mr-1.5">A.{r.id}</span>{r.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <aside className="rounded-2xl border border-gold/30 bg-gold/5 p-6 mb-12">
          <h2 className="text-lg font-serif font-bold text-white mb-2">Test your Annex A knowledge</h2>
          <p className="text-white/60 text-sm mb-4">
            The free Professional exam covers all four control themes, nonconformity scenarios and audit
            practice. Pass and get a verifiable certificate for your LinkedIn profile.
          </p>
          <Link to="/login?register=1" className="btn btn-gold btn-sm">Take the free exam</Link>
        </aside>

        <nav aria-label="Control navigation" className="flex justify-between gap-4 border-t border-white/10 pt-8 text-sm">
          {prev ? (
            <Link to={controlPath(prev)} className="group flex items-center gap-2 text-white/60 hover:text-gold transition-colors">
              <ArrowLeft size={16} />
              <span><span className="font-mono">A.{prev.id}</span> <span className="hidden sm:inline">{prev.title}</span></span>
            </Link>
          ) : <span />}
          {next ? (
            <Link to={controlPath(next)} className="group flex items-center gap-2 text-right text-white/60 hover:text-gold transition-colors">
              <span><span className="font-mono">A.{next.id}</span> <span className="hidden sm:inline">{next.title}</span></span>
              <ArrowRight size={16} />
            </Link>
          ) : <span />}
        </nav>

        <p className="mt-10 text-xs text-white/30 leading-relaxed">
          Control numbers and titles follow ISO/IEC 27001:2022 Annex A. The guidance on this page is our own
          practical interpretation, not the text of the standard.
        </p>
      </article>
    </div>
  )
}

export default function ControlPage() {
  const { slug } = useParams()
  const control = CONTROLS_BY_SLUG[slug]
  if (!control) {return <Navigate to={ANNEX_A_PATH} replace />}
  // Keyed so hooks reset cleanly when navigating between controls
  return <ControlArticle key={control.id} control={control} />
}
