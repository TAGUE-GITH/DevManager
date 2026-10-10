import { useState } from 'react'
import { getErrorMessage, getFieldErrors } from '../api/client'
import { profileApi } from '../api/resources'
import ImageUploader from '../components/ImageUploader'
import ThemeToggle from '../components/ThemeToggle'
import Alert from '../components/ui/Alert'
import Avatar from '../components/ui/Avatar'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import PageHeader from '../components/ui/PageHeader'
import { useAuth } from '../context/useAuth'
import { ROLE } from '../utils/format'

// Petit hook de formulaire : valeurs, validation locale, envoi et message de confirmation
function useForm(initial, submit, validate = () => ({})) {
  const [values, setValues] = useState(initial)
  const [errors, setErrors] = useState({})
  const [feedback, setFeedback] = useState({ type: 'success', text: '' })
  const [saving, setSaving] = useState(false)

  const onChange = (event) => setValues({ ...values, [event.target.name]: event.target.value })
  const onSubmit = async (event) => {
    event.preventDefault()
    setErrors({})
    setFeedback({ type: 'success', text: '' })
    const localErrors = validate(values)
    if (Object.keys(localErrors).length > 0) {
      setErrors(localErrors)
      return
    }
    setSaving(true)
    try {
      setFeedback({ type: 'success', text: await submit(values, setValues) })
    } catch (err) {
      setErrors(getFieldErrors(err))
      setFeedback({ type: 'error', text: getErrorMessage(err) })
    } finally {
      setSaving(false)
    }
  }
  return { values, errors, feedback, saving, onChange, onSubmit }
}

function ProfileForm() {
  const { user, refreshUser } = useAuth()
  const form = useForm(
    { firstName: user.firstName, lastName: user.lastName, jobTitle: user.jobTitle ?? '' },
    async (values) => {
      await profileApi.update(values)
      await refreshUser()
      return 'Votre profil a été mis à jour.'
    },
  )

  return (
    <Card className="p-6">
      <h2 className="font-semibold text-slate-900">Informations</h2>
      <form onSubmit={form.onSubmit} className="mt-5 space-y-5" noValidate>
        <Alert type={form.feedback.type}>{form.feedback.text}</Alert>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input label="Prénom" name="firstName" value={form.values.firstName} onChange={form.onChange} error={form.errors.firstName} required />
          <Input label="Nom" name="lastName" value={form.values.lastName} onChange={form.onChange} error={form.errors.lastName} required />
        </div>
        <Input
          label="Poste"
          name="jobTitle"
          placeholder="Ex. Chef de projet"
          value={form.values.jobTitle}
          onChange={form.onChange}
          error={form.errors.jobTitle}
        />
        <Input label="Email" value={user.email} disabled readOnly />
        <div className="flex justify-end">
          <Button type="submit" loading={form.saving}>
            Enregistrer
          </Button>
        </div>
      </form>
    </Card>
  )
}

function PasswordForm() {
  const { user } = useAuth()
  const form = useForm(
    { currentPassword: '', newPassword: '', confirmPassword: '' },
    async (values, setValues) => {
      await profileApi.changePassword({ currentPassword: values.currentPassword, newPassword: values.newPassword })
      setValues({ currentPassword: '', newPassword: '', confirmPassword: '' })
      return 'Votre mot de passe a été modifié.'
    },
    (values) =>
      values.newPassword === values.confirmPassword ? {} : { confirmPassword: 'Les mots de passe ne correspondent pas' },
  )

  if (user.demo) {
    return (
      <Card className="p-6">
        <h2 className="font-semibold text-slate-900">Mot de passe</h2>
        <p className="mt-2 text-sm text-slate-500">Le mot de passe du compte de démonstration ne peut pas être modifié.</p>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <h2 className="font-semibold text-slate-900">Mot de passe</h2>
      <form onSubmit={form.onSubmit} className="mt-5 space-y-5" noValidate>
        <Alert type={form.feedback.type}>{form.feedback.text}</Alert>
        <Input
          label="Mot de passe actuel"
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          value={form.values.currentPassword}
          onChange={form.onChange}
          error={form.errors.currentPassword}
          required
        />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input
            label="Nouveau mot de passe"
            name="newPassword"
            type="password"
            autoComplete="new-password"
            placeholder="8 caractères minimum"
            value={form.values.newPassword}
            onChange={form.onChange}
            error={form.errors.newPassword}
            required
          />
          <Input
            label="Confirmer"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={form.values.confirmPassword}
            onChange={form.onChange}
            error={form.errors.confirmPassword}
            required
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit" loading={form.saving}>
            Changer le mot de passe
          </Button>
        </div>
      </form>
    </Card>
  )
}

export default function ProfilePage() {
  const { user, refreshUser } = useAuth()

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Mon profil" description="Votre photo, vos informations et vos préférences." />

      <div className="space-y-6">
        <Card className="p-6">
          <ImageUploader
            preview={<Avatar user={user} size="xl" />}
            label="Photo de profil"
            hint="Elle apparaît dans les projets, les tâches et la messagerie. Format carré conseillé."
            hasImage={Boolean(user.avatarUrl)}
            disabledReason={user.demo ? 'Les photos sont désactivées dans le compte de démonstration.' : undefined}
            onUpload={async (dataUrl) => {
              await profileApi.updateAvatar(dataUrl)
              await refreshUser()
            }}
            onRemove={async () => {
              await profileApi.removeAvatar()
              await refreshUser()
            }}
          />
          <dl className="mt-6 grid grid-cols-1 gap-4 border-t border-slate-100 pt-5 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-slate-500">Rôle</dt>
              <dd className="mt-0.5 font-medium text-slate-900">{ROLE[user.role]}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Entreprise</dt>
              <dd className="mt-0.5 font-medium text-slate-900">{user.organizationName}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Poste</dt>
              <dd className="mt-0.5 font-medium text-slate-900">{user.jobTitle || '—'}</dd>
            </div>
          </dl>
        </Card>

        <ProfileForm />
        <PasswordForm />

        <Card className="p-6">
          <h2 className="font-semibold text-slate-900">Apparence</h2>
          <p className="mt-1 text-sm text-slate-500">Thème clair, sombre ou identique à celui de votre appareil.</p>
          <ThemeToggle className="mt-4 max-w-xs" />
        </Card>
      </div>
    </div>
  )
}
