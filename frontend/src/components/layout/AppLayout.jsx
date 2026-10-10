import { FolderKanban, LayoutDashboard, LogOut, Menu, MessageSquare, Users, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { messagesApi } from '../../api/resources'
import { useAuth } from '../../context/useAuth'
import { MESSAGES_CHANGED } from '../../utils/events'
import { ROLE, fullName } from '../../utils/format'
import Logo from '../Logo'
import Avatar from '../ui/Avatar'

function Navigation({ unread, isAdmin, onNavigate }) {
  const items = [
    { to: '/', label: 'Tableau de bord', Icon: LayoutDashboard, end: true },
    { to: '/projects', label: 'Projets', Icon: FolderKanban },
    { to: '/messages', label: 'Messagerie', Icon: MessageSquare, count: unread },
    ...(isAdmin ? [{ to: '/users', label: 'Utilisateurs', Icon: Users }] : []),
  ]

  return (
    <nav className="space-y-1">
      {items.map(({ to, label, Icon, end, count }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
              isActive ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`
          }
        >
          <Icon className="size-5" aria-hidden />
          <span className="flex-1">{label}</span>
          {count > 0 && (
            <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-xs font-semibold text-white">
              {count}
              <span className="sr-only"> non lus</span>
            </span>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

function UserFooter({ user, onLogout }) {
  return (
    <div className="flex items-center gap-3 border-t border-slate-200 pt-4">
      <Avatar user={user} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-slate-900">{fullName(user)}</p>
        <p className="truncate text-xs text-slate-500">{ROLE[user.role]}</p>
      </div>
      <button
        onClick={onLogout}
        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
        aria-label="Se déconnecter"
        title="Se déconnecter"
      >
        <LogOut className="size-5" />
      </button>
    </div>
  )
}

export default function AppLayout() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [unread, setUnread] = useState(0)

  // Nombre de messages non lus : recharge a chaque changement de page ou de messagerie
  useEffect(() => {
    const refresh = () => messagesApi.unreadCount().then(setUnread).catch(() => {})
    refresh()
    window.addEventListener(MESSAGES_CHANGED, refresh)
    return () => window.removeEventListener(MESSAGES_CHANGED, refresh)
  }, [location.pathname])

  const isAdmin = user.role === 'ADMIN'

  return (
    <div className="min-h-screen lg:flex">
      {/* Barre laterale (ordinateur) */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white p-4 lg:flex lg:fixed lg:inset-y-0">
        <div className="mb-8 px-2 pt-2">
          <Logo />
        </div>
        <div className="flex-1">
          <Navigation unread={unread} isAdmin={isAdmin} />
        </div>
        <UserFooter user={user} onLogout={logout} />
      </aside>

      {/* Barre du haut (mobile) */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
        <Logo />
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
          aria-label="Ouvrir le menu"
        >
          <Menu className="size-6" />
        </button>
      </header>

      {/* Menu mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-slate-900/50" onClick={() => setMobileOpen(false)} aria-hidden />
          <div className="absolute inset-y-0 left-0 flex w-72 flex-col bg-white p-4 shadow-xl">
            <div className="mb-8 flex items-center justify-between px-2 pt-2">
              <Logo />
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-lg p-1 text-slate-500 hover:bg-slate-100"
                aria-label="Fermer le menu"
              >
                <X className="size-6" />
              </button>
            </div>
            <div className="flex-1">
              <Navigation unread={unread} isAdmin={isAdmin} onNavigate={() => setMobileOpen(false)} />
            </div>
            <UserFooter user={user} onLogout={logout} />
          </div>
        </div>
      )}

      <main className="flex-1 lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
