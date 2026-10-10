import { StyleSheet, Text, TextInput, View } from 'react-native'
import { radius, useColors } from '../theme'

// Champ de saisie avec libelle et message d'erreur (renvoye par la validation du serveur)
export default function TextField({ label, error, style, ...inputProps }) {
  const colors = useColors()
  return (
    <View style={[styles.field, style]}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor={colors.muted}
        style={[
          styles.input,
          { color: colors.text, backgroundColor: colors.card, borderColor: error ? colors.danger : colors.inputBorder },
        ]}
        {...inputProps}
      />
      {error ? <Text style={[styles.error, { color: colors.danger }]}>{error}</Text> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  field: { gap: 6 },
  label: { fontSize: 14, fontWeight: '500' },
  input: { minHeight: 48, borderWidth: 1, borderRadius: radius.md, paddingHorizontal: 14, fontSize: 16 },
  error: { fontSize: 13 },
})
