import { Calendar1, FileText, LucideProps } from "lucide-react"
import { ForwardRefExoticComponent, RefAttributes } from "react"

interface RouteProps {
  path: string
  title: string
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >
}

export const ROUTES: RouteProps[] = [
  {
    path: "/dashboard/estimates",
    title: "Presupuestos",
    icon: FileText,
  },
  {
    path: "/dashboard/schedule",
    title: "Cronograma",
    icon: Calendar1,
  },
]
