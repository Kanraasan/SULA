import { useState, useEffect } from "react"
import { UserNavbar } from "@/components/users/user-navbar"
import { UserFooter } from "@/components/users/user-footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Calendar, Tag, Trash2, Edit } from "lucide-react"

type Post = {
  id: string
  judul: string
  kategori: string
  deskripsi: string
  lampiranFoto: string | null
  userNIK?: string
  username?: string
  createdAt: string
}

export default function MyReportsPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [userNIK, setUserNIK] = useState<string | null>(null)

  useEffect(() => {
    // Ambil data user dari localStorage
    const userData = localStorage.getItem("user")
    if (userData) {
      const user = JSON.parse(userData)
      setUserNIK(user.NIK)
      console.log("User NIK:", user.NIK)
    } else {
      console.log("No user data in localStorage")
    }

    // Fetch semua postingan
    fetch("/api/post")
      .then((res) => res.json())
      .then((result) => {
        console.log("All posts:", result.data)
        setPosts(result.data || [])
        setIsLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching posts:", error)
        setIsLoading(false)
      })
  }, [])

  // Filter postingan berdasarkan user yang login
  const myPosts = posts.filter((post) => {
    console.log("Comparing:", post.userNIK, "===", userNIK, "Result:", post.userNIK == userNIK)
    return post.userNIK == userNIK
  })

  console.log("My posts:", myPosts)

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus laporan ini?")) return

    try {
      const response = await fetch(`/api/post/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        alert("Laporan berhasil dihapus")
        setPosts(posts.filter((post) => post.id !== id))
      } else {
        alert("Gagal menghapus laporan")
      }
    } catch (error) {
      alert("Terjadi kesalahan saat menghapus laporan")
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <UserNavbar />

      <main className="flex-1 container mx-auto px-4 py-8 md:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Laporan Saya</h1>
          <p className="text-muted-foreground">
            Kelola semua laporan yang telah Anda buat
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Memuat laporan...</p>
          </div>
        ) : myPosts.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent className="pt-6">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Belum ada laporan</h3>
              <p className="text-muted-foreground mb-4">
                Anda belum membuat laporan apapun
              </p>
              <Button onClick={() => window.location.href = "/report-form"}>
                Buat Laporan Baru
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
                      {post.kategori}
                    </Badge>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => window.location.href = `/edit-report/${post.id}`}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        onClick={() => handleDelete(post.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{post.judul}</CardTitle>
                  <CardDescription className="flex items-center gap-2 text-xs">
                    <Calendar className="h-3 w-3" />
                    {new Date(post.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {post.deskripsi}
                  </p>
                  {post.lampiranFoto && (
                    <img
                      src={`http://localhost:5000/uploads/${post.lampiranFoto}`}
                      alt={post.judul}
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
