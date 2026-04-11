import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

type TrendLineItem = {
  bulan: string
  total: number
}

type TrenLineChartProps = {
  data?: TrendLineItem[]
}

const fallbackLineData: TrendLineItem[] = [
  { bulan: "JAN", total: 100 },
  { bulan: "FEB", total: 120 },
  { bulan: "MAR", total: 250 },
  { bulan: "APR", total: 130 },
  { bulan: "MEI", total: 400 },
  { bulan: "JUN", total: 180 },
]

const chartConfig = {
  total: {
    label: "Laporan",
    color: "oklch(0.488 0.243 264.376)", // Biru SULA
  },
} satisfies ChartConfig

export function TrenLineChart({ data }: TrenLineChartProps) {
  const lineData = data && data.length > 0 ? data : fallbackLineData

  return (
    <Card className="rounded-2xl border-none shadow-sm flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-8">
        <div>
          <CardTitle className="text-lg font-bold">Tren Laporan Bulanan</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Volume laporan sepanjang tahun</p>
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold">
          <span className="flex size-3 rounded-full bg-primary"></span>
          2023
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        <ChartContainer config={chartConfig} className="h-62.5 w-full">
          <AreaChart accessibilityLayer data={lineData} margin={{ left: 12, right: 12, top: 20 }}>
            <defs>
              <linearGradient id="fadeTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-total)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--color-total)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid 
              vertical={false} 
              strokeDasharray="4 4" 
              strokeWidth={1.5}
              className="stroke-slate-300 dark:stroke-slate-700" 
            />
            <XAxis
              dataKey="bulan"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fill: "var(--foreground)", fillOpacity: 0.65, fontSize: 11, fontWeight: 500 }}
            />
            <YAxis hide domain={[0, "dataMax + 50"]} />
            <ChartTooltip content={<ChartTooltipContent indicator="dot" />} cursor={false} />
            <Area
              dataKey="total"
              type="monotone"
              stroke="var(--color-total)"
              strokeWidth={4}
              fill="url(#fadeTotal)"
              dot={{
                fill: "#ffffff",
                fillOpacity: 1,
                stroke: "var(--color-total)",
                strokeWidth: 3,
                strokeOpacity: 1,
                r: 5,
              }}
              activeDot={{ r: 7, fillOpacity: 1 }}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}