import { AppSidebar } from "@/components/app-sidebar"
import { KategoriBarChart } from "@/components/kategori-bar-chart"
import { LaporanTerbaruTable } from "@/components/laporan-terbaru-table"
import { StatisticCardsFigma } from "@/components/statistic-cards-figma"
import { TrenLineChart } from "@/components/tren-line-chart"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import Clock from "@/components/clock-02"
import { useEffect, useState } from "react"

type BackendPost = {
  status?: "menunggu" | "diproses" | "selesai" | "ditolak"
}

const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined)?.trim() || ""

const toApiUrl = (path: string) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`

  if (!API_BASE_URL) {
    return normalizedPath
  }

  const normalizedBase = API_BASE_URL.replace(/\/+$/, "")
  const baseEndsWithApi = /\/api$/i.test(normalizedBase)
  const pathStartsWithApi = normalizedPath.startsWith("/api/")

  if (baseEndsWithApi && pathStartsWithApi) {
    return `${normalizedBase}${normalizedPath.replace(/^\/api/, "")}`
  }

  return `${normalizedBase}${normalizedPath}`
}

export default function StatistikPage() {
  const [summary, setSummary] = useState({
    total: 0,
    selesai: 0,
    diproses: 0,
    menunggu: 0,
  })

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetch(toApiUrl("/api/post"))
        const result = await response.json()

        if (!response.ok || !Array.isArray(result.data)) {
          return
        }

        const posts: BackendPost[] = result.data
        const selesai = posts.filter((item) => item.status === "selesai").length
        const diproses = posts.filter((item) => item.status === "diproses").length
        const menunggu = posts.filter((item) => !item.status || item.status === "menunggu").length

        setSummary({
          total: posts.length,
          selesai,
          diproses,
          menunggu,
        })
      } catch (error) {
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
              <Clock />
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
            <KategoriBarChart />
            <TrenLineChart />
          </div>
          <LaporanTerbaruTable />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
