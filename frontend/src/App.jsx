import { useEffect, Component, lazy, Suspense } from 'react'
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
import LandingPage from '@/pages/LandingPage'

// Every route except the landing page is loaded on demand, so first visits
// only download what the landing page needs.
const AdminAuditLog = lazy(() => import('@/pages/admin/AdminAuditLog'))
const AdminCertificates = lazy(() => import('@/pages/admin/AdminCertificates'))
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'))
const AdminFlags = lazy(() => import('@/pages/admin/AdminFlags'))
const AdminIntegrity = lazy(() => import('@/pages/admin/AdminIntegrity'))
const AdminLayout = lazy(() => import('@/pages/admin/AdminLayout'))
const AdminQuestions = lazy(() => import('@/pages/admin/AdminQuestions'))
const AdminSessions = lazy(() => import('@/pages/admin/AdminSessions'))
const AdminUsers = lazy(() => import('@/pages/admin/AdminUsers'))
const BlogPage = lazy(() => import('@/pages/BlogPage'))
const BlogPostPage = lazy(() => import('@/pages/BlogPostPage'))
const Dashboard = lazy(() => import('@/pages/Dashboard'))
const ExamPage = lazy(() => import('@/pages/ExamPage'))
const GenerationPage = lazy(() => import('@/pages/GenerationPage'))
const LoginPage = lazy(() => import('@/pages/LoginPage'))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'))
const PrivacyPage = lazy(() => import('@/pages/PrivacyPage'))
const ProfilePage = lazy(() => import('@/pages/ProfilePage'))
const ResultsPage = lazy(() => import('@/pages/ResultsPage'))
const TermsPage = lazy(() => import('@/pages/TermsPage'))
const VerifyLandingPage = lazy(() => import('@/pages/VerifyLandingPage'))
const VerifyPage = lazy(() => import('@/pages/VerifyPage'))

function RouteFallback() {
  return (
    <div className="min-h-screen bg-ink flex items-center justify-center" role="status" aria-label="Loading">
      <div className="w-8 h-8 rounded-full border-2 border-gold/30 border-t-gold animate-spin" />
    </div>
  )
}

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
        <Suspense fallback={<RouteFallback />}>
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
            <Route path="/admin/integrity" element={<><NoIndex /><AdminIntegrity /></>} />
            <Route path="/admin/questions" element={<><NoIndex /><AdminQuestions /></>} />
            <Route path="/admin/flags" element={<><NoIndex /><AdminFlags /></>} />
            <Route path="/admin/audit-log" element={<><NoIndex /><AdminAuditLog /></>} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        </Suspense>
      </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  )
}

