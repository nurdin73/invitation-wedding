# Product Requirement Document (PRD)

## SaaS Platform Undangan Digital & Visual Section Builder

---

## 1. Executive Summary & Objective

### 1.1 Latar Belakang
Pasar undangan online / digital di Indonesia terus bertumbuh pesat. Namun, platform yang ada umumnya terbagi menjadi dua ekstrem:
1. **Terlalu kaku:** Pengguna hanya mengisi formulir teks dan memilih template statis tanpa fleksibilitas tata letak.
2. **Terlalu kompleks:** Platform drag-and-drop bebas (*free-form canvas*) yang sulit digunakan orang awam dan sering menghasilkan tata letak yang berantakan (*broken layout*) saat dibuka di perangkat mobile tamu.

### 1.2 Tujuan Produk (Objective)
Membangun platform SaaS undangan digital berbasis web dengan model bisnis *self-service* (Daftar $\rightarrow$ Berlangganan/Beli Paket $\rightarrow$ Kustomisasi $\rightarrow$ Publikasi). Fitur inti produk ini adalah **Visual Section-based Template Editor**—mirip Elementor/Notion namun dirancang dengan UX yang intuitif dan terkurasi untuk layar smartphone. Semua undangan disajikan melalui URL standar berbasis slug/subdomain platform tanpa memerlukan konfigurasi domain kustom.

---

## 2. Target Pengguna (User Persona)

| Persona | Profil | Kebutuhan Utama |
| :--- | :--- | :--- |
| **Calon Pengantin (End-User)** | Pria/Wanita usia 21–35 tahun, melek digital, tidak memiliki keahlian teknis/coding. | Menginginkan undangan yang unik, elegan, mudah diatur dari ponsel/laptop, serta memiliki generator nama tamu otomatis untuk disebar via WhatsApp. |
| **Freelance Wedding Organizer / Designer** | Vendor pernikahan independen yang melayani pembuatan undangan digital untuk klien. | Butuh alur kerja cepat, sistem manajemen multi-undangan, dan kebebasan mengubah urutan tata letak tanpa batasan template kaku. |

---

## 3. Alur Pengguna (User Journey)

```
[ Registrasi Akun ]
        ↓
[ Pilih Paket & Pembayaran (Subscription/One-time) ]
        ↓ (Webhook Success)
[ Akses Dashboard & Pilih Starter Template ]
        ↓
[ Masuk ke Visual Section Editor ]
   ├── Kustomisasi Konten & Media
   ├── Tambah / Hapus / Reorder Section
   └── Kustomisasi Global Styling Undangan (Warna, Font, Musik)
        ↓
[ Konfigurasi Undangan & Buku Tamu ]
   ├── Input Nama Tamu (Generator Link WhatsApp)
   ├── Atur RSVP & Rekening Amplop Digital
   └── Preview Mobile & Desktop
        ↓
[ Publikasi (Live URL berbasis Slug: domain.com/slug-undangan) ]
```

---

## 4. Design System Platform Web (Dashboard & Editor)

Bagian ini mengatur spesifikasi visual antarmuka sistem SaaS (Landing Page, Dasbor Pengguna, dan Editor Kanvas) agar bersih, profesional, serta tidak mengaburkan kanvas desain undangan pengguna.

### 4.1 Token Klasifikasi Warna (Color Tokens)

Warna aplikasi dikelompokkan ke dalam klasifikasi fungsional berbasis Semantic Token yang terintegrasi dengan CSS Variables / Tailwind CSS:

| Token Name | Nilai HEX (Light Mode) | Nilai HEX (Dark Mode) | Peruntukan Fungsional |
| :--- | :--- | :--- | :--- |
| **`primary`** | `#4F46E5` (Indigo-600) | `#6366F1` (Indigo-500) | Tombol aksi utama (*CTA*), status publikasi, seleksi blok aktif, indikator fokus. |
| **`primary-foreground`** | `#FFFFFF` | `#FFFFFF` | Warna teks/ikon di atas elemen `primary`. |
| **`secondary`** | `#F1F5F9` (Slate-100) | `#1E293B` (Slate-800) | Tombol sekunder, hover state menu, tag, badge kategori. |
| **`secondary-foreground`** | `#0F172A` (Slate-900) | `#F8FAFC` (Slate-50) | Warna teks di atas elemen `secondary`. |
| **`background`** | `#F8FAFC` (Slate-50) | `#0B0F19` (Zinc-950) | Latar belakang dasar dashboard dan area workspace editor di luar kanvas. |
| **`surface` / `card`** | `#FFFFFF` | `#111827` (Gray-900) | Panel navigasi samping (*sidebar*), header toolbar, kartu ringkasan, dialog modal. |
| **`surface-muted`** | `#F1F5F9` (Slate-100) | `#1F2937` (Gray-800) | Latar belakang komponen input, preview box, list item sekunder. |
| **`border`** | `#E2E8F0` (Slate-200) | `#374151` (Gray-700) | Garis pembatas antar-panel editor, batas tabel, dan batas input. |
| **`text-primary`** | `#0F172A` (Slate-900) | `#F9FAFB` (Gray-50) | Heading utama, judul form, teks label kritis dengan tingkat kontras tertinggi. |
| **`text-secondary`** | `#64748B` (Slate-500) | `#9CA3AF` (Gray-400) | Keterangan pembantu, deskripsi fitur, teks tanggal, placeholder form. |
| **`accent`** | `#06B6D4` (Cyan-500) | `#22D3EE` (Cyan-400) | Aksen visual, indikator tutorial/onboarding, highlight badge fitur baru. |
| **`success`** | `#10B981` (Emerald-500)| `#34D399` (Emerald-400)| Indikator status paket aktif, status tersimpan (*auto-saved*), transfer berhasil. |
| **`warning`** | `#F59E0B` (Amber-500)  | `#FBBF24` (Amber-400)  | Status pembayaran pending/menunggu verifikasi, peringatan kapasitas file. |
| **`destructive`** | `#EF4444` (Red-500)  | `#F87171` (Red-400)    | Tombol hapus section, pembatalan langganan, pesan error validasi input. |

### 4.2 Sistem Tipografi Platform Web

Sistem tipografi aplikasi platform menggunakan Sans-Serif modern berorientasi UI fungsional (*clean, highly legible, modern*):

* **Font Utama UI (Heading & Body):** `Plus Jakarta Sans` (Fallback: `Inter`, `-apple-system`, `sans-serif`).
  * Sangat tajam dan mudah dibaca pada ukuran kecil (11px–14px) di panel samping editor.
* **Font Monospace (Data & Angka Teknis):** `JetBrains Mono` atau `Geist Mono`.
  * Digunakan untuk slug URL, token API/Webhook, ID transaksi pembayaran, dan kode warna HEX pada color picker.

#### Hirarki Tipografi UI
* **Page / Screen Title:** 24px–28px, SemiBold (`font-semibold`), Tracking `-0.02em`
* **Section / Panel Header:** 16px–18px, SemiBold (`font-semibold`)
* **Control Label & Button:** 13px–14px, Medium (`font-medium`)
* **Body / Helper Text:** 13px–14px, Regular (`font-normal`), Line-height `1.5`
* **Micro-copy & Badge:** 11px–12px, Medium (`font-medium`), Uppercase tracking opsi tertentu

---

## 5. Rincian Fitur & Fungsionalitas

### 5.1 Modul Autentikasi & Akun
* **Registrasi & Login:** Email/Password dan Google One-Tap Sign In.
* **Manajemen Profil:** Pengaturan profil dasar, ganti kata sandi, dan status verifikasi email.
* **Peran Pengguna (User Roles):**
  * `USER`: Calon pengantin yang membuat, mengelola, dan mempublikasikan undangan pernikahan.
  * `CONTRIBUTOR`: Desainer template yang mengirimkan karya template website & kartu fisik, serta mendapatkan bagi hasil (revenue share) setiap karyanya digunakan.
  * `ADMIN`: Administrator internal platform untuk verifikasi konten dan moderasi transaksi.
* **Tingkat Langganan (Subscription Tier):**
  * `FREE_TRIAL`: Akses editor terbatas / watermark saat preview / URL draft.
  * `ACTIVE_SUBSCRIBER`: Akses publikasi penuh pada URL slug utama, tanpa watermark.


### 5.2 Modul Billing & Langganan (Subscription/Pay-per-Event)
* **Model Monetisasi:**
  * *Pay-per-Active-Invitation* (Aktif selama 6–12 bulan per acara).
  * *Tier Pro / Unlimited* untuk vendor wedding organizer.
* **Integrasi Payment Gateway:** Midtrans, Xendit, atau Mayar.
  * Mendukung QRIS, Virtual Account (BCA, Mandiri, BRI, BNI), dan E-Wallet (GoPay, OVO, ShopeePay).
  * Aktivasi otomatis berbasis webhook status pembayaran (`settlement`/`paid`).

### 5.3 Modul Inti: Visual Section Editor
Editor dirancang menggunakan pendekatan **Section Stacking** (bukan koordinat absolute) agar seluruh tata letak tetap 100% responsif di layar ponsel.

#### A. Layout Komponen Editor (UI/UX)
1. **Top Bar:**
   * Navigasi kembali ke Dashboard.
   * Status penyimpanan (*Auto-save indicator* bertanda `success`).
   * Tombol Undo / Redo.
   * Switch Viewport: *Mobile View* (default) dan *Desktop View*.
   * Tombol *Preview* & *Publish* dengan styling warna `primary`.
2. **Left Panel (Section Explorer & Layers):**
   * Struktur urutan section yang sedang aktif (dapat di-drag untuk reorder urutan).
   * Tombol "+ Add New Section" yang memicu katalog blok modal/flyout.
   * Tab "Global Theme": Pengaturan palet warna undangan, font pasangan/teks, audio background, dan motif transparan.
3. **Center Canvas (Interactive Preview Canvas):**
   * Menampilkan visual undangan secara langsung (*live rendered*).
   * Latar belakang di luar mockup menggunakan token `background`, sementara bingkai mockup smartphone menggunakan token `surface`.
   * Interaksi klik langsung pada blok untuk memicu inspektor properti di panel kanan dengan outline warna `primary`.
4. **Right Panel (Block Inspector / Settings):**
   * Pengaturan spesifik blok yang sedang dipilih:
     * **Konten:** Form input teks, tombol upload media, URL video, koordinat maps.
     * **Varian Desain:** Pilihan layout alternatif (misal: *Grid 2 Kolom* vs *Masonry* vs *Carousel*).
     * **Spacing & Efek:** Padding atas/bawah, animasi scroll (AOS: *Fade-in*, *Zoom-in*).

#### B. Katalog Section yang Didukung

| Tipe Section | Elemen Konten | Varian Layout |
| :--- | :--- | :--- |
| **Cover / Hero** | Foto background, nama mempelai, tanggal acara, tombol "Buka Undangan". | *Fullscreen Minimal*, *Curved Card*, *Arch Floral Frame*. |
| **Profil Pasangan** | Foto pria & wanita, nama lengkap, nama orang tua, akun media sosial. | *Side-by-side*, *Stacked Vertical*, *Polaroid Style*. |
| **Jadwal Acara** | Akad/Pemberkatan & Resepsi, waktu mulai-selesai, lokasi, tombol navigasi Google Maps. | *Timeline Vertical*, *Split Cards*, *Classic Box*. |
| **Galeri Foto & Video** | Multi-image upload, embed video YouTube/Vimeo. | *Masonry Grid*, *Swipeable Carousel*, *Lightbox Modal*. |
| **Love Story** | Tanggal pertemuan, lamaran, pernikahan, foto pendukung, narasi singkat. | *Vertical Stepper*, *Zig-Zag Cards*. |
| **RSVP & Konfirmasi** | Form kehadiran (Hadir/Ragu/Tidak), jumlah orang, pesan/doa ucapan. | *Standard Form*, *Minimalist Card*. |
| **Amplop Digital** | Nomor rekening bank, nama pemilik rekening, QRIS upload, tombol "Salin Nomor". | *Card Bank Visual*, *Clean Minimal*. |
| **Kirim Kado Fisik** | Alamat penerima paket, tombol "Salin Alamat". | *Info Card with Icon*. |
| **Penutup / Doa** | Kutipan ayat suci/kutipan bijak, teks terima kasih, credits. | *Centered Text with Floral Divider*. |

### 5.4 Modul Distribusi & Interaksi Tamu
* **Dynamic Guest URL Parameter:**
  * Format URL: `invitation.domain.com/andi-siti?to=Budi+Keluarga` atau `domain.com/v/andi-siti?to=Budi+Keluarga`
  * Nama tamu otomatis muncul pada cover dan formulir RSVP.
* **WhatsApp Share Link Generator:**
  * Dasbor untuk input nama tamu secara individual maupun daftar cepat.
  * Generate template pesan WhatsApp personal beserta link unik masing-masing tamu dalam 1 klik.
* **Background Audio Player:**
  * Floating player di sudut bawah layar.
  * Logika *Autoplay-friendly*: Musik mulai berputar sesaat setelah tombol "Buka Undangan" ditekan oleh tamu.

---

## 6. Arsitektur Teknis & Database

### 6.1 Tech Stack yang Direkomendasikan
* **Frontend Dashboard & Editor:** Next.js (React 19 / TypeScript), Tailwind CSS, Shadcn UI / Radix Primitives.
* **Drag-and-Drop Library:** `@dnd-kit/core` dan `@dnd-kit/sortable` (ringan, performa tinggi di touch screen).
* **Public Invitation Page:** Next.js Server Components (SSR/ISR) untuk kecepatan rendering maksimal dan integrasi OpenGraph (WhatsApp link preview metadata).
* **Backend & Database:** Node.js / PostgreSQL (Supabase / Neon DB).
* **Storage:** Cloudflare R2 atau AWS S3 dengan auto-processing WebP converter.

### 6.2 Skema Data Inti (PostgreSQL & JSONB)

```sql
-- Tabel Pengguna
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255), -- Disimpan dalam bentuk hash (bcrypt / argon2id); NULL jika registrasi via OAuth/Google
    full_name VARCHAR(100),
    subscription_status VARCHAR(50) DEFAULT 'FREE_TRIAL',
    subscription_expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabel Undangan
CREATE TABLE invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    slug VARCHAR(100) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    is_published BOOLEAN DEFAULT FALSE,
    theme_config JSONB NOT NULL,
    sections_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabel Tamu & RSVP
CREATE TABLE guests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invitation_id UUID REFERENCES invitations(id) ON DELETE CASCADE,
    guest_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(30),
    attendance_status VARCHAR(20) DEFAULT 'PENDING', -- ATTENDING, DECLINED, PENDING
    guest_count INT DEFAULT 1,
    wishes_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

> **Catatan Keamanan Kredensial:**
> Field `password_hash` menggunakan algoritma *one-way cryptographic hash* (direkomendasikan `argon2id` atau `bcrypt` dengan *salt factor* minimal 10–12). Nilai plaintext password dilarang keras disimpan di layer basis data mana pun. Kolom disetel *nullable* guna mendukung akun yang mendaftar langsung via OAuth provider (Google One-Tap).

#### Contoh Format JSON `sections_data`
```json
[
  {
    "id": "sec_hero_01",
    "type": "cover",
    "variant": "hero_arch",
    "is_visible": true,
    "props": {
      "title": "Walimatul 'Ursy",
      "groom": "Andi Pratama",
      "bride": "Siti Nurhaliza",
      "event_date": "2026-11-20T09:00:00Z",
      "cover_img": "https://cdn.domain.com/uploads/hero.webp"
    }
  },
  {
    "id": "sec_event_02",
    "type": "event_details",
    "variant": "timeline_card",
    "is_visible": true,
    "props": {
      "events": [
        {
          "name": "Akad Nikah",
          "start_time": "08:00",
          "location": "Masjid Al-Ikhlas",
          "gmaps_url": "https://maps.app.goo.gl/xxx"
        }
      ]
    }
  }
]
```

---

## 7. Persyaratan Non-Fungsional (Non-Functional Requirements)

1. **Performa:** Waktu muat pertama (*First Contentful Paint*) halaman undangan tamu tidak boleh lebih dari **1.5 detik** pada koneksi 4G mobile.
2. **Optimasi Media:** Gambar yang diunggah oleh pengguna harus otomatis dikompresi di sisi browser (*client-side compression*) menjadi format `.webp` dengan resolusi maksimal $1920\text{px}$ dan ukuran maksimal $400\text{KB}$.
3. **Ketersediaan (*Availability*):** Sistem memiliki target *uptime* 99.9% agar undangan selalu dapat diakses saat hari H perayaan pernikahan.
4. **Keamanan:**
   * Mencegah serangan *XSS* pada form ucapan/RSVP melalui sanitasi input (*DOMPurify / sanitize-html*).
   * Seluruh kredensial akun dilindungi standar enkripsi *one-way hash* (`bcrypt` / `argon2id`).

---

## 8. Roadmap Rilis Produk (Phase Implementation)

### Fase 1: MVP (Minimum Viable Product)
* Registrasi/Login (Email + Google OAuth) & Integrasi Payment Gateway (Checkout per undangan).
* Visual Section Editor sederhana (5 section dasar: Cover, Profil, Acara, RSVP, Rekening).
* Reorder section dan edit teks/foto.
* Generate link unik nama tamu berbasis subdomain/slug.

### Fase 2: Kustomisasi Lanjut & Fitur Sosial
* Fitur Global Styling (Ganti palet warna otomatis & font picker untuk undangan).
* Background music player dengan preset lagu bebas royalti.
* Section Love Story & Galeri Video.

### Fase 3: Pro & Enterprise Scale
* Template marketplace (desainer pihak ketiga bisa menjual template section).
* Mode multi-halaman atau mode amplop interaktif dengan animasi amplop 3D.
* Analitik pengunjung undangan (total views, rasio RSVP, perangkat yang digunakan).