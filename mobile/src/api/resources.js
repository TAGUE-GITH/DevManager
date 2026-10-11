import { api } from './client'

const data = (response) => response.data

// Memes appels que le site web (voir frontend/src/api/resources.js)
export const dashboardApi = {
  get: () => api.get('/dashboard').then(data),
}

export const projectsApi = {
  list: () => api.get('/projects').then(data),
  get: (id) => api.get(`/projects/${id}`).then(data),
  updateStatus: (id, status) => api.patch(`/projects/${id}/status`, { status }).then(data),
  meeting: (id) => api.get(`/projects/${id}/meeting`).then(data),
}

export const expensesApi = {
  list: (projectId) => api.get(`/projects/${projectId}/expenses`).then(data),
}

export const tasksApi = {
  list: (projectId) => api.get(`/projects/${projectId}/tasks`).then(data),
  mine: () => api.get('/tasks/mine').then(data),
  // Changement de colonne : la tache est placee en bas de la colonne choisie
  changeStatus: (id, status) => api.patch(`/tasks/${id}/move`, { status, position: 10_000 }).then(data),
}

export const messagesApi = {
  inbox: () => api.get('/messages/inbox').then(data),
  sent: () => api.get('/messages/sent').then(data),
  unreadCount: () => api.get('/messages/unread-count').then((response) => response.data.count),
  send: (message) => api.post('/messages', message).then(data),
  markAsRead: (id) => api.patch(`/messages/${id}/read`).then(data),
}

export const usersApi = {
  list: () => api.get('/users').then(data),
}
