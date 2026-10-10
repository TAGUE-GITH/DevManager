import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useColors } from '../theme'
import LanguageSwitcher from './LanguageSwitcher'
import Logo from './Logo'

// Mise en page commune aux ecrans de connexion, d'inscription et de mot de passe oublie
export default function AuthScreen({ title, subtitle, children }) {
  const colors = useColors()
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView style={styles.safe} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Logo />
            <LanguageSwitcher />
          </View>
          <Text style={[styles.title, { color: colors.text }]} accessibilityRole="header">
            {title}
          </Text>
          {subtitle ? <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text> : null}
          <View style={styles.body}>{children}</View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { flexGrow: 1, padding: 24, paddingBottom: 40, width: '100%', maxWidth: 480, alignSelf: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 40 },
  title: { fontSize: 28, fontWeight: '800', letterSpacing: -0.5 },
  subtitle: { fontSize: 15, lineHeight: 22, marginTop: 8 },
  body: { marginTop: 28, gap: 18 },
})
