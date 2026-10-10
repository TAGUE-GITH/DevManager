import { Loader2 } from 'lucide-react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import { useTranslation } from 'react-i18next'

function FullPageLoader() {
  const { t } = useTranslation()
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="size-8 animate-spin text-indigo-600" aria-label={t('common.loading')} />
    </div>
  )
}

// Pages reservees aux utilisateurs connectes : sinon, redirection vers la connexion
export function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) return <FullPageLoader />
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />
  return <Outlet />
}

// Pages de connexion/inscription : inutiles si l'utilisateur est deja connecte
export function PublicOnlyRoute() {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) return <FullPageLoader />
  // Apres connexion : retour a la page demandee avant la redirection, sinon au tableau de bord
  if (isAuthenticated) return <Navigate to={location.state?.from?.pathname ?? '/app'} replace />
  return <Outlet />
}

// Pages reservees aux administrateurs
export function AdminRoute() {
  const { user } = useAuth()
  return user.role === 'ADMIN' ? <Outlet /> : <Navigate to="/app" replace />
}
