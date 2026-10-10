import axios from 'axios'

const TOKEN_KEY = 'devmanager_token'

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
}

// En developpement VITE_API_URL est vide : les appels passent par le proxy Vite
export const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL ?? ''}/api`,
})

// Ajoute le jeton JWT a chaque requete
api.interceptors.request.use((config) => {
  const token = tokenStorage.get()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Jeton expire ou invalide : on deconnecte l'utilisateur
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRoute = error.config?.url?.startsWith('/auth/')
    if (error.response?.status === 401 && !isAuthRoute) {
      tokenStorage.clear()
      window.dispatchEvent(new Event('auth:logout'))
    }
    return Promise.reject(error)
  },
)

// Message d'erreur lisible a partir d'une reponse de l'API
export function getErrorMessage(error, fallback = 'Une erreur est survenue. Veuillez réessayer.') {
  if (!error.response) {
    return 'Impossible de contacter le serveur. Vérifiez votre connexion.'
  }
  return error.response.data?.message ?? fallback
}

// Erreurs par champ renvoyees par la validation du backend, ex. { email: "Email invalide" }
export function getFieldErrors(error) {
  return error.response?.data?.errors ?? {}
}

// 402 : limite de l'offre Gratuite atteinte
export const isPlanLimitError = (error) => error.response?.status === 402

// Adresse complete d'une image servie par l'API (ex. "/api/images/...")
export const apiUrl = (path) => (path ? `${import.meta.env.VITE_API_URL ?? ''}${path}` : null)
