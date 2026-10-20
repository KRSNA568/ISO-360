/** SEO metadata for blog pages (kept separate from Annex A data to keep bundles small). */

export function blogIndexSeo() {
  return {
    path: '/blog',
    title: 'ISO 27001 Blog — Practical Guides for ISMS Teams and Auditors',
    description:
      'Practical ISO 27001:2022 guides: implementing the ISMS, Annex A controls, internal audits and ' +
      'preparing for certification.',
  }
}

export function blogSeo(post) {
  return {
    path: `/blog/${post.slug}`,
    title: post.title,
    description: post.excerpt || post.title,
  }
}
