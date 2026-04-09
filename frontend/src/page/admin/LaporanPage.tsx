import { type FormEvent, useEffect, useMemo, useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SearchForm } from "@/components/search-form"
import { Button } from "@/components/ui/button"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Plus } from "lucide-react"
import { RightFilterMenu } from "@/components/right-filter-menu"
import { ReportTable, type Laporan } from "@/components/report-table"
import { type DateRange } from "react-day-picker"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Clock from "@/components/clock-02"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { toast } from "sonner"
import { api, isHandledApiError } from "@/lib/api-client"

type BackendPost = {
  id: string
  judul: string
  kategori: string
  deskripsi: string
  lampiranFoto: string | null
  userNIK?: string
  username?: string
  createdAt: string
  status?: "menunggu" | "diproses" | "selesai" | "ditolak"
}

type UpdateStatusFormState = {
  status: Laporan["status"]
  catatan: string
}

const toInitials = (name: string) => {
  const tokens = name.trim().split(/\s+/).filter(Boolean)
  if (tokens.length === 0) return "AN"
  if (tokens.length === 1) return tokens[0].slice(0, 2).toUpperCase()
  return `${tokens[0][0]}${tokens[1][0]}`.toUpperCase()
}

const normalizeStatus = (
  value: BackendPost["status"] | string | undefined
): Laporan["status"] => {
  if (value === "diproses" || value === "selesai" || value === "ditolak") {
    return value
  }
  return "menunggu"
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

const mapPostToLaporan = (item: BackendPost): Laporan => {
  const reporterName = item.username || "Anonim"

  return {
    id: item.id,
    date: item.createdAt,
    reporter: {
      initials: toInitials(reporterName),
      name: reporterName,
    },
    complaint: {
      title: item.judul,
      category: item.kategori?.toLowerCase() || "lainnya",
      description: item.deskripsi,
    },
    status: normalizeStatus(item.status),
    upvotes: 0,
  }
}

const kategoriMasalah = [
  { value: "infrastruktur", label: "Infrastruktur & Jalan" },
  { value: "kebersihan", label: "Kebersihan & Lingkungan" },
  { value: "penerangan", label: "Penerangan Jalan Umum (PJU)" },
  { value: "ketertiban", label: "Ketertiban & Keamanan" },
  { value: "fasilitas_publik", label: "Fasilitas Publik" },
  { value: "pelayanan", label: "Pelayanan Pemerintahan" },
  { value: "bencana", label: "Bencana & Keadaan Darurat" },
]

const statusOptions: { value: Laporan["status"]; label: string }[] = [
  { value: "menunggu", label: "Menunggu Validasi" },
  { value: "diproses", label: "Sedang Diproses" },
  { value: "selesai", label: "Selesai" },
  { value: "ditolak", label: "Ditolak / Spam" },
]

type StatusOption = (typeof statusOptions)[number]

export default function LaporanPage() {
  // 1. Definisikan semua State
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newReportCategory, setNewReportCategory] = useState("")
  const [laporanData, setLaporanData] = useState<Laporan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [selectedDetail, setSelectedDetail] = useState<Laporan | null>(null)
  const [isUpdateStatusOpen, setIsUpdateStatusOpen] = useState(false)
  const [selectedForStatus, setSelectedForStatus] = useState<Laporan | null>(null)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [updateStatusForm, setUpdateStatusForm] = useState<UpdateStatusFormState>({
    status: "menunggu",
    catatan: "",
  })

  const fetchLaporan = async () => {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const result = await api.get<{ data?: BackendPost[] }>(
        "/api/post",
        {
          fallbackMessage: "Gagal mengambil data laporan",
        }
      )

      const mapped = Array.isArray(result.data)
        ? result.data.map((item: BackendPost) => mapPostToLaporan(item))
        : []

      setLaporanData(mapped)
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Terjadi kesalahan jaringan"
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void fetchLaporan()
  }, [])

  const handleResetFilters = () => {
    setSelectedCategory("")
    setSelectedStatus("")
    setDateRange(undefined)
  }

  // 2. Logika Filtering
  const filteredData = useMemo(() => {
    return laporanData.filter((item) => {
      // A. Pencarian Text (Judul Laporan atau Nama Pelapor)
      const matchesSearch =
        item.complaint.title
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        item.reporter.name.toLowerCase().includes(searchQuery.toLowerCase())

      // B. Filter Kategori
      const matchesCategory = selectedCategory
        ? item.complaint.category === selectedCategory
        : true

      // C. Filter Status
      const matchesStatus = selectedStatus
        ? item.status === selectedStatus
        : true

      // D. Filter Range Tanggal
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

      // Harus lulus semua kondisi
      return matchesSearch && matchesCategory && matchesStatus && matchesDate
    })
  }, [laporanData, searchQuery, selectedCategory, selectedStatus, dateRange])

  const handleCreateReport = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formEl = e.currentTarget

    const formData = new FormData(e.currentTarget)
    const judul = String(formData.get("judulLaporan") || "").trim()
    const kategori = newReportCategory
    const deskripsi = String(formData.get("deskripsiDetail") || "").trim()
    const lampiranFoto = formData.get("lampiranFoto")

    if (!judul || !kategori || !deskripsi) {
      toast.error("Mohon lengkapi judul, kategori, dan deskripsi laporan")
      return
    }

    const payload = new FormData()
    payload.append("judul", judul)
    payload.append("kategori", kategori)
    payload.append("deskripsi", deskripsi)

    const userData = localStorage.getItem("user")
    if (userData) {
      const user = JSON.parse(userData) as { NIK?: string | number; username?: string }
      if (user.NIK) payload.append("userNIK", String(user.NIK))
      if (user.username) payload.append("username", user.username)
    }

    if (lampiranFoto instanceof File && lampiranFoto.size > 0) {
      payload.append("lampiranFoto", lampiranFoto)
    }

    setIsSubmitting(true)
    try {
      const result = await api.post<{ message?: string; data?: BackendPost }>(
        "/api/post",
        payload,
        undefined,
        {
          fallbackMessage: "Gagal membuat laporan",
          showErrorToast: true,
        }
      )

      if (result.data) {
        const createdReport = mapPostToLaporan(result.data)
        setLaporanData((prev) => [createdReport, ...prev])
      }

      toast.success(result.message || "Laporan berhasil dibuat")
      setIsDialogOpen(false)
      setNewReportCategory("")
      formEl.reset()
    } catch (error) {
      if (!isHandledApiError(error)) {
        toast.error(error instanceof Error ? error.message : "Gagal membuat laporan")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteReport = async (id: string) => {
    setDeletingId(id)
    try {
      const result = await api.delete<{ message?: string }>(
        `/api/post/${id}`,
        {
          fallbackMessage: "Gagal menghapus laporan",
          showErrorToast: true,
        }
      )

      setLaporanData((prev) => prev.filter((item) => item.id !== id))
      toast.success(result.message || "Laporan berhasil dihapus")
    } catch (error) {
      if (!isHandledApiError(error)) {
        toast.error(error instanceof Error ? error.message : "Gagal menghapus laporan")
      }
    } finally {
      setDeletingId(null)
    }
  }

  function handleNewReport() {
    setNewReportCategory("")
    setIsDialogOpen(true)
  }

  const handleOpenDetail = (laporan: Laporan) => {
    setSelectedDetail(laporan)
    setIsDetailOpen(true)
  }

  const handleOpenUpdateStatus = (laporan: Laporan) => {
    setSelectedForStatus(laporan)
    setUpdateStatusForm({
      status: laporan.status,
      catatan: "",
    })
    setIsUpdateStatusOpen(true)
  }

  const onSubmitUpdateStatus = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!selectedForStatus) return

    setIsUpdatingStatus(true)
    try {
      const result = await api.put<{ message?: string }>(
        `/api/post/${selectedForStatus.id}`,
        JSON.stringify({
          judul: selectedForStatus.complaint.title,
          kategori: selectedForStatus.complaint.category,
          deskripsi: selectedForStatus.complaint.description,
          status: updateStatusForm.status,
          catatanAdmin: updateStatusForm.catatan,
        }),
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
        {
          fallbackMessage: "Gagal memperbarui status laporan",
          showErrorToast: true,
        }
      )

      setLaporanData((prev) =>
        prev.map((item) =>
          item.id === selectedForStatus.id
            ? {
                ...item,
                status: updateStatusForm.status,
              }
            : item
        )
      )

      toast.success(result.message || "Status laporan berhasil diperbarui")
      setIsUpdateStatusOpen(false)
      setSelectedForStatus(null)
    } catch (error) {
      if (!isHandledApiError(error)) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat memperbarui status"
        )
      }
    } finally {
      setIsUpdatingStatus(false)
    }
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
              <Clock />
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
                <Button size="lg" onClick={() => handleNewReport()}>
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
                onDelete={handleDeleteReport}
                onViewDetail={handleOpenDetail}
                onUpdateStatus={handleOpenUpdateStatus}
                deletingId={deletingId}
              />
            )}
          </div>
        </SidebarInset>
      </SidebarProvider>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-sm">
          <form onSubmit={handleCreateReport}>
            <DialogHeader>
              <DialogTitle>Buat Laporan Baru</DialogTitle>
              <DialogDescription>
                Isi detail laporan warga lalu klik Buat untuk menyimpan.
              </DialogDescription>
            </DialogHeader>
            <FieldGroup>
              <Field>
                <Label htmlFor="report-title">Judul Laporan</Label>
                <Input
                  id="report-title"
                  name="judulLaporan"
                  placeholder="Contoh: Jalan berlubang di Jl. Merdeka"
                  required
                />
              </Field>

              <Field>
                <Label htmlFor="report-category">Kategori Masalah</Label>
                <Select
                  value={newReportCategory}
                  onValueChange={setNewReportCategory}
                >
                  <SelectTrigger id="report-category" className="w-full">
                    <SelectValue placeholder="Pilih kategori masalah" />
                  </SelectTrigger>
                  <SelectContent>
                    {kategoriMasalah.map((kategori) => (
                      <SelectItem key={kategori.value} value={kategori.value}>
                        {kategori.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <input
                  type="hidden"
                  name="kategoriMasalah"
                  value={newReportCategory}
                />
              </Field>

              <Field>
                <Label htmlFor="report-detail">Deskripsi Detail</Label>
                <Textarea
                  id="report-detail"
                  name="deskripsiDetail"
                  placeholder="Jelaskan lokasi, waktu kejadian, dan kondisi masalah secara rinci"
                  className="min-h-28"
                  required
                />
              </Field>

              <Field>
                <Label htmlFor="report-photo">Foto Pendukung (Opsional)</Label>
                <Input
                  id="report-photo"
                  name="lampiranFoto"
                  type="file"
                  accept="image/*"
                />
                <FieldDescription>
                  Format yang disarankan: JPG, JPEG, atau PNG.
                </FieldDescription>
              </Field>
            </FieldGroup>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Batal</Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Menyimpan..." : "Buat"}
              </Button>
            </DialogFooter>
          </form>
          </DialogContent>
      </Dialog>

      <Dialog
        open={isDetailOpen}
        onOpenChange={(open) => {
          setIsDetailOpen(open)
          if (!open) setSelectedDetail(null)
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Detail Laporan</DialogTitle>
            <DialogDescription>
              Ringkasan data laporan yang dipilih.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <div>
              <p className="text-md text-muted-foreground">Judul Laporan</p>
              <p className="font-medium">{selectedDetail?.complaint.title || "-"}</p>
            </div>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <div>
                <p className="text-md text-muted-foreground">Pelapor</p>
                <p className="font-medium">{selectedDetail?.reporter.name || "-"}</p>
              </div>
              <div>
                <p className="text-md text-muted-foreground">Tanggal</p>
                <p className="font-medium">
                  {selectedDetail?.date
                    ? formatTanggalIndonesia(selectedDetail.date)
                    : "-"}
                </p>
              </div>
            </div>
            <div>
              <p className="text-md text-muted-foreground">Kategori</p>
              <p className="font-medium capitalize">
                {(selectedDetail?.complaint.category || "-").replaceAll("_", " ")}
              </p>
            </div>
            <div>
              <p className="text-md text-muted-foreground">Deskripsi</p>
              <p className="leading-relaxed text-sm text-foreground">
                {selectedDetail?.complaint.description || "-"}
              </p>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Tutup
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        modal={false}
        open={isUpdateStatusOpen}
        onOpenChange={(open) => {
          setIsUpdateStatusOpen(open)
          if (!open) {
            setSelectedForStatus(null)
            setUpdateStatusForm({
              status: "menunggu",
              catatan: "",
            })
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Perbarui Status Laporan</DialogTitle>
            <DialogDescription>
              Ubah status laporan dan simpan perubahan.
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-4" onSubmit={onSubmitUpdateStatus}>
            <Field>
              <Label htmlFor="status-laporan">Status</Label>
              <Combobox
                items={statusOptions}
                itemToStringValue={(item: StatusOption) => item.label}
                onValueChange={(item: StatusOption | null) => {
                  if (!item) return
                  setUpdateStatusForm((prev) => ({
                    ...prev,
                    status: item.value,
                  }))
                }}
              >
                <ComboboxInput
                  placeholder="Pilih status laporan"
                    value={
                    statusOptions.find(
                      (item) => item.value === updateStatusForm.status
                    )?.label ?? ""
                  }
                />
                <ComboboxContent className="z-70">
                  <ComboboxEmpty>Status tidak ditemukan</ComboboxEmpty>
                  <ComboboxList>
                    {(item) => (
                      <ComboboxItem key={item.value} value={item}>
                        {item.label}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </Field>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Batal
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isUpdatingStatus}>
                {isUpdatingStatus ? "Menyimpan..." : "Simpan Status"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
