import { AppSidebar } from "@/components/AppSidebar"
import { CategoryBarChart } from "@/components/admin/CategoryBarChart"
import { RecentReportsTable } from "@/components/admin/RecentReportsTable"
import { StatisticCardsFigma } from "@/components/admin/StatisticCardsFigma"
import { TrendLineChart } from "@/components/admin/TrendLineChart"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/ThemeToggle"
import Clock02 from "@/components/Clock02"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { api, isHandledApiError } from "@/lib/api-client"

export default function StatisticsPage() {
  const [summary, setSummary] = useState({
    total: 0,
    selesai: 0,
    diproses: 0,
    menunggu: 0,
  })
  
  const [categoryChartData, setCategoryChartData] = useState<any[]>([])
  const [trendData, setTrendData] = useState<any[]>([])
  const [latestReports, setLatestReports] = useState<any[]>([])

  useEffect(() => {
    const loadStats = async () => {
      try {
        const result = await api.get<{
          data?: {
            summary: any
            categoryData: any[]
            trendDataMonthly: any[]
            latestReports: any[]
          }
        }>("/api/admin/stats", {
          fallbackMessage: "Gagal memuat statistik laporan",
          showErrorToast: true,
        })

        if (!result.data) {
          return
        }

        const data = result.data

        setSummary(data.summary || { total: 0, selesai: 0, diproses: 0, menunggu: 0 })
        setCategoryChartData(data.categoryData || [])
        setTrendData(data.trendDataMonthly || [])
        setLatestReports(data.latestReports || [])
        
      } catch (error) {
        if (!isHandledApiError(error)) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Gagal memuat statistik laporan"
          )
        }
        console.error("Gagal memuat statistik laporan:", error)
      }
    }

    void loadStats()
  }, [])


  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-slate-50/50 dark:bg-background">
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

        <div className="flex flex-1 flex-col gap-8 p-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Analitik SULA Kota Surakarta
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Ringkasan data laporan masyarakat secara real-time
            </p>
          </div>
          <StatisticCardsFigma summary={summary} />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <CategoryBarChart data={categoryChartData} />
            <TrendLineChart data={trendData} />
          </div>
          <RecentReportsTable rows={latestReports} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
