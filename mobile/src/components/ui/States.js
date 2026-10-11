import Ionicons from '@expo/vector-icons/Ionicons'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import { radius, useColors } from '../../theme'
import Button from '../Button'

export function Loader() {
  const { t } = useTranslation()
  const colors = useColors()
  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={colors.primary} accessibilityLabel={t('common.loading')} />
    </View>
  )
}

export function ErrorState({ message, onRetry }) {
  const { t } = useTranslation()
  const colors = useColors()
  return (
    <View style={styles.center}>
      <Ionicons name="cloud-offline-outline" size={36} color={colors.muted} />
      <Text style={[styles.text, { color: colors.textSecondary }]}>{message}</Text>
      {onRetry && <Button variant="secondary" title={t('common.retry')} onPress={onRetry} />}
    </View>
  )
}

export function EmptyState({ icon = 'file-tray-outline', title, description }) {
  const colors = useColors()
  return (
    <View style={[styles.empty, { borderColor: colors.border }]}>
      <Ionicons name={icon} size={32} color={colors.muted} />
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      {description ? <Text style={[styles.text, { color: colors.muted }]}>{description}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  center: { paddingVertical: 60, alignItems: 'center', justifyContent: 'center', gap: 14 },
  empty: { borderWidth: 2, borderStyle: 'dashed', borderRadius: radius.lg, padding: 28, alignItems: 'center', gap: 8 },
  title: { fontSize: 16, fontWeight: '600', textAlign: 'center' },
  text: { fontSize: 14, lineHeight: 20, textAlign: 'center' },
})
