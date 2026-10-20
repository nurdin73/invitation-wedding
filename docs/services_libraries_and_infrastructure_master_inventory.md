# Master Inventory: Services, Libraries, Infrastructure, & Dependencies

**Project:** Customizable Online Wedding Invitation SaaS Platform & Template Editor

**Version:** 1.0.0

**Stack Paradigm:** Decoupled Architecture (ElysiaJS / Bun Backend + Next.js 15+ Frontend)

## 1. Cloud Infrastructure & Third-Party SaaS Services

| Domain | Provider / Service | Tier / Plan Rekomendasi | Peruntukan Fungsional |
| :--- | :--- | :--- | :--- |
| **Runtime & Compute (Backend)** | VPS (Hetzner / DigitalOcean / AWS EC2) atau Coolify / Railway | Min. 2 vCPU, 4GB RAM (Linux x86/ARM) | Menjalankan Bun runtime + ElysiaJS API Gateway dalam container Docker. |
| **Frontend Edge / Hosting** | Vercel atau Cloudflare Pages / VPS Standalone | Pro / Self-hosted via Docker Node | Melayani SSR/ISR halaman publik tamu dan routing dashboard Next.js. |
| **Relational Database** | Managed PostgreSQL (Supabase / Neon DB / AWS RDS) | PostgreSQL 16+ (Min. Pool Size 20-50) | Penyimpanan data relasional (`users`, `orders`, `rsvps`) dan JSONB (`invitations`). |
| **Object Storage** | Cloudflare R2 | Standard (Pay-per-request) | Menyimpan aset statis foto WebP dan audio MP3 (Zero egress fees). |
| **Payment Gateway** | Midtrans (Core API / Snap) | Production Live Account | Menerima pembayaran QRIS, Virtual Account (BCA, Mandiri, BRI, BNI), & E-Wallet. |
| **Transactional Email** | Resend / Postmark / Amazon SES | Free / Pro | Mengirimkan email konfirmasi akun, reset password, dan nota pembayaran. |
| **CDN & DNS / SSL** | Cloudflare CDN | Free / Pro Plan | DNS resolver, Edge SSL automatic provisioning, DDOS protection, dan Web caching. |
| **Logging & Monitoring** | Sentry + Axiom / BetterStack | Developer Tier | Crash reporting, uncaught exception tracing, dan audit log webhook transaksi. |

## 2. Backend Dependencies (ElysiaJS & Bun)

File manifes dependensi untuk `backend/package.json`:

```json
{
  "name": "wedding-invitation-backend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "bun run --watch src/index.ts",
    "build": "bun build src/index.ts --outdir dist --target bun",
    "start": "bun run dist/index.js",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "bun run src/db/migrate.ts",
    "db:studio": "drizzle-kit studio"
  },
  "dependencies": {
    "elysia": "^1.2.0",
    "@elysiajs/cors": "^1.2.0",
    "@elysiajs/jwt": "^1.2.0",
    "@elysiajs/openapi": "^1.2.0",
    "drizzle-orm": "^0.38.0",
    "postgres": "^3.4.5",
    "@aws-sdk/client-s3": "^3.700.0",
    "@aws-sdk/s3-request-presigner": "^3.700.0",
    "midtrans-client": "^1.4.2",
    "nodemailer": "^6.9.16"
  },
  "devDependencies": {
    "@types/bun": "latest",
    "@types/nodemailer": "^6.4.17",
    "drizzle-kit": "^0.30.0",
    "typescript": "^5.7.0"
  }
}
```

### Breakdown Kebutuhan Library Backend:
* **`elysia`**: Web framework berkecepatan tinggi native runtime Bun. Menyediakan built-in schema validator TypeBox via `t` (`import { t } from 'elysia'`) sehingga tidak membutuhkan instalasi eksternal `@sinclair/typebox`.
* **`@elysiajs/cors`**: Penanganan CORS domain frontend.
* **`@elysiajs/openapi`**: Generasi spesifikasi OpenAPI 3.0 / 3.1 otomatis langsung dari schema TypeBox Elysia, menyediakan interactive documentation UI (/swagger).
* **`@elysiajs/jwt`**: Verifikasi session stateless berbasis JWT pada cookie HttpOnly.
* **`drizzle-orm` + `postgres`**: Headless lightweight ORM untuk query relasional dan tipe JSONB PostgreSQL.
* **`bun:password`**: Modul native Bun untuk hashing password menggunakan algoritma **Argon2id**.
* **`@aws-sdk/client-s3` & `@aws-sdk/s3-request-presigner`**: Membuat presigned URL PUT untuk streaming upload langsung dari browser ke Cloudflare R2 / MinIO lokal.
* **`midtrans-client` & `crypto` (native)**: Mengurus handshake transaksi pembayaran dan validasi SHA-512 signature webhook.
* **`nodemailer`**: Driver SMTP untuk pengiriman email transaksional.

## 3. Frontend Dependencies (Next.js 15+, Axios, & shadcn/ui)

File manifes dependensi untuk `frontend/package.json`:

```json
{
  "name": "wedding-invitation-frontend",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "ui:add": "shadcn add"
  },
  "dependencies": {
    "next": "^15.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "axios": "^1.7.9",
    "zustand": "^5.0.0",
    "immer": "^10.1.1",
    "@dnd-kit/core": "^6.3.0",
    "@dnd-kit/sortable": "^10.0.0",
    "@dnd-kit/utilities": "^3.2.2",
    "framer-motion": "^12.0.0",
    "lucide-react": "^0.468.0",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.5",
    "tailwindcss-animate": "^1.0.7",
    "@radix-ui/react-dialog": "^1.1.2",
    "@radix-ui/react-dropdown-menu": "^2.1.2",
    "@radix-ui/react-tabs": "^1.1.1",
    "@radix-ui/react-slider": "^1.2.1",
    "@radix-ui/react-select": "^2.1.2",
    "@radix-ui/react-popover": "^1.1.2",
    "@radix-ui/react-tooltip": "^1.1.4",
    "@radix-ui/react-label": "^2.1.0",
    "@radix-ui/react-separator": "^1.1.0",
    "@radix-ui/react-scroll-area": "^1.2.1",
    "react-colorful": "^5.6.1",
    "sonner": "^1.7.0",
    "canvas-confetti": "^1.9.4",
    "lodash": "^4.17.21"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@types/canvas-confetti": "^1.9.0",
    "@types/lodash": "^4.17.13",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.17",
    "typescript": "^5.7.0"
  }
}
```

### Breakdown Kebutuhan Library Frontend:
* **`next` (App Router) & `react` 19**: Rendering hybrid: SPA pada Dashboard/Editor dan SSR/ISR pada halaman publik.
* **`axios`**: HTTP Client berbasis Promise untuk seluruh komunikasi API ke backend ElysiaJS, dilengkapi request & response interceptor, otomatisasi pembacaan cookie/token, serta normalisasi envelope response.
* **`shadcn/ui` Stack**:
  * **`class-variance-authority` (cva)**: Mengelola varian komponen (primary, secondary, destructive, outline).
  * **`clsx` & `tailwind-merge`**: Utilitas conditional className (`cn()`) untuk penggabungan class Tailwind bebas konflik.
  * **`tailwindcss-animate`**: Animasi transisi bawaan shadcn untuk dialog, accordion, dan dropdown.
  * **`@radix-ui/*`**: Primitif UI headless aksesibel (Dialog, Tabs, Slider, Select, Popover, Tooltip, Label, ScrollArea).
* **`lucide-react`**: Ikon UI standar resmi shadcn/ui.
* **`zustand` + `immer`**: State management reaktif untuk kanvas editor dengan undo-redo stack dan immutable state mutator.
* **`@dnd-kit/core` & `@dnd-kit/sortable`**: Library drag-and-drop layer section dengan dukungan sensor sentuh (mobile/tablet) dan keyboard accessibility.
* **`framer-motion`**: Animasi buka amplop, accordion, dan efek transisi section undangan.
* **`react-colorful`**: Komponen visual color picker ringan terintegrasi dalam Popover shadcn.
* **`sonner`**: Sistem toast notification resmi shadcn/ui yang terikat dengan kode respons API domain.
* **`canvas-confetti`**: Efek interaktif saat tamu konfirmasi RSVP atau membuka amplop.

## 4. Konfigurasi shadcn/ui (`components.json`)

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "default",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

## 5. Environment Variables Checklist

### 5.1. Backend (`backend/.env`)
```bash
# App Configuration
NODE_ENV=production
PORT=4000
FRONTEND_URL=https://app.namadomain.com

# Authentication & Security
JWT_SECRET=super_secret_jwt_random_salt_at_least_64_chars
ARGON2_PEPPER=random_pepper_string_optional

# PostgreSQL Database (Drizzle ORM)
DATABASE_URL=postgres://user:password@db-host:5432/wedding_saas?sslmode=require

# Cloudflare R2 Storage (S3 Compatible)
R2_ACCOUNT_ID=your_cloudflare_account_id
R2_ACCESS_KEY_ID=your_r2_access_key
R2_SECRET_ACCESS_KEY=your_r2_secret_key
R2_BUCKET_NAME=wedding-invitations-media
R2_PUBLIC_DOMAIN=https://assets.namadomain.com

# Midtrans Payment Gateway
MIDTRANS_SERVER_KEY=SB-Mid-server-xxxxxxxxxxxx
MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxxxxxxxxx
MIDTRANS_IS_PRODUCTION=false

# SMTP Transactional Mailer
SMTP_HOST=smtp.resend.com
SMTP_PORT=465
SMTP_USER=resend
SMTP_PASS=re_xxxxxxxxxxxxxxxxxxxx
SMTP_FROM_EMAIL=noreply@namadomain.com
```

### 5.2. Frontend (`frontend/.env.local`)
```bash
# Target Backend Endpoint
NEXT_PUBLIC_API_URL=https://api.namadomain.com/api/v1

# Domain Base URL (untuk URL generation & OpenGraph)
NEXT_PUBLIC_APP_URL=https://app.namadomain.com
NEXT_PUBLIC_PUBLIC_URL=https://namadomain.com

# Shared Secret untuk On-Demand Cache Revalidation (/api/revalidate)
INTERNAL_REVALIDATE_SECRET=random_secure_shared_secret_token_123

# Midtrans Client Key untuk Snap UI Popup
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=SB-Mid-client-xxxxxxxxxxxx
```

## 6. Security, Media, & Operational Prerequisite

1. **CORS & Cookie Rules:**
   * Backend mengizinkan request credentialed dari domain frontend (`app.namadomain.com`).
   * Sesi otentikasi disimpan di cookie dengan atribut: `HttpOnly; Secure; SameSite=Lax; Domain=.namadomain.com`.
   * Axios dikonfigurasi dengan `withCredentials: true` secara global.

2. **Bucket CORS (Cloudflare R2):**
   * Bucket wajib dikonfigurasi agar menerima metode HTTP `PUT` dari domain frontend untuk mendukung direct browser upload.
   * Format CORS Rule R2:
     ```json
     [
       {
         "AllowedOrigins": ["https://app.namadomain.com", "http://localhost:3000"],
         "AllowedMethods": ["PUT", "GET"],
         "AllowedHeaders": ["Content-Type"],
         "MaxAgeSeconds": 3600
       }
     ]
     ```

3. **Database Performance Indexing:**
   * Kolom `slug` pada tabel `invitations` memiliki index `UNIQUE B-Tree`.
   * Kolom `sections` dan `theme_config` diindeks menggunakan `GIN` index untuk query pencarian komponen berbasis JSON jika diperlukan di masa depan.