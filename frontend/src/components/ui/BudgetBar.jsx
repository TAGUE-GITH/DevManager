import { AlertTriangle } from 'lucide-react'

// Jauge de consommation du budget ; au-dela de 100 % : barre rouge + icone + texte (jamais la couleur seule)
export default function BudgetBar({ percent, showLabel = true }) {
  const over = percent > 100
  return (
    <div>
      <div
        className="h-2 overflow-hidden rounded-full bg-slate-100"
        role="meter"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Budget consommé"
      >
        <div
          className={`h-full rounded-full transition-all ${over ? 'bg-red-500' : 'bg-indigo-500'}`}
          style={{ width: `${Math.min(percent, 100)}%` }}
        />
      </div>
      {showLabel && (
        <p className={`mt-1.5 flex items-center gap-1 text-xs ${over ? 'font-medium text-red-700' : 'text-slate-500'}`}>
          {over && <AlertTriangle className="size-3.5" aria-hidden />}
          {percent} % du budget consommé{over && ' (dépassement)'}
        </p>
      )}
    </div>
  )
}
