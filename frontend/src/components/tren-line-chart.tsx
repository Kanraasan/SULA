import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const lineData = [
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
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export function TrenLineChart() {
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
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <LineChart accessibilityLayer data={lineData} margin={{ left: 12, right: 12 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
            <XAxis
              dataKey="bulan"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              className="text-xs font-medium text-muted-foreground"
            />
            <YAxis hide domain={[0, "dataMax + 50"]} />
            <ChartTooltip content={<ChartTooltipContent indicator="dot" />} cursor={false} />
            <Line
              dataKey="total"
              type="stepAfter"
              stroke="hsl(var(--primary))"
              strokeWidth={4}
              isAnimationActive={false}
              dot={{
                fill: "hsl(var(--background))",
                stroke: "hsl(var(--primary))",
                strokeWidth: 3,
                r: 5,
              }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}