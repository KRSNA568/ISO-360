/**
 * ISO/IEC 27001:2022 Clauses 4–10 — public reference content.
 *
 * Clause numbers and titles follow ISO/IEC 27001:2022 (including the climate
 * change consideration added to 4.1/4.2 by Amendment 1:2024). Every summary is
 * original wording written for 27001certified; nothing is copied from the
 * standard, which is copyrighted. Do not paste standard text into this file.
 *
 * Shape: { number, title, intro, subclauses: [{ id, title, summary }], evidence[], ncs[], controls[] }
 *   controls — related Annex A control ids
 *
 * Validated at build time by scripts/validate-content.mjs.
 */

const CLAUSE_LIST = [
  {
    number: '4', title: 'Context of the organization',
    intro: 'Clause 4 makes you understand your organisation before you build anything: what affects its information security, who cares about it, and exactly what the ISMS will cover.',
    subclauses: [
      { id: '4.1', title: 'Understanding the organization and its context', summary: 'Identify the internal and external issues that affect what the ISMS needs to achieve — regulation, market, technology, culture, structure. Since the 2024 amendment, explicitly consider whether climate change is a relevant issue.' },
      { id: '4.2', title: 'Understanding the needs and expectations of interested parties', summary: 'List the parties that care about your information security (customers, regulators, staff, suppliers, shareholders), what they require, and which of those requirements the ISMS will address. Their requirements may include climate-related expectations.' },
      { id: '4.3', title: 'Determining the scope of the information security management system', summary: 'Decide and document the boundaries of the ISMS — locations, functions, systems, services — taking the issues, requirements and interfaces with other organisations into account.' },
      { id: '4.4', title: 'Information security management system', summary: 'Establish, implement, maintain and continually improve the ISMS, including the processes it needs and how they interact.' },
    ],
    evidence: [
      'A record of internal and external issues (for example a context or SWOT/PESTLE analysis)',
      'An interested-parties register with their relevant requirements',
      'A documented ISMS scope statement, including interfaces and exclusions with justification',
    ],
    ncs: [
      'The scope excludes a location that shares systems with in-scope sites, with no analysis of the interfaces.',
      'Interested parties are listed but their requirements are not identified.',
      'Context analysis was done once and never revisited after major business change.',
    ],
    controls: ['5.31', '5.9', '5.19'],
  },
  {
    number: '5', title: 'Leadership',
    intro: 'Clause 5 puts top management on the hook: the ISMS must be led from the top, not delegated and forgotten.',
    subclauses: [
      { id: '5.1', title: 'Leadership and commitment', summary: 'Top management shows commitment by aligning the ISMS with strategy, integrating it into business processes, providing resources, communicating its importance and supporting others in their roles.' },
      { id: '5.2', title: 'Policy', summary: 'Top management sets an information security policy that fits the organisation, provides a framework for objectives, commits to meeting requirements and to continual improvement, and is documented, communicated and available.' },
      { id: '5.3', title: 'Organizational roles, responsibilities and authorities', summary: 'Top management assigns and communicates security responsibilities and authorities, including who makes sure the ISMS conforms to the standard and who reports on its performance.' },
    ],
    evidence: [
      'Management review minutes and decisions showing active involvement',
      'An approved information security policy with evidence of communication',
      'Documented ISMS roles, including responsibility for reporting performance to top management',
    ],
    ncs: [
      'Top management cannot describe the ISMS objectives or recent performance.',
      'The policy has no commitment to continual improvement.',
      'No one is assigned to report ISMS performance to top management.',
    ],
    controls: ['5.1', '5.2', '5.4'],
  },
  {
    number: '6', title: 'Planning',
    intro: 'Clause 6 is the engine of the ISMS: a defined, repeatable way to assess and treat information security risk, plus measurable objectives and controlled change.',
    subclauses: [
      { id: '6.1.1', title: 'Actions to address risks and opportunities — General', summary: 'Using the context and requirements from Clause 4, determine the risks and opportunities the ISMS must address so it achieves its outcomes and prevents undesired effects, and plan how to act on them.' },
      { id: '6.1.2', title: 'Information security risk assessment', summary: 'Define and apply a risk assessment process with risk acceptance criteria and criteria for performing assessments, that produces consistent, valid and comparable results; identify risks and their owners, analyse likelihood and consequence, and evaluate them against the criteria.' },
      { id: '6.1.3', title: 'Information security risk treatment', summary: 'Select treatment options, determine the controls needed, compare them with Annex A so nothing necessary is missed, produce a Statement of Applicability, write a risk treatment plan, and obtain risk owners\' approval of the plan and the residual risks.' },
      { id: '6.2', title: 'Information security objectives and planning to achieve them', summary: 'Set measurable objectives consistent with the policy, then plan what will be done, with what resources, by whom, by when, and how results will be evaluated.' },
      { id: '6.3', title: 'Planning of changes', summary: 'New in 2022: when the ISMS needs to change, the change must be carried out in a planned way rather than ad hoc.' },
    ],
    evidence: [
      'A documented risk assessment methodology with acceptance criteria',
      'Risk assessment results, a risk treatment plan and risk owner approvals',
      'The Statement of Applicability with justifications for inclusion and exclusion',
      'Measurable objectives with plans and progress tracking',
    ],
    ncs: [
      'The Statement of Applicability excludes controls with no justification.',
      'Risk owners have not approved residual risks.',
      'Objectives such as "improve security" cannot be measured.',
    ],
    controls: ['5.1', '5.7', '5.36'],
  },
  {
    number: '7', title: 'Support',
    intro: 'Clause 7 covers what the ISMS needs to run: resources, competent and aware people, communication, and properly controlled documented information.',
    subclauses: [
      { id: '7.1', title: 'Resources', summary: 'Determine and provide the people, budget, tools and infrastructure needed to establish, run and improve the ISMS.' },
      { id: '7.2', title: 'Competence', summary: 'Decide what competence people whose work affects security need, make sure they have it through education, training or experience, act to close gaps, check that the action worked, and keep evidence.' },
      { id: '7.3', title: 'Awareness', summary: 'People working under the organisation\'s control must know the policy, how they contribute to the ISMS, and what happens if they do not conform.' },
      { id: '7.4', title: 'Communication', summary: 'Decide what to communicate about information security, when, with whom, and how — internally and externally.' },
      { id: '7.5', title: 'Documented information', summary: 'Keep the documented information the standard requires and whatever else the ISMS needs; create it with proper identification, format and review; and control it so it is available when needed and protected from loss, misuse and unauthorised change.' },
    ],
    evidence: [
      'Competence requirements per role and evidence such as training records and qualifications',
      'Awareness programme materials and completion records',
      'A communication plan or matrix',
      'Document control procedure, version histories and access controls',
    ],
    ncs: [
      'Training was delivered but its effectiveness was never evaluated.',
      'Staff interviewed do not know the information security policy exists.',
      'Uncontrolled copies of procedures are in use, with different versions in circulation.',
    ],
    controls: ['6.3', '5.37', '5.33'],
  },
  {
    number: '8', title: 'Operation',
    intro: 'Clause 8 is where planning becomes practice: run the processes, perform risk assessments for real, and implement the risk treatment plan.',
    subclauses: [
      { id: '8.1', title: 'Operational planning and control', summary: 'Plan, implement and control the processes needed to meet requirements and carry out the Clause 6 actions; set criteria for those processes, control planned changes, review the effects of unintended ones, and control externally provided processes, products and services.' },
      { id: '8.2', title: 'Information security risk assessment', summary: 'Carry out risk assessments at planned intervals and whenever significant changes are proposed or happen, using the Clause 6.1.2 criteria, and keep the results.' },
      { id: '8.3', title: 'Information security risk treatment', summary: 'Implement the risk treatment plan and keep evidence of the results.' },
    ],
    evidence: [
      'Process criteria and records that processes ran as planned',
      'Risk assessments performed after significant changes',
      'Evidence that treatment plan actions were implemented',
      'Controls over outsourced processes',
    ],
    ncs: [
      'A major system migration happened without any updated risk assessment.',
      'Risk treatment actions are long overdue with no review.',
      'An outsourced process is not controlled in any way.',
    ],
    controls: ['5.19', '5.23', '8.32'],
  },
  {
    number: '9', title: 'Performance evaluation',
    intro: 'Clause 9 asks whether the ISMS is actually working: measure it, audit it independently, and have top management review it.',
    subclauses: [
      { id: '9.1', title: 'Monitoring, measurement, analysis and evaluation', summary: 'Decide what to monitor and measure, the methods (which should give comparable and reproducible results), when, and who analyses and evaluates the results — then evaluate security performance and ISMS effectiveness and keep evidence.' },
      { id: '9.2', title: 'Internal audit', summary: 'Audit the ISMS at planned intervals against the organisation\'s own requirements and the standard, under an audit programme that sets frequency, methods, responsibilities and reporting; choose auditors who are objective and impartial, and report results to relevant management.' },
      { id: '9.3', title: 'Management review', summary: 'Top management reviews the ISMS at planned intervals, considering defined inputs — previous actions, changes in context, interested parties\' needs, performance trends, audit results, risk status and improvement opportunities — and records decisions on improvement and needed changes.' },
    ],
    evidence: [
      'Metrics with defined methods, results and analysis',
      'The internal audit programme, audit reports and auditor independence',
      'Management review minutes covering the required inputs and recording decisions',
    ],
    ncs: [
      'The ISMS manager audits processes they run.',
      'Management review minutes do not cover audit results or risk status.',
      'Metrics are collected but never analysed or acted on.',
    ],
    controls: ['5.35', '5.36', '8.16'],
  },
  {
    number: '10', title: 'Improvement',
    intro: 'Clause 10 closes the loop: keep improving the ISMS, and when something goes wrong, fix it and fix why it happened.',
    subclauses: [
      { id: '10.1', title: 'Continual improvement', summary: 'Continually improve how suitable, adequate and effective the ISMS is.' },
      { id: '10.2', title: 'Nonconformity and corrective action', summary: 'When a nonconformity occurs, react to control and correct it, deal with consequences, find the root cause and whether it could happen elsewhere, act to prevent recurrence, check the action worked, update the ISMS if needed, and keep records.' },
    ],
    evidence: [
      'A corrective action log with root causes, actions and effectiveness checks',
      'Records of improvements and where they came from (audits, incidents, reviews)',
    ],
    ncs: [
      'Nonconformities are closed by fixing the symptom with no root-cause analysis.',
      'The same finding recurs in consecutive audits.',
      'Corrective actions are never checked for effectiveness.',
    ],
    controls: ['5.27', '5.35', '5.36'],
  },
]

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export const CLAUSES = CLAUSE_LIST.map((c) => ({ ...c, slug: `clause-${c.number}-${slugify(c.title)}` }))
export const CLAUSES_BY_SLUG = Object.fromEntries(CLAUSES.map((c) => [c.slug, c]))
