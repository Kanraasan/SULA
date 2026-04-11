import { AppSidebar } from "@/components/AppSidebar"
import { CategoryBarChart } from "@/components/admin/CategoryBarChart"
import { RecentReportsTable } from "@/components/admin/RecentReportsTable"
import { StatisticCardsFigma } from "@/components/admin/StatisticCardsFigma"
import { TrendLineChart } from "@/components/admin/TrendLineChart"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import Clock02 from "@/components/Clock02"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { api, isHandledApiError } from "@/lib/api-client"

type BackendPost = {
  id: string
  title: string
  category: string
  description: string
  createdAt: string
  status?: "menunggu" | "diproses" | "selesai" | "ditolak"
}

export default function StatisticsPage() {
  const [posts, setPosts] = useState<BackendPost[]>([])
  const [summary, setSummary] = useState({
    total: 0,
    selesai: 0,
    diproses: 0,
    menunggu: 0,
  })

  useEffect(() => {
    const loadStats = async () => {
      try {
        const result = await api.get<{ data?: BackendPost[] }>("/api/report", {
          fallbackMessage: "Gagal memuat statistik laporan",
          showErrorToast: true,
        })

        if (!Array.isArray(result.data)) {
          return
        }

        const loadedPosts: BackendPost[] = result.data
        const selesai = loadedPosts.filter((item) => item.status === "selesai").length
        const diproses = loadedPosts.filter((item) => item.status === "diproses").length
        const menunggu = loadedPosts.filter(
          (item) => !item.status || item.status === "menunggu"
        ).length

        setPosts(loadedPosts)
        setSummary({
          total: loadedPosts.length,
          selesai,
          diproses,
          menunggu,
        })
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

  const categoryChartData = useMemo(() => {
    const normalizedLabel: Record<string, string> = {
      infrastruktur: "Infrastruktur",
      kebersihan: "Kebersihan",
      penerangan: "Penerangan",
      ketertiban: "Ketertiban",
      fasilitas_publik: "Fasilitas",
      fasilitas: "Fasilitas",
      pelayanan: "Pelayanan",
      bencana: "Bencana",
      lingkungan: "Lingkungan",
    }

    const grouped = posts.reduce<Record<string, number>>((acc, post) => {
      const key = (post.category || "lainnya").toLowerCase()
      const label = normalizedLabel[key] || "Lainnya"
      acc[label] = (acc[label] || 0) + 1
      return acc
    }, {})

    return Object.entries(grouped)
      .map(([kategori, jumlah]) => ({ kategori, jumlah }))
      .sort((a, b) => b.jumlah - a.jumlah)
      .slice(0, 6)
  }, [posts])

  const trendData = useMemo(() => {
    const monthFormatter = new Intl.DateTimeFormat("id-ID", { month: "short" })
    const grouped = posts.reduce<Record<string, number>>((acc, post) => {
      const date = new Date(post.createdAt)
      if (Number.isNaN(date.getTime())) return acc

      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {})

    return Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([key, total]) => {
        const [year, month] = key.split("-")
        const date = new Date(Number(year), Number(month) - 1, 1)
        return {
          bulan: monthFormatter.format(date).toUpperCase(),
          total,
        }
      })
  }, [posts])

  const latestReports = useMemo(() => {
    const statusMap: Record<
      string,
      "SELESAI" | "DIPROSES" | "MENUNGGU" | "DITOLAK"
    > = {
      selesai: "SELESAI",
      diproses: "DIPROSES",
      ditolak: "DITOLAK",
      menunggu: "MENUNGGU",
    }

    return [...posts]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 8)
      .map((post) => ({
        id: `#${post.id.slice(0, 8).toUpperCase()}`,
        kategori: post.category,
        ket: post.title,
        status: statusMap[post.status || "menunggu"] || "MENUNGGU",
        tgl: new Date(post.createdAt).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
      }))
  }, [posts])


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
