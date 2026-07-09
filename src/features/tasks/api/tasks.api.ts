import { generateId } from "@/lib/id"
import { networkDelay, readCollection, STORAGE_KEYS, writeCollection } from "@/lib/storage"
import { TASK_SEED } from "@/features/tasks/data/seed"
import type { Task, TaskInput } from "@/features/tasks/types"

function getAll(): Task[] {
  return readCollection<Task>(STORAGE_KEYS.tasks, TASK_SEED)
}

export async function listTasks(): Promise<Task[]> {
  return networkDelay(getAll())
}

export async function createTask(input: TaskInput): Promise<Task> {
  const tasks = getAll()
  const now = new Date().toISOString()
  const task: Task = {
    id: generateId("task"),
    ...input,
    order: tasks.filter((t) => t.status === input.status).length,
    createdAt: now,
    updatedAt: now,
  }
  writeCollection(STORAGE_KEYS.tasks, [...tasks, task])
  return networkDelay(task)
}

export async function updateTask(id: string, patch: Partial<TaskInput>): Promise<Task> {
  const tasks = getAll()
  const index = tasks.findIndex((t) => t.id === id)
  if (index === -1) throw new Error("Tâche introuvable")
  const updated: Task = { ...tasks[index], ...patch, updatedAt: new Date().toISOString() }
  const next = [...tasks]
  next[index] = updated
  writeCollection(STORAGE_KEYS.tasks, next)
  return networkDelay(updated)
}

export async function deleteTask(id: string): Promise<void> {
  const tasks = getAll().filter((t) => t.id !== id)
  writeCollection(STORAGE_KEYS.tasks, tasks)
  return networkDelay(undefined)
}

/** Persists a full reordering/move across columns after a drag & drop. */
export async function reorderTasks(tasks: Task[]): Promise<Task[]> {
  writeCollection(STORAGE_KEYS.tasks, tasks)
  return networkDelay(tasks, 0)
}
