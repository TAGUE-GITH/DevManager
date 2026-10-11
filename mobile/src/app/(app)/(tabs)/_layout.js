import Ionicons from '@expo/vector-icons/Ionicons'
import { Tabs, useFocusEffect } from 'expo-router'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { messagesApi } from '../../../api/resources'
import { useColors } from '../../../theme'
import { onMessagesChanged } from '../../../utils/events'

// Icone pleine pour l'onglet actif, en contour pour les autres
const icon = (name) => {
  const TabIcon = ({ color, focused, size }) => <Ionicons name={focused ? name : `${name}-outline`} size={size} color={color} />
  return TabIcon
}

// Barre d'onglets : tableau de bord, projets, mes taches, messagerie, profil
export default function TabsLayout() {
  const { t } = useTranslation()
  const colors = useColors()
  const [unread, setUnread] = useState(0)

  // Compteur de messages non lus : au retour sur les onglets, et apres lecture ou envoi d'un message
  const refreshUnread = useCallback(() => {
    messagesApi.unreadCount().then(setUnread).catch(() => {})
  }, [])
  useFocusEffect(refreshUnread)
  useEffect(() => onMessagesChanged(refreshUnread), [refreshUnread])

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.border },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen name="dashboard" options={{ title: t('tabs.home'), tabBarIcon: icon('grid') }} />
      <Tabs.Screen name="projects" options={{ title: t('tabs.projects'), tabBarIcon: icon('folder') }} />
      <Tabs.Screen name="tasks" options={{ title: t('tabs.tasks'), tabBarIcon: icon('checkbox') }} />
      <Tabs.Screen
        name="messages"
        options={{
          title: t('tabs.messages'),
          tabBarIcon: icon('chatbubbles'),
          tabBarBadge: unread > 0 ? unread : undefined,
          tabBarBadgeStyle: { backgroundColor: colors.primary, color: colors.onPrimary },
        }}
      />
      <Tabs.Screen name="profile" options={{ title: t('tabs.profile'), tabBarIcon: icon('person-circle') }} />
    </Tabs>
  )
}
