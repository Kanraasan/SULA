import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const recentReports = [
  { id: "#REP-202301", kategori: "Infrastruktur", ket: "Pipa air pecah di blok A", status: "SELESAI", tgl: "Oct 24, 2023" },
  { id: "#REP-202302", kategori: "Kebersihan", ket: "Sampah menumpuk di taman", status: "DIPROSES", tgl: "Oct 25, 2023" },
]

export function RecentReportsTable() {
  return (
    <Card className="rounded-2xl border-none shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between border-b px-6 py-5">
        <CardTitle className="text-lg font-bold">Laporan Terbaru</CardTitle>
        <Button variant="link" className="text-primary dark:text-blue-600 font-semibold px-0">
          Lihat Semua
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-slate-50/50 dark:bg-slate-900/50">
            <TableRow className="border-b-0">
              <TableHead className="px-6 py-4 text-xs font-bold tracking-wider">ID LAPORAN</TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold tracking-wider">KATEGORI</TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold tracking-wider">KETERANGAN</TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold tracking-wider">STATUS</TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold tracking-wider">TANGGAL</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentReports.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="px-6 py-5 font-semibold">{row.id}</TableCell>
                <TableCell className="px-6 py-5">{row.kategori}</TableCell>
                <TableCell className="px-6 py-5 text-muted-foreground">{row.ket}</TableCell>
                <TableCell className="px-6 py-5">
                  <Badge 
                    variant={
                      row.status === "SELESAI" 
                        ? "selesai" 
                        : row.status === "DIPROSES" 
                          ? "diproses" 
                          : "menunggu"
                    }
                    className="font-semibold text-[10px] tracking-wider uppercase"
                  >
                    {row.status}
                  </Badge>
                </TableCell>
                <TableCell className="px-6 py-5">{row.tgl}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}