import { useEffect, useState } from 'react'
import { getErrorMessage, getFieldErrors } from '../../api/client'
import { messagesApi, usersApi } from '../../api/resources'
import { useAuth } from '../../context/useAuth'
import { fullName } from '../../utils/format'
import Alert from '../ui/Alert'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Modal from '../ui/Modal'
import Select from '../ui/Select'
import Textarea from '../ui/Textarea'
import { useTranslation } from 'react-i18next'

// Nouveau message ; "initial" permet de pre-remplir une reponse
export default function ComposeModal({ initial, onClose, onSent }) {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [recipients, setRecipients] = useState([])
  const [form, setForm] = useState({ recipientId: '', subject: '', content: '', ...initial })
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [sending, setSending] = useState(false)

  useEffect(() => {
    usersApi
      .list()
      .then((users) => setRecipients(users.filter((u) => u.id !== user.id)))
      .catch((err) => setError(getErrorMessage(err)))
  }, [user.id])

  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value })

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setFieldErrors({})
    setSending(true)
    try {
      await messagesApi.send({ ...form, recipientId: form.recipientId ? Number(form.recipientId) : null })
      onSent()
    } catch (err) {
      setError(getErrorMessage(err))
      setFieldErrors(getFieldErrors(err))
    } finally {
      setSending(false)
    }
  }

  const options = [
    { value: '', label: t('messages.chooseRecipient') },
    ...recipients.map((recipient) => ({ value: recipient.id, label: fullName(recipient) })),
  ]

  return (
    <Modal open title={t('messages.new')} onClose={onClose} size="lg">
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <Alert>{error}</Alert>
        <Select
          label={t('messages.recipient')}
          name="recipientId"
          value={form.recipientId}
          onChange={handleChange}
          options={options}
          error={fieldErrors.recipientId}
        />
        <Input label={t('messages.subject')} name="subject" value={form.subject} onChange={handleChange} error={fieldErrors.subject} required />
        <Textarea
          label={t('messages.message')}
          name="content"
          rows={6}
          value={form.content}
          onChange={handleChange}
          error={fieldErrors.content}
          required
        />
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            {t('common.cancel')}
          </Button>
          <Button type="submit" loading={sending}>
            {t('messages.send')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
