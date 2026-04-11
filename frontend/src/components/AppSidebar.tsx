import * as React from "react"

import { VersionSwitcher } from "@/components/VersionSwitcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { ChartNoAxesColumn, Map, FileText, LayoutDashboard, Settings } from "lucide-react"
import { NavUser } from "@/components/NavUser"

const navMain = [
  {
    name: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Laporan",
    url: "/laporan",
    icon: FileText,
  },
  {
    name: "Statistik",
    url: "/statistik",
    icon: ChartNoAxesColumn,
  },
  {
    name: "Peta Wilayah",
    url: "/peta-wilayah",
    icon: Map,
  },
  {
    name: "Pengaturan",
    url: "/setting",
    icon: Settings,
  },
]

/**
 * Ambil data user dari localStorage/sessionStorage
 * agar sidebar menampilkan nama & email admin yang sedang login
 */
function getStoredUser() {
  const raw = localStorage.getItem("user") || sessionStorage.getItem("user")
  if (!raw) return null

  try {
    return JSON.parse(raw) as {
      username?: string
      email?: string
      nik?: string
      role?: string
    }
  } catch {
    return null
  }
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const storedUser = getStoredUser()

  const userData = {
    name: storedUser?.username || "Admin",
    email: storedUser?.email || "",
    avatar: "/avatars/shadcn.jpg",
  }

  return (
    <Sidebar {...props}>
      <SidebarHeader className="mb-4 p-2">
        <VersionSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="p-3">
          {navMain.map((item) => {
            const isActive = location.pathname === item.url
            return (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton asChild isActive={isActive}>
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.name}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
