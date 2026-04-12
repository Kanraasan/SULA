import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import adminLogo from "@/assets/admin-logo.png"

export function VersionSwitcher() {

  return (
    <SidebarMenu>
      <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="my-1"
            >
              <div className="flex aspect-square size-10 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <img src={adminLogo} alt="Admin Logo" className="w-full" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-bold text-md">SULA</span>
                <span className="text-sm text-muted-foreground">Panel Administrasi</span>
              </div>
            </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
