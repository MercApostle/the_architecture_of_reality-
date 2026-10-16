-- ==============================================================================
-- The Architecture of Reality — Master Database Schema
-- Supabase PostgreSQL Engine (PostgreSQL 15+)
-- Row Level Security (RLS) enabled on all tables
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. PROFILES (Identity, Roles & All-Access Membership)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('member', 'client', 'admin')),
  has_all_access BOOLEAN NOT NULL DEFAULT false,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_status TEXT CHECK (stripe_subscription_status IN ('active', 'past_due', 'canceled', 'trialing')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger to automatically create profile on auth.users insert
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'member')
  )
  ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ------------------------------------------------------------------------------
-- 2. VOLUMES & CHAPTERS (100% Free Reading Room)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.volumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  volume_label TEXT NOT NULL, -- 'FOUNDATION VOLUME', 'BOOK I', 'BOOK II', 'BOOK III'
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  pdf_url TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  volume_id UUID NOT NULL REFERENCES public.volumes(id) ON DELETE CASCADE,
  chapter_number INT NOT NULL,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  content_md TEXT NOT NULL,
  principle_number INT CHECK (principle_number BETWEEN 1 AND 7), -- 1: Mentalism .. 7: Generation
  estimated_read_mins INT NOT NULL DEFAULT 10,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (volume_id, slug),
  UNIQUE (volume_id, chapter_number)
);

-- ------------------------------------------------------------------------------
-- 3. AUDIT SUBMISSIONS (12-Question Energy Audit Diagnostics)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  email TEXT,
  mind_score INT NOT NULL, -- -8 to +8 (or 4-20 scale)
  body_score INT NOT NULL,
  soul_score INT NOT NULL,
  drift_tendency TEXT NOT NULL CHECK (drift_tendency IN ('forcing', 'passive', 'centered')),
  weakest_sector TEXT NOT NULL CHECK (weakest_sector IN ('mind', 'body', 'soul')),
  raw_answers JSONB NOT NULL DEFAULT '{}'::jsonb,
  directive_slug TEXT,
  recommended_path TEXT CHECK (recommended_path IN (
    'academy_blueprint',
    'academy_genesis',
    'academy_covenant',
    'consultancy_application'
  )),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- 4. SOVEREIGN ACADEMY LMS (Courses, Modules, Lessons, Enrollments & Workbooks)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  book_alignment TEXT NOT NULL CHECK (book_alignment IN ('foundation', 'book_1', 'book_2', 'book_3')),
  price_cents INT NOT NULL DEFAULT 0,
  stripe_price_id TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  sort_order INT NOT NULL DEFAULT 0,
  is_free_preview BOOLEAN NOT NULL DEFAULT false,
  video_embed_url TEXT,
  audio_url TEXT,
  content_md TEXT NOT NULL,
  download_attachments JSONB NOT NULL DEFAULT '[]'::jsonb,
  workbook_schema JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (module_id, slug)
);

CREATE TABLE IF NOT EXISTS public.user_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  unlocked_via TEXT NOT NULL DEFAULT 'single_purchase' CHECK (unlocked_via IN ('single_purchase', 'bundle', 'dev_bypass', 'admin_grant', 'all_access')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, course_id)
);

CREATE TABLE IF NOT EXISTS public.workbook_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  responses JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, lesson_id)
);

-- ------------------------------------------------------------------------------
-- 5. B2B CONSULTANCY FUNNEL & COMMAND CENTER PORTAL
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.consultancy_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  company_name TEXT NOT NULL,
  business_sector TEXT NOT NULL CHECK (business_sector IN ('ecommerce', 'local_enterprise', 'service_agency', 'other')),
  current_weekly_hours INT NOT NULL,
  mission_alignment TEXT NOT NULL,
  primary_bottleneck TEXT NOT NULL,
  qualification_status TEXT NOT NULL DEFAULT 'qualified' CHECK (qualification_status IN ('qualified', 'nurture', 'declined')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.client_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  project_name TEXT NOT NULL,
  target_monthly_hours INT NOT NULL DEFAULT 80,
  current_monthly_hours INT NOT NULL DEFAULT 160,
  system_health_score INT NOT NULL DEFAULT 50 CHECK (system_health_score BETWEEN 0 AND 100),
  architecture_summary_md TEXT,
  shared_links JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.client_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.client_projects(id) ON DELETE CASCADE,
  phase_number INT NOT NULL,
  title TEXT NOT NULL,
  deliverables_md TEXT,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'in_progress', 'completed')),
  due_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ------------------------------------------------------------------------------
-- 6. INDEXES FOR PERFORMANCE
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_chapters_volume_order ON public.chapters(volume_id, chapter_number);
CREATE INDEX IF NOT EXISTS idx_audit_created ON public.audit_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_user ON public.audit_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_modules_course_order ON public.modules(course_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_lessons_module_order ON public.lessons(module_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_enrollments_user ON public.user_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_workbook_user_lesson ON public.workbook_submissions(user_id, lesson_id);
CREATE INDEX IF NOT EXISTS idx_client_projects_user ON public.client_projects(client_user_id);
CREATE INDEX IF NOT EXISTS idx_milestones_project ON public.client_milestones(project_id, phase_number);

-- ------------------------------------------------------------------------------
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------

-- Helper functions for checking role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.volumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workbook_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consultancy_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_milestones ENABLE ROW LEVEL SECURITY;

-- 7.1 PROFILES POLICIES
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 7.2 VOLUMES & CHAPTERS POLICIES (100% Free Public Access)
CREATE POLICY "Public read access for volumes"
  ON public.volumes FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public read access for chapters"
  ON public.chapters FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Admin write access for volumes"
  ON public.volumes FOR ALL
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admin write access for chapters"
  ON public.chapters FOR ALL
  TO authenticated
  USING (public.is_admin());

-- 7.3 AUDIT SUBMISSIONS POLICIES
CREATE POLICY "Anyone can create audit submission"
  ON public.audit_submissions FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users view own audits or admin views all"
  ON public.audit_submissions FOR SELECT
  USING (
    (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
    public.is_admin()
  );

-- 7.4 COURSES, MODULES, LESSONS POLICIES
CREATE POLICY "Public can view published courses"
  ON public.courses FOR SELECT
  TO public
  USING (is_published = true OR public.is_admin());

CREATE POLICY "Public can view modules of published courses"
  ON public.modules FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can view preview lessons or enrolled users view all"
  ON public.lessons FOR SELECT
  TO public
  USING (
    is_free_preview = true OR
    public.is_admin() OR
    EXISTS (
      SELECT 1 FROM public.user_enrollments ue
      JOIN public.modules m ON m.id = lessons.module_id
      WHERE ue.user_id = auth.uid() AND ue.course_id = m.course_id
    ) OR
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.has_all_access = true
    )
  );

-- 7.5 ENROLLMENTS & WORKBOOK POLICIES
CREATE POLICY "Users view own enrollments"
  ON public.user_enrollments FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Users view and edit own workbook submissions"
  ON public.workbook_submissions FOR ALL
  TO authenticated
  USING (user_id = auth.uid() OR public.is_admin())
  WITH CHECK (user_id = auth.uid() OR public.is_admin());

-- 7.6 CONSULTANCY POLICIES
CREATE POLICY "Anyone can submit consultancy application"
  ON public.consultancy_applications FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Users view own application or admin views all"
  ON public.consultancy_applications FOR SELECT
  USING (
    (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
    public.is_admin()
  );

CREATE POLICY "Clients view own projects"
  ON public.client_projects FOR SELECT
  TO authenticated
  USING (client_user_id = auth.uid() OR public.is_admin());

CREATE POLICY "Clients view milestones for their projects"
  ON public.client_milestones FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.client_projects cp
      WHERE cp.id = client_milestones.project_id AND cp.client_user_id = auth.uid()
    ) OR public.is_admin()
  );
