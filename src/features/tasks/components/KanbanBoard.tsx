import { useMemo, useState } from "react"
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core"
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable"

import { TASK_STATUSES } from "@/lib/constants"
import { KanbanColumn } from "@/features/tasks/components/KanbanColumn"
import { TaskCardOverlay } from "@/features/tasks/components/TaskCard"
import { useTasksStore } from "@/features/tasks/store/tasks.store"
import type { Task, TaskStatus } from "@/features/tasks/types"

export function KanbanBoard({
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
}: {
  tasks: Task[]
  onAddTask: (status: TaskStatus) => void
  onEditTask: (task: Task) => void
  onDeleteTask: (task: Task) => void
}) {
  const moveTask = useTasksStore((s) => s.moveTask)
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const columns = useMemo(
    () =>
      TASK_STATUSES.map((status) => ({
        ...status,
        tasks: tasks
          .filter((t) => t.status === status.value)
          .sort((a, b) => a.order - b.order),
      })),
    [tasks]
  )

  function handleDragStart(event: DragStartEvent) {
    const task = tasks.find((t) => t.id === event.active.id)
    setActiveTask(task ?? null)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveTask(null)
    if (!over) return

    const activeTaskItem = tasks.find((t) => t.id === active.id)
    if (!activeTaskItem) return

    const overId = String(over.id)
    let targetStatus: TaskStatus
    let targetIndex: number

    if (overId.startsWith("column:")) {
      targetStatus = overId.replace("column:", "") as TaskStatus
      targetIndex = tasks.filter((t) => t.status === targetStatus).length
    } else {
      const overTask = tasks.find((t) => t.id === overId)
      if (!overTask) return
      targetStatus = overTask.status
      const columnTasks = tasks
        .filter((t) => t.status === targetStatus)
        .sort((a, b) => a.order - b.order)
      targetIndex = columnTasks.findIndex((t) => t.id === overTask.id)
    }

    if (
      activeTaskItem.status === targetStatus &&
      tasks
        .filter((t) => t.status === targetStatus)
        .sort((a, b) => a.order - b.order)
        .findIndex((t) => t.id === activeTaskItem.id) === targetIndex
    ) {
      return
    }

    moveTask(String(active.id), targetStatus, targetIndex)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-full gap-4 overflow-x-auto pb-4">
        {columns.map((column) => (
          <KanbanColumn
            key={column.value}
            status={column.value}
            label={column.label}
            tasks={column.tasks}
            onAddTask={onAddTask}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
          />
        ))}
      </div>

      <DragOverlay>{activeTask && <TaskCardOverlay task={activeTask} />}</DragOverlay>
    </DndContext>
  )
}
