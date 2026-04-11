import { ThemeToggle } from "@/components/ThemeToggle"
import { Button } from "@/components/ui/button"
import { Bell, UserCircle, Megaphone, LogOut, User, Settings, FileText } from "lucide-react"
import { useLocation, Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/useAuth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function UserNavbar() {
  const location = useLocation()
  const { user, logout } = useAuth()

  const navItems = [
    { label: "Dashboard", path: "/" },
    ...(user ? [
      { label: "Buat Laporan", path: "/report-form" },
      { label: "Status Laporan", path: "/status-laporan" },
    ] : []),
    { label: "Leaderboard", path: "/leaderboard" },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center px-4 md:px-8">
        <Link to="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
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
                    ? "font-bold text-primary dark:text-blue-600" 
                    : "font-medium text-muted-foreground hover:text-primary dark:hover:text-blue-600"
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
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors">
                <UserCircle className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {user ? (
                <>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.username}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        NIK: {user.nik}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/user-settings" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profil Saya</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/my-reports" className="cursor-pointer">
                      <FileText className="mr-2 h-4 w-4" />
                      <span>Laporan Saya</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/user-settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Pengaturan</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-destructive focus:text-destructive cursor-pointer"
                    onClick={logout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Keluar</span>
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuLabel className="font-normal text-muted-foreground">
                    Halo, Warga!
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/login" className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4 rotate-180" />
                      <span>Log In</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/register" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Daftar Akun</span>
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}
