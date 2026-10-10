import { useTranslation } from 'react-i18next'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { LANGUAGES, changeLanguage } from '../i18n'
import { radius, useColors } from '../theme'

// Choix de la langue (FR / EN), memorise sur le telephone
export default function LanguageSwitcher() {
  const { i18n, t } = useTranslation()
  const colors = useColors()
  return (
    <View style={[styles.group, { backgroundColor: colors.subtle }]} accessibilityRole="radiogroup" accessibilityLabel={t('common.language')}>
      {LANGUAGES.map(({ code, label, short }) => {
        const active = i18n.language === code
        return (
          <Pressable
            key={code}
            onPress={() => changeLanguage(code)}
            accessibilityRole="radio"
            accessibilityLabel={label}
            accessibilityState={{ checked: active }}
            style={[styles.option, active && { backgroundColor: colors.card }]}
          >
            <Text style={[styles.text, { color: active ? colors.text : colors.muted }]}>{short}</Text>
          </Pressable>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  group: { flexDirection: 'row', borderRadius: radius.sm, padding: 3 },
  option: { minWidth: 40, minHeight: 32, borderRadius: 6, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 8 },
  text: { fontSize: 13, fontWeight: '700' },
})
