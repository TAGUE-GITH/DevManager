import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { SortableContext, arrayMove, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Plus } from 'lucide-react'
import { useRef, useState } from 'react'
import { useTaskStatusColors } from '../../utils/chartColors'
import { TASK_STATUS } from '../../utils/format'
import TaskCard, { TaskCardContent } from './TaskCard'
import { useTranslation } from 'react-i18next'

const STATUSES = Object.keys(TASK_STATUS)

// Regroupe les taches par colonne, triees par position
function groupByStatus(tasks) {
  const columns = Object.fromEntries(STATUSES.map((status) => [status, []]))
  for (const task of [...tasks].sort((a, b) => a.position - b.position)) {
    columns[task.status].push(task)
  }
  return columns
}

function Column({ status, tasks, canEdit, onOpen, onAdd }) {
  const { t } = useTranslation()
  // La colonne entiere accepte les depots, meme vide
  const { setNodeRef, isOver } = useDroppable({ id: status })
  const { label } = TASK_STATUS[status]
  const color = useTaskStatusColors()[status]

  return (
    <section className="flex w-72 shrink-0 flex-col rounded-xl bg-slate-100/80 p-3 xl:w-auto" aria-label={label}>
      <header className="mb-3 flex items-center gap-2 px-1">
        <span className="size-2 rounded-full" style={{ backgroundColor: color }} aria-hidden />
        <h3 className="text-sm font-semibold text-slate-700">{label}</h3>
        <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-slate-500">{tasks.length}</span>
        {canEdit && status === 'TODO' && (
          <button
            onClick={onAdd}
            className="ml-auto rounded-md p-1 text-slate-500 hover:bg-white hover:text-indigo-600"
            aria-label={t('tasks.add')}
            title={t('tasks.add')}
          >
            <Plus className="size-4" />
          </button>
        )}
      </header>
      <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
        <ul
          ref={setNodeRef}
          className={`flex min-h-24 flex-1 flex-col gap-2.5 rounded-lg transition ${isOver ? 'bg-indigo-50' : ''}`}
        >
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onOpen={onOpen} disabled={!canEdit} />
          ))}
          {tasks.length === 0 && (
            <li className="rounded-lg border-2 border-dashed border-slate-200 p-4 text-center text-xs text-slate-400">
              {t('tasks.dropHere')}
            </li>
          )}
        </ul>
      </SortableContext>
    </section>
  )
}

/**
 * Tableau Kanban : les cartes se deplacent a la souris, au doigt ou au clavier (Espace pour saisir, fleches, Espace pour deposer).
 * L'affichage est mis a jour immediatement, puis le serveur est informe (onMove).
 */
export default function KanbanBoard({ tasks, canEdit, onOpen, onAdd, onMove }) {
  const { t } = useTranslation()
  const [columns, setColumns] = useState(() => groupByStatus(tasks))
  const [syncedTasks, setSyncedTasks] = useState(tasks)
  const [activeTask, setActiveTask] = useState(null)
  const startColumn = useRef(null)

  // Nouvelles donnees du serveur : on reconstruit les colonnes
  if (tasks !== syncedTasks) {
    setSyncedTasks(tasks)
    setColumns(groupByStatus(tasks))
  }

  const sensors = useSensors(
    // Un petit deplacement est necessaire pour saisir la carte : un simple clic ouvre la tache
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const findColumn = (id) => (id in columns ? id : STATUSES.find((status) => columns[status].some((task) => task.id === id)))

  const handleDragStart = ({ active }) => {
    startColumn.current = findColumn(active.id)
    setActiveTask(columns[startColumn.current].find((task) => task.id === active.id))
  }

  // Passage d'une colonne a une autre : la carte y est deplacee pendant le glisser
  const handleDragOver = ({ active, over }) => {
    if (!over) return
    const from = findColumn(active.id)
    const to = findColumn(over.id)
    if (!from || !to || from === to) return

    setColumns((current) => {
      const moving = current[from].find((task) => task.id === active.id)
      const overIndex = current[to].findIndex((task) => task.id === over.id)
      const index = overIndex >= 0 ? overIndex : current[to].length
      const target = [...current[to]]
      target.splice(index, 0, { ...moving, status: to })
      return { ...current, [from]: current[from].filter((task) => task.id !== active.id), [to]: target }
    })
  }

  const handleDragEnd = ({ active, over }) => {
    setActiveTask(null)
    const column = findColumn(active.id)
    if (!over || !column) return

    const oldIndex = columns[column].findIndex((task) => task.id === active.id)
    const overIndex = columns[column].findIndex((task) => task.id === over.id)
    const newIndex = overIndex >= 0 ? overIndex : oldIndex
    const reordered = arrayMove(columns[column], oldIndex, newIndex)
    setColumns({ ...columns, [column]: reordered })

    if (column !== startColumn.current || oldIndex !== newIndex) {
      onMove(active.id, column, newIndex)
    }
  }

  const handleDragCancel = () => {
    setActiveTask(null)
    setColumns(groupByStatus(tasks))
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
      accessibility={{
        screenReaderInstructions: {
          draggable: t('tasks.dragInstructions'),
        },
      }}
    >
      {/* Ecrans moyens et petits : colonnes de largeur fixe avec defilement horizontal ; grands ecrans : 4 colonnes egales */}
      <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0 xl:grid xl:grid-cols-4 xl:overflow-visible">
        {STATUSES.map((status) => (
          <Column key={status} status={status} tasks={columns[status]} canEdit={canEdit} onOpen={onOpen} onAdd={onAdd} />
        ))}
      </div>
      <DragOverlay>{activeTask && <TaskCardContent task={activeTask} dragging />}</DragOverlay>
    </DndContext>
  )
}
