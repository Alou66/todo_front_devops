import { Link } from "react-router-dom"
import { CompassIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/shared/EmptyState"

export function NotFoundPage() {
  return (
    <div className="flex h-full items-center justify-center">
      <EmptyState
        icon={CompassIcon}
        title="Page introuvable"
        description="La page que vous cherchez n'existe pas ou a été déplacée."
        action={
          <Button size="sm" render={<Link to="/" />}>
            Retour au tableau
          </Button>
        }
      />
    </div>
  )
}
