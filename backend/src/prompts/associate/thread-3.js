/**
 * Associate Track — Thread 3
 * Domain: Support — Competence, Awareness & Communication (Clause 7)
 */
const { buildSystemPrompt, buildSchemaInstruction } = require('../promptBuilder')

const DOMAIN    = 'Support — Competence, Awareness & Communication (Clause 7)'
const TRACK     = 'associate'
const THREAD    = 3
const ID_PREFIX = 'A'

function buildPrompt(startSeq = 1, questionsCount = 10) {
  const systemPrompt = buildSystemPrompt(questionsCount)

  const userPrompt = `Generate exactly ${questionsCount} ISO 27001:2022 Associate-level examination questions for the following domain:

DOMAIN: ${DOMAIN}
THREAD: ${THREAD} of 5
TRACK: Associate (foundation-level practitioners and ISMS implementers)

TOPICS TO COVER (spread across all ${questionsCount} questions):
- Clause 7.1: Resources (human resources, infrastructure, environment, monitoring and measurement resources needed for the ISMS)
- Clause 7.2: Competence (determining required competence, providing competence through training/experience, evaluating effectiveness, retaining documented evidence of competence)
- Clause 7.3: Awareness (what persons must be aware of: security policy, their contribution to ISMS effectiveness, implications of not conforming with requirements)
- Clause 7.4: Communication (determining what to communicate, when, to whom, how, and who communicates — internal and external communication planning)
- Clause 7.5: Documented information (creating and updating documents; controlling documented information: distribution, access, retrieval, storage, version control; handling external documents)
- Difference between competence (ability to apply knowledge/skill) vs. awareness (knowing something exists and why it matters)
- What constitutes acceptable documented evidence of competence (certificates, records of experience, assessment records)
- Mandatory vs. optional documented information under Clause 7.5

SCENARIO STYLES:
- "An auditor interviews five staff members about the information security awareness programme. Two cannot explain why the policy applies to them personally. Which specific clause is potentially not met?"
- "An organization provides annual security training but retains only attendance records, not assessment results. What documented evidence gap is the auditor likely to raise?"
- "An ISMS Manager communicates security incidents to employees via email only. No procedure defines the communication approach. Which clause sub-requirement is at risk of nonconformance?"
- "A consultant hired to design the ISMS has no formal ISO 27001 training but has 10 years of ISMS experience. What must the organization retain to demonstrate Clause 7.2 compliance?"

DISTRACTOR DESIGN GUIDANCE:
- Common confusion: awareness (7.3) vs. competence (7.2) — awareness is knowing that something matters; competence is demonstrated ability to perform
- Common confusion: training delivery ≠ competence evaluation — the clause requires effectiveness evaluation, not just delivering training
- Common confusion: documented information under 7.5 includes both documents (controlled) and records (evidence) — auditors must distinguish them
- Common confusion: Clause 7.4 requires a communication PLAN (what/when/who/how) not just the act of communicating
- Common confusion: 7.3 awareness applies to ALL persons working under the organization's control, including contractors

${buildSchemaInstruction(TRACK, THREAD, ID_PREFIX, startSeq, questionsCount)}`

  return { systemPrompt, userPrompt }
}

module.exports = { buildPrompt, DOMAIN, THREAD, TRACK }
