import { CheckCircle2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher'
import Logo from './Logo'

const FEATURES = ['auth.panel.feature1', 'auth.panel.feature2', 'auth.panel.feature3']

const YEAR = new Date().getFullYear()

// Panneau de presentation : identique en theme clair et sombre (couleurs fixes, hors palette du theme)
function ShowcasePanel() {
  const { t } = useTranslation()
  return (
    <aside
      className="relative hidden w-[46%] flex-col overflow-hidden bg-[#0b1020] p-12 lg:flex"
      style={{
        backgroundImage:
          'radial-gradient(circle at 10% 10%, rgba(79,70,229,.55), transparent 45%), radial-gradient(circle at 90% 85%, rgba(124,58,237,.45), transparent 50%)',
      }}
    >
      <Logo light />
      <div className="mt-16 max-w-md">
        <h2 className="text-4xl leading-tight font-bold tracking-tight text-on-accent">
          {t('auth.panel.title')}{' '}
          <span className="bg-gradient-to-r from-[#a5b4fc] to-[#c4b5fd] bg-clip-text text-transparent">
            {t('auth.panel.highlight')}
          </span>
        </h2>
        <ul className="mt-8 space-y-3">
          {FEATURES.map((feature) => (
            <li key={feature} className="flex items-center gap-3 text-[#cbd5e1]">
              <CheckCircle2 className="size-5 shrink-0 text-[#a5b4fc]" aria-hidden />
              {t(feature)}
            </li>
          ))}
        </ul>
      </div>

      {/* Apercu reel de l'application, legerement incline */}
      <div className="relative mt-12 -mr-40 min-h-0 flex-1 overflow-hidden">
        <div className="overflow-hidden rounded-xl shadow-2xl ring-1 ring-white/15 [transform:perspective(1400px)_rotateY(-8deg)_rotateX(3deg)]">
          <div className="flex items-center gap-1.5 bg-[#1e293b] px-3 py-2">
            <span className="size-2.5 rounded-full bg-[#f87171]" />
            <span className="size-2.5 rounded-full bg-[#fbbf24]" />
            <span className="size-2.5 rounded-full bg-[#34d399]" />
          </div>
          <img
            src="/screens/02-tableau-de-bord.webp"
            alt={t('auth.panel.screenshotAlt')}
            className="block w-full"
            width="1440"
            height="1000"
          />
        </div>
      </div>

      <p className="relative mt-8 text-sm text-[#94a3b8]">© {YEAR} DevManager</p>
    </aside>
  )
}

// Mise en page commune aux pages de connexion, inscription, mot de passe oublie et invitation
export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="themed flex min-h-screen bg-slate-50">
      <ShowcasePanel />
      <main className="relative flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
        <LanguageSwitcher className="absolute top-5 right-5 w-24" />
        <div className="w-full max-w-sm">
          <div className="mb-10 lg:hidden">
            <Logo />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-slate-600">{subtitle}</p>}
          <div className="mt-8">{children}</div>
        </div>
      </main>
    </div>
  )
}
