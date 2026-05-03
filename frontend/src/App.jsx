import { useEffect, Component } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  componentDidCatch(err, info) {
    console.error('[ErrorBoundary]', err, info)
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-ink flex items-center justify-center text-white text-center px-6">
          <div>
            <h1 className="text-2xl font-semibold mb-2">Something went wrong</h1>
            <p className="text-white/60 mb-6">Please refresh the page or try again later.</p>
            <button
              onClick={() => { this.setState({ hasError: false }); window.location.reload() }}
              className="btn btn-gold"
            >
              Reload page
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { AuthProvider } from '@/context/AuthContext'
import AdminAuditLog from '@/pages/admin/AdminAuditLog'
import AdminCertificates from '@/pages/admin/AdminCertificates'
import AdminDashboard from '@/pages/admin/AdminDashboard'
import AdminFlags from '@/pages/admin/AdminFlags'
import AdminLayout from '@/pages/admin/AdminLayout'
import AdminQuestions from '@/pages/admin/AdminQuestions'
import AdminSessions from '@/pages/admin/AdminSessions'
import AdminUsers from '@/pages/admin/AdminUsers'
import BlogPage from '@/pages/BlogPage'
import BlogPostPage from '@/pages/BlogPostPage'
import Dashboard from '@/pages/Dashboard'
import ExamPage from '@/pages/ExamPage'
import GenerationPage from '@/pages/GenerationPage'
import LandingPage from '@/pages/LandingPage'
import LoginPage from '@/pages/LoginPage'
import NotFoundPage from '@/pages/NotFoundPage'
import PrivacyPage from '@/pages/PrivacyPage'
import ProfilePage from '@/pages/ProfilePage'
import ResultsPage from '@/pages/ResultsPage'
import TermsPage from '@/pages/TermsPage'
import VerifyLandingPage from '@/pages/VerifyLandingPage'
import VerifyPage from '@/pages/VerifyPage'

/** Injects <meta name="robots" content="noindex"> while the component is mounted.
 *  Prevents search engines from indexing private app pages. */
function NoIndex() {
  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex, nofollow'
    document.head.appendChild(meta)
    return () => document.head.removeChild(meta)
  }, [])
  return null
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Navigate to="/iso-27001" replace />} />
          <Route path="/iso-27001" element={<LandingPage />} />
          <Route path="/login" element={<><NoIndex /><LoginPage /></>} />
          <Route path="/verify" element={<VerifyLandingPage />} />
          <Route path="/verify/:certificateId" element={<VerifyPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />

          {/* Protected */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<><NoIndex /><Dashboard /></>} />
            <Route path="/profile" element={<><NoIndex /><ProfilePage /></>} />
            <Route path="/generate/:track" element={<><NoIndex /><GenerationPage /></>} />
            <Route path="/exam/:sessionId" element={<><NoIndex /><ExamPage /></>} />
            <Route path="/results/:sessionId" element={<><NoIndex /><ResultsPage /></>} />
          </Route>

          {/* Admin */}
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<><NoIndex /><AdminDashboard /></>} />
            <Route path="/admin/users" element={<><NoIndex /><AdminUsers /></>} />
            <Route path="/admin/sessions" element={<><NoIndex /><AdminSessions /></>} />
            <Route path="/admin/certificates" element={<><NoIndex /><AdminCertificates /></>} />
            <Route path="/admin/questions" element={<><NoIndex /><AdminQuestions /></>} />
            <Route path="/admin/flags" element={<><NoIndex /><AdminFlags /></>} />
            <Route path="/admin/audit-log" element={<><NoIndex /><AdminAuditLog /></>} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  )
}

