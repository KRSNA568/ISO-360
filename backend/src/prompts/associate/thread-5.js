/**
 * Associate Track — Thread 5
 * Domain: Performance Evaluation, Internal Audit & Improvement (Clauses 9–10)
 */
const { buildSystemPrompt, buildSchemaInstruction } = require('../promptBuilder')

const DOMAIN    = 'Performance Evaluation, Internal Audit & Improvement (Clauses 9–10)'
const TRACK     = 'associate'
const THREAD    = 5
const ID_PREFIX = 'A'

function buildPrompt(startSeq = 1) {
  const systemPrompt = buildSystemPrompt()

  const userPrompt = `Generate exactly 10 ISO 27001:2022 Associate-level examination questions for the following domain:

DOMAIN: ${DOMAIN}
THREAD: ${THREAD} of 5
TRACK: Associate (foundation-level practitioners and ISMS implementers)

TOPICS TO COVER (spread across all 10 questions):
- Clause 9.1: Monitoring, measurement, analysis and evaluation — what to monitor, how to measure, when to analyse, who is responsible, when results are evaluated; retaining documented evidence
- Clause 9.2: Internal audit — audit programme requirements, audit criteria and scope, auditor independence (cannot audit own work), reporting results to management, retaining documented information
- Clause 9.3: Management review — mandatory inputs (9.3.2: status of previous actions, changes to issues/needs, performance data, nonconformities, audit results, opportunities for improvement), mandatory outputs (decisions, resources, continual improvement actions)
- Clause 10.1: Nonconformity and corrective action — react to nonconformity (contain + correct), evaluate root cause, implement corrective action, review effectiveness, update documented information, retain records
- Clause 10.2: Continual improvement — improving ISMS suitability, adequacy, and effectiveness on an ongoing proactive basis (distinct from reactive corrective action)
- Distinction between correction (fixing the symptom) vs. corrective action (fixing the root cause)
- Internal audit independence: auditors must not audit their own work but may be employed by the same organization
- Management review frequency: standard requires "at planned intervals" — not prescribed as annual

SCENARIO STYLES:
- "An organization conducts its management review but the agenda does not include a review of information security objectives performance. Which specific Clause 9.3 input is missing?"
- "An internal auditor who designed the access control procedure is asked to audit it. What is the correct response and why?"
- "A security incident reveals that encrypted laptop policies were bypassed for 6 months. The organization replaces the laptops. What additional Clause 10.1 action is missing?"
- "An ISMS Manager tracks security incidents quarterly but retains no analysis of trends. What Clause 9.1 requirement is not met?"
- "What is the key distinction between continual improvement (Clause 10.2) and corrective action (Clause 10.1)?"

DISTRACTOR DESIGN GUIDANCE:
- Common confusion: correction ≠ corrective action — correction addresses the symptom; corrective action addresses root cause
- Common confusion: management review inputs (9.3.2) vs. outputs (9.3.3) — outputs must include decisions and resource commitments
- Common confusion: internal audit independence — auditor cannot audit their OWN work but can be employed by the same organization (internal auditor)
- Common confusion: "planned intervals" (9.2) does not mean annual — the organization determines frequency based on risk
- Common confusion: continual improvement (10.2) is proactive ISMS-level improvement, not fixing individual incidents
- Common confusion: after a nonconformity, both documented evidence of the nonconformity AND of the corrective action taken must be retained

${buildSchemaInstruction(TRACK, THREAD, ID_PREFIX, startSeq)}`

  return { systemPrompt, userPrompt }
}

module.exports = { buildPrompt, DOMAIN, THREAD, TRACK }
