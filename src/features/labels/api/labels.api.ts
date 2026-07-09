import { generateId } from "@/lib/id"
import { networkDelay, readCollection, STORAGE_KEYS, writeCollection } from "@/lib/storage"
import { LABEL_SEED } from "@/features/labels/data/seed"
import type { TaskLabel, TaskLabelInput } from "@/features/labels/types"

function getAll(): TaskLabel[] {
  return readCollection<TaskLabel>(STORAGE_KEYS.labels, LABEL_SEED)
}

export async function listLabels(): Promise<TaskLabel[]> {
  return networkDelay(getAll())
}

export async function createLabel(input: TaskLabelInput): Promise<TaskLabel> {
  const labels = getAll()
  const label: TaskLabel = { id: generateId("label"), ...input }
  writeCollection(STORAGE_KEYS.labels, [...labels, label])
  return networkDelay(label)
}

export async function updateLabel(id: string, patch: Partial<TaskLabelInput>): Promise<TaskLabel> {
  const labels = getAll()
  const index = labels.findIndex((l) => l.id === id)
  if (index === -1) throw new Error("Étiquette introuvable")
  const updated: TaskLabel = { ...labels[index], ...patch }
  const next = [...labels]
  next[index] = updated
  writeCollection(STORAGE_KEYS.labels, next)
  return networkDelay(updated)
}

export async function deleteLabel(id: string): Promise<void> {
  const labels = getAll().filter((l) => l.id !== id)
  writeCollection(STORAGE_KEYS.labels, labels)
  return networkDelay(undefined)
}
