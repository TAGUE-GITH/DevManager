import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { getErrorMessage, getFieldErrors } from '../../api/client'
import { tasksApi } from '../../api/resources'
import { TASK_PRIORITY, TASK_STATUS, fullName, projectTeam } from '../../utils/format'
import Alert from '../ui/Alert'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Modal from '../ui/Modal'
import Select from '../ui/Select'
import Textarea from '../ui/Textarea'

const PRIORITY_OPTIONS = Object.entries(TASK_PRIORITY).map(([value, { label }]) => ({ value, label }))
const STATUS_OPTIONS = Object.entries(TASK_STATUS).map(([value, { label }]) => ({ value, label }))

/**
 * Creation (task absente) ou modification d'une tache.
 * Le choix du statut offre une alternative au glisser-deposer.
 */
export default function TaskFormModal({ project, task, canEdit, canMove, onClose, onSaved }) {
  const [form, setForm] = useState({
    title: task?.title ?? '',
    description: task?.description ?? '',
    priority: task?.priority ?? 'MEDIUM',
    dueDate: task?.dueDate ?? '',
    assigneeId: task?.assignee?.id ?? '',
    status: task?.status ?? 'TODO',
  })
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value })

  const run = async (action) => {
    setError('')
    setFieldErrors({})
    setSaving(true)
    try {
      await action()
      onSaved()
    } catch (err) {
      setError(getErrorMessage(err))
      setFieldErrors(getFieldErrors(err))
    } finally {
      setSaving(false)
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const payload = {
      title: form.title,
      description: form.description,
      priority: form.priority,
      dueDate: form.dueDate || null,
      assigneeId: form.assigneeId ? Number(form.assigneeId) : null,
    }
    run(async () => {
      if (!task) {
        await tasksApi.create(project.id, payload)
        return
      }
      if (canEdit) await tasksApi.update(task.id, payload)
      // Changement de colonne : la tache est placee en bas de la nouvelle colonne
      if (form.status !== task.status) await tasksApi.move(task.id, form.status, 10_000)
    })
  }

  const assigneeOptions = [
    { value: '', label: 'Non assignée' },
    ...projectTeam(project).map((member) => ({ value: member.id, label: fullName(member) })),
  ]
  const readOnly = Boolean(task) && !canEdit

  return (
    <Modal open title={task ? 'Tâche' : 'Nouvelle tâche'} onClose={onClose} size="lg">
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <Alert>{error}</Alert>
        <Input
          label="Titre"
          name="title"
          value={form.title}
          onChange={handleChange}
          error={fieldErrors.title}
          disabled={readOnly}
          required
        />
        <Textarea
          label="Description"
          name="description"
          value={form.description ?? ''}
          onChange={handleChange}
          error={fieldErrors.description}
          disabled={readOnly}
        />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Select
            label="Priorité"
            name="priority"
            value={form.priority}
            onChange={handleChange}
            options={PRIORITY_OPTIONS}
            disabled={readOnly}
          />
          <Input
            label="Échéance"
            name="dueDate"
            type="date"
            value={form.dueDate}
            onChange={handleChange}
            disabled={readOnly}
          />
          <Select
            label="Assignée à"
            name="assigneeId"
            value={form.assigneeId}
            onChange={handleChange}
            options={assigneeOptions}
            error={fieldErrors.assigneeId}
            disabled={readOnly}
          />
          {task && canMove && (
            <Select label="Statut" name="status" value={form.status} onChange={handleChange} options={STATUS_OPTIONS} />
          )}
        </div>
        {task && (
          <p className="text-xs text-slate-500">
            Créée par {fullName(task.createdBy)}
            {readOnly && ' · seuls son auteur et le responsable du projet peuvent la modifier'}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          {task && canEdit ? (
            confirmDelete ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-600">Supprimer ?</span>
                <Button type="button" variant="danger" loading={saving} onClick={() => run(() => tasksApi.remove(task.id))}>
                  Oui, supprimer
                </Button>
                <Button type="button" variant="ghost" onClick={() => setConfirmDelete(false)}>
                  Non
                </Button>
              </div>
            ) : (
              <Button type="button" variant="ghost" onClick={() => setConfirmDelete(true)}>
                <Trash2 className="size-4 text-red-600" aria-hidden />
                Supprimer
              </Button>
            )
          ) : (
            <span />
          )}
          <div className="flex gap-3">
            <Button type="button" variant="secondary" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" loading={saving}>
              {task ? 'Enregistrer' : 'Créer la tâche'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  )
}
