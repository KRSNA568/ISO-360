/**
 * Every prerendered public route with SEO data and breadcrumbs. Imported only by
 * the build-time prerenderer (src/entry-server.jsx), never by browser pages.
 * @returns {{ path, title, description, type: 'article'|'collection', breadcrumbs: {name, path}[] }[]}
 */
import { CONTROLS } from '@/data/annexA'
import { blogPosts } from '@/data/blogs'
import { CLAUSES } from '@/data/clauses'
import { TEMPLATES } from '@/data/toolkit'
import { blogIndexSeo, blogSeo } from '@/lib/blogSeo'
import { CLAUSES_PATH, clauseBreadcrumbs, clauseIndexSeo, clauseSeo } from '@/lib/clausePages'
import { ANNEX_A_PATH, annexIndexSeo, controlBreadcrumbs, controlSeo } from '@/lib/contentPages'
import { TOOLKIT_PATH, templateBreadcrumbs, templateSeo, toolkitIndexSeo } from '@/lib/toolkitPages'

export function contentRoutes() {
  return [
    { ...annexIndexSeo(), type: 'collection', breadcrumbs: [{ name: 'Annex A controls', path: ANNEX_A_PATH }] },
    ...CONTROLS.map((c) => ({ ...controlSeo(c), type: 'article', breadcrumbs: controlBreadcrumbs(c) })),
    { ...clauseIndexSeo(), type: 'collection', breadcrumbs: [{ name: 'ISO 27001 clauses', path: CLAUSES_PATH }] },
    ...CLAUSES.map((c) => ({ ...clauseSeo(c), type: 'article', breadcrumbs: clauseBreadcrumbs(c) })),
    { ...toolkitIndexSeo(), type: 'collection', breadcrumbs: [{ name: 'Free toolkit', path: TOOLKIT_PATH }] },
    ...TEMPLATES.map((t) => ({ ...templateSeo(t), type: 'article', breadcrumbs: templateBreadcrumbs(t) })),
    { ...blogIndexSeo(), type: 'collection', breadcrumbs: [{ name: 'Blog', path: '/blog' }] },
    ...blogPosts.map((p) => ({
      ...blogSeo(p),
      type: 'article',
      breadcrumbs: [{ name: 'Blog', path: '/blog' }, { name: p.title, path: `/blog/${p.slug}` }],
    })),
  ]
}
