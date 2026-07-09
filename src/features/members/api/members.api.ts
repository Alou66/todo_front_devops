import { generateId } from "@/lib/id"
import { networkDelay, readCollection, STORAGE_KEYS, writeCollection } from "@/lib/storage"
import { MEMBER_SEED } from "@/features/members/data/seed"
import type { Member, MemberInput } from "@/features/members/types"

/**
 * Mocked data-access layer for team members. Reads/writes localStorage behind
 * an async, network-shaped API so it can be swapped for real HTTP calls later
 * without touching any calling code.
 */
function getAll(): Member[] {
  return readCollection<Member>(STORAGE_KEYS.members, MEMBER_SEED)
}

export async function listMembers(): Promise<Member[]> {
  return networkDelay(getAll())
}

export async function createMember(input: MemberInput): Promise<Member> {
  const members = getAll()
  const member: Member = {
    id: generateId("member"),
    ...input,
    createdAt: new Date().toISOString(),
  }
  writeCollection(STORAGE_KEYS.members, [...members, member])
  return networkDelay(member)
}

export async function updateMember(id: string, patch: Partial<MemberInput>): Promise<Member> {
  const members = getAll()
  const index = members.findIndex((m) => m.id === id)
  if (index === -1) throw new Error("Membre introuvable")
  const updated: Member = { ...members[index], ...patch }
  const next = [...members]
  next[index] = updated
  writeCollection(STORAGE_KEYS.members, next)
  return networkDelay(updated)
}

export async function deleteMember(id: string): Promise<void> {
  const members = getAll().filter((m) => m.id !== id)
  writeCollection(STORAGE_KEYS.members, members)
  return networkDelay(undefined)
}
