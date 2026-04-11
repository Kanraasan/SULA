import { AppSidebar } from "@/components/AppSidebar"
import { ChartAreaInteractive } from "@/components/ChartAreaInteractive"
import { DashboardCards } from "@/components/admin/DashboardCards"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/ThemeToggle"
import Clock02 from "@/components/Clock02"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { api, isHandledApiError } from "@/lib/api-client"

type BackendPost = {
  created_at: string
  status?: "menunggu" | "diproses" | "selesai" | "ditolak"
}

export default function DashboardPage() {
  const [posts, setPosts] = useState<BackendPost[]>([])

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const result = await api.get<{ data?: BackendPost[] }>("/api/report", {
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

  const laporanHariIni = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return posts.filter((item) => {
      const createdAt = new Date(item.created_at)
      createdAt.setHours(0, 0, 0, 0)
      return createdAt.getTime() === today.getTime()
    }).length
  }, [posts])

  const summary = useMemo(() => {
    const selesai = posts.filter((item) => item.status === "selesai").length
    const diproses = posts.filter((item) => item.status === "diproses").length
    const menunggu = posts.filter(
      (item) => !item.status || item.status === "menunggu"
    ).length

    return {
      total: posts.length,
      selesai,
      diproses,
      menunggu,
    }
  }, [posts])

  const trendData = useMemo(() => {
    const grouped = posts.reduce<
      Record<string, { baru: number; diproses: number; selesai: number }>
    >((acc, item) => {
      const date = new Date(item.created_at)
      if (Number.isNaN(date.getTime())) return acc

      const dateKey = date.toISOString().slice(0, 10)
      if (!acc[dateKey]) {
        acc[dateKey] = { baru: 0, diproses: 0, selesai: 0 }
      }

      const status = item.status || "menunggu"
      if (status === "diproses") {
        acc[dateKey].diproses += 1
      } else if (status === "selesai") {
        acc[dateKey].selesai += 1
      } else {
        acc[dateKey].baru += 1
      }

      return acc
    }, {})

    return Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, value]) => ({ date, ...value }))
      .slice(-90)
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
            <Clock02 />
            <ThemeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <DashboardCards summary={summary} laporanHariIni={laporanHariIni} />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive data={trendData} />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
