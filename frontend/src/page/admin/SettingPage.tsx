import { AppSidebar } from "@/components/app-sidebar"
import Clock from "@/components/clock-02"
import { ThemeToggle } from "@/components/theme-toggle"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, BriefcaseMedical } from "lucide-react"
import { type FormEvent } from "react"

export default function AdminSettingPage() {
  const currentYear = new Date().getFullYear()
  const handleSaveProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="bg-slate-50/50 dark:bg-background">
        <header className="flex h-16 shrink-0 items-center justify-between border-b bg-sidebar px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <h2 className="font-bold">Pengaturan</h2>
          </div>
          <div className="flex items-center gap-4">
            <Clock />
            <ThemeToggle />
          </div>
        </header>

        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-6 md:px-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">
              Pengaturan
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Atur profil dan identitas Anda
            </p>
          </div>

          <Card className="rounded-2xl border-slate-200/80 shadow-sm">
            <CardContent className="space-y-8 p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-100 p-2 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
                  <BriefcaseMedical className="h-4 w-4" />
                </div>
                <h2 className="text-2xl font-semibold tracking-tight">Profile information</h2>
              </div>

              <form className="space-y-6" onSubmit={handleSaveProfile}>
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nama</Label>
                    <Input id="fullName" placeholder="Ubah nama panjang Anda..." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email address</Label>
                    <Input id="email" type="email" placeholder="Ubah alamat email Anda" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    rows={4}
                    placeholder="Berikan informasi kredensial anda kepada kami...."
                  />
                </div>

                <div className="flex flex-col items-start justify-between gap-4 pt-4 text-sm text-muted-foreground md:flex-row md:items-center">
                  <p>Perubahan ini akan tersimpan di sistem SULA</p>
                  <Button type="submit" className="min-w-40">Simpan Perubahan</Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-2xl border-red-200/80 py-0">
            <CardTitle className="border-b bg-red-50 px-6 py-3 text-red-700 dark:bg-red-950/20 dark:text-red-400">
              <div className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
                <AlertCircle className="h-5 w-5" />
                Zona Berbahaya
              </div>
            </CardTitle>
            <CardContent className="flex flex-col gap-5 px-6 py-6 md:flex-row md:items-center md:justify-between">
              <div className="max-w-xl">
                <h3 className="text-3xl font-bold tracking-tight">Hapus Akun</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Setelah anda klik tombol berikut, maka akun Anda akan segera terhapus secara permanen. Pastikan anda sudah
                  yakin ketika hendak melakukan penghapusan akun.
                </p>
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" className="w-full border-red-500 text-red-600 hover:bg-red-50 hover:text-red-700 md:w-40">
                    Hapus Akun
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Konfirmasi Hapus Akun</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tindakan ini bersifat permanen. Data akun dan aktivitas Anda akan dihapus dari sistem.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction className="bg-red-600 hover:bg-red-700">Lanjut Hapus</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>

          <p className="pb-4 text-center text-xs text-muted-foreground">
            © {currentYear} SULA. Hak cipta dilindungi undang-undang.
          </p>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}