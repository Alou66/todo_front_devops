import { create } from "zustand"
import * as membersApi from "@/features/members/api/members.api"
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
    const members = await membersApi.listMembers()
    set({ members, isLoading: false, hasLoaded: true })
  },

  addMember: async (input) => {
    const member = await membersApi.createMember(input)
    set({ members: [...get().members, member] })
  },

  editMember: async (id, patch) => {
    const updated = await membersApi.updateMember(id, patch)
    set({ members: get().members.map((m) => (m.id === id ? updated : m)) })
  },

  removeMember: async (id) => {
    await membersApi.deleteMember(id)
    set({ members: get().members.filter((m) => m.id !== id) })
  },

  getMemberById: (id) => {
    if (!id) return undefined
    return get().members.find((m) => m.id === id)
  },
}))
