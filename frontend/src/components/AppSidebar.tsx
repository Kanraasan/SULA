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
import { ChartNoAxesColumn, Map, FileText, LayoutDashboard } from "lucide-react"
import { NavUser } from "@/components/NavUser"

const data = {
  user: {
    name: "admin",
    email: "admin@gmail.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
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
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader className="mb-4 p-2">
        <VersionSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="p-3">
          {data.navMain.map((item) => {
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
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
