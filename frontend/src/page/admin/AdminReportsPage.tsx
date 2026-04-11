import { useState, useMemo } from "react"
import { AppSidebar } from "@/components/AppSidebar"
import { SearchForm } from "@/components/SearchForm"
import { Button } from "@/components/ui/button"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Plus } from "lucide-react"
import { RightFilterMenu } from "@/components/admin/RightFilterMenu"
import { ReportTable, type Laporan } from "@/components/admin/ReportTable"
import { type DateRange } from "react-day-picker"
import { ThemeToggle } from "@/components/ThemeToggle"
import Clock02 from "@/components/Clock02"
import { CreateReportDialog } from "@/components/admin/CreateReportDialog"
import { ReportDetailDialog } from "@/components/admin/ReportDetailDialog"
import { UpdateStatusDialog } from "@/components/admin/UpdateStatusDialog"
import { useAdminReports } from "@/hooks/useAdminReports"

const kategoriMasalah = [
  { value: "infrastruktur", label: "Infrastruktur & Jalan" },
  { value: "kebersihan", label: "Kebersihan & Lingkungan" },
  { value: "penerangan", label: "Penerangan Jalan Umum (PJU)" },
  { value: "ketertiban", label: "Ketertiban & Keamanan" },
  { value: "fasilitas_publik", label: "Fasilitas Publik" },
  { value: "pelayanan", label: "Pelayanan Pemerintahan" },
  { value: "bencana", label: "Bencana & Keadaan Darurat" },
]

export default function AdminReportsPage() {
  // 1. Definisikan semua State
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [selectedDetail, setSelectedDetail] = useState<Laporan | null>(null)
  const [isUpdateStatusOpen, setIsUpdateStatusOpen] = useState(false)
  const [selectedForStatus, setSelectedForStatus] = useState<Laporan | null>(null)

  const {
    laporanData,
    isLoading,
    isSubmitting,
    isUpdatingStatus,
    deletingId,
    errorMessage,
    createReport,
    deleteReport,
    updateReportStatus,
  } = useAdminReports()

  const handleResetFilters = () => {
    setSelectedCategory("")
    setSelectedStatus("")
    setDateRange(undefined)
  }

  const filteredData = useMemo(() => {
    return laporanData.filter((item) => {
      const matchesSearch =
        item.complaint.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        item.reporter.name.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = selectedCategory
        ? item.complaint.category === selectedCategory
        : true

      const matchesStatus = selectedStatus
        ? item.status === selectedStatus
        : true

      let matchesDate = true
      if (dateRange?.from) {
        const itemDate = new Date(item.date)
        itemDate.setHours(0, 0, 0, 0)

        if (dateRange.to) {
          matchesDate = itemDate >= dateRange.from && itemDate <= dateRange.to
        } else {
          matchesDate = itemDate.getTime() === dateRange.from.getTime()
        }
      }

      return matchesSearch && matchesCategory && matchesStatus && matchesDate
    })
  }, [laporanData, searchQuery, selectedCategory, selectedStatus, dateRange])

  const handleOpenDetail = (laporan: Laporan) => {
    setSelectedDetail(laporan)
    setIsDetailOpen(true)
  }

  const handleOpenUpdateStatus = (laporan: Laporan) => {
    setSelectedForStatus(laporan)
    setIsUpdateStatusOpen(true)
  }

  const handleSubmitUpdateStatus = async (
    status: Laporan["status"],
    catatan: string
  ) => {
    if (!selectedForStatus) return false
    const isSuccess = await updateReportStatus(selectedForStatus, status, catatan)
    if (isSuccess) {
      setSelectedForStatus(null)
    }
    return isSuccess
  }

  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center justify-between border-b bg-sidebar px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <h2 className="font-bold">Laporan</h2>
            </div>
            <div className="flex items-center gap-4">
              <Clock02 />
              <ThemeToggle />
            </div>
          </header>

          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Manajemen Laporan Warga</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  Tinjau dan kelola laporan permasalahan fasilitas umum yang
                  disampaikan masyarakat.
                </p>
              </div>
              <div>
                <Button size="lg" onClick={() => setIsCreateOpen(true)}>
                  <Plus className="mr-2" />
                  Laporan Baru
                </Button>
              </div>
            </div>

            <div className="mt-5 mb-4 flex items-center justify-between rounded-xl border bg-card p-4">
              <SearchForm
                searchValue={searchQuery}
                onSearchChange={setSearchQuery}
              />
              <RightFilterMenu
                category={selectedCategory}
                onCategoryChange={setSelectedCategory}
                status={selectedStatus}
                onStatusChange={setSelectedStatus}
                date={dateRange}
                onDateChange={setDateRange}
                onResetFilters={handleResetFilters}
              />
            </div>

            {errorMessage && (
              <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {errorMessage}
              </div>
            )}

            {isLoading ? (
              <div className="rounded-xl border bg-card p-8 text-center text-muted-foreground">
                Memuat data laporan...
              </div>
            ) : (
              <ReportTable
                data={filteredData}
                onDelete={async (id) => {
                  await deleteReport(id)
                }}
                onViewDetail={handleOpenDetail}
                onUpdateStatus={handleOpenUpdateStatus}
                deletingId={deletingId}
              />
            )}
          </div>
        </SidebarInset>
      </SidebarProvider>

      <CreateReportDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        isSubmitting={isSubmitting}
        kategoriMasalah={kategoriMasalah}
        onSubmit={createReport}
      />

      <ReportDetailDialog
        open={isDetailOpen}
        selectedDetail={selectedDetail}
        onOpenChange={(open) => {
          setIsDetailOpen(open)
          if (!open) setSelectedDetail(null)
        }}
      />

      <UpdateStatusDialog
        open={isUpdateStatusOpen}
        isUpdatingStatus={isUpdatingStatus}
        selectedReport={selectedForStatus}
        onOpenChange={(open) => {
          setIsUpdateStatusOpen(open)
          if (!open) setSelectedForStatus(null)
        }}
        onSubmit={handleSubmitUpdateStatus}
      />
    </>
  )
}
