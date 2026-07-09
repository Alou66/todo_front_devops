import { useEffect, useState } from "react"
import { Plus, Tag } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/shared/EmptyState"
import { ConfirmDialog } from "@/components/shared/ConfirmDialog"

import { useLabelsStore } from "@/features/labels/store/labels.store"
import { useTasksStore } from "@/features/tasks/store/tasks.store"
import { LabelCard } from "@/features/labels/components/LabelCard"
import { LabelFormDialog } from "@/features/labels/components/LabelFormDialog"
import type { TaskLabel } from "@/features/labels/types"

export function LabelsPage() {
  const labels = useLabelsStore((s) => s.labels)
  const hasLoaded = useLabelsStore((s) => s.hasLoaded)
  const fetchLabels = useLabelsStore((s) => s.fetchLabels)
  const removeLabel = useLabelsStore((s) => s.removeLabel)
  const unassignLabel = useTasksStore((s) => s.unassignLabel)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingLabel, setEditingLabel] = useState<TaskLabel | undefined>(undefined)
  const [labelToDelete, setLabelToDelete] = useState<TaskLabel | null>(null)

  useEffect(() => {
    if (!hasLoaded) void fetchLabels()
  }, [hasLoaded, fetchLabels])

  function handleAdd() {
    setEditingLabel(undefined)
    setDialogOpen(true)
  }

  function handleEdit(label: TaskLabel) {
    setEditingLabel(label)
    setDialogOpen(true)
  }

  async function handleDeleteConfirmed() {
    if (!labelToDelete) return
    try {
      await unassignLabel(labelToDelete.id)
      await removeLabel(labelToDelete.id)
      toast.success("Étiquette supprimée")
    } catch {
      // L'erreur est déjà signalée par le store via un toast.
    }
  }

  if (!hasLoaded) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
        Chargement des étiquettes...
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex items-center justify-end">
        <Button onClick={handleAdd}>
          <Plus className="size-4" />
          Nouvelle étiquette
        </Button>
      </div>

      {labels.length === 0 ? (
        <EmptyState
          icon={Tag}
          title="Aucune étiquette pour l'instant"
          description="Créez des étiquettes pour classer et retrouver vos tâches plus facilement."
          action={
            <Button onClick={handleAdd} size="sm">
              <Plus className="size-4" />
              Nouvelle étiquette
            </Button>
          }
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {labels.map((label) => (
            <LabelCard
              key={label.id}
              label={label}
              onEdit={handleEdit}
              onDelete={setLabelToDelete}
            />
          ))}
        </div>
      )}

      <LabelFormDialog open={dialogOpen} onOpenChange={setDialogOpen} label={editingLabel} />

      <ConfirmDialog
        open={Boolean(labelToDelete)}
        onOpenChange={(open) => !open && setLabelToDelete(null)}
        title="Supprimer cette étiquette ?"
        description={`« ${labelToDelete?.name} » sera retirée de toutes les tâches qui l'utilisent.`}
        confirmLabel="Supprimer"
        onConfirm={handleDeleteConfirmed}
      />
    </div>
  )
}
