import { UserNavbar } from "@/components/user/UserNavbar"
import { UserFooter } from "@/components/user/UserFooter"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { 
  ArrowLeft, 
  ThumbsUp, 
  Share2, 
  User, 
  CheckCircle2,
  Loader2,
  MessageSquareText
} from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import { reportService } from "@/services/report.service"
import { useAuth } from "@/hooks/useAuth"
import { toast } from "sonner"

export default function ReportDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const [report, setReport] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isUpvoting, setIsUpvoting] = useState(false)

  useEffect(() => {
    const fetchReport = async () => {
      if (!id) return
      try {
        setLoading(true)
        const data = await reportService.getById(id)
        setReport(data)
      } catch (err: any) {
        setError(err.message || "Gagal memuat detail laporan")
      } finally {
        setLoading(false)
      }
    }

    fetchReport()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <UserNavbar />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
        <UserFooter />
      </div>
    )
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <UserNavbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <p className="text-xl font-bold text-destructive">{error || "Laporan tidak ditemukan"}</p>
          <Button onClick={() => navigate(-1)}>Kembali</Button>
        </div>
        <UserFooter />
      </div>
    )
  }

  const timeline = [
    { label: "Laporan Diterima", date: report.created_at, status: "completed" },
    { label: "Diverifikasi", date: (report.status === 'diproses' || report.status === 'selesai') ? report.created_at : null, status: (report.status === 'diproses' || report.status === 'selesai') ? "completed" : "pending" },
    { label: "Dalam Perbaikan", date: report.status === 'selesai' ? report.created_at : null, status: report.status === 'selesai' ? "completed" : "pending" },
    { label: "Selesai", date: report.status === 'selesai' ? report.created_at : null, status: report.status === 'selesai' ? "completed" : "pending" },
  ]

  const imageUrl = report.complaint_image 
    ? (report.complaint_image.startsWith('http') ? report.complaint_image : `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/uploads/${report.complaint_image}`)
    : "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=1470&auto=format&fit=crop"

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
                src={imageUrl} 
                alt={report.complaint_title}
                className="w-full h-[450px] object-cover"
              />
            </div>

            <Card className="rounded-3xl border-border bg-card shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1">
              <CardContent className="p-8 space-y-4">
                <h2 className="text-xl font-bold text-foreground">Deskripsi Laporan</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {report.complaint_description}
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
                    {report.complaint_title}
                  </h1>
                  <div className="flex flex-wrap gap-2">
                    <Badge className={cn(
                      "border-none px-3 py-1 font-bold uppercase tracking-wide text-[10px]",
                      report.status === 'selesai' ? "bg-green-100 text-green-700" : 
                      report.status === 'diproses' ? "bg-blue-100 text-blue-700" :
                      "bg-red-100 text-red-700"
                    )}>
                      {report.status || "menunggu"}
                    </Badge>
                    <Badge variant="secondary" className="bg-muted text-muted-foreground hover:bg-muted border-none px-3 py-1 font-medium">
                      {report.complaint_category}
                    </Badge>
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">Dilaporkan oleh {report.username}</p>
                    <p className="text-xs text-muted-foreground">{new Date(report.created_at).toLocaleString('id-ID')}</p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  <Button 
                    className={cn(
                      "w-full h-12 rounded-2xl text-white font-bold gap-2 shadow-lg transition-all",
                      report.upvoted_by?.includes(user?.id)
                        ? "bg-muted-foreground/30 hover:bg-muted-foreground/40 shadow-none border border-border"
                        : "bg-blue-700 dark:bg-blue-600 hover:bg-blue-800 dark:hover:bg-blue-700 shadow-blue-700/20 dark:shadow-blue-600/10"
                    )}
                    disabled={isUpvoting || !user}
                    onClick={async () => {
                      if (!user) {
                        toast.error("Anda harus login untuk mendukung laporan")
                        return
                      }
                      setIsUpvoting(true)
                      try {
                        const result = await reportService.upvote(report.id)
                        setReport((prev: any) => ({ 
                          ...prev, 
                          upvotes: result.upvotes,
                          upvoted_by: result.hasUpvoted 
                            ? [...(prev.upvoted_by || []), user.id]
                            : (prev.upvoted_by || []).filter((id: string) => id !== user.id)
                        }))
                        toast.success(result.hasUpvoted ? "Berhasil mendukung laporan!" : "Dukungan dibatalkan")
                      } catch (err: any) {
                        toast.error(err.message || "Gagal mendukung laporan")
                      } finally {
                        setIsUpvoting(false)
                      }
                    }}
                  >
                    {isUpvoting ? (
                      <Loader2 className="w-4 h-4 animate-spin text-current" />
                    ) : (
                      <ThumbsUp className={cn(
                        "w-4 h-4",
                        report.upvoted_by?.includes(user?.id) ? "fill-foreground text-foreground" : "fill-white"
                      )} />
                    )}
                    {report.upvoted_by?.includes(user?.id) ? "Sudah Didukung" : "Dukung Laporan"} ({report.upvotes || 0})
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
                          <p className="text-xs text-muted-foreground mt-1">{new Date(step.date).toLocaleString('id-ID')}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Admin Feedback Card */}
            {report.catatan_admin && (report.status === 'selesai' || report.status === 'ditolak') && (
              <Card className="rounded-3xl border-border bg-card shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1 overflow-hidden">
                <div className={cn(
                  "px-8 py-3 flex items-center gap-2",
                  report.status === 'selesai' 
                    ? "bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400"
                    : "bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400"
                )}>
                  <MessageSquareText className="w-4 h-4" />
                  <span className="text-sm font-bold">Tanggapan Admin</span>
                </div>
                <CardContent className="p-8 pt-5">
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {report.catatan_admin}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      <UserFooter />
    </div>
  )
}
