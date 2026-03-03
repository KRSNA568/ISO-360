/**
 * Professional Track — Thread 3
 * Domain: Annex A.8 — Technological Controls (34 controls)
 */
const { buildSystemPrompt, buildSchemaInstruction } = require('../promptBuilder')

const DOMAIN    = 'Annex A.8 — Technological Controls'
const TRACK     = 'professional'
const THREAD    = 3
const ID_PREFIX = 'P'

function buildPrompt(startSeq = 1, questionsCount = 10) {
  const systemPrompt = buildSystemPrompt(questionsCount)

  const userPrompt = `Generate exactly ${questionsCount} ISO 27001:2022 Professional-level examination questions for the following domain:

DOMAIN: ${DOMAIN}
THREAD: ${THREAD} of 5
TRACK: Professional (experienced ISMS managers, lead implementers, and senior security practitioners)

DIFFICULTY EXPECTATION: Deep technical and operational knowledge. Questions test the ability to select, implement, evaluate, and audit Annex A.8 technological controls in complex, real-world organizational environments. Distractors require genuine technical understanding to eliminate.

TOPICS TO COVER (spread across all ${questionsCount} questions, drawing from Annex A.8's 34 controls):
- A.8.1: User endpoint devices (BYOD policies, MDM, endpoint encryption, lost/stolen device procedures)
- A.8.2: Privileged access rights (PAM solutions, just-in-time access, least privilege principle, regular review of privileged accounts)
- A.8.3: Information access restriction (role-based access control; need-to-know; database query restrictions)
- A.8.4: Access to source code (who can read/modify; code repository access controls; developer privilege separation)
- A.8.5: Secure authentication (MFA implementation; password policy requirements; SSO risks and benefits; phishing-resistant authentication)
- A.8.7: Protection against malware (layered defences; EDR vs. traditional AV; user awareness as compensating control; malware response procedures)
- A.8.9: Configuration management (baseline configurations; CIS benchmarks; configuration drift detection; hardening standards)
- A.8.10: Information deletion (secure deletion standards; deletion from cloud storage; end-of-life media handling)
- A.8.11: Data masking (new in 2022 — when required; pseudonymisation vs. anonymisation; test environment data handling)
- A.8.12: Data leakage prevention (new in 2022 — DLP tool categories: network, endpoint, cloud; classification-driven rules)
- A.8.15: Logging (what events must be logged; log integrity protection; log retention periods; SIEM correlation)
- A.8.16: Monitoring activities (new in 2022 — continuous monitoring; anomaly detection; alert thresholds)
- A.8.20–A.8.21: Network security and network services (segmentation; zero trust architecture mapping; DMZ design; network services agreements)
- A.8.25–A.8.28: Secure development lifecycle (security requirements; secure design principles; secure coding; security testing — SAST/DAST/pen test)
- A.8.32: Change management (change control for IS systems — distinct from ITIL change management but conceptually aligned)
- A.8.34: Protection of information systems during audit testing (read-only access; test environment isolation; pen test scope agreements)

SCENARIO STYLES:
- "A SIEM is configured to retain logs for 30 days. A regulatory investigation requires 90-day-old log evidence. Which A.8 control is implicated and what is the finding type?"
- "Developers have full read/write access to production databases to expedite bug fixing. Operations has no equivalent access. Which Annex A.8 controls are potentially violated?"
- "An organization's test environment is populated with a copy of live customer data. Which 2022-new A.8 controls are directly relevant to this finding?"
- "A penetration tester is given domain admin credentials to 'speed up' testing. Which A.8.34 principle is violated and what is the risk?"

DISTRACTOR DESIGN GUIDANCE:
- A.8.2 (privileged access rights) ≠ A.8.5 (secure authentication) — access rights management is about WHAT you can access; authentication is about PROVING who you are
- Log integrity (A.8.15) requires that logs cannot be altered by the very administrators who manage the systems — a common implementation gap
- A.8.11 (data masking) and A.8.12 (DLP) are both NEW in 2022 — test candidates know these exist
- A.8.28 (secure coding) applies to both in-house AND outsourced development — scope of applicability is commonly misunderstood
- Configuration management (A.8.9) is not the same as change management (A.8.32) — configuration = baseline state; change = managed deviation from baseline
- Zero trust is not mandated by name but maps to multiple controls: A.8.2, A.8.5, A.8.20 — professionals must map architectural patterns to controls

${buildSchemaInstruction(TRACK, THREAD, ID_PREFIX, startSeq, questionsCount)}`

  return { systemPrompt, userPrompt }
}

module.exports = { buildPrompt, DOMAIN, THREAD, TRACK }
