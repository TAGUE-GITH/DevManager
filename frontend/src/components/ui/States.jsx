import { AlertCircle, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function PageLoader() {
  const { t } = useTranslation()
  return (
    <div className="flex justify-center py-20">
      <Loader2 className="size-8 animate-spin text-indigo-600" aria-label={t('common.loading')} />
    </div>
  )
}

export function ErrorState({ message }) {
  return (
    <div className="flex flex-col items-center py-16 text-center">
      <AlertCircle className="size-10 text-red-400" aria-hidden />
      <p className="mt-3 text-sm text-slate-600">{message}</p>
    </div>
  )
}

export function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center rounded-xl border-2 border-dashed border-slate-200 px-6 py-14 text-center">
      <Icon className="size-10 text-slate-300" aria-hidden />
      <h3 className="mt-3 font-semibold text-slate-900">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
