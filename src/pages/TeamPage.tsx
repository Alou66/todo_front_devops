import { useEffect, useState } from "react"
import { Plus, Users } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/shared/EmptyState"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"

import { useMembersStore } from "@/features/members/store/members.store"
import { useTasksStore } from "@/features/tasks/store/tasks.store"
import { MemberCard } from "@/features/members/components/MemberCard"
import { MemberFormDialog } from "@/features/members/components/MemberFormDialog"
import type { Member } from "@/features/members/types"

export function TeamPage() {
  const members = useMembersStore((s) => s.members)
  const hasLoaded = useMembersStore((s) => s.hasLoaded)
  const fetchMembers = useMembersStore((s) => s.fetchMembers)
  const removeMember = useMembersStore((s) => s.removeMember)
  const unassignMember = useTasksStore((s) => s.unassignMember)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingMember, setEditingMember] = useState<Member | undefined>(undefined)
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null)

  useEffect(() => {
    if (!hasLoaded) void fetchMembers()
  }, [hasLoaded, fetchMembers])

  function handleAdd() {
    setEditingMember(undefined)
    setDialogOpen(true)
  }

  function handleEdit(member: Member) {
    setEditingMember(member)
    setDialogOpen(true)
  }

  async function handleDeleteConfirmed() {
    if (!memberToDelete) return
    try {
      await unassignMember(memberToDelete.id)
      await removeMember(memberToDelete.id)
      toast.success("Membre retiré de l'équipe")
    } catch {
      // L'erreur est déjà signalée par le store via un toast.
    }
  }

  if (!hasLoaded) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
        Chargement de l'équipe...
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex items-center justify-end">
        <Button onClick={handleAdd}>
          <Plus className="size-4" />
          Ajouter un membre
        </Button>
      </div>

      {members.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Aucun membre pour l'instant"
          description="Ajoutez les membres de vos équipes pour pouvoir leur assigner des tâches."
          action={
            <Button onClick={handleAdd} size="sm">
              <Plus className="size-4" />
              Ajouter un membre
            </Button>
          }
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {members.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              onEdit={handleEdit}
              onDelete={setMemberToDelete}
            />
          ))}
        </div>
      )}

      <MemberFormDialog open={dialogOpen} onOpenChange={setDialogOpen} member={editingMember} />

      <ConfirmDialog
        open={Boolean(memberToDelete)}
        onOpenChange={(open) => !open && setMemberToDelete(null)}
        title="Retirer ce membre ?"
        description={`« ${memberToDelete?.name} » sera retiré de l'équipe et ses tâches actives seront désassignées.`}
        confirmLabel="Retirer"
        onConfirm={handleDeleteConfirmed}
      />
    </div>
  )
}
