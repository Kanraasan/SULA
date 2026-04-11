import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table"
import { MoreVertical, ThumbsUp } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useState } from "react"

type Laporan = {
  id: string
  date: string
  reporter: {
    initials: string
    name: string
  }
  complaint: {
    title: string
    category: string
    description: string
  }
  status: "menunggu" | "diproses" | "selesai" | "ditolak"
  upvotes: number
}

export const dataLaporan: Laporan[] = [
  {
    id: "1",
    date: "12 Okt 2023",
    reporter: { initials: "BS", name: "Budi Santoso" },
    complaint: {
      title: "Jalan Berlubang di Jalan Merdeka",
      category: "infrastruktur",
      description: "Berlokasi dekat perempatan, menyebabkan antrean kendaraan.",
    },
    status: "menunggu",
    upvotes: 12,
  },
  {
    id: "2",
    date: "11 Okt 2023",
    reporter: { initials: "SA", name: "Siti Aminah" },
    complaint: {
      title: "Lampu Jalan Rusak",
      category: "penerangan",
      description: "Tiang lampu nomor 45 berkedip lalu padam total.",
    },
    status: "diproses",
    upvotes: 8,
  },
  {
    id: "3",
    date: "10 Okt 2023",
    reporter: { initials: "AW", name: "Agus Wijaya" },
    complaint: {
      title: "Selokan Tersumbat",
      category: "kebersihan",
      description: "Air meluap saat hujan deras di area RT 03.",
    },
    status: "selesai",
    upvotes: 5,
  },
  {
    id: "4",
    date: "9 Okt 2023",
    reporter: { initials: "RM", name: "Rina Marlina" },
    complaint: {
      title: "Ranting Pohon Tumbang",
      category: "bencana",
      description: "Ranting menutup akses jalan setapak dekat balai warga.",
    },
    status: "diproses",
    upvotes: 15,
  },
  {
    id: "5",
    date: "8 Okt 2023",
    reporter: { initials: "JA", name: "Joko Anwar" },
    complaint: {
      title: "Sampah Tidak Diangkut",
      category: "kebersihan",
      description: "Tempat sampah di RT 05 penuh selama tiga hari.",
    },
    status: "menunggu",
    upvotes: 3,
  },
  {
    id: "6",
    date: "7 Okt 2023",
    reporter: { initials: "HR", name: "Heri Ramadhan" },
    complaint: {
      title: "Anjing Liar Berkeliaran",
      category: "ketertiban",
      description: "Sekelompok anjing liar terlihat di sekitar sekolah.",
    },
    status: "menunggu",
    upvotes: 20,
  },
  {
    id: "7",
    date: "6 Okt 2023",
    reporter: { initials: "LN", name: "Lina Nur" },
    complaint: {
      title: "Pipa Air Pecah",
      category: "infrastruktur",
      description: "Pipa air bocor besar di Jalan Slamet Riyadi.",
    },
    status: "selesai",
    upvotes: 45,
  },
  {
    id: "8",
    date: "5 Okt 2023",
    reporter: { initials: "DP", name: "Dedi Putra" },
    complaint: {
      title: "Parkir Liar",
      category: "ketertiban",
      description: "Kendaraan parkir sembarangan menutup gang sempit.",
    },
    status: "diproses",
    upvotes: 2,
  },
  {
    id: "9",
    date: "4 Okt 2023",
    reporter: { initials: "MT", name: "Mita Tiara" },
    complaint: {
      title: "Coretan Vandalisme",
      category: "ketertiban",
      description: "Muncul coretan baru pada dinding taman warga.",
    },
    status: "menunggu",
    upvotes: 7,
  },
  {
    id: "10",
    date: "3 Okt 2023",
    reporter: { initials: "BK", name: "Bambang K." },
    complaint: {
      title: "Ayunan Taman Rusak",
      category: "fasilitas_publik",
      description: "Ayunan di taman bermain tidak aman untuk anak-anak.",
    },
    status: "selesai",
    upvotes: 11,
  },
  {
    id: "11",
    date: "2 Okt 2023",
    reporter: { initials: "FS", name: "Farah S." },
    complaint: {
      title: "Kebisingan Proyek Malam Hari",
      category: "ketertiban",
      description: "Pekerjaan bangunan masih berlangsung lewat pukul 22.00.",
    },
    status: "diproses",
    upvotes: 9,
  },
  {
    id: "12",
    date: "1 Okt 2023",
    reporter: { initials: "GG", name: "Gilang G." },
    complaint: {
      title: "Koloni Kucing Liar",
      category: "kebersihan",
      description: "Jumlah kucing liar terlalu banyak dan mengganggu kebersihan.",
    },
    status: "menunggu",
    upvotes: 3,
  },
  {
    id: "13",
    date: "30 Sep 2023",
    reporter: { initials: "AA", name: "Andi A." },
    complaint: {
      title: "Tutup Manhole Hilang",
      category: "infrastruktur",
      description: "Lubang manhole terbuka dan berbahaya bagi pengendara.",
    },
    status: "diproses",
    upvotes: 33,
  },
  {
    id: "14",
    date: "29 Sep 2023",
    reporter: { initials: "RR", name: "Ria R." },
    complaint: {
      title: "Pembuangan Sampah Liar",
      category: "kebersihan",
      description: "Ada pihak membuang kantong sampah di dekat sungai.",
    },
    status: "menunggu",
    upvotes: 18,
  },
  {
    id: "15",
    date: "28 Sep 2023",
    reporter: { initials: "IK", name: "Iwan K." },
    complaint: {
      title: "Selokan Berbau Menyengat",
      category: "kebersihan",
      description: "Aroma dari saluran pembuangan sangat menyengat hari ini.",
    },
    status: "selesai",
    upvotes: 22,
  },
  {
    id: "16",
    date: "27 Sep 2023",
    reporter: { initials: "TY", name: "Tedy Y." },
    complaint: {
      title: "Papan Informasi Berkedip",
      category: "penerangan",
      description: "Papan informasi publik rusak dan lampunya tidak stabil.",
    },
    status: "menunggu",
    upvotes: 1,
  },
  {
    id: "17",
    date: "26 Sep 2023",
    reporter: { initials: "SP", name: "Sari P." },
    complaint: {
      title: "Ranting Mengenai Kabel",
      category: "bencana",
      description: "Cabang pohon menyangkut pada kabel internet warga.",
    },
    status: "diproses",
    upvotes: 14,
  },
  {
    id: "18",
    date: "25 Sep 2023",
    reporter: { initials: "JM", name: "Joni M." },
    complaint: {
      title: "Jalan Berdebu",
      category: "infrastruktur",
      description: "Lalu lintas truk membuat jalan berlumpur dan berdebu.",
    },
    status: "menunggu",
    upvotes: 5,
  },
  {
    id: "19",
    date: "24 Sep 2023",
    reporter: { initials: "NA", name: "Nina A." },
    complaint: {
      title: "Trotoar Tertutup Pedagang",
      category: "infrastruktur",
      description: "Akses trotoar untuk kursi roda tertutup lapak pedagang.",
    },
    status: "selesai",
    upvotes: 27,
  },
  {
    id: "20",
    date: "23 Sep 2023",
    reporter: { initials: "WW", name: "Wawan W." },
    complaint: {
      title: "Pembatas Jalan Rusak",
      category: "infrastruktur",
      description: "Pembatas jalan patah setelah kecelakaan ringan.",
    },
    status: "menunggu",
    upvotes: 4,
  },
  {
    id: "21",
    date: "22 Sep 2023",
    reporter: { initials: "DS", name: "Dina S." },
    complaint: {
      title: "Sarang Nyamuk",
      category: "kebersihan",
      description: "Genangan air di lahan kosong berpotensi jadi sarang nyamuk.",
    },
    status: "diproses",
    upvotes: 19,
  },
  {
    id: "22",
    date: "21 Sep 2023",
    reporter: { initials: "BN", name: "Beno N." },
    complaint: {
      title: "Pesta Musik Berisik",
      category: "ketertiban",
      description: "Tetangga memutar musik keras hampir setiap malam.",
    },
    status: "menunggu",
    upvotes: 6,
  },
  {
    id: "23",
    date: "20 Sep 2023",
    reporter: { initials: "CC", name: "Cici C." },
    complaint: {
      title: "Bangku Taman Rusak",
      category: "fasilitas_publik",
      description: "Salah satu bangku di taman kota patah pada bagian dudukan.",
    },
    status: "selesai",
    upvotes: 13,
  },
  {
    id: "24",
    date: "19 Sep 2023",
    reporter: { initials: "HH", name: "Hadi H." },
    complaint: {
      title: "Lampu Area ATM Padam",
      category: "penerangan",
      description: "Area sekitar ATM terlalu gelap pada malam hari.",
    },
    status: "menunggu",
    upvotes: 2,
  },
  {
    id: "25",
    date: "18 Sep 2023",
    reporter: { initials: "MM", name: "Maya M." },
    complaint: {
      title: "Permukaan Trotoar Tidak Rata",
      category: "infrastruktur",
      description: "Pejalan kaki sering tersandung di area depan pasar.",
    },
    status: "diproses",
    upvotes: 31,
  },
]

const getColumns = (
  onDeleteClick: () => void
): ColumnDef<Laporan>[] => [
  {
    accessorKey: "date",
    header: "TANGGAL",
    cell: ({ row }) => (
      <div className="whitespace-nowrap text-muted-foreground">
        {row.original.date}
      </div>
    ),
  },
  {
    accessorKey: "reporter",
    header: "PELAPOR",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="flex size-8 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {row.original.reporter.initials}
        </div>
        <span className="font-medium">{row.original.reporter.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "complaint",
    header: "JUDUL LAPORAN",
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        <span className="font-semibold">{row.original.complaint.title}</span>
        <span className="max-w-75 truncate text-sm text-muted-foreground">
          {row.original.complaint.description}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "STATUS",
    cell: ({ row }) => {
      const status = row.original.status
      const statusLabel: Record<Laporan["status"], string> = {
        menunggu: "Menunggu Validasi",
        diproses: "Sedang Diproses",
        selesai: "Selesai",
        ditolak: "Ditolak / Spam",
      }
      let badgeClasses = ""

      if (status === "menunggu") {
        badgeClasses =
          "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80 dark:bg-yellow-500/20 dark:text-yellow-500"
      } else if (status === "diproses") {
        badgeClasses =
          "bg-blue-100 text-blue-800 hover:bg-blue-100/80 dark:bg-blue-600/20 dark:text-blue-600"
      } else if (status === "selesai") {
        badgeClasses =
          "bg-green-100 text-green-800 hover:bg-green-100/80 dark:bg-green-500/20 dark:text-green-500"
      } else if (status === "ditolak") {
        badgeClasses =
          "bg-red-100 text-red-800 hover:bg-red-100/80 dark:bg-red-500/20 dark:text-red-500"
      }

      return (
        <Badge variant="secondary" className={`font-medium ${badgeClasses}`}>
          {statusLabel[status]}
        </Badge>
      )
    },
  },
  {
    accessorKey: "upvotes",
    header: "DUKUNGAN",
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-500">
        <ThumbsUp className="size-4" />
        {row.original.upvotes}
      </div>
    ),
  },
  {
    id: "actions",
    header: "AKSI",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0 text-muted-foreground">
            <span className="sr-only">Buka menu</span>
            <MoreVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>Lihat Detail</DropdownMenuItem>
          <DropdownMenuItem>Perbarui Status</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive"
            onClick={onDeleteClick}
          >
            Hapus Laporan
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

export function ReportTable({ data }: { data: Laporan[] }) {
  const [isDialogAlertOpen, setIsDialogAlertOpen] = useState(false)
  const columns = getColumns(() => setIsDialogAlertOpen(true))

  const table = useReactTable({
    data: data,
    columns,
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const getPaginationRange = (currentPage: number, totalPages: number) => {
    const delta = 1
    const range = []

    for (
      let i = Math.max(0, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i)
    }

    return range
  }

  return (
    <>
      <div className="w-full space-y-4">
        <div className="rounded-md border bg-card">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className="p-4 text-xs font-semibold tracking-wider text-muted-foreground"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-muted/50"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="p-4">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Tidak ada data.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between border-t px-2 py-4">
          <div className="text-sm text-muted-foreground">
            Menampilkan{" "}
            {table.getState().pagination.pageIndex *
              table.getState().pagination.pageSize +
              1}{" "}
            sampai{" "}
            {Math.min(
              (table.getState().pagination.pageIndex + 1) *
                table.getState().pagination.pageSize,
              table.getFilteredRowModel().rows.length
            )}{" "}
            dari {table.getFilteredRowModel().rows.length} entri
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Sebelumnya
            </Button>

            <div className="flex items-center gap-1">
              {getPaginationRange(
                table.getState().pagination.pageIndex,
                table.getPageCount()
              ).map((pageIndex) => (
                <Button
                  key={pageIndex}
                  variant={
                    table.getState().pagination.pageIndex === pageIndex
                      ? "default"
                      : "outline"
                  }
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => table.setPageIndex(pageIndex)}
                >
                  {pageIndex + 1}
                </Button>
              ))}
            </div>

            <Button
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Berikutnya
            </Button>
          </div>
        </div>
      </div>
      
      <AlertDialog open={isDialogAlertOpen} onOpenChange={setIsDialogAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Yakin ingin menghapus laporan ini?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Laporan akan dihapus secara permanen dari sistem.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction>Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
