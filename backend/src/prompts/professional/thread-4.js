/**
 * Professional Track — Thread 4
 * Domain: Nonconformity Scenario Auditing — Applied Case Studies
 */
const { buildSystemPrompt, buildSchemaInstruction } = require('../promptBuilder')

const DOMAIN    = 'Nonconformity Scenario Auditing — Applied Case Studies'
const TRACK     = 'professional'
const THREAD    = 4
const ID_PREFIX = 'P'

function buildPrompt(startSeq = 1) {
  const systemPrompt = buildSystemPrompt()

  const userPrompt = `Generate exactly 10 ISO 27001:2022 Professional-level examination questions for the following domain:

DOMAIN: ${DOMAIN}
THREAD: ${THREAD} of 5
TRACK: Professional (experienced ISMS managers, lead implementers, and senior security practitioners)

DIFFICULTY EXPECTATION: These are applied case-study questions. Each presents a realistic audit scenario with multiple findings or ambiguous evidence. Candidates must correctly identify nonconformities, classify their severity (major vs. minor), reference the correct clause or Annex A control, and determine audit implications. Distractors are technically plausible misclassifications.

CASE STUDY SCENARIO TYPES (each question should be a self-contained scenario with 4 plausible answer options):
1. Identify the nonconformity — given a set of audit observations, which specific requirement is not met?
2. Classify the severity — is this a major nonconformity, minor nonconformity, or an observation/OFI?
3. Determine the correct clause/control reference — which clause or Annex A control applies?
4. Multi-finding scenarios — given 3–4 observations, which combination represents certifiable nonconformities vs. observations?
5. Corrective action evaluation — is the proposed corrective action adequate to address the root cause?
6. Audit judgment calls — should the auditor escalate, note as observation, or request more evidence?

SCENARIO EXAMPLES TO DRAW FROM:
- An organization has no documented risk assessment for a newly deployed SaaS application (Clause 8.2 / Clause 6.1.2 — identify which applies)
- An internal audit was conducted 14 months ago; no explanation for the extended gap is documented (Clause 9.2 — major or minor?)
- Access to a production system is shared among 5 administrators using a single service account (A.8.2 + A.5.3 — multiple controls)
- A management review was held but the minutes only record attendance and general discussion; no decisions or resource allocations are documented (Clause 9.3.3 — outputs missing)
- An employee's access was not revoked for 45 days after termination; the organization claims this was due to an HR system delay (A.6.5 — evaluate corrective action)
- Penetration test results were shared with the system vendor before the audit — findings may have been remediated; auditor cannot verify original state (evidence validity)
- 3 out of 5 information security objectives have no measurable targets (Clause 6.2 — major or minor?)
- A policy document is version-controlled but no approval signature or date appears (A.5.1 / Clause 7.5 — document control)
- Risk treatment for a high-risk asset was 'accept' with no documented justification or senior management sign-off (Clause 6.1.3 / Clause 8.3)
- A DLP tool is installed but rules have not been updated in 18 months and generate no alerts despite active data flows (A.8.12 — implementation vs. operation effectiveness)

DISTRACTOR DESIGN GUIDANCE:
- Major nonconformity = systematic failure or absence of a required element; minor = isolated lapse — candidates must know the distinction
- Observations/OFIs are NOT nonconformities and cannot be mandated — auditors must not conflate advisory recommendations with findings
- A finding can implicate MULTIPLE clauses/controls — the correct answer cites the MOST DIRECTLY applicable requirement
- Corrective action adequacy: a new policy document does not correct a behaviour-based nonconformity — implementation evidence is required
- Audit adjustments based on new evidence presented at closing meeting: lead auditor may accept, reject, or defer — not automatically required to revise
- Lack of documented evidence ≠ lack of compliance, but absence of required documented information IS a nonconformity

${buildSchemaInstruction(TRACK, THREAD, ID_PREFIX, startSeq)}`

  return { systemPrompt, userPrompt }
}

module.exports = { buildPrompt, DOMAIN, THREAD, TRACK }
