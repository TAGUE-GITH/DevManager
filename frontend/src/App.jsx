import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './components/layout/AppLayout'
import AcceptInvitationPage from './pages/AcceptInvitationPage'
import { AdminRoute, ProtectedRoute, PublicOnlyRoute } from './components/RouteGuards'
import DashboardPage from './pages/DashboardPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import MessagesPage from './pages/MessagesPage'
import MyTasksPage from './pages/MyTasksPage'
import ProjectDetailPage from './pages/ProjectDetailPage'
import ProjectsPage from './pages/ProjectsPage'
import RegisterPage from './pages/RegisterPage'
import ResetPasswordPage from './pages/ResetPasswordPage'
import UsersPage from './pages/UsersPage'

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

      {/* Application, reservee aux utilisateurs connectes */}
      <Route path="/app" element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/:id" element={<ProjectDetailPage />} />
          <Route path="tasks" element={<MyTasksPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route element={<AdminRoute />}>
            <Route path="users" element={<UsersPage />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
