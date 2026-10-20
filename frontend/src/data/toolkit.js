/**
 * Free ISO 27001:2022 toolkit — template catalogue.
 *
 * This file is the single source of truth for what each template is, the
 * columns it carries and the guidance shown on the page. The downloadable
 * files themselves are generated from here by scripts/build-toolkit.mjs into
 * public/toolkit/, so a column added here appears in the download too.
 *
 * Clause and control numbers follow ISO/IEC 27001:2022. Every other word is
 * original guidance written for 27001certified — nothing is copied from
 * ISO/IEC 27001 or 27002, both of which are copyrighted. Do not paste standard
 * text into this file.
 *
 * Shape: { slug, file, format, name, tagline, summary, reference, rowsNote,
 *          whatsInside[], howToUse[], columns[{ name, help }], agenda?[], related? }
 *   columns — CSV header row, in order (empty for document templates)
 *   agenda  — document templates only; drives both the page and the .md file
 *   related — { clauses: ['6'], controls: ['5.1'] } cross-links into the library
 *
 * Validated at build time by scripts/validate-content.mjs.
 */

export const TOOLKIT_PATH = '/iso-27001/toolkit'

export const TEMPLATES = [
  {
    slug: 'statement-of-applicability',
    file: 'statement-of-applicability.csv',
    format: 'CSV',
    name: 'Statement of Applicability',
    tagline: 'All 93 Annex A controls, pre-filled and ready to justify.',
    summary:
      'The document your auditor opens first. It lists every Annex A control, says whether it applies to ' +
      'your ISMS, and records why. This template comes with all 93 controls of the 2022 revision already ' +
      'numbered and named, so you only have to fill in the decisions.',
    reference: 'Required by Clause 6.1.3',
    rowsNote: '93 control rows, pre-filled',
    whatsInside: [
      'One row per Annex A control, grouped by the four 2022 themes.',
      'Columns for the applicability decision and the justification behind it.',
      'Columns to link each control back to the risks it treats and the evidence that proves it works.',
      'An owner and review date per control, so the document stays alive between audits.',
    ],
    howToUse: [
      'Finish your risk assessment first. Applicability follows from risk, not the other way round.',
      'Work down the sheet and mark each control Yes or No in the Applicable column.',
      'Justify both directions. "Not applicable — we run no on-premise servers" is as auditable as a Yes.',
      'Fill Linked risk IDs from your risk register so an auditor can trace a control to its reason.',
      'Point Evidence reference at where the proof actually lives: a document ID, a system, a ticket queue.',
      'Re-read the whole sheet before each audit and update Last reviewed. Stale justifications are a common finding.',
    ],
    columns: [
      { name: 'Control', help: 'Annex A reference, e.g. A.5.1 — pre-filled.' },
      { name: 'Control name', help: 'Short control title — pre-filled.' },
      { name: 'Theme', help: 'Organizational, People, Physical or Technological — pre-filled.' },
      { name: 'Applicable', help: 'Yes or No. Every control needs an answer; none can be left blank.' },
      { name: 'Justification', help: 'Why it applies, or why it does not. This is the column auditors read.' },
      { name: 'Implementation status', help: 'Not started, In progress, Implemented, or Not applicable.' },
      { name: 'Control owner', help: 'The named person accountable — not a team or a job queue.' },
      { name: 'Linked risk IDs', help: 'Risk register IDs this control treats, comma separated.' },
      { name: 'Evidence reference', help: 'Where the proof lives: document ID, system name, ticket queue.' },
      { name: 'Last reviewed', help: 'Date this row was last checked, YYYY-MM-DD.' },
    ],
    related: { clauses: ['6'], controls: ['5.1', '5.2'] },
  },

  {
    slug: 'risk-register',
    file: 'risk-register.csv',
    format: 'CSV',
    name: 'Risk register',
    tagline: 'Inherent score, treatment, residual score — the whole chain in one row.',
    summary:
      'A risk register that survives an audit has to show the full chain: what the risk is, who owns it, how ' +
      'bad it was before you did anything, what you did, and how bad it is now. This template keeps inherent ' +
      'and residual scores in separate columns so that chain is visible at a glance.',
    reference: 'Supports Clauses 6.1.2, 6.1.3 and 8.2',
    rowsNote: '3 worked examples, then blank rows',
    whatsInside: [
      'Separate likelihood, impact and score columns for inherent and residual risk.',
      'A treatment column using the four standard options: treat, tolerate, transfer, terminate.',
      'A column linking each risk to the Annex A controls that treat it, matching your Statement of Applicability.',
      'Three worked examples — a phishing risk, a single-admin dependency and a supplier concentration risk.',
      'An explicit "Risk accepted by" column, because residual risk has to be accepted by someone with the authority to accept it.',
    ],
    howToUse: [
      'Agree your scoring scale before the first row. A 1–5 likelihood and 1–5 impact scale multiplying to 1–25 works for most organisations.',
      'Write the risk as a sentence with a consequence, not a one-word topic. "Phishing" is not a risk; "credential theft via phishing leading to customer data exposure" is.',
      'Score inherent risk as if none of your current controls existed. Skipping this step is why many registers cannot justify their controls.',
      'Name a risk owner who can actually authorise the treatment budget.',
      'Fill the Annex A controls column from the same decisions you recorded in your Statement of Applicability.',
      'Re-score residual risk after the treatment is genuinely in place, not when the plan is written.',
      'Review the register on a schedule and after every incident, and record the date.',
    ],
    columns: [
      { name: 'Risk ID', help: 'Stable identifier, e.g. R-001. Never reuse one.' },
      { name: 'Date raised', help: 'When the risk entered the register, YYYY-MM-DD.' },
      { name: 'Asset or process', help: 'What is at stake — a system, a dataset, a business process.' },
      { name: 'Risk description', help: 'Cause, event and consequence in one sentence.' },
      { name: 'Threat', help: 'Who or what could cause it.' },
      { name: 'Vulnerability', help: 'The weakness that would let it happen.' },
      { name: 'Risk owner', help: 'Named person accountable for the treatment decision.' },
      { name: 'Inherent likelihood', help: '1–5, scored as though no controls existed.' },
      { name: 'Inherent impact', help: '1–5, scored as though no controls existed.' },
      { name: 'Inherent score', help: 'Likelihood × impact.' },
      { name: 'Treatment option', help: 'Treat, Tolerate, Transfer or Terminate.' },
      { name: 'Annex A controls', help: 'Controls that treat this risk, e.g. A.5.7, A.8.7.' },
      { name: 'Treatment plan', help: 'What will actually be done, concretely enough to check.' },
      { name: 'Target date', help: 'When the treatment is due, YYYY-MM-DD.' },
      { name: 'Residual likelihood', help: '1–5, after the treatment is in place.' },
      { name: 'Residual impact', help: '1–5, after the treatment is in place.' },
      { name: 'Residual score', help: 'Residual likelihood × residual impact.' },
      { name: 'Risk accepted by', help: 'Who accepted the residual risk, and their authority to do so.' },
      { name: 'Status', help: 'Open, Treatment in progress, Treated, Accepted or Closed.' },
      { name: 'Last reviewed', help: 'Date of the last review of this row, YYYY-MM-DD.' },
    ],
    related: { clauses: ['6', '8'], controls: ['5.7', '5.12'] },
  },

  {
    slug: 'internal-audit-checklist',
    file: 'internal-audit-checklist.csv',
    format: 'CSV',
    name: 'Internal audit checklist',
    tagline: 'Every clause requirement as an audit question, with the evidence to ask for.',
    summary:
      'An internal audit programme has to cover the whole management system, not just the parts that are easy ' +
      'to audit. This checklist turns each requirement of Clauses 4 to 10 into something you can actually ask ' +
      'and test, with the evidence to request and a place to record the result and grade the finding.',
    reference: 'Supports Clause 9.2; audit practice follows ISO 19011',
    rowsNote: 'One row per clause requirement, plus Annex A theme sampling rows',
    whatsInside: [
      'A row for every sub-clause of Clauses 4 to 10, phrased as a question to ask rather than a requirement to read.',
      'A "What good looks like" column so a stand-in auditor knows what they are judging against.',
      'An audit method column — interview, document review, observation or technical test — to stop audits becoming document reviews only.',
      'Sampling rows for each of the four Annex A themes, pointing back at your Statement of Applicability.',
      'Result column with the grades auditors actually use: conforms, observation, minor and major nonconformity.',
    ],
    howToUse: [
      'Scope the audit before you start. Trying to cover the whole ISMS in one pass produces shallow findings; split it across the year instead.',
      'Delete the rows outside this audit\'s scope rather than leaving them blank, so coverage stays honest.',
      'Vary the method column. A clause you only ever check by reading a document is a clause you have never really audited.',
      'Record what you actually saw in Finding notes — document ID, screenshot, who said it, when. "Seen and verified" proves nothing six months later.',
      'Grade findings consistently: a missing requirement is a major, a requirement that is implemented but failing is usually a minor.',
      'Move every nonconformity into the corrective action log before closing the audit, and cross-reference the IDs.',
    ],
    columns: [
      { name: 'Ref', help: 'Clause or theme reference — pre-filled.' },
      { name: 'Area', help: 'Which part of the management system this row covers — pre-filled.' },
      { name: 'Audit question', help: 'What to ask or test — pre-filled, edit to fit your context.' },
      { name: 'What good looks like', help: 'The standard you are judging against — pre-filled.' },
      { name: 'Audit method', help: 'Interview, Document review, Observation or Technical test.' },
      { name: 'Evidence to request', help: 'What to ask for before the interview — pre-filled suggestions.' },
      { name: 'Evidence seen', help: 'What you were actually shown: document ID, version, date, who provided it.' },
      { name: 'Result', help: 'Conforms, Observation, Minor NC, Major NC or Not applicable.' },
      { name: 'Finding notes', help: 'Enough detail that someone else could re-test the finding.' },
      { name: 'Linked NC ID', help: 'The corrective action log ID raised from this row, if any.' },
      { name: 'Auditor', help: 'Who performed this check.' },
      { name: 'Date checked', help: 'YYYY-MM-DD.' },
    ],
    related: { clauses: ['9'], controls: ['5.35'] },
  },

  {
    slug: 'gap-assessment',
    file: 'gap-assessment.csv',
    format: 'CSV',
    name: 'Gap assessment',
    tagline: 'Where you stand against the whole standard, before you commit to a date.',
    summary:
      'Run this before you plan a certification timeline. It walks the management system requirements of ' +
      'Clauses 4 to 10 and all 93 Annex A controls, asks what is in place today, and turns each gap into an ' +
      'owned action with a priority. The output is your implementation plan.',
    reference: 'Covers Clauses 4–10 and Annex A',
    rowsNote: '118 pre-filled rows — every clause requirement and all 93 controls',
    whatsInside: [
      'Every sub-clause of Clauses 4 to 10, so the management system itself is assessed, not only the controls.',
      'All 93 Annex A controls of the 2022 revision, pre-numbered and named.',
      'A four-way status column that separates "nothing here" from "something here but not provable".',
      'Action, owner, priority and effort columns, so the finished sheet doubles as a project plan.',
    ],
    howToUse: [
      'Be harsh about the difference between In place and Partial. If you cannot show an auditor evidence today, it is Partial.',
      'Write Current state as what exists, not what is intended. Intentions belong in Action to close.',
      'Mark controls Not applicable only where you can justify it — you will have to repeat that justification in your Statement of Applicability.',
      'Prioritise by risk, not by effort. The cheapest gaps are rarely the ones that fail an audit.',
      'Sort by Priority when you are done; that order is your implementation plan.',
      'Re-run the sheet before your certification audit and keep the first version — the delta is good evidence of improvement.',
    ],
    columns: [
      { name: 'Ref', help: 'Clause or Annex A reference — pre-filled.' },
      { name: 'Area', help: 'Management system clause or Annex A theme — pre-filled.' },
      { name: 'Requirement', help: 'What the standard expects, in plain English — pre-filled.' },
      { name: 'What good looks like', help: 'How you would recognise this as done — pre-filled.' },
      { name: 'Current state', help: 'What exists today. Facts only.' },
      { name: 'Status', help: 'Not started, Partial, In place or Not applicable.' },
      { name: 'Gap', help: 'The distance between current state and the requirement.' },
      { name: 'Action to close', help: 'The specific thing that will be done.' },
      { name: 'Owner', help: 'Named person, not a team.' },
      { name: 'Priority', help: 'High, Medium or Low — set by risk, not by effort.' },
      { name: 'Effort', help: 'Rough sizing, e.g. days or S/M/L.' },
      { name: 'Target date', help: 'YYYY-MM-DD.' },
    ],
    related: { clauses: ['4', '6'], controls: ['5.1'] },
  },

  {
    slug: 'nonconformity-corrective-action-log',
    file: 'nonconformity-corrective-action-log.csv',
    format: 'CSV',
    name: 'Nonconformity & corrective action log',
    tagline: 'Root cause and an effectiveness check, not just a tick in a box.',
    summary:
      'Most corrective action logs fail an audit for the same two reasons: the root cause is a restatement of ' +
      'the problem, and nobody ever went back to check the fix worked. This template separates immediate ' +
      'containment from root cause, and makes the effectiveness check a column you cannot quietly skip.',
    reference: 'Supports Clause 10.2',
    rowsNote: '2 worked examples, then blank rows',
    whatsInside: [
      'Separate columns for immediate action and corrective action — containment is not a fix.',
      'A root cause column plus the method used to find it, so "human error" stops being an acceptable answer.',
      'An effectiveness check with its own due date and result, which is the column auditors chase.',
      'Source and grading columns so you can show trends across audits, incidents and reviews at management review.',
      'Two worked examples: a missed access review and a supplier with no security clause in its contract.',
    ],
    howToUse: [
      'Raise one row per nonconformity. Bundling several into one row hides whether each was actually fixed.',
      'Record the immediate action separately — stopping the bleeding is not the same as stopping it happening again.',
      'Keep asking why until the answer is a process or a design decision. If the root cause is a person\'s name, go deeper.',
      'Set the effectiveness check date far enough out that the fix will have been exercised at least once.',
      'Close a row only when the effectiveness result is recorded. A row closed on the day the action finished has not been checked.',
      'Bring the open rows and the trend to management review; Clause 9.3 expects exactly that.',
    ],
    columns: [
      { name: 'NC ID', help: 'Stable identifier, e.g. NC-2026-004.' },
      { name: 'Date raised', help: 'YYYY-MM-DD.' },
      { name: 'Source', help: 'Internal audit, External audit, Incident, Management review, Complaint or Other.' },
      { name: 'Raised by', help: 'Who identified it.' },
      { name: 'Clause or control', help: 'The requirement that was not met, e.g. 9.2 or A.5.15.' },
      { name: 'Nonconformity description', help: 'What was found, factually, with the evidence that shows it.' },
      { name: 'Grading', help: 'Major NC, Minor NC or Observation.' },
      { name: 'Immediate action', help: 'Containment taken straight away.' },
      { name: 'Root cause', help: 'Why it was possible — a process or design answer, not a person.' },
      { name: 'Root cause method', help: '5 Whys, Fishbone, Fault tree or Other.' },
      { name: 'Corrective action', help: 'The change that stops it recurring.' },
      { name: 'Action owner', help: 'Named person accountable for completing it.' },
      { name: 'Target date', help: 'YYYY-MM-DD.' },
      { name: 'Completed date', help: 'When the corrective action was finished.' },
      { name: 'Effectiveness check due', help: 'When you will test that it worked.' },
      { name: 'Effectiveness result', help: 'Effective, Partially effective or Not effective — with what you checked.' },
      { name: 'Status', help: 'Open, Action in progress, Awaiting effectiveness check or Closed.' },
      { name: 'Evidence reference', help: 'Where the proof of the fix lives.' },
    ],
    related: { clauses: ['10', '9'], controls: ['5.27'] },
  },

  {
    slug: 'management-review-agenda',
    file: 'management-review-agenda.md',
    format: 'Markdown',
    name: 'Management review agenda',
    tagline: 'Every Clause 9.3 input as an agenda item, with who brings what.',
    summary:
      'Management review fails audits when it happens but leaves no trace that the required topics were ' +
      'covered. This agenda lists each input Clause 9.3 expects as a numbered item, names who brings the ' +
      'evidence, and leaves room to record the decisions — so the completed agenda is itself the minutes.',
    reference: 'Required by Clause 9.3',
    rowsNote: 'Plain text — paste into Word, Google Docs, Notion or Confluence',
    whatsInside: [
      'Every input Clause 9.3 expects, as a numbered agenda item in plain English.',
      'A line per item naming who presents it and the evidence they bring.',
      'Decision and action boxes under each item, so the agenda becomes the minutes as you go.',
      'A closing section for the outputs the clause expects — improvement decisions and any change to the ISMS.',
      'An attendance and apologies block, because an auditor will check who was actually in the room.',
    ],
    howToUse: [
      'Send the agenda out with the evidence attached. A review where the numbers are seen for the first time in the room is not a review.',
      'Keep top management in the room. Delegating the whole review to the ISMS manager is a finding waiting to happen.',
      'Fill the decision and action boxes live. Minutes written from memory a week later lose exactly the detail an auditor wants.',
      'Give every action an owner and a date, and carry the open ones into item 1 of the next review.',
      'Save the completed file with the date in its name and keep it as a record; this is retained evidence, not a working document.',
      'Hold the review at least annually, and again after any significant change to the organisation or its risk.',
    ],
    columns: [],
    agenda: [
      {
        item: 'Actions from the previous review',
        prompt: 'Walk the open actions from last time. Anything still open needs a reason and a new date, not a repeat of the old one.',
        who: 'ISMS manager',
        evidence: 'Previous review minutes with the action list and current status',
      },
      {
        item: 'Changes in context and interested parties',
        prompt: 'What has changed outside and inside the organisation that affects the ISMS — new markets, new regulation, restructures, new systems, new customer security requirements.',
        who: 'ISMS manager with business owners',
        evidence: 'Updated context and interested-party analysis; the register of legal and contractual requirements',
      },
      {
        item: 'Information security performance',
        prompt: 'How the ISMS actually performed: what was monitored and measured, how it trended, and whether the objectives were met.',
        who: 'ISMS manager',
        evidence: 'Metrics and monitoring results for the period, with the previous period for comparison; objectives and their current status',
      },
      {
        item: 'Nonconformities and corrective actions',
        prompt: 'Open and closed nonconformities, how long they are taking to close, and whether the effectiveness checks found the fixes worked.',
        who: 'ISMS manager',
        evidence: 'The nonconformity and corrective action log, with trend by source and grading',
      },
      {
        item: 'Audit results',
        prompt: 'Internal audit coverage against the programme, and the findings from internal and any external or supplier audits.',
        who: 'Internal audit lead',
        evidence: 'Audit programme showing coverage; audit reports and findings for the period',
      },
      {
        item: 'Feedback from interested parties',
        prompt: 'What customers, regulators, partners and staff have said about security — including security questionnaires, complaints and contractual pressure.',
        who: 'Sales, legal and support leads',
        evidence: 'Customer security questionnaires and escalations; complaints; staff feedback or survey results',
      },
      {
        item: 'Risk assessment and treatment status',
        prompt: 'How the risk picture has moved, which treatments landed, which slipped, and whether any residual risk now needs formal acceptance.',
        who: 'Risk owners',
        evidence: 'Risk register with inherent and residual scores; treatment plan status; any new risks since the last review',
      },
      {
        item: 'Incidents and lessons learned',
        prompt: 'Security incidents in the period, what they cost, and what changed as a result.',
        who: 'Incident coordinator',
        evidence: 'Incident records with timelines, impact and post-incident review notes',
      },
      {
        item: 'Resources and competence',
        prompt: 'Whether the ISMS has the people, budget and skills it needs, and what will be missing in the next period.',
        who: 'Top management',
        evidence: 'Headcount and budget position; training and competence records; open recruitment',
      },
      {
        item: 'Opportunities for continual improvement',
        prompt: 'Improvements worth making that are not fixes for nonconformities — process simplification, automation, scope changes, tooling.',
        who: 'All attendees',
        evidence: 'Improvement backlog or suggestions raised since the last review',
      },
      {
        item: 'Decisions and outputs',
        prompt: 'Record what management decided: improvements approved, changes to the ISMS or its scope, resources committed, and residual risk formally accepted.',
        who: 'Top management',
        evidence: 'Decisions recorded live in this document',
      },
    ],
    related: { clauses: ['9', '10'], controls: ['5.1', '5.4'] },
  },
]

export function templatePath(template) {
  return `${TOOLKIT_PATH}/${template.slug}`
}

export function templateFileUrl(template) {
  return `/toolkit/${template.file}`
}

export function findTemplate(slug) {
  return TEMPLATES.find((t) => t.slug === slug)
}
