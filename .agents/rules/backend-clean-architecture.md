---
trigger: always_on
glob: "**/*"
description: Comprehensive backend clean architecture and hexagonal rules for ElysiaJS on Bun, covering thin controllers, single-service call constraints, inbound/outbound ports and adapters, Drizzle repositories, unified API response envelopes, and custom error codes.
---

# Backend Clean Architecture & Hexagonal Rules (ElysiaJS / Bun)

Whenever designing, implementing, modifying, or reviewing backend code, routes, controllers, services, repositories, or schemas across this platform, the AI agent MUST strictly and unconditionally adhere to the following architecture rules:

---

## 1. Hexagonal Architecture & Directory Topology

The backend runtime is **Bun** utilizing **ElysiaJS** and strictly follows **Hexagonal Architecture (Inbound/Outbound Ports & Adapters)** and **SOLID** principles:

```text
backend/src/
├── configs/
│   ├── env.ts                                 # Environment variable parsing & validation
│   ├── registry.ts                            # Central IoC Container / Service Locator
│   └── response.helper.ts                     # Unified API Response Envelope builder
│
├── constants/
│   ├── meta-codes.ts                          # 4-Digit Domain Custom Codes dictionary
│   └── index.ts                               # Re-export all constants
│
├── db/
│   ├── index.ts                               # Database connection pool (Bun postgres)
│   └── schema/                                # Drizzle Table Schemas ({table}.schema.ts)
│       ├── users.schema.ts
│       ├── subscriptions.schema.ts
│       ├── orders.schema.ts
│       ├── invitations.schema.ts
│       ├── rsvps.schema.ts
│       └── index.ts                           # Re-export all schemas
│
├── inbound/
│   └── http/                                  # Driving Adapters (HTTP / Elysia)
│       ├── controllers/                       # Thin Controllers ({domain}.controller.ts)
│       ├── routes/                            # Elysia Routes & TypeBox Schemas ({domain}.routes.ts)
│       └── middlewares/
│           ├── auth.macro.ts                  # Guard / JWT session verification
│           └── error.handler.ts               # Global AppDomainError & exception catcher
│
├── services/                                  # Service Interfaces / Inbound Ports
│   ├── auth.service.ts                        # interface IAuthService
│   ├── invitation.service.ts                  # interface IInvitationService
│   ├── billing.service.ts                     # interface IBillingService
│   ├── media.service.ts                       # interface IMediaService
│   └── implement/                             # Concrete Business Logic Implementations
│       ├── auth.service.implement.ts
│       ├── invitation.service.implement.ts
│       ├── billing.service.implement.ts
│       └── media.service.implement.ts
│
├── outbound/                                  # Driven Ports: Root interfaces ({nama}.port.ts)
│   ├── user-repository.port.ts                # interface IUserRepository
│   ├── invitation-repository.port.ts          # interface IInvitationRepository
│   ├── order-repository.port.ts               # interface IOrderRepository
│   ├── storage.port.ts                        # interface IStoragePort
│   ├── payment-gateway.port.ts                # interface IPaymentGatewayPort
│   ├── smtp.port.ts                           # interface ISmtpPort
│   │
│   ├── repository/                            # Database Implementations (Drizzle ORM)
│   │   ├── drizzle-user.repository.ts
│   │   ├── drizzle-invitation.repository.ts
│   │   └── drizzle-order.repository.ts
│   ├── storage/                               # Object Storage Implementations (Cloudflare R2 / S3)
│   │   └── s3-storage.adapter.ts
│   ├── payment/                               # Payment Gateway Implementations (Midtrans)
│   │   └── midtrans-payment.adapter.ts
│   └── smtp/                                  # Email Transport Implementations (Nodemailer)
│       └── nodemailer-smtp.adapter.ts
│
└── index.ts                                   # Application bootstrap & Elysia App type export
```

---

## 2. Inbound Layer Rules (Controllers & Routes)

### A. The "Single Service Call" Controller Directive (Strict & Non-Negotiable)
1. **Ultra-Thin Dispatchers:**
   - Controllers exist solely to unpack the HTTP request, pass typed parameters to **exactly one** service method, and format the returned data via `ResponseHelper`.
   - **Absolute Prohibition:** A controller method is strictly forbidden from executing business rules, database queries, calculations, or calling **more than one service method** in a single handler.
   - Any multi-step orchestration or cross-domain dependency (e.g. verifying subscription status before publishing an invitation) **must reside inside the Service layer**.
2. **Standard Controller Template:**
   ```typescript
   export class InvitationController {
     constructor(private readonly invitationService: IInvitationService) {}

     async saveDraft(userId: string, invitationId: string, payload: SaveDraftDTO) {
       // Exactly 1 service call
       const result = await this.invitationService.saveDraft({ userId, invitationId, ...payload });
       return ResponseHelper.success(result, 'Draft undangan berhasil disimpan.', 1002);
     }
   }
   ```

### B. Elysia Route & TypeBox Specifications
1. **Schema Validation:**
   - All request bodies, query params, and URL params must be strictly validated using Elysia's built-in TypeBox schema builder `t` (`import { t } from 'elysia'`) (`t.Object`, `t.String`, `t.Array`, etc.) in the route definition file (`*.routes.ts`) without external `@sinclair/typebox` dependency.
2. **Controller Resolution:**
   - Controllers instantiate dependencies through the central registry (`registry.ts`).
3. **Macro Guards:**
   - Protected routes must consume the `authMacro` (`isAuth: true`) to resolve session credentials and claims into `user`.

---

## 3. Service Layer Rules (Inbound Ports & Implementations)

1. **Strict Interface / Implementation Separation:**
   - Every service contract resides directly under `src/services/{domain}.service.ts` with prefix `I` (e.g. `IInvitationService`, `IBillingService`).
   - The concrete class resides strictly under `src/services/implement/{domain}.service.implement.ts` with suffix `ServiceImplement` (e.g. `InvitationServiceImplement`).
2. **Dependency Inversion & Composition:**
   - Services must accept their outbound ports and peer services exclusively via constructor parameters:
     ```typescript
     export class InvitationServiceImplement implements IInvitationService {
       constructor(
         private readonly invitationRepo: IInvitationRepository,
         private readonly billingService: IBillingService
       ) {}
     }
     ```
3. **Domain Exception Directives:**
   - When a business rule fails (e.g., unauthorized access, quota exceeded, inactive plan), services must throw `AppDomainError` with the corresponding 4-digit custom code:
     ```typescript
     if (!isSubscriberActive) {
       throw new AppDomainError(4001, 'Langganan Anda tidak aktif.', 403);
     }
     ```

---

## 4. Outbound Layer Rules (Driven Ports & Adapters)

1. **Port Interfaces at Root:**
   - All outbound contracts MUST be defined directly at `src/outbound/{name}.port.ts`.
   - Examples: `src/outbound/invitation-repository.port.ts`, `src/outbound/storage.port.ts`, `src/outbound/payment-gateway.port.ts`.
2. **Categorized Concrete Adapters:**
   - Concrete adapter classes must be placed within their corresponding functional subdirectory:
     - `src/outbound/repository/` (Database persistence via Drizzle)
     - `src/outbound/storage/` (Object storage / Cloudflare R2)
     - `src/outbound/payment/` (Midtrans API integration)
     - `src/outbound/smtp/` (Nodemailer email transport)
3. **Zero Leaky Abstractions:**
   - Outbound ports must expose domain-level interfaces and records. Drizzle-specific or S3-specific types must never leak out of adapter implementations into the service layer.

---

## 5. Database Layer & Schema Conventions (`src/db/`)

1. **File Naming Convention:**
   - Every table schema file in `src/db/schema/` MUST be named `{table_name}.schema.ts` (e.g., `users.schema.ts`, `invitations.schema.ts`, `orders.schema.ts`, `subscriptions.schema.ts`, `rsvps.schema.ts`).
   - All schemas must be re-exported through `src/db/schema/index.ts`.
2. **Database Isolation Guardrail:**
   - Direct database access (`db.select()`, `db.insert()`, `db.update()`, `db.delete()`) is **strictly forbidden** in controllers, services, routes, or utilities.
   - All database read/write operations must be encapsulated within repository classes under `src/outbound/repository/`.

---

## 6. Central Registry & IoC Container (`src/configs/registry.ts`)

1. **Single Source of Wiring:**
   - All outbound adapters and services must be instantiated and wired together exclusively within the `Registry` class in `src/configs/registry.ts`.
2. **Public Readonly Injection:**
   - Services and outbound ports must be exposed as `public readonly` members on the exported `registry` singleton instance.

---

## 7. Unified API Response Envelope & Custom Codes

Every HTTP response returned by the backend MUST strictly conform to the 4-attribute `ApiResponse` envelope:

```typescript
export interface ApiResponse<T = unknown> {
  meta: {
    code: number;          // 4-Digit Domain Custom Code
    timestamp: string;     // ISO 8601 UTC timestamp
    requestId?: string;    // Correlation ID for tracing
  };
  status: 'OK' | 'FAILED';
  message: string;
  data: T | null;
  errors?: unknown;
}
```

### A. Custom Code Dictionary

| Range | Classification | Official Codes & Meaning |
| :--- | :--- | :--- |
| **`1000–1999`** | **Success & Lifecycle** | `1000` SUCCESS_OK, `1001` RESOURCE_CREATED, `1002` DRAFT_SAVED, `1003` INVITATION_PUBLISHED, `1004` MEDIA_UPLOAD_READY. |
| **`2000–2999`** | **Auth & Authorization** | `2001` UNAUTHORIZED, `2002` TOKEN_EXPIRED, `2003` FORBIDDEN_RESOURCE, `2004` INVALID_CREDENTIALS, `2005` ACCOUNT_NOT_FOUND. |
| **`3000–3999`** | **Validation & Client Error** | `3001` SCHEMA_VALIDATION_ERROR, `3002` SLUG_ALREADY_EXISTS, `3003` FILE_SIZE_EXCEEDED, `3004` UNSUPPORTED_MIME_TYPE, `3005` RESOURCE_NOT_FOUND. |
| **`4000–4999`** | **Billing & Business Rules** | `4001` SUBSCRIPTION_INACTIVE, `4002` SUBSCRIPTION_EXPIRED, `4003` INVITATION_QUOTA_EXCEEDED, `4004` PAYMENT_PENDING, `4005` PAYMENT_FAILED. |
| **`9000–9999`** | **System & Infrastructure** | `9001` INTERNAL_SERVER_ERROR, `9002` DATABASE_CONNECTION_ERROR, `9003` STORAGE_SERVICE_ERROR, `9004` PAYMENT_GATEWAY_ERROR, `9005` SMTP_MAIL_ERROR. |

### B. Standard Response & Error Middleware
- Success responses must be generated using `ResponseHelper.success(data, message, customCode)`.
- Global error handling in `src/inbound/http/middlewares/error.handler.ts` must catch:
  - `AppDomainError` -> Custom code and defined HTTP status.
  - Elysia `VALIDATION` -> Code `3001` with HTTP `422`.
  - Elysia `NOT_FOUND` -> Code `3005` with HTTP `404`.
  - Fallback Exceptions -> Code `9001` with HTTP `500`.

---

## 8. Security, Credentials & Runtime Conventions

1. **Password Hashing (Argon2id):**
   - User passwords must be hashed using native `bun:password` (`Bun.password.hash(password, { algorithm: 'argon2id' })`).
   - Plaintext passwords must NEVER be logged, stored, or returned in API responses.
2. **Webhook Signature Verification:**
   - Payment webhooks (Midtrans) must verify the SHA-512 signature hash using native `crypto` before initiating order fulfillment.
3. **Presigned Upload Architecture (Cloudflare R2):**
   - Media uploads must never stream binary payload directly through Elysia memory.
   - The backend only issues presigned PUT URLs via `media.service.ts` / `s3-storage.adapter.ts`. The client streams WebP binaries directly to Cloudflare R2.
4. **Eden Treaty Export:**
   - The root application in `src/index.ts` must export `export type App = typeof app;` to enable end-to-end type safety on the Next.js frontend client via `@elysiajs/eden`.

---

## 9. Non-Negotiable Quality Guardrails

1. **Absolute Prohibition of `any` (Zero Exceptions):**
   - All DTOs, record models, service parameters, return types, and TypeBox schemas must have explicit TypeScript typings.
2. **No Circular Dependencies:**
   - Unidirectional flow: `Inbound (HTTP)` -> `Services` -> `Outbound (Ports)`.
   - Outbound ports and repositories must never import from services or inbound layers.
3. **No Direct Network or DB Calls in Controllers:**
   - All database queries and external network calls must be executed within their respective outbound adapters.
