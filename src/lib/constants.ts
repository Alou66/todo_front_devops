import type { TaskPriority, TaskStatus } from "@/features/tasks/types"

export const TASK_STATUSES: { value: TaskStatus; label: string }[] = [
  { value: "todo", label: "À faire" },
  { value: "in_progress", label: "En cours" },
  { value: "done", label: "Terminé" },
]

export const TASK_PRIORITIES: {
  value: TaskPriority
  label: string
  className: string
  dotClassName: string
}[] = [
  {
    value: "low",
    label: "Basse",
    className: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    dotClassName: "bg-slate-400",
  },
  {
    value: "medium",
    label: "Moyenne",
    className: "bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
    dotClassName: "bg-sky-500",
  },
  {
    value: "high",
    label: "Haute",
    className: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    dotClassName: "bg-amber-500",
  },
  {
    value: "urgent",
    label: "Urgente",
    className: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
    dotClassName: "bg-red-500",
  },
]

export const MEMBER_COLORS = [
  "#6366f1", // indigo
  "#0ea5e9", // sky
  "#14b8a6", // teal
  "#f59e0b", // amber
  "#ef4444", // red
  "#a855f7", // purple
  "#ec4899", // pink
  "#22c55e", // green
]

export const LABEL_COLORS = [
  "#6366f1",
  "#0ea5e9",
  "#14b8a6",
  "#f59e0b",
  "#ef4444",
  "#a855f7",
  "#ec4899",
  "#64748b",
]

export function getPriorityConfig(priority: TaskPriority) {
  return TASK_PRIORITIES.find((p) => p.value === priority) ?? TASK_PRIORITIES[0]
}

export function getStatusLabel(status: TaskStatus) {
  return TASK_STATUSES.find((s) => s.value === status)?.label ?? status
}
