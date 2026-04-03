import { AppSidebar } from "@/components/app-sidebar"
import { KategoriBarChart } from "@/components/kategori-bar-chart"
import { LaporanTerbaruTable } from "@/components/laporan-terbaru-table"
import { StatisticCardsFigma } from "@/components/statistic-cards-figma"
import { TrenLineChart } from "@/components/tren-line-chart"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import Clock from "@/components/clock-02"

export default function StatistikPage() {
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
          <StatisticCardsFigma />
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
