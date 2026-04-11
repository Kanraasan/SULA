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
import { useAuth } from "@/hooks/useAuth"
import { useNavigate } from "react-router-dom"
import { useApi } from "@/hooks/useApi"
import { authService } from "@/services/auth.service"
import { Eye, EyeOff } from "lucide-react"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [identifier, setIdentifier] = useState("") 
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  
  const { login } = useAuth()
  const navigate = useNavigate()
  const { execute, loading, error: apiError } = useApi()

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!identifier.trim()) {
      newErrors.identifier = "Email atau Username wajib diisi"
    }
    if (!password.trim()) {
      newErrors.password = "Kata sandi wajib diisi"
    }
    setFormErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    try {
      const userData = await execute(authService.login(identifier, password))
      login(userData, rememberMe)
      
      if (userData.role === "admin") {
        navigate("/dashboard")
      } else {
        navigate("/")
      }
    } catch (error) {
      // Error handled by useApi
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

        {(apiError || formErrors.general) && (
          <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
            {apiError || formErrors.general}
          </div>
        )}

        <Field>
          <FieldLabel htmlFor="identifier">Email atau Username</FieldLabel>
          <Input
            id="identifier"
            type="text"
            placeholder="Masukkan Email atau Username Anda"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            className="bg-background"
          />
          {formErrors.identifier && (
            <p className="text-sm text-destructive">{formErrors.identifier}</p>
          )}
        </Field>

        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Kata Sandi</FieldLabel>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Masukkan kata sandi"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-background pr-10"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {formErrors.password && (
            <p className="text-sm text-destructive">{formErrors.password}</p>
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
          <Button size="lg" type="submit" disabled={loading}>
            {loading ? "Memproses..." : "Masuk"}
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
