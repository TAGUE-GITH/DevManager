import { getLocales } from 'expo-localization'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { storage } from '../utils/storage'
import en from './en'
import fr from './fr'

const LANGUAGE_KEY = 'devmanager_language'
const SUPPORTED = ['fr', 'en']

export const LANGUAGES = [
  { code: 'fr', label: 'Français', short: 'FR' },
  { code: 'en', label: 'English', short: 'EN' },
]

// Langue du telephone au premier lancement (francais si elle n'est pas prise en charge)
const deviceLanguage = getLocales()[0]?.languageCode
const initialLanguage = SUPPORTED.includes(deviceLanguage) ? deviceLanguage : 'fr'

i18n.use(initReactI18next).init({
  resources: { fr: { translation: fr }, en: { translation: en } },
  lng: initialLanguage,
  fallbackLng: 'fr',
  interpolation: { escapeValue: false },
})

// Langue choisie par l'utilisateur, memorisee sur le telephone
export async function loadSavedLanguage() {
  const saved = await storage.get(LANGUAGE_KEY)
  if (SUPPORTED.includes(saved) && saved !== i18n.language) {
    await i18n.changeLanguage(saved)
  }
}

export async function changeLanguage(code) {
  await i18n.changeLanguage(code)
  await storage.set(LANGUAGE_KEY, code)
}

export default i18n
