"use client"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb"
import { ReactNode, useEffect } from "react"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "../ui/sidebar"

import { AppSidebar } from "../app-sidebar"
import { ROUTES } from "@/routes"
import { Separator } from "../ui/separator"
import { UserProps } from "@/types/auth.types"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { useUserStore } from "@/store/user.store"

interface Props {
  children: ReactNode
  className?: string
  userdata: UserProps
}

export default function Screen({ children, className, userdata }: Props) {
  const pathname = usePathname()
  const activePathTitle = ROUTES.find((route) => route.path === pathname)?.title

  const { setUserdata } = useUserStore()

  useEffect(() => {
    if (userdata) setUserdata(userdata)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  Inicio
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{activePathTitle}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <main className={cn("flex px-4 pb-4", className)}>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
