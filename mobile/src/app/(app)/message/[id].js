import { Redirect, useLocalSearchParams, useRouter } from 'expo-router'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, View } from 'react-native'
import { messagesApi } from '../../../api/resources'
import Button from '../../../components/Button'
import Avatar from '../../../components/ui/Avatar'
import Card from '../../../components/ui/Card'
import Screen from '../../../components/ui/Screen'
import { useColors } from '../../../theme'
import { notifyMessagesChanged } from '../../../utils/events'
import { formatDateTime, fullName } from '../../../utils/format'
import { recallMessage } from '../../../utils/messageCache'

export default function MessageScreen() {
  const { id } = useLocalSearchParams()
  const { t } = useTranslation()
  const colors = useColors()
  const router = useRouter()
  const entry = recallMessage(id)

  // Ouvrir un message recu non lu le marque comme lu (et met a jour le compteur de l'onglet)
  useEffect(() => {
    if (entry?.folder === 'inbox' && !entry.message.read) {
      messagesApi
        .markAsRead(entry.message.id)
        .then(notifyMessagesChanged)
        .catch(() => {})
    }
  }, [entry])

  // Ecran ouvert sans passer par la liste (ex. application relancee) : retour a la messagerie
  if (!entry) return <Redirect href="/messages" />

  const { message, folder } = entry
  const other = folder === 'inbox' ? message.sender : message.recipient
  const reply = () =>
    router.push({
      pathname: '/compose',
      params: {
        recipientId: String(message.sender.id),
        subject: message.subject.startsWith('RE :') ? message.subject : `RE : ${message.subject}`,
      },
    })

  return (
    <Screen edges={[]}>
      <Card style={styles.card}>
        <Text style={[styles.subject, { color: colors.text }]}>{message.subject}</Text>
        <View style={[styles.from, { borderBottomColor: colors.border }]}>
          <Avatar user={other} />
          <View style={styles.fromText}>
            <Text style={[styles.name, { color: colors.text }]}>
              {folder === 'inbox' ? t('messages.from', { name: fullName(other) }) : t('messages.to', { name: fullName(other) })}
            </Text>
            <Text style={[styles.date, { color: colors.muted }]}>{formatDateTime(message.sentAt)}</Text>
          </View>
        </View>
        <Text style={[styles.content, { color: colors.textSecondary }]} selectable>
          {message.content}
        </Text>
      </Card>
      {folder === 'inbox' && <Button title={t('messages.reply')} onPress={reply} />}
    </Screen>
  )
}

const styles = StyleSheet.create({
  card: { gap: 14 },
  subject: { fontSize: 20, fontWeight: '800' },
  from: { flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1, paddingBottom: 14 },
  fromText: { flex: 1, gap: 2 },
  name: { fontSize: 15, fontWeight: '600' },
  date: { fontSize: 12 },
  content: { fontSize: 15, lineHeight: 23 },
})
