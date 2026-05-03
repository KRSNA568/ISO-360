import { createContext, useContext, useState, useEffect, useCallback } from 'react'

import api from '@/lib/api'

const AuthContext = createContext(null)

const AT_KEY = 'token'   // must match api.js interceptor
const RT_KEY = 'rf_token'

export function AuthProvider({ children }) {
  const [user, setUser]     = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async () => {
    try {
      const res = await api.get('/user/me')
      setUser(res.data)
    } catch (err) {
      _clearStorage()
      setUser(null)
      if (err?.response?.status === 401) {
        window.location.href = '/login'
        return
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (localStorage.getItem(AT_KEY)) {
      fetchProfile()
    } else {
      setLoading(false)
    }
  }, [fetchProfile])

  function login(accessToken, refreshToken, userData) {
    localStorage.setItem(AT_KEY, accessToken)
    if (refreshToken) {localStorage.setItem(RT_KEY, refreshToken)}
    setUser(userData)
  }

  async function logout() {
    try {
      await api.post('/auth/logout')
    } catch {
      // ignore — server might have expired token already
    }
    _clearStorage()
    setUser(null)
  }

  function updateUser(partial) {
    setUser(prev => (prev ? { ...prev, ...partial } : prev))
  }

  function _clearStorage() {
    localStorage.removeItem(AT_KEY)
    localStorage.removeItem(RT_KEY)
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated: !!user,
      login,
      logout,
      updateUser,
      fetchProfile,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {throw new Error('useAuth must be used within AuthProvider')}
  return ctx
}
