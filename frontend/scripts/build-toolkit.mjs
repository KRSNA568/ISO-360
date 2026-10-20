/**
 * Generates the free toolkit downloads into public/toolkit/ from the template
 * catalogue (src/data/toolkit.js) and the reference libraries (src/data/annexA.js,
 * src/data/clauses.js, src/data/toolkitRows.js).
 *
 * Running it from the data means the Statement of Applicability always carries
 * every Annex A control, and the audit and gap sheets always cover every clause
 * requirement — a control or clause added to the library turns up in the
 * downloads on the next build.
 *
 * Runs before `vite build`, so Vite copies the result into dist/ with the rest
 * of public/. The generated files are committed so `npm run dev` serves them too.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { CONTROLS, THEMES } from '../src/data/annexA.js'
import { CLAUSES } from '../src/data/clauses.js'
import { TEMPLATES } from '../src/data/toolkit.js'
import { CLAUSE_CHECKS, NC_EXAMPLES, RISK_EXAMPLES, THEME_CHECKS } from '../src/data/toolkitRows.js'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const OUT  = path.join(ROOT, 'public', 'toolkit')

const BLANK_ROWS = 20

// Excel on Windows needs the BOM to read UTF-8; RFC 4180 wants CRLF.
const BOM = '﻿'
const EOL = '\r\n'

/** Cells that start with these would be read as a formula by a spreadsheet. */
const FORMULA_START = /^[=+@\t\r]/

function csvCell(value) {
  const s = String(value ?? '')
  if (FORMULA_START.test(s)) {
    throw new Error(`cell would be read as a spreadsheet formula: ${JSON.stringify(s.slice(0, 40))}`)
  }
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

function toCsv(columns, rows) {
  for (const [i, row] of rows.entries()) {
    if (row.length !== columns.length) {
      throw new Error(`row ${i + 1} has ${row.length} cells, expected ${columns.length}`)
    }
  }
  const lines = [columns.map((c) => c.name), ...rows].map((row) => row.map(csvCell).join(','))
  return BOM + lines.join(EOL) + EOL
}

function blanks(count, width) {
  return Array.from({ length: count }, () => Array.from({ length: width }, () => ''))
}

function themeLabel(key) {
  return THEMES[key].label
}

function themeRef(key) {
  const { prefix, range } = THEMES[key]
  return `A.${prefix}.${range[0]}–A.${prefix}.${range[1]}`
}

/** Controls in theme order, so the sheet reads like Annex A itself. */
function controlsInThemeOrder() {
  return Object.keys(THEMES).flatMap((key) => CONTROLS.filter((c) => c.theme === key))
}

function subclauseRows(build) {
  return CLAUSES.flatMap((clause) =>
    clause.subclauses.map((sub) => build(clause, sub, CLAUSE_CHECKS[sub.id])),
  )
}

const BUILDERS = {
  'statement-of-applicability': (columns) =>
    toCsv(columns, controlsInThemeOrder().map((c) => [
      `A.${c.id}`, c.title, themeLabel(c.theme), '', '', '', '', '', '', '',
    ])),

  'risk-register': (columns) =>
    toCsv(columns, [...RISK_EXAMPLES, ...blanks(BLANK_ROWS, columns.length)]),

  'internal-audit-checklist': (columns) =>
    toCsv(columns, [
      ...subclauseRows((clause, sub, check) => [
        sub.id, `Clause ${clause.number} — ${clause.title}`, check.question, check.good,
        '', clause.evidence.join('; '), '', '', '', '', '', '',
      ]),
      ...Object.keys(THEMES).map((key) => [
        themeRef(key), `Annex A — ${themeLabel(key)}`, THEME_CHECKS[key].question,
        THEME_CHECKS[key].good, '', THEME_CHECKS[key].evidence, '', '', '', '', '', '',
      ]),
    ]),

  'gap-assessment': (columns) =>
    toCsv(columns, [
      ...subclauseRows((clause, sub, check) => [
        sub.id, `Clause ${clause.number} — ${clause.title}`, sub.summary, check.good,
        '', '', '', '', '', '', '', '',
      ]),
      ...controlsInThemeOrder().map((c) => [
        `A.${c.id}`, `Annex A — ${themeLabel(c.theme)}`, c.purpose, c.evidence.slice(0, 2).join('; '),
        '', '', '', '', '', '', '', '',
      ]),
    ]),

  'nonconformity-corrective-action-log': (columns) =>
    toCsv(columns, [...NC_EXAMPLES, ...blanks(BLANK_ROWS, columns.length)]),

  'management-review-agenda': (_columns, template) => {
    const lines = [
      '# Management review — agenda and minutes',
      '',
      'ISO/IEC 27001:2022 Clause 9.3. Fill this in during the meeting so the completed',
      'file is the record. Free template from https://27001certified.in/iso-27001/toolkit',
      '',
      '| | |',
      '| --- | --- |',
      '| **Date** | |',
      '| **Time / location** | |',
      '| **Chair** | |',
      '| **Attendees** | |',
      '| **Apologies** | |',
      '| **Period under review** | |',
      '',
      '---',
      '',
    ]
    template.agenda.forEach((entry, i) => {
      lines.push(
        `## ${i + 1}. ${entry.item}`,
        '',
        entry.prompt,
        '',
        `- **Presented by:** ${entry.who}`,
        `- **Evidence to bring:** ${entry.evidence}`,
        '',
        '**Discussion**',
        '',
        '> ',
        '',
        '**Decisions**',
        '',
        '> ',
        '',
        '**Actions** — owner and date for each',
        '',
        '| Action | Owner | Due |',
        '| --- | --- | --- |',
        '| | | |',
        '',
        '---',
        '',
      )
    })
    lines.push(
      '## Sign-off',
      '',
      'Minutes approved by (top management):',
      '',
      '| Name | Role | Date |',
      '| --- | --- | --- |',
      '| | | |',
      '',
      'Next review due: ',
      '',
    )
    return lines.join('\n')
  },
}

function readme(written) {
  return [
    '# Free ISO 27001:2022 toolkit',
    '',
    'Templates from https://27001certified.in/iso-27001/toolkit — free to use, adapt and',
    'share inside your organisation or with your clients. No attribution required, no signup.',
    '',
    '## Files',
    '',
    ...written.map(({ template, bytes }) =>
      `- \`${template.file}\` — ${template.name}. ${template.tagline} (${formatSize(bytes)})`),
    '',
    '## Before you start',
    '',
    'The CSV files open in Excel, Google Sheets, LibreOffice and Numbers. Save them in your',
    'own format once opened, so formulas and formatting survive.',
    '',
    'Suggested order: gap assessment first to see where you stand, then the risk register,',
    'then the Statement of Applicability (applicability follows from risk), then the audit',
    'checklist, corrective action log and management review agenda as the ISMS starts running.',
    '',
    '## Copyright',
    '',
    'Clause and control numbers and short control titles follow ISO/IEC 27001:2022. All',
    'guidance, questions and examples in these files are original material written for',
    '27001certified; no text is reproduced from ISO/IEC 27001, 27002 or 19011, which are',
    'copyrighted. Buy the standard from ISO or your national standards body — these',
    'templates help you apply it, they do not replace it.',
    '',
    'These templates are a starting point, not certification advice. You are responsible for',
    'whether what you record in them is true of your organisation.',
    '',
  ].join('\n')
}

function formatSize(bytes) {
  return bytes < 1024 ? `${bytes} B` : `${Math.round(bytes / 1024)} kB`
}

fs.rmSync(OUT, { recursive: true, force: true })
fs.mkdirSync(OUT, { recursive: true })

const written = []
for (const template of TEMPLATES) {
  const builder = BUILDERS[template.slug]
  if (!builder) {throw new Error(`no builder for template "${template.slug}"`)}
  const content = builder(template.columns, template)
  if (!content || content.length < 200) {throw new Error(`${template.file} came out empty`)}
  fs.writeFileSync(path.join(OUT, template.file), content)
  written.push({ template, bytes: Buffer.byteLength(content) })
}

fs.writeFileSync(path.join(OUT, 'README.md'), readme(written))

const total = written.reduce((n, w) => n + w.bytes, 0)
console.log(`✓ Toolkit: ${written.length} templates + README (${formatSize(total)}) → public/toolkit/`)
