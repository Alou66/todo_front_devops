import { createBrowserRouter } from "react-router-dom"
import { AppLayout } from "@/components/layout/AppLayout"
import { BoardPage } from "@/pages/BoardPage"
import { TeamPage } from "@/pages/TeamPage"
import { LabelsPage } from "@/pages/LabelsPage"
import { NotFoundPage } from "@/pages/NotFoundPage"

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <BoardPage /> },
      { path: "/equipe", element: <TeamPage /> },
      { path: "/etiquettes", element: <LabelsPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
])
