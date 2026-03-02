import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from '@/pages/LandingPage'
import LoginPage from '@/pages/LoginPage'
import Dashboard from '@/pages/Dashboard'
import GenerationPage from '@/pages/GenerationPage'
import ExamPage from '@/pages/ExamPage'
import ResultsPage from '@/pages/ResultsPage'
import VerifyPage from '@/pages/VerifyPage'
import NotFoundPage from '@/pages/NotFoundPage'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { AuthProvider } from '@/context/AuthContext'

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
            <Route path="/generate/:track" element={<GenerationPage />} />
            <Route path="/exam/:sessionId" element={<ExamPage />} />
            <Route path="/results/:sessionId" element={<ResultsPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
