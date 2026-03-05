import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from '@/pages/LandingPage'
import LoginPage from '@/pages/LoginPage'
import Dashboard from '@/pages/Dashboard'
import ProfilePage from '@/pages/ProfilePage'
import GenerationPage from '@/pages/GenerationPage'
import ExamPage from '@/pages/ExamPage'
import ResultsPage from '@/pages/ResultsPage'
import VerifyPage from '@/pages/VerifyPage'
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

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<Navigate to="/iso-27001" replace />} />
          <Route path="/iso-27001" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/verify/:certificateId" element={<VerifyPage />} />

          {/* Protected */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/generate/:track" element={<GenerationPage />} />
            <Route path="/exam/:sessionId" element={<ExamPage />} />
            <Route path="/results/:sessionId" element={<ResultsPage />} />
          </Route>

          {/* Admin */}
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/sessions" element={<AdminSessions />} />
            <Route path="/admin/certificates" element={<AdminCertificates />} />
            <Route path="/admin/questions" element={<AdminQuestions />} />
            <Route path="/admin/flags" element={<AdminFlags />} />
            <Route path="/admin/audit-log" element={<AdminAuditLog />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
