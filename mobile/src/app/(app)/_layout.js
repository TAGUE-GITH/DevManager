import { Stack } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { useColors } from '../../theme'

// Espace de travail : barre d'onglets, et ecrans de detail qui s'ouvrent par-dessus
export default function AppLayout() {
  const { t } = useTranslation()
  const colors = useColors()
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.primary,
        headerTitleStyle: { color: colors.text, fontWeight: '700' },
        headerBackTitle: t('common.back'),
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="project/[id]" options={{ title: t('projects.detail') }} />
      <Stack.Screen name="message/[id]" options={{ title: t('messages.message') }} />
      <Stack.Screen name="compose" options={{ title: t('messages.new'), presentation: 'modal' }} />
    </Stack>
  )
}
