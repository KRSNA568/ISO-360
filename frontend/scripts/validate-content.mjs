/**
 * Build-time checks for the Annex A content library (src/data/annexA.js).
 * Fails the build (exit 1) on any problem so bad content never ships.
 *
 *   - every control id is a real ISO/IEC 27001:2022 Annex A id
 *   - any theme that has entries is complete (no gaps), and nothing is duplicated
 *   - every required field is present and non-empty
 *   - related ids are real Annex A ids and not self-references
 */
import { CONTROLS, THEMES } from '../src/data/annexA.js'

const errors = []
const fail = (msg) => errors.push(msg)

const validIds = new Set()
for (const theme of Object.values(THEMES)) {
  for (let n = theme.range[0]; n <= theme.range[1]; n++) {validIds.add(`${theme.prefix}.${n}`)}
}

const seenIds   = new Set()
const seenSlugs = new Set()
for (const c of CONTROLS) {
  const where = `control ${c.id ?? '(no id)'}`
  if (!validIds.has(c.id)) {fail(`${where}: not an ISO 27001:2022 Annex A id`)}
  if (seenIds.has(c.id)) {fail(`${where}: duplicate id`)}
  if (seenSlugs.has(c.slug)) {fail(`${where}: duplicate slug ${c.slug}`)}
  seenIds.add(c.id)
  seenSlugs.add(c.slug)

  const theme = THEMES[c.theme]
  if (!theme || !c.id.startsWith(`${theme.prefix}.`)) {fail(`${where}: theme "${c.theme}" does not match id`)}

  for (const field of ['title', 'purpose']) {
    if (typeof c[field] !== 'string' || c[field].trim().length < 3) {fail(`${where}: missing ${field}`)}
  }
  const minItems = { implement: 3, evidence: 3, ncs: 2 }
  for (const [field, min] of Object.entries(minItems)) {
    const list = c[field]
    if (!Array.isArray(list) || list.length < min || list.some((s) => typeof s !== 'string' || !s.trim())) {
      fail(`${where}: ${field} needs at least ${min} non-empty items`)
    }
  }
  for (const r of c.related || []) {
    if (!validIds.has(r)) {fail(`${where}: related id ${r} is not an Annex A id`)}
    if (r === c.id) {fail(`${where}: related to itself`)}
  }
}

for (const [key, theme] of Object.entries(THEMES)) {
  const present = CONTROLS.filter((c) => c.theme === key).length
  const expected = theme.range[1] - theme.range[0] + 1
  if (present > 0 && present !== expected) {
    fail(`theme ${key}: ${present}/${expected} controls — a published theme must be complete`)
  }
}

if (errors.length) {
  console.error(`✗ Annex A content validation failed (${errors.length}):\n  - ${errors.join('\n  - ')}`)
  process.exit(1)
}
console.log(`✓ Annex A content valid: ${CONTROLS.length} controls`)
