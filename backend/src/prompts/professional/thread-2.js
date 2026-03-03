/**
 * Professional Track — Thread 2
 * Domain: Annex A.6 — People Controls & Annex A.7 — Physical Controls
 */
const { buildSystemPrompt, buildSchemaInstruction } = require('../promptBuilder')

const DOMAIN    = 'Annex A.6 — People Controls & Annex A.7 — Physical Controls'
const TRACK     = 'professional'
const THREAD    = 2
const ID_PREFIX = 'P'

function buildPrompt(startSeq = 1) {
  const systemPrompt = buildSystemPrompt()

  const userPrompt = `Generate exactly 10 ISO 27001:2022 Professional-level examination questions for the following domain:

DOMAIN: ${DOMAIN}
THREAD: ${THREAD} of 5
TRACK: Professional (experienced ISMS managers, lead implementers, and senior security practitioners)

DIFFICULTY EXPECTATION: Applied professional judgment on people security lifecycle and physical environment protection. Scenarios test control design, residual risk judgments, and audit adequacy assessment in realistic organizational settings.

PEOPLE CONTROLS — Annex A.6 (8 controls) TOPICS:
- A.6.1: Screening (pre-employment background verification — what is proportionate; legal constraints vary by country; high-risk roles; contractors and third parties)
- A.6.2: Terms and conditions of employment (information security responsibilities in contracts; non-disclosure; acceptable use obligations; consequences of breach)
- A.6.3: Information security awareness, education and training (programme design, role-based training, effectiveness measurement — NOTE: distinct from Clause 7.2/7.3 which cover planning; A.6.3 covers programme content and delivery)
- A.6.4: Disciplinary process (existence of a formal process; consistent application; deterrence effect as a control objective)
- A.6.5: Responsibilities after termination or change of employment (access revocation timelines; return of assets; ongoing confidentiality obligations; off-boarding procedures)
- A.6.6: Confidentiality and non-disclosure agreements (NDAs with employees, contractors, third parties; when required; what must be covered)
- A.6.7: Remote working (security requirements for working outside the office; BYOD controls; home network risks; monitoring obligations)
- A.6.8: Information security event reporting (encouraging staff to report — protection from blame; reporting channels; what constitutes a reportable event)

PHYSICAL CONTROLS — Annex A.7 (14 controls) TOPICS:
- A.7.1: Physical security perimeters (defining secure areas; suitability of barriers; alarm systems)
- A.7.2: Physical entry controls (authentication at entry — visitors, contractors; logs; escorting)
- A.7.3: Securing offices, rooms and facilities (protecting sensitive areas from unauthorized observation or access)
- A.7.4: Physical security monitoring (CCTV, alarm monitoring — new in 2022; privacy considerations)
- A.7.5: Protecting against physical and environmental threats (site risk assessment; flooding, fire, power failure)
- A.7.6: Working in secure areas (need-to-know access to server rooms; clean desk in secure zones)
- A.7.7: Clear desk and clear screen (policy requirements; evidence of compliance; compensating controls)
- A.7.8–A.7.10: Equipment siting, supporting utilities, and cabling security (power protection; cable management)
- A.7.11–A.7.14: Equipment maintenance, off-site assets, secure disposal, and unattended equipment (disposal procedures; data erasure standards; asset return)

SCENARIO STYLES:
- "A mid-sized financial firm does not conduct background screening for contractors who access production databases, citing contractual agency responsibility. How should the auditor evaluate this against A.6.1?"
- "An employee resigns. Their domain account is disabled on their last day but their VPN certificate is not revoked for two weeks. Which A.6.5 requirement is not met and what is the finding severity?"
- "A server room uses a standard office key held by the entire IT team. Visitor logs are not maintained. Which Annex A.7 controls are implicated?"
- "Physical security monitoring cameras cover the server room entrance but recordings are automatically deleted after 24 hours due to storage constraints. How should the auditor evaluate A.7.4 compliance?"

DISTRACTOR DESIGN GUIDANCE:
- A.6.3 (security awareness programme) ≠ Clause 7.3 (awareness obligation) — A.6.3 governs the programme design and delivery; Clause 7.3 is the operational requirement
- A.6.5 covers BOTH termination AND change of role — 'change' scenarios (promotions, transfers) are often missed
- A.7.4 (physical security monitoring) is NEW in 2022 — includes CCTV and intrusion detection; privacy considerations apply
- Secure disposal (A.7.14) requires verified data destruction, not just physical disposal — deleting files is insufficient
- Screening (A.6.1) applies proportionately — not all roles require the same depth; professionals must assess whether the level of screening is proportionate to the sensitivity of the role

${buildSchemaInstruction(TRACK, THREAD, ID_PREFIX, startSeq)}`

  return { systemPrompt, userPrompt }
}

module.exports = { buildPrompt, DOMAIN, THREAD, TRACK }
