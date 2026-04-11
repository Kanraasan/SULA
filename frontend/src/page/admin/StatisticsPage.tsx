import { AppSidebar } from "@/components/AppSidebar"
import { CategoryBarChart } from "@/components/admin/CategoryBarChart"
import { RecentReportsTable } from "@/components/admin/RecentReportsTable"
import { StatisticCardsFigma } from "@/components/admin/StatisticCardsFigma"
import { TrendLineChart } from "@/components/admin/TrendLineChart"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import Clock02 from "@/components/Clock02"

export default function StatisticsPage() {
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
          <StatisticCardsFigma />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <CategoryBarChart />
            <TrendLineChart />
          </div>
          <RecentReportsTable />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
