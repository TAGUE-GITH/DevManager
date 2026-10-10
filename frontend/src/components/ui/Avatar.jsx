import { apiUrl } from '../../api/client'
import { fullName, initials } from '../../utils/format'

const SIZES = { sm: 'size-7 text-xs', md: 'size-9 text-sm', xl: 'size-24 text-2xl' }

// Photo de profil, ou initiales si l'utilisateur n'a pas de photo
export default function Avatar({ user, size = 'md' }) {
  if (user.avatarUrl) {
    return (
      <img
        src={apiUrl(user.avatarUrl)}
        alt={fullName(user)}
        title={fullName(user)}
        className={`inline-block shrink-0 rounded-full object-cover ring-2 ring-white ${SIZES[size]}`}
      />
    )
  }
  return (
    <span
      title={fullName(user)}
      className={`inline-flex shrink-0 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700 ${SIZES[size]}`}
    >
      {initials(user)}
    </span>
  )
}
