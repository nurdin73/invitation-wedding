I have conducted the read-only codebase analysis and verified all architectural constraints. Below is the complete technical implementation plan for the **"Halaman Katalog Tema"** (`/templates`) feature.

---

# Implementation Plan: Halaman Katalog Tema (`/templates`)

## 1. Problem Analysis & Scope Boundaries

### A. Problem Statement
The current landing page ([`landing-template-showcase.tsx`](file:///C:/Users/nurdi/Desktop/invitation-wedding/frontend/src/components/landing/landing-template-showcase.tsx)) displays hardcoded static mock items with buttons that are not wired to an integrated template selection flow. The platform needs a dedicated public theme catalog page at `/templates` powered by the backend API (`GET /api/v1/templates`), providing category filtering, high-fidelity responsive previews (Domain B isolation), and seamless conversion to registration or draft creation.

### B. Demarcation & Anti-Overengineering Guardrails
- **In-Scope:**
  - Dedicated Next.js route: `frontend/src/app/templates/page.tsx`.
  - Backend category filtering support on `GET /api/v1/templates?category=...`.
  - Standardized client API module at `frontend/src/services/api/template.api.ts` (and update `templates.api.ts`).
  - Co-located catalog components at `frontend/src/components/templates-catalog/`.
  - Two-Domain isolated Mobile Mockup Quick Preview Modal with scoped `--inv-*` CSS variables.
  - Conversion flow: "Gunakan Desain" routes unauthenticated guests to `/register?templateId={id}` and authenticated users to `/dashboard?templateId={id}` with automated draft dialog trigger.
- **Out-of-Scope (Strictly Prohibited):**
  - No template marketplace, cart, per-template checkout, or multi-vendor royalty logic.
  - No user rating, comment, or review modules.
  - No frontend template CMS builder for admin.
  - No new external UI libraries (using existing `lucide-react`, `@radix-ui/react-dialog`, `Tailwind CSS`).

---

## 2. File-by-File Changes Specification

### Backend (Clean & Hexagonal Architecture)

#### 1. `backend/src/outbound/template-repository.port.ts` `[MODIFY]`
- Update interface [`ITemplateRepository`](file:///C:/Users/nurdi/Desktop/invitation-wedding/backend/src/outbound/template-repository.port.ts#L16):
  ```typescript
  findAllActive(category?: string): Promise<TemplateRecord[]>;
  ```

#### 2. `backend/src/outbound/repository/drizzle-template.repository.ts` `[MODIFY]`
- Update [`DrizzleTemplateRepository.findAllActive`](file:///C:/Users/nurdi/Desktop/invitation-wedding/backend/src/outbound/repository/drizzle-template.repository.ts#L7-L10):
  - Import `and` from `drizzle-orm`.
  - If `category` is provided and not `'all'`, filter by both `templates.isActive = true` and `templates.category = category`.
  - Otherwise, return all active templates.

#### 3. `backend/src/services/template.service.ts` `[MODIFY]`
- Update interface [`ITemplateService`](file:///C:/Users/nurdi/Desktop/invitation-wedding/backend/src/services/template.service.ts#L3):
  ```typescript
  getActiveTemplates(category?: string): Promise<TemplateRecord[]>;
  ```

#### 4. `backend/src/services/implement/template.service.implement.ts` `[MODIFY]`
- Update [`TemplateServiceImplement.getActiveTemplates`](file:///C:/Users/nurdi/Desktop/invitation-wedding/backend/src/services/implement/template.service.implement.ts#L9-L11) to delegate `category` to `this.templateRepo.findAllActive(category)`.

#### 5. `backend/src/inbound/http/controllers/template.controller.ts` `[MODIFY]`
- Update [`TemplateController.getAllActive`](file:///C:/Users/nurdi/Desktop/invitation-wedding/backend/src/inbound/http/controllers/template.controller.ts#L8-L11):
  - Accept optional `category?: string`.
  - Maintain **Single Service Call**: call only `this.templateService.getActiveTemplates(category)`.
  - Envelope response using `ResponseHelper.success(result, 'Daftar template desain berhasil diambil.', META_CODES.SUCCESS_OK)`.

#### 6. `backend/src/inbound/http/routes/template.routes.ts` `[MODIFY]`
- Update `GET /` route in [`templateRoutes`](file:///C:/Users/nurdi/Desktop/invitation-wedding/backend/src/inbound/http/routes/template.routes.ts#L8):
  - Add query parameter validation with Elysia's TypeBox:
    ```typescript
    query: t.Object({
      category: t.Optional(t.String()),
    })
    ```
  - Pass `query?.category` to `controller.getAllActive(query?.category)`.

---

### Frontend (Design System, Co-Location & API Layer)

#### 7. `frontend/src/services/api/templates.api.ts` `[MODIFY]`
- Enhance `templatesApi.getAll(category?: string)` to pass `category` as query parameter when provided.
- Export alias `export const templateApi = templatesApi;`.

#### 8. `frontend/src/services/api/template.api.ts` `[NEW]`
- Dedicated file exporting `templateApi` and re-exporting `TemplateData` contracts for consistent single-domain imports.

#### 9. `frontend/src/components/templates-catalog/template-catalog.types.ts` `[NEW]`
- Define strictly typed contracts (Zero `any`):
  - `TemplateCategoryOption`: category identifier, label, and database value.
  - `CatalogFilterState`: active category state.
  - Re-export `TemplateData` from API.

#### 10. `frontend/src/components/templates-catalog/use-template-catalog.ts` `[NEW]`
- Custom hook encapsulating:
  - State: `activeCategory`, `templates`, `isLoading`, `error`, `previewTemplate`.
  - Fetching via `templateApi.getAll(category === 'all' ? undefined : category)`.
  - Handlers: `handleCategoryChange`, `handleOpenPreview`, `handleClosePreview`.
  - Conversion handler `handleUseTemplate(templateId: string)`:
    - Checks auth state via `getAuthCookie()` / `getStoredUser()`.
    - If logged in -> `router.push('/dashboard?templateId=' + templateId)`.
    - If guest -> `router.push('/register?templateId=' + templateId)`.

#### 11. `frontend/src/components/templates-catalog/catalog-header.tsx` `[NEW]`
- Section title & filter chips:
  - Two-Font Rule: `H1` in `Playfair Display` (`font-heading`), body & chips in `Plus Jakarta Sans` (`font-sans`).
  - Semantic styling: `bg-card`, `bg-primary`, `text-primary-foreground`, `border-border`.
  - Attributes: `data-testid="catalog-filter-chip-{category}"`.

#### 12. `frontend/src/components/templates-catalog/template-card.tsx` `[NEW]`
- Presentational card item:
  - Aspect ratio thumbnail with subtle scale hover.
  - Category pill, template title (`H3` in `Plus Jakarta Sans`), and description.
  - Palette color dots extracted from `themeConfig.primaryColor` & `themeConfig.canvasBackground`.
  - Dual action buttons:
    - "Pratinjau" (Eye icon) -> `data-testid="template-preview-btn-{slug}"`.
    - "Gunakan Desain" (Arrow/Sparkles icon) -> `data-testid="template-select-btn-{slug}"`.
  - Root attribute: `data-testid="template-card-{slug}"`.

#### 13. `frontend/src/components/templates-catalog/template-preview-modal.tsx` `[NEW]`
- Radix Dialog modal for Quick Mobile Preview:
  - Mobile frame chassis mockup (Domain B style isolation).
  - Dynamically injected `--inv-*` CSS variables via [`generateCanvasStyleVars`](file:///C:/Users/nurdi/Desktop/invitation-wedding/frontend/src/lib/style-helpers.ts#L56).
  - Renders sample hero, couple, and event content cleanly within the simulated phone frame without affecting the platform UI chrome.
  - Sticky footer with "Gunakan Desain Ini" CTA -> `data-testid="preview-modal-use-template-btn"`.

#### 14. `frontend/src/components/templates-catalog/template-grid.tsx` `[NEW]`
- Responsive 3-column grid wrapper:
  - Loading skeleton state (animated pulse cards).
  - Empty state when no templates match the category filter.
  - Render list of `TemplateCard`.

#### 15. `frontend/src/components/templates-catalog/templates-catalog-view.tsx` `[NEW]`
- Main orchestrator (< 80 lines):
  - Composes `CatalogHeader`, `TemplateGrid`, and `TemplatePreviewModal`.
  - Consumes `useTemplateCatalog()`.

#### 16. `frontend/src/components/templates-catalog/index.ts` `[NEW]`
- Clean barrel export.

#### 17. `frontend/src/app/templates/page.tsx` `[NEW]`
- Public route page:
  - Wrapped in `<LandingNavbar />` and `<LandingFooter />`.
  - Wrapped in `<React.Suspense>` for search parameter safety.
  - Metadata definition for SEO.

#### 18. `frontend/src/config/dashboard-nav.ts` `[MODIFY]`
- Remove `badge: 'Segera'` from `nav-item-templates` to reflect the active `/templates` page.

#### 19. `frontend/src/app/(dashboard)/dashboard/page.tsx` & `create-invitation-dialog.tsx` `[MODIFY]`
- Pass optional `initialTemplateId` read from query parameter `templateId` into `CreateInvitationDialog` so clicking "Gunakan Desain" immediately opens the creation dialog with the selected template active.

---

## 3. Platform Rule Compliance Verification

| Architecture & Design Rule | Verification in Proposed Implementation |
| :--- | :--- |
| **Hexagonal Inbound/Outbound** | Direct DB queries remain strictly inside `DrizzleTemplateRepository`. Controller dispatches to exactly one service method. Service implements inbound interface `ITemplateService`. |
| **Single Service Call** | `TemplateController.getAllActive` only invokes `this.templateService.getActiveTemplates(category)`. |
| **4-Digit Custom Codes** | Responses return standard `ApiResponse` envelope with `META_CODES.SUCCESS_OK` (`1000`) or `RESOURCE_NOT_FOUND` (`3005`). |
| **Dual-Domain Style Isolation** | Platform catalog UI utilizes platform tokens (`bg-background`, `bg-card`, `bg-primary`, `border-border`). Preview modal utilizes scoped `--inv-*` CSS variables inside a phone mockup container. |
| **Two-Font Hierarchy** | `Playfair Display` is exclusively used on `H1` and `H2`. `H3–H6`, body, labels, badges, buttons, and chips strictly use `Plus Jakarta Sans`. |
| **Absolute Prohibition of `any`** | Strict TypeScript interfaces for all DTOs, hook states, and component props without exception. |
| **Mandatory `data-testid`** | Every interactive chip, card, preview button, selection button, and modal element has deterministic `data-testid` attributes. |
| **Modularity & SLOC limits** | Orchestrator `templates-catalog-view.tsx` < 80 SLOC. Each sub-component < 150 SLOC. |

---

## 4. Test Automation Strategy for Tester Agent

### A. Unit Tests (Service Layer with Mock Port)
- **Target File:** `backend/src/services/implement/template.service.implement.test.ts`
- **Harness:** `bun:test`
- **Mock Strategy:** Stub `ITemplateRepository` in-memory without database connection.
- **Scenarios:**
  1. `getActiveTemplates()` without parameter returns all active templates from repository.
  2. `getActiveTemplates('Floral & Romantic')` delegates the category parameter to repository's `findAllActive`.
  3. `getTemplateById(id)` returns valid `TemplateRecord` when template exists and `isActive: true`.
  4. `getTemplateById(id)` throws `AppDomainError` with code `3005` (404) when template is missing or `isActive: false`.
  5. `getTemplateBySlug(slug)` returns valid record or throws `AppDomainError` (3005).

### B. Integration / E2E Tests (Elysia Route Dispatcher)
- **Target File:** `backend/tests/template.routes.test.ts`
- **Harness:** `bun:test` with `app.handle(new Request(...))`
- **Scenarios:**
  1. `GET /api/v1/templates`: Verifies HTTP status `200`, `meta.code === 1000`, `status === 'OK'`, and `data` is an array.
  2. `GET /api/v1/templates?category=Floral+%26+Romantic`: Verifies filtering by category.
  3. `GET /api/v1/templates/:id`: Verifies detail retrieval by UUID.
  4. `GET /api/v1/templates/00000000-0000-0000-0000-000000000000`: Verifies 404 response with `meta.code === 3005`.

---

## 5. Verification Commands

1. **Backend Verification:**
   ```bash
   bun run --cwd backend typecheck
   bun test backend/src/services/implement/template.service.implement.test.ts
   bun test backend/tests/template.routes.test.ts
   ```
2. **Frontend Verification:**
   ```bash
   bun run --cwd frontend typecheck
   ```

---

> [!IMPORTANT]
> In accordance with `.agents/rules/mandatory-planning-workflow.md`, no code files have been created or modified yet. Please confirm this implementation plan so execution can proceed.