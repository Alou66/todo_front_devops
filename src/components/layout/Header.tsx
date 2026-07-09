import { useLocation } from "react-router-dom"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { SidebarBrand, SidebarNav } from "@/components/layout/Sidebar"
import { ThemeToggle } from "@/components/shared/ThemeToggle"

const PAGE_TITLES: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Tableau des tâches",
    description: "Suivez l'avancement des tâches de vos équipes en un coup d'œil.",
  },
  "/equipe": {
    title: "Équipe",
    description: "Gérez les membres qui peuvent recevoir des tâches.",
  },
  "/etiquettes": {
    title: "Étiquettes",
    description: "Créez et gérez les étiquettes utilisées pour classer vos tâches.",
  },
}

export function Header() {
  const location = useLocation()
  const page = PAGE_TITLES[location.pathname] ?? PAGE_TITLES["/"]

  return (
    <header className="flex items-center gap-3 border-b bg-background/80 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:px-6">
      <Sheet>
        <SheetTrigger
          render={
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="Ouvrir le menu" />
          }
        >
          <Menu className="size-5" />
        </SheetTrigger>
        <SheetContent side="left" className="w-64 bg-sidebar p-0 text-sidebar-foreground">
          <SheetTitle className="sr-only">Menu de navigation</SheetTitle>
          <SidebarBrand />
          <SidebarNav />
        </SheetContent>
      </Sheet>

      <div className="min-w-0 flex-1">
        <h1 className="truncate text-base font-semibold md:text-lg">{page.title}</h1>
        <p className="hidden truncate text-sm text-muted-foreground sm:block">
          {page.description}
        </p>
      </div>

      <ThemeToggle />
    </header>
  )
}
