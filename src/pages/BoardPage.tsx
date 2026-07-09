import { useEffect, useMemo, useState } from "react"
import { Plus } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"

import { useTasksStore } from "@/features/tasks/store/tasks.store"
import { useFiltersStore } from "@/features/tasks/store/filters.store"
import { useMembersStore } from "@/features/members/store/members.store"
import { useLabelsStore } from "@/features/labels/store/labels.store"
import { KanbanBoard } from "@/features/tasks/components/KanbanBoard"
import { TaskFiltersBar } from "@/features/tasks/components/TaskFiltersBar"
import { TaskStats } from "@/features/tasks/components/TaskStats"
import { TaskDialog } from "@/features/tasks/components/TaskDialog"
import type { Task, TaskStatus } from "@/features/tasks/types"

export function BoardPage() {
  const tasks = useTasksStore((s) => s.tasks)
  const hasLoadedTasks = useTasksStore((s) => s.hasLoaded)
  const fetchTasks = useTasksStore((s) => s.fetchTasks)
  const removeTask = useTasksStore((s) => s.removeTask)

  const hasLoadedMembers = useMembersStore((s) => s.hasLoaded)
  const fetchMembers = useMembersStore((s) => s.fetchMembers)

  const hasLoadedLabels = useLabelsStore((s) => s.hasLoaded)
  const fetchLabels = useLabelsStore((s) => s.fetchLabels)

  const { search, assigneeId, priority, labelId } = useFiltersStore()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined)
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>("todo")
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null)

  useEffect(() => {
    if (!hasLoadedTasks) fetchTasks()
    if (!hasLoadedMembers) fetchMembers()
    if (!hasLoadedLabels) fetchLabels()
  }, [hasLoadedTasks, hasLoadedMembers, hasLoadedLabels, fetchTasks, fetchMembers, fetchLabels])

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase()
    return tasks.filter((task) => {
      if (query && !task.title.toLowerCase().includes(query)) return false
      if (assigneeId && task.assigneeId !== assigneeId) return false
      if (priority && task.priority !== priority) return false
      if (labelId && !task.labelIds.includes(labelId)) return false
      return true
    })
  }, [tasks, search, assigneeId, priority, labelId])

  const isLoading = !hasLoadedTasks || !hasLoadedMembers || !hasLoadedLabels

  function handleAddTask(status: TaskStatus) {
    setEditingTask(undefined)
    setDefaultStatus(status)
    setDialogOpen(true)
  }

  function handleEditTask(task: Task) {
    setEditingTask(task)
    setDialogOpen(true)
  }

  async function handleDeleteConfirmed() {
    if (!taskToDelete) return
    await removeTask(taskToDelete.id)
    toast.success("Tâche supprimée")
  }

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
        Chargement du tableau...
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <TaskStats tasks={tasks} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <TaskFiltersBar />
        <Button onClick={() => handleAddTask("todo")} className="shrink-0">
          <Plus className="size-4" />
          Nouvelle tâche
        </Button>
      </div>

      <div className="min-h-0 flex-1">
        <KanbanBoard
          tasks={filteredTasks}
          onAddTask={handleAddTask}
          onEditTask={handleEditTask}
          onDeleteTask={setTaskToDelete}
        />
      </div>

      <TaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={editingTask}
        defaultStatus={defaultStatus}
      />

      <ConfirmDialog
        open={Boolean(taskToDelete)}
        onOpenChange={(open) => !open && setTaskToDelete(null)}
        title="Supprimer cette tâche ?"
        description={`« ${taskToDelete?.title} » sera définitivement supprimée.`}
        confirmLabel="Supprimer"
        onConfirm={handleDeleteConfirmed}
      />
    </div>
  )
}
