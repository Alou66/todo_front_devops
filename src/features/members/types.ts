export interface Member {
  id: string
  name: string
  email: string
  role: string
  color: string
  createdAt: string
}

export interface MemberInput {
  name: string
  email: string
  role: string
  color: string
}
