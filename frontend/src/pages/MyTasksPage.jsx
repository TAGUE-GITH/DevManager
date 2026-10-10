import { CalendarDays, CheckCircle2, ListTodo } from 'lucide-react'
import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import { getErrorMessage } from '../api/client'
import { tasksApi } from '../api/resources'
import Alert from '../components/ui/Alert'
import Badge from '../components/ui/Badge'
import Card from '../components/ui/Card'
import PageHeader from '../components/ui/PageHeader'
import { EmptyState, ErrorState, PageLoader } from '../components/ui/States'
import { useFetch } from '../hooks/useFetch'
import { TASK_PRIORITY, TASK_STATUS, formatDate } from '../utils/format'
import { useTranslation } from 'react-i18next'

// Toutes les taches confiees a l'utilisateur connecte, tous projets confondus
export default function MyTasksPage() {
  const { t } = useTranslation()
  const { data: tasks, loading, error, reload } = useFetch(useCallback(() => tasksApi.mine(), []))
  const [actionError, setActionError] = useState('')
  const [showDone, setShowDone] = useState(false)
  const statusOptions = Object.entries(TASK_STATUS).map(([value, { label }]) => ({ value, label }))

  if (loading) return <PageLoader />
  if (error) return <ErrorState message={error} />

  const open = tasks.filter((task) => task.status !== 'DONE')
  const done = tasks.filter((task) => task.status === 'DONE')
  const overdue = open.filter((task) => task.overdue).length
  const visible = showDone ? tasks : open

  // Changement de statut : la tache est placee en bas de la colonne choisie
  const changeStatus = async (task, status) => {
    setActionError('')
    try {
      await tasksApi.move(task.id, status, 10_000)
      await reload()
    } catch (err) {
      setActionError(getErrorMessage(err))
    }
  }

  return (
    <>
      <PageHeader
        title={t('nav.myTasks')}
        description={
          open.length === 0
            ? t('myTasks.none')
            : overdue
              ? t('myTasks.openWithOverdue', { count: open.length, overdue })
              : t('myTasks.open', { count: open.length })
        }
      />

      {actionError && (
        <div className="mb-6">
          <Alert>{actionError}</Alert>
        </div>
      )}

      {tasks.length === 0 ? (
        <EmptyState
          icon={ListTodo}
          title={t('myTasks.emptyTitle')}
          description={t('myTasks.emptyDescription')}
        />
      ) : (
        <>
          {done.length > 0 && (
            <label className="mb-4 flex w-fit cursor-pointer items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                className="size-4 rounded accent-indigo-600"
                checked={showDone}
                onChange={(event) => setShowDone(event.target.checked)}
              />
              {t('myTasks.showDone', { count: done.length })}
            </label>
          )}

          {visible.length === 0 ? (
            <EmptyState icon={CheckCircle2} title={t('myTasks.allDone')} />
          ) : (
            <Card>
              <ul className="divide-y divide-slate-100">
                {visible.map((task) => {
                  const priority = TASK_PRIORITY[task.priority]
                  return (
                    <li key={task.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center">
                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-sm font-medium ${
                            task.status === 'DONE' ? 'text-slate-400 line-through' : 'text-slate-900'
                          }`}
                        >
                          {task.title}
                        </p>
                        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                          <Link to={`/app/projects/${task.projectId}`} className="font-medium text-indigo-600 hover:text-indigo-500">
                            {task.projectName}
                          </Link>
                          <Badge className={priority.badge}>{priority.label}</Badge>
                          {task.dueDate && (
                            <span className={`flex items-center gap-1 ${task.overdue ? 'font-medium text-red-700' : ''}`}>
                              <CalendarDays className="size-3.5" aria-hidden />
                              {formatDate(task.dueDate)}
                              {task.overdue && ` ${t('tasks.overdue')}`}
                            </span>
                          )}
                        </div>
                      </div>
                      <select
                        value={task.status}
                        onChange={(event) => changeStatus(task, event.target.value)}
                        aria-label={t('myTasks.statusOf', { title: task.title })}
                        className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 sm:w-36"
                      >
                        {statusOptions.map(({ value, label }) => (
                          <option key={value} value={value}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </li>
                  )
                })}
              </ul>
            </Card>
          )}
        </>
      )}
    </>
  )
}
