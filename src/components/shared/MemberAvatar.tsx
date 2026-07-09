import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import type { Member } from "@/features/members/types"

function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}

export function MemberAvatar({
  member,
  className,
}: {
  member: Member | undefined
  className?: string
}) {
  if (!member) {
    return (
      <Avatar className={cn("size-6 border border-dashed", className)}>
        <AvatarFallback className="bg-transparent text-[10px] text-muted-foreground">
          ?
        </AvatarFallback>
      </Avatar>
    )
  }

  return (
    <Avatar className={cn("size-6", className)}>
      <AvatarFallback
        className="text-[10px] font-medium text-white"
        style={{ backgroundColor: member.color }}
      >
        {getInitials(member.name)}
      </AvatarFallback>
    </Avatar>
  )
}
