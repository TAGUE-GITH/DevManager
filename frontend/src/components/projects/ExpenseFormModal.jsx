import { useState } from 'react'
import { getErrorMessage, getFieldErrors } from '../../api/client'
import { expensesApi } from '../../api/resources'
import { EXPENSE_CATEGORY } from '../../utils/format'
import Alert from '../ui/Alert'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Modal from '../ui/Modal'
import Select from '../ui/Select'

const CATEGORY_OPTIONS = Object.entries(EXPENSE_CATEGORY).map(([value, label]) => ({ value, label }))
const today = () => new Date().toISOString().slice(0, 10)

export default function ExpenseFormModal({ projectId, onClose, onSaved }) {
  const [form, setForm] = useState({ label: '', amount: '', category: 'OTHER', date: today() })
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value })

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setFieldErrors({})
    setSaving(true)
    try {
      await expensesApi.create(projectId, { ...form, amount: form.amount === '' ? null : Number(form.amount) })
      onSaved()
    } catch (err) {
      setError(getErrorMessage(err))
      setFieldErrors(getFieldErrors(err))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal open title="Nouvelle dépense" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <Alert>{error}</Alert>
        <Input
          label="Libellé"
          name="label"
          placeholder="Ex. Licences logicielles"
          value={form.label}
          onChange={handleChange}
          error={fieldErrors.label}
          required
        />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input
            label="Montant (FCFA)"
            name="amount"
            type="number"
            min="1"
            value={form.amount}
            onChange={handleChange}
            error={fieldErrors.amount}
            required
          />
          <Input label="Date" name="date" type="date" value={form.date} onChange={handleChange} error={fieldErrors.date} required />
        </div>
        <Select label="Catégorie" name="category" value={form.category} onChange={handleChange} options={CATEGORY_OPTIONS} />
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" loading={saving}>
            Ajouter
          </Button>
        </div>
      </form>
    </Modal>
  )
}
