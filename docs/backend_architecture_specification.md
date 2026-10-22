# Spesifikasi Arsitektur Backend ElysiaJS (Inbound/Outbound Clean Architecture)

Dokumen ini mendefinisikan struktur folder, konvensi penamaan, dan implementasi kode untuk backend **ElysiaJS (Bun runtime)** berbasis prinsip **SOLID** dan arsitektur **Hexagonal (Inbound/Outbound Ports & Adapters)** sesuai aturan baku berikut:

1. **Registry & Service Container** berada di `src/configs/`.

2. **Inbound HTTP (Controller & Routes)** berada di `src/inbound/http/`.

3. **Outbound Interfaces** diletakkan langsung di akar `src/outbound/` dengan format `{nama outbound}.port.ts` (misal: `user-repository.port.ts`, `invitation-repository.port.ts`, `storage.port.ts`), sedangkan implementasi konkretnya dikelompokkan ke subfolder kategori (misal: `src/outbound/repository/`, `src/outbound/smtp/`, `src/outbound/storage/`, dll.).

4. **Service Contracts (Interfaces)** berada langsung di `src/services/`, sedangkan implementasi konkretnya berada di `src/services/implement/`.

5. **Controller Rules:** Controller murni sebagai *dispatcher* tipis. Dilarang memuat *business logic* dan **sangat dilarang memanggil lebih dari 1 fungsi service dalam 1 HTTP handler**. Koordinasi lintas domain ditangani di level Service.

6. **Database Access Rules:** Seluruh database I/O wajib melalui Repository Drizzle di `src/outbound/repository/`.

7. **Database Schema Convention:** Seluruh berkas skema tabel pada `src/db/schema/` wajib menggunakan format `{nama table}.schema.ts` (misal: `users.schema.ts`, `invitations.schema.ts`).

8. **Constants & Domain Codes:** Seluruh nilai konstanta dan kamus 4-digit custom meta code (1000–9999) didefinisikan secara terpusat di `src/constants/` (`meta-codes.ts`, `index.ts`).

9. **Schema Validation:** Validasi skema request/response menggunakan TypeBox bawaan (`t`) langsung dari `elysia` (`import { t } from 'elysia'`) tanpa menginstal paket eksternal `@sinclair/typebox`.

## 1. Pohon Direktori (Directory Tree)

```text
backend/
├── drizzle/
├── src/
│   ├── configs/
│   │   ├── env.ts                                 # Environment variable validation
│   │   ├── registry.ts                            # Central IoC Container / Service Locator
│   │   └── response.helper.ts                     # Unified API Response Envelope builder
│   │
│   ├── constants/
│   │   ├── meta-codes.ts                          # Kamus 4-Digit Meta Code resmi (1000–9999)
│   │   └── index.ts                               # Re-export seluruh konstanta sistem
│   │
│   ├── db/
│   │   ├── index.ts                               # Database connection pool (Bun postgres)
│   │   ├── migrate.ts                             # Automated database migration runner
│   │   └── schema/                                # Drizzle Table Schemas ({table}.schema.ts)
│   │       ├── users.schema.ts                    # User entity + role & verification flags
│   │       ├── auth_tokens.schema.ts              # Token SHA-256 for email verification & reset
│   │       ├── subscriptions.schema.ts
│   │       ├── orders.schema.ts
│   │       ├── invitations.schema.ts
│   │       ├── rsvps.schema.ts
│   │       └── index.ts                           # Re-export seluruh schema
│   │
│   ├── inbound/
│   │   └── http/                                  # Primary / Driving HTTP Adapters
│   │       ├── controllers/                       # Thin Controller (Request -> 1 Service Call -> Response)
│   │       │   ├── auth.controller.ts
│   │       │   ├── invitation.controller.ts
│   │       │   ├── billing.controller.ts
│   │       │   └── media.controller.ts
│   │       ├── routes/                            # Definisi Elysia Route & TypeBox Schema
│   │       │   ├── auth.routes.ts
│   │       │   ├── invitation.routes.ts
│   │       │   ├── billing.routes.ts
│   │       │   ├── media.routes.ts
│   │       │   └── index.ts
│   │       └── middlewares/
│   │           ├── auth.macro.ts                  # Guard / JWT session & role validator
│   │           └── error.handler.ts               # Global exception catcher
│   │
│   ├── services/                                  # Service Contracts / Interfaces (Inbound Ports)
│   │   ├── auth.service.ts                        # interface IAuthService
│   │   ├── invitation.service.ts                  # interface IInvitationService
│   │   ├── billing.service.ts                     # interface IBillingService
│   │   ├── media.service.ts                       # interface IMediaService
│   │   └── implement/                             # Implementasi Business Logic Murni
│   │       ├── auth.service.implement.ts
│   │       ├── invitation.service.implement.ts
│   │       ├── billing.service.implement.ts
│   │       └── media.service.implement.ts
│   │
│   ├── outbound/                                  # Outbound Interfaces / Driven Ports ({nama}.port.ts)
│   │   ├── user-repository.port.ts                # interface IUserRepository
│   │   ├── auth-token-repository.port.ts          # interface IAuthTokenRepository
│   │   ├── invitation-repository.port.ts          # interface IInvitationRepository
│   │   ├── order-repository.port.ts               # interface IOrderRepository
│   │   ├── storage.port.ts                        # interface IStoragePort
│   │   ├── payment-gateway.port.ts                # interface IPaymentGatewayPort
│   │   ├── smtp.port.ts                           # interface ISmtpPort
│   │   │
│   │   ├── repository/                            # Implementasi Database Repository (Drizzle ORM)
│   │   │   ├── drizzle-user.repository.ts
│   │   │   ├── drizzle-auth-token.repository.ts
│   │   │   ├── drizzle-invitation.repository.ts
│   │   │   └── drizzle-order.repository.ts

│   │   ├── storage/                               # Implementasi Storage Object (S3 / R2)
│   │   │   └── s3-storage.adapter.ts
│   │   ├── payment/                               # Implementasi Payment Gateway
│   │   │   └── midtrans-payment.adapter.ts
│   │   └── smtp/                                  # Implementasi Mail Delivery
│   │       └── nodemailer-smtp.adapter.ts
│   │
│   └── index.ts                                   # Entry Point Application & Export Type App
│
├── drizzle.config.ts
├── package.json
└── tsconfig.json
```

---

## 2. Layer Outbound: Interface & Concrete Implementation

Semua antarmuka outbound berada langsung di root `src/outbound/` dengan format `{nama outbound}.port.ts`, sementara adapter konkret diorganisir dalam direktori fungsional (`repository/`, `storage/`, `payment/`, `smtp/`).

### 2.1. Outbound Interface Port (`src/outbound/invitation-repository.port.ts`)

```typescript
// src/outbound/invitation-repository.port.ts
export interface InvitationRecord {
  id: string;
  userId: string;
  slug: string;
  title: string;
  themeConfig: Record<string, unknown>;
  sections: unknown[];
  isPublished: boolean;
  version: number;
}

export interface IInvitationRepository {
  findById(id: string): Promise<InvitationRecord | null>;
  findBySlug(slug: string): Promise<InvitationRecord | null>;
  create(data: Omit<InvitationRecord, 'id' | 'version'>): Promise<InvitationRecord>;
  updatePayload(id: string, theme: Record<string, unknown>, sections: unknown[]): Promise<InvitationRecord>;
  setPublishStatus(id: string, isPublished: boolean): Promise<InvitationRecord>;
}
```

### 2.2. Outbound Repository Implementation (Drizzle Adapter)

```typescript
// src/outbound/repository/drizzle-invitation.repository.ts
import { eq } from 'drizzle-orm';
import { db } from '../../db';
import { invitations } from '../../db/schema/invitations.schema';
import type { IInvitationRepository, InvitationRecord } from '../invitation-repository.port';

export class DrizzleInvitationRepository implements IInvitationRepository {
  async findById(id: string): Promise<InvitationRecord | null> {
    const result = await db.select().from(invitations).where(eq(invitations.id, id)).limit(1);
    return (result[0] as unknown as InvitationRecord) || null;
  }

  async findBySlug(slug: string): Promise<InvitationRecord | null> {
    const result = await db.select().from(invitations).where(eq(invitations.slug, slug)).limit(1);
    return (result[0] as unknown as InvitationRecord) || null;
  }

  async create(data: Omit<InvitationRecord, 'id' | 'version'>): Promise<InvitationRecord> {
    const [created] = await db.insert(invitations).values(data).returning();
    return created as unknown as InvitationRecord;
  }

  async updatePayload(id: string, themeConfig: Record<string, unknown>, sections: unknown[]): Promise<InvitationRecord> {
    const [updated] = await db
      .update(invitations)
      .set({ themeConfig, sections, updatedAt: new Date() })
      .where(eq(invitations.id, id))
      .returning();
    return updated as unknown as InvitationRecord;
  }

  async setPublishStatus(id: string, isPublished: boolean): Promise<InvitationRecord> {
    const [updated] = await db
      .update(invitations)
      .set({ isPublished, publishedAt: isPublished ? new Date() : null, updatedAt: new Date() })
      .where(eq(invitations.id, id))
      .returning();
    return updated as unknown as InvitationRecord;
  }
}
```

---

## 3. Layer Service: Contract & Implementation

Interface kontrak disimpan di `src/services/`, sedangkan implementasinya disimpan di `src/services/implement/`.

### 3.1. Service Contract

```typescript
// src/services/invitation.service.ts
import type { InvitationRecord } from '../outbound/invitation-repository.port';

export interface SaveDraftDTO {
  invitationId: string;
  userId: string;
  themeConfig: Record<string, unknown>;
  sections: unknown[];
}

export interface PublishResult {
  slug: string;
  publicUrl: string;
}

export interface IInvitationService {
  saveDraft(dto: SaveDraftDTO): Promise<InvitationRecord>;
  publish(invitationId: string, userId: string): Promise<PublishResult>;
  getPublicInvitation(slug: string): Promise<InvitationRecord>;
}
```

### 3.2. Service Implementation

```typescript
// src/services/implement/invitation.service.implement.ts
import type { IInvitationService, SaveDraftDTO, PublishResult } from '../invitation.service';
import type { IInvitationRepository, InvitationRecord } from '../../outbound/invitation-repository.port';
import type { IBillingService } from '../billing.service';

export class InvitationServiceImplement implements IInvitationService {
  constructor(
    private readonly invitationRepo: IInvitationRepository,
    private readonly billingService: IBillingService
  ) {}

  async saveDraft(dto: SaveDraftDTO): Promise<InvitationRecord> {
    const invitation = await this.invitationRepo.findById(dto.invitationId);
    if (!invitation) throw new Error('INVITATION_NOT_FOUND');
    if (invitation.userId !== dto.userId) throw new Error('FORBIDDEN');

    return await this.invitationRepo.updatePayload(dto.invitationId, dto.themeConfig, dto.sections);
  }

  async publish(invitationId: string, userId: string): Promise<PublishResult> {
    const invitation = await this.invitationRepo.findById(invitationId);
    if (!invitation) throw new Error('INVITATION_NOT_FOUND');
    if (invitation.userId !== userId) throw new Error('FORBIDDEN');

    // Koordinasi antar-service di dalam layer service murni
    const isSubscriberActive = await this.billingService.checkSubscriptionActive(userId);
    if (!isSubscriberActive) {
      throw new Error('SUBSCRIPTION_EXPIRED_OR_INACTIVE');
    }

    const published = await this.invitationRepo.setPublishStatus(invitationId, true);
    return {
      slug: published.slug,
      publicUrl: `https://domain.com/${published.slug}`,
    };
  }

  async getPublicInvitation(slug: string): Promise<InvitationRecord> {
    const invitation = await this.invitationRepo.findBySlug(slug);
    if (!invitation || !invitation.isPublished) throw new Error('INVITATION_NOT_FOUND');
    return invitation;
  }
}
```

---

## 4. Central Registry (`src/configs/registry.ts`)

```typescript
// src/configs/registry.ts
// 1. Outbound Implementations
import { DrizzleUserRepository } from '../outbound/repository/drizzle-user.repository';
import { DrizzleInvitationRepository } from '../outbound/repository/drizzle-invitation.repository';
import { DrizzleOrderRepository } from '../outbound/repository/drizzle-order.repository';
import { S3StorageAdapter } from '../outbound/storage/s3-storage.adapter';
import { MidtransPaymentAdapter } from '../outbound/payment/midtrans-payment.adapter';
import { NodemailerSmtpAdapter } from '../outbound/smtp/nodemailer-smtp.adapter';

// 2. Service Implementations
import { AuthServiceImplement } from '../services/implement/auth.service.implement';
import { InvitationServiceImplement } from '../services/implement/invitation.service.implement';
import { BillingServiceImplement } from '../services/implement/billing.service.implement';
import { MediaServiceImplement } from '../services/implement/media.service.implement';

// 3. Outbound Ports ({nama}.port.ts)
import type { IUserRepository } from '../outbound/user-repository.port';
import type { IInvitationRepository } from '../outbound/invitation-repository.port';
import type { IOrderRepository } from '../outbound/order-repository.port';
import type { IStoragePort } from '../outbound/storage.port';
import type { IPaymentGatewayPort } from '../outbound/payment-gateway.port';
import type { ISmtpPort } from '../outbound/smtp.port';

// 4. Service Inbound Ports
import type { IAuthService } from '../services/auth.service';
import type { IInvitationService } from '../services/invitation.service';
import type { IBillingService } from '../services/billing.service';
import type { IMediaService } from '../services/media.service';

class Registry {
  // Outbound Driven Ports
  public readonly userRepository: IUserRepository;
  public readonly invitationRepository: IInvitationRepository;
  public readonly orderRepository: IOrderRepository;
  public readonly storageAdapter: IStoragePort;
  public readonly paymentAdapter: IPaymentGatewayPort;
  public readonly smtpAdapter: ISmtpPort;

  // Inbound Driving Services
  public readonly authService: IAuthService;
  public readonly billingService: IBillingService;
  public readonly mediaService: IMediaService;
  public readonly invitationService: IInvitationService;

  constructor() {
    // Inisialisasi Outbound Adapters & Repositories
    this.userRepository = new DrizzleUserRepository();
    this.invitationRepository = new DrizzleInvitationRepository();
    this.orderRepository = new DrizzleOrderRepository();
    this.storageAdapter = new S3StorageAdapter();
    this.paymentAdapter = new MidtransPaymentAdapter();
    this.smtpAdapter = new NodemailerSmtpAdapter();

    // Inisialisasi Services
    this.authService = new AuthServiceImplement(this.userRepository, this.smtpAdapter);
    this.billingService = new BillingServiceImplement(
      this.orderRepository,
      this.userRepository,
      this.paymentAdapter
    );
    this.mediaService = new MediaServiceImplement(this.storageAdapter, this.userRepository);

    // Komposisi: Injeksi BillingService ke InvitationService
    this.invitationService = new InvitationServiceImplement(
      this.invitationRepository,
      this.billingService
    );
  }
}

export const registry = new Registry();
```

---

## 5. Layer Inbound HTTP: Controller & Route

### 5.1. Controller (`src/inbound/http/controllers/`)

```typescript
// src/inbound/http/controllers/invitation.controller.ts
import type { IInvitationService } from '../../../services/invitation.service';

export class InvitationController {
  constructor(private readonly invitationService: IInvitationService) {}

  async saveDraft(
    userId: string,
    invitationId: string,
    payload: { themeConfig: Record<string, unknown>; sections: unknown[] }
  ) {
    // Aturan ketat: HANYA ada 1 pemanggilan service
    const data = await this.invitationService.saveDraft({
      userId,
      invitationId,
      themeConfig: payload.themeConfig,
      sections: payload.sections,
    });

    return { success: true, data };
  }

  async publish(userId: string, invitationId: string) {
    // Aturan ketat: HANYA ada 1 pemanggilan service
    const data = await this.invitationService.publish(invitationId, userId);

    return {
      success: true,
      message: 'Invitation published successfully',
      data,
    };
  }
}
```

### 5.2. Route Definition (`src/inbound/http/routes/`)

```typescript
// src/inbound/http/routes/invitation.routes.ts
import { Elysia, t } from 'elysia';
import { InvitationController } from '../controllers/invitation.controller';
import { registry } from '../../../configs/registry';
import { authMacro } from '../middlewares/auth.macro';

// Controller mengambil service langsung dari registry
const controller = new InvitationController(registry.invitationService);

export const invitationRoutes = new Elysia({ prefix: '/invitations' })
  .use(authMacro)
  .put(
    '/:id/draft',
    async ({ user, params, body }) => {
      return await controller.saveDraft(user.id, params.id, body);
    },
    {
      isAuth: true,
      params: t.Object({ id: t.String() }),
      body: t.Object({
        themeConfig: t.Record(t.String(), t.Any()),
        sections: t.Array(t.Any()),
      }),
    }
  )
  .post(
    '/:id/publish',
    async ({ user, params }) => {
      return await controller.publish(user.id, params.id);
    },
    {
      isAuth: true,
      params: t.Object({ id: t.String() }),
    }
  );
```

---

## 6. Server Bootstrap & Eden Treaty Export

```typescript
// src/index.ts
import { Elysia } from 'elysia';
import { cors } from '@elysiajs/cors';
import { invitationRoutes } from './inbound/http/routes/invitation.routes';
import { authRoutes } from './inbound/http/routes/auth.routes';
import { billingRoutes } from './inbound/http/routes/billing.routes';
import { mediaRoutes } from './inbound/http/routes/media.routes';
import { errorHandler } from './inbound/http/middlewares/error.handler';

export const app = new Elysia({ prefix: '/api/v1' })
  .use(cors())
  .use(errorHandler)
  .use(authRoutes)
  .use(invitationRoutes)
  .use(billingRoutes)
  .use(mediaRoutes)
  .listen(process.env.PORT ?? 4000);

console.log(`Backend server listening on ${app.server?.hostname}:${app.server?.port}`);

// Export type App untuk dikonsumsi frontend Next.js via @elysiajs/eden
export type App = typeof app;
```

---

## 7. Kamus Konstanta & Domain Meta Code (`src/constants/`)

Seluruh kode respons, klasifikasi status, dan konstanta global sistem wajib diletakkan di bawah `src/constants/`:

```typescript
// src/constants/meta-codes.ts
export const META_CODES = {
  // 1000–1999: Success & Lifecycle
  SUCCESS_OK: 1000,
  RESOURCE_CREATED: 1001,
  DRAFT_SAVED: 1002,
  INVITATION_PUBLISHED: 1003,
  MEDIA_UPLOAD_READY: 1004,

  // 2000–2999: Auth & Authorization
  UNAUTHORIZED: 2001,
  TOKEN_EXPIRED: 2002,
  FORBIDDEN_RESOURCE: 2003,
  INVALID_CREDENTIALS: 2004,
  ACCOUNT_NOT_FOUND: 2005,

  // 3000–3999: Validation & Client Error
  SCHEMA_VALIDATION_ERROR: 3001,
  SLUG_ALREADY_EXISTS: 3002,
  FILE_SIZE_EXCEEDED: 3003,
  UNSUPPORTED_MIME_TYPE: 3004,
  RESOURCE_NOT_FOUND: 3005,

  // 4000–4999: Billing & Business Rules
  SUBSCRIPTION_INACTIVE: 4001,
  SUBSCRIPTION_EXPIRED: 4002,
  INVITATION_QUOTA_EXCEEDED: 4003,
  PAYMENT_PENDING: 4004,
  PAYMENT_FAILED: 4005,

  // 9000–9999: System & Infrastructure
  INTERNAL_SERVER_ERROR: 9001,
  DATABASE_CONNECTION_ERROR: 9002,
  STORAGE_SERVICE_ERROR: 9003,
  PAYMENT_GATEWAY_ERROR: 9004,
  SMTP_MAIL_ERROR: 9005,
} as const;

export type MetaCode = typeof META_CODES[keyof typeof META_CODES];
```

---

## 8. Infrastruktur Lokal Docker (`docker-compose.yml`)

Pengembangan backend secara lokal didukung oleh kontainer Docker Compose di akar proyek untuk menyediakan layanan yang identik dengan cloud:

| Layanan | Docker Image | Port Host:Container | Kegunaan |
| :--- | :--- | :--- | :--- |
| **`postgres`** | `postgres:16-alpine` | `5432:5432` | Basis data relasional PostgreSQL untuk Drizzle ORM |
| **`minio`** | `minio/minio` | `9000:9000` (API), `9001:9001` (Console) | S3-compatible Object Storage lokal (simulasi Cloudflare R2) |
| **`create-buckets`** | `minio/mc` | - (CLI runner) | Otomatis membuat bucket `wedding-invitations-media` dan public read policy |
| **`mailpit`** | `axllent/mailpit` | `1025:1025` (SMTP), `8025:8025` (Web UI) | Mock server email untuk testing pengiriman email Nodemailer |

---

## 9. Skrip Migrasi Basis Data (`src/db/migrate.ts` & Scripts)

Untuk mengotomatisasi generasi berkas SQL dan eksekusi migrasi ke PostgreSQL, backend menyediakan skrip runner Drizzle:

### 9.1. Migration Runner (`src/db/migrate.ts`)
```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';
import { env } from '../configs/env';

const migrationClient = postgres(env.DATABASE_URL, { max: 1 });

async function runMigrate() {
  console.log('⏳ Menjalankan migrasi database Drizzle...');
  const db = drizzle(migrationClient);
  await migrate(db, { migrationsFolder: './drizzle' });
  console.log('✅ Migrasi database berhasil diselesaikan.');
  await migrationClient.end();
  process.exit(0);
}

runMigrate().catch(async (err) => {
  console.error('❌ Migrasi database gagal:', err);
  await migrationClient.end();
  process.exit(1);
});
```

### 9.2. Perintah CLI Migrasi (`package.json`)
```json
{
  "scripts": {
    "db:generate": "drizzle-kit generate",
    "db:migrate": "bun run src/db/migrate.ts",
    "db:push": "drizzle-kit push",
    "db:studio": "drizzle-kit studio"
  }
}
```

* **`bun run db:generate`**: Membaca seluruh skema tabel di `src/db/schema/` dan menghasilkan berkas migration SQL ke direktori `./drizzle/`.
* **`bun run db:migrate`**: Menjalankan migrasi SQL yang belum terpasang ke database PostgreSQL target secara transaksional dan aman.
* **`bun run db:push`**: Melakukan sinkronisasi skema langsung ke database dev tanpa membuat berkas migrasi SQL (berguna untuk prototyping cepat).
* **`bun run db:studio`**: Membuka dashboard antarmuka visual Drizzle Studio untuk eksplorasi data secara visual di browser.