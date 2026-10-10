import { useState } from 'react'
import { getErrorMessage, getFieldErrors } from '../../api/client'
import { expensesApi } from '../../api/resources'
import { EXPENSE_CATEGORY } from '../../utils/format'
import Alert from '../ui/Alert'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Modal from '../ui/Modal'
import Select from '../ui/Select'
import { useTranslation } from 'react-i18next'

const today = () => new Date().toISOString().slice(0, 10)

export default function ExpenseFormModal({ projectId, onClose, onSaved }) {
  const { t } = useTranslation()
  const [form, setForm] = useState({ label: '', amount: '', category: 'OTHER', date: today() })
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const categoryOptions = Object.entries(EXPENSE_CATEGORY).map(([value, label]) => ({ value, label }))

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
    <Modal open title={t('expenses.new')} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <Alert>{error}</Alert>
        <Input
          label={t('expenses.label')}
          name="label"
          placeholder={t('expenses.labelPlaceholder')}
          value={form.label}
          onChange={handleChange}
          error={fieldErrors.label}
          required
        />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input
            label={t('expenses.amount')}
            name="amount"
            type="number"
            min="1"
            value={form.amount}
            onChange={handleChange}
            error={fieldErrors.amount}
            required
          />
          <Input label={t('expenses.date')} name="date" type="date" value={form.date} onChange={handleChange} error={fieldErrors.date} required />
        </div>
        <Select label={t('expenses.category')} name="category" value={form.category} onChange={handleChange} options={categoryOptions} />
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" loading={saving}>
            {t('common.add')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
