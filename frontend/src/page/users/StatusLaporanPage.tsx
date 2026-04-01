import { useState, useMemo, useEffect } from "react"
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

type Post = {
  id: string
  judul: string
  kategori: string
  deskripsi: string
  lampiranFoto: string | null
  userNIK?: string
  username?: string
  createdAt: string
}

const CATEGORIES = [
  "infrastruktur",
  "kebersihan",
  "fasilitas",
  "lingkungan",
  "penerangan",
]

export default function StatusLaporanPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [userNIK, setUserNIK] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState<string | null>(null)
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest")

  useEffect(() => {
    const fetchData = async () => {
      const userData = localStorage.getItem("user")
      let currentUserNIK = null
      
      if (userData) {
        const user = JSON.parse(userData)
        currentUserNIK = user.NIK
        console.log("User NIK from localStorage:", currentUserNIK)
      } else {
        console.log("No user data found in localStorage")
      }

      try {
        const response = await fetch("/api/post")
        const result = await response.json()
        console.log("All posts from API:", result.data)
        setPosts(result.data || [])
        setUserNIK(currentUserNIK)
      } catch (error) {
        console.error("Error fetching posts:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const processedReports = useMemo(() => {
    console.log("Filtering posts. Total posts:", posts.length)
    console.log("User NIK for filtering:", userNIK)
    
    let result = posts.filter((post) => {
      console.log(`Post ${post.id}: userNIK=${post.userNIK}, comparing with ${userNIK}, match=${post.userNIK == userNIK}`)
      return post.userNIK == userNIK
    })
    
    console.log("Filtered posts (user's posts):", result)

    if (filterCategory) {
      result = result.filter((post) => post.kategori === filterCategory)
    }

    result.sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      } else {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      }
    })

    console.log("Final processed reports:", result)
    return result
  }, [posts, userNIK, filterCategory, sortOrder])

  const formatReportForCard = (post: Post) => {
    const imageUrl = post.lampiranFoto
      ? `http://localhost:5000/uploads/${post.lampiranFoto}`
      : "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=1470&auto=format&fit=crop"
    
    console.log("Post:", post.id, "Image:", imageUrl)
    
    return {
      id: post.id,
      title: post.judul,
      category: post.kategori,
      status: "Menunggu" as const,
      time: new Date(post.createdAt).toLocaleDateString("id-ID"),
      createdAt: new Date(post.createdAt),
      author: post.username || "Anonymous",
      votes: 0,
      imageUrl,
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <UserNavbar />

      <main className="container mx-auto flex-1 px-4 py-8 md:px-8">
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
              Pantau status laporan yang telah Anda kirimkan secara real-time.
            </p>
          </div>
        </section>

        <div className="space-y-8">
          <div className="flex flex-col justify-between gap-4 border-b border-border pb-4 md:flex-row md:items-end">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Laporan Saya
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {filterCategory
                  ? `Menampilkan kategori: ${filterCategory}`
                  : "Menampilkan semua laporan yang Anda kirimkan"}
              </p>
            </div>
            <div className="flex items-center gap-2">
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
                      className="flex items-center justify-between capitalize"
                    >
                      {cat}
                      {filterCategory === cat && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

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

          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Memuat laporan...</p>
            </div>
          ) : processedReports.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {processedReports.map((post) => (
                <ReportCard key={post.id} {...formatReportForCard(post)} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-4 py-20 text-center">
              <div className="rounded-full bg-muted p-6">
                <Filter className="h-12 w-12 text-muted-foreground opacity-20" />
              </div>
              <h3 className="text-xl font-bold">Belum ada laporan</h3>
              <p className="text-muted-foreground">
                Anda belum membuat laporan apapun.
              </p>
              <Button onClick={() => window.location.href = "/report-form"}>
                Buat Laporan Baru
              </Button>
            </div>
          )}
        </div>
      </main>

      <UserFooter />
    </div>
  )
}
