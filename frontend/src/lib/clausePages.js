/** SEO metadata and paths for the ISO 27001 clause pages (Clauses 4–10). */

export const CLAUSES_PATH = '/iso-27001/clauses'

export function clausePath(clause) {
  return `${CLAUSES_PATH}/${clause.slug}`
}

export function clauseIndexSeo() {
  return {
    path: CLAUSES_PATH,
    title: 'ISO 27001:2022 Clauses 4–10 Explained — ISMS Requirements Guide',
    description:
      'Plain-English guide to the ISO 27001:2022 management system clauses 4–10: what each requires, ' +
      'the evidence auditors look for, and common nonconformities.',
  }
}

export function clauseSeo(clause) {
  return {
    path: clausePath(clause),
    title: `ISO 27001 Clause ${clause.number}: ${clause.title} — Requirements & Audit Guide`,
    description:
      `What ISO 27001:2022 Clause ${clause.number} (${clause.title}) requires, sub-clause by sub-clause, ` +
      'with the audit evidence auditors look for and common nonconformities.',
  }
}

export function clauseBreadcrumbs(clause) {
  return [
    { name: 'ISO 27001 clauses', path: CLAUSES_PATH },
    { name: `Clause ${clause.number} ${clause.title}`, path: clausePath(clause) },
  ]
}
