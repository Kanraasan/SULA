import { AppSidebar } from "@/components/AppSidebar"
import Clock02 from "@/components/Clock02"
import { ThemeToggle } from "@/components/ThemeToggle"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, BriefcaseMedical, Loader2 } from "lucide-react"
import { useEffect, useState, type FormEvent } from "react"
import { parseApiResponse } from "@/lib/api-client"
import { toast } from "sonner"
import { useAuth } from "@/hooks/useAuth"

type AdminProfile = {
  username: string
  email: string
  alamatLengkap: string
  kecamatan: string
  kelurahan: string
}

export default function AdminSettingPage() {
  const currentYear = new Date().getFullYear()
  const { logout } = useAuth()

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const [profile, setProfile] = useState<AdminProfile>({
    username: "",
    email: "",
    alamatLengkap: "",
    kecamatan: "",
    kelurahan: "",
  })

  // Ambil auth headers dari localStorage
  const getAuthHeaders = (): Record<string, string> => {
    const rawUser = localStorage.getItem("user")
    if (!rawUser) return {}
    try {
      const parsedUser = JSON.parse(rawUser) as { token?: string }
      if (!parsedUser.token) return {}
      return { Authorization: `Bearer ${parsedUser.token}` }
    } catch {
      return {}
    }
  }

  // Fetch profil admin saat halaman dimuat
  useEffect(() => {
    // Gunakan fetch langsung karena api.get tidak support custom headers
    const loadProfile = async () => {
      try {
        const headers = getAuthHeaders()
        const response = await fetch(
          import.meta.env.VITE_API_URL
            ? `${(import.meta.env.VITE_API_URL as string).replace(/\/+$/, "")}/admin/profile`
            : "/api/admin/profile",
          { headers }
        )

        if (!response.ok) {
          let errData = {}
          try {
            errData = await parseApiResponse(response)
          } catch {
            // ignore parse failure and use generic error message
          }
          toast.error((errData as any).message || "Gagal memuat profil")
          return
        }

        const result = await parseApiResponse(response)
        if (result.data) {
          setProfile({
            username: result.data.username || "",
            email: result.data.email || "",
            alamatLengkap: result.data.alamatLengkap || "",
            kecamatan: result.data.kecamatan || "",
            kelurahan: result.data.kelurahan || "",
          })
        }
      } catch (error) {
        console.error("Gagal memuat profil:", error)
        toast.error("Gagal memuat profil admin")
      } finally {
        setIsLoading(false)
      }
    }

    void loadProfile()
  }, [])

  // Simpan perubahan profil
  const handleSaveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSaving(true)

    try {
      const headers = {
        "Content-Type": "application/json",
        ...getAuthHeaders(),
      }

      const response = await fetch(
        import.meta.env.VITE_API_URL
          ? `${(import.meta.env.VITE_API_URL as string).replace(/\/+$/, "")}/admin/profile`
          : "/api/admin/profile",
        {
          method: "PUT",
          headers,
          body: JSON.stringify({
            username: profile.username,
            alamatLengkap: profile.alamatLengkap,
            kecamatan: profile.kecamatan,
            kelurahan: profile.kelurahan,
          }),
        }
      )

      const result = await parseApiResponse(response)

      if (!response.ok) {
        toast.error(result.message || "Gagal menyimpan perubahan")
        return
      }

      toast.success(result.message || "Profil berhasil diperbarui")

      // Perbarui data user di localStorage agar sidebar ikut update
      const rawUser = localStorage.getItem("user")
      if (rawUser) {
        try {
          const userData = JSON.parse(rawUser)
          userData.username = profile.username
          localStorage.setItem("user", JSON.stringify(userData))
        } catch { /* ignore */ }
      }
    } catch (error) {
      console.error("Gagal menyimpan profil:", error)
      toast.error("Terjadi kesalahan saat menyimpan profil")
    } finally {
      setIsSaving(false)
    }
  }

  // Hapus akun admin
  const handleDeleteAccount = async () => {
    setIsDeleting(true)

    try {
      const headers = {
        ...getAuthHeaders(),
      }

      const response = await fetch(
        import.meta.env.VITE_API_URL
          ? `${(import.meta.env.VITE_API_URL as string).replace(/\/+$/, "")}/admin/account`
          : "/api/admin/account",
        {
          method: "DELETE",
          headers,
        }
      )

      const result = await parseApiResponse(response)

      if (!response.ok) {
        toast.error(result.message || "Gagal menghapus akun")
        return
      }

      toast.success("Akun berhasil dihapus. Anda akan dialihkan...")

      // Logout dan redirect
      setTimeout(() => {
        logout()
      }, 1500)
    } catch (error) {
      console.error("Gagal menghapus akun:", error)
      toast.error("Terjadi kesalahan saat menghapus akun")
    } finally {
      setIsDeleting(false)
    }
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
            <Clock02 />
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
                <h2 className="text-2xl font-semibold tracking-tight">Informasi Profil</h2>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Memuat data profil...</span>
                </div>
              ) : (
                <form className="space-y-6" onSubmit={handleSaveProfile}>
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Nama</Label>
                      <Input
                        id="fullName"
                        placeholder="Ubah nama panjang Anda..."
                        value={profile.username}
                        onChange={(e) =>
                          setProfile((prev) => ({ ...prev, username: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profile.email}
                        disabled
                        className="cursor-not-allowed opacity-60"
                        title="Email tidak bisa diubah dari sini"
                      />
                      <p className="text-xs text-muted-foreground">
                        Email dikelola oleh sistem autentikasi dan tidak bisa diubah langsung.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="alamat">Alamat Lengkap</Label>
                    <Textarea
                      id="alamat"
                      rows={3}
                      placeholder="Masukkan alamat lengkap Anda..."
                      value={profile.alamatLengkap}
                      onChange={(e) =>
                        setProfile((prev) => ({ ...prev, alamatLengkap: e.target.value }))
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="kecamatan">Kecamatan</Label>
                      <Input
                        id="kecamatan"
                        placeholder="Masukkan kecamatan..."
                        value={profile.kecamatan}
                        onChange={(e) =>
                          setProfile((prev) => ({ ...prev, kecamatan: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="kelurahan">Kelurahan</Label>
                      <Input
                        id="kelurahan"
                        placeholder="Masukkan kelurahan..."
                        value={profile.kelurahan}
                        onChange={(e) =>
                          setProfile((prev) => ({ ...prev, kelurahan: e.target.value }))
                        }
                      />
                    </div>
                  </div>

                  <div className="flex flex-col items-start justify-between gap-4 pt-4 text-sm text-muted-foreground md:flex-row md:items-center">
                    <p>Perubahan ini akan tersimpan di sistem SULA</p>
                    <Button type="submit" className="min-w-40" disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Menyimpan...
                        </>
                      ) : (
                        "Simpan Perubahan"
                      )}
                    </Button>
                  </div>
                </form>
              )}
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
                    <AlertDialogAction
                      className="bg-red-600 hover:bg-red-700"
                      onClick={handleDeleteAccount}
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Menghapus...
                        </>
                      ) : (
                        "Lanjut Hapus"
                      )}
                    </AlertDialogAction>
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