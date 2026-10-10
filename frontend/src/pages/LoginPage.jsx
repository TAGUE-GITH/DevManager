import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { getErrorMessage, getFieldErrors } from '../api/client'
import AuthLayout from '../components/AuthLayout'
import DemoDivider from '../components/DemoDivider'
import Alert from '../components/ui/Alert'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { useAuth } from '../context/useAuth'

export default function LoginPage() {
  const { t } = useTranslation()
  const { login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value })

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setFieldErrors({})
    setSubmitting(true)
    try {
      // La redirection apres connexion est faite par PublicOnlyRoute
      await login(form)
    } catch (err) {
      setError(getErrorMessage(err))
      setFieldErrors(getFieldErrors(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout title={t('auth.login.title')} subtitle={t('auth.login.subtitle')}>
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <Alert>{error}</Alert>
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
        <div>
          <Input
            label={t('fields.password')}
            name="password"
            type="password"
            autoComplete="current-password"
            value={form.password}
            onChange={handleChange}
            error={fieldErrors.password}
            required
          />
          <Link
            to="/forgot-password"
            className="mt-2 inline-block text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            {t('auth.login.forgot')}
          </Link>
        </div>
        <Button type="submit" loading={submitting} className="w-full">
          {t('auth.login.submit')}
        </Button>
      </form>
      <DemoDivider />
      <p className="mt-8 text-center text-sm text-slate-600">
        {t('auth.login.noAccount')}{' '}
        <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500">
          {t('auth.login.createAccount')}
        </Link>
      </p>
    </AuthLayout>
  )
}
