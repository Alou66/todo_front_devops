export type TaskStatus = "todo" | "in_progress" | "done"

export type TaskPriority = "low" | "medium" | "high" | "urgent"

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  dueDate: string | null
  assigneeId: string | null
  labelIds: string[]
  order: number
  createdAt: string
  updatedAt: string
}

export interface TaskInput {
  title: string
  description: string
  priority: TaskPriority
  dueDate: string | null
  assigneeId: string | null
  labelIds: string[]
  status: TaskStatus
}
