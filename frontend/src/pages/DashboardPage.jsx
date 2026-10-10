import { AlertTriangle, FolderKanban, ListTodo, MessageSquare, Wallet } from 'lucide-react'
import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { dashboardApi, projectsApi } from '../api/resources'
import {
  BudgetByProjectChart,
  ExpensesByCategoryChart,
  MonthlyExpensesChart,
  TaskProgressChart,
} from '../components/charts/DashboardCharts'
import Card from '../components/ui/Card'
import PageHeader from '../components/ui/PageHeader'
import { ErrorState, PageLoader } from '../components/ui/States'
import { useAuth } from '../context/useAuth'
import { useFetch } from '../hooks/useFetch'
import { formatCurrency, formatPercent } from '../utils/format'
import { useTranslation } from 'react-i18next'

function StatTile({ Icon, label, value, hint, to }) {
  const content = (
    <Card className="h-full p-5 transition hover:ring-indigo-200">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
          <Icon className="size-5" aria-hidden />
        </span>
        <p className="text-sm font-medium text-slate-500">{label}</p>
      </div>
      <p className="mt-4 text-2xl font-bold tracking-tight text-slate-900">{value}</p>
      {hint && <div className="mt-1 text-xs text-slate-500">{hint}</div>}
    </Card>
  )
  return to ? (
    <Link to={to} className="block">
      {content}
    </Link>
  ) : (
    content
  )
}

export default function DashboardPage() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const loadData = useCallback(() => Promise.all([dashboardApi.get(), projectsApi.list()]), [])
  const { data, loading, error } = useFetch(loadData)

  if (loading) return <PageLoader />
  if (error) return <ErrorState message={error} />

  const [stats, projects] = data
  const consumed = stats.totalBudget > 0 ? Math.round((stats.totalSpent / stats.totalBudget) * 100) : 0
  const activeProjects = stats.totalProjects - (stats.projectsByStatus.DONE ?? 0)

  return (
    <>
      <PageHeader title={t('dashboard.greeting', { name: user.firstName })} description={t('dashboard.intro', { company: user.organizationName })} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatTile
          Icon={FolderKanban}
          label={t('nav.projects')}
          value={stats.totalProjects}
          hint={t('dashboard.activeProjects', { count: activeProjects })}
          to="/app/projects"
        />
        <StatTile
          Icon={Wallet}
          label={t('budget.consumedLabel')}
          value={formatPercent(consumed)}
          hint={t('dashboard.spentOf', { spent: formatCurrency(stats.totalSpent), budget: formatCurrency(stats.totalBudget) })}
        />
        <StatTile
          Icon={ListTodo}
          label={t('dashboard.myOpenTasks')}
          value={stats.myOpenTasks}
          to="/app/tasks"
          hint={
            stats.overdueTasks > 0 ? (
              <span className="flex items-center gap-1 font-medium text-red-700">
                <AlertTriangle className="size-3.5" aria-hidden />
                {t('dashboard.overdueInProjects', { count: stats.overdueTasks })}
              </span>
            ) : (
              t('dashboard.noOverdue')
            )
          }
        />
        <StatTile Icon={MessageSquare} label={t('dashboard.unreadMessages')} value={stats.unreadMessages} to="/app/messages" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <BudgetByProjectChart projects={projects} className="xl:col-span-2" />
        <TaskProgressChart tasksByStatus={stats.tasksByStatus} overdueTasks={stats.overdueTasks} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <MonthlyExpensesChart monthlyExpenses={stats.monthlyExpenses} className="xl:col-span-2" />
        <ExpensesByCategoryChart expensesByCategory={stats.expensesByCategory} />
      </div>
    </>
  )
}
