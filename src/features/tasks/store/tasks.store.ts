import { create } from "zustand"
import { toast } from "sonner"
import * as tasksApi from "@/features/tasks/api/tasks.api"
import { reportError } from "@/lib/errors"
import type { Task, TaskInput, TaskStatus } from "@/features/tasks/types"

interface TasksState {
  tasks: Task[]
  isLoading: boolean
  hasLoaded: boolean
  fetchTasks: () => Promise<void>
  addTask: (input: TaskInput) => Promise<void>
  editTask: (id: string, patch: Partial<TaskInput>) => Promise<void>
  removeTask: (id: string) => Promise<void>
  moveTask: (activeId: string, targetStatus: TaskStatus, targetIndex: number) => void
  unassignMember: (memberId: string) => Promise<void>
  unassignLabel: (labelId: string) => Promise<void>
}

/** Recomputes status + per-column ordering after a drag & drop move. */
function reorderAfterMove(
  tasks: Task[],
  activeId: string,
  targetStatus: TaskStatus,
  targetIndex: number
): Task[] {
  const active = tasks.find((t) => t.id === activeId)
  if (!active) return tasks

  const sourceStatus = active.status
  const others = tasks.filter((t) => t.id !== activeId)

  const targetColumn = others
    .filter((t) => t.status === targetStatus)
    .sort((a, b) => a.order - b.order)
  const clampedIndex = Math.max(0, Math.min(targetIndex, targetColumn.length))
  targetColumn.splice(clampedIndex, 0, { ...active, status: targetStatus })
  const updatedTarget = targetColumn.map((t, i) => ({ ...t, order: i }))

  let updatedSource: Task[] = []
  if (sourceStatus !== targetStatus) {
    const sourceColumn = others
      .filter((t) => t.status === sourceStatus)
      .sort((a, b) => a.order - b.order)
    updatedSource = sourceColumn.map((t, i) => ({ ...t, order: i }))
  }

  const untouched = others.filter(
    (t) => t.status !== targetStatus && t.status !== sourceStatus
  )

  return [...untouched, ...updatedSource, ...updatedTarget]
}

export const useTasksStore = create<TasksState>((set, get) => ({
  tasks: [],
  isLoading: false,
  hasLoaded: false,

  fetchTasks: async () => {
    set({ isLoading: true })
    try {
      const tasks = await tasksApi.listTasks()
      set({ tasks, isLoading: false, hasLoaded: true })
    } catch (error) {
      set({ isLoading: false })
      reportError("Impossible de charger les tâches.", error)
    }
  },

  addTask: async (input) => {
    try {
      const task = await tasksApi.createTask(input)
      set({ tasks: [...get().tasks, task] })
    } catch (error) {
      reportError("Impossible de créer la tâche.", error)
    }
  },

  editTask: async (id, patch) => {
    try {
      const updated = await tasksApi.updateTask(id, patch)
      set({ tasks: get().tasks.map((t) => (t.id === id ? updated : t)) })
    } catch (error) {
      reportError("Impossible de mettre à jour la tâche.", error)
    }
  },

  removeTask: async (id) => {
    try {
      await tasksApi.deleteTask(id)
      set({ tasks: get().tasks.filter((t) => t.id !== id) })
    } catch (error) {
      reportError("Impossible de supprimer la tâche.", error)
    }
  },

  moveTask: (activeId, targetStatus, targetIndex) => {
    const previousTasks = get().tasks
    const reordered = reorderAfterMove(previousTasks, activeId, targetStatus, targetIndex)
    set({ tasks: reordered })
    tasksApi.reorderTasks(reordered).catch((error: unknown) => {
      console.error("Impossible d'enregistrer le déplacement de la tâche.", error)
      toast.error("Impossible d'enregistrer le déplacement de la tâche.")
      set({ tasks: previousTasks })
    })
  },

  unassignMember: async (memberId) => {
    try {
      const affected = get().tasks.filter((t) => t.assigneeId === memberId)
      await Promise.all(affected.map((t) => tasksApi.updateTask(t.id, { assigneeId: null })))
      set({
        tasks: get().tasks.map((t) =>
          t.assigneeId === memberId ? { ...t, assigneeId: null } : t
        ),
      })
    } catch (error) {
      reportError("Impossible de désassigner ce membre.", error)
    }
  },

  unassignLabel: async (labelId) => {
    try {
      const affected = get().tasks.filter((t) => t.labelIds.includes(labelId))
      await Promise.all(
        affected.map((t) =>
          tasksApi.updateTask(t.id, { labelIds: t.labelIds.filter((id) => id !== labelId) })
        )
      )
      set({
        tasks: get().tasks.map((t) =>
          t.labelIds.includes(labelId)
            ? { ...t, labelIds: t.labelIds.filter((id) => id !== labelId) }
            : t
        ),
      })
    } catch (error) {
      reportError("Impossible de retirer cette étiquette des tâches.", error)
    }
  },
}))
