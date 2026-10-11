import Ionicons from '@expo/vector-icons/Ionicons'
import { useTranslation } from 'react-i18next'
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { radius, useColors } from '../../theme'

/**
 * Liste de choix qui monte du bas de l'ecran (ex. nouveau statut d'une tache).
 * Remplace le glisser-deposer du Kanban, peu pratique sur un petit ecran.
 */
export default function OptionSheet({ visible, title, options, selected, onSelect, onClose }) {
  const { t } = useTranslation()
  const colors = useColors()
  const insets = useSafeAreaInsets()
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose} accessibilityLabel={t('common.close')} />
      <View style={[styles.sheet, { backgroundColor: colors.card, paddingBottom: insets.bottom + 12 }]}>
        <View style={[styles.handle, { backgroundColor: colors.inputBorder }]} />
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        {options.map(({ value, label }) => {
          const active = value === selected
          return (
            <Pressable
              key={value}
              onPress={() => onSelect(value)}
              accessibilityRole="radio"
              accessibilityState={{ checked: active }}
              style={({ pressed }) => [styles.option, (pressed || active) && { backgroundColor: colors.subtle }]}
            >
              <Text style={[styles.label, { color: active ? colors.primary : colors.text }]}>{label}</Text>
              {active && <Ionicons name="checkmark" size={20} color={colors.primary} />}
            </Pressable>
          )
        })}
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.45)' },
  sheet: { borderTopLeftRadius: radius.lg * 1.5, borderTopRightRadius: radius.lg * 1.5, paddingHorizontal: 12, paddingTop: 8 },
  handle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 12 },
  title: { fontSize: 16, fontWeight: '700', paddingHorizontal: 12, marginBottom: 8 },
  option: { minHeight: 52, borderRadius: radius.md, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  label: { fontSize: 16, fontWeight: '500' },
})
