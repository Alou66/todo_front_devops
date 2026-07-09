import { apiFetch } from "@/lib/http"
import type { Member, MemberInput } from "@/features/members/types"

export async function listMembers(): Promise<Member[]> {
  return apiFetch<Member[]>("/members")
}

export async function createMember(input: MemberInput): Promise<Member> {
  return apiFetch<Member>("/members", { method: "POST", body: JSON.stringify(input) })
}

export async function updateMember(id: string, patch: Partial<MemberInput>): Promise<Member> {
  return apiFetch<Member>(`/members/${id}`, { method: "PATCH", body: JSON.stringify(patch) })
}

export async function deleteMember(id: string): Promise<void> {
  return apiFetch<void>(`/members/${id}`, { method: "DELETE" })
}
