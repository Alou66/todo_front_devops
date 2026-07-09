import { MoreHorizontal, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MemberAvatar } from "@/components/shared/MemberAvatar"

import { useTasksStore } from "@/features/tasks/store/tasks.store"
import type { Member } from "@/features/members/types"

export function MemberCard({
  member,
  onEdit,
  onDelete,
}: {
  member: Member
  onEdit: (member: Member) => void
  onDelete: (member: Member) => void
}) {
  const assignedCount = useTasksStore(
    (s) => s.tasks.filter((t) => t.assigneeId === member.id && t.status !== "done").length
  )

  return (
    <div className="flex items-center gap-3 rounded-lg border bg-card p-4">
      <MemberAvatar member={member} className="size-10" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{member.name}</p>
        <p className="truncate text-xs text-muted-foreground">{member.email}</p>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-xs text-muted-foreground">{member.role}</span>
          <span className="text-xs text-muted-foreground">·</span>
          <span className="text-xs text-muted-foreground">
            {assignedCount} tâche{assignedCount > 1 ? "s" : ""} active{assignedCount > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={<Button variant="ghost" size="icon-sm" aria-label="Actions" />}
        >
          <MoreHorizontal className="size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(member)}>
            <Pencil className="size-4" />
            Modifier
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive" onClick={() => onDelete(member)}>
            <Trash2 className="size-4" />
            Retirer
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
