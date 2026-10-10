import { Camera, Trash2 } from 'lucide-react'
import { useRef, useState } from 'react'
import { getErrorMessage } from '../api/client'
import { resizeImage } from '../utils/image'
import Button from './ui/Button'
import { useTranslation } from 'react-i18next'

/**
 * Choix d'une image (photo de profil ou logo) : apercu, changement et suppression.
 * L'image est redimensionnee dans le navigateur avant l'envoi (voir utils/image.js).
 */
export default function ImageUploader({ preview, label, hint, onUpload, onRemove, hasImage, disabledReason }) {
  const { t } = useTranslation()
  const input = useRef(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const run = async (action) => {
    setError('')
    setBusy(true)
    try {
      await action()
    } catch (err) {
      setError(err.response ? getErrorMessage(err) : err.message)
    } finally {
      setBusy(false)
    }
  }

  const handleFile = (event) => {
    const file = event.target.files[0]
    event.target.value = ''
    if (file) run(async () => onUpload(await resizeImage(file)))
  }

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
      <div className="relative">
        {preview}
        <button
          type="button"
          onClick={() => input.current.click()}
          disabled={busy || Boolean(disabledReason)}
          className="absolute -right-1 -bottom-1 flex size-9 items-center justify-center rounded-full bg-indigo-600 text-on-accent shadow-md ring-4 ring-white transition hover:bg-indigo-500 disabled:opacity-50"
          aria-label={t('image.change', { label })}
          title={t('image.change', { label })}
        >
          <Camera className="size-4" aria-hidden />
        </button>
      </div>
      <div className="text-center sm:text-left">
        <p className="font-medium text-slate-900">{label}</p>
        <p className="mt-1 text-sm text-slate-500">{disabledReason ?? hint}</p>
        <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
          <Button
            type="button"
            variant="secondary"
            loading={busy}
            disabled={Boolean(disabledReason)}
            onClick={() => input.current.click()}
          >
            <Camera className="size-4" aria-hidden />
            {t('image.choose')}
          </Button>
          {hasImage && (
            <Button type="button" variant="ghost" disabled={busy} onClick={() => run(onRemove)}>
              <Trash2 className="size-4 text-red-600" aria-hidden />
              {t('common.delete')}
            </Button>
          )}
        </div>
        {error && (
          <p role="alert" className="mt-2 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
      <input ref={input} type="file" accept="image/png,image/jpeg,image/webp" className="sr-only" onChange={handleFile} />
    </div>
  )
}
