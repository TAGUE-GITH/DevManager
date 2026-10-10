import { api } from './client'

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials).then((res) => res.data),
  register: (data) => api.post('/auth/register', data).then((res) => res.data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }).then((res) => res.data),
  resetPassword: (token, newPassword) =>
    api.post('/auth/reset-password', { token, newPassword }).then((res) => res.data),
  demo: () => api.post('/auth/demo').then((res) => res.data),
  me: () => api.get('/users/me').then((res) => res.data),
}

export const invitationsPublicApi = {
  get: (token) => api.get(`/auth/invitations/${token}`).then((res) => res.data),
  accept: (data) => api.post('/auth/accept-invitation', data).then((res) => res.data),
}
