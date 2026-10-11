import { Image, StyleSheet, Text, View } from 'react-native'
import { apiUrl } from '../../api/client'
import { initials } from '../../utils/format'

const SIZES = { sm: 32, md: 40, lg: 56, xl: 88 }

// Photo de profil, ou initiales sur fond degrade (meme rendu que le site web)
export default function Avatar({ user, size = 'md' }) {
  const dimension = SIZES[size]
  const shape = { width: dimension, height: dimension, borderRadius: dimension / 2 }
  if (user.avatarUrl) {
    return <Image source={{ uri: apiUrl(user.avatarUrl) }} style={shape} accessibilityIgnoresInvertColors />
  }
  return (
    <View style={[styles.fallback, shape]}>
      <Text style={[styles.text, { fontSize: dimension * 0.38 }]}>{initials(user)}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  fallback: { backgroundColor: '#6366f1', alignItems: 'center', justifyContent: 'center' },
  text: { color: '#ffffff', fontWeight: '700' },
})
