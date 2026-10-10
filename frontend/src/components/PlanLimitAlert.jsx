import { Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

// Message affiche quand une limite de l'offre Gratuite est atteinte (reponse 402 du serveur)
export default function PlanLimitAlert({ message }) {
  const { user } = useAuth()
  return (
    <div role="alert" className="flex items-start gap-3 rounded-lg bg-indigo-50 p-4 text-sm text-indigo-900 ring-1 ring-indigo-200 ring-inset">
      <Sparkles className="mt-0.5 size-5 shrink-0 text-indigo-600" aria-hidden />
      <div>
        <p>{message}</p>
        {user.role === 'ADMIN' ? (
          <Link to="/app/settings" className="mt-2 inline-block font-semibold text-indigo-700 underline hover:text-indigo-600">
            Découvrir l'offre Pro
          </Link>
        ) : (
          <p className="mt-1 text-indigo-700">Contactez un administrateur de votre entreprise.</p>
        )}
      </div>
    </div>
  )
}
