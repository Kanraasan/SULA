import { useState, useMemo } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SearchForm } from "@/components/search-form"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Plus } from "lucide-react"
import { RightFilterMenu } from "@/components/right-filter-menu"
import { ReportTable, dataLaporan } from "@/components/report-table"
import { type DateRange } from "react-day-picker"
import { ThemeToggle } from "@/components/theme-toggle"

export default function LaporanPage() {
  // 1. Definisikan semua State
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [dateRange, setDateRange] = useState<DateRange | undefined>()

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
        item.complaint.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.reporter.name.toLowerCase().includes(searchQuery.toLowerCase())

      // B. Filter Kategori
      const matchesCategory = selectedCategory ? item.complaint.category === selectedCategory : true

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

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-sidebar px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h2 className="font-bold">Laporan</h2>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </header>

        <div className="p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Manajemen Laporan Warga</h1>
              <p className="text-muted-foreground mt-2 text-sm">
                View and manage public facility issues reported by the community.
              </p>
            </div>
            <div>
              <Button size="lg">
                <Plus className="mr-2" />
                New Report
              </Button>
            </div>
          </div>

          <div className="mt-5 mb-4 p-4 rounded-xl border bg-card flex justify-between items-center">
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
  )
}