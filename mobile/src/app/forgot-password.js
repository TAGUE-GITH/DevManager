import { Link } from 'expo-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'
import { authApi } from '../api/auth'
import { getErrorMessage, getFieldErrors } from '../api/client'
import AuthScreen from '../components/AuthScreen'
import Button from '../components/Button'
import Notice from '../components/Notice'
import TextField from '../components/TextField'
import { useColors } from '../theme'

// Le lien recu par email ouvre la page de reinitialisation du site web
export default function ForgotPasswordScreen() {
  const { t } = useTranslation()
  const colors = useColors()
  const [email, setEmail] = useState('')
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [fieldError, setFieldError] = useState('')
  const [sending, setSending] = useState(false)

  const submit = async () => {
    setError('')
    setFieldError('')
    setSending(true)
    try {
      const { message } = await authApi.forgotPassword(email)
      setSuccess(message)
    } catch (err) {
      setError(getErrorMessage(err))
      setFieldError(getFieldErrors(err).email)
    } finally {
      setSending(false)
    }
  }

  return (
    <AuthScreen title={t('auth.forgot.title')} subtitle={t('auth.forgot.subtitle')}>
      {success ? (
        <Notice type="success">{success}</Notice>
      ) : (
        <>
          <Notice>{error}</Notice>
          <TextField
            label={t('fields.email')}
            placeholder={t('fields.emailPlaceholder')}
            value={email}
            onChangeText={setEmail}
            error={fieldError}
            autoCapitalize="none"
            autoComplete="email"
            keyboardType="email-address"
          />
          <Button title={t('auth.forgot.submit')} loading={sending} onPress={submit} />
        </>
      )}
      <Link href="/login" style={[styles.link, { color: colors.primary }]}>
        {t('auth.forgot.back')}
      </Link>
    </AuthScreen>
  )
}

const styles = StyleSheet.create({
  link: { fontWeight: '600', fontSize: 14, textAlign: 'center', marginTop: 8 },
})
