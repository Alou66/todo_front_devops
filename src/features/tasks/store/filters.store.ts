import { create } from "zustand"
import type { TaskPriority } from "@/features/tasks/types"

interface FiltersState {
  search: string
  assigneeId: string | null
  priority: TaskPriority | null
  labelId: string | null
  setSearch: (value: string) => void
  setAssigneeId: (value: string | null) => void
  setPriority: (value: TaskPriority | null) => void
  setLabelId: (value: string | null) => void
  reset: () => void
}

export const useFiltersStore = create<FiltersState>((set) => ({
  search: "",
  assigneeId: null,
  priority: null,
  labelId: null,
  setSearch: (value) => set({ search: value }),
  setAssigneeId: (value) => set({ assigneeId: value }),
  setPriority: (value) => set({ priority: value }),
  setLabelId: (value) => set({ labelId: value }),
  reset: () => set({ search: "", assigneeId: null, priority: null, labelId: null }),
}))
