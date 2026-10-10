import { AlertTriangle } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, LabelList, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useChartColors, useTaskStatusColors } from '../../utils/chartColors'
import { prefersReducedMotion } from '../../utils/motion'
import { EXPENSE_CATEGORY, TASK_STATUS, formatCompact, formatCurrency, formatMonth, formatPercent } from '../../utils/format'
import ChartCard from './ChartCard'
import { useTranslation } from 'react-i18next'

// Pas d'animation d'entree des barres si l'utilisateur a demande a reduire les animations
const ANIMATE = !prefersReducedMotion()

// Infobulle commune : textes en encre neutre, la pastille de couleur porte l'identite de la serie
function ChartTooltip({ active, payload, label, labelFormatter = (value) => value }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg bg-white px-3 py-2 text-sm shadow-lg ring-1 ring-slate-200">
      <p className="mb-1 font-medium text-slate-900">{labelFormatter(label)}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="flex items-center gap-2 text-slate-600">
          <span className="size-2.5 rounded-sm" style={{ backgroundColor: entry.color }} aria-hidden />
          {entry.name} : <span className="font-medium text-slate-900">{formatCurrency(entry.value)}</span>
        </p>
      ))}
    </div>
  )
}

// Nom de projet sur une seule ligne, tronque si besoin (le nom complet reste dans l'infobulle et le tableau)
function ProjectTick({ x, y, payload, color }) {
  const name = payload.value.length > 17 ? `${payload.value.slice(0, 16)}…` : payload.value
  return (
    <text x={x - 8} y={y} dy={4} textAnchor="end" fill={color} fontSize={12}>
      {name}
    </text>
  )
}

function NoData({ children }) {
  return (
    <div className="flex h-full min-h-40 items-center justify-center rounded-lg border-2 border-dashed border-slate-200 p-6 text-center text-sm text-slate-400">
      {children}
    </div>
  )
}

// Budget prevu et depenses des projets les plus importants (barres horizontales groupees)
export function BudgetByProjectChart({ projects, className }) {
  const { t } = useTranslation()
  const { series, chrome } = useChartColors()
  const tick = { fill: chrome.muted, fontSize: 12 }
  const data = [...projects]
    .sort((a, b) => b.budget - a.budget)
    .slice(0, 6)
    .map((project) => ({ name: project.name, budget: project.budget, spent: project.spent }))

  return (
    <ChartCard
      title={t('dashboard.budgetChart.title')}
      subtitle={projects.length > 6 ? t('dashboard.budgetChart.top6') : t('dashboard.budgetChart.subtitle')}
      className={className}
      table={{
        columns: [t('dashboard.col.project'), t('dashboard.col.budget'), t('dashboard.col.spent')],
        rows: data.map((row) => [row.name, formatCurrency(row.budget), formatCurrency(row.spent)]),
      }}
    >
      {data.length === 0 ? (
        <NoData>{t('dashboard.budgetChart.empty')}</NoData>
      ) : (
        <ResponsiveContainer width="100%" height={70 + data.length * 52}>
          <BarChart data={data} layout="vertical" barGap={2} margin={{ top: 0, right: 48, bottom: 0, left: 0 }}>
            <CartesianGrid horizontal={false} stroke={chrome.grid} />
            <XAxis type="number" tickFormatter={formatCompact} tick={tick} axisLine={false} tickLine={false} />
            <YAxis
              type="category"
              dataKey="name"
              width={150}
              tick={<ProjectTick color={chrome.text} />}
              axisLine={{ stroke: chrome.axis }}
              tickLine={false}
            />
            <Tooltip content={<ChartTooltip />} cursor={{ fill: chrome.cursor }} />
            <Legend verticalAlign="top" align="left" iconType="square" iconSize={10} wrapperStyle={{ fontSize: 13, paddingBottom: 12 }} />
            <Bar dataKey="budget" name={t('dashboard.col.budget')} fill={series[0]} isAnimationActive={ANIMATE} barSize={12} radius={[0, 4, 4, 0]}>
              <LabelList dataKey="budget" position="right" formatter={formatCompact} style={{ fill: chrome.text, fontSize: 11 }} />
            </Bar>
            <Bar dataKey="spent" name={t('dashboard.col.spent')} fill={series[1]} isAnimationActive={ANIMATE} barSize={12} radius={[0, 4, 4, 0]}>
              <LabelList dataKey="spent" position="right" formatter={formatCompact} style={{ fill: chrome.text, fontSize: 11 }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  )
}

// Repartition des taches par statut : une barre empilee + legende chiffree (etiquettes directes)
export function TaskProgressChart({ tasksByStatus, overdueTasks, className }) {
  const { t } = useTranslation()
  const statusColors = useTaskStatusColors()
  const total = Object.values(tasksByStatus).reduce((sum, count) => sum + count, 0)
  const rows = Object.entries(TASK_STATUS).map(([status, { label }]) => {
    const color = statusColors[status]
    const count = tasksByStatus[status] ?? 0
    return { status, label, color, count, percent: total ? Math.round((count / total) * 100) : 0 }
  })

  return (
    <ChartCard
      title={t('dashboard.tasksChart.title')}
      subtitle={total ? t('dashboard.tasksChart.subtitle', { count: total }) : undefined}
      className={className}
      table={{ columns: [t('dashboard.col.status'), t('dashboard.col.tasks'), t('dashboard.col.share')], rows: rows.map((r) => [r.label, r.count, formatPercent(r.percent)]) }}
    >
      {total === 0 ? (
        <NoData>{t('dashboard.tasksChart.empty')}</NoData>
      ) : (
        <>
          <div className="flex h-4 gap-0.5 overflow-hidden rounded" role="img" aria-label={t('dashboard.tasksChart.aria')}>
            {rows
              .filter((row) => row.count > 0)
              .map((row) => (
                <div
                  key={row.status}
                  title={`${row.label}: ${row.count} (${formatPercent(row.percent)})`}
                  className="h-full transition-opacity hover:opacity-80"
                  style={{ width: `${row.percent}%`, backgroundColor: row.color }}
                />
              ))}
          </div>
          <ul className="mt-5 space-y-3">
            {rows.map((row) => (
              <li key={row.status} className="flex items-center gap-3 text-sm">
                <span className="size-3 rounded-sm" style={{ backgroundColor: row.color }} aria-hidden />
                <span className="flex-1 text-slate-600">{row.label}</span>
                <span className="font-semibold text-slate-900 tabular-nums">{row.count}</span>
                <span className="w-10 text-right text-xs text-slate-500 tabular-nums">{formatPercent(row.percent)}</span>
              </li>
            ))}
          </ul>
          {overdueTasks > 0 && (
            <p className="mt-5 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-800">
              <AlertTriangle className="size-4 shrink-0" aria-hidden />
              {t('dashboard.tasksChart.overdue', { count: overdueTasks })}
            </p>
          )}
        </>
      )}
    </ChartCard>
  )
}

// Depenses des 6 derniers mois (colonnes, une seule serie)
export function MonthlyExpensesChart({ monthlyExpenses, className }) {
  const { t } = useTranslation()
  const { series, chrome } = useChartColors()
  const tick = { fill: chrome.muted, fontSize: 12 }
  const hasData = monthlyExpenses.some((month) => month.amount > 0)

  return (
    <ChartCard
      title={t('dashboard.monthlyChart.title')}
      subtitle={t('dashboard.monthlyChart.subtitle')}
      className={className}
      table={{
        columns: [t('dashboard.col.month'), t('dashboard.col.expenses')],
        rows: monthlyExpenses.map((m) => [formatMonth(m.month, true), formatCurrency(m.amount)]),
      }}
    >
      {!hasData ? (
        <NoData>{t('dashboard.monthlyChart.empty')}</NoData>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={monthlyExpenses} margin={{ top: 20, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid vertical={false} stroke={chrome.grid} />
            <XAxis
              dataKey="month"
              tickFormatter={(month) => formatMonth(month)}
              tick={tick}
              axisLine={{ stroke: chrome.axis }}
              tickLine={false}
            />
            <YAxis tickFormatter={formatCompact} tick={tick} axisLine={false} tickLine={false} width={48} />
            <Tooltip
              content={<ChartTooltip labelFormatter={(month) => formatMonth(month, true)} />}
              cursor={{ fill: chrome.cursor }}
            />
            <Bar dataKey="amount" name={t('dashboard.col.expenses')} fill={series[0]} isAnimationActive={ANIMATE} maxBarSize={40} radius={[4, 4, 0, 0]}>
              <LabelList
                dataKey="amount"
                position="top"
                formatter={(value) => (value > 0 ? formatCompact(value) : '')}
                style={{ fill: chrome.text, fontSize: 11 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </ChartCard>
  )
}

// Depenses par categorie, de la plus importante a la plus faible (barres horizontales, une seule serie)
export function ExpensesByCategoryChart({ expensesByCategory, className }) {
  const { t } = useTranslation()
  const { series } = useChartColors()
  const total = Object.values(expensesByCategory).reduce((sum, amount) => sum + Number(amount), 0)
  const rows = Object.entries(expensesByCategory)
    .map(([category, amount]) => ({
      category: EXPENSE_CATEGORY[category],
      amount: Number(amount),
      percent: total ? Math.round((Number(amount) / total) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount)

  return (
    <ChartCard
      title={t('dashboard.categoryChart.title')}
      subtitle={total ? t('dashboard.categoryChart.total', { total: formatCurrency(total) }) : undefined}
      className={className}
      table={{
        columns: [t('dashboard.col.category'), t('dashboard.col.amount'), t('dashboard.col.share')],
        rows: rows.map((r) => [r.category, formatCurrency(r.amount), formatPercent(r.percent)]),
      }}
    >
      {total === 0 ? (
        <NoData>{t('dashboard.categoryChart.empty')}</NoData>
      ) : (
        <ul className="space-y-4">
          {rows.map((row) => (
            <li key={row.category} title={`${row.category}: ${formatCurrency(row.amount)} (${formatPercent(row.percent)})`}>
              <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
                <span className="text-slate-600">{row.category}</span>
                <span className="font-medium text-slate-900 tabular-nums">
                  {formatCompact(row.amount)} <span className="text-xs font-normal text-slate-500">· {formatPercent(row.percent)}</span>
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${row.percent}%`, backgroundColor: series[0], minWidth: row.amount > 0 ? 4 : 0 }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </ChartCard>
  )
}
