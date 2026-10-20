/** SEO metadata and paths for the practice drills and interview prep pages. */
import { CATEGORIES, INTERVIEW_PATH, QUESTIONS as INTERVIEW_QUESTIONS } from '@/data/interviewPrep'
import { PRACTICE_PATH, QUESTIONS, SECTIONS } from '@/data/practice'

export { PRACTICE_PATH, INTERVIEW_PATH }

export function sectionPath(section) {
  return `${PRACTICE_PATH}/${section.slug}`
}

export function sectionQuestions(slug) {
  return QUESTIONS.filter((q) => q.section === slug)
}

export function practiceIndexSeo() {
  return {
    path: PRACTICE_PATH,
    title: 'Free ISO 27001 Practice Questions — Untimed Drills With Explanations',
    description:
      `${QUESTIONS.length} free ISO 27001:2022 practice questions across ${SECTIONS.length} sections — Clauses 4–10 and all ` +
      'four Annex A control themes. Untimed, answers explained, no signup and no certificate. ' +
      'Separate from the exam bank, so drilling here never shows you an exam question.',
  }
}

export function sectionSeo(section) {
  const count = sectionQuestions(section.slug).length
  return {
    path: sectionPath(section),
    title: `ISO 27001 ${section.label} — ${count} Free Practice Questions`,
    description:
      `${count} free ISO 27001:2022 practice questions on ${section.label}, each with the reasoning explained. ` +
      'Untimed, no signup, no certificate — drill the section until the answers are obvious.',
  }
}

export function sectionBreadcrumbs(section) {
  return [
    { name: 'Practice', path: PRACTICE_PATH },
    { name: section.label, path: sectionPath(section) },
  ]
}

export function interviewSeo() {
  return {
    path: INTERVIEW_PATH,
    title: 'ISO 27001 Lead Auditor Interview Questions and Answers',
    description:
      `${INTERVIEW_QUESTIONS.length} questions asked in ISO 27001 lead auditor and lead implementer interviews, across ` +
      `${CATEGORIES.length} areas — with what the interviewer is really testing, a model answer, the follow-ups ` +
      'that come next, and the answers that end an interview early.',
  }
}
