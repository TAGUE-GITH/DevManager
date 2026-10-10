import DemoButton from './DemoButton'

// Separateur "ou" suivi du bouton de demonstration (pages de connexion et d'inscription)
export default function DemoDivider() {
  return (
    <div className="mt-6">
      <div className="flex items-center gap-3 text-xs font-medium tracking-wide text-slate-400 uppercase">
        <span className="h-px flex-1 bg-slate-200" />
        ou
        <span className="h-px flex-1 bg-slate-200" />
      </div>
      <DemoButton className="mt-6">Essayer la démo, sans compte</DemoButton>
    </div>
  )
}
