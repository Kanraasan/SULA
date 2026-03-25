"use client"

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartData = [
  { kategori: "Infrastruktur", jumlah: 452 },
  { kategori: "Kebersihan", jumlah: 298 },
  { kategori: "Fasilitas", jumlah: 360 },
  { kategori: "Lingkungan", jumlah: 174 },
]

const chartConfig = {
  jumlah: {
    label: "Jumlah Laporan",
    color: "hsl(var(--primary))", // Warna biru SULA
  },
} satisfies ChartConfig

export function KategoriBarChart() {
  return (
    <Card className="rounded-2xl border-none shadow-sm flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-8">
        <div>
          <CardTitle className="text-lg font-bold">Laporan per Kategori</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">Berdasarkan klasifikasi masalah</p>
        </div>
        <Select defaultValue="7hari">
          <SelectTrigger className="w-[140px] h-9 rounded-xl bg-slate-50 dark:bg-slate-900 border-none shadow-none">
            <SelectValue placeholder="Pilih waktu" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="7hari">7 Hari Terakhir</SelectItem>
            <SelectItem value="30hari">30 Hari Terakhir</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        <ChartContainer config={chartConfig} className="h-[250px] w-full">
          <BarChart accessibilityLayer data={chartData} margin={{ top: 20 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
            <XAxis
              dataKey="kategori"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              className="text-xs font-medium"
            />
            <ChartTooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="jumlah" fill="var(--color-jumlah)" radius={[6, 6, 0, 0]} barSize={40}>
              <LabelList dataKey="jumlah" position="top" className="fill-primary font-bold text-sm" offset={10} />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}