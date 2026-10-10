import { useId } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

// Symbole du logo : un "D" contenant des barres de croissance (gestion + pilotage)
export function LogoMark({ className = 'size-8' }) {
  // Identifiant unique : plusieurs logos peuvent coexister sur la page
  const gradientId = `logo-${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#6366f1" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill={`url(#${gradientId})`} />
      <path d="M16 14h14c10 0 18 8 18 18s-8 18-18 18H16z" fill="#fff" />
      <rect x="22" y="33" width="5" height="10" rx="2.5" fill={`url(#${gradientId})`} />
      <rect x="29.5" y="27" width="5" height="16" rx="2.5" fill={`url(#${gradientId})`} />
      <rect x="37" y="21" width="5" height="22" rx="2.5" fill={`url(#${gradientId})`} />
    </svg>
  )
}

export default function Logo({ light = false, to = '/' }) {
  const { t } = useTranslation()
  return (
    <Link to={to} className="flex items-center gap-2.5" aria-label={t('common.homeLink')}>
      <LogoMark />
      <span className={`text-lg font-extrabold tracking-tight ${light ? 'text-on-accent' : 'text-slate-900'}`}>
        Dev<span className={light ? 'text-on-accent-muted' : 'text-indigo-500'}>Manager</span>
      </span>
    </Link>
  )
}
