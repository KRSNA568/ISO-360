import { AlertTriangle, ArrowRight, ChevronDown, CornerDownRight, Target } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { ContentNavbar } from '@/components/layout/ContentNavbar'
import { CATEGORIES, QUESTIONS } from '@/data/interviewPrep'
import { PRACTICE_PATH } from '@/data/practice'
import { interviewSeo } from '@/lib/practicePages'
import { useSeo } from '@/lib/seo'

function QuestionCard({ question, number }) {
  const [open, setOpen] = useState(false)
  const panelId = `answer-${question.id}`

  return (
    <li className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="w-full text-left flex items-start gap-4 p-6 hover:bg-white/[0.03] transition-colors"
      >
        <span className="font-mono text-gold text-sm pt-1 shrink-0">{String(number).padStart(2, '0')}</span>
        <span className="flex-1">
          <span className="block text-white font-semibold leading-relaxed mb-2">{question.question}</span>
          <span className="block text-white/45 text-sm leading-relaxed">
            <span className="text-white/60">What they are testing:</span> {question.checking}
          </span>
        </span>
        <ChevronDown
          size={18}
          className={`text-white/40 shrink-0 mt-1 transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden
        />
      </button>

      {open && (
        <div id={panelId} className="px-6 pb-6 pl-16 space-y-5 border-t border-white/5 pt-5">
          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
              <Target size={15} className="text-gold" /> A strong answer
            </h3>
            <p className="text-white/70 text-sm leading-relaxed">{question.answer}</p>
          </div>

          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
              <CornerDownRight size={15} className="text-gold" /> Expect these next
            </h3>
            <ul className="space-y-2">
              {question.followUps.map((f) => (
                <li key={f} className="flex gap-2.5 text-white/60 text-sm leading-relaxed">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-gold/70" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="flex items-center gap-2 text-sm font-semibold text-white mb-2">
              <AlertTriangle size={15} className="text-rose-400/80" /> Answers that cost you the role
            </h3>
            <ul className="space-y-2">
              {question.redFlags.map((r) => (
                <li key={r} className="flex gap-2.5 text-white/60 text-sm leading-relaxed">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-rose-400/60" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </li>
  )
}

export default function InterviewPrepPage() {
  useSeo(interviewSeo())

  let counter = 0

  return (
    <div className="min-h-screen bg-ink">
      <ContentNavbar />

      <header className="pt-32 pb-14 px-6 text-center border-b border-white/10">
        <div className="max-w-3xl mx-auto">
          <span className="inline-flex items-center rounded-full border border-gold/50 px-4 py-1 text-xs text-gold mb-6 uppercase tracking-widest font-semibold">
            Interview preparation
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white leading-tight mb-5">
            Lead auditor interview questions
          </h1>
          <p className="text-white/60 text-lg leading-relaxed">
            {QUESTIONS.length} questions you will actually be asked in an ISO 27001 lead auditor or lead
            implementer interview — with what the interviewer is really testing, a model answer, the follow-ups
            that come next, and the answers that end an interview early.
          </p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-14">
        <nav aria-label="Jump to category" className="flex flex-wrap gap-2 mb-12">
          {CATEGORIES.map((c) => (
            <a
              key={c.slug}
              href={`#${c.slug}`}
              className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-white/70 hover:border-gold/50 hover:text-white transition-colors"
            >
              {c.label}
            </a>
          ))}
        </nav>

        {CATEGORIES.map((category) => {
          const items = QUESTIONS.filter((q) => q.category === category.slug)
          return (
            <section key={category.slug} id={category.slug} className="mb-14 scroll-mt-24">
              <h2 className="text-2xl font-serif font-bold text-white mb-1">{category.label}</h2>
              <p className="text-white/40 text-sm mb-6">{category.intro}</p>
              <ul className="space-y-3">
                {items.map((q) => {
                  counter += 1
                  return <QuestionCard key={q.id} question={q} number={counter} />
                })}
              </ul>
            </section>
          )
        })}

        <section className="rounded-2xl border border-gold/30 bg-gold/5 p-8 text-center">
          <h2 className="text-2xl font-serif font-bold text-white mb-2">Know the standard cold first</h2>
          <p className="text-white/60 mb-6 max-w-2xl mx-auto">
            Interviewers test depth quickly. Drill the clauses and Annex A themes untimed, then prove it with
            the free exam and a verifiable certificate for your profile.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to={PRACTICE_PATH} className="btn btn-gold">
              Practice questions <ArrowRight size={16} className="ml-2" />
            </Link>
            <Link to="/login?register=1" className="btn border border-white/20 text-white/80 hover:text-white">
              Take the free exam
            </Link>
          </div>
        </section>

        <p className="mt-10 text-xs text-white/30 leading-relaxed">
          Clause and control numbers follow ISO/IEC 27001:2022 and audit practice follows ISO 19011. The
          questions and model answers are our own and are not the text of either standard, both of which are
          copyrighted. This is preparation material, not a guarantee of interview outcome.
        </p>
      </main>
    </div>
  )
}
