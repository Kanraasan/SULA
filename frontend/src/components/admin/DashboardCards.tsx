import { CheckCircle2, Clock3, ClipboardList, CalendarClock } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type DashboardSummary = {
  total: number
  diproses: number
  selesai: number
  menunggu: number
}

type DashboardCardsProps = {
  summary: DashboardSummary
  laporanHariIni: number
}

export function DashboardCards({ summary, laporanHariIni }: DashboardCardsProps) {
  const progressRate =
    summary.total > 0 ? (summary.diproses / summary.total) * 100 : 0
  const selesaiRate =
    summary.total > 0 ? (summary.selesai / summary.total) * 100 : 0

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card">
        <CardHeader>
          <div className="mb-2 flex items-center gap-2 text-primary">
            <ClipboardList className="size-4" />
            <CardDescription>Total Laporan</CardDescription>
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {summary.total.toLocaleString("id-ID")}
          </CardTitle>
          <Badge variant="outline" className="w-fit text-xs text-muted-foreground">
            Menunggu Validasi: {summary.menunggu.toLocaleString("id-ID")}
          </Badge>
        </CardHeader>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <div className="mb-2 flex items-center gap-2 text-primary">
            <CalendarClock className="size-4" />
            <CardDescription>Laporan Masuk Hari Ini</CardDescription>
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {laporanHariIni.toLocaleString("id-ID")}
          </CardTitle>
          <Badge variant="outline" className="w-fit text-xs text-muted-foreground">
            Update harian realtime
          </Badge>
        </CardHeader>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <div className="mb-2 flex items-center gap-2 text-primary">
            <Clock3 className="size-4" />
            <CardDescription>Sedang Diproses</CardDescription>
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {summary.diproses.toLocaleString("id-ID")}
          </CardTitle>
          <Badge variant="outline" className="w-fit text-xs text-muted-foreground">
            {progressRate.toFixed(1)}% dari total
          </Badge>
        </CardHeader>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <div className="mb-2 flex items-center gap-2 text-primary">
            <CheckCircle2 className="size-4" />
            <CardDescription>Laporan Selesai</CardDescription>
          </div>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {summary.selesai.toLocaleString("id-ID")}
          </CardTitle>
          <Badge variant="outline" className="w-fit text-xs text-muted-foreground">
            {selesaiRate.toFixed(1)}% dari total
          </Badge>
        </CardHeader>
      </Card>
    </div>
  )
}