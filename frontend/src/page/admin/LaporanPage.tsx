import { useState, useMemo } from "react"
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
import { ReportTable, dataLaporan } from "@/components/report-table"
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

  const handleResetFilters = () => {
    setSelectedCategory("")
    setSelectedStatus("")
    setDateRange(undefined)
  }

  // 2. Logika Filtering
  const filteredData = useMemo(() => {
    return dataLaporan.filter((item) => {
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
  }, [searchQuery, selectedCategory, selectedStatus, dateRange])

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

            {/* 3. Masukkan Data yang sudah difilter ke Tabel */}
            <ReportTable data={filteredData} />
          </div>
        </SidebarInset>
      </SidebarProvider>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <form>
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
                  name="title"
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
                  name="category"
                  value={newReportCategory}
                />
              </Field>

              <Field>
                <Label htmlFor="report-detail">Deskripsi Detail</Label>
                <Textarea
                  id="report-detail"
                  name="description"
                  placeholder="Jelaskan lokasi, waktu kejadian, dan kondisi masalah secara rinci"
                  className="min-h-28"
                  required
                />
              </Field>

              <Field>
                <Label htmlFor="report-photo">Foto Pendukung (Opsional)</Label>
                <Input
                  id="report-photo"
                  name="foto"
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
              <Button type="submit">Buat</Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
    </>
  )
}
