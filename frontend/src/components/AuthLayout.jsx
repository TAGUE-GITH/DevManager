import { FolderKanban, MessageSquare, Wallet } from 'lucide-react'
import Logo from './Logo'

const FEATURES = [
  { Icon: FolderKanban, text: 'Suivez tous vos projets et leur avancement' },
  { Icon: Wallet, text: 'Maîtrisez vos budgets et vos dépenses' },
  { Icon: MessageSquare, text: 'Échangez avec votre équipe en un seul endroit' },
]

const YEAR = new Date().getFullYear()

// Mise en page commune aux pages de connexion, inscription et mot de passe oublie
export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-[45%] flex-col justify-between bg-gradient-to-br from-indigo-600 to-indigo-900 p-12 lg:flex">
        <Logo light />
        <div>
          <h2 className="text-3xl font-bold leading-tight text-white">
            Centralisez la gestion de votre entreprise.
          </h2>
          <ul className="mt-8 space-y-4">
            {FEATURES.map(({ Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-indigo-100">
                <span className="flex size-9 items-center justify-center rounded-lg bg-white/10">
                  <Icon className="size-5" aria-hidden />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-sm text-indigo-200">© {YEAR} DevManager</p>
      </aside>

      <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
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
