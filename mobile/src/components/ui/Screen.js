import { RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useColors } from '../../theme'

/**
 * Ecran avec titre, contenu defilant et "tirer pour actualiser".
 * edges : les ecrans des onglets n'ont pas de marge basse (la barre d'onglets s'en charge).
 */
export default function Screen({ title, subtitle, right, onRefresh, refreshing = false, children, edges = ['top'] }) {
  const colors = useColors()
  return (
    <SafeAreaView edges={edges} style={[styles.safe, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} colors={[colors.primary]} /> : undefined
        }
      >
        {title ? (
          <View style={styles.header}>
            <View style={styles.titles}>
              <Text style={[styles.title, { color: colors.text }]} accessibilityRole="header">
                {title}
              </Text>
              {subtitle ? <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text> : null}
            </View>
            {right}
          </View>
        ) : null}
        {children}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: 20, paddingBottom: 32, gap: 16, width: '100%', maxWidth: 720, alignSelf: 'center' },
  header: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 4 },
  titles: { flex: 1, gap: 4 },
  title: { fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  subtitle: { fontSize: 14, lineHeight: 20 },
})
