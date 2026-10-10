import '../i18n'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { ActivityIndicator, View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { AuthProvider, useAuth } from '../context/AuthProvider'
import { useColors } from '../theme'

// Ecrans publics (connexion...) ou espace de travail, selon la session
function RootNavigator() {
  const { user, loading } = useAuth()
  const colors = useColors()

  // On attend la verification de la session enregistree avant d'afficher un ecran
  if (loading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
      <Stack.Screen name="index" />
      <Stack.Protected guard={!user}>
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="forgot-password" />
      </Stack.Protected>
      <Stack.Protected guard={Boolean(user)}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>
    </Stack>
  )
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="auto" />
        <RootNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  )
}
