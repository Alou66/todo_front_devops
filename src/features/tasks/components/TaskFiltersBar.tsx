import { Search, X } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MemberAvatar } from "@/components/shared/MemberAvatar"
import { TASK_PRIORITIES } from "@/lib/constants"

import { useFiltersStore } from "@/features/tasks/store/filters.store"
import { useMembersStore } from "@/features/members/store/members.store"
import { useLabelsStore } from "@/features/labels/store/labels.store"

export function TaskFiltersBar() {
  const { search, assigneeId, priority, labelId, setSearch, setAssigneeId, setPriority, setLabelId, reset } =
    useFiltersStore()
  const members = useMembersStore((s) => s.members)
  const labels = useLabelsStore((s) => s.labels)

  const hasActiveFilters = Boolean(search || assigneeId || priority || labelId)

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative w-full sm:w-56">
        <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher une tâche..."
          className="pl-8"
        />
      </div>

      <Select
        value={assigneeId ?? "all"}
        onValueChange={(value) => setAssigneeId(value === "all" ? null : value)}
      >
        <SelectTrigger className="w-full sm:w-44">
          <SelectValue placeholder="Assigné à" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous les membres</SelectItem>
          {members.map((member) => (
            <SelectItem key={member.id} value={member.id}>
              <MemberAvatar member={member} className="size-5" />
              {member.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={priority ?? "all"}
        onValueChange={(value) => setPriority(value === "all" ? null : (value as typeof priority))}
      >
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="Priorité" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes priorités</SelectItem>
          {TASK_PRIORITIES.map((p) => (
            <SelectItem key={p.value} value={p.value}>
              {p.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={labelId ?? "all"} onValueChange={(value) => setLabelId(value === "all" ? null : value)}>
        <SelectTrigger className="w-full sm:w-40">
          <SelectValue placeholder="Étiquette" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Toutes étiquettes</SelectItem>
          {labels.map((label) => (
            <SelectItem key={label.id} value={label.id}>
              {label.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={reset}>
          <X className="size-4" />
          Réinitialiser
        </Button>
      )}
    </div>
  )
}
