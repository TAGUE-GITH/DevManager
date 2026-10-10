import { PlayCircle } from 'lucide-react'
import { useState } from 'react'
import Modal from '../ui/Modal'

// Bouton "Voir la video" : la video de demonstration s'ouvre dans une fenetre
export default function VideoButton() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 hover:text-indigo-600"
      >
        <PlayCircle className="size-5" aria-hidden />
        Voir la vidéo de présentation (37 s)
      </button>
      {open && (
        <Modal open title="Découvrez DevManager" onClose={() => setOpen(false)} size="xl">
          <video
            src="/demo/devmanager-demo.mp4"
            poster="/demo/devmanager-demo-poster.jpg"
            controls
            autoPlay
            muted
            playsInline
            className="w-full rounded-lg bg-black"
          >
            Votre navigateur ne peut pas lire cette vidéo.
          </video>
          <p className="mt-3 text-sm text-slate-500">
            Démonstration : compte d’essai, tableau de bord, Kanban, messagerie et mode sombre.
          </p>
        </Modal>
      )}
    </>
  )
}
