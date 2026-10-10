import { CalendarDays, FolderKanban, Plus, Search, Users } from 'lucide-react'
import { useCallback, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { projectsApi } from '../api/resources'
import ProjectFormModal from '../components/projects/ProjectFormModal'
import { StatusBadge } from '../components/ui/Badge'
import BudgetBar from '../components/ui/BudgetBar'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import PageHeader from '../components/ui/PageHeader'
import { EmptyState, ErrorState, PageLoader } from '../components/ui/States'
import { useAuth } from '../context/useAuth'
import { useFetch } from '../hooks/useFetch'
import { PROJECT_STATUS, canCreateProject, formatCurrency, formatDate } from '../utils/format'

const FILTERS = [{ value: 'ALL', label: 'Tous' }, ...Object.entries(PROJECT_STATUS).map(([value, { label }]) => ({ value, label }))]

function ProjectCard({ project }) {
  return (
    <Link to={`/projects/${project.id}`} className="group block">
      <Card className="flex h-full flex-col p-5 transition group-hover:shadow-md group-hover:ring-indigo-200">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-slate-900 group-hover:text-indigo-600">{project.name}</h3>
          <StatusBadge status={project.status} />
        </div>
        <p className="mt-2 line-clamp-2 flex-1 text-sm text-slate-500">{project.description || 'Aucune description'}</p>
        <div className="mt-5">
          <div className="mb-2 flex items-baseline justify-between text-sm">
            <span className="font-semibold text-slate-900">{formatCurrency(project.spent)}</span>
            <span className="text-slate-500">sur {formatCurrency(project.budget)}</span>
          </div>
          <BudgetBar percent={project.consumedPercent} />
        </div>
        <div className="mt-4 flex items-center gap-4 border-t border-slate-100 pt-4 text-xs text-slate-500">
          <span className="flex items-center gap-1.5">
            <Users className="size-4" aria-hidden />
            {project.members.length + 1} personne{project.members.length > 0 && 's'}
          </span>
          {project.endDate && (
            <span className="flex items-center gap-1.5">
              <CalendarDays className="size-4" aria-hidden />
              Fin le {formatDate(project.endDate)}
            </span>
          )}
        </div>
      </Card>
    </Link>
  )
}

export default function ProjectsPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { data: projects, loading, error } = useFetch(useCallback(() => projectsApi.list(), []))
  const [filter, setFilter] = useState('ALL')
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)

  const canCreate = canCreateProject(user)
  const newProjectButton = canCreate && (
    <Button onClick={() => setFormOpen(true)}>
      <Plus className="size-4" aria-hidden />
      Nouveau projet
    </Button>
  )

  const visible = (projects ?? []).filter(
    (project) =>
      (filter === 'ALL' || project.status === filter) &&
      project.name.toLowerCase().includes(search.trim().toLowerCase()),
  )

  return (
    <>
      <PageHeader title="Projets" description="Suivez l'avancement et le budget de chaque projet." actions={newProjectButton} />

      {loading && <PageLoader />}
      {error && <ErrorState message={error} />}

      {projects && projects.length === 0 && (
        <EmptyState
          icon={FolderKanban}
          title="Aucun projet"
          description={
            canCreate
              ? 'Créez votre premier projet pour commencer à suivre son budget.'
              : "Vous n'êtes membre d'aucun projet pour le moment."
          }
          action={newProjectButton}
        />
      )}

      {projects && projects.length > 0 && (
        <>
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-1 overflow-x-auto rounded-lg bg-slate-100 p-1" role="tablist" aria-label="Filtrer par statut">
              {FILTERS.map(({ value, label }) => (
                <button
                  key={value}
                  role="tab"
                  aria-selected={filter === value}
                  onClick={() => setFilter(value)}
                  className={`whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition ${
                    filter === value ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="relative sm:w-64">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" aria-hidden />
              <input
                type="search"
                placeholder="Rechercher un projet"
                aria-label="Rechercher un projet"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white py-2 pr-3 pl-9 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              />
            </div>
          </div>

          {visible.length === 0 ? (
            <p className="py-12 text-center text-sm text-slate-500">Aucun projet ne correspond à votre recherche.</p>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {visible.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </>
      )}

      {formOpen && (
        <ProjectFormModal
          open
          onClose={() => setFormOpen(false)}
          onSaved={(project) => navigate(`/projects/${project.id}`)}
        />
      )}
    </>
  )
}
