import { ArrowRight, BookOpen, Infinity as InfinityIcon, MessageSquareText } from 'lucide-react'
import { Link } from 'react-router-dom'

import { ContentNavbar } from '@/components/layout/ContentNavbar'
import { INTERVIEW_PATH } from '@/data/interviewPrep'
import { QUESTIONS, SECTIONS } from '@/data/practice'
import { practiceIndexSeo, sectionPath, sectionQuestions } from '@/lib/practicePages'
import { useSeo } from '@/lib/seo'

const PROMISES = [
  { icon: InfinityIcon, title: 'Untimed', body: 'No clock, no tab tracking, no submit button. Take as long as you like on a question and come back to it.' },
  { icon: BookOpen, title: 'Explained', body: 'Every answer comes with the reasoning — why the right option is right and why the plausible one is not.' },
  { icon: MessageSquareText, title: 'No certificate', body: 'This is practice. Nothing is recorded, nothing is scored against you, and nothing here appears in the exam.' },
]

export default function PracticeIndexPage() {
  useSeo(practiceIndexSeo())

  const clauseSections = SECTIONS.filter((s) => s.slug.startsWith('clause-'))
  const annexSections  = SECTIONS.filter((s) => s.slug.startsWith('annex-a-'))

  const group = (title, blurb, sections) => (
    <section className="mb-12">
      <h2 className="text-2xl font-serif font-bold text-white mb-1">{title}</h2>
      <p className="text-white/40 text-sm mb-6">{blurb}</p>
      <ul className="grid sm:grid-cols-2 gap-3">
        {sections.map((s) => (
          <li key={s.slug}>
            <Link
              to={sectionPath(s)}
              className="group flex h-full flex-col rounded-xl border border-white/10 bg-white/[0.03] p-5 hover:border-gold/50 hover:bg-white/[0.06] transition-colors"
            >
              <div className="flex items-baseline justify-between gap-3 mb-2">
                <span className="text-white font-semibold group-hover:text-gold transition-colors">{s.label}</span>
                <span className="font-mono text-xs text-gold shrink-0">{sectionQuestions(s.slug).length}</span>
              </div>
              <span className="text-white/55 text-sm leading-relaxed">{s.intro}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )

  return (
    <div className="min-h-screen bg-ink">
      <ContentNavbar />

      <header className="pt-32 pb-14 px-6 text-center border-b border-white/10">
        <div className="max-w-3xl mx-auto">
          <span className="inline-flex items-center rounded-full border border-gold/50 px-4 py-1 text-xs text-gold mb-6 uppercase tracking-widest font-semibold">
            Free practice — no signup
          </span>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white leading-tight mb-5">
            ISO 27001 practice questions
          </h1>
          <p className="text-white/60 text-lg leading-relaxed">
            {QUESTIONS.length} questions across {SECTIONS.length} sections, untimed and fully explained. Drill one
            section at a time until the reasoning is second nature, then sit the real exam when you are ready.
          </p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-14">
        <ul className="grid sm:grid-cols-3 gap-4 mb-14">
          {PROMISES.map(({ icon: Icon, title, body }) => (
            <li key={title} className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
              <Icon size={18} className="text-gold mb-3" />
              <p className="text-white font-semibold text-sm mb-1">{title}</p>
              <p className="text-white/55 text-sm leading-relaxed">{body}</p>
            </li>
          ))}
        </ul>

        {group(
          'Management system clauses',
          'Clauses 4 to 10 — the requirements the ISMS itself is audited against.',
          clauseSections,
        )}
        {group(
          'Annex A control themes',
          'The four themes of the 2022 revision, sampled the way an auditor would.',
          annexSections,
        )}

        <section className="mb-12 rounded-2xl border border-white/10 bg-white/[0.02] p-8">
          <h2 className="text-xl font-serif font-bold text-white mb-3 flex items-center gap-2">
            <MessageSquareText size={20} className="text-gold" /> Interviewing for an auditor role?
          </h2>
          <p className="text-white/60 leading-relaxed mb-5">
            We also keep a separate set of lead auditor interview questions — what the interviewer is really
            testing with each one, a model answer, the follow-ups that usually come next, and the answers that
            end an interview early.
          </p>
          <Link to={INTERVIEW_PATH} className="btn btn-gold btn-sm">
            Lead auditor interview prep <ArrowRight size={15} className="ml-2" />
          </Link>
        </section>

        <section className="rounded-2xl border border-gold/30 bg-gold/5 p-8 text-center">
          <h2 className="text-2xl font-serif font-bold text-white mb-2">Ready for the real thing?</h2>
          <p className="text-white/60 mb-6 max-w-2xl mx-auto">
            The exam is timed and drawn from a separate bank — nothing you have practised here appears in it.
            Pass and you get a verifiable certificate.
          </p>
          <Link to="/login?register=1" className="btn btn-gold">
            Take the free exam <ArrowRight size={16} className="ml-2" />
          </Link>
        </section>

        <p className="mt-10 text-xs text-white/30 leading-relaxed">
          Clause and control numbers follow ISO/IEC 27001:2022. The questions and explanations are our own and
          are not the text of the standard, which is copyrighted. These drills are study material, not
          certification advice, and they share no questions with the exam bank.
        </p>
      </main>
    </div>
  )
}
