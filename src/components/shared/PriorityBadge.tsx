import { getPriorityConfig } from "@/lib/constants"
import { cn } from "@/lib/utils"
import type { TaskPriority } from "@/features/tasks/types"

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  const config = getPriorityConfig(priority)

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium",
        config.className
      )}
    >
      <span className={cn("size-1.5 rounded-full", config.dotClassName)} />
      {config.label}
    </span>
  )
}
