import { useCallback, useEffect, useMemo, useState } from 'react'
import { authApi } from '../api/auth'
import { tokenStorage } from '../api/client'
import { AuthContext } from './useAuth'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  // Vrai tant qu'on verifie si un jeton enregistre est encore valide
  const [loading, setLoading] = useState(() => Boolean(tokenStorage.get()))

  const logout = useCallback(() => {
    tokenStorage.clear()
    setUser(null)
  }, [])

  // Au chargement : si un jeton existe, on recupere l'utilisateur correspondant
  useEffect(() => {
    if (!tokenStorage.get()) return
    authApi
      .me()
      .then(setUser)
      .catch(logout)
      .finally(() => setLoading(false))
  }, [logout])

  // Deconnexion declenchee par le client API (jeton expire)
  useEffect(() => {
    window.addEventListener('auth:logout', logout)
    return () => window.removeEventListener('auth:logout', logout)
  }, [logout])

  const saveSession = useCallback(({ token, user }) => {
    tokenStorage.set(token)
    setUser(user)
  }, [])

  const login = useCallback(
    async (credentials) => saveSession(await authApi.login(credentials)),
    [saveSession],
  )

  const register = useCallback(
    async (data) => saveSession(await authApi.register(data)),
    [saveSession],
  )

  const value = useMemo(
    () => ({ user, loading, isAuthenticated: Boolean(user), login, register, logout }),
    [user, loading, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
