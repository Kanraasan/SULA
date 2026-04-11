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

export type Laporan = {
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

const formatTanggalIndonesia = (value: string) => {
  const dateValue = new Date(value)

  if (Number.isNaN(dateValue.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(dateValue)
}

const getColumns = (
  onDeleteClick: (id: string) => void,
  onViewDetailClick: (laporan: Laporan) => void,
  onUpdateStatusClick: (laporan: Laporan) => void
): ColumnDef<Laporan>[] => [
  {
    accessorKey: "date",
    header: "TANGGAL",
    cell: ({ row }) => (
      <div className="whitespace-nowrap text-muted-foreground">
        {formatTanggalIndonesia(row.original.date)}
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
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0 text-muted-foreground">
            <span className="sr-only">Buka menu</span>
            <MoreVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onViewDetailClick(row.original)}>
            Lihat Detail
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onUpdateStatusClick(row.original)}>
            Perbarui Status
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive"
            onClick={() => onDeleteClick(row.original.id)}
          >
            Hapus Laporan
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

type ReportTableProps = {
  data: Laporan[]
  onDelete?: (id: string) => Promise<void> | void
  onViewDetail?: (laporan: Laporan) => void
  onUpdateStatus?: (laporan: Laporan) => void
  deletingId?: string | null
}

export function ReportTable({
  data,
  onDelete,
  onViewDetail,
  onUpdateStatus,
  deletingId = null,
}: ReportTableProps) {
  const [isDialogAlertOpen, setIsDialogAlertOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const columns = getColumns(
    (id) => {
      setSelectedId(id)
      setIsDialogAlertOpen(true)
    },
    (laporan) => {
      onViewDetail?.(laporan)
    },
    (laporan) => {
      onUpdateStatus?.(laporan)
    }
  )

  const handleDeleteConfirm = async () => {
    if (!selectedId || !onDelete) {
      setIsDialogAlertOpen(false)
      return
    }

    await onDelete(selectedId)
    setIsDialogAlertOpen(false)
    setSelectedId(null)
  }

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
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={Boolean(deletingId && deletingId === selectedId)}
            >
              {deletingId && deletingId === selectedId
                ? "Menghapus..."
                : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
