import { UserNavbar } from "@/components/user/UserNavbar"
import { UserFooter } from "@/components/user/UserFooter"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Trophy, Medal, ChevronLeft, ChevronRight, User, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { reportService } from "@/services/report.service"
import { useAuth } from "@/hooks/useAuth"

export default function LeaderboardPage() {
  const { user: currentUser } = useAuth()
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true)
        const data = await reportService.getLeaderboard()
        setLeaderboard(data)
      } catch (err: any) {
        setError(err.message || "Gagal memuat leaderboard")
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

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

  const topThree = [
    leaderboard[1], // Rank 2
    leaderboard[0], // Rank 1
    leaderboard[2], // Rank 3
  ].filter(Boolean)

  const restOfLeaderboard = leaderboard.slice(3)

  const currentUserStats = leaderboard.find(u => u.username === currentUser?.username)

  return (
    <div className="min-h-screen bg-muted/30 dark:bg-background transition-colors duration-300">
      <UserNavbar />
      
      <main className="container mx-auto px-4 py-12 md:px-8">
        {/* Header Section */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-black tracking-tight text-foreground">
            Leaderboard Pelapor
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Apresiasi untuk anggota masyarakat paling aktif yang telah berkontribusi dalam melaporkan masalah fasilitas publik di Kota Surakarta.
          </p>
        </div>

        {/* Top 3 Section */}
        <div className="mb-12 flex flex-col items-end justify-center gap-6 md:flex-row md:items-stretch">
          {leaderboard.length > 1 && (
            <div className="order-2 w-full md:order-1 md:max-w-xs">
              <Card className="h-full border-border bg-card shadow-sm transition-all hover:shadow-md">
                <CardContent className="flex flex-col items-center p-8 text-center">
                  <div className="relative mb-6">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full border-4 border-card bg-muted p-2 shadow-sm">
                      <Medal className="h-6 w-6 text-slate-400" />
                    </div>
                    <div className="h-20 w-20 overflow-hidden rounded-full border-4 border-muted bg-muted shadow-inner">
                      <img src={leaderboard[1].image} alt={leaderboard[1].name} className="h-full w-full object-cover" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{leaderboard[1].name}</h3>
                  <p className="text-sm text-muted-foreground">{leaderboard[1].district}</p>
                  <div className="mt-6 w-full rounded-2xl bg-muted/50 p-4">
                    <div className="text-2xl font-bold text-primary dark:text-blue-500">{leaderboard[1].validReports}</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Laporan Valid</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {leaderboard.length > 0 && (
            <div className="order-1 w-full md:order-2 md:max-w-xs">
              <Card className="h-full border-primary/20 bg-gradient-to-b from-primary/[0.05] to-card shadow-xl md:scale-110 transition-all hover:shadow-2xl hover:shadow-primary/10">
                <CardContent className="flex flex-col items-center p-8 text-center">
                  <div className="relative mb-6">
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 rounded-full border-4 border-card bg-yellow-500/10 p-3 shadow-md">
                      <Trophy className="h-8 w-8 text-yellow-500" />
                    </div>
                    <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-yellow-500/20 bg-muted shadow-inner">
                      <img src={leaderboard[0].image} alt={leaderboard[0].name} className="h-full w-full object-cover" />
                    </div>
                  </div>
                  <h3 className="text-xl font-black text-foreground">{leaderboard[0].name}</h3>
                  <p className="text-sm font-medium text-muted-foreground">{leaderboard[0].district}</p>
                  <div className="mt-6 w-full rounded-2xl bg-yellow-500/10 p-5">
                    <div className="text-3xl font-black text-yellow-600 dark:text-yellow-500">{leaderboard[0].validReports}</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-yellow-700 dark:text-yellow-600">Laporan Valid</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {leaderboard.length > 2 && (
            <div className="order-3 w-full md:max-w-xs">
              <Card className="h-full border-border bg-card shadow-sm transition-all hover:shadow-md">
                <CardContent className="flex flex-col items-center p-8 text-center">
                  <div className="relative mb-6">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full border-4 border-card bg-orange-500/10 p-2 shadow-sm">
                      <Medal className="h-6 w-6 text-amber-600" />
                    </div>
                    <div className="h-20 w-20 overflow-hidden rounded-full border-4 border-orange-500/10 bg-muted shadow-inner">
                      <img src={leaderboard[2].image} alt={leaderboard[2].name} className="h-full w-full object-cover" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{leaderboard[2].name}</h3>
                  <p className="text-sm text-muted-foreground">{leaderboard[2].district}</p>
                  <div className="mt-6 w-full rounded-2xl bg-muted/50 p-4">
                    <div className="text-2xl font-bold text-primary dark:text-blue-500">{leaderboard[2].validReports}</div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Laporan Valid</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Current User Info Banner */}
        <div className="mb-8 overflow-hidden rounded-3xl border border-primary/10 bg-primary/[0.03] backdrop-blur-sm shadow-sm">
          <div className="flex flex-col items-center justify-between gap-6 p-6 md:flex-row">
            <div className="flex items-center gap-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 text-lg font-black">
                {currentUserStats?.rank || "-"}
              </div>
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 overflow-hidden rounded-full bg-muted ring-4 ring-background shadow-inner">
                  <User className="h-full w-full p-2 text-muted-foreground" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-foreground leading-none">Anda ({currentUser?.username || "Pengguna"})</h4>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {currentUserStats ? "Pertahankan kontribusi Anda!" : "Mulai buat laporan untuk masuk leaderboard!"}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-12">
              <div className="text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Total Dikirim</p>
                <p className="text-xl font-black text-foreground">{currentUserStats?.totalReports || 0}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary dark:text-blue-500">Laporan Valid</p>
                <p className="text-3xl font-black text-primary dark:text-blue-500">{currentUserStats?.validReports || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Leaderboard Table */}
        <Card className="overflow-hidden border-border bg-card shadow-xl shadow-primary/5">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow className="hover:bg-transparent border-border">
                <TableHead className="w-24 text-center text-xs font-bold uppercase tracking-widest text-muted-foreground">Urutan</TableHead>
                <TableHead className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Warga</TableHead>
                <TableHead className="text-center text-xs font-bold uppercase tracking-widest text-muted-foreground">Total Dikirim</TableHead>
                <TableHead className="text-center text-xs font-bold uppercase tracking-widest text-primary dark:text-blue-500">Laporan Valid</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {restOfLeaderboard.map((user) => (
                <TableRow key={user.rank} className="group transition-colors border-border hover:bg-muted/30">
                  <TableCell className="text-center font-bold text-muted-foreground/60 group-hover:text-foreground transition-colors">
                    {user.rank}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 overflow-hidden rounded-xl bg-muted group-hover:ring-2 group-hover:ring-primary/20 transition-all">
                        <img src={user.image} alt={user.name} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <div className="font-bold text-foreground group-hover:text-primary dark:group-hover:text-blue-500 transition-colors">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.district}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-medium text-foreground">
                    {user.totalReports}
                  </TableCell>
                  <TableCell className="text-center font-black text-foreground">
                    {user.validReports}
                  </TableCell>
                </TableRow>
              ))}
              {restOfLeaderboard.length === 0 && leaderboard.length <= 3 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    Tidak ada data tambahan
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex flex-col items-center justify-between gap-4 border-t border-border bg-card px-6 py-4 md:flex-row">
            <p className="text-sm text-muted-foreground">
              Menampilkan <span className="font-bold text-foreground">{leaderboard.length}</span> warga
            </p>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" className="h-9 w-9 rounded-lg border-border" disabled>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="default" size="sm" className="h-9 w-9 rounded-lg p-0 text-sm font-bold shadow-lg shadow-primary/20">
                1
              </Button>
              <Button variant="outline" size="icon" className="h-9 w-9 rounded-lg border-border" disabled>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      </main>

      <UserFooter />
    </div>
  )
}
