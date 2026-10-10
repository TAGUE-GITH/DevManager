import { api } from './client'

const data = (response) => response.data

export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials).then(data),
  register: (form) => api.post('/auth/register', form).then(data),
  demo: () => api.post('/auth/demo').then(data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }).then(data),
  me: () => api.get('/users/me').then(data),
}
