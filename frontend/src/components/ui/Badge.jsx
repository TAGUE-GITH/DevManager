import { PROJECT_STATUS } from '../../utils/format'

export default function Badge({ className = '', children }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${className}`}>
      {children}
    </span>
  )
}

export function StatusBadge({ status }) {
  const { label, badge } = PROJECT_STATUS[status]
  return <Badge className={badge}>{label}</Badge>
}
