import { useEffect, useState } from 'react'
import { getErrorMessage, getFieldErrors } from '../../api/client'
import { projectsApi, usersApi } from '../../api/resources'
import { useAuth } from '../../context/useAuth'
import { fullName } from '../../utils/format'
import Alert from '../ui/Alert'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Modal from '../ui/Modal'
import Textarea from '../ui/Textarea'

const toForm = (project) => ({
  name: project?.name ?? '',
  description: project?.description ?? '',
  budget: project?.budget ?? '',
  startDate: project?.startDate ?? '',
  endDate: project?.endDate ?? '',
  memberIds: project?.members.map((member) => member.id) ?? [],
})

// Formulaire de creation (project absent) ou de modification d'un projet
export default function ProjectFormModal({ open, project, onClose, onSaved }) {
  const { user: currentUser } = useAuth()
  const [form, setForm] = useState(() => toForm(project))
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (open) usersApi.list().then(setUsers).catch(() => setUsers([]))
  }, [open])

  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value })

  const toggleMember = (id) =>
    setForm({
      ...form,
      memberIds: form.memberIds.includes(id) ? form.memberIds.filter((m) => m !== id) : [...form.memberIds, id],
    })

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setFieldErrors({})
    setSaving(true)
    const payload = {
      ...form,
      budget: form.budget === '' ? null : Number(form.budget),
      startDate: form.startDate || null,
      endDate: form.endDate || null,
    }
    try {
      const saved = project ? await projectsApi.update(project.id, payload) : await projectsApi.create(payload)
      onSaved(saved)
    } catch (err) {
      setError(getErrorMessage(err))
      setFieldErrors(getFieldErrors(err))
    } finally {
      setSaving(false)
    }
  }

  // Le responsable (le createur pour un nouveau projet) n'apparait pas dans la liste des membres possibles
  const ownerId = project?.owner.id ?? currentUser.id
  const candidates = users.filter((user) => user.id !== ownerId)

  return (
    <Modal open={open} onClose={onClose} title={project ? 'Modifier le projet' : 'Nouveau projet'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <Alert>{error}</Alert>
        <Input label="Nom du projet" name="name" value={form.name} onChange={handleChange} error={fieldErrors.name} required />
        <Textarea
          label="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
          error={fieldErrors.description}
        />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <Input
            label="Budget (FCFA)"
            name="budget"
            type="number"
            min="0"
            step="1"
            value={form.budget}
            onChange={handleChange}
            error={fieldErrors.budget}
            required
          />
          <Input label="Début" name="startDate" type="date" value={form.startDate} onChange={handleChange} />
          <Input label="Fin" name="endDate" type="date" value={form.endDate} onChange={handleChange} />
        </div>

        <fieldset>
          <legend className="mb-2 text-sm font-medium text-slate-700">Membres de l'équipe</legend>
          {candidates.length === 0 ? (
            <p className="text-sm text-slate-500">Aucun autre utilisateur pour le moment.</p>
          ) : (
            <div className="grid max-h-48 grid-cols-1 gap-2 overflow-y-auto rounded-lg border border-slate-200 p-3 sm:grid-cols-2">
              {candidates.map((user) => (
                <label key={user.id} className="flex cursor-pointer items-center gap-2.5 rounded-md p-1.5 text-sm hover:bg-slate-50">
                  <input
                    type="checkbox"
                    className="size-4 rounded accent-indigo-600"
                    checked={form.memberIds.includes(user.id)}
                    onChange={() => toggleMember(user.id)}
                  />
                  <span className="truncate">{fullName(user)}</span>
                </label>
              ))}
            </div>
          )}
        </fieldset>

        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" loading={saving}>
            {project ? 'Enregistrer' : 'Créer le projet'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
