import { useMemo } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { format, isPast, isToday } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarClock, GripVertical, MoreHorizontal, Pencil, Trash2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { PriorityBadge } from "@/components/shared/PriorityBadge"
import { LabelChip } from "@/components/shared/LabelChip"
import { MemberAvatar } from "@/components/shared/MemberAvatar"

import { useMembersStore } from "@/features/members/store/members.store"
import { useLabelsStore } from "@/features/labels/store/labels.store"
import type { Task } from "@/features/tasks/types"

function TaskCardContent({
  task,
  dragHandleProps,
  onEdit,
  onDelete,
}: {
  task: Task
  dragHandleProps?: Record<string, unknown>
  onEdit?: (task: Task) => void
  onDelete?: (task: Task) => void
}) {
  const member = useMembersStore((s) => s.getMemberById(task.assigneeId))
  const allLabels = useLabelsStore((s) => s.labels)
  const labels = useMemo(
    () => allLabels.filter((l) => task.labelIds.includes(l.id)),
    [allLabels, task.labelIds]
  )

  const isOverdue =
    task.status !== "done" && task.dueDate
      ? isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate))
      : false

  return (
    <>
      <div className="flex items-start gap-2">
        <button
          type="button"
          {...dragHandleProps}
          aria-label="Déplacer la tâche"
          className="mt-0.5 shrink-0 cursor-grab touch-none text-muted-foreground/40 active:cursor-grabbing hover:text-muted-foreground"
        >
          <GripVertical className="size-4" />
        </button>

        <button
          type="button"
          onClick={() => onEdit?.(task)}
          className="min-w-0 flex-1 text-left"
        >
          <p className="text-sm leading-snug font-medium">{task.title}</p>
          {task.description && (
            <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
              {task.description}
            </p>
          )}
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                className="shrink-0 opacity-0 group-hover:opacity-100 data-[state=open]:opacity-100"
                aria-label="Actions"
              />
            }
          >
            <MoreHorizontal className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit?.(task)}>
              <Pencil className="size-4" />
              Modifier
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onClick={() => onDelete?.(task)}>
              <Trash2 className="size-4" />
              Supprimer
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {(labels.length > 0 || task.dueDate || member) && (
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5 pl-6">
          {labels.map((label) => (
            <LabelChip key={label.id} label={label} />
          ))}
        </div>
      )}

      <div className="mt-2.5 flex items-center justify-between gap-2 pl-6">
        <div className="flex items-center gap-2">
          <PriorityBadge priority={task.priority} />
          {task.dueDate && (
            <span
              className={cn(
                "flex items-center gap-1 text-xs",
                isOverdue ? "font-medium text-red-600 dark:text-red-400" : "text-muted-foreground"
              )}
            >
              <CalendarClock className="size-3" />
              {format(new Date(task.dueDate), "d MMM", { locale: fr })}
            </span>
          )}
        </div>
        <MemberAvatar member={member} />
      </div>
    </>
  )
}

export function TaskCard({
  task,
  onEdit,
  onDelete,
}: {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    data: { status: task.status },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group rounded-lg border bg-card p-3 shadow-sm transition-shadow hover:shadow-md",
        isDragging && "opacity-40"
      )}
    >
      <TaskCardContent
        task={task}
        dragHandleProps={{ ...attributes, ...listeners }}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </div>
  )
}

export function TaskCardOverlay({ task }: { task: Task }) {
  return (
    <div className="rounded-lg border bg-card p-3 shadow-lg">
      <TaskCardContent task={task} />
    </div>
  )
}
