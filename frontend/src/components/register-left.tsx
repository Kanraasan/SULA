import { cn } from "@/lib/utils"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

export function RegisterLeft({
  className,
  ...props
}: React.ComponentProps<"form">) {
  return (
    <form className={cn("flex flex-col gap-5", className)} {...props}>
      <FieldGroup>
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold">Selamat Datang di SULA!</h1>
          <p className="text-sm text-balance text-muted-foreground">
            Silakan mendaftar dan mendapatkan akun Anda untuk
            melaporkan atau memantau status fasilitas di lingkungan
            Anda.
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor="nik">NIK</FieldLabel>
          <Input
            id="nik"
            type="decimal"
            placeholder="Masukkan NIK Anda"
            required
            className="bg-background"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="username">Username</FieldLabel>
          <Input
            id="username"
            type="text"
            placeholder="Masukkan Username Anda"
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
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="passwordConfirm">Konfirmasi Kata Sandi</FieldLabel>
          </div>
          <Input
            id="passwordConfirm"
            type="password"
            placeholder="Masukkan ulang kata sandi"
            required
            className="bg-background"
          />
        </Field>
      </FieldGroup>
    </form>
  )
}
