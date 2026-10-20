import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'

/** Navbar for public content pages: blog and the Annex A library. */
export function ContentNavbar() {
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
          <NavLink to="/iso-27001/annex-a" className={({ isActive }) => (isActive ? 'text-gold' : 'text-white/70 hover:text-white') + ' transition-colors'}>Annex A</NavLink>
          <NavLink to="/blog" className={({ isActive }) => (isActive ? 'text-gold' : 'text-white/70 hover:text-white') + ' transition-colors'}>Blog</NavLink>
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
          <Link to="/iso-27001/annex-a" className="py-3 text-white/80 hover:text-white border-b border-white/5">Annex A controls</Link>
          <Link to="/blog" className="py-3 text-white/80 hover:text-white border-b border-white/5">Blog</Link>
          <Link to="/verify" className="py-3 text-white/80 hover:text-white border-b border-white/5">Verify Certificate</Link>
          <Link to="/login" className="py-3 text-white/80 hover:text-white border-b border-white/5">Sign In</Link>
          <Link to="/login?register=1" className="btn btn-gold mt-3 w-full justify-center">Get Started</Link>
        </div>
      </div>
    </nav>
  )
}
