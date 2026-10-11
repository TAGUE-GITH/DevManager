import { Pressable, StyleSheet, View } from 'react-native'
import { radius, useColors } from '../../theme'

// Carte blanche (ou sombre) ; cliquable si onPress est fourni
export default function Card({ children, onPress, style, accessibilityLabel }) {
  const colors = useColors()
  const base = [styles.card, { backgroundColor: colors.card, borderColor: colors.border }, style]
  if (!onPress) return <View style={base}>{children}</View>
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => [...base, pressed && { backgroundColor: colors.subtle }]}
    >
      {children}
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: radius.lg, padding: 16 },
})
