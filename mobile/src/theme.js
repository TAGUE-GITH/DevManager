import { useColorScheme } from 'react-native'

// Couleurs reprises du site web (indigo), en theme clair et sombre selon le reglage du telephone
const light = {
  background: '#f8fafc',
  card: '#ffffff',
  subtle: '#f1f5f9',
  border: '#e2e8f0',
  inputBorder: '#cbd5e1',
  text: '#0f172a',
  textSecondary: '#475569',
  muted: '#64748b',
  primary: '#4f46e5',
  primaryPressed: '#4338ca',
  primarySoft: '#eef2ff',
  onPrimary: '#ffffff',
  danger: '#b91c1c',
  dangerSoft: '#fef2f2',
  success: '#047857',
  successSoft: '#ecfdf5',
}

const dark = {
  background: '#0b1020',
  card: '#111827',
  subtle: '#1e293b',
  border: '#1f2937',
  inputBorder: '#334155',
  text: '#f1f5f9',
  textSecondary: '#cbd5e1',
  muted: '#94a3b8',
  primary: '#6366f1',
  primaryPressed: '#4f46e5',
  primarySoft: '#1e1b4b',
  onPrimary: '#ffffff',
  danger: '#fca5a5',
  dangerSoft: '#3b1219',
  success: '#6ee7b7',
  successSoft: '#052e1f',
}

export function useColors() {
  return useColorScheme() === 'dark' ? dark : light
}

export const radius = { sm: 8, md: 12, lg: 16 }
