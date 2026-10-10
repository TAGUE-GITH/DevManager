import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, Navigate, useSearchParams } from 'react-router-dom'
import { invitationsPublicApi } from '../api/auth'
import { getErrorMessage, getFieldErrors } from '../api/client'
import AuthLayout from '../components/AuthLayout'
import Alert from '../components/ui/Alert'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { buttonClasses } from '../components/ui/buttonStyles'
import { useAuth } from '../context/useAuth'
import { ROLE } from '../utils/format'

// Page ouverte depuis le lien d'invitation recu par email : /invitation?token=...
export default function AcceptInvitationPage() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const { acceptInvitation } = useAuth()

  const [invitation, setInvitation] = useState(null)
  const [loadError, setLoadError] = useState(token ? '' : "Ce lien d'invitation est incomplet.")
  const [form, setForm] = useState({ firstName: '', lastName: '', password: '', confirmPassword: '' })
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [joined, setJoined] = useState(false)

  useEffect(() => {
    if (!token) return
    invitationsPublicApi
      .get(token)
      .then(setInvitation)
      .catch((err) => setLoadError(getErrorMessage(err)))
  }, [token])

  // Une fois le compte cree, l'utilisateur est connecte : direction l'application
  if (joined) return <Navigate to="/app" replace />

  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value })

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setFieldErrors({})
    if (form.password !== form.confirmPassword) {
      setFieldErrors({ confirmPassword: 'Les mots de passe ne correspondent pas' })
      return
    }
    setSubmitting(true)
    try {
      const { confirmPassword: _, ...data } = form
      await acceptInvitation({ ...data, token })
      setJoined(true)
    } catch (err) {
      setError(getErrorMessage(err))
      setFieldErrors(getFieldErrors(err))
    } finally {
      setSubmitting(false)
    }
  }

  if (loadError) {
    return (
      <AuthLayout title="Invitation invalide">
        <Alert>{loadError} Demandez à votre administrateur de vous envoyer une nouvelle invitation.</Alert>
        <Link to="/" className={buttonClasses('secondary', 'mt-6 w-full')}>
          Retour à l'accueil
        </Link>
      </AuthLayout>
    )
  }

  if (!invitation) {
    return (
      <AuthLayout title="Invitation">
        <div className="flex justify-center py-10">
          <Loader2 className="size-8 animate-spin text-indigo-600" aria-label="Chargement" />
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title={`Rejoindre ${invitation.organizationName}`}
      subtitle={`${invitation.invitedBy} vous invite à rejoindre l'équipe en tant que ${ROLE[invitation.role].toLowerCase()}.`}
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <Alert>{error}</Alert>
        <Input label="Email" value={invitation.email} disabled readOnly />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input
            label="Prénom"
            name="firstName"
            autoComplete="given-name"
            value={form.firstName}
            onChange={handleChange}
            error={fieldErrors.firstName}
            required
          />
          <Input
            label="Nom"
            name="lastName"
            autoComplete="family-name"
            value={form.lastName}
            onChange={handleChange}
            error={fieldErrors.lastName}
            required
          />
        </div>
        <Input
          label="Mot de passe"
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder="8 caractères minimum"
          value={form.password}
          onChange={handleChange}
          error={fieldErrors.password}
          required
        />
        <Input
          label="Confirmer le mot de passe"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={handleChange}
          error={fieldErrors.confirmPassword}
          required
        />
        <Button type="submit" loading={submitting} className="w-full">
          Rejoindre l'équipe
        </Button>
      </form>
    </AuthLayout>
  )
}
