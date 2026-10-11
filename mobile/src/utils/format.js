import i18n from '../i18n'

// Formats des dates et des nombres selon la langue choisie
const locale = () => (i18n.language === 'en' ? 'en-US' : 'fr-FR')

export const formatCurrency = (amount) =>
  new Intl.NumberFormat(locale(), { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(
    Number(amount ?? 0),
  )

export const formatCompact = (amount) =>
  new Intl.NumberFormat(locale(), { notation: 'compact', maximumFractionDigits: 1 }).format(Number(amount ?? 0))

export const formatPercent = (value) => new Intl.NumberFormat(locale(), { style: 'percent' }).format(value / 100)

export const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString(locale(), { day: 'numeric', month: 'short', year: 'numeric' }) : '—'

export const formatDateTime = (value) =>
  new Date(value).toLocaleString(locale(), { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

export const fullName = (user) => `${user.firstName} ${user.lastName}`

export const initials = (user) => `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase()

// Valeurs de l'API dans l'ordre d'affichage (libelles : enums.<groupe>.<valeur> dans les traductions)
export const PROJECT_STATUSES = ['TODO', 'IN_PROGRESS', 'DONE']
export const TASK_STATUSES = ['TODO', 'IN_PROGRESS', 'REVIEW', 'DONE']

// Regles d'acces identiques a celles du backend (le backend reste la reference)
export const canManageProject = (user, project) => user.role === 'ADMIN' || project.owner.id === user.id
export const canChangeStatus = (user, project) =>
  canManageProject(user, project) || project.members.some((member) => member.id === user.id)
// Equipe d'un projet : responsable + membres
export const projectTeam = (project) => [project.owner, ...project.members]
export const canWorkOnTasks = (user, project) =>
  user.role === 'ADMIN' || projectTeam(project).some((member) => member.id === user.id)
