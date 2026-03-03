/**
 * Associate Track — Thread 2
 * Domain: Planning & Risk Assessment (Clause 6)
 */
const { buildSystemPrompt, buildSchemaInstruction } = require('../promptBuilder')

const DOMAIN    = 'Planning & Risk Assessment (Clause 6)'
const TRACK     = 'associate'
const THREAD    = 2
const ID_PREFIX = 'A'

function buildPrompt(startSeq = 1) {
  const systemPrompt = buildSystemPrompt()

  const userPrompt = `Generate exactly 10 ISO 27001:2022 Associate-level examination questions for the following domain:

DOMAIN: ${DOMAIN}
THREAD: ${THREAD} of 5
TRACK: Associate (foundation-level practitioners and ISMS implementers)

TOPICS TO COVER (spread across all 10 questions):
- Clause 6.1.1: Actions to address risks and opportunities (general requirements linking context → planning)
- Clause 6.1.2: Information security risk assessment (risk criteria, risk identification, risk analysis, risk evaluation)
- Clause 6.1.3: Information security risk treatment (options: modify, retain, avoid, share; selecting controls; Statement of Applicability)
- Clause 6.2: Information security objectives (measurable, monitored, communicated, updated, plans to achieve them)
- ISO 31000 relationship to ISO 27001 risk process (not required but commonly tested)
- Annex A controls applicability and how they appear in the SoA

SCENARIO STYLES:
- "An organization's risk register lists [asset/threat/vulnerability]. What critical element is missing?"
- "Which statement about the Statement of Applicability (SoA) is correct?"
- "A risk treatment plan specifies [action]. Which risk treatment option does this represent?"
- "The ISMS team has set an objective to reduce phishing incidents by 30% in 12 months. Which clause requirement is most directly being addressed?"

DISTRACTOR DESIGN GUIDANCE:
- Common confusion: risk assessment vs. risk treatment (which comes first, what each produces)
- Common confusion: risk acceptance vs. risk retention vs. risk tolerance
- Common confusion: thinking SoA must include ALL Annex A controls selected (it must justify inclusion OR exclusion)
- Common confusion: conflating risk criteria with risk appetite
- Common confusion: objectives must be "achievable" (ISO 27001 says "measurable where practicable", not universally achievable)

${buildSchemaInstruction(TRACK, THREAD, ID_PREFIX, startSeq)}`

  return { systemPrompt, userPrompt }
}

module.exports = { buildPrompt, DOMAIN, THREAD, TRACK }
