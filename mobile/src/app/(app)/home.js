import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Button from '../../components/Button'
import LanguageSwitcher from '../../components/LanguageSwitcher'
import Logo from '../../components/Logo'
import { useAuth } from '../../context/AuthProvider'
import { radius, useColors } from '../../theme'

// Accueil provisoire : confirme la connexion a l'API avant d'ajouter les vrais ecrans
export default function HomeScreen() {
  const { t } = useTranslation()
  const colors = useColors()
  const { user, logout } = useAuth()

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Logo />
          <LanguageSwitcher />
        </View>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.title, { color: colors.text }]}>{t('home.greeting', { name: user.firstName })}</Text>
          <Text style={[styles.meta, { color: colors.textSecondary }]}>
            {user.organizationName} · {t(`enums.role.${user.role}`)}
          </Text>
          <Text style={[styles.text, { color: colors.muted }]}>{t('home.soon')}</Text>
        </View>
        <Button variant="secondary" title={t('home.logout')} onPress={logout} />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: 24, gap: 24, width: '100%', maxWidth: 480, alignSelf: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  card: { borderWidth: 1, borderRadius: radius.lg, padding: 20, gap: 8 },
  title: { fontSize: 24, fontWeight: '800' },
  meta: { fontSize: 15, fontWeight: '500' },
  text: { fontSize: 14, lineHeight: 20, marginTop: 4 },
})
