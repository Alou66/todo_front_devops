import { apiFetch } from "@/lib/http"
import type { Task, TaskInput } from "@/features/tasks/types"

export async function listTasks(): Promise<Task[]> {
  return apiFetch<Task[]>("/tasks")
}

export async function createTask(input: TaskInput): Promise<Task> {
  return apiFetch<Task>("/tasks", { method: "POST", body: JSON.stringify(input) })
}

export async function updateTask(id: string, patch: Partial<TaskInput>): Promise<Task> {
  return apiFetch<Task>(`/tasks/${id}`, { method: "PATCH", body: JSON.stringify(patch) })
}

export async function deleteTask(id: string): Promise<void> {
  return apiFetch<void>(`/tasks/${id}`, { method: "DELETE" })
}

/** Persists a full reordering/move across columns after a drag & drop. */
export async function reorderTasks(tasks: Task[]): Promise<Task[]> {
  const items = tasks.map((t) => ({ id: t.id, status: t.status, order: t.order }))
  return apiFetch<Task[]>("/tasks/reorder", { method: "PUT", body: JSON.stringify(items) })
}
