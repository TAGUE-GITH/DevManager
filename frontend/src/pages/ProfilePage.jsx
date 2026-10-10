import { useState } from 'react'
import { getErrorMessage, getFieldErrors } from '../api/client'
import { profileApi } from '../api/resources'
import ImageUploader from '../components/ImageUploader'
import LanguageSwitcher from '../components/LanguageSwitcher'
import ThemeToggle from '../components/ThemeToggle'
import Alert from '../components/ui/Alert'
import Avatar from '../components/ui/Avatar'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import PageHeader from '../components/ui/PageHeader'
import { useAuth } from '../context/useAuth'
import { ROLE } from '../utils/format'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()
  const { user, refreshUser } = useAuth()
  const form = useForm(
    { firstName: user.firstName, lastName: user.lastName, jobTitle: user.jobTitle ?? '' },
    async (values) => {
      await profileApi.update(values)
      await refreshUser()
      return t('profile.updated')
    },
  )

  return (
    <Card className="p-6">
      <h2 className="font-semibold text-slate-900">{t('profile.info')}</h2>
      <form onSubmit={form.onSubmit} className="mt-5 space-y-5" noValidate>
        <Alert type={form.feedback.type}>{form.feedback.text}</Alert>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Input label={t('fields.firstName')} name="firstName" value={form.values.firstName} onChange={form.onChange} error={form.errors.firstName} required />
          <Input label={t('fields.lastName')} name="lastName" value={form.values.lastName} onChange={form.onChange} error={form.errors.lastName} required />
        </div>
        <Input
          label={t('profile.jobTitle')}
          name="jobTitle"
          placeholder={t('profile.jobTitlePlaceholder')}
          value={form.values.jobTitle}
          onChange={form.onChange}
          error={form.errors.jobTitle}
        />
        <Input label={t('fields.email')} value={user.email} disabled readOnly />
        <div className="flex justify-end">
          <Button type="submit" loading={form.saving}>
            {t('common.save')}
          </Button>
        </div>
      </form>
    </Card>
  )
}

function PasswordForm() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const form = useForm(
    { currentPassword: '', newPassword: '', confirmPassword: '' },
    async (values, setValues) => {
      await profileApi.changePassword({ currentPassword: values.currentPassword, newPassword: values.newPassword })
      setValues({ currentPassword: '', newPassword: '', confirmPassword: '' })
      return t('profile.passwordChanged')
    },
    (values) =>
      values.newPassword === values.confirmPassword ? {} : { confirmPassword: t('fields.passwordMismatch') },
  )

  if (user.demo) {
    return (
      <Card className="p-6">
        <h2 className="font-semibold text-slate-900">{t('fields.password')}</h2>
        <p className="mt-2 text-sm text-slate-500">{t('profile.passwordDemo')}</p>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <h2 className="font-semibold text-slate-900">{t('fields.password')}</h2>
      <form onSubmit={form.onSubmit} className="mt-5 space-y-5" noValidate>
        <Alert type={form.feedback.type}>{form.feedback.text}</Alert>
        <Input
          label={t('profile.currentPassword')}
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
            label={t('fields.newPassword')}
            name="newPassword"
            type="password"
            autoComplete="new-password"
            placeholder={t('fields.passwordPlaceholder')}
            value={form.values.newPassword}
            onChange={form.onChange}
            error={form.errors.newPassword}
            required
          />
          <Input
            label={t('profile.confirm')}
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
            {t('profile.changePassword')}
          </Button>
        </div>
      </form>
    </Card>
  )
}

export default function ProfilePage() {
  const { t } = useTranslation()
  const { user, refreshUser } = useAuth()

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title={t('nav.profile')} description={t('profile.description')} />

      <div className="space-y-6">
        <Card className="p-6">
          <ImageUploader
            preview={<Avatar user={user} size="xl" />}
            label={t('profile.photo')}
            hint={t('profile.photoHint')}
            hasImage={Boolean(user.avatarUrl)}
            disabledReason={user.demo ? t('profile.photoDemo') : undefined}
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
              <dt className="text-slate-500">{t('users.role')}</dt>
              <dd className="mt-0.5 font-medium text-slate-900">{ROLE[user.role]}</dd>
            </div>
            <div>
              <dt className="text-slate-500">{t('nav.company')}</dt>
              <dd className="mt-0.5 font-medium text-slate-900">{user.organizationName}</dd>
            </div>
            <div>
              <dt className="text-slate-500">{t('profile.jobTitle')}</dt>
              <dd className="mt-0.5 font-medium text-slate-900">{user.jobTitle || '—'}</dd>
            </div>
          </dl>
        </Card>

        <ProfileForm />
        <PasswordForm />

        <Card className="p-6">
          <h2 className="font-semibold text-slate-900">{t('profile.appearance')}</h2>
          <p className="mt-1 text-sm text-slate-500">{t('profile.appearanceHint')}</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <ThemeToggle className="w-full max-w-xs" />
            <LanguageSwitcher className="w-28" />
          </div>
        </Card>
      </div>
    </div>
  )
}
