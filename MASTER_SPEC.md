# MASTER ARCHITECTURE SPECIFICATION: The Architecture of Reality
**Free Reading Room · 12-Question Diagnostic · Sovereign Academy LMS · Enterprise Consultancy Portal**

## 1. Ecosystem Architecture ($0.00 Fixed Overhead Rollout)
**The Architecture of Reality** operates on a self-funding, four-pillar flywheel:
1. **The Free Reading Room (`/library`):** 100% free access (in-browser reading + direct PDF downloads) to the **Foundation Volume** (*The Architecture of Reality*) and the **Trilogy** (*Book I: The Master Blueprint*, *Book II: The Genesis Lens*, *Book III: The Covenant*).
2. **The 12-Question Energy Audit (`/audit`):** Evaluates 4 questions across 3 sectors (**Mind, Body, Soul**), identifies **Forcing vs. Passive** drift, delivers an immediate **72-Hour Calibration Directive**, and routes the user to either the Academy (individual calibration) or the Consultancy Application (enterprise systems).
3. **The Consultancy Vetting Funnel & Client Portal (`/meet` & `/portal`):**
   - `/meet`: A multi-step Vetting Application filtering business owners by mission alignment (health, truth, community purpose over extraction), current weekly hours vs. the **80-Hour Work Month** standard, and operational friction. Qualified applicants unlock an embedded **Cal.com** scheduler.
   - `/portal`: A private command center for signed consulting clients showing their 80-Hour Work Month gauge, System Health Score, Milestones, and Architecture Blueprints.
4. **The Sovereign Academy LMS & Paywall (`/academy`, `/offers`, `/checkout`):**
   - Multi-modal courses featuring Video embeds, Audio players, Markdown lessons, downloadable Blueprints, and **Interactive In-Browser Workbooks** saved to Supabase.
   - Supports **Individual Course Purchases**, **Trilogy Course Bundles**, and an **All-Access Sovereign Membership** via Stripe Checkout (plus a Local Dev Bypass toggle for $0 testing).

---

## 2. Supabase PostgreSQL Schema (`supabase/schema.sql`)

### 2.1 `profiles` (Identity & Access Control)
- `id`: `uuid` (PK, references `auth.users.id` ON DELETE CASCADE)
- `email`: `text` (Unique, Not Null)
- `full_name`: `text`
- `role`: `text` (default `'member'`, check in `('member', 'client', 'admin')`)
- `has_all_access`: `boolean` (default `false` — true for active All-Access Membership)
- `stripe_customer_id`: `text` (Unique, Nullable)
- `stripe_subscription_status`: `text` (Nullable: `'active'`, `'past_due'`, `'canceled'`)
- `created_at`: `timestamptz` (default `now()`)

### 2.2 `volumes` & `chapters` (100% Free Reading Room)
- **`volumes`**:
  - `id`: `uuid` (PK, default `gen_random_uuid()`)
  - `slug`: `text` (Unique: `'the-architecture-of-reality'`, `'the-master-blueprint'`, `'the-genesis-lens'`, `'the-covenant'`)
  - `volume_label`: `text` (`'FOUNDATION VOLUME'`, `'BOOK I'`, `'BOOK II'`, `'BOOK III'`)
  - `title`: `text` (Not Null)
  - `subtitle`: `text`
  - `description`: `text`
  - `pdf_url`: `text` (Public PDF path)
  - `sort_order`: `int` (Not Null)
- **`chapters`**:
  - `id`: `uuid` (PK, default `gen_random_uuid()`)
  - `volume_id`: `uuid` (FK -> `volumes.id` ON DELETE CASCADE)
  - `chapter_number`: `int` (Not Null)
  - `slug`: `text` (Not Null)
  - `title`: `text` (Not Null)
  - `content_md`: `text` (Not Null)
  - `principle_number`: `int` (1–7 mapping to Mentalism, Correspondence, Vibration, Polarity, Rhythm, Cause & Effect, Generation)
  - `estimated_read_mins`: `int` (default `10`)

### 2.3 `audit_submissions` (12-Question Energy Audit)
- `id`: `uuid` (PK, default `gen_random_uuid()`)
- `user_id`: `uuid` (Nullable FK -> `profiles.id` ON DELETE SET NULL)
- `email`: `text` (Nullable)
- `mind_score`: `int` (Not Null, 4–20 scale)
- `body_score`: `int` (Not Null, 4–20 scale)
- `soul_score`: `int` (Not Null, 4–20 scale)
- `drift_tendency`: `text` (`'forcing'`, `'passive'`, `'centered'`)
- `weakest_sector`: `text` (`'mind'`, `'body'`, `'soul'`)
- `raw_answers`: `jsonb` (Not Null)
- `directive_slug`: `text` (Assigned 72-Hour Calibration Directive)
- `recommended_path`: `text` (`'academy_blueprint'`, `'academy_genesis'`, `'academy_covenant'`, `'consultancy_application'`)
- `created_at`: `timestamptz` (default `now()`)

### 2.4 `courses`, `modules`, `lessons`, `user_enrollments`, `workbook_submissions` (Sovereign Academy LMS)
- **`courses`**:
  - `id`: `uuid` (PK, default `gen_random_uuid()`)
  - `slug`: `text` (Unique)
  - `title`: `text` (Not Null)
  - `subtitle`: `text`
  - `description`: `text`
  - `book_alignment`: `text` (`'foundation'`, `'book_1'`, `'book_2'`, `'book_3'`)
  - `price_cents`: `int` (Not Null)
  - `stripe_price_id`: `text` (Nullable)
  - `is_published`: `boolean` (default `true`)
- **`modules`**:
  - `id`: `uuid` (PK, default `gen_random_uuid()`)
  - `course_id`: `uuid` (FK -> `courses.id` ON DELETE CASCADE)
  - `title`: `text` (Not Null)
  - `sort_order`: `int` (Not Null)
- **`lessons`**:
  - `id`: `uuid` (PK, default `gen_random_uuid()`)
  - `module_id`: `uuid` (FK -> `modules.id` ON DELETE CASCADE)
  - `slug`: `text` (Not Null)
  - `title`: `text` (Not Null)
  - `sort_order`: `int` (Not Null)
  - `is_free_preview`: `boolean` (default `false`)
  - `video_embed_url`: `text` (Nullable — Unlisted YouTube / Stream URL)
  - `audio_url`: `text` (Nullable — Audio lecture URL)
  - `content_md`: `text` (Not Null)
  - `download_attachments`: `jsonb` (Array of `{title, file_url, type}`)
  - `workbook_schema`: `jsonb` (Array of `{id, label, placeholder, type: 'textarea' | 'select' | 'number'}`)
- **`user_enrollments`**:
  - `id`: `uuid` (PK, default `gen_random_uuid()`)
  - `user_id`: `uuid` (FK -> `profiles.id` ON DELETE CASCADE)
  - `course_id`: `uuid` (FK -> `courses.id` ON DELETE CASCADE)
  - `unlocked_via`: `text` (`'single_purchase'`, `'bundle'`, `'dev_bypass'`, `'admin_grant'`)
  - `created_at`: `timestamptz` (default `now()`)
- **`workbook_submissions`**:
  - `id`: `uuid` (PK, default `gen_random_uuid()`)
  - `user_id`: `uuid` (FK -> `profiles.id` ON DELETE CASCADE)
  - `lesson_id`: `uuid` (FK -> `lessons.id` ON DELETE CASCADE)
  - `responses`: `jsonb` (Key-value map of user workbook answers)
  - `is_completed`: `boolean` (default `false`)
  - `updated_at`: `timestamptz` (default `now()`)

### 2.5 `consultancy_applications`, `client_projects`, `client_milestones` (B2B Consultancy & Portal)
- **`consultancy_applications`**:
  - `id`: `uuid` (PK, default `gen_random_uuid()`)
  - `user_id`: `uuid` (Nullable FK -> `profiles.id`)
  - `full_name`: `text` (Not Null)
  - `email`: `text` (Not Null)
  - `company_name`: `text` (Not Null)
  - `business_sector`: `text` (`'ecommerce'`, `'local_enterprise'`, `'service_agency'`, `'other'`)
  - `current_weekly_hours`: `int` (Compared against 20-hr/week / 80-hr/month target)
  - `mission_alignment`: `text` (How the business prioritizes health, truth, and community purpose)
  - `primary_bottleneck`: `text`
  - `qualification_status`: `text` (default `'qualified'`, enum: `'qualified'`, `'nurture'`, `'declined'`)
  - `created_at`: `timestamptz` (default `now()`)
- **`client_projects`**:
  - `id`: `uuid` (PK, default `gen_random_uuid()`)
  - `client_user_id`: `uuid` (FK -> `profiles.id` ON DELETE CASCADE)
  - `project_name`: `text` (Not Null)
  - `target_monthly_hours`: `int` (default `80`)
  - `current_monthly_hours`: `int`
  - `system_health_score`: `int` (0–100)
  - `architecture_summary_md`: `text`
  - `shared_links`: `jsonb`
  - `updated_at`: `timestamptz` (default `now()`)
- **`client_milestones`**:
  - `id`: `uuid` (PK, default `gen_random_uuid()`)
  - `project_id`: `uuid` (FK -> `client_projects.id` ON DELETE CASCADE)
  - `phase_number`: `int` (Not Null)
  - `title`: `text` (Not Null)
  - `deliverables_md`: `text`
  - `status`: `text` (`'upcoming'`, `'in_progress'`, `'completed'`)
  - `due_date`: `date`

---

## 3. Sequential Implementation Phases

### PHASE 1: Database Foundation, Free Reading Room & 12-Question Energy Audit
1. Create `supabase/schema.sql` (with RLS policies) and `supabase/seed.sql` (seeding the 4 Free Volumes, initial chapters, and 3 flagship courses aligned with Books I–III).
2. Add typed Supabase client/server helpers in `lib/supabase/` with a graceful static data fallback so the app runs cleanly even before `.env.local` keys are added.
3. Build/wire the **12-Question Energy Audit** (`/audit`) across Mind, Body, and Soul, calculating Forcing vs. Passive drift and generating the tailored **72-Hour Calibration Directive** with automatic routing to either the Academy or Consultancy.
4. Wire the **Reading Room** (`/library` and `/library/[volumeSlug]/[chapterSlug]`) with free chapter reading and PDF downloads.

### PHASE 2: Consultancy Vetting Funnel (`/meet`) & Client Command Center (`/portal`)
1. Build the interactive **Consultancy Vetting Application** on `/meet` that evaluates business alignment and weekly hours, unlocking a Cal.com booking embed upon qualification.
2. Build the protected **Client Command Center** (`/portal`) displaying the 80-Hour Work Month progress meter, System Health Score, Milestones, and Architecture Blueprints.
3. Build `/admin` overview to inspect applications and manage client roadmaps.

### PHASE 3: Sovereign Academy LMS & Interactive Workbooks (`/academy`)
1. Build `/academy` course catalog & student progress dashboard.
2. Build `/academy/[courseSlug]/[lessonSlug]` featuring Video Embed, Audio Player, Markdown Lesson, Downloadable Blueprints, and the **Interactive In-Browser Workbook** that saves user answers to `workbook_submissions`.

### PHASE 4: Sovereign Checkout & All-Access Membership (`/offers` & `/checkout`)
1. Wire `/offers` and `/checkout` to support Individual Courses, Trilogy Course Bundles, and the All-Access Sovereign Membership.
2. Add Stripe Checkout session creation + `/api/webhooks/stripe`, paired with a **Zero-Cost Local Dev Bypass** button so enrollments and memberships can be tested 100% free prior to live Stripe activation.