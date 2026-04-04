import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { UserNavbar } from "@/components/users/user-navbar"
import { UserFooter } from "@/components/users/user-footer"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  ChevronRight,
  Home,
  Send,
  ChevronDown,
  Check,
  Zap,
  Lightbulb,
  Trash2,
  Building2,
  Leaf,
} from "lucide-react"
import { cn } from "@/lib/utils"

const categories = [
  {
    id: "infrastruktur",
    label: "Infrastruktur",
    desc: "Jalan rusak, jembatan, trotoar",
    icon: Building2,
  },
  {
    id: "penerangan",
    label: "Penerangan",
    desc: "Lampu jalan mati, kabel menjuntai",
    icon: Lightbulb,
  },
  {
    id: "kebersihan",
    label: "Kebersihan",
    desc: "Sampah menumpuk, saluran air mampet",
    icon: Trash2,
  },
  {
    id: "fasilitas",
    label: "Fasilitas Publik",
    desc: "Halte rusak, taman tidak terawat",
    icon: Zap,
  },
  {
    id: "lingkungan",
    label: "Lingkungan",
    desc: "Polusi, penebangan liar, limbah",
    icon: Leaf,
  },
]

export default function EditReportPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [judul, setJudul] = useState("")
  const [deskripsi, setDeskripsi] = useState("")
  const [existingPhoto, setExistingPhoto] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const categoryLabel = categories.find((c) => c.id === selectedCategory)?.label

  useEffect(() => {
    // Fetch data laporan berdasarkan ID
    fetch(`/api/post/${id}`)
      .then((res) => res.json())
      .then((result) => {
        if (result.data) {
          setJudul(result.data.judul)
          setDeskripsi(result.data.deskripsi)
          setSelectedCategory(result.data.kategori)
          setExistingPhoto(result.data.lampiranFoto)
        }
        setIsLoading(false)
      })
      .catch(() => {
        alert("Gagal memuat data laporan")
        setIsLoading(false)
      })
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!judul || !selectedCategory || !deskripsi) {
      alert("Mohon lengkapi semua field yang wajib diisi")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/post/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          judul,
          kategori: selectedCategory,
          deskripsi,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        alert("Laporan berhasil diperbarui!")
        navigate("/my-reports")
      } else {
        alert(result.message || "Gagal memperbarui laporan")
      }
    } catch (error) {
      alert("Terjadi kesalahan saat memperbarui laporan")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Memuat data laporan...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/30 transition-colors duration-300 dark:bg-background">
      <UserNavbar />

      <main className="container mx-auto px-4 py-12 md:px-8">
        {/* Breadcrumb */}
        <nav className="mb-10 flex items-center gap-2 text-xs font-medium tracking-wider text-muted-foreground/60 uppercase">
          <a
            href="/user-dashboard"
            className="flex items-center gap-1 transition-colors hover:text-primary dark:text-blue-600"
          >
            <Home className="h-3.5 w-3.5" />
            <span>Beranda</span>
          </a>
          <ChevronRight className="h-3 w-3" />
          <a
            href="/my-reports"
            className="transition-colors hover:text-primary dark:text-blue-600"
          >
            Laporan Saya
          </a>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground/80">Edit Laporan</span>
        </nav>

        <div className="mx-auto max-w-2xl">
          <Card className="border-none bg-card/50 shadow-2xl shadow-primary/5 backdrop-blur-sm">
            <CardHeader className="space-y-2 pb-8 text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary dark:text-blue-600">
                <Send className="h-6 w-6" />
              </div>
              <CardTitle className="text-3xl font-black tracking-tight">
                Edit Laporan
              </CardTitle>
              <CardDescription className="mx-auto max-w-sm text-base">
                Ubah informasi laporan Anda. Data yang ditampilkan adalah
                laporan Anda sebelumnya.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-8 px-8 pb-10">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Judul Laporan */}
                <div className="group space-y-2">
                  <Label
                    htmlFor="title"
                    className="text-xs font-bold tracking-widest text-muted-foreground uppercase transition-colors group-focus-within:text-primary dark:text-blue-600"
                  >
                    Judul Laporan (Edit sesuai kebutuhan)
                  </Label>
                  <Input
                    id="title"
                    value={judul}
                    onChange={(e) => setJudul(e.target.value)}
                    placeholder="Apa yang ingin Anda laporkan?"
                    className="h-14 rounded-2xl border-muted-foreground/10 bg-muted/20 px-5 text-base shadow-none transition-all focus-visible:border-primary focus-visible:ring-primary/20"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Judul saat ini:{" "}
                    <span className="font-semibold">{judul}</span>
                  </p>
                </div>

                {/* Kategori */}
                <div className="group space-y-2">
                  <Label className="text-xs font-bold tracking-widest text-muted-foreground uppercase transition-colors group-focus-within:text-primary dark:text-blue-600">
                    Kategori (Ubah jika perlu)
                  </Label>
                  <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                    <SheetTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className={cn(
                          "h-14 w-full justify-between rounded-2xl border-muted-foreground/10 bg-muted/20 px-5 text-base font-normal shadow-none transition-all hover:bg-muted/30",
                          !selectedCategory && "text-muted-foreground"
                        )}
                      >
                        {categoryLabel || "Pilih kategori masalah..."}
                        <ChevronDown className="h-4 w-4 opacity-50" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent
                      side="bottom"
                      className="mx-auto rounded-t-[32px] border-none px-6 pb-10 shadow-2xl sm:max-w-xl"
                    >
                      <SheetHeader className="pb-6">
                        <SheetTitle className="text-center text-2xl font-bold">
                          Pilih Kategori
                        </SheetTitle>
                        <SheetDescription className="text-center">
                          Sesuaikan laporan Anda dengan kategori yang tersedia
                          agar lebih cepat ditangani.
                        </SheetDescription>
                      </SheetHeader>
                      <div className="grid gap-3 py-4">
                        {categories.map((cat) => (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => {
                              setSelectedCategory(cat.id)
                              setIsSheetOpen(false)
                            }}
                            className={cn(
                              "flex w-full items-center gap-4 rounded-2xl border-2 border-transparent p-4 text-left transition-all",
                              selectedCategory === cat.id
                                ? "border-primary bg-primary/5 shadow-sm"
                                : "border-muted/20 hover:bg-muted/50"
                            )}
                          >
                            <div
                              className={cn(
                                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors",
                                selectedCategory === cat.id
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted text-muted-foreground"
                              )}
                            >
                              <cat.icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm leading-tight font-bold">
                                {cat.label}
                              </p>
                              <p className="mt-0.5 text-xs text-muted-foreground">
                                {cat.desc}
                              </p>
                            </div>
                            {selectedCategory === cat.id && (
                              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
                                <Check className="h-3.5 w-3.5 stroke-[3px]" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>

                {/* Deskripsi */}
                <div className="group space-y-2">
                  <Label
                    htmlFor="description"
                    className="text-xs font-bold tracking-widest text-muted-foreground uppercase transition-colors group-focus-within:text-primary dark:text-blue-600"
                  >
                    Deskripsi Detail (Edit sesuai kebutuhan)
                  </Label>
                  <Textarea
                    id="description"
                    value={deskripsi}
                    onChange={(e) => setDeskripsi(e.target.value)}
                    placeholder="Jelaskan detail lokasi, kondisi, dan kronologi kejadian..."
                    className="min-h-[180px] resize-none rounded-2xl border-muted-foreground/10 bg-muted/20 p-5 text-base shadow-none transition-all focus-visible:border-primary focus-visible:ring-primary/20"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Anda dapat menghapus atau menambahkan informasi pada
                    deskripsi di atas
                  </p>
                </div>

                {/* Foto Existing */}
                {existingPhoto && (
                  <div className="space-y-2">
                    <Label className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                      Foto Laporan Sebelumnya
                    </Label>
                    <img
                      src={`http://localhost:5000/uploads/${existingPhoto}`}
                      alt="Foto laporan"
                      className="h-48 w-full rounded-2xl object-cover"
                    />
                    <p className="text-xs text-muted-foreground">
                      Ini adalah foto yang Anda upload sebelumnya. Saat ini foto
                      tidak dapat diubah.
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-4 pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-14 flex-1 rounded-2xl text-base font-bold transition-colors hover:bg-destructive/5 hover:text-destructive"
                    onClick={() => navigate("/my-reports")}
                    disabled={isSubmitting}
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    className="h-14 flex-[2] rounded-2xl text-base font-bold shadow-xl shadow-primary/20 transition-all hover:shadow-primary/30"
                    disabled={isSubmitting}
                  >
                    <Send className="mr-2 h-5 w-5" />
                    {isSubmitting ? "Memperbarui..." : "Perbarui Laporan"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <UserFooter />
    </div>
  )
}
