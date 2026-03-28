import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Bell, UserCircle, Megaphone } from "lucide-react"
import { useLocation, Link } from "react-router-dom"
import { cn } from "@/lib/utils"

export function UserNavbar() {
  const location = useLocation()

  const navItems = [
    { label: "Dashboard", path: "/user-dashboard" },
    { label: "Buat Laporan", path: "/report-form" },
    { label: "Status Laporan", path: "#" },
    { label: "Leaderboard", path: "#" },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center px-4 md:px-8">
        <Link to="/user-dashboard" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <Megaphone className="h-5 w-5 -rotate-12" />
          </div>
          <span className="text-xl font-bold tracking-tighter text-foreground">
            SULA
          </span>
        </Link>
        
        <div className="hidden ml-auto flex items-center gap-8 md:flex">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.label}
                to={item.path}
                className={cn(
                  "text-sm transition-colors",
                  isActive 
                    ? "font-bold text-primary" 
                    : "font-medium text-muted-foreground hover:text-primary"
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </div>

        <div className="ml-8 flex items-center gap-3 border-l border-border pl-8">
          <ThemeToggle />
          <Button variant="outline" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors">
            <UserCircle className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  )
}
