import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { SelectedAttraction } from '../types/attraction'

interface SortableStopItemProps {
  attraction: SelectedAttraction
  index: number
}

export function SortableStopItem({ attraction, index }: SortableStopItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: attraction.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    opacity: isDragging ? 0.8 : undefined,
  }

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 transition dark:border-slate-700 dark:bg-slate-800 ${
        isDragging ? 'shadow-lg ring-2 ring-pink/20' : ''
      }`}
    >
      <button
        type="button"
        className="flex h-7 w-7 shrink-0 cursor-grab items-center justify-center rounded-full bg-slate-100 text-slate-400 transition hover:bg-slate-200 hover:text-slate-600 active:cursor-grabbing dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600 dark:hover:text-slate-300"
        {...attributes}
        {...listeners}
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="9" cy="5" r="1.5" />
          <circle cx="15" cy="5" r="1.5" />
          <circle cx="9" cy="12" r="1.5" />
          <circle cx="15" cy="12" r="1.5" />
          <circle cx="9" cy="19" r="1.5" />
          <circle cx="15" cy="19" r="1.5" />
        </svg>
      </button>
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-pink text-xs font-bold text-white">
        {index + 1}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-navy dark:text-slate-100">{attraction.nome}</p>
        {attraction.bairro && (
          <p className="truncate text-xs text-slate-400">{attraction.bairro}</p>
        )}
      </div>
    </li>
  )
}
