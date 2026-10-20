/**
 * Every prerendered public route with SEO data and breadcrumbs. Imported only by
 * the build-time prerenderer (src/entry-server.jsx), never by browser pages.
 * @returns {{ path, title, description, type: 'article'|'collection', breadcrumbs: {name, path}[] }[]}
 */
import { CONTROLS } from '@/data/annexA'
import { blogPosts } from '@/data/blogs'
import { blogIndexSeo, blogSeo } from '@/lib/blogSeo'
import { ANNEX_A_PATH, annexIndexSeo, controlBreadcrumbs, controlSeo } from '@/lib/contentPages'

export function contentRoutes() {
  return [
    { ...annexIndexSeo(), type: 'collection', breadcrumbs: [{ name: 'Annex A controls', path: ANNEX_A_PATH }] },
    ...CONTROLS.map((c) => ({ ...controlSeo(c), type: 'article', breadcrumbs: controlBreadcrumbs(c) })),
    { ...blogIndexSeo(), type: 'collection', breadcrumbs: [{ name: 'Blog', path: '/blog' }] },
    ...blogPosts.map((p) => ({
      ...blogSeo(p),
      type: 'article',
      breadcrumbs: [{ name: 'Blog', path: '/blog' }, { name: p.title, path: `/blog/${p.slug}` }],
    })),
  ]
}
