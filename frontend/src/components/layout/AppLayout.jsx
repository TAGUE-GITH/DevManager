import {
  Building2,
  FolderKanban,
  LayoutDashboard,
  LifeBuoy,
  ListTodo,
  LogOut,
  Menu,
  MessageSquare,
  Sparkles,
  Users,
  X,
} from 'lucide-react'
import { Suspense, useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { apiUrl } from '../../api/client'
import { messagesApi } from '../../api/resources'
import { useAuth } from '../../context/useAuth'
import { MESSAGES_CHANGED } from '../../utils/events'
import { ROLE, fullName } from '../../utils/format'
import Logo from '../Logo'
import ThemeToggle from '../ThemeToggle'
import Avatar from '../ui/Avatar'
import { PageLoader } from '../ui/States'

function Navigation({ unread, isAdmin, onNavigate }) {
  const sections = [
    {
      title: 'Espace de travail',
      items: [
        { to: '/app', label: 'Tableau de bord', Icon: LayoutDashboard, end: true },
        { to: '/app/projects', label: 'Projets', Icon: FolderKanban },
        { to: '/app/tasks', label: 'Mes tâches', Icon: ListTodo },
        { to: '/app/messages', label: 'Messagerie', Icon: MessageSquare, count: unread },
      ],
    },
    ...(isAdmin
      ? [
          {
            title: 'Administration',
            items: [
              { to: '/app/users', label: 'Équipe', Icon: Users },
              { to: '/app/settings', label: 'Entreprise', Icon: Building2 },
            ],
          },
        ]
      : []),
    { title: 'Support', items: [{ to: '/app/help', label: 'Aide', Icon: LifeBuoy }] },
  ]

  return (
    <nav className="space-y-6" aria-label="Navigation de l'application">
      {sections.map(({ title, items }) => (
        <div key={title}>
          <p className="mb-2 px-3 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">{title}</p>
          <div className="space-y-0.5">
            {items.map(({ to, label, Icon, end, count }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-700 before:absolute before:inset-y-1.5 before:-left-4 before:w-1 before:rounded-r-full before:bg-indigo-600'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                <Icon className="size-[18px]" aria-hidden />
                <span className="flex-1">{label}</span>
                {count > 0 && (
                  <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-xs font-semibold text-on-accent">
                    {count}
                    <span className="sr-only"> non lus</span>
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        </div>
      ))}
    </nav>
  )
}

function Sidebar({ user, unread, onNavigate, onLogout, onClose }) {
  return (
    <div className="flex h-full flex-col bg-white p-4">
      <div className="mb-6 flex items-center justify-between px-2 pt-1">
        <Logo to="/app" />
        {onClose && (
          <button onClick={onClose} className="rounded-lg p-1 text-slate-500 hover:bg-slate-100" aria-label="Fermer le menu">
            <X className="size-6" />
          </button>
        )}
      </div>

      {/* Entreprise et offre */}
      <div className="mb-6 flex items-center gap-2.5 rounded-xl bg-slate-50 p-2.5 ring-1 ring-slate-200">
        {user.organizationLogoUrl ? (
          <img
            src={apiUrl(user.organizationLogoUrl)}
            alt=""
            className="size-8 shrink-0 rounded-lg object-cover ring-1 ring-slate-200"
          />
        ) : (
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-on-accent">
            {user.organizationName[0]?.toUpperCase()}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-slate-900" title={user.organizationName}>
            {user.organizationName}
          </p>
          <p className="text-xs text-slate-500">{user.organizationPlan === 'PRO' ? 'Offre Pro' : 'Offre Gratuite'}</p>
        </div>
        {user.organizationPlan === 'PRO' && (
          <span className="rounded-md bg-gradient-to-r from-indigo-600 to-violet-600 px-1.5 py-0.5 text-[10px] font-bold text-on-accent">
            PRO
          </span>
        )}
      </div>

      <div className="-mx-1 flex-1 overflow-y-auto px-1">
        <Navigation unread={unread} isAdmin={user.role === 'ADMIN'} onNavigate={onNavigate} />
      </div>

      <div className="mt-4 space-y-3 border-t border-slate-200 pt-4">
        <ThemeToggle />
        <div className="flex items-center gap-2">
          <Link
            to="/app/profile"
            onClick={onNavigate}
            className="-m-1.5 flex min-w-0 flex-1 items-center gap-3 rounded-lg p-1.5 hover:bg-slate-100"
            title="Mon profil"
          >
            <Avatar user={user} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-slate-900">{fullName(user)}</p>
              <p className="truncate text-xs text-slate-500">{user.jobTitle || ROLE[user.role]}</p>
            </div>
          </Link>
          <button
            onClick={onLogout}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            aria-label="Se déconnecter"
            title="Se déconnecter"
          >
            <LogOut className="size-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

// Bandeau du compte de demonstration : rappelle que les donnees sont fictives
function DemoBanner({ onCreateAccount }) {
  return (
    <div
      data-demo-banner
      className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-2.5 text-center text-sm text-on-accent"
    >
      <span className="flex items-center gap-2">
        <Sparkles className="size-4 shrink-0" aria-hidden />
        <span>
          Vous explorez le <strong>compte de démonstration</strong> : les données sont fictives et réinitialisées
          régulièrement.
        </span>
      </span>
      <button
        onClick={onCreateAccount}
        className="rounded-md bg-white/15 px-3 py-1 text-sm font-semibold text-on-accent ring-1 ring-white/30 hover:bg-white/25"
      >
        Créer mon espace
      </button>
    </div>
  )
}

export default function AppLayout() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [unread, setUnread] = useState(0)

  // Nombre de messages non lus : recharge a chaque changement de page ou de messagerie
  useEffect(() => {
    const refresh = () => messagesApi.unreadCount().then(setUnread).catch(() => {})
    refresh()
    window.addEventListener(MESSAGES_CHANGED, refresh)
    return () => window.removeEventListener(MESSAGES_CHANGED, refresh)
  }, [location.pathname])

  const leaveDemo = () => {
    logout()
    navigate('/register')
  }

  return (
    // "themed" : zone concernee par le mode sombre (voir index.css)
    <div className="themed flex min-h-screen flex-col bg-slate-50 text-slate-800">
      <div className="flex min-h-0 flex-1">
        {/* Barre laterale (ordinateur) : reste visible pendant le defilement */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-slate-200 lg:block">
          <Sidebar user={user} unread={unread} onLogout={logout} />
        </aside>

        <div className="min-w-0 flex-1">
          {user.demo && <DemoBanner onCreateAccount={leaveDemo} />}

          {/* Barre du haut (mobile) */}
          <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
            <Logo to="/app" />
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
              aria-label="Ouvrir le menu"
            >
              <Menu className="size-6" />
            </button>
          </header>

          {/* min-w-0 : autorise le contenu large (tableau Kanban) a defiler dans sa zone au lieu d'elargir la page */}
          <main className="min-w-0">
            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
              {/* Indicateur affiche le temps de telecharger une page chargee a la demande */}
              <Suspense fallback={<PageLoader />}>
                <Outlet />
              </Suspense>
            </div>
          </main>
        </div>
      </div>

      {/* Menu mobile */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} aria-hidden />
          <div className="absolute inset-y-0 left-0 w-72 shadow-xl">
            <Sidebar
              user={user}
              unread={unread}
              onLogout={logout}
              onNavigate={() => setMobileOpen(false)}
              onClose={() => setMobileOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
