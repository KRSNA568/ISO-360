/**
 * Associate Track — Thread 1
 * Domain: Context of the Organization & Scope (Clauses 4–5)
 */
const { buildSystemPrompt, buildSchemaInstruction } = require('../promptBuilder')

const DOMAIN = 'Context of the Organization & Scope (Clauses 4–5)'
const TRACK  = 'associate'
const THREAD = 1
const ID_PREFIX = 'A'

/**
 * @param {number} [startSeq=1] - starting ID sequence number
 * @returns {{ systemPrompt: string, userPrompt: string }}
 */
function buildPrompt(startSeq = 1) {
  const systemPrompt = buildSystemPrompt()

  const userPrompt = `Generate exactly 10 ISO 27001:2022 Associate-level examination questions for the following domain:

DOMAIN: ${DOMAIN}
THREAD: ${THREAD} of 5
TRACK: Associate (foundation-level practitioners and ISMS implementers)

TOPICS TO COVER (spread across all 10 questions):
- Clause 4.1: Understanding the organization and its context (internal/external issues using PESTLE, SWOT)
- Clause 4.2: Understanding needs and expectations of interested parties (stakeholder mapping, applicable requirements)
- Clause 4.3: Determining the scope of the ISMS (inclusions, exclusions, interfaces, dependencies)
- Clause 4.4: The ISMS as a process system (how context feeds into the ISMS design)
- Clause 5.1: Leadership and commitment (evidence of top management involvement)
- Clause 5.2: Information security policy (content requirements, communication, availability)
- Clause 5.3: Organizational roles, responsibilities and authorities (CISO vs. ISMS Manager vs. data owner distinctions)

SCENARIO STYLES (use a mix):
- "A lead auditor reviewing [evidence type] observes [finding]. What does this indicate?"
- "An organization has [situation]. What should the ISMS scope document specify?"
- "Which of the following best demonstrates that top management has fulfilled Clause 5.1 requirements?"
- "An interested party has requested [requirement]. Under Clause 4.2, what must the organization do?"

DISTRACTOR DESIGN GUIDANCE:
- Common confusion: mixing Clause 4.1 (context) with Clause 6.1 (risk)
- Common confusion: conflating "scope" with "boundaries and applicability"
- Common confusion: treating interested parties' expectations as all legally binding
- Common confusion: confusing policy content requirements (Clause 5.2) with objectives (Clause 6.2)

${buildSchemaInstruction(TRACK, THREAD, ID_PREFIX, startSeq)}`

  return { systemPrompt, userPrompt }
}

module.exports = { buildPrompt, DOMAIN, THREAD, TRACK }
