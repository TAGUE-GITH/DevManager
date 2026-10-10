import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import { AdminRoute, ProtectedRoute, PublicOnlyRoute } from './components/RouteGuards'
import { PageLoader } from './components/ui/States'
import AcceptInvitationPage from './pages/AcceptInvitationPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ResetPasswordPage from './pages/ResetPasswordPage'

// Pages de l'application chargees a la demande (code splitting) : la page d'accueil publique reste legere,
// les graphiques et le Kanban ne sont telecharges qu'une fois connecte (voir le Suspense dans AppLayout)
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'))
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage'))
const MyTasksPage = lazy(() => import('./pages/MyTasksPage'))
const MessagesPage = lazy(() => import('./pages/MessagesPage'))
const UsersPage = lazy(() => import('./pages/UsersPage'))
const SettingsPage = lazy(() => import('./pages/SettingsPage'))
const HelpPage = lazy(() => import('./pages/HelpPage'))
const AppHelpPage = lazy(() => import('./pages/HelpPage').then((module) => ({ default: module.AppHelpPage })))

export default function App() {
  return (
    <Routes>
      {/* Page d'accueil publique */}
      <Route path="/" element={<LandingPage />} />

      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Route>

      {/* Accessibles connecte ou non : on arrive ici depuis un lien recu par email */}
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/invitation" element={<AcceptInvitationPage />} />
      <Route
        path="/aide"
        element={
          <Suspense fallback={<PageLoader />}>
            <HelpPage />
          </Suspense>
        }
      />

      {/* Application, reservee aux utilisateurs connectes */}
      <Route path="/app" element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/:id" element={<ProjectDetailPage />} />
          <Route path="tasks" element={<MyTasksPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="help" element={<AppHelpPage />} />
          <Route element={<AdminRoute />}>
            <Route path="users" element={<UsersPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
