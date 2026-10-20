/**
 * Practice drills — public, untimed, no certificate.
 *
 * These questions are DELIBERATELY SEPARATE from the exam banks in
 * backend/src/data/. Nothing here is drawn from, or may be copied into, an exam
 * bank: a candidate who drills every question on this page must still not have
 * seen a single exam question. Keep that boundary.
 *
 * Clause and control numbers follow ISO/IEC 27001:2022. Stems, options and
 * explanations are original material written for 27001certified — nothing is
 * copied from ISO/IEC 27001, 27002 or 19011, which are copyrighted.
 *
 * Shape: { id, section, stem, options[4], correct (index), explanation }
 *   correct — index into options; vary it, and keep the correct option from
 *             being the longest, so position and length give nothing away.
 *
 * Validated at build time by scripts/validate-content.mjs.
 */

export const PRACTICE_PATH = '/iso-27001/practice'

/**
 * Drill sections, in the order they appear on the index page.
 * `library` links the section to the reference page that explains it.
 */
export const SECTIONS = [
  {
    slug: 'clause-4',
    label: 'Clause 4 — Context of the organization',
    short: 'Clause 4',
    intro: 'Scope, context, interested parties and their requirements — the decisions everything else in the ISMS rests on.',
    library: '/iso-27001/clauses/clause-4-context-of-the-organization',
  },
  {
    slug: 'clause-5',
    label: 'Clause 5 — Leadership',
    short: 'Clause 5',
    intro: 'What top management has to do personally, what the policy must contain, and how roles get assigned.',
    library: '/iso-27001/clauses/clause-5-leadership',
  },
  {
    slug: 'clause-6',
    label: 'Clause 6 — Planning',
    short: 'Clause 6',
    intro: 'Risk assessment and treatment, the Statement of Applicability, and setting objectives that can be measured.',
    library: '/iso-27001/clauses/clause-6-planning',
  },
  {
    slug: 'clause-7',
    label: 'Clause 7 — Support',
    short: 'Clause 7',
    intro: 'Resources, competence, awareness, communication and the control of documented information.',
    library: '/iso-27001/clauses/clause-7-support',
  },
  {
    slug: 'clause-8',
    label: 'Clause 8 — Operation',
    short: 'Clause 8',
    intro: 'Running the planned processes, and keeping risk assessment and treatment going once the ISMS is live.',
    library: '/iso-27001/clauses/clause-8-operation',
  },
  {
    slug: 'clause-9',
    label: 'Clause 9 — Performance evaluation',
    short: 'Clause 9',
    intro: 'Monitoring and measurement, the internal audit programme, and what management review has to cover.',
    library: '/iso-27001/clauses/clause-9-performance-evaluation',
  },
  {
    slug: 'clause-10',
    label: 'Clause 10 — Improvement',
    short: 'Clause 10',
    intro: 'Nonconformity, root cause, corrective action and the effectiveness check that closes the loop.',
    library: '/iso-27001/clauses/clause-10-improvement',
  },
  {
    slug: 'annex-a-organizational',
    label: 'Annex A — Organizational controls',
    short: 'Organizational',
    intro: 'Policies, roles, supplier security, incident management, continuity and classification — A.5.1 to A.5.37.',
    library: '/iso-27001/annex-a#organizational',
  },
  {
    slug: 'annex-a-people',
    label: 'Annex A — People controls',
    short: 'People',
    intro: 'Screening, terms of employment, awareness, discipline, remote working and reporting — A.6.1 to A.6.8.',
    library: '/iso-27001/annex-a#people',
  },
  {
    slug: 'annex-a-physical',
    label: 'Annex A — Physical controls',
    short: 'Physical',
    intro: 'Perimeters, entry, equipment, media, clear desk and secure disposal — A.7.1 to A.7.14.',
    library: '/iso-27001/annex-a#physical',
  },
  {
    slug: 'annex-a-technological',
    label: 'Annex A — Technological controls',
    short: 'Technological',
    intro: 'Access, cryptography, logging, backup, secure development and the new 2022 technical controls — A.8.1 to A.8.34.',
    library: '/iso-27001/annex-a#technological',
  },
]

export const QUESTIONS = [
  // ───────────────────────── Clause 4 — Context ─────────────────────────
  {
    id: 'p-c4-1',
    section: 'clause-4',
    stem: 'An organisation runs two offices that share a single identity provider and file store. It wants to certify only the larger office. What does Clause 4.3 require it to do about the smaller one?',
    options: [
      'Bring the smaller office into scope, because shared systems make a split scope impossible.',
      'Exclude it silently, since scope is the organisation\'s own choice and needs no explanation.',
      'Analyse and document the interfaces and dependencies between the two, and justify the exclusion.',
      'Certify the smaller office separately first, then merge the two certificates.',
    ],
    correct: 2,
    explanation:
      'A narrow scope is allowed, but it is not free. Clause 4.3 expects the boundaries to take account of the interfaces and dependencies with everything outside them, documented and justified. Shared identity and storage are exactly such an interface: the auditor will want to see that the risk of the out-of-scope office reaching in-scope data has been assessed, not that the office was simply left off the certificate.',
  },
  {
    id: 'p-c4-2',
    section: 'clause-4',
    stem: 'Which of these best describes what Clause 4.2 asks you to record about interested parties?',
    options: [
      'Who they are, what they require, and which of those requirements the ISMS will address.',
      'A complete contact list for every customer, supplier and regulator.',
      'Their satisfaction scores, gathered at least annually.',
      'The contractual value of each relationship, to prioritise security spend.',
    ],
    correct: 0,
    explanation:
      'The point is relevance, not completeness. You identify the parties relevant to information security, determine what each actually requires of it — legal, regulatory, contractual or expectation-based — and then decide which of those requirements the ISMS takes on. A list of names with no requirements attached is the nonconformity auditors raise most often here.',
  },
  {
    id: 'p-c4-3',
    section: 'clause-4',
    stem: 'A company did a context analysis when it first certified three years ago. It has since acquired a competitor and entered a new regulated market. The file has not changed. What is the finding?',
    options: [
      'No finding, because Clause 4.1 requires the analysis only once, at establishment.',
      'An observation at most, since context is background information rather than a requirement.',
      'A finding against Clause 7.5, because the document is out of date.',
      'A finding against Clause 4.1, because the issues affecting the ISMS have changed and were not reconsidered.',
    ],
    correct: 3,
    explanation:
      'Clause 4.1 is a live requirement, not a one-off exercise. An acquisition and a new regulated market change both the internal and external issues that determine what the ISMS must achieve. Document control under 7.5 is a separate matter — the substance here is that the determination itself is stale.',
  },
  {
    id: 'p-c4-4',
    section: 'clause-4',
    stem: 'Since the 2024 amendment to ISO/IEC 27001:2022, what does Clause 4.1 explicitly require organisations to consider?',
    options: [
      'Whether artificial intelligence is used anywhere in the organisation.',
      'Whether climate change is a relevant issue for the management system.',
      'Whether the organisation operates in more than one jurisdiction.',
      'Whether any supplier holds a certification of its own.',
    ],
    correct: 1,
    explanation:
      'The 2024 amendment added an explicit requirement to determine whether climate change is a relevant issue, and a note under 4.2 that interested parties may have climate-related requirements. It does not force you to conclude that it is relevant — but the determination has to have been made and be evidenced.',
  },
  {
    id: 'p-c4-5',
    section: 'clause-4',
    stem: 'An ISMS scope statement reads: "All information assets of the company." What is the practical problem with it?',
    options: [
      'It is too broad to be certified; certification bodies require a scope limited to one site.',
      'It names assets rather than processes, which Clause 4.3 does not permit.',
      'It gives no boundaries, so neither the auditor nor a customer can tell what was assessed.',
      'Nothing — an all-encompassing scope is the strongest possible statement.',
    ],
    correct: 2,
    explanation:
      'A scope can legitimately cover the whole organisation, but it still has to say what that means: locations, functions, services, systems. A customer reading the certificate needs to know whether the service they buy is inside it. "All information assets" is unfalsifiable, which makes it unauditable.',
  },
  {
    id: 'p-c4-6',
    section: 'clause-4',
    stem: 'Clause 4.4 requires the organisation to establish, implement, maintain and continually improve the ISMS. What does the clause add beyond the rest of the standard?',
    options: [
      'It requires the ISMS to be certified by an accredited body.',
      'It requires a documented procedure for every Annex A control.',
      'It sets the minimum number of internal audits per year and the intervals between management reviews.',
      'It requires the ISMS to be understood as interacting processes, not a set of documents.',
    ],
    correct: 3,
    explanation:
      'Clause 4.4 is short but it frames everything after it: the ISMS is a system of processes with owners and interactions that has to be kept running and improved. Certification is a commercial choice, not a requirement of the standard, and nothing in 27001 mandates a documented procedure per control or a fixed audit count.',
  },

  // ───────────────────────── Clause 5 — Leadership ─────────────────────────
  {
    id: 'p-c5-1',
    section: 'clause-5',
    stem: 'Which of these is the clearest evidence that top management is fulfilling Clause 5.1?',
    options: [
      'The CEO signed the information security policy when it was first written.',
      'Security is listed as a standing item in the executive team\'s terms of reference.',
      'Board minutes show security risks debated, resources allocated and a decision taken against a cost case.',
      'The ISMS manager reports directly to the CEO rather than through the IT director, giving security its own voice.',
    ],
    correct: 2,
    explanation:
      'Clause 5.1 is about demonstrated accountability, and the strongest demonstration is a decision with consequences — particularly one where management chose security over cost or speed. A signature, a reporting line and an agenda item are all supporting indicators, but on their own they show structure rather than engagement.',
  },
  {
    id: 'p-c5-2',
    section: 'clause-5',
    stem: 'Clause 5.2 requires the information security policy to do several things. Which is NOT one of them?',
    options: [
      'Be available as documented information.',
      'Include a commitment to continual improvement of the ISMS.',
      'List the specific technical controls the organisation has implemented.',
      'Be communicated within the organisation.',
    ],
    correct: 2,
    explanation:
      'The policy sets direction and commitment — appropriateness to purpose, a framework for objectives, a commitment to meet applicable requirements and to continually improve, availability as documented information, communication internally and availability to interested parties as appropriate. Technical detail belongs in topic-specific policies and standards; putting it in the top-level policy guarantees the policy is out of date within months.',
  },
  {
    id: 'p-c5-3',
    section: 'clause-5',
    stem: 'An auditor finds that the risk register lists two risk owners who left the company last year. Which clause does this most directly offend?',
    options: [
      'Clause 5.3, because responsibilities and authorities are not assigned and kept current.',
      'Clause 6.1.2, because the risk assessment method is unsound.',
      'Clause 7.2, because the organisation cannot show the former risk owners were competent for the role.',
      'Clause 9.1, because the register is not being monitored.',
    ],
    correct: 0,
    explanation:
      'Clause 5.3 makes top management responsible for assigning and communicating responsibilities and authorities, and that assignment has to survive staff changes. The risk method itself may be fine; the problem is that nobody currently holds the risks. It is one of the most common findings in a first surveillance audit.',
  },
  {
    id: 'p-c5-4',
    section: 'clause-5',
    stem: 'Can top management delegate the operation of the ISMS to an ISMS manager?',
    options: [
      'No — the standard requires top management to run the ISMS personally.',
      'Only if the ISMS manager sits on the board.',
      'Yes, and doing so also transfers accountability for the ISMS.',
      'Yes, but accountability for the ISMS stays with top management.',
    ],
    correct: 3,
    explanation:
      'Delegation of work is normal and expected; delegation of accountability is not possible under Clause 5.1. This is the distinction auditors probe when they ask a CEO what the organisation\'s top three security risks are — an answer of "you\'d have to ask our ISMS manager" is itself the evidence.',
  },
  {
    id: 'p-c5-5',
    section: 'clause-5',
    stem: 'A policy is approved, published on the intranet and never mentioned again. Staff interviewed cannot say what it requires of them. What is the most accurate finding?',
    options: [
      'A nonconformity against Clause 5.2 — the policy is not effectively communicated.',
      'A nonconformity against Clause 7.5 — the document is not controlled.',
      'An observation only, since publication satisfies the requirement.',
      'A nonconformity against Clause 6.2 — objectives have not been communicated.',
    ],
    correct: 0,
    explanation:
      'Clause 5.2 requires the policy to be communicated within the organisation, and communication is judged by whether it landed, not by whether it was sent. Awareness under 7.3 is closely related and an auditor may well raise both, but the policy requirement itself sits in 5.2.',
  },
  {
    id: 'p-c5-6',
    section: 'clause-5',
    stem: 'Which statement about the information security policy and topic-specific policies is correct under the 2022 revision?',
    options: [
      'Topic-specific policies replaced the top-level policy in the 2022 revision.',
      'The top-level policy sets direction; topic-specific policies add detail where risk justifies it.',
      'Every Annex A control marked applicable must be covered by its own topic-specific policy with a named owner.',
      'Topic-specific policies are optional only for organisations under 50 staff.',
    ],
    correct: 1,
    explanation:
      'The 2022 revision uses the phrase "topic-specific policies" to describe the layer below the top-level policy — access control, acceptable use, cryptography, supplier security and so on. How many you need is a risk decision. Creating 93 policies to mirror Annex A produces a library nobody reads and is a reliable way to fail an awareness check.',
  },

  // ───────────────────────── Clause 6 — Planning ─────────────────────────
  {
    id: 'p-c6-1',
    section: 'clause-6',
    stem: 'Which of these must the Statement of Applicability contain under Clause 6.1.3?',
    options: [
      'Only the controls the organisation has decided to implement.',
      'The necessary controls, the justification for including them, whether they are implemented, and the justification for excluding any Annex A control.',
      'A mapping of every control to a named supplier.',
      'The residual risk score for every control, recalculated whenever the control is reviewed, with the date of that review and the name of the reviewer.',
    ],
    correct: 1,
    explanation:
      'The SoA has to justify both directions — inclusions and exclusions — and state implementation status. That is what makes it the document an auditor opens first: it is a single page where the organisation commits to what it claims to do, and every claim is testable against evidence.',
  },
  {
    id: 'p-c6-2',
    section: 'clause-6',
    stem: 'An organisation scores all its risks after its existing controls are taken into account, and has no record of what the risk would be without them. What is the consequence?',
    options: [
      'None, as long as the scoring scale is documented and applied consistently.',
      'It must rescore everything on a 1–10 scale instead.',
      'It cannot demonstrate why its controls are necessary, which undermines the Statement of Applicability.',
      'It breaches Clause 8.2, because risk assessment must be performed at planned intervals.',
    ],
    correct: 2,
    explanation:
      'The standard does not mandate an inherent-then-residual method, but without a before-and-after view the control justification has nothing to rest on: every risk already looks acceptable, so no control can be shown to be necessary. It is a legitimate method choice that very often collapses under audit questioning.',
  },
  {
    id: 'p-c6-3',
    section: 'clause-6',
    stem: 'Which of these is a properly formed information security objective under Clause 6.2?',
    options: [
      'Improve our security posture across the organisation.',
      'Achieve ISO 27001 certification at the first attempt, with no major nonconformities raised at the stage 2 audit.',
      'Implement every applicable Annex A control.',
      'Reduce median time to revoke leaver access from 5 days to within 1 working day by 31 December, owned by the Head of IT.',
    ],
    correct: 3,
    explanation:
      'Clause 6.2 wants objectives that are measurable where practicable, monitored, communicated and updated — with resources, responsibility, timing and a way to evaluate results. The fourth option carries a baseline, a target, a date and an owner. "Improve posture" cannot be evaluated, and certification is a milestone rather than a security outcome.',
  },
  {
    id: 'p-c6-4',
    section: 'clause-6',
    stem: 'What is the relationship between the risk treatment plan and the Statement of Applicability?',
    options: [
      'They are alternative names for the same document, one used by certification auditors and the other by implementation teams.',
      'The treatment plan says what will be done about each risk; the SoA records which controls apply and why.',
      'The SoA is produced first, and the treatment plan is derived from it.',
      'The treatment plan replaces the SoA once all treatments are complete.',
    ],
    correct: 1,
    explanation:
      'Risk assessment leads to treatment decisions; those decisions determine which controls are necessary; the SoA records that determination with justifications. Producing the SoA first — picking controls and then inventing risks to match — is a common shortcut, and it shows the moment an auditor traces a control back to its risk.',
  },
  {
    id: 'p-c6-5',
    section: 'clause-6',
    stem: 'Clause 6.3 was new in the 2022 revision. What does it require?',
    options: [
      'That changes to the ISMS are carried out in a planned manner.',
      'That all changes are approved by a change advisory board.',
      'That emergency changes are prohibited.',
      'That change records are retained for a minimum of three years.',
    ],
    correct: 0,
    explanation:
      'Clause 6.3 is one sentence: when the organisation determines the ISMS needs changing, the change is made in a planned manner. It deliberately does not prescribe a board, a tool or a retention period — those are your design decisions, and an auditor will judge them by whether recent real changes went through the process you described.',
  },
  {
    id: 'p-c6-6',
    section: 'clause-6',
    stem: 'Who should accept residual risk that remains after treatment?',
    options: [
      'The internal auditor, as an independent party.',
      'The ISMS manager, who maintains the register and is closest to the detail of every entry in it.',
      'The certification body, during the stage 2 audit.',
      'The risk owner, who has the authority to accept it on the organisation\'s behalf.',
    ],
    correct: 3,
    explanation:
      'Clause 6.1.3 requires risk owners to approve the treatment plan and accept the residual risk. Independence rules put the internal auditor out of the question, the ISMS manager usually lacks the authority, and a certification body audits the decision rather than making it.',
  },

  // ───────────────────────── Clause 7 — Support ─────────────────────────
  {
    id: 'p-c7-1',
    section: 'clause-7',
    stem: 'What is the difference between competence (Clause 7.2) and awareness (Clause 7.3)?',
    options: [
      'Competence applies to employees; awareness applies to contractors.',
      'Competence is about people who affect security performance being able to do the job; awareness is about everyone understanding the policy and their contribution.',
      'Competence is assessed annually against a documented skills matrix; awareness is assessed once on joining and then again only when the information security policy changes materially.',
      'Competence is a documented requirement; awareness is a recommendation.',
    ],
    correct: 1,
    explanation:
      'Competence is role-specific and evidence-based — education, training or experience that makes someone capable of the work affecting information security performance. Awareness is broad: everyone doing work under the organisation\'s control needs to know the policy, how they contribute, and what happens if requirements are not met. Both apply to contractors where relevant.',
  },
  {
    id: 'p-c7-2',
    section: 'clause-7',
    stem: 'An organisation keeps all ISMS documents in a wiki where anyone can edit and no version history is kept. Which requirement does this most directly fail?',
    options: [
      'Clause 7.5.3, because documented information is not adequately controlled.',
      'Clause 7.4, because communication is not planned.',
      'Clause 7.1, because the organisation has not resourced a proper document management system.',
      'Clause 8.1, because processes are not controlled.',
    ],
    correct: 0,
    explanation:
      'Clause 7.5.3 requires control over distribution, access, retrieval, storage, version control and retention — change control among them. An open wiki with no history fails on version control and on protecting documents from unintended alteration, regardless of how good the content is.',
  },
  {
    id: 'p-c7-3',
    section: 'clause-7',
    stem: 'Clause 7.4 requires the organisation to determine the need for communications relevant to the ISMS. Which element is explicitly part of that determination?',
    options: [
      'The budget allocated to security communications.',
      'The reading age of the material produced.',
      'Who communicates, and when.',
      'The communication platform the organisation will standardise on.',
    ],
    correct: 2,
    explanation:
      'The clause asks you to determine what to communicate, when, with whom, and who does it. Deciding who may speak — particularly externally, during an incident — is the part organisations most often skip, and it is the part that matters most at 2am.',
  },
  {
    id: 'p-c7-4',
    section: 'clause-7',
    stem: 'Which of these counts as "documented information" that Clause 7.5 requires you to retain, rather than maintain?',
    options: [
      'The information security policy.',
      'The risk assessment method.',
      'The internal audit programme procedure.',
      'The results of an internal audit.',
    ],
    correct: 3,
    explanation:
      'The standard distinguishes information you maintain — policies, procedures, methods, which are kept current — from information you retain as evidence that something happened. Audit results, monitoring results, management review minutes and competence records are retained; they are a record of a point in time and should not be rewritten later.',
  },
  {
    id: 'p-c7-5',
    section: 'clause-7',
    stem: 'A company runs a 20-minute security induction for new joiners and nothing afterwards. Staff have been there an average of four years. What is the most likely finding?',
    options: [
      'No finding — Clause 7.3 requires awareness only at the point of hire.',
      'A nonconformity against Clause 7.2, because competence is not reassessed.',
      'A nonconformity against Clause 7.3, because awareness is not maintained as risks and policies change.',
      'An opportunity for improvement rather than a nonconformity, since the standard sets no minimum frequency for awareness activity.',
    ],
    correct: 2,
    explanation:
      'Clause 7.3 sets no frequency, but it requires people to be aware of the current policy and their current contribution to the ISMS. With a four-year average tenure and a one-off induction, most staff are aware of a version of the ISMS that no longer exists — which an auditor confirms in three interviews.',
  },
  {
    id: 'p-c7-6',
    section: 'clause-7',
    stem: 'Clause 7.1 requires the organisation to determine and provide the resources needed for the ISMS. How does an auditor usually test it?',
    options: [
      'By reviewing the security budget as a percentage of IT spend.',
      'By checking that a dedicated full-time security role exists.',
      'By confirming the ISMS has its own cost centre, and that spend against it is reviewed at each management review.',
      'By looking for commitments the ISMS has made that it visibly cannot meet with the people and time available.',
    ],
    correct: 3,
    explanation:
      'There is no benchmark percentage, no required headcount and no mandated cost centre. The test is coherence: if the ISMS promises quarterly access reviews across 40 systems and one person has two days a month, the resource determination was wrong and the audit trail of overdue reviews will show it.',
  },

  // ───────────────────────── Clause 8 — Operation ─────────────────────────
  {
    id: 'p-c8-1',
    section: 'clause-8',
    stem: 'Clause 8.1 requires the organisation to control planned changes and review the consequences of unintended ones. What does that mean in practice?',
    options: [
      'Unintended changes must be reversed within 24 hours, or formally accepted as a deviation by the relevant risk owner.',
      'When something changed that you did not plan, you examine what it did to the ISMS and act on what you find.',
      'All changes must be approved before implementation without exception.',
      'Unplanned changes must be reported to the certification body.',
    ],
    correct: 1,
    explanation:
      'The clause accepts that unintended changes happen — an outage, a supplier switching a default, a merger that lands faster than planned. What it requires is that you review the consequences and mitigate adverse effects, rather than only governing the changes you chose to make.',
  },
  {
    id: 'p-c8-2',
    section: 'clause-8',
    stem: 'How do Clause 6.1.2 and Clause 8.2 differ?',
    options: [
      'Clause 6.1.2 applies to new risks; Clause 8.2 applies to existing ones.',
      'Clause 6.1.2 covers Annex A controls; Clause 8.2 covers the management system.',
      'Clause 6.1.2 defines the risk assessment process; Clause 8.2 requires it to be performed at planned intervals and when significant change occurs.',
      'They are duplicates retained for backwards compatibility with the 2013 revision, and an organisation need only evidence one of the two at audit.',
    ],
    correct: 2,
    explanation:
      'Clause 6 is the planning clause — it defines criteria and method. Clause 8 is the doing clause — it requires the assessment to actually be carried out on a schedule and when significant changes are proposed or occur, with the results retained. An ISMS with a beautiful method and one assessment from 2023 conforms to 6.1.2 and fails 8.2.',
  },
  {
    id: 'p-c8-3',
    section: 'clause-8',
    stem: 'An auditor asks for evidence under Clause 8.1 and is shown a well-written process document. Why is that not sufficient?',
    options: [
      'Because process documents belong under Clause 7.5, not Clause 8.',
      'Because Clause 8.1 requires the process to be certified separately.',
      'Because a process document must be approved by top management before it can be offered as evidence at an audit.',
      'Because Clause 8.1 is about the processes being carried out, so it needs operational records as evidence.',
    ],
    correct: 3,
    explanation:
      'Clause 8.1 asks for documented information to the extent necessary to have confidence the processes have been carried out as planned. A procedure proves intent; tickets, logs, completed checklists and review records prove operation. The gap between the two is where most stage 2 findings live.',
  },
  {
    id: 'p-c8-4',
    section: 'clause-8',
    stem: 'A risk treatment plan says a control will be in place by March. In June it is still not implemented, and the register has not changed. Which finding is most precise?',
    options: [
      'Clause 8.3 — the risk treatment plan is not being implemented, and the slippage is not managed.',
      'Clause 6.1.3 — the treatment plan was badly designed.',
      'Clause 10.2 — a nonconformity was not corrected.',
      'Clause 9.1 — the control was not monitored, so nobody noticed that the treatment date had passed.',
    ],
    correct: 0,
    explanation:
      'Clause 8.3 requires the plan to be implemented and the results retained. The plan itself may have been reasonable, so 6.1.3 is not the issue; nor has a nonconformity formally been raised yet. The failure is operational: the plan slipped and nothing in the system noticed.',
  },
  {
    id: 'p-c8-5',
    section: 'clause-8',
    stem: 'Which of these would most clearly trigger a fresh risk assessment under Clause 8.2?',
    options: [
      'A scheduled patch cycle completing on time.',
      'A routine quarterly access review finding nothing.',
      'Migrating the customer database to a new cloud provider.',
      'A staff member completing their annual awareness training.',
    ],
    correct: 2,
    explanation:
      'Clause 8.2 asks for assessment at planned intervals and when significant changes are proposed or occur. Moving customer data to a new provider changes the threat surface, the supplier relationship and the legal position all at once. Routine operations working as designed are not changes.',
  },
  {
    id: 'p-c8-6',
    section: 'clause-8',
    stem: 'An organisation outsources its entire IT operation. What does Clause 8.1 say about the outsourced processes?',
    options: [
      'They fall outside the ISMS once outsourced.',
      'They must be brought back in house before certification.',
      'They are covered by the supplier\'s own certification, if it holds one.',
      'They must be determined and controlled by the organisation.',
    ],
    correct: 3,
    explanation:
      'Clause 8.1 requires externally provided processes, products and services relevant to the ISMS to be controlled. You can outsource the work; you cannot outsource the responsibility for it. A supplier certificate is useful evidence of supplier capability, but it does not establish that your requirements are being met.',
  },

  // ───────────────────────── Clause 9 — Performance evaluation ─────────────────────────
  {
    id: 'p-c9-1',
    section: 'clause-9',
    stem: 'Clause 9.1 asks the organisation to determine what needs monitoring and measurement. Which of these is also explicitly required?',
    options: [
      'The methods for monitoring, measurement, analysis and evaluation.',
      'An external benchmark to compare results against.',
      'A dashboard accessible to all staff.',
      'A minimum of five metrics per Annex A theme.',
    ],
    correct: 0,
    explanation:
      'The clause requires you to determine what is monitored, the methods used — which must produce valid, comparable, reproducible results — when it is done, by whom, and when the results are analysed and evaluated. Benchmarks, dashboards and metric counts are design choices, not requirements.',
  },
  {
    id: 'p-c9-2',
    section: 'clause-9',
    stem: 'A small company has one person who runs IT, security and the internal audit. What does Clause 9.2 require them to do?',
    options: [
      'Nothing special — the standard exempts organisations under 50 staff.',
      'Ensure the audit is objective and impartial, which means that person cannot audit their own work.',
      'Appoint an accredited external auditor for every internal audit.',
      'Have the certification body perform the internal audit instead, since it is already independent of the organisation.',
    ],
    correct: 1,
    explanation:
      'Clause 9.2 requires auditors to be selected so that objectivity and impartiality are ensured, with no size exemption. The usual answers in a small company are a peer from another function, a trained colleague, or a contracted auditor — a certification body cannot do it without compromising its own independence.',
  },
  {
    id: 'p-c9-3',
    section: 'clause-9',
    stem: 'Which of these is NOT a required input to management review under Clause 9.3?',
    options: [
      'Audit results.',
      'Status of actions from previous management reviews.',
      'Feedback from interested parties.',
      'The organisation\'s annual financial statements.',
    ],
    correct: 3,
    explanation:
      'The required inputs cover previous actions, changes in issues and interested-party requirements, information security performance including nonconformities, monitoring results, audit results and objective fulfilment, feedback from interested parties, risk assessment and treatment status, and improvement opportunities. Finances may inform resourcing decisions but are not a required input.',
  },
  {
    id: 'p-c9-4',
    section: 'clause-9',
    stem: 'An internal audit programme audits the same three clauses every quarter and has never covered Clause 7 or the physical controls. What is wrong?',
    options: [
      'Audits are too frequent, which wastes resource that would be better spent closing the findings already raised.',
      'The programme must cover every clause every time it runs.',
      'The programme does not cover the ISMS at planned intervals, so parts of it have never been audited.',
      'Nothing, provided the three clauses are the highest-risk ones.',
    ],
    correct: 2,
    explanation:
      'Clause 9.2 requires audits at planned intervals that provide information on whether the ISMS conforms to the organisation\'s own requirements and the standard, and is effectively implemented. A risk-based programme can audit high-risk areas more often, but every part must be covered within the programme cycle — typically the certification cycle.',
  },
  {
    id: 'p-c9-5',
    section: 'clause-9',
    stem: 'Management review minutes record attendance and say "security performance was discussed and found satisfactory". What is the weakness?',
    options: [
      'Minutes should be taken by an independent party.',
      'Reviews must be held quarterly, and the minutes do not show that.',
      'The minutes should have been approved by the certification body.',
      'There is no evidence of which required inputs were considered or what was decided.',
    ],
    correct: 3,
    explanation:
      'Clause 9.3 requires the outputs to include decisions on improvement opportunities and any need for change to the ISMS, with documented information retained as evidence. A single satisfactory sentence shows a meeting happened but not that the review did. The standard sets no fixed frequency beyond "planned intervals".',
  },
  {
    id: 'p-c9-6',
    section: 'clause-9',
    stem: 'An organisation collects 40 security metrics every month, files them, and has never analysed them. Which part of Clause 9.1 does this fail?',
    options: [
      'The requirement to analyse and evaluate the results of monitoring and measurement.',
      'The requirement to retain documented information.',
      'The requirement to monitor and measure at the planned intervals the organisation itself set.',
      'The requirement to determine what needs to be monitored.',
    ],
    correct: 0,
    explanation:
      'Collection is the easy half. Clause 9.1 explicitly requires the results to be analysed and evaluated, and that evaluation is what feeds management review and improvement. Forty unread metrics are weaker evidence than three that visibly drive decisions.',
  },

  // ───────────────────────── Clause 10 — Improvement ─────────────────────────
  {
    id: 'p-c10-1',
    section: 'clause-10',
    stem: 'A nonconformity record gives the root cause as "the engineer forgot to run the review". Why will an auditor push back?',
    options: [
      'Because root cause must always be expressed as a technical failure.',
      'Because naming individuals breaches data protection rules.',
      'Because it stops at the person, so the corrective action cannot prevent recurrence.',
      'Because 5 Whys requires exactly five levels of analysis.',
    ],
    correct: 2,
    explanation:
      'Clause 10.2 asks you to determine the causes of the nonconformity so that it does not recur. "Someone forgot" describes the event, not its cause: the real question is why the process allowed forgetting to have that consequence — no automated trigger, no escalation, no second pair of eyes. The corrective action follows from that answer, not from the name.',
  },
  {
    id: 'p-c10-2',
    section: 'clause-10',
    stem: 'What is the difference between correction and corrective action?',
    options: [
      'Correction fixes the instance; corrective action removes the cause so it does not recur.',
      'Correction applies to minor findings; corrective action to major ones.',
      'Correction is performed by the auditee; corrective action by the auditor.',
      'They are the same thing under the 2022 revision.',
    ],
    correct: 0,
    explanation:
      'Removing the three leaver accounts you found is a correction. Changing the joiner-leaver process so accounts cannot survive an exit is corrective action. Clause 10.2 asks for both, in that order, and audits fail when the log contains only the first.',
  },
  {
    id: 'p-c10-3',
    section: 'clause-10',
    stem: 'A corrective action was completed on 20 March and the log was closed the same day. What is missing?',
    options: [
      'Approval of the closure by top management.',
      'A review of whether the corrective action was effective.',
      'A copy of the action filed with the certification body.',
      'A second internal audit of the same area.',
    ],
    correct: 1,
    explanation:
      'Clause 10.2 requires you to review the effectiveness of any corrective action taken. Closing on the completion date proves the work was done, not that it worked. Effectiveness needs time and an actual test — the next cycle of the process running correctly, for instance.',
  },
  {
    id: 'p-c10-4',
    section: 'clause-10',
    stem: 'Clause 10.1 requires continual improvement of the suitability, adequacy and effectiveness of the ISMS. Which evidence demonstrates it best?',
    options: [
      'A documented continual improvement procedure.',
      'An improvement register with 50 open items.',
      'Specific changes made over the year, each traceable to an audit finding, incident, metric or review decision.',
      'Year-on-year growth in the security budget, showing that management is investing more in the ISMS with each cycle.',
    ],
    correct: 2,
    explanation:
      'Improvement is demonstrated by changes that happened, with a visible reason. A procedure describes intent, a backlog of open items shows nothing has landed, and budget growth is an input rather than an outcome. Auditors look for the chain from a trigger to a change.',
  },
  {
    id: 'p-c10-5',
    section: 'clause-10',
    stem: 'Which of these must be retained as documented information under Clause 10.2?',
    options: [
      'A root cause analysis template for each category of nonconformity.',
      'The nature of the nonconformities, actions taken, and the results of corrective action.',
      'Written confirmation from the auditor that the finding is closed.',
      'A board resolution approving each corrective action before it may be implemented and closed.',
    ],
    correct: 1,
    explanation:
      'The clause asks for evidence of the nature of the nonconformities and any subsequent actions, and of the results of corrective action. Templates, auditor sign-off and board resolutions may all be part of how you work, but the standard does not require them.',
  },
  {
    id: 'p-c10-6',
    section: 'clause-10',
    stem: 'The same nonconformity — overdue access reviews — is raised in three consecutive internal audits, each time closed with "reminder sent to the team". What should the auditor conclude?',
    options: [
      'The finding should be downgraded, since it is clearly low risk.',
      'The corrective action process itself is ineffective, which is a finding in its own right.',
      'Nothing — repeat findings are normal in a maturing ISMS and are best tracked as a trend over time.',
      'The internal audit programme should stop auditing this area.',
    ],
    correct: 1,
    explanation:
      'A recurrence after corrective action means the root cause was never addressed, and a pattern of three means the process that is supposed to catch that — root cause analysis and effectiveness review under Clause 10.2 — is not working. Auditors escalate this: the systemic failure is a stronger finding than the access reviews themselves.',
  },
  // ───────────────────────── Annex A — Organizational controls ─────────────────────────
  {
    id: 'p-org-1',
    section: 'annex-a-organizational',
    stem: 'A.5.12 covers classification of information and A.5.13 covers labelling. What is the relationship between them?',
    options: [
      'Classification assigns the level based on value and risk; labelling makes that level visible in practice.',
      'Labelling applies to physical media and classification to digital files.',
      'They are alternatives — an organisation implements whichever of the two better suits its culture and tooling.',
      'Classification is a 2022 addition; labelling was carried over from the 2013 revision.',
    ],
    correct: 0,
    explanation:
      'You classify first, deciding what the information is worth and what would happen if it leaked, then label so that people and systems can act on the decision. Labelling without classification produces stickers nobody trusts; classification without labelling leaves staff guessing at the point they handle the data.',
  },
  {
    id: 'p-org-2',
    section: 'annex-a-organizational',
    stem: 'Which of these controls was newly introduced in Annex A of the 2022 revision?',
    options: [
      'A.5.15 Access control.',
      'A.5.7 Threat intelligence.',
      'A.5.10 Acceptable use of information and other associated assets.',
      'A.5.1 Policies for information security.',
    ],
    correct: 1,
    explanation:
      'Threat intelligence is one of the eleven controls new in 2022, alongside items such as information security for use of cloud services, ICT readiness for business continuity, physical security monitoring, configuration management, information deletion, data masking, data leakage prevention, monitoring activities, web filtering and secure coding. The others listed existed in the 2013 Annex A in some form.',
  },
  {
    id: 'p-org-3',
    section: 'annex-a-organizational',
    stem: 'An organisation signs a contract with a cloud provider but never defines what happens to its data when the contract ends. Which control is most directly unmet?',
    options: [
      'A.5.7 Threat intelligence.',
      'A.5.30 ICT readiness for business continuity.',
      'A.5.23 Information security for use of cloud services.',
      'A.5.9 Inventory of information and other associated assets.',
    ],
    correct: 2,
    explanation:
      'A.5.23 covers the processes for acquiring, using, managing and — crucially — exiting cloud services. Exit is the part most often missed: who deletes the data, on what timescale, in what format it is returned, and how deletion is evidenced. Continuity and asset inventory are related but not the direct fit.',
  },
  {
    id: 'p-org-4',
    section: 'annex-a-organizational',
    stem: 'What does A.5.7 Threat intelligence actually require an organisation to do?',
    options: [
      'Subscribe to a commercial threat intelligence feed.',
      'Operate a security operations centre with 24/7 coverage.',
      'Share indicators of compromise with a national CERT.',
      'Collect and analyse information about threats so that it produces action.',
    ],
    correct: 3,
    explanation:
      'The control is about producing usable understanding of the threats facing you — strategic, tactical and operational — and feeding it into risk assessment and controls. A small organisation can satisfy it with a vendor advisory list, a sector mailing list and a monthly review that changes something. Buying a feed nobody reads satisfies nothing.',
  },
  {
    id: 'p-org-5',
    section: 'annex-a-organizational',
    stem: 'An auditor samples five supplier relationships under A.5.19 and finds security requirements in three contracts. What is the most likely grading?',
    options: [
      'Observation, since a majority of contracts are compliant.',
      'A nonconformity, because the control is not consistently applied across suppliers.',
      'No finding, because A.5.19 is advisory.',
      'A major nonconformity in all cases, since any sampling failure is systemic.',
    ],
    correct: 1,
    explanation:
      'A control that works 60% of the time is a control that does not work. Whether it is graded minor or major depends on the sensitivity of what those two suppliers handle and whether the gap indicates a broken process rather than two oversights — which is exactly what the auditor will probe next.',
  },
  {
    id: 'p-org-6',
    section: 'annex-a-organizational',
    stem: 'Which statement about A.5.9 Inventory of information and other associated assets is most accurate?',
    options: [
      'It requires a single consolidated spreadsheet listing every asset.',
      'It applies only to hardware and to software licences, rather than to the information those assets hold.',
      'It requires an inventory with identified owners, which may be drawn from several existing sources.',
      'It was removed in the 2022 revision in favour of configuration management.',
    ],
    correct: 2,
    explanation:
      'What matters is that assets in scope are identified and owned, not that they live in one file. Most organisations build this from an MDM export, a cloud inventory, a SaaS register and a data map. Ownership is the part auditors test, because an asset without an owner has nobody to make decisions about it.',
  },

  // ───────────────────────── Annex A — People controls ─────────────────────────
  {
    id: 'p-ppl-1',
    section: 'annex-a-people',
    stem: 'A.6.1 Screening requires background verification checks. What governs how far those checks can go?',
    options: [
      'The organisation\'s risk appetite alone.',
      'A minimum standard set by the certification body.',
      'The seniority of the role, with executives always requiring the deepest checks.',
      'Applicable laws, regulations and ethics, proportionate to the risks of the role.',
    ],
    correct: 3,
    explanation:
      'The control explicitly ties screening to the legal and ethical limits of the jurisdiction and to the classification of information the role will access. What is routine in one country is unlawful in another, so a global policy that mandates identical checks everywhere tends to fail in both directions.',
  },
  {
    id: 'p-ppl-2',
    section: 'annex-a-people',
    stem: 'An employee leaves on Friday and their accounts are disabled the following Wednesday. Which controls does the delay engage?',
    options: [
      'A.6.5 on responsibilities after termination, together with A.5.18 on access rights.',
      'A.6.1 on screening, together with A.6.2 on the security terms set out in employment contracts.',
      'A.6.3 awareness and A.6.4 the disciplinary process.',
      'A.7.2 physical entry and A.7.4 physical security monitoring.',
    ],
    correct: 0,
    explanation:
      'A.6.5 covers the responsibilities that remain and the actions required when employment ends or changes; A.5.18 covers the provisioning, review and removal of access rights. A five-day window during which a former employee retains access is the single most commonly sampled gap in an audit of the people controls.',
  },
  {
    id: 'p-ppl-3',
    section: 'annex-a-people',
    stem: 'What does A.6.8 Information security event reporting require?',
    options: [
      'That all events are reported to the relevant supervisory authority within 72 hours.',
      'That personnel know how to report observed or suspected events, through a channel they can actually use.',
      'That only trained members of the security team may formally raise and record an information security event.',
      'That reported events are investigated within one business day.',
    ],
    correct: 1,
    explanation:
      'The control is about the reporting path existing and being known — a mechanism, a timescale and people who are aware of both. Regulatory notification deadlines come from law, not from this control, and an organisation that restricts reporting to the security team has removed the only sensors it has.',
  },
  {
    id: 'p-ppl-4',
    section: 'annex-a-people',
    stem: 'A.6.7 Remote working requires security measures for work done away from the organisation\'s premises. Which of these best demonstrates it?',
    options: [
      'A policy stating that remote working is permitted with manager approval.',
      'A VPN that all staff are required to connect through whenever they are working away from the office network.',
      'Device encryption, screen privacy, secure network use and home-environment guidance, applied and evidenced.',
      'A record of which staff work remotely and on which days.',
    ],
    correct: 2,
    explanation:
      'The control asks for the measures themselves, not permission to work remotely. Device protection, controlled network use, physical protection of the working environment and handling of printed material are the substance. A VPN alone addresses one channel and leaves the device and the room untouched.',
  },
  {
    id: 'p-ppl-5',
    section: 'annex-a-people',
    stem: 'Why does A.6.4 require a disciplinary process for information security violations?',
    options: [
      'So that violations can be reported to law enforcement in the cases where the conduct may be criminal.',
      'So that insurance claims can be substantiated after an incident.',
      'So that affected individuals can be notified of a breach.',
      'So that the consequences of violations are known in advance and applied consistently.',
    ],
    correct: 3,
    explanation:
      'The control\'s value is deterrent and procedural: staff should know what happens if they breach the policy, and the organisation should be able to act without improvising. Auditors check that the process is communicated — a disciplinary process nobody has heard of achieves neither.',
  },
  {
    id: 'p-ppl-6',
    section: 'annex-a-people',
    stem: 'A contractor works alongside employees with the same system access, but the organisation applies its security terms only to employees. What is the problem?',
    options: [
      'Contractors must be covered by a separate ISMS scope statement that sits alongside the organisation\'s own.',
      'Contractors must be converted to employees before being granted access.',
      'A.6.2 and A.6.6 extend to contractors, so the same obligations should be imposed contractually.',
      'There is no problem — Annex A people controls apply to employees only.',
    ],
    correct: 2,
    explanation:
      'A.6.2 covers the security responsibilities stated in terms and conditions, and A.6.6 covers confidentiality or non-disclosure agreements, both of which apply to personnel generally rather than to employees specifically. Equal access with unequal obligations is a gap an auditor finds by sampling the access list against HR records.',
  },

  // ───────────────────────── Annex A — Physical controls ─────────────────────────
  {
    id: 'p-phy-1',
    section: 'annex-a-physical',
    stem: 'A fully cloud-hosted company with no office of its own argues that all physical controls are not applicable. Is that defensible?',
    options: [
      'Yes — with no premises of its own, there is nothing physical left for the organisation to control or to audit.',
      'No — it still has to address laptops, media, home working environments and its providers\' physical security.',
      'Yes, provided its cloud provider holds ISO 27001 certification.',
      'No — the standard does not permit any Annex A control to be excluded.',
    ],
    correct: 1,
    explanation:
      'Some controls may genuinely not apply, and exclusions are permitted with justification. But endpoints exist somewhere, media still gets disposed of, and the physical security of data centres becomes a supplier assurance question rather than disappearing. A blanket exclusion of all fourteen physical controls invites exactly the wrong kind of attention.',
  },
  {
    id: 'p-phy-2',
    section: 'annex-a-physical',
    stem: 'Which control was added in the 2022 revision to cover alarms, CCTV and guard arrangements?',
    options: [
      'A.7.1 Physical security perimeters.',
      'A.7.2 Physical entry.',
      'A.7.4 Physical security monitoring.',
      'A.7.3 Securing offices, rooms and facilities.',
    ],
    correct: 2,
    explanation:
      'A.7.4 Physical security monitoring is one of the new 2022 controls: premises should be continuously monitored for unauthorised access. The others existed previously — perimeters, entry controls and securing facilities form the layered model the new monitoring control sits on top of.',
  },
  {
    id: 'p-phy-3',
    section: 'annex-a-physical',
    stem: 'An auditor asks for evidence under A.7.14 Secure disposal or re-use of equipment. What is the strongest answer?',
    options: [
      'A policy requiring all equipment to be wiped before disposal.',
      'A statement that the IT team handles all disposals internally.',
      'An invoice from a licensed waste disposal contractor covering the whole batch of equipment.',
      'Certificates of destruction or sanitisation records matched to specific asset tags.',
    ],
    correct: 3,
    explanation:
      'The control is met by evidence that storage media on specific devices was verifiably erased or destroyed. Matching the record to an asset tag closes the loop between the inventory under A.5.9 and the disposal, which is precisely the trace an auditor follows. An invoice shows a transaction, not an outcome.',
  },
  {
    id: 'p-phy-4',
    section: 'annex-a-physical',
    stem: 'A.7.7 Clear desk and clear screen is often dismissed as trivial. What makes it auditable?',
    options: [
      'It is observed directly — the auditor walks the floor and looks.',
      'It requires an annual attestation from each employee.',
      'It is measured by the number of printed pages per head.',
      'It is demonstrated by screen-lock policy settings alone.',
    ],
    correct: 0,
    explanation:
      'This is one of the few controls an auditor can test by observation in thirty seconds, which is why it is tested so often. Automatic screen locks are good supporting evidence, but unattended printouts, visible whiteboards and unlocked drawers during a site walk carry more weight than any policy setting.',
  },
  {
    id: 'p-phy-5',
    section: 'annex-a-physical',
    stem: 'What does A.7.9 Security of assets off-premises primarily address?',
    options: [
      'Insurance cover for equipment taken off site, and the claims process that follows a loss.',
      'The approval process for removing equipment from the building.',
      'Protection of devices and information while outside the organisation\'s premises.',
      'The physical security of supplier data centres.',
    ],
    correct: 2,
    explanation:
      'Once a laptop, phone or document leaves the perimeter, the perimeter controls stop helping. The control covers how those assets are protected in transit and at their destination — supervision, encryption, physical custody and the rules staff are given. Supplier facilities are handled through the supplier controls instead.',
  },
  {
    id: 'p-phy-6',
    section: 'annex-a-physical',
    stem: 'A company keeps backup tapes in an unlocked cupboard in a shared corridor. Which control does this most directly breach?',
    options: [
      'A.8.13 Information backup.',
      'A.7.10 Storage media.',
      'A.7.4 Physical security monitoring.',
      'A.5.9 Inventory of information and other associated assets.',
    ],
    correct: 1,
    explanation:
      'A.7.10 covers the management of storage media through its lifecycle — acquisition, use, transport and disposal — including protection against unauthorised access. The backups themselves may be perfectly well configured under A.8.13; the failure is in how the media holding them is physically protected.',
  },

  // ───────────────────────── Annex A — Technological controls ─────────────────────────
  {
    id: 'p-tech-1',
    section: 'annex-a-technological',
    stem: 'A.8.13 Information backup is frequently claimed as implemented on the strength of a nightly backup job. What does the control additionally expect?',
    options: [
      'That backups are tested by restoring them, at a frequency driven by the recovery requirements.',
      'That backups are retained for a minimum of seven years.',
      'That backups are stored with a different cloud provider.',
      'That the backup job is monitored by an independent third party, which reports on its status each month.',
    ],
    correct: 0,
    explanation:
      'A backup that has never been restored is a hypothesis. The control expects backup copies to be maintained and tested in line with the agreed topic-specific policy — frequency, scope and retention follow from your recovery objectives, not from a fixed number of years or a provider requirement.',
  },
  {
    id: 'p-tech-2',
    section: 'annex-a-technological',
    stem: 'Which pair of 2022 controls most directly addresses preventing sensitive data from leaving the organisation and reducing its exposure when used?',
    options: [
      'A.8.7 Protection against malware and A.8.8 Management of technical vulnerabilities.',
      'A.8.12 Data leakage prevention and A.8.11 Data masking.',
      'A.8.15 Logging and A.8.16 Monitoring activities.',
      'A.8.20 Network security and A.8.21 Security of network services.',
    ],
    correct: 1,
    explanation:
      'A.8.12 is about detecting and preventing unauthorised disclosure or extraction; A.8.11 is about limiting exposure through masking, pseudonymisation or anonymisation — particularly in test and analytics environments. Both are new in 2022 and both are commonly excluded with a justification that does not survive questioning.',
  },
  {
    id: 'p-tech-3',
    section: 'annex-a-technological',
    stem: 'Under A.8.15 Logging, which weakness would an auditor consider most serious?',
    options: [
      'Logs are retained for 90 days rather than a year.',
      'Logs are stored in a different time zone from the production systems.',
      'Administrators can delete or alter the logs of their own activity.',
      'Logs are in a proprietary format requiring vendor tooling to read.',
    ],
    correct: 2,
    explanation:
      'The control requires logs to be produced, kept and protected. If the people whose actions most need recording can edit the record, the logs cannot be relied on for anything — investigation, evidence or assurance. Retention periods, time zones and formats are real issues, but they do not destroy the integrity of the record.',
  },
  {
    id: 'p-tech-4',
    section: 'annex-a-technological',
    stem: 'A.8.8 Management of technical vulnerabilities is claimed on the basis of a monthly vulnerability scan. What is most likely still missing?',
    options: [
      'Penetration testing by an external party at least once a year, covering every internet-facing system.',
      'A CVSS score threshold documented in the policy.',
      'Scanning of development as well as production environments.',
      'Evidence that identified vulnerabilities are evaluated and remediated within defined timescales.',
    ],
    correct: 3,
    explanation:
      'Obtaining information about vulnerabilities is the first half of the control; evaluating exposure and taking appropriate measures is the second. Auditors ask for the ageing report — what was found three months ago and what has happened to it since. Scans with a growing backlog evidence the gap rather than the control.',
  },
  {
    id: 'p-tech-5',
    section: 'annex-a-technological',
    stem: 'Which control covers the separation of development, test and production environments?',
    options: [
      'A.8.31 Separation of development, test and production environments.',
      'A.8.25 Secure development life cycle.',
      'A.8.9 Configuration management.',
      'A.8.4 Access to source code, development tooling and the build pipeline.',
    ],
    correct: 0,
    explanation:
      'A.8.31 is the direct fit. The related controls matter too — A.8.25 covers secure development rules, A.8.9 covers configuration baselines, A.8.4 restricts source code access — but the specific requirement to keep the environments apart, and to control what moves between them, lives in A.8.31. Copying live customer data into test is the classic breach, and it usually engages A.8.11 as well.',
  },
  {
    id: 'p-tech-6',
    section: 'annex-a-technological',
    stem: 'An organisation grants every developer permanent production database access "so incidents can be fixed quickly". Which control does this most clearly fail?',
    options: [
      'A.8.5 Secure authentication.',
      'A.8.2 Privileged access rights.',
      'A.8.16 Monitoring activities.',
      'A.8.20 Networks security.',
    ],
    correct: 1,
    explanation:
      'A.8.2 requires privileged access to be restricted and managed — allocated on need, time-limited where possible, and reviewed. Standing production access for an entire team is the opposite of restriction. Just-in-time elevation with an approval record and session logging is the usual remedy, and it answers A.8.15 and A.8.16 at the same time.',
  },
]
