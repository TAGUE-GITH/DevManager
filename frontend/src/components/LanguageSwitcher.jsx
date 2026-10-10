import { useTranslation } from 'react-i18next'
import { LANGUAGES } from '../i18n'

// Choix de la langue de l'interface (FR / EN), memorise dans le navigateur
export default function LanguageSwitcher({ className = '', dark = false }) {
  const { i18n, t } = useTranslation()
  return (
    <div
      className={`flex rounded-lg p-0.5 ${dark ? 'bg-white/10' : 'bg-slate-100'} ${className}`}
      role="group"
      aria-label={t('common.language')}
    >
      {LANGUAGES.map(({ code, label, short }) => {
        const active = i18n.language === code
        return (
          <button
            key={code}
            type="button"
            lang={code}
            onClick={() => i18n.changeLanguage(code)}
            aria-pressed={active}
            title={label}
            className={`flex-1 rounded-md px-2.5 py-1 text-xs font-semibold transition ${
              active
                ? dark
                  ? 'bg-white/20 text-on-accent'
                  : 'bg-white text-slate-900 shadow-xs'
                : dark
                  ? 'text-[#cbd5e1] hover:text-on-accent'
                  : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {short}
            <span className="sr-only"> ({label})</span>
          </button>
        )
      })}
    </div>
  )
}
