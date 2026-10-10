import { fullName, initials } from '../../utils/format'

export default function Avatar({ user, size = 'md' }) {
  const sizes = { sm: 'size-7 text-xs', md: 'size-9 text-sm' }
  return (
    <span
      title={fullName(user)}
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700 ${sizes[size]}`}
    >
      {initials(user)}
    </span>
  )
}
