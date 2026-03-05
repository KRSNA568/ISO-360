import api from '@/lib/api'

export const authApi = {
  register:       (data) => api.post('/auth/register', data),
  verifyOtp:      (data) => api.post('/auth/verify-otp', data),
  resendOtp:      (data) => api.post('/auth/resend-otp', data),
  login:          (data) => api.post('/auth/login', data),
  forgotPassword: (data) => api.post('/auth/forgot-password', data),
  resetPassword:  (data) => api.post('/auth/reset-password', data),
  changePassword: (data) => api.post('/auth/change-password', data),
}

export const userApi = {
  getMe:           ()     => api.get('/user/me'),
  updateMe:        (data) => api.patch('/user/me', data),
  deleteMe:        ()     => api.delete('/user/me'),
  getAttempts:     ()     => api.get('/user/attempts'),
  getCertificates: ()     => api.get('/user/certificates'),
}

export const sessionApi = {
  create:    (track)     => api.post('/session/create', { track }),
  getStatus: (id)        => api.get(`/session/${id}/status`),
  start:     (id)        => api.post(`/session/${id}/start`),
  answer:    (id, data)  => api.post(`/session/${id}/answer`, data),
  submit:    (id)        => api.post(`/session/${id}/submit`),
  heartbeat: (id)        => api.post(`/session/${id}/heartbeat`),
  report:    (id)        => api.get(`/session/${id}/report`),
  history:   ()          => api.get('/session/history'),
}

export const resultsApi = {
  get:          (id)       => api.get(`/session/${id}/report`),
  flagQuestion: (qId, data) => api.post(`/questions/${qId}/flag`, data),
}

export const certificateApi = {
  get:    (certId) => api.get(`/certificates/${certId}`),
  verify: (certId) => api.get(`/certificates/verify/${certId}`),
}

export const adminApi = {
  // Users
  getUsers:          (params) => api.get('/admin/users', { params }),
  blockUser:         (id, d)  => api.post(`/admin/users/${id}/block`, d),
  unblockUser:       (id)     => api.post(`/admin/users/${id}/unblock`),

  // Sessions
  getSessions:       (params) => api.get('/admin/sessions', { params }),
  getSession:        (id)     => api.get(`/admin/sessions/${id}`),
  flagSession:       (id, d)  => api.post(`/admin/sessions/${id}/flag`, d),

  // Certificates
  getCertificates:   (params) => api.get('/admin/certificates', { params }),
  revokeCertificate: (id, d)  => api.post(`/admin/certificates/${id}/revoke`, d),

  // Flags
  getFlags:          (params) => api.get('/admin/flags', { params }),
  updateFlag:        (id, d)  => api.patch(`/admin/flags/${id}`, d),

  // Questions
  getQuestions:      (params) => api.get('/admin/questions', { params }),
  addQuestion:       (d)      => api.post('/admin/questions', d),
  editQuestion:      (id, d)  => api.patch(`/admin/questions/${id}`, d),
  retireQuestion:    (id)     => api.delete(`/admin/questions/${id}`),

  // KPIs & Audit
  getKpis:           ()       => api.get('/admin/kpis'),
  getAuditLog:       (params) => api.get('/admin/audit-log', { params }),
}
