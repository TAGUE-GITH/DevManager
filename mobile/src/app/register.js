import { Link } from 'expo-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, View } from 'react-native'
import { getErrorMessage, getFieldErrors } from '../api/client'
import AuthScreen from '../components/AuthScreen'
import Button from '../components/Button'
import Notice from '../components/Notice'
import TextField from '../components/TextField'
import { useAuth } from '../context/AuthProvider'
import { useColors } from '../theme'

export default function RegisterScreen() {
  const { t } = useTranslation()
  const colors = useColors()
  const { register } = useAuth()
  const [form, setForm] = useState({
    companyName: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const field = (name) => ({
    value: form[name],
    onChangeText: (value) => setForm({ ...form, [name]: value }),
    error: fieldErrors[name],
  })

  const submit = async () => {
    setError('')
    setFieldErrors({})
    if (form.password !== form.confirmPassword) {
      setFieldErrors({ confirmPassword: t('fields.passwordMismatch') })
      return
    }
    setSubmitting(true)
    try {
      const { confirmPassword: _, ...data } = form
      await register(data)
    } catch (err) {
      setError(getErrorMessage(err))
      setFieldErrors(getFieldErrors(err))
      setSubmitting(false)
    }
  }

  return (
    <AuthScreen title={t('auth.register.title')} subtitle={t('auth.register.subtitle')}>
      <Notice>{error}</Notice>
      <TextField label={t('fields.companyName')} placeholder={t('fields.companyPlaceholder')} {...field('companyName')} />
      <View style={styles.row}>
        <TextField
          label={t('fields.firstName')}
          autoComplete="given-name"
          style={styles.half}
          {...field('firstName')}
        />
        <TextField label={t('fields.lastName')} autoComplete="family-name" style={styles.half} {...field('lastName')} />
      </View>
      <TextField
        label={t('fields.email')}
        placeholder={t('fields.emailPlaceholder')}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        {...field('email')}
      />
      <TextField
        label={t('fields.password')}
        placeholder={t('fields.passwordPlaceholder')}
        secureTextEntry
        autoComplete="new-password"
        {...field('password')}
      />
      <TextField label={t('fields.confirmPassword')} secureTextEntry autoComplete="new-password" {...field('confirmPassword')} />
      <Button title={t('auth.register.submit')} loading={submitting} onPress={submit} />
      <Text style={[styles.footer, { color: colors.textSecondary }]}>
        {t('auth.register.hasAccount')}{' '}
        <Link href="/login" style={[styles.link, { color: colors.primary }]}>
          {t('auth.login.submit')}
        </Link>
      </Text>
    </AuthScreen>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12 },
  half: { flex: 1 },
  link: { fontWeight: '600' },
  footer: { fontSize: 14, textAlign: 'center', marginTop: 8 },
})
