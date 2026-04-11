import { AppSidebar } from "@/components/app-sidebar"
import Clock from "@/components/clock-02"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Textarea } from "@/components/ui/textarea"
import { BriefcaseMedical } from "lucide-react"
import { type FormEvent, useState } from "react"
import { toast } from "sonner"
import { useAuth } from "@/hooks/useAuth"

type AdminProfile = {
  fullName: string
  bio: string
}

const getProfileStorageKey = (nik: string) => `admin-profile:${nik}`

const readAdminProfile = (nik: string): AdminProfile => {
  const fallbackProfile: AdminProfile = {
    fullName: "",
    bio: "",
  }

  if (typeof window === "undefined") {
    return fallbackProfile
  }

  const storedProfile = localStorage.getItem(getProfileStorageKey(nik))
  if (!storedProfile) {
    return fallbackProfile
  }

  try {
    const parsedProfile = JSON.parse(storedProfile) as Partial<AdminProfile>
    return {
      fullName: parsedProfile.fullName || "",
      bio: parsedProfile.bio || "",
    }
  } catch (error) {
    console.error("Failed to parse admin profile from localStorage", error)
    return fallbackProfile
  }
}

function ProfileInformationForm({
  user,
}: {
  user: {
    nik: string
    username: string
  }
}) {
  const initialProfile = readAdminProfile(String(user.nik))
  const [fullName, setFullName] = useState(
    initialProfile.fullName || user.username || ""
  )
  const [bio, setBio] = useState(initialProfile.bio)

  const handleSaveProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const profile: AdminProfile = {
      fullName: fullName.trim() || user.username || "",
      bio: bio.trim(),
    }

    localStorage.setItem(getProfileStorageKey(String(user.nik)), JSON.stringify(profile))
    toast.success("Profil berhasil disimpan")
  }

  return (
    <form className="space-y-6" onSubmit={handleSaveProfile}>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fullName">Nama</Label>
          <Input
            id="fullName"
            placeholder="Ubah nama panjang Anda..."
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          rows={4}
          placeholder="Berikan informasi kredensial anda kepada kami...."
          value={bio}
          onChange={(event) => setBio(event.target.value)}
        />
      </div>

      <div className="flex flex-col items-start justify-between gap-4 pt-4 text-sm text-muted-foreground md:flex-row md:items-center">
        <p>Perubahan ini akan tersimpan di sistem SULA</p>
        <Button type="submit" className="min-w-40">
          Simpan Perubahan
        </Button>
      </div>
    </form>
  )
}

export default function AdminSettingPage() {
  const { user } = useAuth()
  const currentYear = new Date().getFullYear()

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

              {user?.nik ? (
                <ProfileInformationForm key={String(user.nik)} user={user} />
              ) : (
                <p className="text-sm text-muted-foreground">
                  Data pengguna belum tersedia.
                </p>
              )}
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