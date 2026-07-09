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

export async function deleteLabel(id: string): Promise<void> {
  const labels = getAll().filter((l) => l.id !== id)
  writeCollection(STORAGE_KEYS.labels, labels)
  return networkDelay(undefined)
}
