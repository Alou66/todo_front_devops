import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { TASK_PRIORITIES, TASK_STATUSES } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { MemberAvatar } from "@/components/shared/MemberAvatar"

import { useTasksStore } from "@/features/tasks/store/tasks.store"
import { useMembersStore } from "@/features/members/store/members.store"
import { useLabelsStore } from "@/features/labels/store/labels.store"
import type { Task, TaskStatus } from "@/features/tasks/types"

const taskFormSchema = z.object({
  title: z.string().trim().min(2, "Le titre doit contenir au moins 2 caractères.").max(120),
  description: z.string().max(2000).optional(),
  status: z.enum(["todo", "in_progress", "done"]),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  dueDate: z.string().nullable(),
  assigneeId: z.string().nullable(),
  labelIds: z.array(z.string()),
})

type TaskFormValues = z.infer<typeof taskFormSchema>

function buildDefaultValues(task: Task | undefined, defaultStatus: TaskStatus): TaskFormValues {
  return {
    title: task?.title ?? "",
    description: task?.description ?? "",
    status: task?.status ?? defaultStatus,
    priority: task?.priority ?? "medium",
    dueDate: task?.dueDate ?? null,
    assigneeId: task?.assigneeId ?? null,
    labelIds: task?.labelIds ?? [],
  }
}

export function TaskDialog({
  open,
  onOpenChange,
  task,
  defaultStatus = "todo",
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  task?: Task
  defaultStatus?: TaskStatus
}) {
  const addTask = useTasksStore((s) => s.addTask)
  const editTask = useTasksStore((s) => s.editTask)
  const members = useMembersStore((s) => s.members)
  const labels = useLabelsStore((s) => s.labels)

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: buildDefaultValues(task, defaultStatus),
  })

  useEffect(() => {
    if (open) {
      form.reset(buildDefaultValues(task, defaultStatus))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, task])

  const isEditing = Boolean(task)

  async function onSubmit(values: TaskFormValues) {
    const payload = { ...values, description: values.description ?? "" }
    if (task) {
      await editTask(task.id, payload)
    } else {
      await addTask(payload)
    }
    onOpenChange(false)
  }

  const selectedLabelIds = form.watch("labelIds")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Modifier la tâche" : "Nouvelle tâche"}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Mettez à jour les informations de cette tâche."
              : "Ajoutez une nouvelle tâche pour votre équipe."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titre</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex : Préparer la réunion client" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Détails, contexte, liens utiles..."
                      className="min-h-20 resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Statut</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TASK_STATUSES.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priorité</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TASK_PRIORITIES.map((priority) => (
                          <SelectItem key={priority.value} value={priority.value}>
                            {priority.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="assigneeId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigné à</FormLabel>
                    <Select
                      value={field.value ?? "none"}
                      onValueChange={(value) => field.onChange(value === "none" ? null : value)}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Personne" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">Non assignée</SelectItem>
                        {members.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            <MemberAvatar member={member} className="size-5" />
                            {member.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Échéance</FormLabel>
                    <Popover>
                      <PopoverTrigger
                        render={
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          />
                        }
                      >
                        <CalendarIcon className="size-4" />
                        {field.value
                          ? format(new Date(field.value), "d MMM yyyy", { locale: fr })
                          : "Aucune date"}
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          locale={fr}
                          selected={field.value ? new Date(field.value) : undefined}
                          onSelect={(date) =>
                            field.onChange(date ? format(date, "yyyy-MM-dd") : null)
                          }
                        />
                        {field.value && (
                          <div className="border-t p-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full"
                              onClick={() => field.onChange(null)}
                            >
                              Effacer la date
                            </Button>
                          </div>
                        )}
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="labelIds"
              render={() => (
                <FormItem>
                  <FormLabel>Étiquettes</FormLabel>
                  <div className="flex flex-wrap gap-1.5">
                    {labels.map((label) => {
                      const isActive = selectedLabelIds.includes(label.id)
                      return (
                        <button
                          key={label.id}
                          type="button"
                          onClick={() => {
                            const next = isActive
                              ? selectedLabelIds.filter((id) => id !== label.id)
                              : [...selectedLabelIds, label.id]
                            form.setValue("labelIds", next, { shouldDirty: true })
                          }}
                          className={cn(
                            "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                            isActive
                              ? "border-transparent text-white"
                              : "border-input text-muted-foreground hover:bg-muted"
                          )}
                          style={isActive ? { backgroundColor: label.color } : undefined}
                        >
                          {label.name}
                        </button>
                      )
                    })}
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {isEditing ? "Enregistrer" : "Créer la tâche"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
