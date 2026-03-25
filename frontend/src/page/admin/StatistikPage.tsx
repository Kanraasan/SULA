import { AppSidebar } from "@/components/app-sidebar"
import { KategoriBarChart } from "@/components/kategori-bar-chart"
import { LaporanTerbaruTable } from "@/components/laporan-terbaru-table"
import { StatisticCardsFigma } from "@/components/statistic-cards-figma"
import { TrenLineChart } from "@/components/tren-line-chart"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

export default function StatistikPage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-slate-50/50 dark:bg-background">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h2 className="font-bold">Statistik</h2>
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
