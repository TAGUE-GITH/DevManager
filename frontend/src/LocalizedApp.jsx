import { useTranslation } from 'react-i18next'
import App from './App'

// Changement de langue : l'application est re-affichee pour que tous les textes et formats suivent
export default function LocalizedApp() {
  const { i18n } = useTranslation()
  return <App key={i18n.language} />
}
