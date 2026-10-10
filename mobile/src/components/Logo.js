import { useId } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Svg, { Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg'
import { useColors } from '../theme'

// Meme logo que le site web : un "D" contenant des barres de croissance
export function LogoMark({ size = 36 }) {
  const gradientId = `logo${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const fill = `url(#${gradientId})`
  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      <Defs>
        <LinearGradient id={gradientId} x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor="#6366f1" />
          <Stop offset="1" stopColor="#7c3aed" />
        </LinearGradient>
      </Defs>
      <Rect width="64" height="64" rx="16" fill={fill} />
      <Path d="M16 14h14c10 0 18 8 18 18s-8 18-18 18H16z" fill="#fff" />
      <Rect x="22" y="33" width="5" height="10" rx="2.5" fill={fill} />
      <Rect x="29.5" y="27" width="5" height="16" rx="2.5" fill={fill} />
      <Rect x="37" y="21" width="5" height="22" rx="2.5" fill={fill} />
    </Svg>
  )
}

export default function Logo({ size = 36 }) {
  const colors = useColors()
  return (
    <View style={styles.row} accessible accessibilityLabel="DevManager">
      <LogoMark size={size} />
      <Text style={[styles.text, { color: colors.text, fontSize: size * 0.58 }]}>
        Dev<Text style={{ color: colors.primary }}>Manager</Text>
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  text: { fontWeight: '800', letterSpacing: -0.5 },
})
