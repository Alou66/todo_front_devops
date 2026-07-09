import { create } from "zustand"
import * as membersApi from "@/features/members/api/members.api"
import { reportError } from "@/lib/errors"
import type { Member, MemberInput } from "@/features/members/types"

interface MembersState {
  members: Member[]
  isLoading: boolean
  hasLoaded: boolean
  fetchMembers: () => Promise<void>
  addMember: (input: MemberInput) => Promise<void>
  editMember: (id: string, patch: Partial<MemberInput>) => Promise<void>
  removeMember: (id: string) => Promise<void>
  getMemberById: (id: string | null) => Member | undefined
}

export const useMembersStore = create<MembersState>((set, get) => ({
  members: [],
  isLoading: false,
  hasLoaded: false,

  fetchMembers: async () => {
    set({ isLoading: true })
    try {
      const members = await membersApi.listMembers()
      set({ members, isLoading: false, hasLoaded: true })
    } catch (error) {
      set({ isLoading: false })
      reportError("Impossible de charger les membres.", error)
    }
  },

  addMember: async (input) => {
    try {
      const member = await membersApi.createMember(input)
      set({ members: [...get().members, member] })
    } catch (error) {
      reportError("Impossible d'ajouter ce membre.", error)
    }
  },

  editMember: async (id, patch) => {
    try {
      const updated = await membersApi.updateMember(id, patch)
      set({ members: get().members.map((m) => (m.id === id ? updated : m)) })
    } catch (error) {
      reportError("Impossible de mettre à jour ce membre.", error)
    }
  },

  removeMember: async (id) => {
    try {
      await membersApi.deleteMember(id)
      set({ members: get().members.filter((m) => m.id !== id) })
    } catch (error) {
      reportError("Impossible de supprimer ce membre.", error)
    }
  },

  getMemberById: (id) => {
    if (!id) return undefined
    return get().members.find((m) => m.id === id)
  },
}))
