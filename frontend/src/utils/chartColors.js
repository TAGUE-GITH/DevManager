import { useTheme } from '../context/useTheme'

// Palette de graphiques validee pour les daltoniens (ordre fixe, ne pas permuter).
// Le mode sombre utilise les memes teintes, ajustees pour un fond sombre.
const PALETTES = {
  light: {
    series: ['#2a78d6', '#eb6834', '#1baf7a', '#eda100'],
    chrome: { grid: '#e1e0d9', axis: '#c3c2b7', muted: '#898781', text: '#52514e', cursor: '#f1f5f9' },
  },
  dark: {
    series: ['#3987e5', '#d95926', '#199e70', '#c98500'],
    chrome: { grid: '#2c2c2a', axis: '#383835', muted: '#898781', text: '#c3c2b7', cursor: '#1e293b' },
  },
}

// Couleurs des graphiques pour le theme actif
export function useChartColors() {
  const { dark } = useTheme()
  return PALETTES[dark ? 'dark' : 'light']
}

// Couleur de chaque statut de tache (meme ordre que la palette), identique dans le Kanban et les graphiques
export function useTaskStatusColors() {
  const { series } = useChartColors()
  return { TODO: series[0], IN_PROGRESS: series[1], REVIEW: series[2], DONE: series[3] }
}
