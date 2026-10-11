import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, StyleSheet, Switch, Text, View } from 'react-native'
import { getErrorMessage } from '../../../api/client'
import { tasksApi } from '../../../api/resources'
import Notice from '../../../components/Notice'
import TaskRow from '../../../components/TaskRow'
import OptionSheet from '../../../components/ui/OptionSheet'
import Screen from '../../../components/ui/Screen'
import { EmptyState, ErrorState, Loader } from '../../../components/ui/States'
import { useFetch } from '../../../hooks/useFetch'
import { useColors } from '../../../theme'
import { TASK_STATUSES } from '../../../utils/format'

// Toutes les taches confiees a l'utilisateur, tous projets confondus
export default function MyTasksScreen() {
  const { t } = useTranslation()
  const colors = useColors()
  const { data: tasks, error, loading, refreshing, refresh, reload } = useFetch(tasksApi.mine)
  const [showDone, setShowDone] = useState(false)
  const [taskToMove, setTaskToMove] = useState(null)
  const [actionError, setActionError] = useState('')

  if (loading) return <Screen title={t('nav.myTasks')}><Loader /></Screen>
  if (error && !tasks) return <Screen title={t('nav.myTasks')}><ErrorState message={error} onRetry={reload} /></Screen>

  const open = tasks.filter((task) => task.status !== 'DONE')
  const done = tasks.filter((task) => task.status === 'DONE')
  const overdue = open.filter((task) => task.overdue).length
  const visible = showDone ? tasks : open
  const subtitle =
    open.length === 0
      ? t('myTasks.none')
      : overdue
        ? t('myTasks.openWithOverdue', { count: open.length, overdue })
        : t('myTasks.open', { count: open.length })

  const changeStatus = async (task, status) => {
    setActionError('')
    try {
      await tasksApi.changeStatus(task.id, status)
      await reload()
    } catch (err) {
      setActionError(getErrorMessage(err))
    }
  }

  return (
    <Screen title={t('nav.myTasks')} subtitle={subtitle} onRefresh={refresh} refreshing={refreshing}>
      <Notice>{actionError}</Notice>
      {tasks.length === 0 ? (
        <EmptyState icon="checkbox-outline" title={t('myTasks.emptyTitle')} description={t('myTasks.emptyDescription')} />
      ) : (
        <>
          {done.length > 0 && (
            <Pressable style={styles.toggle} onPress={() => setShowDone(!showDone)} accessibilityRole="switch" accessibilityState={{ checked: showDone }}>
              <Text style={[styles.toggleText, { color: colors.textSecondary }]}>{t('myTasks.showDone', { count: done.length })}</Text>
              <Switch
                value={showDone}
                onValueChange={setShowDone}
                trackColor={{ true: colors.primary }}
                accessibilityLabel={t('myTasks.showDone', { count: done.length })}
              />
            </Pressable>
          )}
          {visible.length === 0 ? (
            <EmptyState icon="checkmark-done-outline" title={t('myTasks.allDone')} />
          ) : (
            <View style={styles.list}>
              {visible.map((task) => (
                <TaskRow key={task.id} task={task} showProject showStatus onPress={() => setTaskToMove(task)} />
              ))}
            </View>
          )}
        </>
      )}
      <OptionSheet
        visible={Boolean(taskToMove)}
        title={taskToMove?.title ?? ''}
        selected={taskToMove?.status}
        options={TASK_STATUSES.map((status) => ({ value: status, label: t(`enums.taskStatus.${status}`) }))}
        onClose={() => setTaskToMove(null)}
        onSelect={(status) => {
          const task = taskToMove
          setTaskToMove(null)
          if (status !== task.status) changeStatus(task, status)
        }}
      />
    </Screen>
  )
}

const styles = StyleSheet.create({
  toggle: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 },
  toggleText: { flex: 1, fontSize: 14 },
  list: { gap: 10 },
})
