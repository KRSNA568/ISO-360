import { useState } from 'react'
import { Link } from 'react-router-dom'
import * as Accordion from '@radix-ui/react-accordion'
import { ChevronDown, Shield, Zap, Award, Clock, Brain, CheckCircle2, Lock } from 'lucide-react'
import { cn } from '@/lib/cn'

// ─── Data ────────────────────────────────────────────────────────────────────

const STATS = [
  { value: '50–100', label: 'Questions Per Exam' },
  { value: '15–30',  label: 'Minutes on the Clock' },
  { value: '80%',    label: 'Pass Threshold' },
  { value: '100%',   label: 'Free Forever' },
]

const TRACKS = [
  {
    slug:      'associate',
    level:     'Level 1',
    name:      'Associate',
    full:      'ISMS Foundation',
    questions: 50,
    time:      '15 min',
    desc:  'Master the ISO 27001:2022 management system framework — clauses 4 through 10, risk methodology, and leadership requirements.',
    topics: ['Clause 4 – Context', 'Clause 6 – Risk Assessment', 'Clause 9 – Internal Audit', 'Clause 10 – Improvement'],
    color: 'from-blue-900 to-blue-800',
    badge: 'bg-blue-500/20 text-blue-300',
  },
  {
    slug:      'professional',
    level:     'Level 2',
    name:      'Professional',
    full:      'Lead Auditor',
    questions: 100,
    time:      '30 min',
    desc:  'Demonstrate practical mastery of Annex A controls, ISO 19011 audit principles, and real-world non-conformity scenarios.',
    topics: ['Annex A Controls (5-8)', 'ISO 19011 Audit Methodology', 'Non-conformity Identification', 'Audit Evidence & Reporting'],
    color: 'from-amber-900 to-amber-800',
    badge: 'bg-gold/20 text-gold-light',
  },
]

const STEPS = [
  { icon: Shield, step: '01', title: 'Register & Verify',    body: 'Create a free account. We verify your email with a one-time code — no bots, no ghost accounts.' },
  { icon: Brain,  step: '02', title: 'Start Your Exam',      body: 'Select a track. A unique exam is drawn from our question bank — never the same exam twice.' },
  { icon: Award,  step: '03', title: 'Pass & Get Certified', body: 'Score 80% or higher. Receive a verifiable digital certificate with a unique ID and QR code.' },
]

const FAQS = [
  { q: 'Is this certification free?', a: 'Yes, completely free. No hidden fees, no premium tier required for the exam or certificate.' },
  { q: 'How is cheating prevented?', a: 'Every exam draws uniquely from our question bank — no two exams are identical. Combined with a global countdown timer, copy/paste blocking, and tab-switch detection, the format rewards genuine knowledge over last-minute searching.' },
  { q: 'How long is the exam?', a: 'Associate: 50 questions, 15 minutes. Professional: 100 questions, 30 minutes. The clock runs continuously from the moment you start — unanswered questions at time-out count as incorrect.' },
  { q: 'What does the certificate look like?', a: 'A 1920×1080 landscape and 1080×1080 square branded credential. Each certificate carries a unique ISO27-2026-XXXXXXXX ID and a QR code that anyone can scan to verify authenticity instantly.' },
  { q: 'How many attempts do I get?', a: 'Unlimited. You can retake after a 24-hour cooldown. Each attempt draws an entirely new set of questions.' },
  { q: 'Which track should I start with?', a: 'If you are new to ISO 27001, start with Associate (Clauses 4–10). If you have implementation experience and want a Lead Auditor credential, go straight to Professional.' },
]

// ─── Components ──────────────────────────────────────────────────────────────

function Navbar() {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-ink/95 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <span className="font-serif font-bold text-xl text-white tracking-tight">
          ISO-Audit<span className="text-gold">360</span>
        </span>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm text-white/70 hover:text-white transition-colors">
            Sign In
          </Link>
          <Link to="/login?register=1" className="btn btn-gold btn-sm">
            Get Certified →
          </Link>
        </div>
      </div>
    </nav>
  )
}

function Hero() {
  return (
    <section className="min-h-screen bg-ink flex flex-col items-center justify-center text-center px-6 pt-16">
      <div className="max-w-4xl mx-auto">
        <span className="overline mb-6 inline-block">ISO 27001:2022 · Integrity-Checked · Free Certification</span>

        <h1 className="text-hero font-serif font-bold text-white mt-4 leading-none">
          The Certification<br />
          <span className="text-gold">You Can't Cheat</span>
        </h1>

        <p className="text-xl text-white/60 mt-6 max-w-2xl mx-auto leading-relaxed">
          AI-Powered Results . 15-second per-question timer. No two attempts are identical.
          The ISO 27001:2022 credential that actually means something.
        </p>

        <div className="flex flex-wrap gap-4 justify-center mt-10">
          <Link to="/login?register=1" className="btn btn-gold btn-lg">
            Verify Identity &amp; Start Audit →
          </Link>
          <a href="#how-it-works" className="btn btn-outline btn-lg border-white/30 text-white hover:bg-white/10">
            How It Works
          </a>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap gap-6 justify-center mt-12 text-white/40 text-sm">
          {[
            { icon: Lock,         text: 'Email-verified accounts only' },
            { icon: Zap,          text: '15-second per-question timer' },
            { icon: CheckCircle2, text: 'Unique exam every attempt' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2">
              <Icon size={14} className="text-gold/60" />
              {text}
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 flex flex-col items-center gap-2 text-white/20 text-xs">
        <span>scroll</span>
        <ChevronDown size={14} className="animate-bounce" />
      </div>
    </section>
  )
}

function Stats() {
  return (
    <section className="bg-white border-y border-border">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {STATS.map(({ value, label }) => (
          <div key={label}>
            <div className="text-4xl font-serif font-bold text-ink">{value}</div>
            <div className="text-sm text-ink-muted mt-1 font-medium">{label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-surface py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="overline">Process</span>
          <h2 className="text-display font-serif font-bold text-ink mt-2">How It Works</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {STEPS.map(({ icon: Icon, step, title, body }) => (
            <div key={step} className="relative">
              {/* Connector line */}
              <div className="hidden md:block absolute top-6 left-[calc(50%+2rem)] right-[-calc(50%-2rem)] h-px bg-border" />

              <div className="card text-center">
                <div className="w-12 h-12 rounded-full bg-ink flex items-center justify-center mx-auto mb-4">
                  <Icon size={20} className="text-gold" />
                </div>
                <div className="overline mb-2">{step}</div>
                <h3 className="text-lg font-semibold text-ink mb-2">{title}</h3>
                <p className="text-sm text-ink-muted leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Tracks() {
  return (
    <section className="bg-white py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <span className="overline">Curriculum</span>
          <h2 className="text-display font-serif font-bold text-ink mt-2">Choose Your Track</h2>
          <p className="text-ink-muted mt-3 max-w-xl mx-auto">
            Associate: 50 questions in 15 minutes. Professional: 100 questions in 30 minutes. One credential worth sharing.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {TRACKS.map((t) => (
            <div key={t.slug} className={cn('rounded-xl bg-gradient-to-br p-px', t.color)}>
              <div className="bg-ink rounded-xl p-8 h-full flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <span className={cn('text-xs font-bold tracking-widest uppercase px-2.5 py-1 rounded-sm', t.badge)}>
                    {t.level}
                  </span>
                  <div className="flex items-center gap-1 text-white/40 text-xs">
                    <Clock size={12} />
                    <span>{t.questions}Q · {t.time}</span>
                  </div>
                </div>

                <h3 className="text-2xl font-serif font-bold text-white">{t.name}</h3>
                <p className="text-gold text-sm font-medium mb-3">{t.full}</p>
                <p className="text-white/60 text-sm leading-relaxed mb-6">{t.desc}</p>

                <ul className="space-y-2 mb-8 flex-1">
                  {t.topics.map(topic => (
                    <li key={topic} className="flex items-center gap-2 text-sm text-white/70">
                      <CheckCircle2 size={13} className="text-gold/70 flex-shrink-0" />
                      {topic}
                    </li>
                  ))}
                </ul>

                <Link to="/login?register=1" className="btn btn-gold btn-md w-full justify-center">
                  Start {t.name} Track →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Faq() {
  return (
    <section className="bg-surface py-24 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <span className="overline">FAQ</span>
          <h2 className="text-display font-serif font-bold text-ink mt-2">Common Questions</h2>
        </div>

        <Accordion.Root type="single" collapsible className="space-y-2">
          {FAQS.map(({ q, a }, i) => (
            <Accordion.Item key={i} value={String(i)} className="card p-0 overflow-hidden">
              <Accordion.Header>
                <Accordion.Trigger className="group flex w-full items-center justify-between px-5 py-4 text-left text-sm font-semibold text-ink hover:text-gold transition-colors">
                  {q}
                  <ChevronDown
                    size={16}
                    className="text-ink-muted group-data-[state=open]:rotate-180 transition-transform duration-200 flex-shrink-0 ml-3"
                  />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="data-[state=open]:animate-fade-up overflow-hidden">
                <p className="px-5 pb-4 text-sm text-ink-muted leading-relaxed">{a}</p>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-ink border-t border-white/10 py-10 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="font-serif font-bold text-white">
          ISO-Audit<span className="text-gold">360</span>
        </span>
        <p className="text-white/30 text-xs text-center">
          Not affiliated with ISO or BSI. This credential is issued by ISO-Audit360 as proof of exam performance.
        </p>
        <div className="flex gap-6 text-white/40 text-xs">
          <Link to="/privacy" className="hover:text-white/70 transition-colors">Privacy</Link>
          <Link to="/terms" className="hover:text-white/70 transition-colors">Terms</Link>
          <Link to="/login" className="hover:text-white/70 transition-colors">Sign In</Link>
        </div>
      </div>
    </footer>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Stats />
      <HowItWorks />
      <Tracks />
      <Faq />
      <Footer />
    </div>
  )
}

