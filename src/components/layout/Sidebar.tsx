import { NavLink } from "react-router-dom"
import { KanbanSquare, ShoppingBag, Tag, Users } from "lucide-react"
import { cn } from "@/lib/utils"

const NAV_ITEMS = [
  { to: "/", label: "Tableau des tâches", icon: KanbanSquare, end: true },
  { to: "/equipe", label: "Équipe", icon: Users, end: false },
  { to: "/etiquettes", label: "Étiquettes", icon: Tag, end: false },
]

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-1 flex-col gap-1 p-3">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )
          }
        >
          <item.icon className="size-4" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}

export function SidebarBrand() {
  return (
    <div className="flex items-center gap-2 px-4 py-4">
      <div className="flex size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
        <ShoppingBag className="size-4.5" />
      </div>
      <div className="leading-tight">
        <p className="text-sm font-semibold text-sidebar-foreground">MadiShop Alou</p>
        <p className="text-xs text-sidebar-foreground/60">Gestion des tâches alou</p>
      </div>
    </div>
  )
}

export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:flex">
      <SidebarBrand />
      <SidebarNav />
      <div className="border-t border-sidebar-border p-4 text-xs text-sidebar-foreground/50">
        © {new Date().getFullYear()} MadiShop
      </div>
    </aside>
  )
}
