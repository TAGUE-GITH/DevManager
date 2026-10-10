import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, Navigate, useSearchParams } from 'react-router-dom'
import { invitationsPublicApi } from '../api/auth'
import { getErrorMessage, getFieldErrors } from '../api/client'
import AuthLayout from '../components/AuthLayout'
import Alert from '../components/ui/Alert'
import Button from '../components/ui/Button'
import { buttonClasses } from '../components/ui/buttonStyles'
import Input from '../components/ui/Input'
import { useAuth } from '../context/useAuth'
import { ROLE } from '../utils/format'

// Page ouverte depuis le lien d'invitation recu par email : /invitation?token=...
export default function AcceptInvitationPage() {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const { acceptInvitation } = useAuth()

  const [invitation, setInvitation] = useState(null)
  const [loadError, setLoadError] = useState(token ? '' : t('auth.invitation.incomplete'))
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
  })
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
      setFieldErrors({ confirmPassword: t('fields.passwordMismatch') })
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
      <AuthLayout title={t('auth.invitation.invalidTitle')}>
        <Alert>
          {loadError} {t('auth.invitation.askAgain')}
        </Alert>
        <Link to="/" className={buttonClasses('secondary', 'mt-6 w-full')}>
          {t('common.backHome')}
        </Link>
      </AuthLayout>
    )
  }

  if (!invitation) {
    return (
      <AuthLayout title={t('auth.invitation.loadingTitle')}>
        <div className="flex justify-center py-10">
          <Loader2 className="size-8 animate-spin text-indigo-600" aria-label={t('common.loading')} />
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title={t('auth.invitation.title', {
        company: invitation.organizationName,
      })}
      subtitle={t('auth.invitation.subtitle', {
        name: invitation.invitedBy,
        role: ROLE[invitation.role].toLowerCase(),
      })}
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <Alert>{error}</Alert>
        <Input label={t('fields.email')} value={invitation.email} disabled readOnly />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input
            label={t('fields.firstName')}
            name="firstName"
            autoComplete="given-name"
            value={form.firstName}
            onChange={handleChange}
            error={fieldErrors.firstName}
            required
          />
          <Input
            label={t('fields.lastName')}
            name="lastName"
            autoComplete="family-name"
            value={form.lastName}
            onChange={handleChange}
            error={fieldErrors.lastName}
            required
          />
        </div>
        <Input
          label={t('fields.password')}
          name="password"
          type="password"
          autoComplete="new-password"
          placeholder={t('fields.passwordPlaceholder')}
          value={form.password}
          onChange={handleChange}
          error={fieldErrors.password}
          required
        />
        <Input
          label={t('fields.confirmPassword')}
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={handleChange}
          error={fieldErrors.confirmPassword}
          required
        />
        <Button type="submit" loading={submitting} className="w-full">
          {t('auth.invitation.submit')}
        </Button>
      </form>
    </AuthLayout>
  )
}
