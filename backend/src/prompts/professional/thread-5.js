/**
 * Professional Track — Thread 5
 * Domain: ISO 19011 Audit Principles — Conducting & Reporting ISO 27001 Audits
 */
const { buildSystemPrompt, buildSchemaInstruction } = require('../promptBuilder')

const DOMAIN    = 'ISO 19011 Audit Principles — Conducting & Reporting ISO 27001 Audits'
const TRACK     = 'professional'
const THREAD    = 5
const ID_PREFIX = 'P'

function buildPrompt(startSeq = 1) {
  const systemPrompt = buildSystemPrompt()

  const userPrompt = `Generate exactly 10 ISO 27001:2022 Professional-level examination questions for the following domain:

DOMAIN: ${DOMAIN}
THREAD: ${THREAD} of 5
TRACK: Professional (experienced ISMS managers, lead implementers, and senior security practitioners)

DIFFICULTY EXPECTATION: Scenario-heavy questions demand mastery of ISO 19011:2018 audit methodology as applied to ISO 27001 certification and surveillance audits. Questions test audit planning decisions, evidence collection judgment, conduct during audit execution, closing meeting management, and report writing quality — all at the professional practitioner level.

TOPICS TO COVER (spread across all 10 questions):

ISO 19011:2018 Audit Principles:
- Integrity: honesty and responsibility in all aspects of audit work
- Fair presentation: accurate reporting of findings without omission or exaggeration
- Due professional care: diligence and judgment in all audit activities
- Confidentiality: protecting information gathered during auditing
- Independence: freedom from bias; not auditing own work; managing conflicts of interest
- Evidence-based approach: audit conclusions are based on verifiable, objective evidence
- Risk-based approach: directing audit effort to areas of greatest risk

Opening Meeting Conduct:
- Purpose (introduce team, confirm scope, logistics) vs. what must NOT happen in an opening meeting
- Handling scope changes requested by the auditee at the opening meeting
- Confirming audit criteria and agreeing communication protocol

Evidence Collection & Evaluation:
- Types: document review, interview, observation, technical inspection
- Evaluating sufficiency and relevance of evidence
- Handling contradictory evidence from different sources
- Judgemental vs. systematic sampling — appropriate use in ISMS audits
- Interview techniques: open vs. closed questions; triangulation of evidence across interviews

Audit Findings & Classification:
- Nonconformity types: major (system-level failure or total absence) vs. minor (isolated lapse)
- Observations and opportunities for improvement (OFIs) — advisory only; cannot be mandated
- Writing a well-formed nonconformity statement: requirement cited + objective evidence + deviation stated
- Grading disputed findings: when to maintain, withdraw, or defer a finding

Closing Meeting & Report:
- Structure of closing meeting: presenting findings, handling auditee objections, confirming timelines
- Audit report structure: scope, criteria, findings, conclusions, recommendations (if any)
- Audit report distribution: who receives it and under what confidentiality terms
- Post-audit activities: corrective action tracking, follow-up audit vs. desk review

SCENARIO STYLES:
- "During an opening meeting, the auditee's CISO requests expanding the audit scope to include a recently acquired subsidiary. What must the lead auditor do?"
- "An auditor interviews the IT Manager and the Security Manager about the backup procedure. Their accounts contradict each other. How should the auditor proceed under the evidence-based principle?"
- "A nonconformity statement reads: 'The organization's ISMS is inadequate'. An experienced reviewer sends it back. What two structural elements are missing?"
- "At the closing meeting, the auditee presents a policy that was approved 2 hours before the meeting, claiming it resolves the nonconformity raised. How should the lead auditor respond?"
- "An audit report is sent to the auditee's board directly by the certification body's auditor without the ISMS Manager's knowledge. Which ISO 19011 principle has been violated?"

DISTRACTOR DESIGN GUIDANCE:
- Major vs. minor nonconformity: major = absence or total breakdown; minor = isolated or infrequent deviation — the distinction matters to certification decisions
- OFIs CANNOT be mandated — an auditor who 'requires' an OFI to be addressed before certification is acting outside ISO 19011 scope
- Audit report confidentiality: reports belong to the client — auditors cannot distribute without authorization
- Evidence-based principle requires OBJECTIVE evidence — verbal confirmation alone is generally insufficient for conformance
- Opening meeting purpose: confirm logistics and scope — it is NOT the time to collect evidence or raise preliminary findings
- Corrective action timelines: auditors verify adequacy and implementation, not prescribe HOW to fix — this would compromise independence

${buildSchemaInstruction(TRACK, THREAD, ID_PREFIX, startSeq)}`

  return { systemPrompt, userPrompt }
}

module.exports = { buildPrompt, DOMAIN, THREAD, TRACK }
