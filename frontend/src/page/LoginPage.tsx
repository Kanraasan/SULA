import { LoginForm } from "@/components/login-form"
import loginImage from "@/assets/login-image.png"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden bg-muted lg:block">
        <img
          src={loginImage}
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
        <div className="absolute inset-0 z-10 bg-[linear-gradient(90deg,rgba(17,82,212,0.8)_0%,rgba(17,82,212,0.4)_100%)]" />
        <div className="absolute top-1/2 left-1/2 z-20 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 text-white">
          <h1 className="text-5xl font-bold tracking-tight">
            Bersama Membangun Lingkungan yang Lebih Baik
          </h1>
          <p className="mt-4 text-lg text-white/90">
            Platform pelaporan fasilitas publik terpadu untuk efisiensi
            penanganan masalah di Kota Surakarta
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  )
}
