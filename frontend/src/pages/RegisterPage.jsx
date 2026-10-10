import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getErrorMessage, getFieldErrors } from '../api/client'
import AuthLayout from '../components/AuthLayout'
import Alert from '../components/ui/Alert'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { useAuth } from '../context/useAuth'

const EMPTY_FORM = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' }

export default function RegisterPage() {
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
      setFieldErrors({ confirmPassword: 'Les mots de passe ne correspondent pas' })
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
    <AuthLayout title="Créer un compte" subtitle="Rejoignez l'espace de travail de votre équipe.">
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <Alert>{error}</Alert>
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
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="vous@entreprise.com"
          value={form.email}
          onChange={handleChange}
          error={fieldErrors.email}
          required
        />
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
          Créer mon compte
        </Button>
      </form>
      <p className="mt-8 text-center text-sm text-slate-600">
        Déjà inscrit ?{' '}
        <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500">
          Se connecter
        </Link>
      </p>
    </AuthLayout>
  )
}
