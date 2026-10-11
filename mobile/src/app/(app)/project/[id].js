import { useLocalSearchParams } from 'expo-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, StyleSheet, Text, View } from 'react-native'
import { getErrorMessage } from '../../../api/client'
import { expensesApi, projectsApi, tasksApi } from '../../../api/resources'
import Button from '../../../components/Button'
import Notice from '../../../components/Notice'
import TaskRow from '../../../components/TaskRow'
import Avatar from '../../../components/ui/Avatar'
import { StatusBadge } from '../../../components/ui/Badge'
import BudgetBar from '../../../components/ui/BudgetBar'
import Card from '../../../components/ui/Card'
import OptionSheet from '../../../components/ui/OptionSheet'
import Screen from '../../../components/ui/Screen'
import Segmented from '../../../components/ui/Segmented'
import { EmptyState, ErrorState, Loader } from '../../../components/ui/States'
import { useAuth } from '../../../context/AuthProvider'
import { useFetch } from '../../../hooks/useFetch'
import { useColors } from '../../../theme'
import {
  PROJECT_STATUSES,
  TASK_STATUSES,
  canChangeStatus,
  canWorkOnTasks,
  formatCurrency,
  formatDate,
  fullName,
} from '../../../utils/format'

function BudgetTab({ project, expenses }) {
  const { t } = useTranslation()
  const colors = useColors()
  const items = [
    { label: t('project.allocated'), value: project.budget },
    { label: t('dashboard.col.spent'), value: project.spent },
    { label: t('project.remaining'), value: project.remaining, negative: project.remaining < 0 },
  ]
  return (
    <>
      <Card style={styles.gap}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>{t('dashboard.col.budget')}</Text>
        {items.map(({ label, value, negative }) => (
          <View key={label} style={styles.line}>
            <Text style={[styles.lineLabel, { color: colors.muted }]}>{label}</Text>
            <Text style={[styles.lineValue, { color: negative ? colors.danger : colors.text }]}>{formatCurrency(value)}</Text>
          </View>
        ))}
        <BudgetBar percent={project.consumedPercent} />
      </Card>

      <Card style={styles.gap}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>{t('nav.team')}</Text>
        {[project.owner, ...project.members].map((member, index) => (
          <View key={member.id} style={styles.member}>
            <Avatar user={member} size="sm" />
            <Text style={[styles.memberName, { color: colors.text }]} numberOfLines={1}>
              {fullName(member)}
            </Text>
            {index === 0 && <Text style={[styles.owner, { color: colors.primary }]}>{t('project.owner')}</Text>}
          </View>
        ))}
      </Card>

      <Card style={styles.gap}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>{t('dashboard.col.expenses')}</Text>
        {expenses.length === 0 ? (
          <Text style={[styles.lineLabel, { color: colors.muted }]}>{t('project.noExpenses')}</Text>
        ) : (
          expenses.map((expense) => (
            <View key={expense.id} style={[styles.expense, { borderTopColor: colors.border }]}>
              <View style={styles.expenseMain}>
                <Text style={[styles.expenseLabel, { color: colors.text }]}>{expense.label}</Text>
                <Text style={[styles.lineLabel, { color: colors.muted }]}>
                  {t(`enums.expenseCategory.${expense.category}`)} · {formatDate(expense.date)}
                </Text>
              </View>
              <Text style={[styles.lineValue, { color: colors.text }]}>{formatCurrency(expense.amount)}</Text>
            </View>
          ))
        )}
      </Card>
    </>
  )
}

export default function ProjectScreen() {
  const { id } = useLocalSearchParams()
  const { t } = useTranslation()
  const colors = useColors()
  const { user } = useAuth()
  const { data, error, loading, refreshing, refresh, reload } = useFetch(() =>
    Promise.all([projectsApi.get(id), tasksApi.list(id), expensesApi.list(id)]),
  )
  const [tab, setTab] = useState('tasks')
  const [taskToMove, setTaskToMove] = useState(null)
  const [statusOpen, setStatusOpen] = useState(false)
  const [actionError, setActionError] = useState('')
  const [joining, setJoining] = useState(false)

  if (loading) return <Screen edges={[]}><Loader /></Screen>
  if (error && !data) return <Screen edges={[]}><ErrorState message={error} onRetry={reload} /></Screen>

  const [project, tasks, expenses] = data
  const canWork = canWorkOnTasks(user, project)

  const run = async (action) => {
    setActionError('')
    try {
      await action()
      await reload()
    } catch (err) {
      setActionError(getErrorMessage(err))
    }
  }

  // Reunion video : la salle Jitsi du projet s'ouvre dans l'application Jitsi Meet ou le navigateur
  const joinMeeting = async () => {
    setActionError('')
    setJoining(true)
    try {
      const meeting = await projectsApi.meeting(project.id)
      await Linking.openURL(meeting.url)
    } catch (err) {
      setActionError(getErrorMessage(err))
    } finally {
      setJoining(false)
    }
  }

  return (
    <Screen edges={[]} onRefresh={refresh} refreshing={refreshing}>
      <View style={styles.gap}>
        <View style={styles.titleRow}>
          <Text style={[styles.title, { color: colors.text }]}>{project.name}</Text>
          <StatusBadge status={project.status} group="projectStatus" />
        </View>
        <Text style={[styles.description, { color: colors.textSecondary }]}>
          {project.description || t('projects.noDescription')}
        </Text>
        {(project.startDate || project.endDate) && (
          <Text style={[styles.lineLabel, { color: colors.muted }]}>
            {t('project.dates', { start: formatDate(project.startDate), end: formatDate(project.endDate) })}
          </Text>
        )}
        {project.taskCount > 0 && (
          <Text style={[styles.lineLabel, { color: colors.muted }]}>
            {t('project.tasksCompleted', { done: project.completedTaskCount, total: project.taskCount })}
          </Text>
        )}
      </View>

      <View style={styles.actions}>
        <Button title={t('project.meeting')} loading={joining} onPress={joinMeeting} style={styles.action} />
        {canChangeStatus(user, project) && (
          <Button variant="secondary" title={t('project.changeStatus')} onPress={() => setStatusOpen(true)} style={styles.action} />
        )}
      </View>
      <Notice>{actionError}</Notice>

      <Segmented
        value={tab}
        onChange={setTab}
        options={[
          { value: 'tasks', label: t('project.tasksTab', { count: tasks.length }) },
          { value: 'budget', label: t('project.budgetTab') },
        ]}
      />

      {tab === 'tasks' &&
        (tasks.length === 0 ? (
          <EmptyState icon="checkbox-outline" title={t('dashboard.tasksChart.empty')} />
        ) : (
          TASK_STATUSES.map((status) => {
            const column = tasks.filter((task) => task.status === status).sort((a, b) => a.position - b.position)
            return (
              <View key={status} style={styles.column}>
                <View style={styles.columnHeader}>
                  <StatusBadge status={status} />
                  <Text style={[styles.count, { color: colors.muted }]}>{column.length}</Text>
                </View>
                {column.length === 0 ? (
                  <Text style={[styles.emptyColumn, { color: colors.muted, borderColor: colors.border }]}>—</Text>
                ) : (
                  column.map((task) => (
                    <TaskRow key={task.id} task={task} onPress={canWork ? () => setTaskToMove(task) : undefined} />
                  ))
                )}
              </View>
            )
          })
        ))}

      {tab === 'budget' && <BudgetTab project={project} expenses={expenses} />}

      <OptionSheet
        visible={Boolean(taskToMove)}
        title={taskToMove?.title ?? ''}
        selected={taskToMove?.status}
        options={TASK_STATUSES.map((status) => ({ value: status, label: t(`enums.taskStatus.${status}`) }))}
        onClose={() => setTaskToMove(null)}
        onSelect={(status) => {
          const task = taskToMove
          setTaskToMove(null)
          if (status !== task.status) run(() => tasksApi.changeStatus(task.id, status))
        }}
      />
      <OptionSheet
        visible={statusOpen}
        title={t('project.changeStatus')}
        selected={project.status}
        options={PROJECT_STATUSES.map((status) => ({ value: status, label: t(`enums.projectStatus.${status}`) }))}
        onClose={() => setStatusOpen(false)}
        onSelect={(status) => {
          setStatusOpen(false)
          if (status !== project.status) run(() => projectsApi.updateStatus(project.id, status))
        }}
      />
    </Screen>
  )
}

const styles = StyleSheet.create({
  gap: { gap: 10 },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 },
  title: { flex: 1, fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
  description: { fontSize: 15, lineHeight: 22 },
  actions: { flexDirection: 'row', gap: 10 },
  action: { flex: 1 },
  column: { gap: 8 },
  columnHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  count: { fontSize: 13, fontWeight: '600' },
  emptyColumn: { borderWidth: 1, borderStyle: 'dashed', borderRadius: 12, padding: 10, textAlign: 'center' },
  cardTitle: { fontSize: 16, fontWeight: '700' },
  line: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  lineLabel: { fontSize: 13 },
  lineValue: { fontSize: 15, fontWeight: '700' },
  member: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  memberName: { flex: 1, fontSize: 14 },
  owner: { fontSize: 12, fontWeight: '600' },
  expense: { flexDirection: 'row', alignItems: 'center', gap: 10, borderTopWidth: 1, paddingTop: 10 },
  expenseMain: { flex: 1, gap: 2 },
  expenseLabel: { fontSize: 14, fontWeight: '600' },
})
