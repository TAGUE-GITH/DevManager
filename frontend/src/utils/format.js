// Montants en francs CFA, ex. "1 250 000 FCFA"
const currencyFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'XAF',
  maximumFractionDigits: 0,
})

export const formatCurrency = (amount) => currencyFormatter.format(Number(amount ?? 0))

export const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'

export const formatDateTime = (value) =>
  new Date(value).toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

export const fullName = (user) => `${user.firstName} ${user.lastName}`

export const initials = (user) => `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase()

export const PROJECT_STATUS = {
  TODO: { label: 'À faire', badge: 'bg-slate-100 text-slate-700 ring-slate-200' },
  IN_PROGRESS: { label: 'En cours', badge: 'bg-indigo-50 text-indigo-700 ring-indigo-200' },
  DONE: { label: 'Terminé', badge: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
}

export const EXPENSE_CATEGORY = {
  SALARY: 'Salaires',
  EQUIPMENT: 'Matériel',
  SOFTWARE: 'Logiciels',
  TRAVEL: 'Déplacements',
  OTHER: 'Autre',
}

export const ROLE = {
  ADMIN: 'Administrateur',
  MANAGER: 'Manager',
  EMPLOYEE: 'Employé',
}

// Regles d'acces identiques a celles du backend (le backend reste la reference)
export const canCreateProject = (user) => user.role === 'ADMIN' || user.role === 'MANAGER'
export const canManageProject = (user, project) => user.role === 'ADMIN' || project.owner.id === user.id
export const canChangeStatus = (user, project) =>
  canManageProject(user, project) || project.members.some((member) => member.id === user.id)

// Colonnes du tableau Kanban, dans l'ordre d'affichage
export const TASK_STATUS = {
  TODO: { label: 'À faire', dot: 'bg-slate-400' },
  IN_PROGRESS: { label: 'En cours', dot: 'bg-indigo-500' },
  REVIEW: { label: 'En revue', dot: 'bg-amber-500' },
  DONE: { label: 'Terminé', dot: 'bg-emerald-500' },
}

export const TASK_PRIORITY = {
  LOW: { label: 'Basse', badge: 'bg-slate-100 text-slate-600 ring-slate-200' },
  MEDIUM: { label: 'Moyenne', badge: 'bg-sky-50 text-sky-700 ring-sky-200' },
  HIGH: { label: 'Haute', badge: 'bg-red-50 text-red-700 ring-red-200' },
}

// Membres de l'equipe d'un projet : responsable + membres
export const projectTeam = (project) => [project.owner, ...project.members]

export const canWorkOnTasks = (user, project) =>
  user.role === 'ADMIN' || projectTeam(project).some((member) => member.id === user.id)

export const canEditTask = (user, task, project) =>
  canManageProject(user, project) || task.createdBy.id === user.id
