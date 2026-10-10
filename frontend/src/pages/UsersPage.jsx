import { useCallback, useState } from 'react'
import { getErrorMessage } from '../api/client'
import { usersApi } from '../api/resources'
import Alert from '../components/ui/Alert'
import Avatar from '../components/ui/Avatar'
import Card from '../components/ui/Card'
import PageHeader from '../components/ui/PageHeader'
import { ErrorState, PageLoader } from '../components/ui/States'
import { useAuth } from '../context/useAuth'
import { useFetch } from '../hooks/useFetch'
import { ROLE, fullName } from '../utils/format'

const ROLE_OPTIONS = Object.entries(ROLE).map(([value, label]) => ({ value, label }))

// Page reservee aux administrateurs : gestion des roles
export default function UsersPage() {
  const { user: currentUser } = useAuth()
  const { data: users, loading, error, setData } = useFetch(useCallback(() => usersApi.list(), []))
  const [feedback, setFeedback] = useState({ type: 'success', text: '' })

  const changeRole = async (user, role) => {
    setFeedback({ type: 'success', text: '' })
    try {
      const updated = await usersApi.updateRole(user.id, role)
      setData(users.map((u) => (u.id === updated.id ? updated : u)))
      setFeedback({ type: 'success', text: `${fullName(updated)} est maintenant ${ROLE[updated.role].toLowerCase()}.` })
    } catch (err) {
      setFeedback({ type: 'error', text: getErrorMessage(err) })
    }
  }

  return (
    <>
      <PageHeader title="Utilisateurs" description="Gérez les rôles des membres de l'entreprise." />

      {loading && <PageLoader />}
      {error && <ErrorState message={error} />}

      {feedback.text && (
        <div className="mb-6">
          <Alert type={feedback.type}>{feedback.text}</Alert>
        </div>
      )}

      {users && (
        <Card className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs font-medium text-slate-500 uppercase">
              <tr>
                <th scope="col" className="px-6 py-3">Utilisateur</th>
                <th scope="col" className="px-6 py-3">Email</th>
                <th scope="col" className="px-6 py-3">Rôle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar user={user} size="sm" />
                      <span className="font-medium whitespace-nowrap text-slate-900">
                        {fullName(user)}
                        {user.id === currentUser.id && <span className="ml-1.5 text-xs font-normal text-slate-500">(vous)</span>}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 text-slate-600">{user.email}</td>
                  <td className="px-6 py-3.5">
                    <select
                      value={user.role}
                      disabled={user.id === currentUser.id}
                      onChange={(event) => changeRole(user, event.target.value)}
                      aria-label={`Rôle de ${fullName(user)}`}
                      className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 disabled:bg-slate-50 disabled:text-slate-500"
                    >
                      {ROLE_OPTIONS.map(({ value, label }) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </>
  )
}
