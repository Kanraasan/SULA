"use client"

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

type KategoriChartItem = {
  kategori: string
  jumlah: number
}

type KategoriBarChartProps = {
  data?: KategoriChartItem[]
}

const fallbackChartData: KategoriChartItem[] = [
  { kategori: "Infrastruktur", jumlah: 452 },
  { kategori: "Kebersihan", jumlah: 298 },
  { kategori: "Fasilitas", jumlah: 360 },
  { kategori: "Lingkungan", jumlah: 174 },
]

const chartConfig = {
  jumlah: {
    label: "Jumlah Laporan",
    color: "oklch(0.488 0.243 264.376)", // Biru SULA
  },
} satisfies ChartConfig

export function CategoryBarChart({ data }: KategoriBarChartProps) {
  const chartData = data && data.length > 0 ? data : fallbackChartData
  return (
    <Card className="rounded-2xl border-none shadow-sm flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-8">
        <div>
          <CardTitle className="text-lg font-bold">Laporan per Kategori</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Berdasarkan klasifikasi masalah</p>
        </div>
        <Select defaultValue="7hari">
          <SelectTrigger className="w-35 h-9 rounded-xl bg-slate-50 dark:bg-slate-900 border-none shadow-none">
            <SelectValue placeholder="Pilih waktu" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="7hari">7 Hari Terakhir</SelectItem>
            <SelectItem value="30hari">30 Hari Terakhir</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        <ChartContainer config={chartConfig} className="h-62.5 w-full">
          <BarChart accessibilityLayer data={chartData} margin={{ top: 20 }}>
            <CartesianGrid vertical={false} strokeDasharray="4 4" className="stroke-slate-300 dark:stroke-slate-700" />
            <XAxis
              dataKey="kategori"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tick={{ fill: "var(--foreground)", fillOpacity: 0.65, fontSize: 11, fontWeight: 500 }}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="jumlah" fill="var(--color-jumlah)" radius={[6, 6, 0, 0]} barSize={40}>
              <LabelList dataKey="jumlah" position="top" className="fill-foreground font-bold text-sm" offset={10} />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}