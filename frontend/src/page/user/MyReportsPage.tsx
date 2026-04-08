import { useState, useEffect } from "react"
import { UserNavbar } from "@/components/user/user-navbar"
import { UserFooter } from "@/components/user/user-footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { FileText as FileTextIcon, Calendar as CalendarIcon, Trash2 as Trash2Icon, Edit as EditIcon } from "lucide-react"

type Post = {
  id: string
  title: string
  category: string
  description: string
  lampiranFoto: string | null
  userNik?: string
  username?: string
  createdAt: string
}

export default function MyReportsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [userNik, setUserNik] = useState<string | null>(null)

  useEffect(() => {
    // ambil data user dari localstorage
    const userData = localStorage.getItem("user")
    if (userData) {
      const user = JSON.parse(userData)
      setUserNik(user.nik)
      console.log("user nik:", user.nik)
    } else {
      console.log("gak ada data user di localstorage")
    }

    // fetch semua laporan
    fetch("/api/report")
      .then((res) => res.json())
      .then((result) => {
        console.log("semua laporan:", result.data)
        setPosts(result.data || [])
        setIsLoading(false)
      })
      .catch((error) => {
        console.error("error pas ambil laporan:", error)
        setIsLoading(false)
      })
  }, [])

  // filter laporan biar cuma punya user yang lagi login
  const myPosts = posts.filter((post) => {
    const postNik = post.userNik?.toString()
    const currentUserNik = userNik?.toString()
    return postNik === currentUserNik
  })

  const handleDelete = async (id: string) => {
    if (!confirm("yakin nih mau dihapus laporannya?")) return

    try {
      const response = await fetch(`/api/report/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        alert("laporan udah dihapus ya")
        setPosts(posts.filter((post) => post.id !== id))
      } else {
        alert("gagal nih hapus laporannya")
      }
    } catch (error) {
      alert("waduh ada error pas mau hapus")
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <UserNavbar />

      <main className="flex-1 container mx-auto px-4 py-8 md:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Laporan Saya</h1>
          <p className="text-muted-foreground">
            Kelola semua laporan yang udah kamu bikin
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">lagi loading laporannya...</p>
          </div>
        ) : myPosts.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent className="pt-6">
              <FileTextIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Belum ada laporan</h3>
              <p className="text-muted-foreground mb-4">
                Kamu belum bikin laporan apa-apa nih
              </p>
              <Button onClick={() => window.location.href = "/report-form"}>
                Bikin Laporan Baru
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {myPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Badge variant="secondary" className="mb-2">
                      {post.category}
                    </Badge>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => window.location.href = `/edit-report/${post.id}`}
                      >
                        <EditIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(post.id)}
                      >
                        <Trash2Icon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{post.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2 text-xs">
                    <CalendarIcon className="h-3 w-3" />
                    {new Date(post.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {post.description}
                  </p>
                  {post.lampiranFoto && (
                    <img
                      src={`http://localhost:5000/uploads/${post.lampiranFoto}`}
                      alt={post.title}
                      className="w-full h-40 object-cover rounded-md"
                    />
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <UserFooter />
    </div>
  )
}
