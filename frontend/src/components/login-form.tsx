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

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
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
        <Field>
          <FieldLabel htmlFor="nik">NIK</FieldLabel>
          <Input
            id="nik"
            type="decimal"
            placeholder="Masukkan NIK"
            required
            className="bg-background"
          />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Kata Sandi</FieldLabel>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="Masukkan kata sandi"
            required
            className="bg-background"
          />
        </Field>
        <div className="flex">
          <div className="flex items-center gap-2">
            <Checkbox />
            <p className="text-sm">Ingat Saya</p>
          </div>
          <a
            href="#"
            className="ml-auto text-sm text-primary dark:text-blue-600 underline-offset-4 hover:underline"
          >
            Lupa sandi?
          </a>
        </div>
        <Field>
          <Button size="lg" type="submit">Masuk</Button>
        </Field>
        <Field>
          <FieldDescription className="text-center">
            Belum punya akun?{" "}
            <a href="/register" className="text-primary dark:text-blue-600 underline-offset-4 hover:underline">
              Daftar Sekarang
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
