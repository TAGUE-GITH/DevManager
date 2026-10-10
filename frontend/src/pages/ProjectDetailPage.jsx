import { ArrowLeft, Pencil, Plus, Receipt, Trash2 } from 'lucide-react'
import { useCallback, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getErrorMessage } from '../api/client'
import { expensesApi, projectsApi } from '../api/resources'
import ExpenseFormModal from '../components/projects/ExpenseFormModal'
import ProjectFormModal from '../components/projects/ProjectFormModal'
import Alert from '../components/ui/Alert'
import Avatar from '../components/ui/Avatar'
import { StatusBadge } from '../components/ui/Badge'
import BudgetBar from '../components/ui/BudgetBar'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import Select from '../components/ui/Select'
import { EmptyState, ErrorState, PageLoader } from '../components/ui/States'
import { useAuth } from '../context/useAuth'
import { useFetch } from '../hooks/useFetch'
import {
  EXPENSE_CATEGORY,
  PROJECT_STATUS,
  canChangeStatus,
  canManageProject,
  formatCurrency,
  formatDate,
  fullName,
} from '../utils/format'

const STATUS_OPTIONS = Object.entries(PROJECT_STATUS).map(([value, { label }]) => ({ value, label }))

function BudgetSummary({ project }) {
  const items = [
    { label: 'Budget alloué', value: project.budget },
    { label: 'Dépensé', value: project.spent },
    { label: 'Reste', value: project.remaining, negative: project.remaining < 0 },
  ]
  return (
    <Card className="p-6">
      <h2 className="font-semibold text-slate-900">Budget</h2>
      <dl className="mt-5 grid grid-cols-3 gap-4">
        {items.map(({ label, value, negative }) => (
          <div key={label}>
            <dt className="text-xs font-medium text-slate-500">{label}</dt>
            <dd className={`mt-1 text-lg font-bold tracking-tight ${negative ? 'text-red-700' : 'text-slate-900'}`}>
              {formatCurrency(value)}
            </dd>
          </div>
        ))}
      </dl>
      <div className="mt-5">
        <BudgetBar percent={project.consumedPercent} />
      </div>
    </Card>
  )
}

function Team({ project }) {
  return (
    <Card className="p-6">
      <h2 className="font-semibold text-slate-900">Équipe</h2>
      <ul className="mt-4 space-y-3">
        <li className="flex items-center gap-3">
          <Avatar user={project.owner} size="sm" />
          <span className="flex-1 truncate text-sm text-slate-900">{fullName(project.owner)}</span>
          <span className="text-xs font-medium text-indigo-600">Responsable</span>
        </li>
        {project.members.map((member) => (
          <li key={member.id} className="flex items-center gap-3">
            <Avatar user={member} size="sm" />
            <span className="flex-1 truncate text-sm text-slate-700">{fullName(member)}</span>
          </li>
        ))}
      </ul>
    </Card>
  )
}

export default function ProjectDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const loadProject = useCallback(() => Promise.all([projectsApi.get(id), expensesApi.list(id)]), [id])
  const { data, loading, error, reload } = useFetch(loadProject)

  const [editOpen, setEditOpen] = useState(false)
  const [expenseOpen, setExpenseOpen] = useState(false)
  const [deleteProjectOpen, setDeleteProjectOpen] = useState(false)
  const [expenseToDelete, setExpenseToDelete] = useState(null)
  const [actionError, setActionError] = useState('')

  if (loading) return <PageLoader />
  if (error) return <ErrorState message={error} />

  const [project, expenses] = data
  const canManage = canManageProject(user, project)

  const runAction = async (action) => {
    setActionError('')
    try {
      await action()
      await reload()
    } catch (err) {
      setActionError(getErrorMessage(err))
    }
  }

  const handleStatusChange = (event) => runAction(() => projectsApi.updateStatus(project.id, event.target.value))

  const deleteProject = async () => {
    try {
      await projectsApi.remove(project.id)
      navigate('/app/projects', { replace: true })
    } catch (err) {
      setDeleteProjectOpen(false)
      setActionError(getErrorMessage(err))
    }
  }

  const deleteExpense = async () => {
    await runAction(() => expensesApi.remove(expenseToDelete.id))
    setExpenseToDelete(null)
  }

  return (
    <>
      <Link to="/app/projects" className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900">
        <ArrowLeft className="size-4" aria-hidden />
        Projets
      </Link>

      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">{project.name}</h1>
            <StatusBadge status={project.status} />
          </div>
          <p className="mt-2 max-w-2xl text-sm whitespace-pre-line text-slate-600">
            {project.description || 'Aucune description'}
          </p>
          {(project.startDate || project.endDate) && (
            <p className="mt-2 text-xs text-slate-500">
              Du {formatDate(project.startDate)} au {formatDate(project.endDate)}
            </p>
          )}
        </div>
        <div className="flex shrink-0 flex-wrap items-end gap-3">
          {canChangeStatus(user, project) && (
            <Select
              label="Statut"
              value={project.status}
              onChange={handleStatusChange}
              options={STATUS_OPTIONS}
              className="w-40"
            />
          )}
          {canManage && (
            <>
              <Button variant="secondary" onClick={() => setEditOpen(true)}>
                <Pencil className="size-4" aria-hidden />
                Modifier
              </Button>
              <Button variant="secondary" onClick={() => setDeleteProjectOpen(true)} aria-label="Supprimer le projet">
                <Trash2 className="size-4 text-red-600" aria-hidden />
              </Button>
            </>
          )}
        </div>
      </div>

      {actionError && (
        <div className="mb-6">
          <Alert>{actionError}</Alert>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <BudgetSummary project={project} />
        </div>
        <Team project={project} />
      </div>

      <Card className="mt-6">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="font-semibold text-slate-900">Dépenses</h2>
          {canManage && (
            <Button onClick={() => setExpenseOpen(true)}>
              <Plus className="size-4" aria-hidden />
              Ajouter
            </Button>
          )}
        </div>
        {expenses.length === 0 ? (
          <div className="p-6">
            <EmptyState icon={Receipt} title="Aucune dépense enregistrée" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-medium text-slate-500 uppercase">
                <tr>
                  <th scope="col" className="px-6 py-3">Libellé</th>
                  <th scope="col" className="px-6 py-3">Catégorie</th>
                  <th scope="col" className="px-6 py-3">Date</th>
                  <th scope="col" className="px-6 py-3 text-right">Montant</th>
                  {canManage && <th scope="col" className="w-12 px-6 py-3"><span className="sr-only">Actions</span></th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {expenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-slate-50">
                    <td className="px-6 py-3.5 font-medium text-slate-900">{expense.label}</td>
                    <td className="px-6 py-3.5 text-slate-600">{EXPENSE_CATEGORY[expense.category]}</td>
                    <td className="px-6 py-3.5 whitespace-nowrap text-slate-600">{formatDate(expense.date)}</td>
                    <td className="px-6 py-3.5 text-right font-medium whitespace-nowrap text-slate-900 tabular-nums">
                      {formatCurrency(expense.amount)}
                    </td>
                    {canManage && (
                      <td className="px-6 py-3.5 text-right">
                        <button
                          onClick={() => setExpenseToDelete(expense)}
                          className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                          aria-label={`Supprimer la dépense ${expense.label}`}
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {editOpen && (
        <ProjectFormModal
          open
          project={project}
          onClose={() => setEditOpen(false)}
          onSaved={() => {
            setEditOpen(false)
            reload()
          }}
        />
      )}
      {expenseOpen && (
        <ExpenseFormModal
          projectId={project.id}
          onClose={() => setExpenseOpen(false)}
          onSaved={() => {
            setExpenseOpen(false)
            reload()
          }}
        />
      )}
      <ConfirmDialog
        open={deleteProjectOpen}
        title="Supprimer le projet ?"
        message={`Le projet « ${project.name} » et toutes ses dépenses seront définitivement supprimés.`}
        onConfirm={deleteProject}
        onClose={() => setDeleteProjectOpen(false)}
      />
      <ConfirmDialog
        open={Boolean(expenseToDelete)}
        title="Supprimer la dépense ?"
        message={expenseToDelete && `La dépense « ${expenseToDelete.label} » sera définitivement supprimée.`}
        onConfirm={deleteExpense}
        onClose={() => setExpenseToDelete(null)}
      />
    </>
  )
}
