import Ionicons from '@expo/vector-icons/Ionicons'
import { useTranslation } from 'react-i18next'
import { Image, Linking, Pressable, StyleSheet, Text, View } from 'react-native'
import { apiUrl } from '../../../api/client'
import Button from '../../../components/Button'
import LanguageSwitcher from '../../../components/LanguageSwitcher'
import Avatar from '../../../components/ui/Avatar'
import Card from '../../../components/ui/Card'
import Screen from '../../../components/ui/Screen'
import { useAuth } from '../../../context/AuthProvider'
import { radius, useColors } from '../../../theme'
import { fullName } from '../../../utils/format'

const WEBSITE = 'https://devmanager-five.vercel.app'

function LinkRow({ icon, label, url }) {
  const colors = useColors()
  return (
    <Pressable
      onPress={() => Linking.openURL(url)}
      accessibilityRole="link"
      style={({ pressed }) => [styles.linkRow, pressed && { backgroundColor: colors.subtle }]}
    >
      <Ionicons name={icon} size={20} color={colors.primary} />
      <Text style={[styles.linkText, { color: colors.text }]}>{label}</Text>
      <Ionicons name="open-outline" size={16} color={colors.muted} />
    </Pressable>
  )
}

export default function ProfileScreen() {
  const { t } = useTranslation()
  const colors = useColors()
  const { user, logout } = useAuth()

  return (
    <Screen title={t('nav.profile')}>
      <Card style={styles.identity}>
        <Avatar user={user} size="xl" />
        <Text style={[styles.name, { color: colors.text }]}>{fullName(user)}</Text>
        {user.jobTitle ? <Text style={[styles.meta, { color: colors.textSecondary }]}>{user.jobTitle}</Text> : null}
        <Text style={[styles.meta, { color: colors.muted }]}>{user.email}</Text>
      </Card>

      <Card style={styles.rows}>
        <View style={styles.row}>
          <Text style={[styles.rowLabel, { color: colors.muted }]}>{t('users.role')}</Text>
          <Text style={[styles.rowValue, { color: colors.text }]}>{t(`enums.role.${user.role}`)}</Text>
        </View>
        <View style={[styles.row, styles.divider, { borderTopColor: colors.border }]}>
          <Text style={[styles.rowLabel, { color: colors.muted }]}>{t('nav.company')}</Text>
          <View style={styles.company}>
            {user.organizationLogoUrl ? (
              <Image source={{ uri: apiUrl(user.organizationLogoUrl) }} style={styles.logo} />
            ) : null}
            <Text style={[styles.rowValue, { color: colors.text }]} numberOfLines={1}>
              {user.organizationName}
            </Text>
          </View>
        </View>
        <View style={[styles.row, styles.divider, { borderTopColor: colors.border }]}>
          <Text style={[styles.rowLabel, { color: colors.muted }]}>{t('profile.plan')}</Text>
          <Text style={[styles.rowValue, { color: colors.text }]}>
            {user.organizationPlan === 'PRO' ? t('plan.proPlan') : t('plan.freePlan')}
          </Text>
        </View>
      </Card>

      <Card style={styles.rows}>
        <View style={styles.row}>
          <Text style={[styles.rowLabel, { color: colors.text }]}>{t('common.language')}</Text>
          <LanguageSwitcher />
        </View>
        <Text style={[styles.hint, { color: colors.muted }]}>{t('profile.themeHint')}</Text>
      </Card>

      <Card style={styles.links}>
        <Text style={[styles.hint, { color: colors.muted }]}>{t('profile.webHint')}</Text>
        <LinkRow icon="globe-outline" label={t('profile.openWebsite')} url={`${WEBSITE}/app/profile`} />
        <LinkRow icon="help-buoy-outline" label={t('nav.help')} url={`${WEBSITE}/aide`} />
      </Card>

      <Button variant="secondary" title={t('nav.logout')} onPress={logout} />
    </Screen>
  )
}

const styles = StyleSheet.create({
  identity: { alignItems: 'center', gap: 6, paddingVertical: 24 },
  name: { fontSize: 20, fontWeight: '800', marginTop: 8 },
  meta: { fontSize: 14 },
  rows: { paddingVertical: 4 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12, paddingVertical: 12 },
  divider: { borderTopWidth: 1 },
  rowLabel: { fontSize: 14 },
  rowValue: { fontSize: 14, fontWeight: '600', flexShrink: 1, textAlign: 'right' },
  company: { flexDirection: 'row', alignItems: 'center', gap: 8, flexShrink: 1 },
  logo: { width: 24, height: 24, borderRadius: 6 },
  hint: { fontSize: 13, lineHeight: 19, paddingBottom: 8 },
  links: { gap: 2 },
  linkRow: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 48, borderRadius: radius.md, paddingHorizontal: 6 },
  linkText: { flex: 1, fontSize: 15, fontWeight: '500' },
})
