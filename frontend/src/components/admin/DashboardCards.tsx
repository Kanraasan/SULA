import { TrendingUp, TrendingDown, Clock } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function DashboardCards() {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      
      {/* KARTU 1: Total Keluhan Masuk */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Keluhan Masuk</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            1,540
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-green-600">
              <TrendingUp className="mr-1 size-3" />
              +5.2%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Peningkatan bulan ini <TrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Berdasarkan data 6 bulan terakhir
          </div>
        </CardFooter>
      </Card>

      {/* KARTU 2: Keluhan dalam Proses */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Keluhan dalam Proses</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            320
          </CardTitle>
          <CardAction>
            {/* Tren turun di sini berarti bagus (tanggungan berkurang) */}
            <Badge variant="outline" className="text-blue-600 dark:text-blue-500">
              <TrendingDown className="mr-1 size-3" />
              -10%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Tanggungan berkurang <TrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Fokus selesaikan laporan terlama
          </div>
        </CardFooter>
      </Card>

      {/* KARTU 3: Keluhan Selesai */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Keluhan Selesai (Resolved)</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            1,180
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-green-600">
              <TrendingUp className="mr-1 size-3" />
              +12.5%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Tingkat penyelesaian tinggi <TrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Memenuhi target SLA bulanan</div>
        </CardFooter>
      </Card>

      {/* KARTU 4: Rata-rata Waktu Respons */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Rata-rata Waktu Respons</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            2.5 Jam
          </CardTitle>
          <CardAction>
            <Badge variant="outline" className="text-green-600">
              <TrendingDown className="mr-1 size-3" />
              -1.5 Jam
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Performa admin membaik <Clock className="size-4" />
          </div>
          <div className="text-muted-foreground">Standar pelayanan terpenuhi</div>
        </CardFooter>
      </Card>

    </div>
  )
}