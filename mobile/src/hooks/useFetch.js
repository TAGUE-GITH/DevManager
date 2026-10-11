import { useFocusEffect } from 'expo-router'
import { useCallback, useEffect, useRef, useState } from 'react'
import { getErrorMessage } from '../api/client'

/**
 * Charge des donnees de l'API a chaque affichage de l'ecran (retour depuis un autre ecran compris).
 * refresh() sert au geste "tirer pour actualiser".
 */
export function useFetch(load) {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  // Derniere version de la fonction de chargement (elle peut dependre de parametres de l'ecran)
  const loadRef = useRef(load)
  useEffect(() => {
    loadRef.current = load
  })

  const run = useCallback(async () => {
    try {
      setData(await loadRef.current())
      setError('')
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }, [])

  useFocusEffect(
    useCallback(() => {
      run()
    }, [run]),
  )

  const refresh = useCallback(async () => {
    setRefreshing(true)
    await run()
    setRefreshing(false)
  }, [run])

  return { data, setData, error, loading: data === null && !error, refreshing, refresh, reload: run }
}
