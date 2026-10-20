/**
 * Build-time checks for the ISO 27001 reference library (src/data/annexA.js,
 * src/data/clauses.js) and the free toolkit (src/data/toolkit.js,
 * src/data/toolkitRows.js).
 * Fails the build (exit 1) on any problem so bad content never ships.
 *
 *   - every control id is a real ISO/IEC 27001:2022 Annex A id
 *   - all 93 controls are present across the four themes, and nothing is duplicated
 *   - every required field is present and non-empty
 *   - related ids are real Annex A ids and not self-references
 *   - clauses 4–10 are all present, sub-clauses belong to their clause, fields
 *     are non-empty and related control ids exist
 *   - every toolkit template has its guidance, columns and cross-links, every
 *     clause requirement has an audit question, worked example rows are the
 *     right width, and the generated download exists in public/toolkit/
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { CONTROLS, THEMES } from '../src/data/annexA.js'
import { CLAUSES } from '../src/data/clauses.js'
import { TEMPLATES } from '../src/data/toolkit.js'
import { CLAUSE_CHECKS, NC_EXAMPLES, RISK_EXAMPLES, THEME_CHECKS } from '../src/data/toolkitRows.js'

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

const TOOLKIT_DIR = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'toolkit')

const seenTemplateSlugs = new Set()
const seenTemplateFiles = new Set()
for (const t of TEMPLATES) {
  const where = `template ${t.slug ?? '(no slug)'}`
  if (!/^[a-z0-9-]+$/.test(t.slug || '')) {fail(`${where}: slug must be lower-case kebab-case`)}
  if (seenTemplateSlugs.has(t.slug)) {fail(`${where}: duplicate slug`)}
  if (seenTemplateFiles.has(t.file)) {fail(`${where}: duplicate file name ${t.file}`)}
  seenTemplateSlugs.add(t.slug)
  seenTemplateFiles.add(t.file)

  for (const field of ['file', 'format', 'name', 'tagline', 'summary', 'reference', 'rowsNote']) {
    if (typeof t[field] !== 'string' || t[field].trim().length < 3) {fail(`${where}: missing ${field}`)}
  }
  for (const field of ['whatsInside', 'howToUse']) {
    const list = t[field]
    if (!Array.isArray(list) || list.length < 3 || list.some((x) => typeof x !== 'string' || !x.trim())) {
      fail(`${where}: ${field} needs at least 3 non-empty items`)
    }
  }

  // A CSV template needs columns; a document template needs an agenda instead.
  if (t.format === 'CSV') {
    if (!Array.isArray(t.columns) || t.columns.length < 3) {fail(`${where}: CSV templates need at least 3 columns`)}
    if (!t.file.endsWith('.csv')) {fail(`${where}: format CSV but file is ${t.file}`)}
  } else if (!Array.isArray(t.agenda) || t.agenda.length < 3) {
    fail(`${where}: document templates need at least 3 agenda items`)
  }

  const seenColumns = new Set()
  for (const col of t.columns || []) {
    if (!col.name?.trim() || !col.help?.trim()) {fail(`${where}: column ${col.name ?? '(unnamed)'} is missing name or help`)}
    if (seenColumns.has(col.name)) {fail(`${where}: duplicate column ${col.name}`)}
    seenColumns.add(col.name)
  }
  for (const entry of t.agenda || []) {
    for (const field of ['item', 'prompt', 'who', 'evidence']) {
      if (!entry[field]?.trim()) {fail(`${where}: agenda item "${entry.item ?? '?'}" is missing ${field}`)}
    }
  }

  for (const number of t.related?.clauses || []) {
    if (!CLAUSES.some((c) => c.number === number)) {fail(`${where}: related clause ${number} does not exist`)}
  }
  for (const id of t.related?.controls || []) {
    if (!validIds.has(id)) {fail(`${where}: related control ${id} is not an Annex A id`)}
  }

  // The download is generated by scripts/build-toolkit.mjs, which runs first.
  const file = path.join(TOOLKIT_DIR, t.file || '')
  if (!t.file || !fs.existsSync(file)) {
    fail(`${where}: public/toolkit/${t.file} is missing — run scripts/build-toolkit.mjs`)
  } else if (fs.statSync(file).size < 200) {
    fail(`${where}: public/toolkit/${t.file} is suspiciously small`)
  }
}

for (const clause of CLAUSES) {
  for (const sub of clause.subclauses) {
    const check = CLAUSE_CHECKS[sub.id]
    if (!check) {
      fail(`toolkit: sub-clause ${sub.id} has no audit question in src/data/toolkitRows.js`)
    } else if (!check.question?.trim() || !check.good?.trim()) {
      fail(`toolkit: audit question for ${sub.id} is missing question or good`)
    }
  }
}
const subclauseIds = new Set(CLAUSES.flatMap((c) => c.subclauses.map((s) => s.id)))
for (const id of Object.keys(CLAUSE_CHECKS)) {
  if (!subclauseIds.has(id)) {fail(`toolkit: audit question ${id} is not a sub-clause of Clauses 4–10`)}
}
for (const key of Object.keys(THEMES)) {
  const check = THEME_CHECKS[key]
  if (!check?.question?.trim() || !check?.good?.trim() || !check?.evidence?.trim()) {
    fail(`toolkit: Annex A theme "${key}" has no complete sampling row in src/data/toolkitRows.js`)
  }
}

// Worked example rows are written positionally, so a column added to the
// catalogue without updating them would silently shift every value.
const exampleSets = [
  ['risk-register', RISK_EXAMPLES],
  ['nonconformity-corrective-action-log', NC_EXAMPLES],
]
for (const [slug, rows] of exampleSets) {
  const template = TEMPLATES.find((t) => t.slug === slug)
  if (!template) {fail(`toolkit: no template "${slug}" for its worked examples`); continue}
  if (rows.length < 1) {fail(`toolkit: ${slug} has no worked example rows`)}
  for (const [i, row] of rows.entries()) {
    if (row.length !== template.columns.length) {
      fail(`toolkit: ${slug} example row ${i + 1} has ${row.length} cells, expected ${template.columns.length}`)
    }
  }
}

if (errors.length) {
  console.error(`✗ Content validation failed (${errors.length}):\n  - ${errors.join('\n  - ')}`)
  process.exit(1)
}
console.log(
  `✓ Reference content valid: ${CONTROLS.length} controls, ${CLAUSES.length} clauses, ` +
  `${TEMPLATES.length} toolkit templates`,
)
