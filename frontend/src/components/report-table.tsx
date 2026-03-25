import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table"
import { MoreVertical, ThumbsUp } from "lucide-react"

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
    date: "Oct 12, 2023",
    reporter: { initials: "BS", name: "Budi Santoso" },
    complaint: {
      title: "Pothole on Jalan Merdeka",
      category: "infrastruktur",
      description: "Near the intersection, causing traffic...",
    },
    status: "menunggu",
    upvotes: 12,
  },
  {
    id: "2",
    date: "Oct 11, 2023",
    reporter: { initials: "SA", name: "Siti Aminah" },
    complaint: {
      title: "Broken Streetlight",
      category: "penerangan",
      description: "Lamp post #45 is flickering and completely o...",
    },
    status: "diproses",
    upvotes: 8,
  },
  {
    id: "3",
    date: "Oct 10, 2023",
    reporter: { initials: "AW", name: "Agus Wijaya" },
    complaint: {
      title: "Clogged Drain",
      category: "kebersihan",
      description: "Water backing up during heavy rain in RT 03.",
    },
    status: "selesai",
    upvotes: 5,
  },
  {
    id: "4",
    date: "Oct 09, 2023",
    reporter: { initials: "RM", name: "Rina Marlina" },
    complaint: {
      title: "Fallen Tree Branches",
      category: "bencana",
      description: "Blocking the pathway near the community...",
    },
    status: "diproses",
    upvotes: 15,
  },
  {
    id: "5",
    date: "Oct 08, 2023",
    reporter: { initials: "JA", name: "Joko Anwar" },
    complaint: {
      title: "Trash not collected",
      category: "kebersihan",
      description: "Garbage bins overflowing for 3 days in RT 05.",
    },
    status: "menunggu",
    upvotes: 3,
  },
  {
    id: "6",
    date: "Oct 07, 2023",
    reporter: { initials: "HR", name: "Heri Ramadhan" },
    complaint: {
      title: "Wild Dogs",
      category: "ketertiban",
      description: "Pack of wild dogs roaming near school area.",
    },
    status: "menunggu",
    upvotes: 20,
  },
  {
    id: "7",
    date: "Oct 06, 2023",
    reporter: { initials: "LN", name: "Lina Nur" },
    complaint: {
      title: "Burst Pipe",
      category: "infrastruktur",
      description: "Water pipe burst on Jl. Slamet Riyadi.",
    },
    status: "selesai",
    upvotes: 45,
  },
  {
    id: "8",
    date: "Oct 05, 2023",
    reporter: { initials: "DP", name: "Dedi Putra" },
    complaint: {
      title: "Illegal Parking",
      category: "ketertiban",
      description: "Cars blocking the narrow alleyway.",
    },
    status: "diproses",
    upvotes: 2,
  },
  {
    id: "9",
    date: "Oct 04, 2023",
    reporter: { initials: "MT", name: "Mita Tiara" },
    complaint: {
      title: "Graffiti",
      category: "ketertiban",
      description: "New graffiti on the community park wall.",
    },
    status: "menunggu",
    upvotes: 7,
  },
  {
    id: "10",
    date: "Oct 03, 2023",
    reporter: { initials: "BK", name: "Bambang K." },
    complaint: {
      title: "Broken Swing",
      category: "fasilitas_publik",
      description: "Swing at playground is unsafe for kids.",
    },
    status: "selesai",
    upvotes: 11,
  },
  {
    id: "11",
    date: "Oct 02, 2023",
    reporter: { initials: "FS", name: "Farah S." },
    complaint: {
      title: "Noisy Construction",
      category: "ketertiban",
      description: "Building work past 10 PM in residential area.",
    },
    status: "diproses",
    upvotes: 9,
  },
  {
    id: "12",
    date: "Oct 01, 2023",
    reporter: { initials: "GG", name: "Gilang G." },
    complaint: {
      title: "Stray Cat Colony",
      category: "kebersihan",
      description: "Too many strays causing hygiene issues.",
    },
    status: "menunggu",
    upvotes: 3,
  },
  {
    id: "13",
    date: "Sep 30, 2023",
    reporter: { initials: "AA", name: "Andi A." },
    complaint: {
      title: "Broken Manhole",
      category: "infrastruktur",
      description: "Manhole cover is missing, dangerous for bikes.",
    },
    status: "diproses",
    upvotes: 33,
  },
  {
    id: "14",
    date: "Sep 29, 2023",
    reporter: { initials: "RR", name: "Ria R." },
    complaint: {
      title: "Illegal Trash Dumping",
      category: "kebersihan",
      description: "Someone dumping bags near the river.",
    },
    status: "menunggu",
    upvotes: 18,
  },
  {
    id: "15",
    date: "Sep 28, 2023",
    reporter: { initials: "IK", name: "Iwan K." },
    complaint: {
      title: "Smelly Drain",
      category: "kebersihan",
      description: "Sewer smell is very strong today.",
    },
    status: "selesai",
    upvotes: 22,
  },
  {
    id: "16",
    date: "Sep 27, 2023",
    reporter: { initials: "TY", name: "Tedy Y." },
    complaint: {
      title: "Flickering Sign",
      category: "penerangan",
      description: "Public information board is broken.",
    },
    status: "menunggu",
    upvotes: 1,
  },
  {
    id: "17",
    date: "Sep 26, 2023",
    reporter: { initials: "SP", name: "Sari P." },
    complaint: {
      title: "Tree Ripping Wires",
      category: "bencana",
      description: "Branches tangled in internet cables.",
    },
    status: "diproses",
    upvotes: 14,
  },
  {
    id: "18",
    date: "Sep 25, 2023",
    reporter: { initials: "JM", name: "Joni M." },
    complaint: {
      title: "Dusty Road",
      category: "infrastruktur",
      description: "Trucks leaving too much mud/dust on road.",
    },
    status: "menunggu",
    upvotes: 5,
  },
  {
    id: "19",
    date: "Sep 24, 2023",
    reporter: { initials: "NA", name: "Nina A." },
    complaint: {
      title: "Blocked Sidewalk",
      category: "infrastruktur",
      description: "Vendor blocking access for wheelchairs.",
    },
    status: "selesai",
    upvotes: 27,
  },
  {
    id: "20",
    date: "Sep 23, 2023",
    reporter: { initials: "WW", name: "Wawan W." },
    complaint: {
      title: "Crashed Barrier",
      category: "infrastruktur",
      description: "Road barrier broken after minor accident.",
    },
    status: "menunggu",
    upvotes: 4,
  },
  {
    id: "21",
    date: "Sep 22, 2023",
    reporter: { initials: "DS", name: "Dina S." },
    complaint: {
      title: "Mosquito Breeding",
      category: "kebersihan",
      description: "Standing water in vacant lot.",
    },
    status: "diproses",
    upvotes: 19,
  },
  {
    id: "22",
    date: "Sep 21, 2023",
    reporter: { initials: "BN", name: "Beno N." },
    complaint: {
      title: "Loud Party",
      category: "ketertiban",
      description: "Neighbor playing loud music nightly.",
    },
    status: "menunggu",
    upvotes: 6,
  },
  {
    id: "23",
    date: "Sep 20, 2023",
    reporter: { initials: "CC", name: "Cici C." },
    complaint: {
      title: "Damaged Park Bench",
      category: "fasilitas_publik",
      description: "Seat is broken at the central park.",
    },
    status: "selesai",
    upvotes: 13,
  },
  {
    id: "24",
    date: "Sep 19, 2023",
    reporter: { initials: "HH", name: "Hadi H." },
    complaint: {
      title: "Broken ATM Lights",
      category: "penerangan",
      description: "Area around ATM is too dark at night.",
    },
    status: "menunggu",
    upvotes: 2,
  },
  {
    id: "25",
    date: "Sep 18, 2023",
    reporter: { initials: "MM", name: "Maya M." },
    complaint: {
      title: "Uneven Pavement",
      category: "infrastruktur",
      description: "People tripping near the market entrance.",
    },
    status: "diproses",
    upvotes: 31,
  },
]

const columns: ColumnDef<Laporan>[] = [
  {
    accessorKey: "date",
    header: "DATE",
    cell: ({ row }) => (
      <div className="whitespace-nowrap text-muted-foreground">
        {row.original.date}
      </div>
    ),
  },
  {
    accessorKey: "reporter",
    header: "REPORTER",
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
    header: "COMPLAINT TITLE",
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
          "bg-blue-100 text-blue-800 hover:bg-blue-100/80 dark:bg-blue-500/20 dark:text-blue-500"
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
    header: "UPVOTES",
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5 font-medium text-emerald-600 dark:text-emerald-500">
        <ThumbsUp className="size-4" />
        {row.original.upvotes}
      </div>
    ),
  },
  {
    id: "actions",
    header: "ACTION",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="size-8 p-0 text-muted-foreground">
            <span className="sr-only">Open menu</span>
            <MoreVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>View Details</DropdownMenuItem>
          <DropdownMenuItem>Update Status</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive">
            Delete Report
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

export function ReportTable({data}: { data: Laporan[] }) {
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
                      className="text-xs font-semibold tracking-wider text-muted-foreground p-4"
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
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between border-t px-2 py-4">
        <div className="text-sm text-muted-foreground">
          Showing{" "}
          {table.getState().pagination.pageIndex *
            table.getState().pagination.pageSize +
            1}{" "}
          to{" "}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) *
              table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length
          )}{" "}
          of {table.getFilteredRowModel().rows.length} entries
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
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
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
