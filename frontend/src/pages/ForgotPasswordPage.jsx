import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { authApi } from '../api/auth'
import { getErrorMessage, getFieldErrors } from '../api/client'
import AuthLayout from '../components/AuthLayout'
import Alert from '../components/ui/Alert'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setFieldErrors({})
    setSubmitting(true)
    try {
      const { message } = await authApi.forgotPassword(email)
      setSuccessMessage(message)
    } catch (err) {
      setError(getErrorMessage(err))
      setFieldErrors(getFieldErrors(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      title="Mot de passe oublié"
      subtitle="Saisissez votre email : nous vous enverrons un lien pour choisir un nouveau mot de passe."
    >
      {successMessage ? (
        <Alert type="success">{successMessage}</Alert>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <Alert>{error}</Alert>
          <Input
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="vous@entreprise.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            error={fieldErrors.email}
            required
          />
          <Button type="submit" loading={submitting} className="w-full">
            Envoyer le lien
          </Button>
        </form>
      )}
      <Link
        to="/login"
        className="mt-8 flex items-center justify-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Retour à la connexion
      </Link>
    </AuthLayout>
  )
}
