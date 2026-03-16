import { Link } from 'react-router-dom'
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
} from 'lucide-react'

const STATS = [
  { value: '2', label: 'Certification Levels' },
  { value: '300+', label: 'ISO 27001 Questions' },
  { value: '100%', label: 'Free Forever' },
  { value: '2022', label: 'Standard Edition' },
]

const FEATURES = [
  {
    icon: Shield,
    title: 'Industry Recognized',
    body: 'Demonstrate ISO 27001 knowledge to employers, clients, and audit teams. Stand out in ISMS, compliance, and risk roles.',
  },
  {
    icon: Lock,
    title: 'Free Forever',
    body: 'Both Beginner and Professional exams are completely free. No hidden fees, no subscriptions.',
  },
  {
    icon: Clock,
    title: 'Quick & Challenging',
    body: 'Associate: 50 questions in 15 minutes. Professional: 100 questions in 30 minutes. Timed format tests practical competence.',
  },
  {
    icon: Globe,
    title: 'Global Verification',
    body: 'Every certificate has a unique ID and public verification URL. Share it on LinkedIn and validate your achievement instantly.',
  },
  {
    icon: Target,
    title: 'Real-World Coverage',
    body: 'Questions cover clauses 4–10, risk treatment, Statement of Applicability, Annex A controls, and audit evidence handling.',
  },
  {
    icon: TrendingUp,
    title: 'Career Advancement',
    body: 'ISO 27001 skills are essential for ISMS lead, compliance analyst, internal auditor, cybersecurity, and GRC career paths.',
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
  'What is ISO 27001:2022 certification and who is it for?',
  'What is the difference between Associate and Professional tracks?',
  'How do I get ISO 27001 certified for free on this platform?',
  'Which ISO 27001 clauses and control areas are covered?',
  'What is the passing score for each exam?',
  'How is exam integrity enforced during attempts?',
  'Is this certificate recognized by employers?',
  'How can someone verify my certificate?',
  'Can I add this certificate to LinkedIn?',
  'How often is the question bank updated?',
  'Can I retake the exam if I fail?',
  'Is there any fee for exam or certificate issuance?',
  'Do I need work experience before attempting Professional track?',
  'What is included in the exam performance report?',
  'Can organizations use this platform to benchmark teams?',
  'How do I contact support for exam or account issues?',
]

const AUDIENCE = [
  'Information Security Analysts & Managers',
  'GRC (Governance, Risk & Compliance) Professionals',
  'ISO 27001 Implementers & ISMS Owners',
  'Cybersecurity Analysts, Engineers & Architects',
  'Compliance Officers & Auditors',
  'IT Risk Managers, Heads of Security & CISOs',
  'Business Continuity Professionals',
  'Students pursuing careers in Information Security',
]

function Navbar() {
  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-ink/95 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-serif font-bold text-xl text-white tracking-tight">
          ISO-Audit<span className="text-gold">360</span>
          <p className="text-[10px] text-white/40 font-sans font-medium tracking-normal">ISO 27001:2022 Certification Portal</p>
        </Link>

        <div className="flex items-center gap-5 text-sm">
          <Link to="/blog" className="text-white/70 hover:text-white transition-colors">Blog</Link>
          <Link to="/verify" className="text-white/70 hover:text-white transition-colors">Verify Certificate</Link>
          <Link to="/login" className="text-white/70 hover:text-white transition-colors">Sign In</Link>
          <Link to="/login?register=1" className="btn btn-gold btn-sm">Get Started</Link>
        </div>
      </div>
    </nav>
  )
}

function Hero() {
  return (
    <section className="min-h-[820px] bg-ink pt-28 pb-20 px-6 text-center flex items-center">
      <div className="max-w-4xl mx-auto">
        <span className="inline-flex items-center rounded-full border border-gold/50 px-4 py-1 text-xs text-gold mb-6">
          ⭐ Free Certification — 2026
        </span>

        <h1 className="text-5xl md:text-6xl font-serif font-bold text-white leading-tight">
          Become an <span className="text-gold">ISO 27001 Professional</span>
        </h1>

        <p className="mt-5 text-gold uppercase text-xs tracking-[0.2em]">Integrity-Checked ISO 27001 Certification</p>

        <h2 className="mt-5 text-3xl md:text-4xl font-serif font-bold text-white">Think You Know ISO 27001?</h2>

        <p className="mt-6 text-white/70 max-w-3xl mx-auto leading-relaxed">
          A free but rigorous ISO 27001:2022 exam portal. Associate track: 50 questions in 15 minutes. Professional track:
          100 questions in 30 minutes. Timed, integrity-monitored, and built to test real ISMS understanding.
        </p>

        <p className="mt-5 text-lg text-white font-semibold">Are you ready to validate your ISMS expertise?</p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/login?register=1" className="btn btn-gold btn-lg">Start Certification</Link>
          <Link to="/verify" className="btn btn-outline btn-lg border-white/30 text-white hover:bg-white/10">Verify Certificate</Link>
        </div>

        <p className="mt-8 text-sm text-white/40">No credit card required · 100% Free · Instant verification</p>
      </div>
    </section>
  )
}

function Stats() {
  return (
    <section className="bg-ink border-y border-white/10">
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

function WhatIsTprm() {
  return (
    <section className="bg-ink py-20 px-6 border-b border-white/10">
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
            Strong ISO 27001 practitioners understand <strong className="text-white">risk assessment and treatment</strong>,
            <strong className="text-white"> SoA and Annex A control selection</strong>, internal audit evidence, and corrective action workflows.
          </p>
          <p>
            This platform simulates exam pressure to ensure candidates can apply concepts in scenarios — not just recall definitions.
          </p>
        </div>
      </div>
    </section>
  )
}

function WhyCertified() {
  return (
    <section className="bg-ink py-20 px-6 border-b border-white/10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-serif font-bold text-white">Why Get <span className="text-gold">ISO 27001 Certified?</span></h2>
          <p className="text-white/60 mt-3 max-w-2xl mx-auto">
            Organizations increasingly demand demonstrable ISMS capability across compliance, audit readiness, and security governance roles.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {FEATURES.map(({ icon: Icon, title, body }) => (
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

function Testimonials() {
  return (
    <section className="bg-ink py-20 px-6 border-b border-white/10">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-serif font-bold text-white text-center mb-10">Why Teams Choose <span className="text-gold">ISO-Audit360</span></h2>

        <div className="grid md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t) => (
            <article key={t.name} className="rounded-xl border border-white/10 bg-white/5 p-5">
              <Quote size={16} className="text-gold mb-3" />
              <p className="text-sm text-white/70 leading-relaxed mb-4">{t.quote}</p>
              <p className="text-white font-medium text-sm">{t.name}</p>
              <p className="text-white/45 text-xs">{t.role}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function TopicAreas() {
  return (
    <section className="bg-ink py-20 px-6 border-b border-white/10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
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

function Levels() {
  return (
    <section className="bg-ink py-20 px-6 border-b border-white/10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
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
                    <BadgeCheck size={14} className="text-gold" /> {d}
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

function CertificatesShowcase() {
  return (
    <section className="bg-ink py-20 px-6 border-b border-white/10">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-serif font-bold text-white">Your Certificate <span className="text-gold">Awaits</span></h2>
          <p className="text-white/60 mt-3">Pass the exam and receive an instantly downloadable, premium digital certificate.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <article className="rounded-xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-gold mb-4">Certificate of Achievement</p>
            <h3 className="text-white font-semibold mb-2">Issued to: Kevin De</h3>
            <p className="text-sm text-white/65">Certified ISO 27001 Associate</p>
            <p className="text-xs text-white/45 mt-3">Certification ID: ISO27-2026-A-SAMPLE1</p>
            <p className="text-xs text-white/45">Awarded On: 22 February 2026</p>
          </article>

          <article className="rounded-xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-[0.2em] text-gold mb-4">Integrity-Checked ISO 27001 Certification</p>
            <h3 className="text-white font-semibold mb-2">Issued to: Jane Smith</h3>
            <p className="text-sm text-white/65">Certified ISO 27001 Professional</p>
            <p className="text-xs text-white/45 mt-3">Certification ID: ISO27-2026-P-SAMPLE1</p>
            <p className="text-xs text-white/45">Awarded On: 22 February 2026</p>
          </article>
        </div>
      </div>
    </section>
  )
}

function MockInterview() {
  return (
    <section className="bg-ink py-20 px-6 border-b border-white/10 text-center">
      <div className="max-w-3xl mx-auto">
        <span className="inline-block text-xs text-gold border border-gold/40 rounded-full px-3 py-1 mb-5">New for 2026</span>
        <h2 className="text-4xl font-serif font-bold text-white mb-4">ISO 27001 <span className="text-gold">Interview Prep</span> Questions</h2>
        <p className="text-white/65 mb-8">Practice practical ISO 27001 scenarios used by recruiters, audit managers, and consulting interviews.</p>

        <div className="flex flex-wrap justify-center gap-3">
          <Link to="/mock-interview" className="btn btn-gold">Browse Interview Questions</Link>
          <Link to="/mock-exam" className="btn btn-outline border-white/30 text-white hover:bg-white/10">Take Mock Exam</Link>
        </div>
      </div>
    </section>
  )
}

function Audience() {
  return (
    <section className="bg-ink py-20 px-6 border-b border-white/10">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-serif font-bold text-white text-center mb-8">Who Should Get <span className="text-gold">ISO 27001 Certified?</span></h2>
        <ul className="grid md:grid-cols-2 gap-3 text-sm text-white/70">
          {AUDIENCE.map((a) => (
            <li key={a} className="rounded-lg border border-white/10 bg-white/5 px-4 py-3">{a}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}

function BlogSection() {
  return (
    <section className="bg-ink py-20 px-6 border-b border-white/10">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-4xl font-serif font-bold text-white">Latest from Our <span className="text-gold">Blog</span></h2>
        <p className="text-white/60 mt-3 mb-10">Stay updated with practical guides, implementation patterns, and audit readiness tips for ISO 27001.</p>

        <article className="rounded-xl border border-white/10 bg-white/5 p-6 text-left max-w-3xl mx-auto">
          <p className="text-xs text-white/45 mb-2">ISO-Audit360 · 3/17/2026</p>
          <h3 className="text-white text-lg font-semibold mb-2">What is ISO 27001:2022? A Practical Guide for ISMS Teams</h3>
          <p className="text-sm text-white/65 mb-4">
            A practical walkthrough of ISO 27001 clauses, risk treatment workflow, Statement of Applicability, and internal audit readiness.
          </p>
          <Link to="/blog" className="text-gold text-sm font-medium hover:underline">Read Article</Link>
        </article>

        <Link to="/blog" className="inline-block mt-6 text-gold text-sm font-medium hover:underline">View All Blogs</Link>
      </div>
    </section>
  )
}

function Faq() {
  const answers = {
    'What is ISO 27001:2022 certification and who is it for?': 'It validates practical ISMS knowledge and is useful for security, GRC, audit, compliance, and risk professionals.',
    'What is the difference between Associate and Professional tracks?': 'Associate focuses on core clauses and fundamentals; Professional focuses on Annex A controls, audit depth, and scenario-based judgment.',
    'How do I get ISO 27001 certified for free on this platform?': 'Create an account, verify email, choose a track, pass the timed exam, and get a verifiable certificate.',
    'Which ISO 27001 clauses and control areas are covered?': 'Coverage includes clauses 4–10, risk treatment, SoA concepts, and Annex A organizational, people, physical, and technological controls.',
    'What is the passing score for each exam?': 'Associate requires 40/50. Professional requires 80/100.',
    'How is exam integrity enforced during attempts?': 'The exam uses timed attempts, session checks, and integrity signals to discourage unfair behavior.',
    'Is this certificate recognized by employers?': 'It is a platform-issued skills credential designed to showcase applied ISO 27001 competence with public verification.',
    'How can someone verify my certificate?': 'Each certificate has a unique ID and verification page that can be shared publicly.',
    'Can I add this certificate to LinkedIn?': 'Yes. You can add the credential ID and verification URL to your LinkedIn profile.',
    'How often is the question bank updated?': 'The question bank is reviewed and expanded regularly to keep coverage practical and current.',
    'Can I retake the exam if I fail?': 'Yes, retakes are allowed according to the platform retake policy.',
    'Is there any fee for exam or certificate issuance?': 'No. The exam and certificate are free on this platform.',
    'Do I need work experience before attempting Professional track?': 'Experience helps, but you can attempt Professional directly if you are comfortable with control and audit scenarios.',
    'What is included in the exam performance report?': 'You receive score details, topic-level performance, and question review insights.',
    'Can organizations use this platform to benchmark teams?': 'Yes. Teams often use it for baseline capability checks and readiness tracking.',
    'How do I contact support for exam or account issues?': 'Use the support/contact channel provided in the application footer or dashboard.',
  }

  return (
    <section className="bg-ink py-20 px-6 border-b border-white/10">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-serif font-bold text-white text-center mb-10">Frequently Asked <span className="text-gold">Questions</span></h2>

        <Accordion.Root type="single" collapsible className="space-y-2">
          {FAQS.map((q, i) => (
            <Accordion.Item key={q} value={String(i)} className="rounded-lg border border-white/10 bg-white/5 overflow-hidden">
              <Accordion.Header>
                <Accordion.Trigger className="group w-full px-4 py-3 flex items-center justify-between text-left text-sm font-medium text-white hover:text-gold">
                  {q}
                  <ChevronDown size={16} className="text-white/45 transition-transform group-data-[state=open]:rotate-180" />
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content className="px-4 pb-4 text-sm text-white/60">
                {answers[q]}
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
    <section className="bg-ink py-20 px-6 text-center">
      <div className="max-w-3xl mx-auto rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-10">
        <h2 className="text-4xl font-serif font-bold text-white mb-4">Ready to Prove Your <span className="text-gold">ISO 27001 Expertise?</span></h2>
        <p className="text-white/65 mb-7">Join professionals using ISO-Audit360 to validate practical ISMS capability and showcase it with a verifiable certificate.</p>
        <Link to="/login?register=1" className="btn btn-gold btn-lg">Create Free Account</Link>
      </div>
    </section>
  )
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-ink">
      <Navbar />
      <Hero />
      <Stats />
      <WhatIsTprm />
      <WhyCertified />
      <Testimonials />
      <TopicAreas />
      <Levels />
      <CertificatesShowcase />
      <MockInterview />
      <Audience />
      <BlogSection />
      <Faq />
      <FinalCta />
    </div>
  )
}
