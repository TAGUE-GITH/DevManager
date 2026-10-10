import { ArrowLeft, LifeBuoy } from 'lucide-react'
import { Link } from 'react-router-dom'
import HelpCenter from '../components/help/HelpCenter'
import Logo from '../components/Logo'
import PageHeader from '../components/ui/PageHeader'
import { useAuth } from '../context/useAuth'

// Centre d'aide dans l'application (/app/help)
export function AppHelpPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Centre d'aide" description="Les réponses aux questions les plus fréquentes sur DevManager." />
      <HelpCenter />
    </div>
  )
}

// Centre d'aide public (/aide), accessible sans compte
export default function HelpPage() {
  const { isAuthenticated } = useAuth()
  return (
    <div className="themed min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 sm:px-6">
          <Logo />
          <Link
            to={isAuthenticated ? '/app' : '/'}
            className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            <ArrowLeft className="size-4" aria-hidden />
            {isAuthenticated ? 'Retour à l’application' : 'Retour à l’accueil'}
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="mb-10 text-center">
          <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <LifeBuoy className="size-6" aria-hidden />
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900">Centre d'aide</h1>
          <p className="mt-2 text-slate-600">Tout ce qu'il faut savoir pour bien démarrer avec DevManager.</p>
        </div>
        <HelpCenter />
      </main>
    </div>
  )
}
