/** SEO metadata and paths for the Annex A library pages. */
import { THEMES } from '@/data/annexA'

export const ANNEX_A_PATH = '/iso-27001/annex-a'

export function controlPath(control) {
  return `${ANNEX_A_PATH}/${control.slug}`
}

export function annexIndexSeo() {
  return {
    path: ANNEX_A_PATH,
    title: 'ISO 27001:2022 Annex A Controls — All 93 Explained',
    description:
      'Plain-English guide to every ISO 27001:2022 Annex A control: what each is for, how to implement it, ' +
      'the audit evidence auditors ask for, and common nonconformities.',
  }
}

export function controlSeo(control) {
  return {
    path: controlPath(control),
    title: `ISO 27001 A.${control.id} ${control.title} — Implementation & Audit Guide`,
    description:
      `How to implement ISO 27001:2022 Annex A ${control.id} ${control.title}: purpose, practical steps, ` +
      'audit evidence and common nonconformities.',
  }
}

export function controlBreadcrumbs(control) {
  return [
    { name: 'Annex A controls', path: ANNEX_A_PATH },
    { name: THEMES[control.theme].label, path: `${ANNEX_A_PATH}#${control.theme}` },
    { name: `A.${control.id} ${control.title}`, path: controlPath(control) },
  ]
}
