import { create } from "zustand"
import * as tasksApi from "@/features/tasks/api/tasks.api"
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
    const tasks = await tasksApi.listTasks()
    set({ tasks, isLoading: false, hasLoaded: true })
  },

  addTask: async (input) => {
    const task = await tasksApi.createTask(input)
    set({ tasks: [...get().tasks, task] })
  },

  editTask: async (id, patch) => {
    const updated = await tasksApi.updateTask(id, patch)
    set({ tasks: get().tasks.map((t) => (t.id === id ? updated : t)) })
  },

  removeTask: async (id) => {
    await tasksApi.deleteTask(id)
    set({ tasks: get().tasks.filter((t) => t.id !== id) })
  },

  moveTask: (activeId, targetStatus, targetIndex) => {
    const reordered = reorderAfterMove(get().tasks, activeId, targetStatus, targetIndex)
    set({ tasks: reordered })
    void tasksApi.reorderTasks(reordered)
  },

  getTasksByStatus: (status) => {
    return get()
      .tasks.filter((t) => t.status === status)
      .sort((a, b) => a.order - b.order)
  },

  unassignMember: async (memberId) => {
    const affected = get().tasks.filter((t) => t.assigneeId === memberId)
    await Promise.all(affected.map((t) => tasksApi.updateTask(t.id, { assigneeId: null })))
    set({
      tasks: get().tasks.map((t) =>
        t.assigneeId === memberId ? { ...t, assigneeId: null } : t
      ),
    })
  },
}))
