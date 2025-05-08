"use client"

import { Avatar, AvatarFallback } from "./ui/avatar"
import { ChevronRight, ChevronsUpDown, Moon, Sun } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"

import Image from "next/image"
import Link from "next/link"
import { ROUTES } from "@/routes"
import SignoutDialog from "./signout-dialog"
import logo from "@/assets/logo.webp"
import { useIsMobile } from "@/hooks/use-mobile"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { useUserStore } from "@/store/user.store"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const isActive = (path: string) => pathname === path
  const isMobile = useIsMobile()

  const { userdata } = useUserStore()

  const { setTheme } = useTheme()

  const { isMobile: isSidebarMobile, setOpenMobile } = useSidebar()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-white text-sidebar-primary-foreground flex aspect-square size-8 p-1 items-center justify-center rounded-lg">
                <Image
                  src={logo}
                  alt="Logo de Luz Verde Chillar"
                  className="rounded-full"
                  id="luz_verde_chillar_logo"
                />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Luz Verde Chillar</span>
                <span className="truncate text-xs">
                  Generador de presupuestos
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Inicio</SidebarGroupLabel>
          <SidebarMenu>
            {ROUTES.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  tooltip={item.title}
                  isActive={isActive(item.path)}
                  asChild
                >
                  <Link
                    href={item.path}
                    onClick={() => {
                      if (isSidebarMobile) setOpenMobile(false)
                    }}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu key={"dropdown-menu"}>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground cursor-pointer"
                >
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback className="rounded-lg">YM</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">
                      {userdata?.firstName} {userdata?.lastName}
                    </span>
                    <span className="truncate text-xs">
                      {userdata?.username}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarFallback className="rounded-lg">YM</AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">
                        {userdata?.firstName} {userdata?.lastName}
                      </span>
                      <span className="truncate text-xs">
                        {userdata?.username}
                      </span>
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <DropdownMenuItem className="cursor-pointer">
                      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                      Tema
                    </DropdownMenuItem>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => setTheme("light")}>
                      Claro
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("dark")}>
                      Oscuro
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setTheme("system")}>
                      Sistema
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <SignoutDialog />
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
