import { FolderKanban, LayoutDashboard, MessageSquare, Users } from 'lucide-react'

// Illustration de l'application en HTML/CSS pour la page d'accueil (donnees d'exemple, purement decoratives)
const PROJECTS = [
  { name: 'Site e-commerce', percent: 64 },
  { name: 'Application mobile', percent: 38 },
  { name: 'Refonte du SI', percent: 91 },
]

export default function AppPreview() {
  return (
    <div className="relative" aria-hidden>
      <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-indigo-500/20 via-violet-500/10 to-sky-400/20 blur-2xl" />
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/10">
        {/* Barre de fenetre */}
        <div className="flex items-center gap-1.5 border-b border-slate-100 bg-slate-50 px-4 py-2.5">
          <span className="size-2.5 rounded-full bg-red-400" />
          <span className="size-2.5 rounded-full bg-amber-400" />
          <span className="size-2.5 rounded-full bg-emerald-400" />
          <span className="ml-3 rounded-md bg-white px-3 py-0.5 text-[10px] text-slate-400 ring-1 ring-slate-200">
            devmanager.app
          </span>
        </div>

        <div className="flex">
          {/* Menu lateral */}
          <div className="hidden w-36 shrink-0 space-y-1 border-r border-slate-100 p-3 sm:block">
            {[
              { Icon: LayoutDashboard, label: 'Tableau de bord', active: true },
              { Icon: FolderKanban, label: 'Projets' },
              { Icon: MessageSquare, label: 'Messagerie' },
              { Icon: Users, label: 'Équipe' },
            ].map(({ Icon, label, active }) => (
              <div
                key={label}
                className={`flex items-center gap-2 rounded-md px-2 py-1.5 text-[10px] font-medium ${
                  active ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500'
                }`}
              >
                <Icon className="size-3.5" />
                {label}
              </div>
            ))}
          </div>

          {/* Contenu */}
          <div className="flex-1 space-y-3 p-4">
            <div className="grid grid-cols-3 gap-2.5">
              {[
                ['Projets', '12'],
                ['Budget', '48,5 M'],
                ['Dépensé', '29,1 M'],
              ].map(([label, value]) => (
                <div key={label} className="rounded-lg p-2.5 ring-1 ring-slate-100">
                  <p className="text-[9px] text-slate-500">{label}</p>
                  <p className="mt-1 text-sm font-bold text-slate-900">{value}</p>
                </div>
              ))}
            </div>

            <div className="rounded-lg p-3 ring-1 ring-slate-100">
              <p className="text-[10px] font-semibold text-slate-900">Consommation des budgets</p>
              <div className="mt-3 space-y-2.5">
                {PROJECTS.map(({ name, percent }) => (
                  <div key={name}>
                    <div className="flex justify-between text-[9px] text-slate-600">
                      <span>{name}</span>
                      <span className="font-medium">{percent} %</span>
                    </div>
                    <div className="mt-1 h-1.5 rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-indigo-500" style={{ width: `${percent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2.5 rounded-lg p-2.5 ring-1 ring-slate-100">
              <span className="flex size-6 items-center justify-center rounded-full bg-indigo-100 text-[9px] font-semibold text-indigo-700">
                MN
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold text-slate-900">Nouveau message</p>
                <p className="truncate text-[9px] text-slate-500">Les maquettes sont prêtes pour validation</p>
              </div>
              <span className="size-1.5 rounded-full bg-indigo-600" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
