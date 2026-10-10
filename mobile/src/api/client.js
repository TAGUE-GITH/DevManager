import axios from 'axios'
import { API_URL } from '../config'
import i18n from '../i18n'
import { storage } from '../utils/storage'

const TOKEN_KEY = 'devmanager_token'

// Jeton JWT garde en memoire (lecture rapide) et dans le stockage chiffre (reste connecte apres fermeture)
let token = null

export const session = {
  async load() {
    token = await storage.get(TOKEN_KEY)
    return token
  },
  async save(value) {
    token = value
    await storage.set(TOKEN_KEY, value)
  },
  async clear() {
    token = null
    await storage.remove(TOKEN_KEY)
  },
}

// Appele quand le jeton est expire ou invalide (le contexte d'authentification deconnecte l'utilisateur)
let onUnauthorized = () => {}
export const setUnauthorizedHandler = (handler) => {
  onUnauthorized = handler
}

// Delai genereux : l'hebergement gratuit du backend peut mettre jusqu'a une minute a se reveiller
export const api = axios.create({ baseURL: `${API_URL}/api`, timeout: 90_000 })

// Jeton et langue de l'interface a chaque requete (le serveur repond dans cette langue)
api.interceptors.request.use((config) => {
  config.headers['Accept-Language'] = i18n.language
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRoute = error.config?.url?.startsWith('/auth/')
    if (error.response?.status === 401 && !isAuthRoute) {
      onUnauthorized()
    }
    return Promise.reject(error)
  },
)

// Message d'erreur lisible a partir d'une reponse de l'API
export function getErrorMessage(error) {
  if (!error.response) {
    return i18n.t('errors.network')
  }
  return error.response.data?.message ?? i18n.t('errors.generic')
}

// Erreurs par champ renvoyees par la validation du backend, ex. { email: "Email invalide" }
export const getFieldErrors = (error) => error.response?.data?.errors ?? {}

// Adresse complete d'une image servie par l'API (ex. "/api/images/...")
export const apiUrl = (path) => (path ? `${API_URL}${path}` : null)
