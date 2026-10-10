import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'
import en from './en'
import fr from './fr'

export const LANGUAGES = [
  { code: 'fr', label: 'Français', short: 'FR' },
  { code: 'en', label: 'English', short: 'EN' },
]

/**
 * Traductions de l'interface : francais (par defaut) et anglais.
 * La langue est choisie par l'utilisateur (memorisee), sinon detectee depuis le navigateur.
 */
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: { fr: { translation: fr }, en: { translation: en } },
    supportedLngs: ['fr', 'en'],
    fallbackLng: 'fr',
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'devmanager_language',
      caches: ['localStorage'],
      // "en-US" -> "en" : une seule variante par langue
      convertDetectedLanguage: (language) => language.split('-')[0],
    },
    // React echappe deja les valeurs inserees
    interpolation: { escapeValue: false },
  })

// Attribut lang de la page (lecteurs d'ecran, correcteur orthographique)
const syncDocument = (language) => {
  document.documentElement.lang = language === 'en' ? 'en' : 'fr'
}
syncDocument(i18n.language)
i18n.on('languageChanged', syncDocument)

export default i18n
