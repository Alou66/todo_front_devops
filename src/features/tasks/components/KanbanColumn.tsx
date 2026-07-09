import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { TaskCard } from "@/features/tasks/components/TaskCard"
import type { Task, TaskStatus } from "@/features/tasks/types"

export function KanbanColumn({
  status,
  label,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
}: {
  status: TaskStatus
  label: string
  tasks: Task[]
  onAddTask: (status: TaskStatus) => void
  onEditTask: (task: Task) => void
  onDeleteTask: (task: Task) => void
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `column:${status}`,
    data: { status },
  })

  return (
    <div className="flex w-[300px] shrink-0 flex-col rounded-xl bg-muted/40 md:w-80">
      <div className="flex items-center justify-between px-3 pt-3 pb-2">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold">{label}</h2>
          <span className="rounded-full bg-background px-1.5 py-0.5 text-xs text-muted-foreground ring-1 ring-border">
            {tasks.length}
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Ajouter une tâche dans ${label}`}
          onClick={() => onAddTask(status)}
        >
          <Plus className="size-4" />
        </Button>
      </div>

      <div
        ref={setNodeRef}
        className={`flex min-h-24 flex-1 flex-col gap-2 overflow-y-auto rounded-b-xl p-2 pt-0 transition-colors ${
          isOver ? "bg-primary/5" : ""
        }`}
      >
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={onEditTask} onDelete={onDeleteTask} />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div className="rounded-lg border border-dashed p-4 text-center text-xs text-muted-foreground">
            Aucune tâche
          </div>
        )}
      </div>
    </div>
  )
}
