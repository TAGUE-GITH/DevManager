import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useSearchParams } from 'react-router-dom'
import { authApi } from '../api/auth'
import { getErrorMessage, getFieldErrors } from '../api/client'
import AuthLayout from '../components/AuthLayout'
import Alert from '../components/ui/Alert'
import Button from '../components/ui/Button'
import { buttonClasses } from '../components/ui/buttonStyles'
import Input from '../components/ui/Input'

export default function ResetPasswordPage() {
  const { t } = useTranslation()
  // Le jeton arrive dans le lien recu par email : /reset-password?token=...
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')

  const [form, setForm] = useState({ newPassword: '', confirmPassword: '' })
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (event) => setForm({ ...form, [event.target.name]: event.target.value })

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setFieldErrors({})

    if (form.newPassword !== form.confirmPassword) {
      setFieldErrors({ confirmPassword: t('fields.passwordMismatch') })
      return
    }

    setSubmitting(true)
    try {
      await authApi.resetPassword(token, form.newPassword)
      setDone(true)
    } catch (err) {
      setError(getErrorMessage(err))
      setFieldErrors(getFieldErrors(err))
    } finally {
      setSubmitting(false)
    }
  }

  if (!token) {
    return (
      <AuthLayout title={t('auth.reset.invalidTitle')}>
        <Alert>{t('auth.reset.incomplete')}</Alert>
        <Link to="/forgot-password" className={buttonClasses('primary', 'mt-6 w-full')}>
          {t('auth.reset.newRequest')}
        </Link>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title={t('auth.reset.title')} subtitle={t('auth.reset.subtitle')}>
      {done ? (
        <div className="space-y-6">
          <Alert type="success">{t('auth.reset.done')}</Alert>
          <Link to="/login" className={buttonClasses('primary', 'w-full')}>
            {t('auth.login.submit')}
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <Alert>
            {error}
            {error && (
              <>
                {' '}
                <Link to="/forgot-password" className="font-semibold underline">
                  {t('auth.reset.retry')}
                </Link>
              </>
            )}
          </Alert>
          <Input
            label={t('fields.newPassword')}
            name="newPassword"
            type="password"
            autoComplete="new-password"
            value={form.newPassword}
            onChange={handleChange}
            error={fieldErrors.newPassword}
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
            {t('common.save')}
          </Button>
        </form>
      )}
    </AuthLayout>
  )
}
