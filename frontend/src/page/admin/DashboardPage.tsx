import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DashboardCards } from "@/components/dashboard-cards"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import Clock from "@/components/clock-02"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { api, isHandledApiError } from "@/lib/api-client"

type BackendPost = {
  createdAt: string
}

export default function DashboardPage() {
  const [posts, setPosts] = useState<BackendPost[]>([])

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const result = await api.get<{ data?: BackendPost[] }>("/api/post", {
          fallbackMessage: "Gagal memuat ringkasan dashboard",
          showErrorToast: true,
        })

        if (Array.isArray(result.data)) {
          setPosts(result.data)
        }
      } catch (error) {
        if (!isHandledApiError(error)) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Gagal memuat ringkasan dashboard"
          )
        }
        console.error("Gagal memuat ringkasan dashboard:", error)
      }
    }

    void loadPosts()
  }, [])

  const totalLaporan = posts.length
  const laporanHariIni = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return posts.filter((item) => {
      const createdAt = new Date(item.createdAt)
      createdAt.setHours(0, 0, 0, 0)
      return createdAt.getTime() === today.getTime()
    }).length
  }, [posts])

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between border-b bg-sidebar px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <h2 className="font-bold">Laporan</h2>
          </div>
          <div className="flex items-center gap-4">
            <Clock />
            <ThemeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <div className="grid grid-cols-1 gap-3 px-4 md:grid-cols-2 lg:px-6">
                <div className="rounded-xl border bg-card p-4">
                  <p className="text-sm text-muted-foreground">Total laporan dari API</p>
                  <p className="mt-1 text-2xl font-bold">{totalLaporan.toLocaleString("id-ID")}</p>
                </div>
                <div className="rounded-xl border bg-card p-4">
                  <p className="text-sm text-muted-foreground">Laporan masuk hari ini</p>
                  <p className="mt-1 text-2xl font-bold">{laporanHariIni.toLocaleString("id-ID")}</p>
                </div>
              </div>
              <DashboardCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
