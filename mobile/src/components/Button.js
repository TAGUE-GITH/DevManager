import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native'
import { radius, useColors } from '../theme'

// Bouton principal, secondaire (contour) ou discret (lien)
export default function Button({ title, onPress, variant = 'primary', loading = false, disabled = false, style }) {
  const colors = useColors()
  const inactive = disabled || loading

  const variants = {
    primary: { background: colors.primary, pressed: colors.primaryPressed, text: colors.onPrimary, border: colors.primary },
    secondary: { background: colors.card, pressed: colors.subtle, text: colors.text, border: colors.inputBorder },
    ghost: { background: 'transparent', pressed: colors.subtle, text: colors.primary, border: 'transparent' },
  }
  const look = variants[variant]

  return (
    <Pressable
      onPress={onPress}
      disabled={inactive}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{ disabled: inactive, busy: loading }}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: pressed ? look.pressed : look.background, borderColor: look.border, opacity: inactive ? 0.7 : 1 },
        style,
      ]}
    >
      {loading && <ActivityIndicator color={look.text} size="small" />}
      <Text style={[styles.text, { color: look.text }]}>{title}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  text: { fontSize: 15, fontWeight: '600' },
})
