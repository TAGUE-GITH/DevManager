import Ionicons from '@expo/vector-icons/Ionicons'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { getErrorMessage, getFieldErrors } from '../../api/client'
import { messagesApi, usersApi } from '../../api/resources'
import Button from '../../components/Button'
import Notice from '../../components/Notice'
import TextField from '../../components/TextField'
import OptionSheet from '../../components/ui/OptionSheet'
import Screen from '../../components/ui/Screen'
import { useAuth } from '../../context/AuthProvider'
import { radius, useColors } from '../../theme'
import { notifyMessagesChanged } from '../../utils/events'
import { fullName } from '../../utils/format'

// Nouveau message ; recipientId et subject pre-remplissent une reponse
export default function ComposeScreen() {
  const params = useLocalSearchParams()
  const { t } = useTranslation()
  const colors = useColors()
  const router = useRouter()
  const { user } = useAuth()
  const [recipients, setRecipients] = useState([])
  const [form, setForm] = useState({
    recipientId: params.recipientId ? Number(params.recipientId) : null,
    subject: params.subject ?? '',
    content: '',
  })
  const [pickerOpen, setPickerOpen] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [sending, setSending] = useState(false)

  useEffect(() => {
    usersApi
      .list()
      .then((users) => setRecipients(users.filter((member) => member.id !== user.id)))
      .catch((err) => setError(getErrorMessage(err)))
  }, [user.id])

  const recipient = recipients.find((member) => member.id === form.recipientId)

  const send = async () => {
    setError('')
    setFieldErrors({})
    setSending(true)
    try {
      await messagesApi.send(form)
      notifyMessagesChanged()
      router.back()
    } catch (err) {
      setError(getErrorMessage(err))
      setFieldErrors(getFieldErrors(err))
      setSending(false)
    }
  }

  return (
    <Screen edges={['bottom']}>
      <Notice>{error}</Notice>
      <View style={styles.field}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>{t('messages.recipient')}</Text>
        <Pressable
          onPress={() => setPickerOpen(true)}
          accessibilityRole="button"
          accessibilityLabel={`${t('messages.recipient')} : ${recipient ? fullName(recipient) : t('messages.chooseRecipient')}`}
          style={[
            styles.picker,
            { backgroundColor: colors.card, borderColor: fieldErrors.recipientId ? colors.danger : colors.inputBorder },
          ]}
        >
          <Text style={{ color: recipient ? colors.text : colors.muted, fontSize: 16 }}>
            {recipient ? fullName(recipient) : t('messages.chooseRecipient')}
          </Text>
          <Ionicons name="chevron-down" size={18} color={colors.muted} />
        </Pressable>
        {fieldErrors.recipientId ? <Text style={[styles.error, { color: colors.danger }]}>{fieldErrors.recipientId}</Text> : null}
      </View>
      <TextField
        label={t('messages.subject')}
        value={form.subject}
        onChangeText={(subject) => setForm({ ...form, subject })}
        error={fieldErrors.subject}
      />
      <TextField
        label={t('messages.message')}
        value={form.content}
        onChangeText={(content) => setForm({ ...form, content })}
        error={fieldErrors.content}
        multiline
        textAlignVertical="top"
        inputStyle={styles.content}
      />
      <Button title={t('messages.send')} loading={sending} onPress={send} />
      <OptionSheet
        visible={pickerOpen}
        title={t('messages.chooseRecipient')}
        selected={form.recipientId}
        options={recipients.map((member) => ({ value: member.id, label: fullName(member) }))}
        onClose={() => setPickerOpen(false)}
        onSelect={(recipientId) => {
          setForm({ ...form, recipientId })
          setPickerOpen(false)
        }}
      />
    </Screen>
  )
}

const styles = StyleSheet.create({
  field: { gap: 6 },
  label: { fontSize: 14, fontWeight: '500' },
  picker: { minHeight: 48, borderWidth: 1, borderRadius: radius.md, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  error: { fontSize: 13 },
  content: { minHeight: 160, paddingTop: 12 },
})
