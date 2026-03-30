import { useState, useMemo } from "react"
import { UserNavbar } from "@/components/users/user-navbar"
import { UserFooter } from "@/components/users/user-footer"
import { ReportCard } from "@/components/users/report-card"
import { Button } from "@/components/ui/button"
import { Filter, ListFilter, Check } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

const DUMMY_REPORTS = [
  {
    id: 1,
    title: "Jalan berlubang parah depan di Pasar Gemblegan",
    category: "Infrastruktur",
    status: "Menunggu" as const,
    time: "2 jam yang lalu",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    author: "Budi S.",
    votes: 24,
    imageUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=1470&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Tumpukan sampah belum diambil di Belakang Terminal Tirtonadi",
    category: "Kebersihan",
    status: "Diproses" as const,
    time: "Kemarin",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
    author: "Siti A.",
    votes: 15,
    imageUrl: "https://images.unsplash.com/photo-1530587191325-3db32d826c18?q=80&w=1374&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "5 Lampu PJU mati total di Jl. Veteran",
    category: "Fasilitas",
    status: "Selesai" as const,
    time: "3 hari yang lalu",
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    author: "Agus K.",
    votes: 42,
    imageUrl: "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?q=80&w=1470&auto=format&fit=crop",
  },
]

const CATEGORIES = ["Infrastruktur", "Kebersihan", "Fasilitas", "Lingkungan", "Penerangan"]

export default function StatusLaporanPage() {
  const [filterCategory, setFilterCategory] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest")

  // Logic for filtering and sorting
  const processedReports = useMemo(() => {
    let result = [...DUMMY_REPORTS]

    // Filter
    if (filterCategory) {
      result = result.filter((report) => report.category === filterCategory)
    }

    // Sort
    result.sort((a, b) => {
      if (sortOrder === "newest") {
        return b.createdAt.getTime() - a.createdAt.getTime()
      } else {
        return a.createdAt.getTime() - b.createdAt.getTime()
      }
    })

    return result
  }, [filterCategory, sortOrder])

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <UserNavbar />

      <main className="flex-1 container mx-auto px-4 py-8 md:px-8">
        {/* Hero Section */}
        <section className="relative h-[380px] w-full rounded-3xl overflow-hidden mb-10 group">
          <div className="absolute inset-0 bg-slate-900/70 transition-colors group-hover:bg-slate-900/60 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=1470&auto=format&fit=crop" 
            className="absolute inset-0 w-full h-full object-cover"
            alt="Hero background"
          />
          <div className="relative z-20 h-full flex flex-col items-center justify-center text-center px-4 max-w-3xl mx-auto space-y-6">
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight uppercase leading-tight drop-shadow-lg">
              CEK STATUS LAPORAN ANDA
            </h1>
            <p className="text-lg md:text-xl font-medium text-slate-100 max-w-2xl opacity-90">
              Anda dapat memantau status laporan yang diunggah oleh anda atau pengguna layanan lainnya secara real-time.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <div className="space-y-8">
          {/* Header & Filters */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-border">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Laporan Terbaru di Sekitarmu</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {filterCategory ? `Menampilkan kategori: ${filterCategory}` : "Menampilkan laporan terkini dari seluruh wilayah"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* Filter Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className={cn(
                    "h-10 px-4 rounded-xl border-border bg-card hover:bg-accent hover:text-accent-foreground transition-all flex gap-2",
                    filterCategory && "border-primary text-primary dark:text-blue-600"
                  )}>
                    <Filter className="w-4 h-4" />
                    <span>{filterCategory || "Filter"}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl">
                  <DropdownMenuLabel>Pilih Kategori</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setFilterCategory(null)} className="flex justify-between items-center">
                    Semua Kategori
                    {!filterCategory && <Check className="w-4 h-4 text-primary" />}
                  </DropdownMenuItem>
                  {CATEGORIES.map((cat) => (
                    <DropdownMenuItem 
                      key={cat} 
                      onClick={() => setFilterCategory(cat)}
                      className="flex justify-between items-center"
                    >
                      {cat}
                      {filterCategory === cat && <Check className="w-4 h-4 text-primary" />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Sort Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-10 px-4 rounded-xl border-border bg-card hover:bg-accent hover:text-accent-foreground transition-all flex gap-2">
                    <ListFilter className="w-4 h-4" />
                    <span>Urutkan</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl">
                  <DropdownMenuLabel>Urutan Waktu</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSortOrder("newest")} className="flex justify-between items-center">
                    Paling Baru
                    {sortOrder === "newest" && <Check className="w-4 h-4 text-primary" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortOrder("oldest")} className="flex justify-between items-center">
                    Paling Lama
                    {sortOrder === "oldest" && <Check className="w-4 h-4 text-primary" />}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Grid Reports */}
          {processedReports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {processedReports.map((report) => (
                <ReportCard key={report.id} {...report} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <div className="bg-muted p-6 rounded-full">
                <Filter className="w-12 h-12 text-muted-foreground opacity-20" />
              </div>
              <h3 className="text-xl font-bold">Tidak ada laporan ditemukan</h3>
              <p className="text-muted-foreground">Coba ubah filter Anda untuk melihat hasil lain.</p>
              <Button variant="link" onClick={() => setFilterCategory(null)}>Reset Filter</Button>
            </div>
          )}

          {/* Load More */}
          {processedReports.length > 0 && (
            <div className="flex justify-center pt-6">
              <Button 
                variant="outline" 
                className="px-8 h-12 rounded-2xl border-border text-foreground font-semibold hover:bg-accent transition-all shadow-sm"
              >
                Muat Lebih Banyak
              </Button>
            </div>
          )}
        </div>
      </main>

      <UserFooter />
    </div>
  )
}
