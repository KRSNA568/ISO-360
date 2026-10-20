/**
 * Row content for the generated toolkit templates — the parts that cannot be
 * derived from the Annex A and clause libraries.
 *
 * CLAUSE_CHECKS   one audit question per sub-clause of Clauses 4–10
 * THEME_CHECKS    sampling rows for the four Annex A themes
 * RISK_EXAMPLES   worked rows for the risk register
 * NC_EXAMPLES     worked rows for the nonconformity log
 *
 * Clause and control numbers follow ISO/IEC 27001:2022. The questions and
 * examples are original guidance written for 27001certified — nothing is copied
 * from ISO/IEC 27001, 27002 or 19011, all of which are copyrighted.
 *
 * Consumed by scripts/build-toolkit.mjs, validated by scripts/validate-content.mjs
 * (every sub-clause must have a question here).
 */

/** @type {Record<string, { question: string, good: string }>} */
export const CLAUSE_CHECKS = {
  '4.1': {
    question: 'Which internal and external issues has the organisation decided affect its information security, and when was that judgement last revisited?',
    good: 'A current record of the issues that shape the ISMS, revisited after significant business change rather than only at audit time, with climate change explicitly considered.',
  },
  '4.2': {
    question: 'Who are the interested parties for information security, what does each of them actually require, and which of those requirements has the ISMS taken on?',
    good: 'A register that names the parties, states their requirements concretely, and distinguishes the requirements the ISMS addresses from those it does not.',
  },
  '4.3': {
    question: 'What exactly is inside the ISMS scope, what is outside, and how were the interfaces with everything outside it assessed?',
    good: 'A documented scope covering locations, functions, systems and services, with exclusions justified and shared interfaces analysed rather than ignored.',
  },
  '4.4': {
    question: 'Which processes make up the ISMS, how do they interact, and who maintains that view?',
    good: 'The ISMS is described as a set of interacting processes with owners, not as a folder of documents.',
  },
  '5.1': {
    question: 'How does top management demonstrate it is accountable for the ISMS rather than delegating it entirely?',
    good: 'Decisions, resourcing and attendance records that show named senior people engaging with security — not a signature on a policy and nothing else.',
  },
  '5.2': {
    question: 'Where is the information security policy, who approved it, and how do staff know what it requires of them?',
    good: 'An approved, version-controlled policy that is published where staff can find it, with acknowledgement records and a review history.',
  },
  '5.3': {
    question: 'Which security roles have been defined, who holds each one today, and do those people know they hold it?',
    good: 'Roles assigned to named people with the authority and time to act, kept current through leavers and restructures, and confirmed in interview.',
  },
  '6.1.1': {
    question: 'How were risks and opportunities to the ISMS itself identified, and what was done about them?',
    good: 'Planning that addresses threats to the management system achieving its outcomes, not only threats to information assets.',
  },
  '6.1.2': {
    question: 'Walk me through the risk assessment method: how are risks identified, who owns them, and how are likelihood and impact scored consistently?',
    good: 'A documented, repeatable method with a defined scale and criteria, applied consistently across the register by named risk owners.',
  },
  '6.1.3': {
    question: 'How does each risk connect to the controls that treat it, and who accepted the residual risk that was left?',
    good: 'A treatment plan traceable from risk to control to evidence, a Statement of Applicability justifying every control both ways, and residual risk accepted by someone with authority.',
  },
  '6.2': {
    question: 'What are the information security objectives, how is progress against them measured, and what happened the last time one was missed?',
    good: 'Objectives that are measurable and resourced, tracked with real numbers, with a visible response when a target is not met.',
  },
  '6.3': {
    question: 'When the organisation changes something significant, how is the ISMS impact considered before the change lands?',
    good: 'Change planning that routinely asks the security question in advance, with evidence from recent real changes rather than a documented intention.',
  },
  '7.1': {
    question: 'What people, budget and tooling has the ISMS been given, and where is it currently short?',
    good: 'Resourcing that matches the commitments in the ISMS, with shortfalls acknowledged and escalated rather than absorbed silently.',
  },
  '7.2': {
    question: 'How does the organisation know the people with security responsibilities are competent to carry them out?',
    good: 'Competence defined per role and evidenced by training, qualification or demonstrated experience, with gaps addressed.',
  },
  '7.3': {
    question: 'What does a new joiner learn about information security, and what do existing staff get after that?',
    good: 'Awareness activity that reaches everyone, repeats, is tailored to real risks, and has completion records.',
  },
  '7.4': {
    question: 'How is information security communicated internally and externally — what, to whom, when, and by whom?',
    good: 'Communication that is planned rather than ad hoc, including who may speak externally about a security incident.',
  },
  '7.5': {
    question: 'How are ISMS documents and records controlled: version, approval, availability, retention and disposal?',
    good: 'Documents carry owners, versions and approval; records are retained for a defined period and are retrievable on request.',
  },
  '8.1': {
    question: 'How does the organisation show the security processes it planned are the ones actually being run day to day?',
    good: 'Operational records from the live process, not a description of how it is supposed to work.',
  },
  '8.2': {
    question: 'When was the risk assessment last performed or reviewed, and what triggered it?',
    good: 'Risk assessment on a defined schedule and after significant change, with the results feeding the treatment plan and the register dated.',
  },
  '8.3': {
    question: 'Which treatments were planned, which are actually in place, and what is the evidence for the ones marked complete?',
    good: 'A treatment plan where completed items can be evidenced and slipped items have revised dates and a reason.',
  },
  '9.1': {
    question: 'What is monitored and measured, how often, and what did the last analysis of those numbers conclude?',
    good: 'Defined metrics with a method and a frequency, analysed to a conclusion that drives action — not numbers collected and filed.',
  },
  '9.2': {
    question: 'Show me the internal audit programme, how it covers the whole ISMS over time, and the independence of the auditors.',
    good: 'A risk-based programme with demonstrated coverage, auditors who do not audit their own work, and findings that reach the corrective action log.',
  },
  '9.3': {
    question: 'When was the last management review, who attended, and which of the required inputs can you show were covered?',
    good: 'Minutes at planned intervals showing top management present, every required input covered, and decisions with owners and dates.',
  },
  '10.1': {
    question: 'What has measurably improved in the ISMS over the last year, and what drove each improvement?',
    good: 'Specific improvements traceable to audits, incidents, metrics or reviews — evidence of a system that changes, not one that is merely maintained.',
  },
  '10.2': {
    question: 'Take me through a recent nonconformity end to end: containment, root cause, corrective action, and the check that it worked.',
    good: 'Root causes that reach a process or design decision, corrective actions that address that cause, and a recorded effectiveness check after the event.',
  },
}

/** @type {Record<string, { question: string, good: string, evidence: string }>} */
export const THEME_CHECKS = {
  organizational: {
    question: 'Sample the organizational controls marked applicable in the Statement of Applicability. For each sampled control, what evidence shows it operating?',
    good: 'Each sampled control has a named owner and current operating evidence that matches what the SoA claims.',
    evidence: 'Statement of Applicability; policies and registers for the sampled controls; records showing them in use',
  },
  people: {
    question: 'Sample recent joiners, movers and leavers. Were screening, terms, awareness and access changes completed and recorded on time?',
    good: 'The people lifecycle is evidenced end to end for real individuals, with access removed promptly on exit.',
    evidence: 'Joiner/leaver records for a sample of recent cases; screening records; awareness completion; access removal tickets',
  },
  physical: {
    question: 'Walk the in-scope sites. How is entry controlled and recorded, and how are equipment and media handled and disposed of?',
    good: 'Observed physical controls match the documented ones, with access records and disposal certificates available.',
    evidence: 'Access logs and visitor records; site walkthrough observations; equipment disposal and media sanitisation records',
  },
  technological: {
    question: 'Sample the technological controls marked applicable. For each, show the configuration and the monitoring that proves it is still working.',
    good: 'Technical controls are demonstrated in the live system, with logging or monitoring that would reveal a failure.',
    evidence: 'Configuration exports or screenshots; access review records; logging and alerting evidence; backup restore tests; vulnerability scan and patch records',
  },
}

/**
 * Worked rows for the risk register, in the column order declared in
 * src/data/toolkit.js. Scores are illustrative on a 1–5 scale.
 */
export const RISK_EXAMPLES = [
  [
    'R-001', '2026-01-14', 'Customer data in the production database',
    'An attacker phishes a support agent, reuses the credential and exports customer records, exposing personal data and triggering breach notification.',
    'External attacker running a credential-phishing campaign',
    'Support console reachable from the internet with password-only sign-in',
    'Head of Support', '4', '5', '20', 'Treat', 'A.5.17, A.8.5, A.6.3',
    'Enforce phishing-resistant MFA on the support console, restrict export to a named role, and add an alert on bulk exports.',
    '2026-03-31', '2', '5', '10', 'Head of Support', 'Treatment in progress', '2026-02-18',
  ],
  [
    'R-002', '2026-01-14', 'Production deployment pipeline',
    'Only one engineer can deploy or roll back production, so an outage during their absence extends well beyond the recovery objective.',
    'Key-person unavailability — illness, leave or resignation',
    'Deployment knowledge and credentials held by a single person, undocumented',
    'Engineering Manager', '3', '4', '12', 'Treat', 'A.5.2, A.8.9, A.5.30',
    'Document the deployment runbook, give a second engineer the access and have them perform a supervised release each month.',
    '2026-04-30', '2', '3', '6', 'Engineering Manager', 'Treatment in progress', '2026-02-18',
  ],
  [
    'R-003', '2026-02-02', 'Email and document hosting',
    'Email, documents and identity all sit with one provider, so a prolonged outage or account compromise there halts the business.',
    'Supplier outage or compromise at the hosting provider',
    'No tested alternative for communications and no independent copy of key documents',
    'Chief Operating Officer', '2', '4', '8', 'Tolerate', 'A.5.19, A.5.21, A.5.30',
    'Accept the concentration risk for now; keep an independent encrypted export of critical documents and review at each management review.',
    '2026-06-30', '2', '3', '6', 'Chief Operating Officer', 'Accepted', '2026-02-18',
  ],
]

/**
 * Worked rows for the nonconformity and corrective action log, in the column
 * order declared in src/data/toolkit.js.
 */
export const NC_EXAMPLES = [
  [
    'NC-2026-001', '2026-02-11', 'Internal audit', 'J. Okafor (internal auditor)', 'A.5.15',
    'Quarterly access reviews were required for the finance system but no review was recorded for Q3 or Q4 2025. Sampled 4 quarters, found 2 missing.',
    'Minor NC',
    'Ran the overdue review immediately; removed 3 accounts belonging to leavers.',
    'The review existed as a calendar reminder owned by one person with no backstop, so it silently lapsed while they were on extended leave.',
    '5 Whys',
    'Move the review to a ticket raised automatically each quarter, assigned to the role rather than the person, with escalation to the manager if it is still open after 14 days.',
    'Finance Systems Owner', '2026-03-31', '2026-03-20', '2026-09-30',
    'Effective — Q1 and Q2 2026 reviews both completed within 10 days of the ticket opening.',
    'Closed', 'Audit report IA-2026-01; tickets ACC-4412, ACC-4703',
  ],
  [
    'NC-2026-002', '2026-03-04', 'External audit', 'Certification body (stage 2)', '5.21',
    'Two of five sampled supplier contracts contained no information security requirements, although both suppliers process customer data.',
    'Major NC',
    'Notified both suppliers in writing and obtained interim confidentiality undertakings while contracts are amended.',
    'Procurement had no trigger to involve security: the contract template contained no security schedule and nothing in the purchasing workflow asked whether the supplier would handle customer data.',
    'Fishbone',
    'Add a security schedule to the standard contract template and a mandatory data-handling question in the purchase request form that routes to the ISMS manager when answered yes.',
    'Head of Procurement', '2026-04-30', '', '2026-10-31', '',
    'Action in progress', 'External audit report EA-2026-S2; procurement workflow change request PR-118',
  ],
]
