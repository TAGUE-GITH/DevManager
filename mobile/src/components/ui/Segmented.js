import { Pressable, StyleSheet, Text, View } from 'react-native'
import { radius, useColors } from '../../theme'

// Onglets internes a un ecran (ex. Taches / Budget, Recus / Envoyes)
export default function Segmented({ options, value, onChange }) {
  const colors = useColors()
  return (
    <View style={[styles.group, { backgroundColor: colors.subtle }]} accessibilityRole="tablist">
      {options.map((option) => {
        const active = option.value === value
        return (
          <Pressable
            key={option.value}
            onPress={() => onChange(option.value)}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            style={[styles.option, active && { backgroundColor: colors.card }]}
          >
            <Text style={[styles.text, { color: active ? colors.text : colors.muted }]} numberOfLines={1}>
              {option.label}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  group: { flexDirection: 'row', borderRadius: radius.md, padding: 4 },
  option: { flex: 1, minHeight: 40, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 },
  text: { fontSize: 13, fontWeight: '600' },
})
