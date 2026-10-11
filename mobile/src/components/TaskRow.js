import Ionicons from '@expo/vector-icons/Ionicons'
import { useTranslation } from 'react-i18next'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { radius, useColors } from '../theme'
import { formatDate } from '../utils/format'
import Avatar from './ui/Avatar'
import { PriorityBadge, StatusBadge } from './ui/Badge'

/**
 * Une tache : titre, priorite, echeance (alerte si en retard) et personne assignee.
 * Un appui ouvre le choix du statut (si l'utilisateur peut travailler sur la tache).
 */
export default function TaskRow({ task, onPress, showProject = false, showStatus = false }) {
  const { t } = useTranslation()
  const colors = useColors()
  const done = task.status === 'DONE'
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={t('tasks.cardLabel', { title: task.title })}
      accessibilityHint={onPress ? t('tasks.changeStatusHint') : undefined}
      style={({ pressed }) => [
        styles.row,
        { backgroundColor: pressed ? colors.subtle : colors.card, borderColor: colors.border },
      ]}
    >
      <View style={styles.main}>
        <Text
          style={[styles.title, { color: done ? colors.muted : colors.text }, done && styles.done]}
          numberOfLines={2}
        >
          {task.title}
        </Text>
        {showProject && (
          <Text style={[styles.project, { color: colors.primary }]} numberOfLines={1}>
            {task.projectName}
          </Text>
        )}
        <View style={styles.meta}>
          {showStatus && <StatusBadge status={task.status} />}
          <PriorityBadge priority={task.priority} />
          {task.dueDate && (
            <View style={styles.due}>
              <Ionicons name={task.overdue ? 'warning' : 'calendar-outline'} size={13} color={task.overdue ? colors.danger : colors.muted} />
              <Text style={[styles.dueText, { color: task.overdue ? colors.danger : colors.muted }, task.overdue && styles.bold]}>
                {formatDate(task.dueDate)}
                {task.overdue ? ` ${t('tasks.overdue')}` : ''}
              </Text>
            </View>
          )}
        </View>
      </View>
      {task.assignee ? (
        <Avatar user={task.assignee} size="sm" />
      ) : (
        <Text style={[styles.unassigned, { color: colors.muted }]}>{t('tasks.unassigned')}</Text>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderRadius: radius.md, padding: 12 },
  main: { flex: 1, gap: 6 },
  title: { fontSize: 15, fontWeight: '600' },
  done: { textDecorationLine: 'line-through' },
  project: { fontSize: 13, fontWeight: '600' },
  meta: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8 },
  due: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  dueText: { fontSize: 12 },
  bold: { fontWeight: '600' },
  unassigned: { fontSize: 11, maxWidth: 70, textAlign: 'right' },
})
