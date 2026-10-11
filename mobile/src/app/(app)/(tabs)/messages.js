import Ionicons from '@expo/vector-icons/Ionicons'
import { useRouter } from 'expo-router'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { messagesApi } from '../../../api/resources'
import Avatar from '../../../components/ui/Avatar'
import Screen from '../../../components/ui/Screen'
import Segmented from '../../../components/ui/Segmented'
import { EmptyState, ErrorState, Loader } from '../../../components/ui/States'
import { useFetch } from '../../../hooks/useFetch'
import { radius, useColors } from '../../../theme'
import { formatDateTime, fullName } from '../../../utils/format'
import { rememberMessage } from '../../../utils/messageCache'

function NewMessageButton({ onPress }) {
  const { t } = useTranslation()
  const colors = useColors()
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={t('messages.new')}
      style={({ pressed }) => [styles.newButton, { backgroundColor: pressed ? colors.primaryPressed : colors.primary }]}
    >
      <Ionicons name="create-outline" size={22} color={colors.onPrimary} />
    </Pressable>
  )
}

export default function MessagesScreen() {
  const { t } = useTranslation()
  const colors = useColors()
  const router = useRouter()
  const [folder, setFolder] = useState('inbox')
  const { data: messages, error, loading, refreshing, refresh, reload } = useFetch(() =>
    folder === 'inbox' ? messagesApi.inbox() : messagesApi.sent(),
  )

  // Changement de dossier : rechargement (le premier affichage est deja charge par useFetch)
  const firstRender = useRef(true)
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    reload()
  }, [folder, reload])

  const open = (message) => {
    rememberMessage(message, folder)
    router.push(`/message/${message.id}`)
  }

  return (
    <Screen
      title={t('nav.messages')}
      subtitle={t('messages.description')}
      right={<NewMessageButton onPress={() => router.push('/compose')} />}
      onRefresh={refresh}
      refreshing={refreshing}
    >
      <Segmented
        value={folder}
        onChange={setFolder}
        options={[
          { value: 'inbox', label: t('messages.inbox') },
          { value: 'sent', label: t('messages.sent') },
        ]}
      />
      {loading ? (
        <Loader />
      ) : error && !messages ? (
        <ErrorState message={error} onRetry={reload} />
      ) : messages.length === 0 ? (
        <EmptyState
          icon={folder === 'inbox' ? 'mail-open-outline' : 'paper-plane-outline'}
          title={folder === 'inbox' ? t('messages.emptyInbox') : t('messages.emptySent')}
        />
      ) : (
        <View style={[styles.list, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {messages.map((message, index) => {
            const other = folder === 'inbox' ? message.sender : message.recipient
            const unread = folder === 'inbox' && !message.read
            return (
              <Pressable
                key={message.id}
                onPress={() => open(message)}
                accessibilityRole="button"
                accessibilityLabel={`${unread ? `${t('messages.unread')}, ` : ''}${fullName(other)}, ${message.subject}`}
                style={({ pressed }) => [
                  styles.item,
                  index > 0 && { borderTopWidth: 1, borderTopColor: colors.border },
                  pressed && { backgroundColor: colors.subtle },
                ]}
              >
                <Avatar user={other} />
                <View style={styles.itemMain}>
                  <View style={styles.itemHeader}>
                    <Text style={[styles.name, { color: colors.text }, unread && styles.bold]} numberOfLines={1}>
                      {fullName(other)}
                    </Text>
                    <Text style={[styles.date, { color: colors.muted }]}>{formatDateTime(message.sentAt)}</Text>
                  </View>
                  <View style={styles.subjectRow}>
                    {unread && <View style={[styles.dot, { backgroundColor: colors.primary }]} />}
                    <Text style={[styles.subject, { color: unread ? colors.text : colors.muted }, unread && styles.bold]} numberOfLines={1}>
                      {message.subject}
                    </Text>
                  </View>
                </View>
              </Pressable>
            )
          })}
        </View>
      )}
    </Screen>
  )
}

const styles = StyleSheet.create({
  newButton: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  list: { borderWidth: 1, borderRadius: radius.lg, overflow: 'hidden' },
  item: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  itemMain: { flex: 1, gap: 3 },
  itemHeader: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 },
  name: { flex: 1, fontSize: 15 },
  date: { fontSize: 12 },
  subjectRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  subject: { flex: 1, fontSize: 14 },
  bold: { fontWeight: '700' },
})
