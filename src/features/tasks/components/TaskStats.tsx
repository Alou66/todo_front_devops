import { isPast, isToday } from "date-fns"
import { AlertTriangle, CheckCircle2, CircleDashed, ListTodo } from "lucide-react"
import type { Task } from "@/features/tasks/types"

function StatCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ElementType
  label: string
  value: number
  tone: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border bg-card px-4 py-3">
      <div className={`flex size-9 items-center justify-center rounded-full ${tone}`}>
        <Icon className="size-4.5" />
      </div>
      <div>
        <p className="text-lg leading-none font-semibold">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  )
}

export function TaskStats({ tasks }: { tasks: Task[] }) {
  const total = tasks.length
  const inProgress = tasks.filter((t) => t.status === "in_progress").length
  const done = tasks.filter((t) => t.status === "done").length
  const overdue = tasks.filter(
    (t) => t.status !== "done" && t.dueDate && isPast(new Date(t.dueDate)) && !isToday(new Date(t.dueDate))
  ).length

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      <StatCard
        icon={ListTodo}
        label="Tâches actives"
        value={total - done}
        tone="bg-primary/10 text-primary"
      />
      <StatCard
        icon={CircleDashed}
        label="En cours"
        value={inProgress}
        tone="bg-sky-500/10 text-sky-600 dark:text-sky-400"
      />
      <StatCard
        icon={AlertTriangle}
        label="En retard"
        value={overdue}
        tone="bg-red-500/10 text-red-600 dark:text-red-400"
      />
      <StatCard
        icon={CheckCircle2}
        label="Terminées"
        value={done}
        tone="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
      />
    </div>
  )
}
