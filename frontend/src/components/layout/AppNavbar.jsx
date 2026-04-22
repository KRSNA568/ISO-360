import { Link, useNavigate } from 'react-router-dom'
import { User, LogOut, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { cn } from '@/lib/cn'

export default function AppNavbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  async function handleLogout() {
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-border">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link to="/dashboard" className="font-serif font-bold text-base text-ink hover:opacity-75 transition-opacity">
          27001<span className="text-gold">Certified</span>
        </Link>

        <div className="relative">
          <button
            onClick={() => setOpen(o => !o)}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium text-ink-secondary',
              'hover:bg-surface transition-colors',
              open && 'bg-surface',
            )}
          >
            <div className="w-7 h-7 rounded-full bg-ink flex items-center justify-center text-white text-xs font-bold">
              {user?.full_name?.[0]?.toUpperCase() || 'U'}
            </div>
            <span className="hidden sm:block max-w-[120px] truncate">{user?.full_name || 'Account'}</span>
            <ChevronDown size={14} className={cn('transition-transform', open && 'rotate-180')} />
          </button>

          {open && (
            <>
              {/* Backdrop */}
              <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
              <div className="absolute right-0 mt-2 w-44 bg-white border border-border rounded-lg shadow-lg overflow-hidden z-20">
                <Link
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-ink hover:bg-surface transition-colors"
                >
                  <User size={14} className="text-ink-muted" />
                  Profile Settings
                </Link>
                <hr className="border-border" />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={14} />
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
