import { createContext, useContext } from 'react'

export const THEME_KEY = 'devmanager_theme'

export const ThemeContext = createContext(null)

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme doit être utilisé dans un ThemeProvider')
  }
  return context
}
