import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LabelChip } from "@/components/shared/LabelChip"

import { useTasksStore } from "@/features/tasks/store/tasks.store"
import type { TaskLabel } from "@/features/labels/types"

export function LabelCard({
  label,
  onEdit,
  onDelete,
}: {
  label: TaskLabel
  onEdit: (label: TaskLabel) => void
  onDelete: (label: TaskLabel) => void
}) {
  const usageCount = useTasksStore(
    (s) => s.tasks.filter((t) => t.labelIds.includes(label.id)).length
  )

  return (
    <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
      <div className="min-w-0 flex-1">
        <LabelChip label={label} />
        <p className="mt-1.5 text-xs text-muted-foreground">
          {usageCount} tâche{usageCount > 1 ? "s" : ""}
        </p>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="ghost" size="icon-sm" aria-label="Actions" />}
        >
          <MoreHorizontal className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(label)}>
            <Pencil className="size-4" />
            Modifier
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onClick={() => onDelete(label)}>
            <Trash2 className="size-4" />
            Supprimer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
