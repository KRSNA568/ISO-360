import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import LandingPage from '@/pages/LandingPage'
import LoginPage from '@/pages/LoginPage'
import Dashboard from '@/pages/Dashboard'
import ProfilePage from '@/pages/ProfilePage'
import GenerationPage from '@/pages/GenerationPage'
import ExamPage from '@/pages/ExamPage'
import ResultsPage from '@/pages/ResultsPage'
import VerifyLandingPage from '@/pages/VerifyLandingPage'
import VerifyPage from '@/pages/VerifyPage'
import BlogPage from '@/pages/BlogPage'
import BlogPostPage from '@/pages/BlogPostPage'
import NotFoundPage from '@/pages/NotFoundPage'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { AuthProvider } from '@/context/AuthContext'
import AdminLayout from '@/pages/admin/AdminLayout'
import AdminDashboard from '@/pages/admin/AdminDashboard'
import AdminUsers from '@/pages/admin/AdminUsers'
import AdminSessions from '@/pages/admin/AdminSessions'
import AdminCertificates from '@/pages/admin/AdminCertificates'
import AdminQuestions from '@/pages/admin/AdminQuestions'
import AdminFlags from '@/pages/admin/AdminFlags'
import AdminAuditLog from '@/pages/admin/AdminAuditLog'

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
  )
}

