# Spesifikasi Standar API Response Envelope & Custom Code Convention

Dokumen ini mendefinisikan kontrak baku untuk seluruh respons antarmuka pemrograman aplikasi (API) yang dihasilkan oleh backend **ElysiaJS** dan dikonsumsi oleh aplikasi klien **Next.js 15+**. Standarisasi ini bertujuan menciptakan konsistensi penanganan data, feedback antarmuka (UI/toast), serta pelacakan kesalahan (*error tracking*).

---

## 1. Struktur Unified Response Envelope

Setiap respons dari server—baik yang menghasilkan status sukses maupun gagal—wajib dibungkus dalam bentuk payload JSON seragam dengan 4 atribut inti:

```typescript
export interface ApiResponse<T = unknown> {
  meta: {
    code: number;          // Custom Code (1xxx, 2xxx, 3xxx, 4xxx, 9xxx)
    timestamp: string;     // ISO 8601 UTC timestamp
    requestId?: string;    // Unique correlation ID untuk tracing & logging
  };
  status: 'OK' | 'FAILED'; // Status ringkas representasi visual
  message: string;         // Pesan penjelasan yang dapat langsung ditampilkan ke UI
  data: T | null;          // Objek data utama (bernilai null jika status FAILED)
  errors?: unknown;        // Rincian error validasi (opsional, ada saat status FAILED)
}
```

---

## 2. Klasifikasi & Kamus Custom Code

Nilai pada `meta.code` menggunakan skema angka 4 digit berbasis domain spesifik:

```
[ Domain Prefix (1 Digit) ] + [ Sub-domain & Urutan Kasus (3 Digit) ]
```

| Range Code | Klasifikasi | Deskripsi Fungsional |
| :--- | :--- | :--- |
| **`1000 – 1999`** | **Success & Lifecycle** | Permintaan valid dan berhasil diproses sepenuhnya oleh sistem. |
| **`2000 – 2999`** | **Auth & Authorization** | Permasalahan kredensial, token kedaluwarsa, atau ketidaksesuaian hak akses. |
| **`3000 – 3999`** | **Validation & Client Error** | Data masukan tidak valid, konflik slug, atau pembatasan parameter klien. |
| **`4000 – 4999`** | **Billing & Business Rules** | Pelanggaran aturan paket langganan, masa berlaku habis, atau kuota terlampaui. |
| **`9000 – 9999`** | **System & Infrastructure** | Masalah internal server, basis data, atau kegagalan pihak ketiga (Storage/Payment). |

### 2.1. Daftar Detail Kode Resmi

#### Seri 1xxx — Sukses
* `1000`: **SUCCESS_OK** — Operasi umum berhasil.
* `1001`: **RESOURCE_CREATED** — Entitas baru berhasil dibuat (undangan baru, RSVP).
* `1002`: **DRAFT_SAVED** — Perubahan draft kanvas berhasil diperbarui.
* `1003`: **INVITATION_PUBLISHED** — Undangan berhasil dipublikasikan ke publik.
* `1004`: **MEDIA_UPLOAD_READY** — Tiket presigned URL Cloudflare R2 berhasil dibuat.

#### Seri 2xxx — Autentikasi & Otorisasi
* `2001`: **UNAUTHORIZED** — Header token otentikasi tidak ditemukan atau tidak valid.
* `2002`: **TOKEN_EXPIRED** — Sesi token pengguna telah kedaluwarsa.
* `2003`: **FORBIDDEN_RESOURCE** — Pengguna tidak memiliki kepemilikan atas undangan yang diakses.
* `2004`: **INVALID_CREDENTIALS** — Kombinasi email atau kata sandi tidak cocok.
* `2005`: **ACCOUNT_NOT_FOUND** — Akun pengguna tidak terdaftar di sistem.

#### Seri 3xxx — Validasi & Klien
* `3001`: **SCHEMA_VALIDATION_ERROR** — Struktur JSON, tipe data, atau field wajib tidak terpenuhi.
* `3002`: **SLUG_ALREADY_EXISTS** — Slug URL yang dipilih telah digunakan oleh pasangan lain.
* `3003`: **FILE_SIZE_EXCEEDED** — Ukuran file melebihi batas maksimal (misal: gambar > 10MB).
* `3004`: **UNSUPPORTED_MIME_TYPE** — Format file tidak didukung (hanya WebP, PNG, JPEG, MP3).
* `3005`: **RESOURCE_NOT_FOUND** — Data spesifik yang diminta (ID/Slug) tidak ada dalam database.

#### Seri 4xxx — Aturan Bisnis & Langganan
* `4001`: **SUBSCRIPTION_INACTIVE** — Pengguna tidak memiliki paket langganan aktif.
* `4002`: **SUBSCRIPTION_EXPIRED** — Masa aktif paket pernikahan telah berakhir.
* `4003`: **INVITATION_QUOTA_EXCEEDED** — Batas kuota jumlah pembuatan undangan telah tercapai.
* `4004`: **PAYMENT_PENDING** — Tagihan pembayaran belum diselesaikan oleh pengguna.
* `4005`: **PAYMENT_FAILED** — Transaksi pembayaran dibatalkan atau ditolak gateway.

#### Seri 9xxx — Infrastruktur & Layanan Eksternal
* `9001`: **INTERNAL_SERVER_ERROR** — Terjadi kesalahan fatal yang belum ditangani di server.
* `9002`: **DATABASE_CONNECTION_ERROR** — Basis data tidak merespons atau query mengalami timeout.
* `9003`: **STORAGE_SERVICE_ERROR** — Gagal berkomunikasi dengan Cloudflare R2 API.
* `9004`: **PAYMENT_GATEWAY_ERROR** — Kegagalan respons dari Midtrans/Xendit.
* `9005`: **SMTP_MAIL_ERROR** — Gagal mengirim surel verifikasi atau notifikasi.

---

## 3. Contoh Format Respons JSON

### 3.1. Respons Berhasil: Simpan Draft Kanvas
```json
{
  "meta": {
    "code": 1002,
    "timestamp": "2026-10-21T00:50:00.123Z",
    "requestId": "req_6b4a2f10-9c2e-4d51-87a1-2d7904b78912"
  },
  "status": "OK",
  "message": "Draft undangan berhasil disimpan.",
  "data": {
    "id": "c1f7a360-e4a0-4a8b-b8bc-02058b76df43",
    "slug": "romeo-dan-juliet",
    "isPublished": false,
    "updatedAt": "2026-10-21T00:50:00.120Z"
  }
}
```

### 3.2. Respons Gagal: Validasi Input Klien
```json
{
  "meta": {
    "code": 3001,
    "timestamp": "2026-10-21T00:52:10.450Z",
    "requestId": "req_8a12d9c0-112e-4b61-90a1-9a7904b73300"
  },
  "status": "FAILED",
  "message": "Validasi struktur data undangan gagal.",
  "data": null,
  "errors": [
    {
      "path": "themeConfig.colors.primary",
      "message": "Format kode warna HEX tidak valid (contoh: #4F46E5)."
    },
    {
      "path": "sections[0].data.weddingDate",
      "message": "Format tanggal pernikahan wajib berupa ISO 8601 string."
    }
  ]
}
```

### 3.3. Respons Gagal: Pembatasan Langganan
```json
{
  "meta": {
    "code": 4001,
    "timestamp": "2026-10-21T00:55:33.882Z",
    "requestId": "req_0f12c8b0-449e-4c12-88b1-3c7904b788aa"
  },
  "status": "FAILED",
  "message": "Paket langganan Anda tidak aktif. Silakan pilih paket untuk mempublikasikan undangan.",
  "data": null
}
```

---

## 4. Implementasi Backend ElysiaJS

### 4.1. Response Helper Class (`src/configs/response.helper.ts`)

```typescript
export interface MetaData {
  code: number;
  timestamp: string;
  requestId?: string;
}

export interface ApiResponseFormat<T> {
  meta: MetaData;
  status: 'OK' | 'FAILED';
  message: string;
  data: T | null;
  errors?: unknown;
}

export class ResponseHelper {
  static success<T>(
    data: T,
    message = 'Operasi berhasil diproses.',
    customCode = 1000,
    requestId?: string
  ): ApiResponseFormat<T> {
    return {
      meta: {
        code: customCode,
        timestamp: new Date().toISOString(),
        ...(requestId ? { requestId } : {})
      },
      status: 'OK',
      message,
      data
    };
  }

  static failed(
    message: string,
    customCode = 9001,
    errors: unknown = null,
    requestId?: string
  ): ApiResponseFormat<null> {
    return {
      meta: {
        code: customCode,
        timestamp: new Date().toISOString(),
        ...(requestId ? { requestId } : {})
      },
      status: 'FAILED',
      message,
      data: null,
      ...(errors ? { errors } : {})
    };
  }
}
```

### 4.2. Global Exception Middleware (`src/inbound/http/middlewares/error.handler.ts`)

```typescript
import { Elysia } from 'elysia';
import { ResponseHelper } from '../../../configs/response.helper';

export class AppDomainError extends Error {
  constructor(
    public readonly customCode: number,
    public override readonly message: string,
    public readonly httpStatus: number = 400,
    public readonly details: unknown = null
  ) {
    super(message);
  }
}

export const errorHandler = new Elysia({ name: 'error-handler' })
  .onError(({ code, error, set, request }) => {
    const requestId = request.headers.get('x-request-id') || crypto.randomUUID();

    // 1. Error yang dilempar secara sengaja oleh Domain Service
    if (error instanceof AppDomainError) {
      set.status = error.httpStatus;
      return ResponseHelper.failed(error.message, error.customCode, error.details, requestId);
    }

    // 2. Error Validasi TypeBox bawaan Elysia
    if (code === 'VALIDATION') {
      set.status = 422;
      return ResponseHelper.failed(
        'Validasi format data input gagal.',
        3001,
        'all' in error ? error.all : null,
        requestId
      );
    }

    // 3. Error Rute / Resource Tidak Ditemukan
    if (code === 'NOT_FOUND') {
      set.status = 404;
      return ResponseHelper.failed('Rute atau data tidak ditemukan.', 3005, null, requestId);
    }

    // 4. Default Fallback Internal Server Error
    set.status = 500;
    return ResponseHelper.failed(
      'Terjadi gangguan internal pada sistem.',
      9001,
      process.env.NODE_ENV === 'development' ? error.message : null,
      requestId
    );
  });
```

### 4.3. Penerapan pada Service & Inbound Controller

```typescript
// src/services/implement/invitation.service.implement.ts
if (!isSubscriberActive) {
  // Lempar AppDomainError dengan Custom Code 4001
  throw new AppDomainError(4001, 'Langganan Anda tidak aktif.', 403);
}

// src/inbound/http/controllers/invitation.controller.ts
async saveDraft(userId: string, invitationId: string, payload: any) {
  const result = await this.invitationService.saveDraft({
    userId,
    invitationId,
    themeConfig: payload.themeConfig,
    sections: payload.sections
  });

  // Bungkus kembalian dengan ResponseHelper kode 1002
  return ResponseHelper.success(result, 'Draft undangan berhasil disimpan.', 1002);
}
```

---

## 5. Konsumsi di Frontend Next.js

### 5.1. Tipe Global Klien (`frontend/src/types/api.ts`)

```typescript
export interface ApiResponse<T = unknown> {
  meta: {
    code: number;
    timestamp: string;
    requestId?: string;
  };
  status: 'OK' | 'FAILED';
  message: string;
  data: T;
  errors?: Array<{ path?: string; message: string }>;
}
```

### 5.2. Penanganan Modular di API Service (`src/services/api/invitations.api.ts`)

```typescript
import { client } from '@/lib/api-client';
import type { ApiResponse } from '@/types/api';

export const invitationsApi = {
  async saveDraft(id: string, payload: { themeConfig: Record<string, unknown>; sections: unknown[] }) {
    const res = await client.api.v1.invitations({ id }).draft.put(payload);

    // Tangani kemungkinan jaringan putus atau status selain 2xx
    if (res.error) {
      const errVal = res.error.value as ApiResponse<null>;
      return {
        meta: {
          code: errVal?.meta?.code ?? 9001,
          timestamp: new Date().toISOString()
        },
        status: 'FAILED' as const,
        message: errVal?.message || 'Gagal terhubung ke server.',
        data: null,
        errors: errVal?.errors
      };
    }

    return res.data as ApiResponse<any>;
  }
};
```

### 5.3. Penanganan pada Komponen / Toast Notifikasi

```typescript
const response = await invitationsApi.saveDraft(invitationId, payload);

if (response.status === 'OK') {
  toast.success(response.message); // Menampilkan "Draft undangan berhasil disimpan."
} else {
  // Evaluasi aksi berdasarkan meta.code
  switch (response.meta.code) {
    case 4001:
    case 4002:
      // Redirect atau tampilkan modal billing checkout
      openBillingModal(response.message);
      break;
    case 3001:
      // Tampilkan notifikasi error validasi input form
      toast.error(response.message);
      break;
    default:
      toast.error(response.message);
      break;
  }
}
```