import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from '../context/useTheme'
import { useTranslation } from 'react-i18next'

const OPTIONS = [
  { value: 'light', labelKey: 'theme.light', Icon: Sun },
  { value: 'dark', labelKey: 'theme.dark', Icon: Moon },
  { value: 'system', labelKey: 'theme.system', Icon: Monitor },
]

// Choix du theme : clair, sombre ou celui du systeme
export default function ThemeToggle({ className = '' }) {
  const { t } = useTranslation()
  const { theme, setTheme } = useTheme()
  return (
    <div className={`flex rounded-lg bg-slate-100 p-0.5 ${className}`} role="group" aria-label={t('theme.label')}>
      {OPTIONS.map(({ value, labelKey, Icon }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          aria-pressed={theme === value}
          title={t(labelKey)}
          className={`flex flex-1 items-center justify-center rounded-md py-1.5 transition ${
            theme === value ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Icon className="size-4" aria-hidden />
          <span className="sr-only">{t(labelKey)}</span>
        </button>
      ))}
    </div>
  )
}
