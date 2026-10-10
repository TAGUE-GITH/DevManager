import DemoButton from './DemoButton'
import { useTranslation } from 'react-i18next'

// Separateur "ou" suivi du bouton de demonstration (pages de connexion et d'inscription)
export default function DemoDivider() {
  const { t } = useTranslation()
  return (
    <div className="mt-6">
      <div className="flex items-center gap-3 text-xs font-medium tracking-wide text-slate-400 uppercase">
        <span className="h-px flex-1 bg-slate-200" />
        {t('common.or')}
        <span className="h-px flex-1 bg-slate-200" />
      </div>
      <DemoButton className="mt-6">{t('demo.tryNoAccount')}</DemoButton>
    </div>
  )
}
