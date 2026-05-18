import { ArrowRight, Search, Calendar, User, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { blogPosts } from '@/data/blogs'

// Simple shared Navbar for blog pages
export function BlogNavbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  // Close on route change
  useEffect(() => { setOpen(false) }, [location.pathname])

  // Lock body scroll while menu is open
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => { document.body.style.overflow = prev }
    }
  }, [open])

  return (
    <nav className="fixed top-0 inset-x-0 z-50 bg-ink/95 backdrop-blur-sm border-b border-white/10">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-serif font-bold text-xl text-white tracking-tight">
          27001<span className="text-gold">certified</span>
          <p className="text-[10px] text-white/40 font-sans font-medium tracking-normal">ISO 27001:2022 Certification Portal</p>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-5 text-sm">
          <Link to="/blog" className="text-gold hover:text-white transition-colors">Blog</Link>
          <Link to="/verify" className="text-white/70 hover:text-white transition-colors">Verify Certificate</Link>
          <Link to="/login" className="text-white/70 hover:text-white transition-colors">Sign In</Link>
          <Link to="/login?register=1" className="btn btn-gold btn-sm">Get Started</Link>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setOpen(v => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="blog-mobile-menu"
          className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-white/80 hover:text-gold hover:bg-white/5 transition-colors"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu panel */}
      <div
        id="blog-mobile-menu"
        className={`md:hidden overflow-hidden border-t border-white/10 transition-[max-height,opacity] duration-300 ease-out ${
          open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 py-4 flex flex-col gap-1 bg-ink/95 backdrop-blur-sm">
          <Link to="/blog" className="py-3 text-gold border-b border-white/5">Blog</Link>
          <Link to="/verify" className="py-3 text-white/80 hover:text-white border-b border-white/5">Verify Certificate</Link>
          <Link to="/login" className="py-3 text-white/80 hover:text-white border-b border-white/5">Sign In</Link>
          <Link to="/login?register=1" className="btn btn-gold mt-3 w-full justify-center">Get Started</Link>
        </div>
      </div>
    </nav>
  )
}

function BlogHero({ searchQuery, setSearchQuery }) {
  return (
    <section className="pt-32 pb-20 px-6 text-center border-b border-white/10 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-3/4 max-w-3xl h-64 bg-gold/10 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="max-w-3xl mx-auto relative z-10">
        <span className="inline-flex items-center rounded-full border border-gold/50 px-4 py-1 text-xs text-gold mb-6 uppercase tracking-widest font-semibold">
          The Gilded Sentinel
        </span>
        <h1 className="text-5xl md:text-6xl font-serif font-bold text-white leading-tight mb-6">
          Insights &amp; Guides for <span className="text-gold">ISO 27001</span>
        </h1>
        <p className="text-lg text-white/70 leading-relaxed max-w-2xl mx-auto mb-10">
          Master the complexities of the 2022 revision. Read practical guides on risk treatment, internal audits, and ISMS control implementation.
        </p>
        
        {/* Simple mock search bar (UI only) */}
        <div className="flex bg-surface-container-low border border-outline-variant/20 rounded-full max-w-md mx-auto overflow-hidden p-1">
          <div className="pl-4 pr-3 flex items-center justify-center">
            <Search size={18} className="text-white/40" />
          </div>
          <input 
            type="text" 
            placeholder="Search articles..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none outline-none text-white w-full text-sm placeholder:text-white/30"
          />
          <button className="btn btn-gold btn-sm rounded-full px-6">Search</button>
        </div>
      </div>
    </section>
  )
}

function BlogFeed({ searchQuery, setSearchQuery }) {
  const filteredPosts = blogPosts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
            <Link 
              key={post.id} 
              to={`/blog/${post.slug}`} 
              className="group flex flex-col bg-surface-container-high/50 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden hover:border-gold/30 hover:-translate-y-1 transition-all duration-300"
            >
              <div className="h-48 overflow-hidden relative">
                <div className="absolute inset-0 bg-ink/20 group-hover:bg-transparent transition-colors z-10" />
                <img 
                  src={post.imageUrl} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-4 text-xs text-white/50 mb-4">
                  <span className="flex items-center gap-1.5"><Calendar size={14} className="text-gold" /> {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <span className="flex items-center gap-1.5"><User size={14} className="text-gold" /> {post.author}</span>
                </div>
                <h3 className="text-xl font-serif font-bold text-white mb-3 group-hover:text-gold transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-sm text-white/60 line-clamp-3 mb-6 flex-1">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-2 text-sm font-medium text-gold mt-auto group-hover:gap-3 transition-all">
                  Read Article <ArrowRight size={16} />
                </div>
              </div>
            </Link>
            ))
          ) : (
            <div className="col-span-full py-10 text-center border-t border-b border-white/5 bg-white/5 rounded-2xl">
              <p className="text-white/60 mb-2">No articles found matching &ldquo;{searchQuery}&rdquo;.</p>
              <button 
                onClick={() => setSearchQuery('')}
                className="text-gold text-sm font-medium hover:underline"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="min-h-screen bg-ink">
      <BlogNavbar />
      <BlogHero searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <BlogFeed searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
    </div>
  )
}
