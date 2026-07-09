import { toast } from "sonner"

/** Logs an unexpected error, shows a toast, and rethrows so callers can react (e.g. keep a dialog open). */
export function reportError(message: string, error: unknown): never {
  console.error(message, error)
  toast.error(message)
  throw error instanceof Error ? error : new Error(message)
}
