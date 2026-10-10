import { PlayCircle } from 'lucide-react'
import { useState } from 'react'
import Modal from '../ui/Modal'
import { useTranslation } from 'react-i18next'

// Bouton "Voir la video" : la video de demonstration s'ouvre dans une fenetre
export default function VideoButton() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 hover:text-indigo-600"
      >
        <PlayCircle className="size-5" aria-hidden />
        {t('video.button')}
      </button>
      {open && (
        <Modal open title={t('video.title')} onClose={() => setOpen(false)} size="xl">
          <video
            src="/demo/devmanager-demo.mp4"
            poster="/demo/devmanager-demo-poster.jpg"
            controls
            autoPlay
            muted
            playsInline
            className="w-full rounded-lg bg-black"
          >
            {t('video.unsupported')}
          </video>
          <p className="mt-3 text-sm text-slate-500">
            {t('video.caption')}
          </p>
        </Modal>
      )}
    </>
  )
}
