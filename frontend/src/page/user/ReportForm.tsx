import { useState } from "react"
import { UserNavbar } from "@/components/user/user-navbar"
import { UserFooter } from "@/components/user/user-footer"
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
import { Checkbox } from "@/components/ui/checkbox"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Home,
  UploadCloud,
  Send,
  ChevronDown,
  Check,
  Zap,
  Lightbulb,
  Trash2,
  Building2,
  Leaf,
  EyeOff,
  Lock,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/useAuth"
import { useNavigate } from "react-router-dom"
import { useApi } from "@/hooks/useApi"
import { reportService } from "@/services/report.service"

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

type ReportType = "anonymous" | "confidential"

interface PrivacyOptionProps {
  id: ReportType
  title: string
  description: string
  icon: React.ElementType
  selected: boolean
  onClick: () => void
}

function PrivacyOption({
  title,
  description,
  icon: Icon,
  selected,
  onClick,
}: PrivacyOptionProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "group flex w-full cursor-pointer items-center gap-4 rounded-xl border transition-all",
        selected
          ? "border-primary bg-primary/[0.03] shadow-sm"
          : "border-border bg-background hover:bg-muted/50"
      )}
    >
      <div className="shrink-0 pl-4 pt-0.5">
        <Checkbox
          checked={selected}
          onCheckedChange={onClick}
          className="size-5 rounded-md border-muted-foreground/30 transition-all data-checked:border-primary data-checked:bg-primary"
        />
      </div>

      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors",
          selected
            ? "bg-primary/10 text-primary"
            : "bg-muted text-muted-foreground"
        )}
      >
        <Icon className="h-5 w-5" />
      </div>

      <div className="flex-1 space-y-1 py-4 pr-4">
        <p
          className={cn(
            "text-sm font-bold leading-none transition-colors",
            selected ? "text-primary" : "text-foreground"
          )}
        >
          {title}
        </p>
        <p className="max-w-[400px] text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  )
}

export default function ReportFormPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { execute, loading: isSubmitting } = useApi()
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [reportType, setReportType] = useState<ReportType | null>(
    "confidential"
  )

  const categoryLabel = categories.find((c) => c.id === selectedCategory)?.label

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCategory) {
      alert("Pilih kategori terlebih dahulu")
      return
    }

    if (!user) {
      alert("Anda harus login terlebih dahulu")
      navigate("/")
      return
    }

    try {
      // Buat FormData untuk upload file
      const formData = new FormData()
      formData.append("title", title)
      formData.append("category", selectedCategory)
      formData.append("description", description)
      formData.append("userNik", user.nik.toString())
      formData.append("username", user.username)
      formData.append("reportType", reportType || "confidential")

      if (file) {
        formData.append("lampiranFoto", file)
      }

      // Kirim ke backend menggunakan useApi dan reportService
      const result = await execute(reportService.create(formData))

      if (result.message) {
        alert(result.message)
      } else {
        alert("Laporan berhasil dikirim!")
      }
      
      navigate("/my-reports")
    } catch (error) {
      // Error handled by useApi
    }
  }

  const handleToggleReportType = (type: ReportType) => {
    setReportType((prev) => (prev === type ? null : type))
  }

  return (
    <div className="min-h-screen bg-muted/30 transition-colors duration-300 dark:bg-background">
      <UserNavbar />

      <main className="container mx-auto px-4 py-12 md:px-8">
        <Breadcrumb className="mb-10">
          <BreadcrumbList className="text-xs font-medium uppercase tracking-wider">
            <BreadcrumbItem>
              <BreadcrumbLink
                href="/user-dashboard"
                className="flex items-center gap-1"
              >
                <Home className="h-3.5 w-3.5" />
                Beranda
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-foreground/80">
                Buat Laporan
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mx-auto max-w-2xl">
          <Card className="border-none bg-card/50 shadow-2xl shadow-primary/5 backdrop-blur-sm">
            <CardHeader className="space-y-2 pb-8 text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary dark:text-blue-600">
                <Send className="h-6 w-6" />
              </div>
              <CardTitle className="text-3xl font-black tracking-tight">
                Buat Laporan Baru
              </CardTitle>
              <CardDescription className="mx-auto max-w-sm text-base">
                Laporkan kendala fasilitas publik untuk kenyamanan warga
                Surakarta.
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
                    Judul Laporan
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Apa yang ingin Anda laporkan?"
                    className="h-14 rounded-2xl border-muted-foreground/10 bg-muted/20 px-5 text-base shadow-none transition-all focus-visible:border-primary focus-visible:ring-primary/20"
                    required
                  />
                </div>

                {/* Kategori */}
                <div className="group space-y-2">
                  <Label className="text-xs font-bold tracking-widest text-muted-foreground uppercase transition-colors group-focus-within:text-primary dark:text-blue-600">
                    Pilih Kategori
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
                              <p className="text-sm font-bold leading-tight">
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
                    Deskripsi Detail
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Jelaskan detail lokasi, kondisi, dan kronologi kejadian..."
                    className="min-h-[180px] resize-none rounded-2xl border-muted-foreground/10 bg-muted/20 p-5 text-base shadow-none transition-all focus-visible:border-primary focus-visible:ring-primary/20"
                    required
                  />
                </div>

                {/* Upload Foto */}
                <div className="group space-y-3">
                  <Label className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                    Lampiran Foto{" "}
                    {file && (
                      <span className="text-primary">({file.name})</span>
                    )}
                  </Label>
                  <div className="relative flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-muted-foreground/10 bg-muted/10 transition-all hover:border-primary/40 hover:bg-primary/[0.02]">
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/jpg,image/webp"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                      className="absolute inset-0 z-10 cursor-pointer opacity-0"
                    />
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background shadow-sm transition-transform group-hover:scale-110">
                      <UploadCloud className="h-6 w-6 text-primary dark:text-blue-600" />
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-sm font-bold">
                        Klik atau seret foto ke sini
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        PNG, JPG atau WEBP (Maks. 10MB)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Anonymity Selection */}
                <div className="space-y-4">
                  <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Privasi Laporan
                  </Label>
                  <div className="grid gap-3">
                    <PrivacyOption
                      id="anonymous"
                      title="Kirim secara anonim"
                      description="Pesan Anda akan terlihat oleh semua orang, namun nama Anda tidak akan ditampilkan. Poin Anda tidak akan terakumulasi jika laporan valid."
                      icon={EyeOff}
                      selected={reportType === "anonymous"}
                      onClick={() => handleToggleReportType("anonymous")}
                    />
                    <PrivacyOption
                      id="confidential"
                      title="Kirim secara rahasia"
                      description="Pesan Anda tidak akan ditampilkan ke semua orang, namun Admin dapat melihat laporan beserta nama Anda. Poin akan terakumulasi jika laporan valid."
                      icon={Lock}
                      selected={reportType === "confidential"}
                      onClick={() => handleToggleReportType("confidential")}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-4 pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-14 flex-1 rounded-2xl text-base font-bold transition-colors hover:bg-destructive/5 hover:text-destructive"
                    onClick={() => window.history.back()}
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
                    {isSubmitting ? "Mengirim..." : "Kirim Laporan"}
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
