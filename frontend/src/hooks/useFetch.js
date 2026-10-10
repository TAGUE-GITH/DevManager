import { useCallback, useEffect, useState } from 'react'
import { getErrorMessage } from '../api/client'

// Charge des donnees depuis l'API et expose { data, loading, error, reload }
export function useFetch(fetcher) {
  const [state, setState] = useState({ data: null, loading: true, error: '' })

  const reload = useCallback(() => {
    return fetcher()
      .then((data) => setState({ data, loading: false, error: '' }))
      .catch((err) => setState({ data: null, loading: false, error: getErrorMessage(err) }))
  }, [fetcher])

  useEffect(() => {
    reload()
  }, [reload])

  return { ...state, reload, setData: (data) => setState((s) => ({ ...s, data })) }
}
