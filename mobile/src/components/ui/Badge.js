import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, View } from 'react-native'
import { PRIORITY_TONE, STATUS_TONE, useTones } from '../../theme'

export default function Badge({ label, tone = 'neutral' }) {
  const { bg, fg } = useTones()[tone]
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={[styles.text, { color: fg }]}>{label}</Text>
    </View>
  )
}

// Statut d'un projet ou d'une tache (group : projectStatus ou taskStatus)
export function StatusBadge({ status, group = 'taskStatus' }) {
  const { t } = useTranslation()
  return <Badge label={t(`enums.${group}.${status}`)} tone={STATUS_TONE[status]} />
}

export function PriorityBadge({ priority }) {
  const { t } = useTranslation()
  return <Badge label={t(`enums.taskPriority.${priority}`)} tone={PRIORITY_TONE[priority]} />
}

const styles = StyleSheet.create({
  badge: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 3, alignSelf: 'flex-start' },
  text: { fontSize: 12, fontWeight: '600' },
})
