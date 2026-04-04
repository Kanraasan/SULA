import { UserNavbar } from "@/components/users/user-navbar"
import { UserFooter } from "@/components/users/user-footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { 
  ArrowLeft, 
  ThumbsUp, 
  Share2, 
  User, 
  CheckCircle2
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { cn } from "@/lib/utils"

export default function ReportDetailPage() {
  const navigate = useNavigate()

  // Data dummy untuk detail laporan
  const report = {
    title: "Jalan berlubang parah di perempatan pasar",
    category: "Infrastruktur",
    status: "Menunggu",
    description: "Jalan berlubang cukup dalam dan lebar di tengah perempatan pasar. Sangat berbahaya terutama saat hujan turun karena tertutup air dan sering menyebabkan pengendara motor terjatuh. Harap segera diperbaiki sebelum memakan korban lebih banyak lagi. Lubang ini sudah ada sejak 2 minggu yang lalu dan ukurannya semakin membesar akibat dilewati kendaraan berat.",
    reporter: "Budi Santoso",
    date: "12 Okt 2023, 14:30 WIB",
    votes: 124,
    imageUrl: "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=1470&auto=format&fit=crop",
  }

  const timeline = [
    { label: "Laporan Diterima", date: "12 Okt 2023, 14:30 WIB", status: "completed" },
    { label: "Diverifikasi", date: null, status: "pending" },
    { label: "Dalam Perbaikan", date: null, status: "pending" },
    { label: "Selesai", date: null, status: "pending" },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <UserNavbar />

      <main className="flex-1 container mx-auto px-4 py-8 md:px-8 max-w-6xl">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span className="text-sm font-medium">Kembali ke Feed</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Image & Description */}
          <div className="lg:col-span-2 space-y-6">
            <div className="rounded-3xl overflow-hidden shadow-sm border border-border bg-muted">
              <img 
                src={report.imageUrl} 
                alt={report.title}
                className="w-full h-[450px] object-cover"
              />
            </div>

            <Card className="rounded-3xl border-border bg-card shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
              <CardContent className="p-8 space-y-4">
                <h2 className="text-xl font-bold text-foreground">Deskripsi Laporan</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {report.description}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Info & Progress */}
          <div className="space-y-6">
            {/* Report Info Card */}
            <Card className="rounded-3xl border-border bg-card shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
              <CardContent className="p-8 space-y-6">
                <div className="space-y-4">
                  <h1 className="text-2xl font-bold leading-tight text-foreground">
                    {report.title}
                  </h1>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-none px-3 py-1 font-bold uppercase tracking-wide text-[10px]">
                      {report.status}
                    </Badge>
                    <Badge variant="secondary" className="bg-muted text-muted-foreground hover:bg-muted border-none px-3 py-1 font-medium">
                      {report.category}
                    </Badge>
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">Dilaporkan oleh {report.reporter}</p>
                    <p className="text-xs text-muted-foreground">{report.date}</p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <Button className="w-full h-12 rounded-2xl bg-blue-700 dark:bg-blue-600 hover:bg-blue-800 dark:hover:bg-blue-700 text-white font-bold gap-2 shadow-lg shadow-blue-700/20 dark:shadow-blue-600/10">
                    <ThumbsUp className="w-4 h-4 fill-white" />
                    Dukung Laporan ({report.votes})
                  </Button>
                  <Button variant="outline" className="w-full h-12 rounded-2xl border-border bg-muted/30 hover:bg-muted transition-all font-bold gap-2">
                    <Share2 className="w-4 h-4" />
                    Bagikan
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Timeline Progress Card */}
            <Card className="rounded-3xl border-border bg-card shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
              <CardContent className="p-8 space-y-6">
                <h2 className="text-lg font-bold text-foreground">Timeline Progress</h2>
                
                <div className="relative space-y-0">
                  {/* Vertical Line */}
                  <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-border z-0" />
                  
                  {timeline.map((step, idx) => (
                    <div key={idx} className="relative z-10 flex gap-4 pb-8 last:pb-0">
                      <div className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                        step.status === 'completed' 
                          ? "bg-blue-700 dark:bg-blue-600 text-white" 
                          : "bg-background border-2 border-border text-muted-foreground"
                      )}>
                        {step.status === 'completed' ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-border" />
                        )}
                      </div>
                      <div className="flex flex-col justify-center">
                        <p className={cn(
                          "text-sm font-bold leading-none",
                          step.status === 'completed' ? "text-foreground" : "text-muted-foreground"
                        )}>
                          {step.label}
                        </p>
                        {step.date && (
                          <p className="text-xs text-muted-foreground mt-1">{step.date}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <UserFooter />
    </div>
  )
}
