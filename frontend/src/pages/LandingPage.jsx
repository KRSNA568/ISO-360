import * as Accordion from '@radix-ui/react-accordion'
import {
  ChevronDown,
  Shield,
  Lock,
  Clock,
  Globe,
  Target,
  TrendingUp,
  BadgeCheck,
  Quote,
  Search,
  FileCheck2,
  AlertTriangle,
  Briefcase,
  Users,
  Sparkles,
  QrCode,
  CheckCircle2,
  Menu,
  X,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import LandingBackground from '../components/layout/LandingBackground'

const STATS = [
  { value: '2',    label: 'Certification Levels' },
  { value: '300+', label: 'ISO 27001 Questions' },
  { value: '<30s', label: 'Certificate Verification' },
  { value: '2022', label: 'Standard Edition' },
]

const FEATURES = [
  {
    icon: Shield,
    title: 'Industry Recognized',
    body: 'Demonstrate ISO 27001 knowledge to employers, clients, and audit teams. Stand out in ISMS, compliance, and risk roles.',
    highlight: false,
  },
  {
    icon: Lock,
    title: 'Free Forever',
    body: 'Both Associate and Professional exams are completely free. No hidden fees, no subscriptions, no credit card required.',
    highlight: true,
  },
  {
    icon: Clock,
    title: 'Quick & Challenging',
    body: 'Associate: 50 questions in 15 minutes. Professional: 100 questions in 30 minutes. Timed format tests practical competence.',
    highlight: false,
  },
  {
    icon: Globe,
    title: 'Global Verification',
    body: 'Every certificate has a unique ID and public verification URL. Share it on LinkedIn and validate your achievement instantly.',
    highlight: true,
  },
  {
    icon: Target,
    title: 'Real-World Coverage',
    body: 'Questions cover clauses 4–10, risk treatment, Statement of Applicability, Annex A controls, and audit evidence handling.',
    highlight: false,
  },
  {
    icon: TrendingUp,
    title: 'Career Advancement',
    body: 'ISO 27001 skills are essential for ISMS lead, compliance analyst, internal auditor, cybersecurity, and GRC career paths.',
    highlight: false,
  },
]

const TESTIMONIALS = [
  {
    name: 'Ravi M.',
    role: 'Information Security Analyst',
    quote: "This is the first free exam that tested real ISO 27001 judgment, not just textbook memory. The timer keeps it honest.",
  },
  {
    name: 'Sara K.',
    role: 'ISMS Consultant',
    quote: 'I used the Professional track to benchmark my team. The clause and control depth is excellent and the certificate is easy to verify.',
  },
  {
    name: 'Daniel P.',
    role: 'Internal Auditor',
    quote: 'Great preparation for audit interviews. The scenario-based questions around nonconformity and corrective action are very practical.',
  },
]

const TOPICS = [
  {
    icon: Search,
    title: 'Clause 4–5 Foundations',
    body: 'Context of the organization, interested parties, scope, leadership commitment, and ISMS governance foundations.',
  },
  {
    icon: Shield,
    title: 'Risk & Treatment',
    body: 'Risk methodology, acceptance criteria, treatment planning, and selection of security controls with business context.',
  },
  {
    icon: FileCheck2,
    title: 'SoA & Annex A',
    body: 'Statement of Applicability structure, control rationale, and Annex A organizational, people, physical, and technology controls.',
  },
  {
    icon: Briefcase,
    title: 'ISMS Documentation',
    body: 'Policies, procedures, records, version control, evidence quality, and document lifecycle management.',
  },
  {
    icon: AlertTriangle,
    title: 'Monitoring & Improvement',
    body: 'Internal audits, management review, KPIs, nonconformity handling, corrective actions, and continual improvement.',
  },
  {
    icon: Users,
    title: 'Audit Execution',
    body: 'ISO 19011-aligned audit planning, evidence sampling, interview techniques, findings classification, and reporting.',
  },
]

const LEVELS = [
  {
    label: 'Associate',
    title: 'Certified ISO 27001 Associate',
    desc: 'Master ISO 27001:2022 fundamentals — clauses 4 to 10, risk assessment basics, ISMS documentation, and improvement lifecycle.',
    details: ['50 Questions', '15 Minutes', 'Passing Score: 40/50', 'Timed exam format', 'Shareable Certificate', 'Retake policy enforced'],
  },
  {
    label: 'Professional',
    title: 'Certified ISO 27001 Professional',
    desc: 'Prove advanced expertise in Annex A controls, internal audit practice, nonconformity handling, and ISMS performance governance.',
    details: ['100 Questions', '30 Minutes', 'Passing Score: 80/100', 'Timed exam format', 'Shareable Certificate', 'Retake policy enforced'],
  },
]

const FAQS = [
  {
    q: 'Is the exam and certificate completely free?',
    a: 'Yes. Both Associate and Professional exams are free to attempt. Certificates are issued at no cost upon passing.',
  },
  {
    q: 'What is the difference between Associate and Professional tracks?',
    a: 'Associate focuses on core clauses and fundamentals. Professional covers Annex A controls, audit depth, and scenario-based judgment requiring deeper ISMS experience.',
  },
  {
    q: 'What ISO 27001 areas are covered?',
    a: 'Clauses 4–10, risk treatment workflow, Statement of Applicability, and Annex A organizational, people, physical, and technological controls.',
  },
  {
    q: 'What are the passing scores?',
    a: 'Associate requires 40 out of 50 correct answers (80%). Professional requires 80 out of 100 (80%).',
  },
  {
    q: 'How does certificate verification work?',
    a: 'Each certificate has a unique ID and a public verification URL. Anyone can verify authenticity in under 30 seconds — no account needed.',
  },
  {
    q: 'Can I add this certificate to LinkedIn?',
    a: 'Yes. Add the credential ID and public verification URL directly to the Licenses & Certifications section of your LinkedIn profile.',
  },
  {
    q: 'Can I retake the exam if I fail?',
    a: 'Yes. Retakes are permitted according to the platform retake policy. You can review your performance report to identify weak areas before retrying.',
  },
  {
    q: 'How is exam integrity maintained?',
    a: 'The platform uses timed attempts, tab-switch detection, and server-side integrity checks to ensure results reflect genuine competence.',
  },
]

const AUDIENCE = [
  { role: 'Information Security Analysts & Managers',  benefit: 'Validate ISMS governance skills employers actively look for.' },
  { role: 'GRC Professionals',                         benefit: 'Demonstrate cross-domain compliance and risk alignment.' },
  { role: 'ISO 27001 Implementers & ISMS Owners',      benefit: 'Benchmark practical implementation depth against the 2022 standard.' },
  { role: 'Cybersecurity Analysts & Engineers',         benefit: 'Add a verifiable credential to your security profile.' },
  { role: 'Compliance Officers & Internal Auditors',   benefit: 'Sharpen audit evidence and nonconformity handling skills.' },
  { role: 'IT Risk Managers & CISOs',                  benefit: 'Align your team to a common ISO 27001 baseline quickly.' },
  { role: 'Business Continuity Professionals',          benefit: 'Understand information security controls that intersect with BCM.' },
  { role: 'Students in Information Security',           benefit: 'Earn a free, verifiable credential before your first role.' },
]

// ─── Components ──────────────────────────────────────────────────────────────

function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => { setOpen(false) }, [location.pathname])

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = prev }
    }
  }, [open])

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-ink/95 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-serif font-bold text-xl text-white tracking-tight">
          27001<span className="text-gold">certified</span>
          <p className="text-[10px] text-white/40 font-sans font-medium tracking-normal">ISO 27001:2022 Certification Portal</p>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-5 text-sm">
          <Link to="/blog"   className="text-white/70 hover:text-white transition-colors">Blog</Link>
          <Link to="/verify" className="text-white/70 hover:text-white transition-colors">Verify Certificate</Link>
          <Link to="/login"  className="text-white/70 hover:text-white transition-colors">Sign In</Link>
          <Link to="/login?register=1" className="btn btn-gold btn-sm">Get Started</Link>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setOpen(v => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="landing-mobile-menu"
          className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-white/80 hover:text-gold hover:bg-white/5 transition-colors"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu panel */}
      <div
        id="landing-mobile-menu"
        className={`md:hidden overflow-hidden border-t border-white/10 transition-[max-height,opacity] duration-300 ease-out ${
          open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 py-4 flex flex-col gap-1 bg-ink/95 backdrop-blur-sm">
          <Link to="/blog" className="py-3 text-white/80 hover:text-white border-b border-white/5">Blog</Link>
          <Link to="/verify" className="py-3 text-white/80 hover:text-white border-b border-white/5">Verify Certificate</Link>
          <Link to="/login" className="py-3 text-white/80 hover:text-white border-b border-white/5">Sign In</Link>
          <Link to="/login?register=1" className="btn btn-gold mt-3 w-full justify-center">Get Started</Link>
        </div>
      </div>
    </nav>
  )
}

function Hero() {
  return (
    <section className="min-h-[820px] pt-28 pb-20 px-6 text-center flex items-center">
      <div className="max-w-4xl mx-auto">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/50 px-4 py-1 text-xs text-gold mb-8">
          <Sparkles size={12} /> Free ISO 27001 Certification — 2026 Edition
        </span>

        <h1 className="text-5xl md:text-6xl font-serif font-bold text-white leading-tight">
          Prove Your <span className="text-gold">ISO 27001</span> Expertise
        </h1>

        <p className="mt-6 text-white/65 text-lg max-w-2xl mx-auto leading-relaxed">
          Rigorous, timed, integrity-monitored exams on the ISO 27001:2022 standard.
          Pass, earn a verifiable certificate, and share it anywhere — completely free.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link to="/login?register=1" className="btn btn-gold btn-lg">Start Free Certification</Link>
          <Link to="/verify" className="btn btn-outline btn-lg border-white/30 text-white hover:bg-white/10">Verify a Certificate</Link>
        </div>

        <p className="mt-8 text-sm text-white/35">No credit card · No subscription · Instant verification</p>

        {/* Quick proof strip */}
        <div className="mt-12 flex flex-wrap justify-center gap-6 text-xs text-white/45">
          <span className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-gold" /> ISO 27001:2022 aligned</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-gold" /> Publicly verifiable certificates</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-gold" /> Integrity-monitored exams</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 size={12} className="text-gold" /> LinkedIn shareable</span>
        </div>
      </div>
    </section>
  )
}

function Stats() {
  return (
    <section className="bg-white/[0.03] border-y border-white/10">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {STATS.map(({ value, label }) => (
          <div key={label}>
            <div className="text-4xl font-serif font-bold text-gold">{value}</div>
            <div className="text-sm text-white/55 mt-1">{label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

function WhatIsISO() {
  return (
    <section className="py-20 px-6 border-b border-white/10">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-serif font-bold text-white text-center mb-10">
          What is <span className="text-gold">ISO 27001:2022 Certification?</span>
        </h2>

        <div className="space-y-5 text-white/75 leading-relaxed">
          <p>
            ISO 27001:2022 certification validates your ability to establish, implement, maintain, and continually improve an
            Information Security Management System (ISMS) aligned with internationally accepted standards.
          </p>
          <p>
            Strong ISO 27001 practitioners understand <strong className="text-white">risk assessment and treatment</strong>,{' '}
            <strong className="text-white">SoA and Annex A control selection</strong>, internal audit evidence, and corrective action workflows.
          </p>
          <p>
            This platform simulates exam pressure to ensure candidates can apply concepts in real scenarios — not just recall definitions.
          </p>
        </div>
      </div>
    </section>
  )
}

function WhyCertified() {
  return (
    <section className="bg-white/[0.03] py-20 px-6 border-b border-white/10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-white">Why Get <span className="text-gold">ISO 27001 Certified?</span></h2>
          <p className="text-white/60 mt-3 max-w-2xl mx-auto">
            Organizations increasingly demand demonstrable ISMS capability across compliance, audit readiness, and security governance roles.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {FEATURES.map(({ icon: Icon, title, body, highlight }) => (
            <article
              key={title}
              className={`rounded-xl border p-5 ${
                highlight
                  ? 'border-gold/40 bg-gold/5'
                  : 'border-white/10 bg-white/5'
              }`}
            >
              <Icon size={18} className="text-gold mb-3" />
              <h3 className="text-white font-semibold mb-2">{title}</h3>
              <p className="text-sm text-white/65 leading-relaxed">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Levels() {
  return (
    <section className="py-20 px-6 border-b border-white/10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-white">Choose Your <span className="text-gold">Certification Level</span></h2>
          <p className="text-white/60 mt-3">Start with Associate to master fundamentals, then advance to Professional for deep control and audit expertise.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {LEVELS.map((l) => (
            <article key={l.label} className="rounded-xl border border-white/10 bg-white/5 p-6 flex flex-col">
              <div className="inline-flex mb-3 text-[10px] uppercase tracking-wider font-semibold text-gold border border-gold/40 rounded px-2 py-1 w-fit">
                {l.label} Level
              </div>
              <h3 className="text-2xl font-serif font-bold text-white mb-3">{l.title}</h3>
              <p className="text-sm text-white/65 mb-5">{l.desc}</p>

              <ul className="space-y-2 text-sm text-white/70 mb-6 flex-1">
                {l.details.map((d) => (
                  <li key={d} className="flex items-center gap-2">
                    <BadgeCheck size={14} className="text-gold flex-shrink-0" /> {d}
                  </li>
                ))}
              </ul>

              <Link to="/login?register=1" className="btn btn-gold w-full justify-center">Get Started Free</Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function Testimonials() {
  return (
    <section className="bg-white/[0.03] py-20 px-6 border-b border-white/10">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-serif font-bold text-white text-center mb-12">
          What Professionals <span className="text-gold">Are Saying</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t) => (
            <article key={t.name} className="rounded-xl border border-white/10 bg-white/5 p-5 flex flex-col">
              <Quote size={16} className="text-gold mb-3 flex-shrink-0" />
              <p className="text-sm text-white/70 leading-relaxed mb-4 flex-1">{t.quote}</p>
              <div className="border-t border-white/10 pt-3 mt-auto">
                <p className="text-white font-medium text-sm">{t.name}</p>
                <p className="text-white/45 text-xs mt-0.5">{t.role}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function TopicAreas() {
  return (
    <section className="py-20 px-6 border-b border-white/10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-white">Exam <span className="text-gold">Topic Areas</span></h2>
          <p className="text-white/60 mt-3">Our ISO 27001 certification exams test practical knowledge across these core ISMS domains.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {TOPICS.map(({ icon: Icon, title, body }) => (
            <article key={title} className="rounded-xl border border-white/10 bg-white/5 p-5">
              <Icon size={18} className="text-gold mb-3" />
              <h3 className="text-white font-semibold mb-2">{title}</h3>
              <p className="text-sm text-white/65 leading-relaxed">{body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function CertificatesShowcase() {
  return (
    <section className="bg-white/[0.03] py-20 px-6 border-b border-white/10">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-white">Your Certificate <span className="text-gold">Awaits</span></h2>
          <p className="text-white/60 mt-3">Pass the exam and receive an instantly downloadable, publicly verifiable digital certificate.</p>
        </div>

        {/* Certificate mockup */}
        <div className="rounded-2xl border border-gold/30 bg-gradient-to-br from-gold/10 via-white/5 to-white/[0.02] p-8 md:p-12 max-w-3xl mx-auto">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div>
              <p className="text-gold text-xs uppercase tracking-[0.25em] font-semibold mb-1">27001certified</p>
              <p className="text-white/40 text-xs">ISO 27001:2022 Certification Portal</p>
            </div>
            <div className="text-right">
              <p className="text-white/40 text-xs">Certificate ID</p>
              <p className="text-gold font-mono text-sm font-semibold mt-0.5">ISO27-2026-A-XXXXXX</p>
            </div>
          </div>

          {/* Body */}
          <div className="text-center mb-8">
            <p className="text-white/50 text-sm uppercase tracking-widest mb-3">This certifies that</p>
            <p className="text-3xl font-serif font-bold text-white mb-1">Alex Johnson</p>
            <p className="text-white/50 text-sm mb-6">has successfully demonstrated competence in</p>
            <p className="text-xl font-serif font-semibold text-gold">Certified ISO 27001 Associate</p>
            <p className="text-white/45 text-xs mt-2">ISO 27001:2022 Information Security Management Systems</p>
          </div>

          {/* Footer row */}
          <div className="flex items-center justify-between pt-6 border-t border-white/10">
            <div>
              <p className="text-white/40 text-xs">Awarded On</p>
              <p className="text-white text-sm font-medium mt-0.5">22 February 2026</p>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
              <QrCode size={28} className="text-gold" />
              <div>
                <p className="text-white/40 text-[10px] uppercase tracking-wider">Verify at</p>
                <p className="text-white text-xs font-medium">27001certified.in/verify</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white/40 text-xs">Status</p>
              <p className="text-green-400 text-sm font-medium mt-0.5 flex items-center gap-1 justify-end">
                <CheckCircle2 size={12} /> Valid
              </p>
            </div>
          </div>
        </div>

        {/* Below mockup */}
        <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-white/50">
          <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-gold" /> Landscape + square formats</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-gold" /> Publicly verifiable by QR or URL</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-gold" /> LinkedIn-ready credential ID</span>
        </div>
      </div>
    </section>
  )
}

function Audience() {
  return (
    <section className="py-20 border-b border-white/10 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-serif font-bold text-white text-center mb-10">
          Who Should Get <span className="text-gold">ISO 27001 Certified?</span>
        </h2>
        <div className="grid md:grid-cols-2 gap-3">
          {AUDIENCE.map(({ role, benefit }) => (
            <div key={role} className="rounded-lg border border-white/10 bg-white/5 px-5 py-4">
              <p className="text-white text-sm font-medium mb-0.5">{role}</p>
              <p className="text-white/50 text-xs">{benefit}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function BlogSection() {
  return (
    <section className="bg-white/[0.03] py-20 px-6 border-b border-white/10">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-4xl font-serif font-bold text-white">Latest from Our <span className="text-gold">Blog</span></h2>
        <p className="text-white/60 mt-3 mb-10">Practical guides, implementation patterns, and audit readiness tips for ISO 27001.</p>

        <article className="rounded-xl border border-white/10 bg-white/5 p-6 text-left max-w-3xl mx-auto hover:border-white/20 transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs text-gold border border-gold/40 rounded px-2 py-0.5 uppercase tracking-wider">Guide</span>
            <span className="text-xs text-white/35">5 min read</span>
          </div>
          <h3 className="text-white text-lg font-semibold mb-2">What is ISO 27001:2022? A Practical Guide for ISMS Teams</h3>
          <p className="text-sm text-white/60 mb-4 leading-relaxed">
            A practical walkthrough of ISO 27001 clauses, risk treatment workflow, Statement of Applicability, and internal audit readiness.
          </p>
          <Link to="/blog" className="text-gold text-sm font-medium hover:underline">Read Article →</Link>
        </article>

        <Link to="/blog" className="inline-block mt-6 text-white/50 text-sm hover:text-white transition-colors">View All Articles →</Link>
      </div>
    </section>
  )
}

function Faq() {
  return (
    <section className="py-20 px-6 border-b border-white/10">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-serif font-bold text-white text-center mb-10">
          Frequently Asked <span className="text-gold">Questions</span>
        </h2>

        <Accordion.Root type="single" collapsible className="space-y-2">
          {FAQS.map((item, i) => (
            <Accordion.Item key={item.q} value={String(i)} className="rounded-lg border border-white/10 bg-white/5 overflow-hidden">
              <Accordion.Header>
                <Accordion.Trigger className="group w-full px-5 py-4 flex items-center justify-between text-left text-sm font-medium text-white hover:text-gold transition-colors">
                  {item.q}
                  <ChevronDown size={16} className="text-white/45 transition-transform flex-shrink-0 ml-4 group-data-[state=open]:rotate-180" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="px-5 pb-4 text-sm text-white/60 leading-relaxed">
                {item.a}
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </div>
    </section>
  )
}

function FinalCta() {
  return (
    <section className="bg-white/[0.03] py-20 px-6">
      <div className="max-w-3xl mx-auto rounded-2xl border border-gold/25 bg-gradient-to-b from-gold/10 to-white/[0.03] p-10 text-center">
        <h2 className="text-4xl font-serif font-bold text-white mb-4">
          Ready to Prove Your <span className="text-gold">ISO 27001 Expertise?</span>
        </h2>
        <p className="text-white/60 mb-8 leading-relaxed">
          Join professionals using 27001certified to validate practical ISMS capability
          and showcase it with a publicly verifiable certificate — completely free.
        </p>
        <Link to="/login?register=1" className="btn btn-gold btn-lg">Create Free Account</Link>
        <p className="mt-4 text-xs text-white/30">No credit card · Both tracks free · Instant certificate on pass</p>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-t border-white/10 py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-white/35">© {new Date().getFullYear()} 27001certified. All rights reserved.</p>
        <div className="flex flex-wrap justify-center gap-5 text-xs text-white/40">
          <Link to="/privacy"  className="hover:text-white/70 transition-colors">Privacy Policy</Link>
          <Link to="/terms"    className="hover:text-white/70 transition-colors">Terms of Service</Link>
          <Link to="/verify"   className="hover:text-white/70 transition-colors">Verify Certificate</Link>
          <Link to="/blog"     className="hover:text-white/70 transition-colors">Blog</Link>
          <a href="mailto:support@27001certified.in" className="hover:text-white/70 transition-colors">Support</a>
        </div>
      </div>
    </footer>
  )
}

export default function LandingPage() {
  return (
    <div className="relative z-0 min-h-screen">
      <LandingBackground />
      <Navbar />
      <Hero />
      <Stats />
      <WhatIsISO />
      <WhyCertified />
      <Levels />
      <Testimonials />
      <TopicAreas />
      <CertificatesShowcase />
      <Audience />
      <BlogSection />
      <Faq />
      <FinalCta />
      <Footer />
    </div>
  )
}
