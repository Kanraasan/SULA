/// <reference types="vite/client" />

// biar typescript kenal variabel di file .env
interface ImportMetaEnv {
  readonly VITE_API_URL: string
  // tambahin variabel lain di sini kalo perlu...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
