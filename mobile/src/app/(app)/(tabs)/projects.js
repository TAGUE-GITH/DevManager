import Ionicons from '@expo/vector-icons/Ionicons'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, TextInput, View } from 'react-native'
import { projectsApi } from '../../../api/resources'
import { StatusBadge } from '../../../components/ui/Badge'
import BudgetBar from '../../../components/ui/BudgetBar'
import Card from '../../../components/ui/Card'
import Screen from '../../../components/ui/Screen'
import Segmented from '../../../components/ui/Segmented'
import { EmptyState, ErrorState, Loader } from '../../../components/ui/States'
import { useFetch } from '../../../hooks/useFetch'
import { radius, useColors } from '../../../theme'
import { PROJECT_STATUSES, formatCurrency, formatDate } from '../../../utils/format'

function ProjectCard({ project, onPress }) {
  const { t } = useTranslation()
  const colors = useColors()
  return (
    <Card onPress={onPress} accessibilityLabel={project.name} style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={[styles.name, { color: colors.text }]} numberOfLines={2}>
          {project.name}
        </Text>
        <StatusBadge status={project.status} group="projectStatus" />
      </View>
      <Text style={[styles.description, { color: colors.muted }]} numberOfLines={2}>
        {project.description || t('projects.noDescription')}
      </Text>
      <View style={styles.amounts}>
        <Text style={[styles.spent, { color: colors.text }]}>{formatCurrency(project.spent)}</Text>
        <Text style={[styles.meta, { color: colors.muted }]}>{t('projects.of', { budget: formatCurrency(project.budget) })}</Text>
      </View>
      <BudgetBar percent={project.consumedPercent} />
      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <View style={styles.metaItem}>
          <Ionicons name="people-outline" size={15} color={colors.muted} />
          <Text style={[styles.meta, { color: colors.muted }]}>{t('projects.people', { count: project.members.length + 1 })}</Text>
        </View>
        {project.taskCount > 0 && (
          <View style={styles.metaItem}>
            <Ionicons name="checkbox-outline" size={15} color={colors.muted} />
            <Text style={[styles.meta, { color: colors.muted }]}>
              {t('projects.tasksDone', { done: project.completedTaskCount, total: project.taskCount })}
            </Text>
          </View>
        )}
        {project.endDate && (
          <View style={styles.metaItem}>
            <Ionicons name="calendar-outline" size={15} color={colors.muted} />
            <Text style={[styles.meta, { color: colors.muted }]}>{formatDate(project.endDate)}</Text>
          </View>
        )}
      </View>
    </Card>
  )
}

export default function ProjectsScreen() {
  const { t } = useTranslation()
  const colors = useColors()
  const router = useRouter()
  const { data: projects, error, loading, refreshing, refresh, reload } = useFetch(projectsApi.list)
  const [filter, setFilter] = useState('ALL')
  const [search, setSearch] = useState('')

  const header = { title: t('nav.projects'), subtitle: t('projects.description') }
  if (loading) return <Screen {...header}><Loader /></Screen>
  if (error && !projects) return <Screen {...header}><ErrorState message={error} onRetry={reload} /></Screen>

  const visible = projects.filter(
    (project) =>
      (filter === 'ALL' || project.status === filter) &&
      project.name.toLowerCase().includes(search.trim().toLowerCase()),
  )

  return (
    <Screen {...header} onRefresh={refresh} refreshing={refreshing}>
      {projects.length === 0 ? (
        <EmptyState icon="folder-open-outline" title={t('projects.emptyTitle')} description={t('projects.emptyMember')} />
      ) : (
        <>
          <Segmented
              value={filter}
              onChange={setFilter}
              options={[
                { value: 'ALL', label: t('projects.all') },
                ...PROJECT_STATUSES.map((status) => ({ value: status, label: t(`enums.projectStatus.${status}`) })),
              ]}
            />
          <View style={[styles.search, { backgroundColor: colors.card, borderColor: colors.inputBorder }]}>
            <Ionicons name="search" size={18} color={colors.muted} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder={t('projects.search')}
              placeholderTextColor={colors.muted}
              accessibilityLabel={t('projects.search')}
              style={[styles.searchInput, { color: colors.text }]}
            />
          </View>
          {visible.length === 0 ? (
            <Text style={[styles.noMatch, { color: colors.muted }]}>{t('projects.noMatch')}</Text>
          ) : (
            visible.map((project) => (
              <ProjectCard key={project.id} project={project} onPress={() => router.push(`/project/${project.id}`)} />
            ))
          )}
        </>
      )}
    </Screen>
  )
}

const styles = StyleSheet.create({
  search: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderRadius: radius.md, paddingHorizontal: 12 },
  searchInput: { flex: 1, minHeight: 44, fontSize: 15 },
  noMatch: { textAlign: 'center', paddingVertical: 24, fontSize: 14 },
  card: { gap: 10 },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10 },
  name: { flex: 1, fontSize: 16, fontWeight: '700' },
  description: { fontSize: 14, lineHeight: 20 },
  amounts: { flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 },
  spent: { fontSize: 15, fontWeight: '700' },
  footer: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, borderTopWidth: 1, paddingTop: 10 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  meta: { fontSize: 13 },
})
