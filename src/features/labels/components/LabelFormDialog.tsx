import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { cn } from "@/lib/utils"
import { LABEL_COLORS } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { useLabelsStore } from "@/features/labels/store/labels.store"
import type { TaskLabel } from "@/features/labels/types"

const labelFormSchema = z.object({
  name: z.string().trim().min(2, "Le nom doit contenir au moins 2 caractères.").max(40),
  color: z.string(),
})

type LabelFormValues = z.infer<typeof labelFormSchema>

function buildDefaultValues(label: TaskLabel | undefined): LabelFormValues {
  return {
    name: label?.name ?? "",
    color: label?.color ?? LABEL_COLORS[0],
  }
}

export function LabelFormDialog({
  open,
  onOpenChange,
  label,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  label?: TaskLabel
}) {
  const addLabel = useLabelsStore((s) => s.addLabel)
  const editLabel = useLabelsStore((s) => s.editLabel)

  const form = useForm<LabelFormValues>({
    resolver: zodResolver(labelFormSchema),
    defaultValues: buildDefaultValues(label),
  })

  useEffect(() => {
    if (open) form.reset(buildDefaultValues(label))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, label])

  const isEditing = Boolean(label)
  const selectedColor = form.watch("color")

  async function onSubmit(values: LabelFormValues) {
    try {
      if (label) {
        await editLabel(label.id, values)
      } else {
        await addLabel(values)
      }
      onOpenChange(false)
    } catch {
      // L'erreur est déjà signalée par le store via un toast.
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Modifier l'étiquette" : "Nouvelle étiquette"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Mettez à jour le nom ou la couleur de cette étiquette."
              : "Créez une étiquette pour classer vos tâches."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex : Urgent, Marketing..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={() => (
                <FormItem>
                  <FormLabel>Couleur</FormLabel>
                  <div className="flex flex-wrap gap-2">
                    {LABEL_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => form.setValue("color", color, { shouldDirty: true })}
                        className={cn(
                          "size-7 rounded-full ring-offset-2 ring-offset-background transition-all",
                          selectedColor === color && "ring-2 ring-foreground"
                        )}
                        style={{ backgroundColor: color }}
                        aria-label={`Choisir la couleur ${color}`}
                      />
                    ))}
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {isEditing ? "Enregistrer" : "Créer"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
