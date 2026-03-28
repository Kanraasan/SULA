import { Megaphone } from "lucide-react"

export function UserFooter() {
  return (
    <footer className="border-t bg-background py-12">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm shadow-primary/20">
              <Megaphone className="h-4 w-4 -rotate-12" />
            </div>
            <span className="text-xl font-bold tracking-tighter">SULA</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Tentang Kami</a>
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Kebijakan Privasi</a>
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Syarat & Ketentuan</a>
            <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Hubungi Kami</a>
          </div>

          <p className="text-sm text-muted-foreground/60">
            © 2024 SULA. Membangun lingkungan yang lebih baik bersama.
          </p>
        </div>
      </div>
    </footer>
  )
}
