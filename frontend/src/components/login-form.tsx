import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [identifier, setIdentifier] = useState("") //identifier = NIK/Username
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!identifier.trim()) {
      newErrors.identifier = "NIK/Username wajib diisi"
    }
    if (!password.trim()) {
      newErrors.password = "Kata sandi wajib diisi"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    setIsSubmitting(true)
    setErrors({})

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier,
          password,
        }),
      })

      const result = await response.json()

      if (response.ok) {
        // Simpan data user ke localStorage (selalu simpan untuk session)
        localStorage.setItem("user", JSON.stringify(result.data))
        alert(`Login berhasil! Selamat datang ${result.data.username}`)
        window.location.href = "/user-dashboard"
      } else {
        setErrors({ general: result.message || "Login gagal" })
      }
    } catch (error) {
      setErrors({ general: "Terjadi kesalahan saat login" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1">
          <h1 className="text-2xl font-bold">
            Selamat Datang Kembali di SULA!
          </h1>
          <p className="text-sm text-balance text-muted-foreground">
            Silakan masuk untuk melaporkan atau memantau status fasilitas di
            lingkungan Anda.
          </p>
        </div>

        {errors.general && (
          <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            {errors.general}
          </div>
        )}

        <Field>
          <FieldLabel htmlFor="nik">NIK</FieldLabel>
          <Input
            id="nik"
            type="text"
            placeholder="Masukkan NIK"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            className="bg-background"
          />
          {errors.identifier && (
            <p className="text-sm text-destructive">{errors.identifier}</p>
          )}
        </Field>

        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Kata Sandi</FieldLabel>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="Masukkan kata sandi"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="bg-background"
          />
          {errors.password && (
            <p className="text-sm text-destructive">{errors.password}</p>
          )}
        </Field>

        <div className="flex">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={rememberMe}
              onCheckedChange={(checked) => setRememberMe(checked === true)}
            />
            <p className="text-sm">Ingat Saya</p>
          </div>
          <a
            href="#"
            className="ml-auto text-sm text-primary underline-offset-4 hover:underline dark:text-blue-600"
          >
            Lupa sandi?
          </a>
        </div>

        <Field>
          <Button size="lg" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Memproses..." : "Masuk"}
          </Button>
        </Field>

        <Field>
          <FieldDescription className="text-center">
            Belum punya akun?{" "}
            <a
              href="/register"
              className="text-primary underline-offset-4 hover:underline dark:text-blue-600"
            >
              Daftar Sekarang
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
