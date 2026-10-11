import Ionicons from '@expo/vector-icons/Ionicons'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, View } from 'react-native'
import { useColors } from '../../theme'

// Jauge de consommation du budget ; au-dela de 100 % : rouge + icone + texte (jamais la couleur seule)
export default function BudgetBar({ percent }) {
  const { t } = useTranslation()
  const colors = useColors()
  const over = percent > 100
  const color = over ? colors.danger : percent >= 80 ? '#d97706' : colors.primary
  return (
    <View style={styles.wrapper}>
      <View
        style={[styles.track, { backgroundColor: colors.subtle }]}
        accessibilityRole="progressbar"
        accessibilityLabel={t('budget.consumedLabel')}
        accessibilityValue={{ min: 0, max: 100, now: Math.min(percent, 100) }}
      >
        <View style={[styles.fill, { width: `${Math.min(percent, 100)}%`, backgroundColor: color }]} />
      </View>
      <View style={styles.row}>
        {over && <Ionicons name="warning" size={13} color={colors.danger} />}
        <Text style={[styles.text, { color: over ? colors.danger : colors.muted }]}>
          {t('budget.consumed', { percent })}
          {over ? ` ${t('budget.overrun')}` : ''}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: { gap: 6 },
  track: { height: 8, borderRadius: 999, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 999 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  text: { fontSize: 12 },
})
