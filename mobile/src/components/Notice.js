import { StyleSheet, Text, View } from 'react-native'
import { radius, useColors } from '../theme'

// Message d'erreur ou de confirmation (rien n'est affiche si le texte est vide)
export default function Notice({ type = 'error', children }) {
  const colors = useColors()
  if (!children) return null
  const success = type === 'success'
  return (
    <View
      accessibilityRole="alert"
      style={[styles.box, { backgroundColor: success ? colors.successSoft : colors.dangerSoft }]}
    >
      <Text style={[styles.text, { color: success ? colors.success : colors.danger }]}>{children}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  box: { borderRadius: radius.md, padding: 12 },
  text: { fontSize: 14, lineHeight: 20 },
})
