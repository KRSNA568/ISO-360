import api from '@/lib/api'

export const authApi = {
  register:      (data)  => api.post('/auth/register', data),
  verifyOtp:     (data)  => api.post('/auth/verify-otp', data),
  resendOtp:     (data)  => api.post('/auth/resend-otp', data),
  login:         (data)  => api.post('/auth/login', data),
  forgotPassword:(data)  => api.post('/auth/forgot-password', data),
  resetPassword: (data)  => api.post('/auth/reset-password', data),
}

export const userApi = {
  getMe:     ()     => api.get('/user/me'),
  updateMe:  (data) => api.patch('/user/me', data),
  deleteMe:  ()     => api.delete('/user/me'),
  getAttempts: ()   => api.get('/user/attempts'),
}

export const sessionApi = {
  create:    (track)     => api.post('/session/create', { track }),
  getStatus: (id)        => api.get(`/session/${id}/status`),
  start:     (id)        => api.post(`/session/${id}/start`),
  answer:    (id, data)  => api.post(`/session/${id}/answer`, data),
  heartbeat: (id, data)  => api.post(`/session/${id}/heartbeat`, data),
}

export const resultsApi = {
  get: (sessionId) => api.get(`/results/${sessionId}`),
  flagQuestion: (qId) => api.post(`/questions/${qId}/flag`),
}

export const certificateApi = {
  get:    (certId) => api.get(`/certificates/${certId}`),
  verify: (certId) => api.get(`/certificates/verify/${certId}`),
}
