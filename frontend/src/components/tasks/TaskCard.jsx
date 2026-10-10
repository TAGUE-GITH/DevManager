import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CalendarDays } from 'lucide-react'
import { TASK_PRIORITY, formatDate } from '../../utils/format'
import Avatar from '../ui/Avatar'
import Badge from '../ui/Badge'
import { useTranslation } from 'react-i18next'

// Contenu d'une carte, partage entre la carte deplacable et l'apercu pendant le glisser-deposer
export function TaskCardContent({ task, onOpen, dragging = false }) {
  const { t } = useTranslation()
  const priority = TASK_PRIORITY[task.priority]
  return (
    <div
      className={`rounded-lg bg-white p-3.5 shadow-xs ring-1 ring-slate-200 ${
        dragging ? 'rotate-2 shadow-lg ring-indigo-300' : 'hover:ring-indigo-200'
      }`}
    >
      <button
        type="button"
        onClick={() => onOpen?.(task)}
        className="block w-full text-left text-sm font-medium text-slate-900 hover:text-indigo-600"
      >
        {task.title}
      </button>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Badge className={priority.badge}>{priority.label}</Badge>
        {task.dueDate && (
          <span
            className={`flex items-center gap-1 text-xs ${task.overdue ? 'font-medium text-red-700' : 'text-slate-500'}`}
          >
            <CalendarDays className="size-3.5" aria-hidden />
            {formatDate(task.dueDate)}
            {task.overdue && ` ${t('tasks.overdue')}`}
          </span>
        )}
        <span className="ml-auto">
          {task.assignee ? (
            <Avatar user={task.assignee} size="sm" />
          ) : (
            <span className="text-xs text-slate-400">{t('tasks.unassigned')}</span>
          )}
        </span>
      </div>
    </div>
  )
}

export default function TaskCard({ task, onOpen, disabled }) {
  const { t } = useTranslation()
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    disabled,
  })

  return (
    <li
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`touch-manipulation ${isDragging ? 'opacity-40' : ''} ${disabled ? '' : 'cursor-grab active:cursor-grabbing'}`}
      aria-label={t('tasks.cardLabel', { title: task.title })}
      {...attributes}
      {...listeners}
    >
      <TaskCardContent task={task} onOpen={onOpen} />
    </li>
  )
}
