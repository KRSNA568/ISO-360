/**
 * Build-time server renderer for public content pages (see scripts/prerender.mjs).
 * Renders the same tree as the browser app, but with a StaticRouter and eager
 * page components so the HTML contains the full article. The browser then
 * hydrates it (src/main.jsx), keeping the server HTML on screen while the
 * route's lazy chunk loads.
 */
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom/server'

import { AppRoutes, ErrorBoundary } from '@/App'
import { AuthProvider } from '@/context/AuthContext'
import AnnexAIndexPage from '@/pages/annexa/AnnexAIndexPage'
import ControlPage from '@/pages/annexa/ControlPage'
import BlogPage from '@/pages/BlogPage'
import BlogPostPage from '@/pages/BlogPostPage'

export { contentRoutes } from '@/lib/contentRoutes'

const EAGER_PAGES = { AnnexAIndexPage, ControlPage, BlogPage, BlogPostPage }

export function render(url) {
  return renderToString(
    <StrictMode>
      <ErrorBoundary>
        <AuthProvider>
          <StaticRouter location={url}>
            <AppRoutes pages={EAGER_PAGES} />
          </StaticRouter>
        </AuthProvider>
      </ErrorBoundary>
    </StrictMode>,
  )
}
