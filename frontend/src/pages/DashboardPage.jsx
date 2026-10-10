import { FolderKanban, MessageSquare, PiggyBank, Wallet } from 'lucide-react'
import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { dashboardApi, projectsApi } from '../api/resources'
import { StatusBadge } from '../components/ui/Badge'
import BudgetBar from '../components/ui/BudgetBar'
import Card from '../components/ui/Card'
import PageHeader from '../components/ui/PageHeader'
import { EmptyState, ErrorState, PageLoader } from '../components/ui/States'
import { useAuth } from '../context/useAuth'
import { useFetch } from '../hooks/useFetch'
import { PROJECT_STATUS, formatCurrency } from '../utils/format'

function StatTile({ Icon, label, value, hint }) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
          <Icon className="size-5" aria-hidden />
        </span>
        <p className="text-sm font-medium text-slate-500">{label}</p>
      </div>
      <p className="mt-4 text-2xl font-bold tracking-tight text-slate-900">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </Card>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()
  const loadData = useCallback(() => Promise.all([dashboardApi.get(), projectsApi.list()]), [])
  const { data, loading, error } = useFetch(loadData)

  if (loading) return <PageLoader />
  if (error) return <ErrorState message={error} />

  const [stats, projects] = data
  const remaining = stats.totalBudget - stats.totalSpent
  // Les projets qui consomment le plus leur budget en premier
  const topProjects = [...projects].sort((a, b) => b.consumedPercent - a.consumedPercent).slice(0, 5)

  return (
    <>
      <PageHeader title={`Bonjour ${user.firstName} 👋`} description="Voici l'essentiel de votre activité." />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile Icon={FolderKanban} label="Projets" value={stats.totalProjects} />
        <StatTile Icon={Wallet} label="Budget total" value={formatCurrency(stats.totalBudget)} />
        <StatTile
          Icon={PiggyBank}
          label="Dépensé"
          value={formatCurrency(stats.totalSpent)}
          hint={`Reste ${formatCurrency(remaining)}`}
        />
        <StatTile Icon={MessageSquare} label="Messages non lus" value={stats.unreadMessages} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="p-6">
          <h2 className="font-semibold text-slate-900">Projets par statut</h2>
          <ul className="mt-5 space-y-4">
            {Object.entries(PROJECT_STATUS).map(([status, { label }]) => {
              const count = stats.projectsByStatus[status] ?? 0
              const share = stats.totalProjects ? Math.round((count / stats.totalProjects) * 100) : 0
              return (
                <li key={status}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">{label}</span>
                    <span className="font-semibold text-slate-900">{count}</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full rounded-full bg-indigo-500" style={{ width: `${share}%` }} />
                  </div>
                </li>
              )
            })}
          </ul>
        </Card>

        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-slate-900">Consommation des budgets</h2>
            <Link to="/projects" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              Voir tout
            </Link>
          </div>
          {topProjects.length === 0 ? (
            <div className="mt-5">
              <EmptyState icon={FolderKanban} title="Aucun projet pour le moment" />
            </div>
          ) : (
            <ul className="mt-5 divide-y divide-slate-100">
              {topProjects.map((project) => (
                <li key={project.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <Link
                      to={`/projects/${project.id}`}
                      className="truncate text-sm font-medium text-slate-900 hover:text-indigo-600"
                    >
                      {project.name}
                    </Link>
                    <StatusBadge status={project.status} />
                  </div>
                  <BudgetBar percent={project.consumedPercent} />
                  <p className="mt-0.5 text-xs text-slate-500">
                    {formatCurrency(project.spent)} sur {formatCurrency(project.budget)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  )
}
