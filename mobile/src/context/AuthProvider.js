import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { authApi } from '../api/auth'
import { session, setUnauthorizedHandler } from '../api/client'
import { loadSavedLanguage } from '../i18n'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  // Vrai tant que la session enregistree sur le telephone n'a pas ete verifiee
  const [loading, setLoading] = useState(true)

  const logout = useCallback(async () => {
    await session.clear()
    setUser(null)
  }, [])

  // Au lancement : langue memorisee, puis reprise de la session si un jeton est enregistre
  useEffect(() => {
    setUnauthorizedHandler(logout)
    const restore = async () => {
      await loadSavedLanguage()
      if (await session.load()) {
        try {
          setUser(await authApi.me())
        } catch {
          await session.clear()
        }
      }
      setLoading(false)
    }
    restore()
  }, [logout])

  const saveSession = useCallback(async ({ token, user: loggedUser }) => {
    await session.save(token)
    setUser(loggedUser)
  }, [])

  const login = useCallback((credentials) => authApi.login(credentials).then(saveSession), [saveSession])
  const register = useCallback((form) => authApi.register(form).then(saveSession), [saveSession])
  const loginDemo = useCallback(() => authApi.demo().then(saveSession), [saveSession])
  const refreshUser = useCallback(async () => setUser(await authApi.me()), [])

  const value = useMemo(
    () => ({ user, loading, login, register, loginDemo, refreshUser, logout }),
    [user, loading, login, register, loginDemo, refreshUser, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth doit être utilisé dans un AuthProvider')
  return context
}
