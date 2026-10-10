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

export default function LoginScreen() {
  const { t } = useTranslation()
  const colors = useColors()
  const { login, loginDemo } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [pending, setPending] = useState(null) // 'login' ou 'demo'

  const run = async (kind, action) => {
    setError('')
    setFieldErrors({})
    setPending(kind)
    try {
      await action()
    } catch (err) {
      setError(getErrorMessage(err))
      setFieldErrors(getFieldErrors(err))
      setPending(null)
    }
  }

  return (
    <AuthScreen title={t('auth.login.title')} subtitle={t('auth.login.subtitle')}>
      <Notice>{error}</Notice>
      <TextField
        label={t('fields.email')}
        placeholder={t('fields.emailPlaceholder')}
        value={form.email}
        onChangeText={(email) => setForm({ ...form, email })}
        error={fieldErrors.email}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        textContentType="emailAddress"
      />
      <View>
        <TextField
          label={t('fields.password')}
          value={form.password}
          onChangeText={(password) => setForm({ ...form, password })}
          error={fieldErrors.password}
          secureTextEntry
          autoComplete="current-password"
          textContentType="password"
          onSubmitEditing={() => run('login', () => login(form))}
        />
        <Link href="/forgot-password" style={[styles.link, styles.forgot, { color: colors.primary }]}>
          {t('auth.login.forgot')}
        </Link>
      </View>
      <Button
        title={t('auth.login.submit')}
        loading={pending === 'login'}
        disabled={pending !== null}
        onPress={() => run('login', () => login(form))}
      />

      <View style={styles.divider}>
        <View style={[styles.line, { backgroundColor: colors.border }]} />
        <Text style={{ color: colors.muted }}>{t('common.or')}</Text>
        <View style={[styles.line, { backgroundColor: colors.border }]} />
      </View>

      <Button
        variant="secondary"
        title={pending === 'demo' ? t('demo.preparing') : t('demo.try')}
        loading={pending === 'demo'}
        disabled={pending !== null}
        onPress={() => run('demo', loginDemo)}
      />
      {pending && <Text style={[styles.hint, { color: colors.muted }]}>{t('auth.wakeUp')}</Text>}

      <Text style={[styles.footer, { color: colors.textSecondary }]}>
        {t('auth.login.noAccount')}{' '}
        <Link href="/register" style={[styles.link, { color: colors.primary }]}>
          {t('auth.login.createAccount')}
        </Link>
      </Text>
    </AuthScreen>
  )
}

const styles = StyleSheet.create({
  link: { fontWeight: '600', fontSize: 14 },
  forgot: { marginTop: 10, alignSelf: 'flex-start' },
  divider: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  line: { flex: 1, height: 1 },
  hint: { fontSize: 13, textAlign: 'center', lineHeight: 18 },
  footer: { fontSize: 14, textAlign: 'center', marginTop: 8 },
})
