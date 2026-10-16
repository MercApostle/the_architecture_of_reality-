# The Architecture of Reality — Action Roadmap & To-Do List
*Last Updated: 2026-10-16 | Repository Snapshot: `backup-20261016-0942`*

---

## 🛡️ Repository & Backup Snapshot
- [x] **Local Archive Backup:** Created `.zip` archive in `../Backups/website_backup_2026-10-16_094220.zip` (489 files, 3.79 MB).
- [x] **Git Snapshot Tag:** Tagged local commit `backup-20261016-0942`.
- [x] **Remote Push:** Working tree clean and synced with `origin/main` (`github.com:MercApostle/the_architecture_of_reality-`).
- [x] **TypeScript & Linter Verification:** Zero type errors (`npx tsc --noEmit` passed) & zero linter errors (`npm run lint` passed).
- [x] **Dev Server Running:** Next.js dev server active at [http://localhost:3000](http://localhost:3000).

---

## 📋 Comprehensive To-Do List & Next Priorities

### 1. Free Reading Room (`/library`)
- [ ] **Full Manuscript Chapter Expansion:**
  - [ ] Review raw text files in `content/books/` and expand chapters beyond initial sample/excerpts for all 4 volumes:
    - *The Architecture of Reality* (Foundation Volume)
    - *Book I: The Master Blueprint*
    - *Book II: The Genesis Lens*
    - *Book III: The Covenant*
  - [ ] Add chapter navigation drawer/sidebar for seamless reading progression.
- [ ] **Reading Room Reader UX:**
  - [ ] Font size selector and serif / sans-serif reading comfort toggle.
  - [ ] Estimated reading time and progress bar per chapter.
  - [ ] Direct PDF download button verification for each volume (`/api/download/[filename]`).

---

### 2. The 12-Question Energy Audit (`/audit`)
- [ ] **Email Delivery of Directives:**
  - [ ] Wire Resend integration on `/audit/result` to automatically dispatch the personalized **72-Hour Calibration Directive** PDF / HTML summary to the user's inbox.
- [ ] **Historical Audit Tracking:**
  - [ ] Save multiple audit attempts per member so users can view their Forcing vs. Passive drift shift over 30 / 60 / 90 days in their Member Portal.
- [ ] **Dynamic Social Share:**
  - [ ] Generate dynamic OpenGraph summary cards (Mind / Body / Soul scores and archetype) for sharing results on X / LinkedIn.

---

### 3. Consultancy Vetting Funnel (`/meet`) & Client Command Center (`/portal`)
- [ ] **Vetting Funnel Notifications:**
  - [ ] Add instant notification alert to `jeremyashe@gmail.com` via Resend whenever a business owner submits the `/meet` application.
- [ ] **Cal.com Confirmation & Prep:**
  - [ ] Verify Cal.com booking confirmation flow and redirect back to client intake instructions.
- [ ] **Client Portal Enhancements (`/portal`):**
  - [ ] Interactive 80-Hour Work Month timesheet / hour logging widget.
  - [ ] Milestone deliverable sign-off and feedback submission inside the portal.
  - [ ] Client document vault for proprietary system architecture diagrams and SOPs.
- [ ] **Admin Command Dashboard (`/admin`):**
  - [ ] Quick-action buttons to approve consultancy applicants, update milestone statuses, and adjust client health scores directly from the UI.

---

### 4. Sovereign Academy LMS & Interactive Workbooks (`/academy`)
- [ ] **Curriculum Media Integration:**
  - [ ] Replace placeholder video embeds with Jeremy's unlisted YouTube / Vimeo / Cloudflare Stream video masterclasses.
  - [ ] Upload audio lecture recordings and link audio player controls.
- [ ] **Interactive Workbook Enhancements:**
  - [ ] Add "Export to PDF" / "Print Calibration Sheet" button for completed user workbooks.
  - [ ] Auto-save indicator ("Draft saved to vessel profile") while users type responses.
- [ ] **Course Progression & Completion:**
  - [ ] Mark lesson complete button with automatic advancement to the next module.
  - [ ] Certificate / Completion badge awarded upon finishing each book's companion course.

---

### 5. Sovereign Checkout & All-Access Membership (`/offers` & `/checkout`)
- [ ] **Live Stripe Activation (When Ready):**
  - [ ] Obtain live Stripe keys from Stripe Dashboard:
    - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
    - `STRIPE_SECRET_KEY`
    - `STRIPE_WEBHOOK_SECRET`
  - [ ] Create live recurring subscription price for Sovereign Membership ($50 CAD / mo) and one-time product prices.
  - [ ] Test live checkout webhook (`/api/webhooks/stripe`) to grant `has_all_access` in production.
- [ ] **Keep Zero-Cost Local Dev Bypass:**
  - [ ] Retain the local dev toggle so local development and offline testing never require card payments.

---

### 6. Supabase PostgreSQL Production Setup
- [ ] **Live Database Provisioning:**
  - [ ] Create free Supabase project at [supabase.com](https://supabase.com).
  - [ ] Run `supabase/schema.sql` in Supabase SQL Editor.
  - [ ] Run `supabase/seed.sql` to populate baseline volumes, chapters, and flagship courses.
  - [ ] Copy Project URL and Anon Key into `.env.local`:
    - `NEXT_PUBLIC_SUPABASE_URL`
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
    - `SUPABASE_SERVICE_ROLE_KEY` (server-side only)
- [ ] **Verify Authentication & RLS:**
  - [ ] Test sign-up / login flow with email confirmation.
  - [ ] Confirm Row Level Security ensures users can only read/write their own workbook submissions and audit logs.

---

### 7. Brand, Design & Technical Polish
- [ ] **Typography & Glyphs:**
  - [ ] Verify Hebrew root glyphs and transliteration tooltips in `/news` dispatches and library chapters.
- [ ] **Favicon & Brand Assets:**
  - [ ] Replace default Vercel/Next SVGs with custom gold sacred geometry icon / seal for *The Architecture of Reality*.
- [ ] **SEO & Metadata:**
  - [ ] Add `sitemap.ts` and `robots.ts` for clean search engine indexing.
  - [ ] Ensure unique Twitter Cards and OpenGraph image previews across all major routes (`/`, `/library`, `/audit`, `/academy`, `/meet`, `/offers`).
- [ ] **Mobile & Cross-Device Responsiveness:**
  - [ ] Test all pages, drawers, navigation menus, and audit forms on mobile viewports (iOS Safari & Chrome).

---

## 🎯 Suggested Next Immediate Step
Pick one of the following to begin:
1. **Manuscript & Reading Room Expansion:** Expand full chapters in `content/books/` or `src/lib/data/books.ts`.
2. **Audit Email Automation:** Wire Resend to automatically email the 72-Hour Calibration Directive upon audit completion.
3. **Supabase Cloud Setup:** Connect live Supabase database keys so user profiles and workbook entries persist to cloud PostgreSQL.
