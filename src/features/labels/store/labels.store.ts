import { create } from "zustand"
import * as labelsApi from "@/features/labels/api/labels.api"
import type { TaskLabel, TaskLabelInput } from "@/features/labels/types"

interface LabelsState {
  labels: TaskLabel[]
  isLoading: boolean
  hasLoaded: boolean
  fetchLabels: () => Promise<void>
  addLabel: (input: TaskLabelInput) => Promise<void>
  removeLabel: (id: string) => Promise<void>
  getLabelsByIds: (ids: string[]) => TaskLabel[]
}

export const useLabelsStore = create<LabelsState>((set, get) => ({
  labels: [],
  isLoading: false,
  hasLoaded: false,

  fetchLabels: async () => {
    set({ isLoading: true })
    const labels = await labelsApi.listLabels()
    set({ labels, isLoading: false, hasLoaded: true })
  },

  addLabel: async (input) => {
    const label = await labelsApi.createLabel(input)
    set({ labels: [...get().labels, label] })
  },

  removeLabel: async (id) => {
    await labelsApi.deleteLabel(id)
    set({ labels: get().labels.filter((l) => l.id !== id) })
  },

  getLabelsByIds: (ids) => {
    return get().labels.filter((l) => ids.includes(l.id))
  },
}))
