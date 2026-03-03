/**
 * Associate Track — Thread 4
 * Domain: Operational Planning & Control (Clause 8)
 */
const { buildSystemPrompt, buildSchemaInstruction } = require('../promptBuilder')

const DOMAIN    = 'Operational Planning & Control (Clause 8)'
const TRACK     = 'associate'
const THREAD    = 4
const ID_PREFIX = 'A'

function buildPrompt(startSeq = 1) {
  const systemPrompt = buildSystemPrompt()

  const userPrompt = `Generate exactly 10 ISO 27001:2022 Associate-level examination questions for the following domain:

DOMAIN: ${DOMAIN}
THREAD: ${THREAD} of 5
TRACK: Associate (foundation-level practitioners and ISMS implementers)

TOPICS TO COVER (spread across all 10 questions):
- Clause 8.1: Operational planning and control — planning processes to meet ISMS requirements, implementing plans, controlling planned changes, managing unintended changes, ensuring outsourced processes are controlled
- Clause 8.2: Information security risk assessment — executing the risk assessment process defined in Clause 6.1.2 at planned intervals or when significant changes occur; retaining documented results
- Clause 8.3: Information security risk treatment — executing the risk treatment plan defined in Clause 6.1.3; retaining documented results of risk treatment
- Relationship between Clause 8 and Clause 6: Clause 6 defines the process (planning); Clause 8 executes it (doing)
- Outsourced process control: what organizations must specify and verify for externally provided processes, products, and services affecting ISMS
- Trigger events for re-running risk assessments (significant changes, incidents, new services, organizational restructuring)
- Documented information requirements specific to Clause 8 (risk assessment results, risk treatment plan results)
- Distinction between planned changes (managed under change control) vs. unintended changes (require review and mitigation)

SCENARIO STYLES:
- "An organization acquires a new business unit with its own IT systems. Under Clause 8.1, what must the ISMS manager do before integrating the unit into the existing ISMS scope?"
- "A cloud migration is completed without updating the risk register. Under Clause 8.2, what has been missed?"
- "The organization's risk treatment plan specifies deploying endpoint detection tools by Q2. It is now Q4 and deployment has not occurred. What Clause 8 finding does this represent?"
- "An auditor asks to see evidence that a risk assessment was conducted after a major system change six months ago. The ISMS manager says 'we do it annually'. What clause requirement may be not met?"

DISTRACTOR DESIGN GUIDANCE:
- Common confusion: Clause 8.2 is operational execution of risk assessment (not the method design — that is Clause 6.1.2)
- Common confusion: risk treatment plan (output of Clause 6.1.3) vs. risk treatment results (records from Clause 8.3) — both must be retained as documented information
- Common confusion: outsourced processes remain within scope — Clause 8.1 requires that controls applied to them are specified, not that they are excluded
- Common confusion: change management trigger for re-assessment — ISO 27001 says "at planned intervals AND when significant changes occur" — both conditions exist
- Common confusion: Clause 8.3 requires implementing the treatment plan AND retaining results — simply having a plan is insufficient

${buildSchemaInstruction(TRACK, THREAD, ID_PREFIX, startSeq)}`

  return { systemPrompt, userPrompt }
}

module.exports = { buildPrompt, DOMAIN, THREAD, TRACK }
