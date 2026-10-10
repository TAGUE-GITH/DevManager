import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from '../context/useTheme'

const OPTIONS = [
  { value: 'light', label: 'Thème clair', Icon: Sun },
  { value: 'dark', label: 'Thème sombre', Icon: Moon },
  { value: 'system', label: 'Thème du système', Icon: Monitor },
]

// Choix du theme : clair, sombre ou celui du systeme
export default function ThemeToggle({ className = '' }) {
  const { theme, setTheme } = useTheme()
  return (
    <div className={`flex rounded-lg bg-slate-100 p-0.5 ${className}`} role="group" aria-label="Thème">
      {OPTIONS.map(({ value, label, Icon }) => (
        <button
          key={value}
          onClick={() => setTheme(value)}
          aria-pressed={theme === value}
          title={label}
          className={`flex flex-1 items-center justify-center rounded-md py-1.5 transition ${
            theme === value ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Icon className="size-4" aria-hidden />
          <span className="sr-only">{label}</span>
        </button>
      ))}
    </div>
  )
}
