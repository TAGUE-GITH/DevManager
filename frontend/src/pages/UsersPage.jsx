import { Check, Copy, Mail, Trash2, UserPlus } from 'lucide-react'
import { useCallback, useState } from 'react'
import { getErrorMessage, getFieldErrors, isPlanLimitError } from '../api/client'
import { invitationsApi, usersApi } from '../api/resources'
import PlanLimitAlert from '../components/PlanLimitAlert'
import Alert from '../components/ui/Alert'
import Avatar from '../components/ui/Avatar'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import PageHeader from '../components/ui/PageHeader'
import Select from '../components/ui/Select'
import { ErrorState, PageLoader } from '../components/ui/States'
import { useAuth } from '../context/useAuth'
import { useFetch } from '../hooks/useFetch'
import { ROLE, formatDate, fullName } from '../utils/format'

const ROLE_OPTIONS = Object.entries(ROLE).map(([value, label]) => ({ value, label }))

function InviteForm({ onInvited }) {
  const [form, setForm] = useState({ email: '', role: 'EMPLOYEE' })
  const [error, setError] = useState('')
  const [limitError, setLimitError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [sending, setSending] = useState(false)

  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value })

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLimitError('')
    setFieldErrors({})
    setSending(true)
    try {
      const invitation = await invitationsApi.create(form)
      setForm({ email: '', role: form.role })
      onInvited(invitation)
    } catch (err) {
      if (isPlanLimitError(err)) {
        setLimitError(getErrorMessage(err))
        return
      }
      setError(getErrorMessage(err))
      setFieldErrors(getFieldErrors(err))
    } finally {
      setSending(false)
    }
  }

  return (
    <Card className="p-6">
      <h2 className="flex items-center gap-2 font-semibold text-slate-900">
        <UserPlus className="size-5 text-indigo-600" aria-hidden />
        Inviter un membre
      </h2>
      <p className="mt-1 text-sm text-slate-500">La personne reçoit un email avec un lien pour créer son compte.</p>
      <form onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
        <Alert>{error}</Alert>
        {limitError && <PlanLimitAlert message={limitError} />}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_12rem_auto] sm:items-start">
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="collegue@entreprise.com"
            value={form.email}
            onChange={handleChange}
            error={fieldErrors.email}
            required
          />
          <Select label="Rôle" name="role" value={form.role} onChange={handleChange} options={ROLE_OPTIONS} />
          <Button type="submit" loading={sending} className="sm:mt-7">
            <Mail className="size-4" aria-hidden />
            Inviter
          </Button>
        </div>
      </form>
    </Card>
  )
}

function CopyLinkButton({ link }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }
  return (
    <button
      onClick={copy}
      className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50"
    >
      {copied ? <Check className="size-4" aria-hidden /> : <Copy className="size-4" aria-hidden />}
      {copied ? 'Copié' : 'Copier le lien'}
    </button>
  )
}

// Page reservee aux administrateurs : membres de l'entreprise, roles et invitations
export default function UsersPage() {
  const { user: currentUser } = useAuth()
  const loadTeam = useCallback(() => Promise.all([usersApi.list(), invitationsApi.list()]), [])
  const { data, loading, error, setData } = useFetch(loadTeam)
  const [feedback, setFeedback] = useState({ type: 'success', text: '' })

  if (loading) return <PageLoader />
  if (error) return <ErrorState message={error} />

  const [users, invitations] = data

  const changeRole = async (user, role) => {
    setFeedback({ type: 'success', text: '' })
    try {
      const updated = await usersApi.updateRole(user.id, role)
      setData([users.map((u) => (u.id === updated.id ? updated : u)), invitations])
      setFeedback({ type: 'success', text: `${fullName(updated)} est maintenant ${ROLE[updated.role].toLowerCase()}.` })
    } catch (err) {
      setFeedback({ type: 'error', text: getErrorMessage(err) })
    }
  }

  const handleInvited = (invitation) => {
    setData([users, [invitation, ...invitations.filter((i) => i.email !== invitation.email)]])
    setFeedback({ type: 'success', text: `Invitation envoyée à ${invitation.email}.` })
  }

  const revoke = async (invitation) => {
    try {
      await invitationsApi.revoke(invitation.id)
      setData([users, invitations.filter((i) => i.id !== invitation.id)])
      setFeedback({ type: 'success', text: `Invitation de ${invitation.email} annulée.` })
    } catch (err) {
      setFeedback({ type: 'error', text: getErrorMessage(err) })
    }
  }

  return (
    <>
      <PageHeader
        title="Équipe"
        description={`Les membres de ${currentUser.organizationName}, leurs rôles et les invitations en attente.`}
      />

      {feedback.text && (
        <div className="mb-6">
          <Alert type={feedback.type}>{feedback.text}</Alert>
        </div>
      )}

      <InviteForm onInvited={handleInvited} />

      {invitations.length > 0 && (
        <Card className="mt-6">
          <h2 className="border-b border-slate-200 px-6 py-4 font-semibold text-slate-900">
            Invitations en attente ({invitations.length})
          </h2>
          <ul className="divide-y divide-slate-100">
            {invitations.map((invitation) => (
              <li key={invitation.id} className="flex flex-wrap items-center gap-3 px-6 py-3.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-900">{invitation.email}</p>
                  <p className={`text-xs ${invitation.expired ? 'font-medium text-red-700' : 'text-slate-500'}`}>
                    {ROLE[invitation.role]} ·{' '}
                    {invitation.expired ? 'Expirée' : `Expire le ${formatDate(invitation.expiresAt)}`}
                  </p>
                </div>
                {!invitation.expired && <CopyLinkButton link={invitation.link} />}
                <button
                  onClick={() => revoke(invitation)}
                  className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                  aria-label={`Annuler l'invitation de ${invitation.email}`}
                >
                  <Trash2 className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card className="mt-6 overflow-x-auto">
        <h2 className="border-b border-slate-200 px-6 py-4 font-semibold text-slate-900">Membres ({users.length})</h2>
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
                    <div>
                      <span className="font-medium whitespace-nowrap text-slate-900">
                        {fullName(user)}
                        {user.id === currentUser.id && <span className="ml-1.5 text-xs font-normal text-slate-500">(vous)</span>}
                      </span>
                      {user.jobTitle && <p className="text-xs text-slate-500">{user.jobTitle}</p>}
                    </div>
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
    </>
  )
}
