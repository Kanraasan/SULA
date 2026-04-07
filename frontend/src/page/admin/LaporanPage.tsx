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

type BackendPost = {
  id: string
  judul: string
  kategori: string
  deskripsi: string
  lampiranFoto: string | null
  userNIK?: string
  username?: string
  createdAt: string
}

const API_BASE_URL =
  (import.meta.env.VITE_API_URL as string | undefined)?.trim() || ""

const toApiUrl = (path: string) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`

  if (!API_BASE_URL) {
    return normalizedPath
  }

  const normalizedBase = API_BASE_URL.replace(/\/+$/, "")
  const baseEndsWithApi = /\/api$/i.test(normalizedBase)
  const pathStartsWithApi = normalizedPath.startsWith("/api/")

  if (baseEndsWithApi && pathStartsWithApi) {
    return `${normalizedBase}${normalizedPath.replace(/^\/api/, "")}`
  }

  return `${normalizedBase}${normalizedPath}`
}

const parseJsonResponse = async (response: Response) => {
  const contentType = response.headers.get("content-type") || ""
  const rawText = await response.text()

  if (!contentType.includes("application/json")) {
    const preview = rawText.trim().slice(0, 120)
    throw new Error(
      `Response API bukan JSON (status ${response.status}). Kemungkinan endpoint salah atau API URL belum benar. Preview: ${preview}`
    )
  }

  try {
    return JSON.parse(rawText)
  } catch {
    throw new Error(
      `Gagal parse JSON dari API (status ${response.status}). Pastikan backend mengembalikan JSON valid.`
    )
  }
}

const toInitials = (name: string) => {
  const tokens = name.trim().split(/\s+/).filter(Boolean)
  if (tokens.length === 0) return "AN"
  if (tokens.length === 1) return tokens[0].slice(0, 2).toUpperCase()
  return `${tokens[0][0]}${tokens[1][0]}`.toUpperCase()
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
    status: "menunggu",
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

  const fetchLaporan = async () => {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const response = await fetch(toApiUrl("/api/post"))
      const result = await parseJsonResponse(response)

      if (!response.ok) {
        throw new Error(result.message || "Gagal mengambil data laporan")
      }

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

    const formData = new FormData(e.currentTarget)
    const judul = String(formData.get("judulLaporan") || "").trim()
    const kategori = newReportCategory
    const deskripsi = String(formData.get("deskripsiDetail") || "").trim()
    const lampiranFoto = formData.get("lampiranFoto")

    if (!judul || !kategori || !deskripsi) {
      alert("Mohon lengkapi judul, kategori, dan deskripsi laporan")
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
      const response = await fetch(toApiUrl("/api/post"), {
        method: "POST",
        body: payload,
      })
      const result = await parseJsonResponse(response)

      if (!response.ok) {
        throw new Error(result.message || "Gagal membuat laporan")
      }

      alert(result.message || "Laporan berhasil dibuat")
      setIsDialogOpen(false)
      setNewReportCategory("")
      e.currentTarget.reset()
      await fetchLaporan()
    } catch (error) {
      alert(error instanceof Error ? error.message : "Gagal membuat laporan")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteReport = async (id: string) => {
    setDeletingId(id)
    try {
      const response = await fetch(toApiUrl(`/api/post/${id}`), {
        method: "DELETE",
      })

      const result = await parseJsonResponse(response)
      if (!response.ok) {
        throw new Error(result.message || "Gagal menghapus laporan")
      }

      setLaporanData((prev) => prev.filter((item) => item.id !== id))
    } catch (error) {
      alert(error instanceof Error ? error.message : "Gagal menghapus laporan")
    } finally {
      setDeletingId(null)
    }
  }

  function handleNewReport() {
    setNewReportCategory("")
    setIsDialogOpen(true)
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
                deletingId={deletingId}
              />
            )}
          </div>
        </SidebarInset>
      </SidebarProvider>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <form onSubmit={handleCreateReport}>
          <DialogContent className="sm:max-w-sm">
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
          </DialogContent>
        </form>
      </Dialog>
    </>
  )
}
