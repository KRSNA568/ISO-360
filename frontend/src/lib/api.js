import axios from 'axios'

// Normalise: strip trailing slash then always append /api
// Works whether VITE_API_URL is set to:
//   https://iso-360-api-e9bi.onrender.com        (no /api)
//   https://iso-360-api-e9bi.onrender.com/api    (with /api)
const RAW_BASE = import.meta.env.VITE_API_URL || ''
const API_BASE = RAW_BASE
  ? RAW_BASE.replace(/\/api\/?$/, '').replace(/\/$/, '') + '/api'
  : '/api'

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  timeout: 60000,
})

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ── Token-refresh state ──────────────────────────────────────────────────────
// Prevents multiple concurrent calls all trying to refresh simultaneously.
// All 401s that arrive while a refresh is in-flight are queued and retried
// once the new access_token is available.
let isRefreshing = false
let failedQueue  = []

function processQueue(error, token = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else       resolve(token)
  })
  failedQueue = []
}

function clearSession() {
  localStorage.removeItem('token')
  localStorage.removeItem('rf_token')
  window.location.href = '/login'
}

// ── Response interceptor — handle 401 with refresh + retry ──────────────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config

    // Only intercept 401s that haven't already been retried,
    // and never intercept auth endpoints themselves.
    const isAuthEndpoint = original?.url?.includes('/auth/refresh') ||
                           original?.url?.includes('/auth/login')   ||
                           original?.url?.includes('/auth/register')

    if (error.response?.status !== 401 || original?._retry || isAuthEndpoint) {
      return Promise.reject(error)
    }

    const refreshToken = localStorage.getItem('rf_token')
    if (!refreshToken) {
      clearSession()
      return Promise.reject(error)
    }

    if (isRefreshing) {
      // Queue this request; it will be retried once the in-flight refresh settles
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      }).then((token) => {
        original.headers.Authorization = `Bearer ${token}`
        return api(original)
      }).catch(err => Promise.reject(err))
    }

    original._retry = true
    isRefreshing    = true

    try {
      const res = await axios.post(`${API_BASE}/auth/refresh`, { refresh_token: refreshToken })
      const { access_token, refresh_token: newRefresh } = res.data

      localStorage.setItem('token', access_token)
      if (newRefresh) localStorage.setItem('rf_token', newRefresh)

      api.defaults.headers.common.Authorization = `Bearer ${access_token}`
      processQueue(null, access_token)

      original.headers.Authorization = `Bearer ${access_token}`
      return api(original)
    } catch (refreshErr) {
      processQueue(refreshErr, null)
      clearSession()
      return Promise.reject(refreshErr)
    } finally {
      isRefreshing = false
    }
  }
)

export default api
