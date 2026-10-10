import { LogOut } from 'lucide-react'
import Logo from '../components/Logo'
import Button from '../components/ui/Button'
import { useAuth } from '../context/useAuth'

// Page d'accueil provisoire : elle sera remplacee par le vrai tableau de bord a l'etape 7
export default function DashboardPage() {
  const { user, logout } = useAuth()

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-center justify-between">
        <Logo />
        <Button variant="secondary" onClick={logout}>
          <LogOut className="size-4" aria-hidden />
          Déconnexion
        </Button>
      </div>
      <div className="mt-10 rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-2xl font-bold text-slate-900">Bonjour {user.firstName} 👋</h1>
        <p className="mt-2 text-slate-600">
          Vous êtes connecté en tant que <strong>{user.role}</strong> ({user.email}).
        </p>
      </div>
    </div>
  )
}
