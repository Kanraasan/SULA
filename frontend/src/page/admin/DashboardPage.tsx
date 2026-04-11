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

export default function DashboardPage() {
  const [summary, setSummary] = useState({
    total: 0,
    selesai: 0,
    diproses: 0,
    menunggu: 0,
  })
  const [laporanHariIni, setLaporanHariIni] = useState(0)
  const [trendData, setTrendData] = useState<any[]>([])

  useEffect(() => {
    const loadStats = async () => {
      try {
        const result = await api.get<{
          data?: {
            summary: any
            todayCount: number
            trendDataDaily: any[]
          }
        }>("/api/admin/stats", {
          fallbackMessage: "Gagal memuat ringkasan dashboard",
          showErrorToast: true,
        })

        if (result.data) {
          setSummary(result.data.summary || { total: 0, selesai: 0, diproses: 0, menunggu: 0 })
          setLaporanHariIni(result.data.todayCount || 0)
          setTrendData(result.data.trendDataDaily || [])
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

    void loadStats()
  }, [])

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
