import { Stack } from 'expo-router'
import { useColors } from '../../theme'

// Espace de travail (utilisateur connecte). Les onglets arrivent a l'etape suivante.
export default function AppLayout() {
  const colors = useColors()
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }} />
}
