import Ionicons from '@expo/vector-icons/Ionicons'
import { useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { dashboardApi, projectsApi } from '../../../api/resources'
import Card from '../../../components/ui/Card'
import Screen from '../../../components/ui/Screen'
import { ErrorState, Loader } from '../../../components/ui/States'
import { useAuth } from '../../../context/AuthProvider'
import { useFetch } from '../../../hooks/useFetch'
import { radius, useChartSeries, useColors } from '../../../theme'
import { TASK_STATUSES, formatCompact, formatCurrency, formatPercent } from '../../../utils/format'

const loadDashboard = () => Promise.all([dashboardApi.get(), projectsApi.list()])

function StatTile({ icon, label, value, hint, alert, onPress }) {
  const colors = useColors()
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      style={({ pressed }) => [
        styles.tile,
        { backgroundColor: pressed ? colors.subtle : colors.card, borderColor: colors.border },
      ]}
    >
      <View style={[styles.tileIcon, { backgroundColor: colors.primarySoft }]}>
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>
      <Text style={[styles.tileLabel, { color: colors.muted }]} numberOfLines={2}>
        {label}
      </Text>
      <Text style={[styles.tileValue, { color: colors.text }]}>{value}</Text>
      {hint ? (
        <Text style={[styles.tileHint, { color: alert ? colors.danger : colors.muted }]} numberOfLines={2}>
          {hint}
        </Text>
      ) : null}
    </Pressable>
  )
}

function SectionTitle({ title, subtitle }) {
  const colors = useColors()
  return (
    <View style={styles.sectionTitle}>
      <Text style={[styles.cardTitle, { color: colors.text }]}>{title}</Text>
      {subtitle ? <Text style={[styles.cardSubtitle, { color: colors.muted }]}>{subtitle}</Text> : null}
    </View>
  )
}

// Budget prevu et depense des 5 plus gros projets : deux barres fines par projet, valeurs ecrites
function BudgetByProject({ projects }) {
  const { t } = useTranslation()
  const colors = useColors()
  const series = useChartSeries()
  const rows = [...projects].sort((a, b) => b.budget - a.budget).slice(0, 5)
  const max = Math.max(1, ...rows.flatMap((p) => [Number(p.budget), Number(p.spent)]))

  return (
    <Card>
      <SectionTitle title={t('dashboard.budgetChart.title')} subtitle={t('dashboard.budgetChart.subtitle')} />
      <View style={styles.legend}>
        {[t('dashboard.col.budget'), t('dashboard.col.spent')].map((label, index) => (
          <View key={label} style={styles.legendItem}>
            <View style={[styles.swatch, { backgroundColor: series[index] }]} />
            <Text style={[styles.legendText, { color: colors.textSecondary }]}>{label}</Text>
          </View>
        ))}
      </View>
      {rows.length === 0 ? (
        <Text style={[styles.empty, { color: colors.muted }]}>{t('dashboard.budgetChart.empty')}</Text>
      ) : (
        rows.map((project) => (
          <View
            key={project.id}
            style={styles.barGroup}
            accessible
            accessibilityLabel={`${project.name} : ${t('dashboard.col.budget')} ${formatCurrency(project.budget)}, ${t('dashboard.col.spent')} ${formatCurrency(project.spent)}`}
          >
            <Text style={[styles.barLabel, { color: colors.text }]} numberOfLines={1}>
              {project.name}
            </Text>
            {[project.budget, project.spent].map((amount, index) => (
              <View key={index} style={styles.barRow}>
                <View style={styles.barTrack}>
                  <View
                    style={[
                      styles.bar,
                      { width: `${(Number(amount) / max) * 100}%`, backgroundColor: series[index], minWidth: Number(amount) > 0 ? 4 : 0 },
                    ]}
                  />
                </View>
                <Text style={[styles.barValue, { color: colors.textSecondary }]}>{formatCompact(amount)}</Text>
              </View>
            ))}
          </View>
        ))
      )}
    </Card>
  )
}

// Repartition des taches par statut : une barre empilee + legende chiffree
function TaskProgress({ tasksByStatus, overdueTasks }) {
  const { t } = useTranslation()
  const colors = useColors()
  const series = useChartSeries()
  const total = Object.values(tasksByStatus).reduce((sum, count) => sum + count, 0)
  const rows = TASK_STATUSES.map((status, index) => {
    const count = tasksByStatus[status] ?? 0
    return { status, count, color: series[index], percent: total ? Math.round((count / total) * 100) : 0 }
  })

  return (
    <Card>
      <SectionTitle
        title={t('dashboard.tasksChart.title')}
        subtitle={total ? t('dashboard.tasksChart.subtitle', { count: total }) : undefined}
      />
      {total === 0 ? (
        <Text style={[styles.empty, { color: colors.muted }]}>{t('dashboard.tasksChart.empty')}</Text>
      ) : (
        <>
          <View style={styles.stack} accessible accessibilityLabel={t('dashboard.tasksChart.aria')}>
            {rows
              .filter((row) => row.count > 0)
              .map((row) => (
                <View key={row.status} style={{ flex: row.count, backgroundColor: row.color }} />
              ))}
          </View>
          {rows.map((row) => (
            <View key={row.status} style={styles.statusRow}>
              <View style={[styles.swatch, { backgroundColor: row.color }]} />
              <Text style={[styles.statusLabel, { color: colors.textSecondary }]}>{t(`enums.taskStatus.${row.status}`)}</Text>
              <Text style={[styles.statusCount, { color: colors.text }]}>{row.count}</Text>
              <Text style={[styles.statusPercent, { color: colors.muted }]}>{formatPercent(row.percent)}</Text>
            </View>
          ))}
          {overdueTasks > 0 && (
            <View style={[styles.alert, { backgroundColor: colors.dangerSoft }]}>
              <Ionicons name="warning" size={16} color={colors.danger} />
              <Text style={[styles.alertText, { color: colors.danger }]}>
                {t('dashboard.tasksChart.overdue', { count: overdueTasks })}
              </Text>
            </View>
          )}
        </>
      )}
    </Card>
  )
}

// Depenses par categorie, de la plus importante a la plus faible
function ExpensesByCategory({ expensesByCategory }) {
  const { t } = useTranslation()
  const colors = useColors()
  const series = useChartSeries()
  const total = Object.values(expensesByCategory).reduce((sum, amount) => sum + Number(amount), 0)
  const rows = Object.entries(expensesByCategory)
    .map(([category, amount]) => ({ category, amount: Number(amount), percent: total ? Math.round((Number(amount) / total) * 100) : 0 }))
    .sort((a, b) => b.amount - a.amount)

  return (
    <Card>
      <SectionTitle
        title={t('dashboard.categoryChart.title')}
        subtitle={total ? t('dashboard.categoryChart.total', { total: formatCurrency(total) }) : undefined}
      />
      {total === 0 ? (
        <Text style={[styles.empty, { color: colors.muted }]}>{t('dashboard.categoryChart.empty')}</Text>
      ) : (
        rows.map((row) => (
          <View key={row.category} style={styles.categoryRow}>
            <View style={styles.categoryHeader}>
              <Text style={[styles.statusLabel, { color: colors.textSecondary }]}>{t(`enums.expenseCategory.${row.category}`)}</Text>
              <Text style={[styles.statusCount, { color: colors.text }]}>
                {formatCompact(row.amount)} <Text style={{ color: colors.muted, fontWeight: '400' }}>· {formatPercent(row.percent)}</Text>
              </Text>
            </View>
            <View style={[styles.track, { backgroundColor: colors.subtle }]}>
              <View style={[styles.fill, { width: `${row.percent}%`, backgroundColor: series[0], minWidth: row.amount > 0 ? 4 : 0 }]} />
            </View>
          </View>
        ))
      )}
    </Card>
  )
}

export default function DashboardScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const { user } = useAuth()
  const { data, error, loading, refreshing, refresh, reload } = useFetch(loadDashboard)

  const header = { title: t('dashboard.greeting', { name: user.firstName }), subtitle: t('dashboard.intro', { company: user.organizationName }) }
  if (loading) return <Screen {...header}><Loader /></Screen>
  if (error && !data) return <Screen {...header}><ErrorState message={error} onRetry={reload} /></Screen>

  const [stats, projects] = data
  const consumed = stats.totalBudget > 0 ? Math.round((stats.totalSpent / stats.totalBudget) * 100) : 0
  const activeProjects = stats.totalProjects - (stats.projectsByStatus.DONE ?? 0)

  return (
    <Screen {...header} onRefresh={refresh} refreshing={refreshing}>
      <View style={styles.tiles}>
        <StatTile
          icon="folder-outline"
          label={t('nav.projects')}
          value={stats.totalProjects}
          hint={t('dashboard.activeProjects', { count: activeProjects })}
          onPress={() => router.navigate('/projects')}
        />
        <StatTile
          icon="wallet-outline"
          label={t('budget.consumedLabel')}
          value={formatPercent(consumed)}
          hint={t('dashboard.spentOf', { spent: formatCompact(stats.totalSpent), budget: formatCompact(stats.totalBudget) })}
        />
        <StatTile
          icon="checkbox-outline"
          label={t('dashboard.myOpenTasks')}
          value={stats.myOpenTasks}
          hint={stats.overdueTasks > 0 ? t('dashboard.overdueInProjects', { count: stats.overdueTasks }) : t('dashboard.noOverdue')}
          alert={stats.overdueTasks > 0}
          onPress={() => router.navigate('/tasks')}
        />
        <StatTile
          icon="chatbubbles-outline"
          label={t('dashboard.unreadMessages')}
          value={stats.unreadMessages}
          onPress={() => router.navigate('/messages')}
        />
      </View>
      <BudgetByProject projects={projects} />
      <TaskProgress tasksByStatus={stats.tasksByStatus} overdueTasks={stats.overdueTasks} />
      <ExpensesByCategory expensesByCategory={stats.expensesByCategory} />
    </Screen>
  )
}

const styles = StyleSheet.create({
  tiles: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  tile: { flexGrow: 1, flexBasis: '45%', borderWidth: 1, borderRadius: radius.lg, padding: 14, gap: 6 },
  tileIcon: { width: 34, height: 34, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center', marginBottom: 2 },
  tileLabel: { fontSize: 13, fontWeight: '500' },
  tileValue: { fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
  tileHint: { fontSize: 12 },
  sectionTitle: { gap: 2, marginBottom: 14 },
  cardTitle: { fontSize: 16, fontWeight: '700' },
  cardSubtitle: { fontSize: 13 },
  legend: { flexDirection: 'row', gap: 16, marginBottom: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendText: { fontSize: 13 },
  swatch: { width: 10, height: 10, borderRadius: 2 },
  empty: { fontSize: 14, textAlign: 'center', paddingVertical: 20 },
  barGroup: { marginBottom: 14, gap: 4 },
  barLabel: { fontSize: 13, fontWeight: '600' },
  barRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  barTrack: { flex: 1 },
  bar: { height: 10, borderTopRightRadius: 4, borderBottomRightRadius: 4 },
  barValue: { width: 52, fontSize: 12, textAlign: 'right' },
  stack: { flexDirection: 'row', height: 14, borderRadius: 4, overflow: 'hidden', gap: 2, marginBottom: 14 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 5 },
  statusLabel: { flex: 1, fontSize: 14 },
  statusCount: { fontSize: 14, fontWeight: '700' },
  statusPercent: { width: 44, fontSize: 12, textAlign: 'right' },
  alert: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: radius.md, padding: 10, marginTop: 10 },
  alertText: { fontSize: 14, fontWeight: '600' },
  categoryRow: { marginBottom: 12, gap: 6 },
  categoryHeader: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 },
  track: { height: 8, borderRadius: 999, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 999 },
})
