import { useState, useMemo, useEffect } from "react"
import { UserNavbar } from "@/components/user/user-navbar"
import { UserFooter } from "@/components/user/user-footer"
import { ReportCard } from "@/components/user/report-card"
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

type Report = {
  id: string
  title: string
  category: string
  status: "Menunggu" | "Diproses" | "Selesai"
  time: string
  createdAt: Date
  author: string
  votes: number
  imageUrl: string
}

const CATEGORIES = [
  "Infrastruktur",
  "Kebersihan",
  "Fasilitas",
  "Lingkungan",
  "Penerangan",
]

// Fungsi helper untuk format waktu relatif
const getRelativeTime = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 60) return `${diffMins} menit yang lalu`
  if (diffHours < 24) return `${diffHours} jam yang lalu`
  if (diffDays === 1) return "Kemarin"
  if (diffDays < 7) return `${diffDays} hari yang lalu`
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

// Fungsi helper untuk mapping kategori
const mapCategory = (category: string) => {
  const categoryMap: Record<string, string> = {
    infrastruktur: "Infrastruktur",
    kebersihan: "Kebersihan",
    fasilitas: "Fasilitas",
    lingkungan: "Lingkungan",
    penerangan: "Penerangan",
  }
  return categoryMap[category.toLowerCase()] || category
}

export default function StatusLaporanPage() {
  const [filterCategory, setFilterCategory] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest")
  const [reports, setReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Fetch data dari backend
  useEffect(() => {
    fetch("/api/report")
      .then((res) => res.json())
      .then((result) => {
        if (result.data) {
          // Transform data dari backend ke format yang dibutuhkan
          const transformedReports: Report[] = result.data.map((post: any) => ({
            id: post.id,
            title: post.title,
            category: mapCategory(post.category),
            status: "Menunggu" as const, // Default status, bisa disesuaikan
            time: getRelativeTime(post.createdAt),
            createdAt: new Date(post.createdAt),
            author: post.username || "Anonim",
            votes: Math.floor(Math.random() * 50), // Random votes untuk demo
            imageUrl: post.lampiranFoto
              ? `http://localhost:5000/uploads/${post.lampiranFoto}`
              : "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=1470&auto=format&fit=crop",
          }))
          setReports(transformedReports)
        }
        setIsLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching reports:", error)
        setIsLoading(false)
      })
  }, [])

  // Logic for filtering and sorting
  const processedReports = useMemo(() => {
    let result = [...reports]

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
  }, [reports, filterCategory, sortOrder])

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <UserNavbar />

      <main className="container mx-auto flex-1 px-4 py-8 md:px-8">
        {/* Hero Section */}
        <section className="group relative mb-10 h-[380px] w-full overflow-hidden rounded-3xl">
          <div className="absolute inset-0 z-10 bg-slate-900/70 transition-colors group-hover:bg-slate-900/60" />
          <img
            src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=1470&auto=format&fit=crop"
            className="absolute inset-0 h-full w-full object-cover"
            alt="Hero background"
          />
          <div className="relative z-20 mx-auto flex h-full max-w-3xl flex-col items-center justify-center space-y-6 px-4 text-center">
            <h1 className="text-4xl leading-tight font-black tracking-tight text-white uppercase drop-shadow-lg md:text-6xl">
              CEK STATUS LAPORAN ANDA
            </h1>
            <p className="max-w-2xl text-lg font-medium text-slate-100 opacity-90 md:text-xl">
              Anda dapat memantau status laporan yang diunggah oleh anda atau
              pengguna layanan lainnya secara real-time.
            </p>
          </div>
        </section>

        {/* Content Section */}
        <div className="space-y-8">
          {/* Header & Filters */}
          <div className="flex flex-col justify-between gap-4 border-b border-border pb-4 md:flex-row md:items-end">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Laporan Terbaru di Sekitarmu
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {filterCategory
                  ? `Menampilkan kategori: ${filterCategory}`
                  : "Menampilkan laporan terkini dari seluruh wilayah"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* Filter Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "flex h-10 gap-2 rounded-xl border-border bg-card px-4 transition-all hover:bg-accent hover:text-accent-foreground",
                      filterCategory &&
                        "border-primary text-primary dark:text-blue-600"
                    )}
                  >
                    <Filter className="h-4 w-4" />
                    <span>{filterCategory || "Filter"}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl">
                  <DropdownMenuLabel>Pilih Kategori</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setFilterCategory(null)}
                    className="flex items-center justify-between"
                  >
                    Semua Kategori
                    {!filterCategory && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </DropdownMenuItem>
                  {CATEGORIES.map((cat) => (
                    <DropdownMenuItem
                      key={cat}
                      onClick={() => setFilterCategory(cat)}
                      className="flex items-center justify-between"
                    >
                      {cat}
                      {filterCategory === cat && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Sort Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex h-10 gap-2 rounded-xl border-border bg-card px-4 transition-all hover:bg-accent hover:text-accent-foreground"
                  >
                    <ListFilter className="h-4 w-4" />
                    <span>Urutkan</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl">
                  <DropdownMenuLabel>Urutan Waktu</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setSortOrder("newest")}
                    className="flex items-center justify-between"
                  >
                    Paling Baru
                    {sortOrder === "newest" && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSortOrder("oldest")}
                    className="flex items-center justify-between"
                  >
                    Paling Lama
                    {sortOrder === "oldest" && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Grid Reports */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center space-y-4 py-20 text-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="text-muted-foreground">Memuat laporan...</p>
            </div>
          ) : processedReports.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {processedReports.map((report) => (
                <ReportCard key={report.id} {...report} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-4 py-20 text-center">
              <div className="rounded-full bg-muted p-6">
                <Filter className="h-12 w-12 text-muted-foreground opacity-20" />
              </div>
              <h3 className="text-xl font-bold">Tidak ada laporan ditemukan</h3>
              <p className="text-muted-foreground">
                Coba ubah filter Anda untuk melihat hasil lain.
              </p>
              <Button variant="link" onClick={() => setFilterCategory(null)}>
                Reset Filter
              </Button>
            </div>
          )}

          {/* Load More */}
          {processedReports.length > 0 && (
            <div className="flex justify-center pt-6">
              <Button
                variant="outline"
                className="h-12 rounded-2xl border-border px-8 font-semibold text-foreground shadow-sm transition-all hover:bg-accent"
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
