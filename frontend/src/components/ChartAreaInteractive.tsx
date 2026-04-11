"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

export const description = "Tren Keluhan Masyarakat"

type ChartTrendItem = {
  date: string
  baru: number
  diproses: number
  selesai: number
}

type ChartAreaInteractiveProps = {
  data?: ChartTrendItem[]
}

const fallbackChartData: ChartTrendItem[] = [
  { date: "2024-04-01", baru: 222, diproses: 50, selesai: 150 },
  { date: "2024-04-02", baru: 197, diproses: 80, selesai: 180 },
  { date: "2024-04-03", baru: 167, diproses: 120, selesai: 120 },
  { date: "2024-04-04", baru: 242, diproses: 90, selesai: 260 },
  { date: "2024-04-05", baru: 373, diproses: 110, selesai: 290 },
  { date: "2024-04-06", baru: 301, diproses: 140, selesai: 340 },
  { date: "2024-04-07", baru: 245, diproses: 60, selesai: 180 },
  { date: "2024-04-08", baru: 409, diproses: 150, selesai: 320 },
  { date: "2024-04-09", baru: 159, diproses: 70, selesai: 110 },
  { date: "2024-04-10", baru: 261, diproses: 90, selesai: 190 },
  // ... Lanjutkan sisa tanggal di sini ...
]

// Konfigurasi warna untuk 3 status keluhan menggunakan nuansa biru SULA
const chartConfig = {
  keluhan: {
    label: "Total Keluhan",
  },
  baru: {
    label: "Laporan Baru",
    color: "oklch(0.7 0.15 264.376)", // Biru Muda
  },
  diproses: {
    label: "Sedang Diproses",
    color: "oklch(0.55 0.2 264.376)", // Biru Menengah
  },
  selesai: {
    label: "Selesai",
    color: "oklch(0.488 0.243 264.376)", // Biru SULA (Primary)
  },
} satisfies ChartConfig

export function ChartAreaInteractive({ data }: ChartAreaInteractiveProps) {
  const isMobile = useIsMobile()
  const [timeRange, setTimeRange] = React.useState("90d")

  const sourceData = React.useMemo(() => {
    if (data && data.length > 0) {
      return data
    }

    return fallbackChartData
  }, [data])

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d")
    }
  }, [isMobile])

  const filteredData = sourceData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = sourceData.length
      ? new Date(sourceData[sourceData.length - 1].date)
      : new Date()
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Tren Keluhan Masyarakat</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Distribusi status laporan selama 3 bulan terakhir
          </span>
          <span className="@[540px]/card:hidden">3 Bulan Terakhir</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:px-4! @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">90 Hari</ToggleGroupItem>
            <ToggleGroupItem value="30d">30 Hari</ToggleGroupItem>
            <ToggleGroupItem value="7d">7 Hari</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
            >
              <SelectValue placeholder="90 Hari" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">90 Hari</SelectItem>
              <SelectItem value="30d" className="rounded-lg">30 Hari</SelectItem>
              <SelectItem value="7d" className="rounded-lg">7 Hari</SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-62.5 w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillBaru" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-baru)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-baru)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillDiproses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-diproses)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-diproses)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillSelesai" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-selesai)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-selesai)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="4 4" className="stroke-slate-300 dark:stroke-slate-700" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("id-ID", { // Ubah format ke Indonesia
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("id-ID", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            {/* StackId="a" membuat grafiknya bertumpuk dengan rapi */}
            <Area
              dataKey="selesai"
              type="natural"
              fill="url(#fillSelesai)"
              stroke="var(--color-selesai)"
              stackId="a"
            />
            <Area
              dataKey="diproses"
              type="natural"
              fill="url(#fillDiproses)"
              stroke="var(--color-diproses)"
              stackId="a"
            />
            <Area
              dataKey="baru"
              type="natural"
              fill="url(#fillBaru)"
              stroke="var(--color-baru)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}