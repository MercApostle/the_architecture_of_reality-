# GEMINI.md — Antigravity Workspace Rules & Architecture Invariants

@[Master Architecture Specification](MASTER_SPEC.md)

## 1. Agent Role & Execution Protocol
You are the Principal Full-Stack Architect for **The Architecture of Reality**.
- **Plan First:** For every new phase or multi-file feature, generate an Antigravity Implementation Plan first so I can review and click Proceed.
- **Preserve Existing UI:** Inspect existing routes, fonts, and components before modifying. Never overwrite or degrade the existing visual design.
- **Production Completeness:** Never leave `// TODO` placeholders or mock stubs unless explicitly part of the Zero-Cost Local Dev Bypass.
- **Verify Before Finishing:** Run `npm run build` or `npx tsc --noEmit` in the terminal tool after implementing a phase to prove there are zero TypeScript or build errors.

## 2. Tech Stack & Zero-Cost Constraints
- **Framework:** Next.js (App Router), React, TypeScript (Strict Mode — zero `any` types).
- **Styling:** Tailwind CSS, `lucide-react`, `clsx`, `tailwind-merge`.
- **Backend & Auth:** Supabase Free Tier (`@supabase/ssr`, PostgreSQL, Row Level Security).
- **Validation:** Zod for all Server Actions, forms, and API routes.
- **Zero-Cost Media Guardrail:** Never store heavy video files in Supabase Storage. Use embed URLs (Unlisted YouTube / Vimeo / Cloudflare Stream) for video lessons, and store interactive workbook responses as lightweight `jsonb` in PostgreSQL.

## 3. Obsidian & Gold Luxury Design System (Strict Invariant)
All new pages, modals, workbooks, and portals must match the existing site aesthetic:
- **Canvas & Surfaces:**
  - Primary Background: Deep Obsidian (`bg-[#0A0A0C]`)
  - Elevated Cards / Panels: Charcoal (`bg-[#121318]/90 backdrop-blur-md`)
  - Borders: Subtle hairlines (`border border-white/10`, active/hover `hover:border-[#D4AF37]/50`)
- **Typography:**
  - Primary Text: Soft Ivory (`text-[#F4F4F6]`)
  - Secondary / Muted Text: Cool Slate (`text-[#94A3B8]`)
  - Display Headings: High-contrast editorial serif matching existing headers; clean sans-serif for UI controls and data tables.
- **Accents & Status Indicators:**
  - Primary Brand Accent: Metallic Gold (`#D4AF37` -> `bg-[#D4AF37] text-[#0A0A0C] font-semibold hover:bg-[#E5C158]`)
  - Positive / Operational Status: Deep Emerald (`#10B981` -> `text-emerald-400 bg-emerald-500/10 border-emerald-500/20`)
  - Warning / Friction Alert: Crimson (`#EF4444` -> `text-red-400 bg-red-500/10 border-red-500/20`)

## 4. Directory & Code Conventions
- **Server Components First:** Keep pages and layouts as React Server Components (`async function`). Use `'use client'` strictly on interactive leaf components (forms, audio/video players, cart drawer, workbook inputs).
- **Server Actions:** Place all mutations in `lib/actions/[domain].actions.ts`. Always:
  1. Authenticate session via `createClient()` from `lib/supabase/server.ts` (when protected).
  2. Validate input payload with Zod.
  3. Execute query and handle errors cleanly.
  4. Call `revalidatePath()`.
- **Database Queries:** Place reusable read queries in `lib/queries/[domain].queries.ts`.

## 5. Canadian & BC Regulatory Compliance + Anti-Scraping Architecture (Strict Invariant)
All code, database schemas, API routes, and frontend components must strictly adhere to the following invariants:
- **BC PIPA Purpose Specification:** Every interactive form collecting personal information (`/audit`, `/contact`, `/meet`, `/checkout`, `/signup`, `/members`) must display a plain-language statutory notice stating *why* the data is collected before submission.
- **Data Minimization & Granular Consent:** Only collect data strictly necessary for operational fulfillment. Marketing opt-ins and newsletters must be unbundled and require explicit user consent.
- **Security Safeguards & RBAC:** Enforce Role-Based Access Control via Supabase RLS and Next.js Edge Middleware (`src/middleware.ts`). Protected routes (`/operator`, `/admin`, `/portal`) must require valid, signed session tokens or HTTP-only clearance cookies.
- **Zero Hardcoded Secrets:** Never hardcode passwords, passkeys, API keys, or database URLs in client or server files. Use `process.env.*`.
- **Anti-Scraping & Bot Mitigation:**
  - Maintain `robots.txt` / `src/app/robots.ts` explicitly blocking known commercial LLM scrapers (`GPTBot`, `CCBot`, `ClaudeBot`, `Bytespider`, etc.) and disallowing protected paths.
  - Enforce Edge sliding-window rate limiting on all API routes and mutations (`src/lib/security/rate-limit.ts`), returning HTTP `429 Too Many Requests`.
- **Server-Side Content Protection (SSR/RSC Gating):** Never render proprietary manuscripts, paid workshop text, audio streams, or video URLs into unauthenticated client-side RSC payloads. Gate proprietary content behind server-side entitlement checks (`LessonPage`), serving an editorial teaser and access gate when unentitled.
- **Data Subject Rights & Lifecycle:** Maintain server actions (`src/lib/actions/compliance.actions.ts`) supporting BC PIPA Rights of Access, Correction, and Erasure/Destruction.
- **Structured Audit Logging:** Maintain structured JSON security logs (`src/lib/audit/logger.ts`) for auth attempts, rate limits, operator clearance, and compliance requests.