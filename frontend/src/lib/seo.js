import { useEffect } from 'react'

export const SITE_URL = 'https://27001certified.in'

const SITE_NAME = '27001certified'

function upsertMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  const created = !el
  if (created) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  const previous = created ? null : el.getAttribute('content')
  el.setAttribute('content', content)
  return () => {
    if (created) {el.remove()} else {el.setAttribute('content', previous)}
  }
}

function upsertCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]')
  const created = !el
  if (created) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  const previous = created ? null : el.getAttribute('href')
  el.setAttribute('href', href)
  return () => {
    if (created) {el.remove()} else {el.setAttribute('href', previous)}
  }
}

/**
 * Sets title, description, canonical and Open Graph/Twitter tags while the page
 * is mounted, restoring the previous values on unmount. Prerendered pages get
 * the same values baked into their HTML by scripts/prerender.mjs.
 *
 * @param {{ title: string, description: string, path: string }} seo
 */
export function useSeo({ title, description, path }) {
  useEffect(() => {
    const url = `${SITE_URL}${path}`
    const previousTitle = document.title
    document.title = `${title} | ${SITE_NAME}`
    const restores = [
      upsertMeta('name', 'description', description),
      upsertMeta('property', 'og:title', title),
      upsertMeta('property', 'og:description', description),
      upsertMeta('property', 'og:url', url),
      upsertMeta('name', 'twitter:title', title),
      upsertMeta('name', 'twitter:description', description),
      upsertCanonical(url),
    ]
    return () => {
      document.title = previousTitle
      restores.forEach((restore) => restore())
    }
  }, [title, description, path])
}
