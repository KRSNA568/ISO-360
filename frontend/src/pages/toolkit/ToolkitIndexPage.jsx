import { ArrowRight, Download, FileSpreadsheet, FileText } from 'lucide-react'
import { Link } from 'react-router-dom'

import { ContentNavbar } from '@/components/layout/ContentNavbar'
import { TEMPLATES, templateFileUrl, templatePath } from '@/data/toolkit'
import { useSeo } from '@/lib/seo'
import { toolkitIndexSeo } from '@/lib/toolkitPages'

const ORDER = [
  ['Start here', 'Run the gap assessment to see where you actually stand before you commit to a certification date.'],
  ['Then', 'Build the risk register. Applicability follows from risk, so this has to come before the Statement of Applicability.'],
  ['Then', 'Fill the Statement of Applicability — the document your auditor opens first.'],
  ['Once the ISMS is running', 'Audit it with the internal audit checklist, track what it finds in the corrective action log, and review it with the management review agenda.'],
]

export default function ToolkitIndexPage() {
  useSeo(toolkitIndexSeo())

  return (
    <div className="min-h-screen bg-ink">
      <ContentNavbar />

      <header className="pt-32 pb-14 px-6 text-center border-b border-white/10">
        <div className="max-w-3xl mx-auto">
          <span className="inline-flex items-center rounded-full border border-gold/50 px-4 py-1 text-xs text-gold mb-6 uppercase tracking-widest font-semibold">
            Free — no signup, no email
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white leading-tight mb-5">
            The free ISO 27001 toolkit
          </h1>
          <p className="text-white/60 text-lg leading-relaxed">
            {TEMPLATES.length} templates that do the typing for you: a Statement of Applicability with all 93
            Annex A controls already listed, a gap assessment covering every clause requirement, and the
            registers and agendas an ISMS needs to keep running. Click a file and it downloads — there is
            no form in front of it.
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-14">
        <ul className="grid md:grid-cols-2 gap-4 mb-16">
          {TEMPLATES.map((t) => {
            const Icon = t.format === 'CSV' ? FileSpreadsheet : FileText
            return (
              <li
                key={t.slug}
                className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:border-white/20 transition-colors"
              >
                <div className="flex items-start gap-3 mb-3">
                  <Icon size={20} className="text-gold shrink-0 mt-1" />
                  <div>
                    <h2 className="text-xl font-serif font-bold text-white leading-snug">{t.name}</h2>
                    <p className="text-gold/80 text-sm mt-1">{t.tagline}</p>
                  </div>
                </div>

                <p className="text-white/60 text-sm leading-relaxed mb-4 flex-1">{t.summary}</p>

                <dl className="flex flex-wrap gap-x-5 gap-y-1 text-xs text-white/40 mb-5">
                  <div><dt className="sr-only">Format</dt><dd>{t.format}</dd></div>
                  <div><dt className="sr-only">Contents</dt><dd>{t.rowsNote}</dd></div>
                  <div><dt className="sr-only">Reference</dt><dd>{t.reference}</dd></div>
                </dl>

                <div className="flex flex-wrap items-center gap-3">
                  <a href={templateFileUrl(t)} download className="btn btn-gold btn-sm">
                    <Download size={15} className="mr-2" /> Download {t.format}
                  </a>
                  <Link
                    to={templatePath(t)}
                    className="text-sm text-white/60 hover:text-gold transition-colors"
                  >
                    How to fill it in
                  </Link>
                </div>
              </li>
            )
          })}
        </ul>

        <section className="mb-16">
          <h2 className="text-2xl font-serif font-bold text-white mb-6">What order to use them in</h2>
          <ol className="space-y-4">
            {ORDER.map(([when, what], i) => (
              <li key={i} className="flex gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-5">
                <span className="font-mono text-gold text-sm shrink-0">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <p className="text-white font-semibold text-sm mb-1">{when}</p>
                  <p className="text-white/60 text-sm leading-relaxed">{what}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mb-16 rounded-2xl border border-white/10 bg-white/[0.02] p-8">
          <h2 className="text-xl font-serif font-bold text-white mb-3">Before you open them</h2>
          <ul className="space-y-3 text-white/65 text-sm leading-relaxed">
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold/70" />
              <span>
                The CSV files open in Excel, Google Sheets, LibreOffice and Numbers. Save a copy in your own
                format once opened, so your formatting and formulas survive.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold/70" />
              <span>
                Pre-filled columns are a starting point. Edit the wording so it describes your organisation —
                an auditor can tell a template that has been filled in from one that has been adopted.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold/70" />
              <span>
                Free to use, adapt and share inside your organisation or with your clients. No attribution
                required.
              </span>
            </li>
          </ul>
        </section>

        <section className="rounded-2xl border border-gold/30 bg-gold/5 p-8 text-center">
          <h2 className="text-2xl font-serif font-bold text-white mb-2">Know the standard behind the templates?</h2>
          <p className="text-white/60 mb-6 max-w-2xl mx-auto">
            Read our plain-English guides to <Link to="/iso-27001/clauses" className="text-gold hover:underline">Clauses 4–10</Link>{' '}
            and <Link to="/iso-27001/annex-a" className="text-gold hover:underline">all 93 Annex A controls</Link>, then
            prove it with the free exam and a verifiable certificate.
          </p>
          <Link to="/login?register=1" className="btn btn-gold">
            Take the free exam <ArrowRight size={16} className="ml-2" />
          </Link>
        </section>

        <p className="mt-10 text-xs text-white/30 leading-relaxed">
          Clause and control numbers and short control titles follow ISO/IEC 27001:2022. All guidance,
          questions and examples in these templates are our own; no text is reproduced from ISO/IEC 27001,
          27002 or 19011, which are copyrighted. These templates help you apply the standard — they do not
          replace buying it, and they are not certification advice.
        </p>
      </main>
    </div>
  )
}
