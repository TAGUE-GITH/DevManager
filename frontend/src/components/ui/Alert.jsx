import { CheckCircle2, AlertCircle } from 'lucide-react'

const STYLES = {
  error: { box: 'bg-red-50 text-red-800 ring-red-200', Icon: AlertCircle },
  success: { box: 'bg-emerald-50 text-emerald-800 ring-emerald-200', Icon: CheckCircle2 },
}

export default function Alert({ type = 'error', children }) {
  if (!children) return null
  const { box, Icon } = STYLES[type]
  return (
    <div role="alert" className={`flex items-start gap-2.5 rounded-lg p-3.5 text-sm ring-1 ring-inset ${box}`}>
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden />
      <div>{children}</div>
    </div>
  )
}
