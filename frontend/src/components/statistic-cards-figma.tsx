import { BarChart3, CheckCircle2, ClipboardList, AlertCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function StatisticCardsFigma() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {/* Kartu 1: Total */}
      <Card className="p-5 flex flex-col justify-between rounded-2xl border-none shadow-sm">
        <div className="flex items-start justify-between">
          <div className="rounded-xl bg-blue-100 p-2.5 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
            <BarChart3 className="size-5" />
          </div>
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-500/20 dark:text-emerald-400">
            +12%
          </Badge>
        </div>
        <div className="mt-4">
          <p className="text-sm font-medium text-muted-foreground">Total Laporan</p>
          <h3 className="text-3xl font-bold mt-1">1,284</h3>
        </div>
      </Card>

      {/* Kartu 2: Selesai */}
      <Card className="p-5 flex flex-col justify-between rounded-2xl border-none shadow-sm text-foreground bg-card">
        <div className="flex items-start justify-between">
          <div className="rounded-xl bg-green-100 p-2.5 text-green-600 dark:bg-green-900/30 dark:text-green-400">
            <CheckCircle2 className="size-5" />
          </div>
          <Badge variant="selesai" className="text-[10px]">
            +8.4%
          </Badge>
        </div>
        <div className="mt-4">
          <p className="text-sm font-medium text-muted-foreground">Selesai</p>
          <h3 className="text-3xl font-bold mt-1">856</h3>
        </div>
      </Card>

      {/* Kartu 3: Diproses */}
      <Card className="p-5 flex flex-col justify-between rounded-2xl border-none shadow-sm text-foreground bg-card">
        <div className="flex items-start justify-between">
          <div className="rounded-xl bg-yellow-100 p-2.5 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400">
            <ClipboardList className="size-5" />
          </div>
          <Badge variant="diproses" className="text-[10px]">
            -5.1%
          </Badge>
        </div>
        <div className="mt-4">
          <p className="text-sm font-medium text-muted-foreground">Diproses</p>
          <h3 className="text-3xl font-bold mt-1">312</h3>
        </div>
      </Card>

      {/* Kartu 4: Menunggu */}
      <Card className="p-5 flex flex-col justify-between rounded-2xl border-none shadow-sm text-foreground bg-card">
        <div className="flex items-start justify-between">
          <div className="rounded-xl bg-red-100 p-2.5 text-red-600 dark:bg-red-900/30 dark:text-red-400">
            <AlertCircle className="size-5" />
          </div>
          <Badge variant="menunggu" className="text-[10px]">
            -2.3%
          </Badge>
        </div>
        <div className="mt-4">
          <p className="text-sm font-medium text-muted-foreground">Menunggu</p>
          <h3 className="text-3xl font-bold mt-1">116</h3>
        </div>
      </Card>
    </div>
  )
}