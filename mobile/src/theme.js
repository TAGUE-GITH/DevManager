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

// Pastilles de statut et de priorite : fond doux + texte fonce (clair en theme sombre)
const tones = {
  light: {
    neutral: { bg: '#f1f5f9', fg: '#334155' },
    indigo: { bg: '#eef2ff', fg: '#4338ca' },
    amber: { bg: '#fffbeb', fg: '#b45309' },
    green: { bg: '#ecfdf5', fg: '#047857' },
    sky: { bg: '#f0f9ff', fg: '#0369a1' },
    red: { bg: '#fef2f2', fg: '#b91c1c' },
  },
  dark: {
    neutral: { bg: '#1e293b', fg: '#cbd5e1' },
    indigo: { bg: '#1e1b4b', fg: '#a5b4fc' },
    amber: { bg: '#3b2a07', fg: '#fcd34d' },
    green: { bg: '#052e1f', fg: '#6ee7b7' },
    sky: { bg: '#082f49', fg: '#7dd3fc' },
    red: { bg: '#3b1219', fg: '#fca5a5' },
  },
}

export const STATUS_TONE = { TODO: 'neutral', IN_PROGRESS: 'indigo', REVIEW: 'amber', DONE: 'green' }
export const PRIORITY_TONE = { LOW: 'neutral', MEDIUM: 'sky', HIGH: 'red' }

export function useTones() {
  return useColorScheme() === 'dark' ? tones.dark : tones.light
}

// Palette des graphiques validee pour les daltoniens, identique au site web (ordre fixe)
const CHART_SERIES = {
  light: ['#2a78d6', '#eb6834', '#1baf7a', '#eda100'],
  dark: ['#3987e5', '#d95926', '#199e70', '#c98500'],
}

export function useChartSeries() {
  return CHART_SERIES[useColorScheme() === 'dark' ? 'dark' : 'light']
}
