import { useCallback, useEffect, useMemo, useState } from 'react'
import { THEME_KEY, ThemeContext } from './useTheme'

const systemPrefersDark = () => window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false

function readStoredTheme() {
  try {
    return localStorage.getItem(THEME_KEY) ?? 'system'
  } catch {
    return 'system'
  }
}

/**
 * Theme clair / sombre : choix de l'utilisateur ("light", "dark") ou reglage du systeme ("system").
 * La classe "theme-dark" posee sur <html> active les couleurs sombres (voir index.css).
 */
export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(readStoredTheme)
  const [systemDark, setSystemDark] = useState(systemPrefersDark)

  // Suit les changements du reglage systeme (ex. passage automatique en mode sombre le soir)
  useEffect(() => {
    const query = window.matchMedia?.('(prefers-color-scheme: dark)')
    const onChange = (event) => setSystemDark(event.matches)
    query?.addEventListener('change', onChange)
    return () => query?.removeEventListener('change', onChange)
  }, [])

  const dark = theme === 'dark' || (theme === 'system' && systemDark)

  useEffect(() => {
    document.documentElement.classList.toggle('theme-dark', dark)
  }, [dark])

  const setTheme = useCallback((value) => {
    setThemeState(value)
    try {
      localStorage.setItem(THEME_KEY, value)
    } catch {
      // Stockage indisponible (navigation privee) : le choix vaut pour la session en cours
    }
  }, [])

  const value = useMemo(() => ({ theme, dark, setTheme }), [theme, dark, setTheme])
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
