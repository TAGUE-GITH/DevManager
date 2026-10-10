import i18n from '../i18n'

// Locale des formats (dates, nombres) selon la langue choisie
const locale = () => (i18n.language === 'en' ? 'en-US' : 'fr-FR')

// Montants en francs CFA : "1 250 000 FCFA" en francais, "FCFA 1,250,000" en anglais
export const formatCurrency = (amount) =>
  new Intl.NumberFormat(locale(), { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(
    Number(amount ?? 0),
  )

export const formatDate = (value) =>
  value ? new Date(value).toLocaleDateString(locale(), { day: 'numeric', month: 'short', year: 'numeric' }) : '—'

export const formatDateTime = (value) =>
  new Date(value).toLocaleString(locale(), { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

// Montants abreges pour les axes et etiquettes de graphiques, ex. "2,5 M"
export const formatCompact = (amount) =>
  new Intl.NumberFormat(locale(), { notation: 'compact', maximumFractionDigits: 1 }).format(Number(amount ?? 0))

// 45 -> "45 %" en francais, "45%" en anglais
export const formatPercent = (value) => new Intl.NumberFormat(locale(), { style: 'percent' }).format(value / 100)

// "2026-10" -> "oct." (court) ou "octobre 2026" (long)
export const formatMonth = (month, long = false) =>
  new Date(`${month}-01T00:00:00`).toLocaleDateString(locale(), long ? { month: 'long', year: 'numeric' } : { month: 'short' })

export const fullName = (user) => `${user.firstName} ${user.lastName}`

export const initials = (user) => `${user.firstName[0] ?? ''}${user.lastName[0] ?? ''}`.toUpperCase()

/*
 * Libelles des valeurs de l'API (roles, statuts, categories...).
 * Ce sont des proprietes calculees : ROLE.ADMIN renvoie le texte dans la langue active, et
 * Object.entries(ROLE) fonctionne toujours (utile pour construire les listes deroulantes).
 */
function labels(group, keys) {
  return Object.defineProperties(
    {},
    Object.fromEntries(keys.map((key) => [key, { enumerable: true, get: () => i18n.t(`enums.${group}.${key}`) }])),
  )
}

function labelsWithStyle(group, styles) {
  return Object.fromEntries(
    Object.entries(styles).map(([key, style]) => [
      key,
      Object.defineProperty({ ...style }, 'label', { enumerable: true, get: () => i18n.t(`enums.${group}.${key}`) }),
    ]),
  )
}

export const ROLE = labels('role', ['ADMIN', 'MANAGER', 'EMPLOYEE'])
export const EXPENSE_CATEGORY = labels('expenseCategory', ['SALARY', 'EQUIPMENT', 'SOFTWARE', 'TRAVEL', 'OTHER'])
export const PAYMENT_METHOD = labels('paymentMethod', ['MOBILE_MONEY', 'CARD'])

export const PROJECT_STATUS = labelsWithStyle('projectStatus', {
  TODO: { badge: 'bg-slate-100 text-slate-700 ring-slate-200' },
  IN_PROGRESS: { badge: 'bg-indigo-50 text-indigo-700 ring-indigo-200' },
  DONE: { badge: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
})

// Colonnes du Kanban, dans l'ordre d'affichage (couleurs : useTaskStatusColors dans utils/chartColors)
export const TASK_STATUS = labelsWithStyle('taskStatus', { TODO: {}, IN_PROGRESS: {}, REVIEW: {}, DONE: {} })

export const TASK_PRIORITY = labelsWithStyle('taskPriority', {
  LOW: { badge: 'bg-slate-100 text-slate-600 ring-slate-200' },
  MEDIUM: { badge: 'bg-sky-50 text-sky-700 ring-sky-200' },
  HIGH: { badge: 'bg-red-50 text-red-700 ring-red-200' },
})

export const PLAN = labelsWithStyle('plan', { FREE: {}, PRO: {} })

// Regles d'acces identiques a celles du backend (le backend reste la reference)
export const canCreateProject = (user) => user.role === 'ADMIN' || user.role === 'MANAGER'
export const canManageProject = (user, project) => user.role === 'ADMIN' || project.owner.id === user.id
export const canChangeStatus = (user, project) =>
  canManageProject(user, project) || project.members.some((member) => member.id === user.id)

// Membres de l'equipe d'un projet : responsable + membres
export const projectTeam = (project) => [project.owner, ...project.members]

export const canWorkOnTasks = (user, project) =>
  user.role === 'ADMIN' || projectTeam(project).some((member) => member.id === user.id)

export const canEditTask = (user, task, project) => canManageProject(user, project) || task.createdBy.id === user.id
