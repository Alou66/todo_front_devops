import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { cn } from "@/lib/utils"
import { MEMBER_COLORS } from "@/lib/constants"
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

import { useMembersStore } from "@/features/members/store/members.store"
import type { Member } from "@/features/members/types"

const memberFormSchema = z.object({
  name: z.string().trim().min(2, "Le nom doit contenir au moins 2 caractères."),
  email: z.email("Adresse e-mail invalide."),
  role: z.string().trim().min(2, "Précisez le rôle ou le service."),
  color: z.string(),
})

type MemberFormValues = z.infer<typeof memberFormSchema>

function buildDefaultValues(member: Member | undefined): MemberFormValues {
  return {
    name: member?.name ?? "",
    email: member?.email ?? "",
    role: member?.role ?? "",
    color: member?.color ?? MEMBER_COLORS[0],
  }
}

export function MemberFormDialog({
  open,
  onOpenChange,
  member,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  member?: Member
}) {
  const addMember = useMembersStore((s) => s.addMember)
  const editMember = useMembersStore((s) => s.editMember)

  const form = useForm<MemberFormValues>({
    resolver: zodResolver(memberFormSchema),
    defaultValues: buildDefaultValues(member),
  })

  useEffect(() => {
    if (open) form.reset(buildDefaultValues(member))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, member])

  const isEditing = Boolean(member)
  const selectedColor = form.watch("color")

  async function onSubmit(values: MemberFormValues) {
    if (member) {
      await editMember(member.id, values)
    } else {
      await addMember(values)
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Modifier le membre" : "Ajouter un membre"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Mettez à jour les informations de ce membre."
              : "Invitez un nouveau membre à rejoindre l'équipe MadiShop."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom complet</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex : Fatou Diop" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Adresse e-mail</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="prenom.nom@madishop.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rôle / service</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex : Développeur, Marketing..." {...field} />
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
                    {MEMBER_COLORS.map((color) => (
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
                {isEditing ? "Enregistrer" : "Ajouter"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
