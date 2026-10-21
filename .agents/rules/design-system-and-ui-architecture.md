---
trigger: always_on
glob: "**/*"
description: Comprehensive design system and UI architecture rules governing color tokens, typography, shadcn/ui component primitives, dual-domain style isolation, and accessibility guardrails.
---

# Design System & UI Architecture Rules

Whenever designing, implementing, modifying, or reviewing frontend components, styles, layouts, or templates across this platform, the AI agent MUST strictly and unconditionally adhere to the following design system and UI architecture rules:

---

## 1. Dual-Domain Style Isolation (Decoupled Styling)

The platform operates across two completely separate visual domains that must remain decoupled:

```text
┌────────────────────────────────────────────────────────────────────────┐
│ DOMAIN A: Platform UI (Dashboard, Auth, Editor Shell, Billing)         │
│  • Primitives: shadcn/ui (Radix Primitives) in src/components/ui/      │
│  • Style Engine: Tailwind CSS Semantic Tokens (CSS Variables)          │
│  • Theme Support: Light Mode / Dark Mode                               │
└────────────────────────────────────────────────────────────────────────┘
                                 ≠ (STRICT ISOLATION)
┌────────────────────────────────────────────────────────────────────────┐
│ DOMAIN B: Invitation Template Engine (Canvas & Public Guest View)      │
│  • Rendering Engine: Section Stacking in src/modules/invitation-sections│
│  • Style Engine: Dynamic CSS Variables (--inv-*) injected at canvas    │
│  • Font & Palette: Driven by invitation's themeConfig                  │
└────────────────────────────────────────────────────────────────────────┘
```

### Strict Isolation Guardrails:
1. **Zero Style Leakage:** Platform UI tokens (`primary`, `secondary`, `card`, `border`) must never dictate invitation template visual styles. Conversely, user wedding themes or font configurations must never alter the editor chrome, sidebar, or navigation.
2. **Dynamic Scoping:** Invitation canvas elements must exclusively reference scoped variables (e.g., `var(--inv-primary)`, `var(--inv-bg)`, `var(--inv-font-heading)`), injected dynamically into the canvas container via `src/lib/style-helpers.ts`.

---

## 2. Color Token Specifications (Platform Web)

All platform interface styling (Landing, Auth, Dashboard, Editor Chrome) must strictly utilize the standardized semantic color tokens defined below.

### A. Semantic Token Mapping Table (Editorial Color Palette)

| Token Name | Light Mode (HEX) | Dark Mode (HEX) | Functional Role |
| :--- | :--- | :--- | :--- |
| **`primary` / `accent`** | `#B86B70` (Dusty Rose) | `#D48D92` (Muted Dusty Rose) | Primary CTA buttons, key action highlights, canvas section selection ring, focus indicators. |
| **`primary-foreground`** | `#FFFFFF` (Crisp White) | `#FFFFFF` | Text and icons placed on top of `primary` elements. |
| **`background`** | `#FAF8F5` (Warm Linen Cream) | `#1C1715` (Deep Espresso) | Base background across dashboard, landing, and workspace chassis. |
| **`card` / `surface`** | `#FFFFFF` (Crisp White) | `#231E1B` (Dark Cocoa Card) | Primary cards, modal dialogs, topbars, device mockup chassis. |
| **`card-oat` / `secondary`** | `#F5EFEB` (Off-White Oat) | `#2C2522` (Muted Oat Dark) | Secondary cards, preview boxes, inactive tabs, secondary list items. |
| **`secondary-foreground`** | `#3A302C` (Dark Espresso Charcoal) | `#F5EFEB` (Off-White Oat) | High-contrast text placed on top of `secondary` elements. |
| **`border`** | `#ECE5DE` (Subtle Oat Line) | `#38302C` (Deep Cocoa Border) | Panel dividers, table borders, card borders, structural separators. |
| **`border-soft`** | `#F2DFDC` (Soft Blush Line) | `#443534` (Muted Blush Border) | Gentle inner dividers, accent container borders. |
| **`accent-tint`** | `#FDF0EE` (Soft Rose Tint) | `#382627` (Deep Rose Tint) | Soft badge backgrounds, hero highlight strips, subtle card glow. |
| **`accent-gold`** | `#DFB15B` (Champagne Sand) | `#DFB15B` (Champagne Sand) | VIP badges, special plan indicators, milestone stars. |
| **`text-primary` / `foreground`** | `#3A302C` (Dark Espresso Charcoal) | `#FAF8F5` (Warm Linen Cream) | High-contrast page titles, section headers, critical form labels. |
| **`text-secondary` / `muted-foreground`** | `#73635C` (Soft Cocoa) | `#C4B6AF` (Light Cocoa) | Body text, descriptions, timestamps, secondary navigation. |
| **`muted-caption`** | `#A89B95` (Warm Stone) | `#8E807A` (Muted Stone) | Micro-copy, footnotes, input placeholders, caption text. |
| **`success`** | `#E8F0EA` (Soft Sage) | `#233427` (Muted Sage Dark) | Success badge backgrounds, positive status indicators. |
| **`success-foreground`** | `#58755E` (Sage Dark) | `#8EB095` (Light Sage) | High-contrast text/icons on success badges. |
| **`destructive`** | `#DC2626` (Red-600) | `#EF4444` (Red-500) | Delete section action, error alerts, form invalid state. |
| **`destructive-foreground`**| `#FFFFFF` | `#FFFFFF` | Text on destructive elements. |

### B. Prohibited Color Anti-Patterns
- **No Hardcoded Hex/RGB:** Never use arbitrary hex codes (e.g. `bg-[#1E293B]`, `text-[#C5A880]`) or raw RGB values in component templates. Always use semantic Tailwind classes (`bg-primary`, `text-foreground`, `border-border`, `bg-muted`, `bg-accent`).
- **No Generic Tailwind Colors:** Avoid scattered ad-hoc colors (e.g. `bg-blue-500`, `text-green-600`) for standard UI states. Use `text-success`, `text-warning`, `text-destructive`.

---

## 3. Typography System & Hierarchy (Platform Web)

Platform UI typography follows a refined Two-Font pairing: an editorial serif for headings paired with a clean modern sans-serif for body/controls, backed by monospace for data tokens:

### A. Font Families
1. **Heading Font (Titles & Main Section Headers):** `Playfair Display`
   - Fallback stack: `Georgia, "Times New Roman", serif`
   - Loaded via `next/font/google` and configured in root layout and Tailwind via `font-heading` / `font-serif`.
   - **Scope Guardrail:** Hanya diterapkan untuk `h1` dan `h2`.
2. **Body, Subheadings & Controls Font (H3–H6, Body, Buttons, Inputs, Labels):** `Plus Jakarta Sans`
   - Fallback stack: `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
   - Loaded via `next/font/google` and configured in root layout and Tailwind via `font-sans`.
   - **Scope Guardrail:** Seluruh elemen selain `h1` dan `h2` (termasuk `h3`, `h4`, `h5`, `h6`, kartu, dan kontrol) wajib menggunakan `Plus Jakarta Sans`.
3. **Monospace Font (Data & Technical Tokens):** `JetBrains Mono` or `Geist Mono`
   - Used for: Slug URLs (`/[slug]`), API tokens, payment transaction IDs, and HEX color inputs in the inspector.
   - Configured in Tailwind via `font-mono`.

### B. Typography Scale & Hierarchy

| Hierarchy Role | Font Size | Weight | Tracking / Line Height | Tailwind Classes |
| :--- | :--- | :--- | :--- | :--- |
| **Page / Screen Title** | 24px–28px | SemiBold (600) | Tracking `-0.02em` | `text-2xl font-semibold tracking-tight text-text-primary` |
| **Section / Panel Header** | 16px–18px | SemiBold (600) | Default | `text-base font-semibold text-text-primary` |
| **Control Label & Button** | 13px–14px | Medium (500) | Default | `text-sm font-medium` |
| **Body / Helper Text** | 13px–14px | Regular (400) | Line-height 1.5 | `text-sm text-text-secondary leading-relaxed` |
| **Micro-copy & Badge** | 11px–12px | Medium (500) | Optional tracking wider | `text-xs font-medium text-text-secondary` |

---

## 4. UI Primitives & shadcn/ui Standards (`src/components/ui/`)

All reusable UI building blocks must strictly follow the **shadcn/ui** architecture:

1. **Primitive Co-Location:**
   - Every UI primitive lives directly under `src/components/ui/[component].tsx` (e.g. `button.tsx`, `dialog.tsx`, `dropdown-menu.tsx`, `input.tsx`, `select.tsx`, `slider.tsx`, `tabs.tsx`, `sonner.tsx`).
2. **Class Merging Utility:**
   - All dynamic class concatenation must use `cn()` from `src/lib/utils.ts` (combining `clsx` and `tailwind-merge`).
   - Example:
     ```tsx
     import { cn } from "@/lib/utils";

     export function CustomCard({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
       return <div className={cn("rounded-lg border bg-card p-4 text-card-foreground shadow-sm", className)} {...props} />;
     }
     ```
3. **Variants via CVA:**
   - Component visual variants must be constructed using `class-variance-authority` (CVA).
4. **Dialogs & Confirmations:**
   - Confirmation modals must wrap Radix/shadcn Dialog primitives via `src/components/feedback/confirm-dialog.tsx`. Never use browser-native `window.confirm()` or `window.alert()`.
5. **Toast Notifications:**
   - Toasts must use `sonner` (`toast.success()`, `toast.error()`, `toast.info()`). Avoid legacy toast implementations.

---

## 5. Visual Section Editor Architecture

The editor interface and rendering canvas must adhere to the following layout constraints:

1. **Section Stacking Principle (Zero Absolute Dragging):**
   - The editor is strictly a **Section Stacking** engine (vertical stack).
   - Drag-and-drop handles vertical reordering only (powered by `@dnd-kit/core` and `@dnd-kit/sortable`).
   - Absolute coordinate dragging (`top`/`left` pixel positioning) is prohibited to guarantee 100% mobile responsiveness.
2. **Canvas Viewport Mockup:**
   - The canvas area surrounding the mobile frame uses `bg-background`.
   - The phone/tablet frame chassis uses `bg-surface` with subtle borders (`border-border`) and shadows.
   - When a section is selected, its bounding wrapper in `canvas-section-wrapper.tsx` must display a `ring-2 ring-primary` highlight.
3. **Registry Pattern (`src/modules/invitation-sections/registry.ts`):**
   - All section templates must be resolved through a type-safe registry mapping `(type, variant) -> React.ComponentType<SectionProps>`.
   - Adding a new layout variant requires registering it in `registry.ts` with explicit prop typings.
4. **Client-Side Image Optimization:**
   - All user-uploaded media must be compressed on the client via `src/lib/image-compressor.ts` into `.webp` format (maximum dimensions 1920px, maximum file size 400KB) before requesting presigned upload URLs.

---

## 6. Non-Negotiable Platform Guardrails

Every frontend file created or refactored must satisfy:

1. **Absolute Prohibition of `any`:**
   - All component props, theme objects, and state slices must be strictly typed (e.g. `SectionNode`, `ThemeConfig`, `ApiResponse<T>`).
2. **Mandatory `data-testid` Attributes:**
   - Every interactive control, modal, form input, button, and canvas container must include semantic `data-testid="[module]-[element]-[role]"` attributes:
     - Example: `data-testid="editor-topbar-save-badge"`
     - Example: `data-testid="sidebar-add-section-btn"`
     - Example: `data-testid="inspector-layout-picker"`
3. **Strict Separation of Network and Presentation:**
   - UI components and custom hooks are strictly forbidden from making raw `axios` or `fetch` calls directly.
   - All requests must go through domain API files in `src/services/api/` (e.g., `invitationsApi`, `mediaApi`, `billingApi`, `publicApi`, `authApi`).
4. **Touch & Mobile Ergonomics:**
   - Tap targets for editor controls must have a minimum interactive dimension of 36px–40px.
   - Form inputs inside inspector panels must have accessible labels paired via `htmlFor`/`id` or Radix `Label`.
