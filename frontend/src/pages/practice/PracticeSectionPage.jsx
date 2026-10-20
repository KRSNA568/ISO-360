import { ArrowLeft, ArrowRight, BookOpen, Check, RotateCcw, X } from 'lucide-react'
import { useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'

import { ContentNavbar } from '@/components/layout/ContentNavbar'
import { SECTIONS } from '@/data/practice'
import { PRACTICE_PATH, sectionPath, sectionQuestions, sectionSeo } from '@/lib/practicePages'
import { useSeo } from '@/lib/seo'

const LETTERS = ['A', 'B', 'C', 'D']

function Option({ letter, text, state, onSelect, disabled }) {
  const base = 'w-full text-left flex gap-3 rounded-xl border px-4 py-3 transition-colors'
  const styles = {
    idle:     'border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.06]',
    picked:   'border-gold/60 bg-gold/10',
    correct:  'border-emerald-400/60 bg-emerald-400/10',
    wrong:    'border-rose-400/60 bg-rose-400/10',
    muted:    'border-white/10 bg-white/[0.02] opacity-60',
  }
  const note = { correct: 'Correct answer', wrong: 'Your answer', picked: 'Selected' }[state]

  return (
    <li>
      <button type="button" onClick={onSelect} disabled={disabled} className={`${base} ${styles[state]}`}>
        <span className="font-mono text-sm text-gold shrink-0 pt-0.5">{letter}</span>
        <span className="flex-1 text-white/85 text-sm leading-relaxed">{text}</span>
        {state === 'correct' && <Check size={16} className="text-emerald-400 shrink-0 mt-0.5" aria-hidden />}
        {state === 'wrong' && <X size={16} className="text-rose-400 shrink-0 mt-0.5" aria-hidden />}
        {note && <span className="sr-only">{note}</span>}
      </button>
    </li>
  )
}

function Drill({ section }) {
  useSeo(sectionSeo(section))

  const questions = sectionQuestions(section.slug)
  const [index, setIndex]       = useState(0)
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [answers, setAnswers]   = useState([])

  const question = questions[index]
  const isLast   = index === questions.length - 1
  const done     = answers.length === questions.length && revealed && isLast
  const score    = answers.filter(Boolean).length

  const sectionIndex = SECTIONS.indexOf(section)
  const nextSection  = SECTIONS[sectionIndex + 1]

  function reveal() {
    if (selected === null || revealed) {return}
    setRevealed(true)
    setAnswers((prev) => [...prev, selected === question.correct])
  }

  function next() {
    setIndex((i) => i + 1)
    setSelected(null)
    setRevealed(false)
  }

  function restart() {
    setIndex(0)
    setSelected(null)
    setRevealed(false)
    setAnswers([])
  }

  function optionState(i) {
    if (!revealed) {return selected === i ? 'picked' : 'idle'}
    if (i === question.correct) {return 'correct'}
    if (i === selected) {return 'wrong'}
    return 'muted'
  }

  return (
    <div className="min-h-screen bg-ink">
      <ContentNavbar />

      <main className="pt-28 pb-20 px-6 max-w-3xl mx-auto">
        <nav aria-label="Breadcrumb" className="text-xs text-white/40 mb-8 flex flex-wrap items-center gap-2">
          <Link to={PRACTICE_PATH} className="hover:text-gold transition-colors">Practice</Link>
          <span>/</span>
          <span className="text-white/60">{section.short}</span>
        </nav>

        <header className="mb-8 border-b border-white/10 pb-7">
          <h1 className="text-2xl md:text-3xl font-serif font-bold text-white leading-tight mb-3">
            {section.label}
          </h1>
          <p className="text-white/60 leading-relaxed mb-4">{section.intro}</p>
          <p className="text-xs text-white/40">
            {questions.length} questions · untimed · no certificate ·{' '}
            <Link to={section.library} className="text-gold/80 hover:text-gold hover:underline">
              read the reference guide
            </Link>
          </p>
        </header>

        {/* Progress */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-gold transition-[width] duration-300"
              style={{ width: `${(answers.length / questions.length) * 100}%` }}
            />
          </div>
          <span className="font-mono text-xs text-white/50 shrink-0">
            {index + 1} / {questions.length}
          </span>
        </div>

        <article className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 mb-6">
          <h2 className="text-lg text-white leading-relaxed mb-5">{question.stem}</h2>

          <ul className="space-y-2.5 mb-5">
            {question.options.map((text, i) => (
              <Option
                key={text}
                letter={LETTERS[i]}
                text={text}
                state={optionState(i)}
                onSelect={() => setSelected(i)}
                disabled={revealed}
              />
            ))}
          </ul>

          {revealed && (
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5" role="status">
              <p className={`text-sm font-semibold mb-2 ${selected === question.correct ? 'text-emerald-400' : 'text-rose-400'}`}>
                {selected === question.correct ? 'Correct' : `Not quite — the answer is ${LETTERS[question.correct]}`}
              </p>
              <p className="text-white/70 text-sm leading-relaxed">{question.explanation}</p>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 mt-6">
            {!revealed && (
              <button type="button" onClick={reveal} disabled={selected === null} className="btn btn-gold btn-sm disabled:opacity-40">
                Check answer
              </button>
            )}
            {revealed && !isLast && (
              <button type="button" onClick={next} className="btn btn-gold btn-sm">
                Next question <ArrowRight size={15} className="ml-2" />
              </button>
            )}
            {revealed && (
              <button
                type="button"
                onClick={restart}
                className="btn btn-sm border border-white/20 text-white/70 hover:text-white"
              >
                <RotateCcw size={14} className="mr-2" /> Start over
              </button>
            )}
            {!revealed && selected === null && (
              <span className="text-xs text-white/35">Pick an option to check it.</span>
            )}
          </div>
        </article>

        {done && (
          <section className="rounded-2xl border border-gold/30 bg-gold/5 p-7 mb-8 text-center">
            <h2 className="text-xl font-serif font-bold text-white mb-2">
              {score} of {questions.length} on {section.short}
            </h2>
            <p className="text-white/60 text-sm mb-5">
              {score === questions.length
                ? 'Every one. Try another section, or sit the real exam.'
                : 'Re-read the explanations you missed, then run the section again — the reasoning matters more than the score.'}
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <button type="button" onClick={restart} className="btn btn-sm border border-white/20 text-white/80 hover:text-white">
                <RotateCcw size={14} className="mr-2" /> Run it again
              </button>
              {nextSection && (
                <Link to={sectionPath(nextSection)} className="btn btn-gold btn-sm">
                  Next: {nextSection.short} <ArrowRight size={15} className="ml-2" />
                </Link>
              )}
              <Link to="/login?register=1" className="btn btn-gold btn-sm">Take the free exam</Link>
            </div>
          </section>
        )}

        <nav aria-label="Section navigation" className="flex flex-wrap justify-between gap-4 border-t border-white/10 pt-8 text-sm">
          <Link to={PRACTICE_PATH} className="flex items-center gap-2 text-white/60 hover:text-gold transition-colors">
            <ArrowLeft size={16} /> All sections
          </Link>
          <Link to={section.library} className="flex items-center gap-2 text-white/60 hover:text-gold transition-colors">
            <BookOpen size={16} /> Reference guide for this section
          </Link>
        </nav>

        <p className="mt-10 text-xs text-white/30 leading-relaxed">
          Clause and control numbers follow ISO/IEC 27001:2022. The questions and explanations are our own, not
          the text of the standard, which is copyrighted. These drills share no questions with the exam bank.
        </p>
      </main>
    </div>
  )
}

export default function PracticeSectionPage() {
  const { section: slug } = useParams()
  const section = SECTIONS.find((s) => s.slug === slug)
  if (!section) {return <Navigate to={PRACTICE_PATH} replace />}
  // Keyed so drill state resets cleanly when navigating between sections
  return <Drill key={section.slug} section={section} />
}
