/** SEO metadata and paths for the free toolkit pages. */
import { TEMPLATES, TOOLKIT_PATH, templatePath } from '@/data/toolkit'

export { TOOLKIT_PATH, templatePath }

export function toolkitIndexSeo() {
  return {
    path: TOOLKIT_PATH,
    title: 'Free ISO 27001 Toolkit — Templates With No Signup',
    description:
      `${TEMPLATES.length} free ISO 27001:2022 templates: Statement of Applicability with all 93 Annex A ` +
      'controls pre-filled, risk register, gap assessment, internal audit checklist, corrective action log ' +
      'and management review agenda. Direct download, no email required.',
  }
}

export function templateSeo(template) {
  return {
    path: templatePath(template),
    title: `Free ISO 27001 ${template.name} Template (${template.format})`,
    description:
      `${template.summary.split('. ')[0]}. Free ${template.format} download, no signup — ` +
      'with the columns explained and how to fill them in.',
  }
}

export function templateBreadcrumbs(template) {
  return [
    { name: 'Free toolkit', path: TOOLKIT_PATH },
    { name: template.name, path: templatePath(template) },
  ]
}
