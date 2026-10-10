import { api } from './client'

const data = (res) => res.data

export const projectsApi = {
  list: () => api.get('/projects').then(data),
  get: (id) => api.get(`/projects/${id}`).then(data),
  create: (project) => api.post('/projects', project).then(data),
  update: (id, project) => api.put(`/projects/${id}`, project).then(data),
  updateStatus: (id, status) => api.patch(`/projects/${id}/status`, { status }).then(data),
  remove: (id) => api.delete(`/projects/${id}`),
}

export const expensesApi = {
  list: (projectId) => api.get(`/projects/${projectId}/expenses`).then(data),
  create: (projectId, expense) => api.post(`/projects/${projectId}/expenses`, expense).then(data),
  remove: (id) => api.delete(`/expenses/${id}`),
}

export const messagesApi = {
  inbox: () => api.get('/messages/inbox').then(data),
  sent: () => api.get('/messages/sent').then(data),
  unreadCount: () => api.get('/messages/unread-count').then((res) => res.data.count),
  send: (message) => api.post('/messages', message).then(data),
  markAsRead: (id) => api.patch(`/messages/${id}/read`).then(data),
}

export const usersApi = {
  list: () => api.get('/users').then(data),
  updateRole: (id, role) => api.patch(`/users/${id}/role`, { role }).then(data),
}

export const dashboardApi = {
  get: () => api.get('/dashboard').then(data),
}

export const invitationsApi = {
  list: () => api.get('/invitations').then(data),
  create: (invitation) => api.post('/invitations', invitation).then(data),
  revoke: (id) => api.delete(`/invitations/${id}`),
}
