import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { getErrorMessage, getFieldErrors } from '../api/client'
import AuthLayout from '../components/AuthLayout'
import DemoDivider from '../components/DemoDivider'
import Alert from '../components/ui/Alert'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { useAuth } from '../context/useAuth'

const EMPTY_FORM = {
  companyName: '',
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
}

export default function RegisterPage() {
  const { t } = useTranslation()
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value })

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setFieldErrors({})

    // Verification faite cote client : le backend ne recoit qu'un seul mot de passe
    if (form.password !== form.confirmPassword) {
      setFieldErrors({ confirmPassword: t('fields.passwordMismatch') })
      return
    }

    setSubmitting(true)
    try {
      const { confirmPassword: _, ...data } = form
      await register(data)
      navigate('/app', { replace: true })
    } catch (err) {
      setError(getErrorMessage(err))
      setFieldErrors(getFieldErrors(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout title={t('auth.register.title')} subtitle={t('auth.register.subtitle')}>
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <Alert>{error}</Alert>
        <Input
          label={t('fields.companyName')}
          name="companyName"
          autoComplete="organization"
          placeholder={t('fields.companyPlaceholder')}
          value={form.companyName}
          onChange={handleChange}
          error={fieldErrors.companyName}
          required
        />
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
          label={t('fields.email')}
          name="email"
          type="email"
          autoComplete="email"
          placeholder={t('fields.emailPlaceholder')}
          value={form.email}
          onChange={handleChange}
          error={fieldErrors.email}
          required
        />
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
          {t('auth.register.submit')}
        </Button>
      </form>
      <DemoDivider />
      <p className="mt-8 text-center text-sm text-slate-600">
        {t('auth.register.hasAccount')}{' '}
        <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
          {t('auth.login.submit')}
        </Link>
      </p>
    </AuthLayout>
  )
}
