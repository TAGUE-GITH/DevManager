import { useState } from 'react'
import Button from './Button'
import Modal from './Modal'
import { useTranslation } from 'react-i18next'

// Demande de confirmation avant une action irreversible (suppression...)
export default function ConfirmDialog({ open, title, message, confirmLabel, onConfirm, onClose }) {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await onConfirm()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} title={title} onClose={onClose}>
      <p className="text-sm text-slate-600">{message}</p>
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="secondary" onClick={onClose}>
          {t('common.cancel')}
        </Button>
        <Button variant="danger" loading={loading} onClick={handleConfirm}>
          {confirmLabel ?? t('common.delete')}
        </Button>
      </div>
    </Modal>
  )
}
