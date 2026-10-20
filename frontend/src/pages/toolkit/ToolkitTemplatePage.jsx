import { ArrowLeft, ArrowRight, Download, ListChecks, Package, Table2, Target } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'

import { ContentNavbar } from '@/components/layout/ContentNavbar'
import { CONTROLS_BY_ID } from '@/data/annexA'
import { CLAUSES } from '@/data/clauses'
import { TEMPLATES, findTemplate, templateFileUrl, templatePath } from '@/data/toolkit'
import { clausePath } from '@/lib/clausePages'
import { controlPath } from '@/lib/contentPages'
import { useSeo } from '@/lib/seo'
import { TOOLKIT_PATH, templateSeo } from '@/lib/toolkitPages'

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

function DownloadButton({ template }) {
  return (
    <a href={templateFileUrl(template)} download className="btn btn-gold">
      <Download size={16} className="mr-2" /> Download the {template.format}
    </a>
  )
}

function TemplateArticle({ template }) {
  useSeo(templateSeo(template))

  const index = TEMPLATES.indexOf(template)
  const prev  = TEMPLATES[index - 1]
  const next  = TEMPLATES[index + 1]

  const clauses  = (template.related?.clauses ?? [])
    .map((number) => CLAUSES.find((c) => c.number === number))
    .filter(Boolean)
  const controls = (template.related?.controls ?? [])
    .map((id) => CONTROLS_BY_ID[id])
    .filter(Boolean)

  return (
    <div className="min-h-screen bg-ink">
      <ContentNavbar />

      <article className="pt-28 pb-20 px-6 max-w-3xl mx-auto">
        <nav aria-label="Breadcrumb" className="text-xs text-white/40 mb-8 flex flex-wrap items-center gap-2">
          <Link to={TOOLKIT_PATH} className="hover:text-gold transition-colors">Free toolkit</Link>
          <span>/</span>
          <span className="text-white/60">{template.name}</span>
        </nav>

        <header className="mb-10 border-b border-white/10 pb-8">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="rounded-full border border-gold/40 px-3 py-1 text-xs font-semibold text-gold">
              {template.reference}
            </span>
            <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-white/60">
              {template.format} · {template.rowsNote}
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-white leading-tight mb-5">
            {template.name} template
          </h1>
          <p className="text-lg text-white/75 leading-relaxed mb-7">{template.summary}</p>
          <DownloadButton template={template} />
          <p className="text-xs text-white/35 mt-3">
            Free, no signup. The file downloads straight from this page.
          </p>
        </header>

        <Section icon={Package}    title="What's inside"   items={template.whatsInside} />
        <Section icon={ListChecks} title="How to fill it in" items={template.howToUse} />

        {template.columns.length > 0 && (
          <section className="mb-10">
            <h2 className="flex items-center gap-2 text-xl font-serif font-bold text-white mb-4">
              <Table2 size={20} className="text-gold" /> Column reference
            </h2>
            <div className="overflow-x-auto rounded-xl border border-white/10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.03] text-left">
                    <th scope="col" className="px-4 py-3 font-semibold text-white/80">Column</th>
                    <th scope="col" className="px-4 py-3 font-semibold text-white/80">What goes in it</th>
                  </tr>
                </thead>
                <tbody>
                  {template.columns.map((col) => (
                    <tr key={col.name} className="border-b border-white/5 last:border-0 align-top">
                      <th scope="row" className="px-4 py-3 font-medium text-white/85 whitespace-nowrap text-left">
                        {col.name}
                      </th>
                      <td className="px-4 py-3 text-white/60 leading-relaxed">{col.help}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {template.agenda && (
          <section className="mb-10">
            <h2 className="flex items-center gap-2 text-xl font-serif font-bold text-white mb-4">
              <Target size={20} className="text-gold" /> The agenda items
            </h2>
            <ol className="space-y-4">
              {template.agenda.map((entry, i) => (
                <li key={entry.item} className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
                  <p className="text-white font-semibold mb-2">
                    <span className="font-mono text-gold text-sm mr-2">{String(i + 1).padStart(2, '0')}</span>
                    {entry.item}
                  </p>
                  <p className="text-white/65 text-sm leading-relaxed mb-3">{entry.prompt}</p>
                  <p className="text-xs text-white/40">
                    <span className="text-white/55">Presented by:</span> {entry.who}
                  </p>
                  <p className="text-xs text-white/40 mt-1">
                    <span className="text-white/55">Evidence to bring:</span> {entry.evidence}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        )}

        {(clauses.length > 0 || controls.length > 0) && (
          <section className="mb-12">
            <h2 className="text-xl font-serif font-bold text-white mb-4">Read the requirements behind it</h2>
            <ul className="flex flex-wrap gap-2">
              {clauses.map((c) => (
                <li key={c.slug}>
                  <Link
                    to={clausePath(c)}
                    className="inline-block rounded-lg border border-white/10 px-3 py-2 text-sm text-white/80 hover:border-gold/50 hover:text-white transition-colors"
                  >
                    <span className="font-mono text-gold mr-1.5">Clause {c.number}</span>{c.title}
                  </Link>
                </li>
              ))}
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
          <h2 className="text-lg font-serif font-bold text-white mb-2">Get the rest of the toolkit</h2>
          <p className="text-white/60 text-sm mb-4">
            All {TEMPLATES.length} templates are free and need no signup — and the free exam gives you a
            verifiable certificate to go with them.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to={TOOLKIT_PATH} className="btn btn-gold btn-sm">Browse the toolkit</Link>
            <Link to="/login?register=1" className="btn btn-sm border border-white/20 text-white/80 hover:text-white">
              Take the free exam
            </Link>
          </div>
        </aside>

        <nav aria-label="Template navigation" className="flex justify-between gap-4 border-t border-white/10 pt-8 text-sm">
          {prev ? (
            <Link to={templatePath(prev)} className="flex items-center gap-2 text-white/60 hover:text-gold transition-colors">
              <ArrowLeft size={16} /> <span>{prev.name}</span>
            </Link>
          ) : <span />}
          {next ? (
            <Link to={templatePath(next)} className="flex items-center gap-2 text-right text-white/60 hover:text-gold transition-colors">
              <span>{next.name}</span> <ArrowRight size={16} />
            </Link>
          ) : <span />}
        </nav>

        <p className="mt-10 text-xs text-white/30 leading-relaxed">
          Clause and control numbers and short control titles follow ISO/IEC 27001:2022. The guidance and
          examples here are our own, not the text of the standard, which is copyrighted. This template is a
          starting point, not certification advice.
        </p>
      </article>
    </div>
  )
}

export default function ToolkitTemplatePage() {
  const { slug } = useParams()
  const template = findTemplate(slug)
  if (!template) {return <Navigate to={TOOLKIT_PATH} replace />}
  // Keyed so hooks reset cleanly when navigating between templates
  return <TemplateArticle key={template.slug} template={template} />
}
