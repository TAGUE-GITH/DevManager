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
