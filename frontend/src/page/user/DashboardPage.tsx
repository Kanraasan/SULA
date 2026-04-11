import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { 
  ChevronRight, 
  CirclePlus, 
  ClipboardList, 
  HelpCircle, 
  LayoutDashboard, 
  MapPin, 
  Trophy, 
  UserCircle,
  Loader2
} from "lucide-react"
import { UserNavbar } from "@/components/user/UserNavbar"
import { UserFooter } from "@/components/user/UserFooter"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { useEffect } from "react"
import { useApi } from "@/hooks/useApi"
import { reportService } from "@/services/report.service"

export default function UserDashboardPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { execute, data: reports, loading } = useApi()
  
  const displayName = user?.username || "Warga"

  useEffect(() => {
    execute(reportService.getAll())
  }, [execute])

  const quickActions = [
    {
      title: "Buat Laporan",
      description: "Laporkan masalah fasilitas publik, jalan rusak, atau lampu mati di lingkungan Anda.",
      icon: CirclePlus,
      link: "/report-form"
    },
    {
      title: "Cek Status Laporan",
      description: "Lacak perkembangan dan respon atas laporan yang telah Anda buat sebelumnya.",
      icon: ClipboardList,
      link: "/status-laporan"
    },
    {
      title: "Leaderboard",
      description: "Lihat siapakah kontributor yang paling banyak membantu!",
      icon: Trophy,
      link: "/leaderboard"
    }
  ]

  const faqs = [
    {
      question: "Berapa lama proses pengajuan laporan?",
      answer: "Cukup luangkan waktu 3-5 menit saja, laporan sudah siap kami terima!"
    },
    {
      question: "Kapan laporan Saya ditanggapi?",
      answer: "Laporan Anda akan kami respon maksimal 3x24 jam. Namun apa bila memungkinkan, akan segera kami respon dan tangani secepatnya."
    },
    {
      question: "Kenapa laporan Saya tidak valid?",
      answer: "Mohon maaf! Laporan Anda akan dianggap tidak valid apabila bukti tidak dapat diverifikasi atau keterangan kurang lengkap."
    }
  ]

  const getStatusVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'selesai': return 'selesai';
      case 'diproses': return 'diproses';
      default: return 'menunggu';
    }
  }

  return (
    <div className="min-h-screen bg-muted/30 dark:bg-background transition-colors duration-300">
      <UserNavbar />

      <main className="container mx-auto px-4 py-12 md:px-8">
        {/* Hero Section */}
        <section className="mb-12">
          <h1 className="text-4xl font-black tracking-tight text-foreground">Halo, {displayName}!</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Selamat datang di dashboard layanan aduan Kota Surakarta. Ada yang bisa kami bantu hari ini?
          </p>
        </section>

        {/* Quick Actions */}
        <section className="mb-16">
          <h2 className="mb-6 text-2xl font-bold tracking-tight">Aksi Cepat</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {quickActions.map((action, idx) => (
              <Card 
                key={idx} 
                onClick={() => navigate(action.link)}
                className="group cursor-pointer transition-all duration-300 border-border hover:bg-primary dark:hover:bg-blue-600 hover:border-primary dark:hover:border-blue-600 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2"
              >
                <CardHeader className="pb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 dark:bg-blue-500/10 text-primary dark:text-blue-500 transition-all duration-300 group-hover:bg-white/20 group-hover:scale-110">
                    <action.icon className="h-6 w-6 stroke-[2.5px] transition-colors duration-300 group-hover:stroke-white group-hover:text-white" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <CardTitle className="transition-colors duration-300 group-hover:text-white">
                    {action.title}
                  </CardTitle>
                  <CardDescription className="transition-colors duration-300 group-hover:text-white/90">
                    {action.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Report Summary */}
        <section className="mb-16">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Ringkasan Laporan Lingkungan</h2>
            <Button variant="link" onClick={() => navigate("/status-laporan")} className="group p-0 text-primary dark:text-blue-600 hover:no-underline">
              Lihat Semua
              <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
          
          {loading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {reports?.slice(0, 3).map((report: any) => (
                <Card key={report.id} className="overflow-hidden border-border bg-card">
                  <div className="aspect-video w-full bg-muted">
                    {report.lampiranFoto ? (
                      <img src={`http://localhost:5000/uploads/${report.lampiranFoto}`} alt={report.title} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-muted-foreground">
                        <LayoutDashboard className="h-10 w-10 opacity-20" />
                      </div>
                    )}
                  </div>
                  <CardHeader className="p-5 pb-2">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant={getStatusVariant(report.status)}>{report.status || 'Menunggu'}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(report.createdAt).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                    <CardTitle className="text-base line-clamp-1">{report.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-5 pt-0 pb-4">
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {report.description}
                    </p>
                  </CardContent>
                  <Separator />
                  <div className="flex items-center gap-3 p-4 px-5 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {report.category}
                    </div>
                    <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                    <div className="flex items-center gap-1">
                      <UserCircle className="h-3 w-3" />
                      {report.username}
                    </div>
                  </div>
                </Card>
              ))}
              {(!reports || reports.length === 0) && (
                <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed rounded-3xl">
                  Belum ada laporan yang tersedia.
                </div>
              )}
            </div>
          )}
        </section>

        {/* FAQ Section */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold tracking-tight">FAQ</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {faqs.map((faq, idx) => (
              <Card key={idx} className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="text-base flex gap-2">
                    <HelpCircle className="h-5 w-5 text-primary dark:text-blue-600 shrink-0" />
                    {faq.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <UserFooter />
    </div>
  )
}

