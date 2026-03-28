import { useState } from "react"
import { UserNavbar } from "@/components/users/user-navbar"
import { UserFooter } from "@/components/users/user-footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  UploadCloud, 
  Send, 
  ChevronDown, 
  Check,
  Zap,
  Lightbulb,
  Trash2,
  Building2,
  Leaf
} from "lucide-react"
import { cn } from "@/lib/utils"

const categories = [
  { id: "infrastruktur", label: "Infrastruktur", desc: "Jalan rusak, jembatan, trotoar", icon: Building2 },
  { id: "penerangan", label: "Penerangan", desc: "Lampu jalan mati, kabel menjuntai", icon: Lightbulb },
  { id: "kebersihan", label: "Kebersihan", desc: "Sampah menumpuk, saluran air mampet", icon: Trash2 },
  { id: "fasilitas", label: "Fasilitas Publik", desc: "Halte rusak, taman tidak terawat", icon: Zap },
  { id: "lingkungan", label: "Lingkungan", desc: "Polusi, penebangan liar, limbah", icon: Leaf },
]

export default function ReportFormPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

  const categoryLabel = categories.find(c => c.id === selectedCategory)?.label

  return (
    <div className="min-h-screen bg-muted/30 dark:bg-background transition-colors duration-300">
      <UserNavbar />

      <main className="container mx-auto px-4 py-12 md:px-8">
        {/* Breadcrumb - More Minimalist */}
        <nav className="mb-10 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground/60">
          <a href="/user-dashboard" className="flex items-center gap-1 hover:text-primary transition-colors">
            <Home className="h-3.5 w-3.5" />
            <span>Beranda</span>
          </a>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground/80">Buat Laporan</span>
        </nav>

        <div className="mx-auto max-w-2xl">
          <Card className="border-none shadow-2xl shadow-primary/5 bg-card/50 backdrop-blur-sm">
            <CardHeader className="space-y-2 pb-8 text-center">
              <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Send className="h-6 w-6" />
              </div>
              <CardTitle className="text-3xl font-black tracking-tight">Buat Laporan Baru</CardTitle>
              <CardDescription className="text-base max-w-sm mx-auto">
                Laporkan kendala fasilitas publik untuk kenyamanan warga Surakarta.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-8 px-8 pb-10">
              {/* Judul Laporan */}
              <div className="group space-y-2">
                <Label htmlFor="title" className="text-xs font-bold uppercase tracking-widest text-muted-foreground group-focus-within:text-primary transition-colors">
                  Judul Laporan
                </Label>
                <Input 
                  id="title" 
                  placeholder="Apa yang ingin Anda laporkan?" 
                  className="rounded-2xl h-14 border-muted-foreground/10 bg-muted/20 px-5 text-base focus-visible:ring-primary/20 focus-visible:border-primary transition-all shadow-none"
                />
              </div>

              {/* Kategori - Drawer Style */}
              <div className="group space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground group-focus-within:text-primary transition-colors">
                  Pilih Kategori
                </Label>
                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                  <SheetTrigger asChild>
                    <Button 
                      variant="outline" 
                      className={cn(
                        "w-full h-14 justify-between rounded-2xl border-muted-foreground/10 bg-muted/20 px-5 text-base font-normal hover:bg-muted/30 transition-all shadow-none",
                        !selectedCategory && "text-muted-foreground"
                      )}
                    >
                      {categoryLabel || "Pilih kategori masalah..."}
                      <ChevronDown className="h-4 w-4 opacity-50" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="bottom" className="rounded-t-[32px] px-6 pb-10 sm:max-w-xl mx-auto border-none shadow-2xl">
                    <SheetHeader className="pb-6">
                      <SheetTitle className="text-2xl font-bold text-center">Pilih Kategori</SheetTitle>
                      <SheetDescription className="text-center">
                        Sesuaikan laporan Anda dengan kategori yang tersedia agar lebih cepat ditangani.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="grid gap-3 py-4">
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => {
                            setSelectedCategory(cat.id)
                            setIsSheetOpen(false)
                          }}
                          className={cn(
                            "flex items-center gap-4 w-full p-4 rounded-2xl text-left transition-all border-2 border-transparent",
                            selectedCategory === cat.id 
                              ? "bg-primary/5 border-primary shadow-sm" 
                              : "hover:bg-muted/50 border-muted/20"
                          )}
                        >
                          <div className={cn(
                            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors",
                            selectedCategory === cat.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                          )}>
                            <cat.icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-sm leading-tight">{cat.label}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{cat.desc}</p>
                          </div>
                          {selectedCategory === cat.id && (
                            <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-white">
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
                <Label htmlFor="description" className="text-xs font-bold uppercase tracking-widest text-muted-foreground group-focus-within:text-primary transition-colors">
                  Deskripsi Detail
                </Label>
                <Textarea 
                  id="description" 
                  placeholder="Jelaskan detail lokasi, kondisi, dan kronologi kejadian..." 
                  className="min-h-[180px] rounded-2xl border-muted-foreground/10 bg-muted/20 p-5 text-base focus-visible:ring-primary/20 focus-visible:border-primary transition-all resize-none shadow-none"
                />
              </div>

              {/* Upload Foto - More Polished */}
              <div className="group space-y-3">
                <Label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Lampiran Foto
                </Label>
                <div className="relative flex min-h-[160px] cursor-pointer flex-col items-center justify-center rounded-[24px] border-2 border-dashed border-muted-foreground/10 bg-muted/10 transition-all hover:border-primary/40 hover:bg-primary/[0.02]">
                  <input type="file" className="absolute inset-0 z-10 cursor-pointer opacity-0" />
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background shadow-sm group-hover:scale-110 transition-transform">
                    <UploadCloud className="h-6 w-6 text-primary" />
                  </div>
                  <div className="mt-4 text-center">
                    <p className="text-sm font-bold">Klik atau seret foto ke sini</p>
                    <p className="mt-1 text-xs text-muted-foreground">PNG, JPG atau WEBP (Maks. 10MB)</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 pt-4">
                <Button 
                  variant="ghost" 
                  className="flex-1 h-14 rounded-2xl text-base font-bold hover:bg-destructive/5 hover:text-destructive transition-colors"
                  onClick={() => window.history.back()}
                >
                  Batal
                </Button>
                <Button className="flex-[2] h-14 rounded-2xl text-base font-bold shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all">
                  <Send className="mr-2 h-5 w-5" />
                  Kirim Laporan
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <UserFooter />
    </div>
  )
}
