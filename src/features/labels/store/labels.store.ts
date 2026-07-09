import { create } from "zustand"
import * as labelsApi from "@/features/labels/api/labels.api"
import { reportError } from "@/lib/errors"
import type { TaskLabel, TaskLabelInput } from "@/features/labels/types"

interface LabelsState {
  labels: TaskLabel[]
  isLoading: boolean
  hasLoaded: boolean
  fetchLabels: () => Promise<void>
  addLabel: (input: TaskLabelInput) => Promise<void>
  editLabel: (id: string, patch: Partial<TaskLabelInput>) => Promise<void>
  removeLabel: (id: string) => Promise<void>
  getLabelsByIds: (ids: string[]) => TaskLabel[]
}

export const useLabelsStore = create<LabelsState>((set, get) => ({
  labels: [],
  isLoading: false,
  hasLoaded: false,

  fetchLabels: async () => {
    set({ isLoading: true })
    try {
      const labels = await labelsApi.listLabels()
      set({ labels, isLoading: false, hasLoaded: true })
    } catch (error) {
      set({ isLoading: false })
      reportError("Impossible de charger les étiquettes.", error)
    }
  },

  addLabel: async (input) => {
    try {
      const label = await labelsApi.createLabel(input)
      set({ labels: [...get().labels, label] })
    } catch (error) {
      reportError("Impossible de créer cette étiquette.", error)
    }
  },

  editLabel: async (id, patch) => {
    try {
      const updated = await labelsApi.updateLabel(id, patch)
      set({ labels: get().labels.map((l) => (l.id === id ? updated : l)) })
    } catch (error) {
      reportError("Impossible de mettre à jour cette étiquette.", error)
    }
  },

  removeLabel: async (id) => {
    try {
      await labelsApi.deleteLabel(id)
      set({ labels: get().labels.filter((l) => l.id !== id) })
    } catch (error) {
      reportError("Impossible de supprimer cette étiquette.", error)
    }
  },

  getLabelsByIds: (ids) => {
    return get().labels.filter((l) => ids.includes(l.id))
  },
}))
