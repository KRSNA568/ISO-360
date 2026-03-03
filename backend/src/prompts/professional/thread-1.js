/**
 * Professional Track — Thread 1
 * Domain: Annex A.5 — Organizational Controls (37 controls)
 */
const { buildSystemPrompt, buildSchemaInstruction } = require('../promptBuilder')

const DOMAIN    = 'Annex A.5 — Organizational Controls'
const TRACK     = 'professional'
const THREAD    = 1
const ID_PREFIX = 'P'

function buildPrompt(startSeq = 1, questionsCount = 10) {
  const systemPrompt = buildSystemPrompt(questionsCount)

  const userPrompt = `Generate exactly ${questionsCount} ISO 27001:2022 Professional-level examination questions for the following domain:

DOMAIN: ${DOMAIN}
THREAD: ${THREAD} of 5
TRACK: Professional (experienced ISMS managers, lead implementers, and senior security practitioners)

DIFFICULTY EXPECTATION: Applied professional judgment. Scenarios test control selection rationale, implementation adequacy, Statement of Applicability (SoA) decisions, and auditing of organizational controls in complex environments.

TOPICS TO COVER (spread across all ${questionsCount} questions, drawing from Annex A.5's 37 controls):
- A.5.1: Policies for information security (top-level and topic-specific policies, policy review triggers, approval authority)
- A.5.2: Information security roles and responsibilities (who owns what; RACI clarity; CISO vs. data owner vs. system owner)
- A.5.3: Segregation of duties (conflict of interest scenarios; compensating controls where full segregation is not feasible)
- A.5.5: Contact with authorities and special interest groups (when and how to maintain contact; breach notification obligations)
- A.5.7: Threat intelligence (new in 2022 — collecting, analysing and using threat intelligence to inform controls)
- A.5.8: Information security in project management (embedding security requirements from project inception; ISMS integration with SDLC and PMO)
- A.5.9 & A.5.10: Asset inventory and acceptable use (what constitutes acceptable use; owner accountability)
- A.5.12–A.5.14: Information classification, labelling, and transfer (classification scheme design; handling classified information across boundaries)
- A.5.19–A.5.22: Supplier relationships (security in agreements; ICT supply chain; monitoring supplier services; change management)
- A.5.23: Information security for use of cloud services (new in 2022 — cloud-specific security requirements, shared responsibility model)
- A.5.24–A.5.28: Incident management lifecycle (preparation, detection, classification, response, evidence collection, post-incident review)
- A.5.29–A.5.30: Business continuity and ICT readiness (BCP/ISMS integration; ICT readiness for business continuity — new in 2022)

SCENARIO STYLES:
- "An organization's SoA excludes A.5.23 (cloud services) because 'we own our own data centre'. An auditor reviews this exclusion. What evidence should the auditor examine?"
- "The Head of IT is responsible for implementing all Annex A.5 controls AND for reviewing their own implementation effectiveness. Which control principle is violated?"
- "A threat intelligence subscription is purchased but feeds are not reviewed or actioned for 6 months. Which A.5 control is not being met and what is the auditor's likely finding type?"
- "An organization's information classification scheme has four levels but no labelling procedure exists. Which two controls are implicated?"

DISTRACTOR DESIGN GUIDANCE:
- A.5.7 (threat intelligence) is NEW in 2022 — many candidates incorrectly map it to risk assessment (Clause 6.1.2); it is a distinct Annex A control
- A.5.23 (cloud services) is also NEW in 2022 — distinguish from general supplier controls (A.5.19–A.5.22)
- Segregation of duties (A.5.3) requires compensating controls when full segregation is impractical (small teams) — exclusion with no compensating control is a nonconformity
- Incident management controls (A.5.24–A.5.28) form a lifecycle — ensure candidates understand sequencing
- SoA exclusions require justification — auditors must verify that excluded controls genuinely do not apply (not just inconvenient)

${buildSchemaInstruction(TRACK, THREAD, ID_PREFIX, startSeq, questionsCount)}`

  return { systemPrompt, userPrompt }
}

module.exports = { buildPrompt, DOMAIN, THREAD, TRACK }
