import { apiFetch } from "@/lib/http"
import type { TaskLabel, TaskLabelInput } from "@/features/labels/types"

export async function listLabels(): Promise<TaskLabel[]> {
  return apiFetch<TaskLabel[]>("/labels")
}

export async function createLabel(input: TaskLabelInput): Promise<TaskLabel> {
  return apiFetch<TaskLabel>("/labels", { method: "POST", body: JSON.stringify(input) })
}

export async function updateLabel(id: string, patch: Partial<TaskLabelInput>): Promise<TaskLabel> {
  return apiFetch<TaskLabel>(`/labels/${id}`, { method: "PATCH", body: JSON.stringify(patch) })
}

export async function deleteLabel(id: string): Promise<void> {
  return apiFetch<void>(`/labels/${id}`, { method: "DELETE" })
}
