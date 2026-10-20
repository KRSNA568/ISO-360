/**
 * Build-time checks for the ISO 27001 reference library (src/data/annexA.js,
 * src/data/clauses.js).
 * Fails the build (exit 1) on any problem so bad content never ships.
 *
 *   - every control id is a real ISO/IEC 27001:2022 Annex A id
 *   - all 93 controls are present across the four themes, and nothing is duplicated
 *   - every required field is present and non-empty
 *   - related ids are real Annex A ids and not self-references
 *   - clauses 4–10 are all present, sub-clauses belong to their clause, fields
 *     are non-empty and related control ids exist
 */
import { CONTROLS, THEMES } from '../src/data/annexA.js'
import { CLAUSES } from '../src/data/clauses.js'

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
  if (present !== expected) {
    fail(`theme ${key}: ${present}/${expected} controls — every theme must be complete`)
  }
}

const clauseNumbers = CLAUSES.map((c) => c.number).join(',')
if (clauseNumbers !== '4,5,6,7,8,9,10') {fail(`clauses must be 4–10 in order, got ${clauseNumbers}`)}
for (const c of CLAUSES) {
  const where = `clause ${c.number}`
  for (const field of ['title', 'intro']) {
    if (typeof c[field] !== 'string' || c[field].trim().length < 3) {fail(`${where}: missing ${field}`)}
  }
  if (!Array.isArray(c.subclauses) || c.subclauses.length === 0) {fail(`${where}: no sub-clauses`)}
  for (const sub of c.subclauses || []) {
    if (!sub.id?.startsWith(`${c.number}.`)) {fail(`${where}: sub-clause ${sub.id} does not belong to it`)}
    if (!sub.title?.trim() || !sub.summary?.trim()) {fail(`${where}: sub-clause ${sub.id} is missing title or summary`)}
  }
  for (const field of ['evidence', 'ncs']) {
    if (!Array.isArray(c[field]) || c[field].length < 2 || c[field].some((x) => !x?.trim())) {
      fail(`${where}: ${field} needs at least 2 non-empty items`)
    }
  }
  for (const id of c.controls || []) {
    if (!validIds.has(id)) {fail(`${where}: related control ${id} is not an Annex A id`)}
  }
}

if (errors.length) {
  console.error(`✗ Annex A content validation failed (${errors.length}):\n  - ${errors.join('\n  - ')}`)
  process.exit(1)
}
console.log(`✓ Reference content valid: ${CONTROLS.length} controls, ${CLAUSES.length} clauses`)
