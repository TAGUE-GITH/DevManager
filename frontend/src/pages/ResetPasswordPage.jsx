import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { authApi } from '../api/auth'
import { getErrorMessage, getFieldErrors } from '../api/client'
import AuthLayout from '../components/AuthLayout'
import Alert from '../components/ui/Alert'
import Button from '../components/ui/Button'
import { buttonClasses } from '../components/ui/buttonStyles'
import Input from '../components/ui/Input'

export default function ResetPasswordPage() {
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
      setFieldErrors({ confirmPassword: 'Les mots de passe ne correspondent pas' })
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
      <AuthLayout title="Lien invalide">
        <Alert>Ce lien de réinitialisation est incomplet. Veuillez refaire une demande.</Alert>
        <Link to="/forgot-password" className={buttonClasses('primary', 'mt-6 w-full')}>
          Nouvelle demande
        </Link>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout title="Nouveau mot de passe" subtitle="Choisissez un mot de passe d'au moins 8 caractères.">
      {done ? (
        <div className="space-y-6">
          <Alert type="success">Votre mot de passe a été modifié. Vous pouvez maintenant vous connecter.</Alert>
          <Link to="/login" className={buttonClasses('primary', 'w-full')}>
            Se connecter
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
                  Refaire une demande
                </Link>
              </>
            )}
          </Alert>
          <Input
            label="Nouveau mot de passe"
            name="newPassword"
            type="password"
            autoComplete="new-password"
            value={form.newPassword}
            onChange={handleChange}
            error={fieldErrors.newPassword}
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
            Enregistrer
          </Button>
        </form>
      )}
    </AuthLayout>
  )
}
