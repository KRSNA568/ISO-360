import {
  LayoutDashboard, Users, ClipboardList, Award,
  BookOpen, Flag, ScrollText, ArrowLeft, ShieldAlert,
} from 'lucide-react'
import { NavLink, Outlet, Navigate, Link } from 'react-router-dom'

import { useAuth } from '@/context/AuthContext'

const NAV = [
  { to: '/admin',              label: 'Dashboard',    icon: LayoutDashboard, end: true },
  { to: '/admin/users',        label: 'Users',        icon: Users },
  { to: '/admin/sessions',     label: 'Sessions',     icon: ClipboardList },
  { to: '/admin/certificates', label: 'Certificates', icon: Award },
  { to: '/admin/questions',    label: 'Questions',    icon: BookOpen },
  { to: '/admin/flags',        label: 'Flags',        icon: Flag },
  { to: '/admin/audit-log',    label: 'Audit Log',    icon: ScrollText },
]

export default function AdminLayout() {
  const { user, loading, isAuthenticated } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <span className="text-ink-muted text-sm animate-pulse">Loading…</span>
      </div>
    )
  }
  if (!isAuthenticated) {return <Navigate to="/login" replace />}
  if (user?.role !== 'admin') {return <Navigate to="/dashboard" replace />}

  return (
    <div className="flex min-h-screen bg-surface">
      {/* ── Sidebar ── */}
      <aside className="w-56 shrink-0 bg-ink text-white flex flex-col fixed inset-y-0 left-0 z-40">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <ShieldAlert size={18} className="text-gold" />
            <span className="font-semibold text-sm">Admin Portal</span>
          </div>
          <p className="text-xs text-white/40 mt-0.5">27001certified</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-0.5 px-2 overflow-y-auto">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-gold text-ink'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon size={15} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-3 py-4 border-t border-white/10">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-3 py-2 rounded-md text-xs text-white/50 hover:text-white hover:bg-white/10 transition-colors"
          >
            <ArrowLeft size={13} />
            Back to App
          </Link>
          <p className="px-3 mt-2 text-xs text-white/30 truncate">{user?.email}</p>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="ml-56 flex-1 min-h-screen">
        <Outlet />
      </main>
    </div>
  )
}
