-- ============================================================================
-- The Architecture of Reality — Master Database Schema (v2.0)
-- 7 Core Ecosystem Tables, Atomic Gamification RPC, and Strict RLS Policies
-- ============================================================================

-- Ensure pgcrypto extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ----------------------------------------------------------------------------
-- 1. ENUMS
-- ----------------------------------------------------------------------------
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('member', 'operator');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE membership_tier AS ENUM ('free', 'sovereign_50');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE quest_category AS ENUM (
    'ACCOUNT',
    'DISPATCH',
    'ASSESSMENT',
    'ACADEMY',
    'MEMBERSHIP',
    'ADVISORY'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE qualification_status AS ENUM ('qualified', 'nurture', 'declined');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE milestone_status AS ENUM ('upcoming', 'in_progress', 'completed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ----------------------------------------------------------------------------
-- 2. CORE TABLES
-- ----------------------------------------------------------------------------

-- PROFILES (Users, Members & Operators)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_handle TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  role user_role DEFAULT 'member',
  tier membership_tier DEFAULT 'free',
  total_points INT DEFAULT 50,
  video_calls_total INT DEFAULT 0,
  video_calls_remaining INT DEFAULT 0,
  operator_notes TEXT,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  last_active_at TIMESTAMPTZ DEFAULT NOW()
);

-- QUESTS & USER_QUESTS (Gamification Engine)
CREATE TABLE IF NOT EXISTS quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category quest_category NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  points_reward INT NOT NULL DEFAULT 25,
  target_url TEXT NOT NULL,
  reference_slug TEXT,
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS user_quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  quest_id UUID REFERENCES quests(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, quest_id)
);

-- LIBRARY VOLUMES & CHAPTERS (Free Reading Room)
CREATE TABLE IF NOT EXISTS library_volumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  tab_label TEXT NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  synopsis TEXT,
  blockquote TEXT,
  cover_image_url TEXT,
  pdf_url TEXT,
  file_size_label TEXT DEFAULT '123 KB',
  sort_order INT DEFAULT 0,
  is_published BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS volume_chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  volume_id UUID REFERENCES library_volumes(id) ON DELETE CASCADE,
  chapter_number INT NOT NULL,
  roman_numeral TEXT,
  title TEXT NOT NULL,
  content_markdown TEXT NOT NULL,
  sort_order INT DEFAULT 0
);

-- ACADEMY MODULES & USER MODULE PROGRESS (Sovereign Academy LMS)
CREATE TABLE IF NOT EXISTS academy_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_number INT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  duration_minutes INT DEFAULT 48,
  video_url TEXT,
  worksheet_pdf_url TEXT,
  points_reward INT DEFAULT 50,
  is_published BOOLEAN DEFAULT true
);

CREATE TABLE IF NOT EXISTS user_module_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  module_id UUID REFERENCES academy_modules(id) ON DELETE CASCADE,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, module_id)
);

-- DISPATCHES (Newsroom & Inner Circle)
CREATE TABLE IF NOT EXISTS dispatches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  excerpt TEXT,
  content_markdown TEXT NOT NULL,
  cover_image_url TEXT,
  is_inner_circle_only BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  is_published BOOLEAN DEFAULT true
);

-- VIDEO CALL LOGS (Cal.com Booking Integration)
CREATE TABLE IF NOT EXISTS video_call_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  cal_booking_uid TEXT UNIQUE,
  scheduled_for TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'scheduled',
  session_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ACTIVITY LOGS (Operator Radar)
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 3. EXISTING PILLAR PRESERVATION (Audit & Consultancy)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS audit_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  email TEXT,
  mind_score INT NOT NULL,
  body_score INT NOT NULL,
  soul_score INT NOT NULL,
  drift_tendency TEXT NOT NULL,
  weakest_sector TEXT NOT NULL,
  raw_answers JSONB NOT NULL,
  directive_slug TEXT,
  recommended_path TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS consultancy_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  company_name TEXT NOT NULL,
  business_sector TEXT NOT NULL,
  current_weekly_hours INT NOT NULL,
  mission_alignment TEXT NOT NULL,
  primary_bottleneck TEXT NOT NULL,
  qualification_status qualification_status DEFAULT 'qualified',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS client_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  project_name TEXT NOT NULL,
  target_monthly_hours INT DEFAULT 80,
  current_monthly_hours INT DEFAULT 120,
  system_health_score INT DEFAULT 65,
  architecture_summary_md TEXT,
  shared_links JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS client_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES client_projects(id) ON DELETE CASCADE,
  phase_number INT NOT NULL,
  title TEXT NOT NULL,
  deliverables_md TEXT,
  status milestone_status DEFAULT 'upcoming',
  due_date DATE
);

-- ----------------------------------------------------------------------------
-- 4. SECURE ATOMIC RPC FUNCTION
-- ----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION award_quest_points(
  p_user_id UUID,
  p_quest_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_points INT;
  v_title TEXT;
  v_already_completed BOOLEAN;
  v_new_total INT;
BEGIN
  -- Check if quest exists and is active
  SELECT points_reward, title INTO v_points, v_title
  FROM quests
  WHERE id = p_quest_id AND is_active = true;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Quest not found or inactive');
  END IF;

  -- Check if already completed
  SELECT EXISTS(
    SELECT 1 FROM user_quests WHERE user_id = p_user_id AND quest_id = p_quest_id
  ) INTO v_already_completed;

  IF v_already_completed THEN
    RETURN jsonb_build_object('success', false, 'already_completed', true, 'message', 'Quest already completed');
  END IF;

  -- Insert user quest record
  INSERT INTO user_quests (user_id, quest_id, completed_at)
  VALUES (p_user_id, p_quest_id, NOW());

  -- Atomically increment user points (capped at MAX 10,000)
  UPDATE profiles
  SET total_points = LEAST(total_points + v_points, 10000),
      last_active_at = NOW()
  WHERE id = p_user_id
  RETURNING total_points INTO v_new_total;

  -- Record activity log for operator radar
  INSERT INTO activity_logs (user_id, action_type, metadata)
  VALUES (
    p_user_id,
    'quest_completed',
    jsonb_build_object('quest_id', p_quest_id, 'title', v_title, 'points_awarded', v_points, 'total_points', v_new_total)
  );

  RETURN jsonb_build_object(
    'success', true,
    'points_awarded', v_points,
    'total_points', v_new_total,
    'quest_title', v_title
  );
END;
$$;

-- ----------------------------------------------------------------------------
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------------------------------
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE library_volumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE volume_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE academy_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_module_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE dispatches ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_call_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultancy_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_milestones ENABLE ROW LEVEL SECURITY;

-- Helper function: is current authenticated user an operator?
CREATE OR REPLACE FUNCTION is_operator()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid() AND role = 'operator'
  );
$$;

-- PROFILES Policies
CREATE POLICY "Public profiles can read basic info"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id OR is_operator());

CREATE POLICY "Operators have full profile access"
  ON profiles FOR ALL
  USING (is_operator());

-- QUESTS Policies (Everyone reads active quests, operators edit)
CREATE POLICY "Anyone can view active quests"
  ON quests FOR SELECT
  USING (is_active = true OR is_operator());

CREATE POLICY "Operators have full quest access"
  ON quests FOR ALL
  USING (is_operator());

-- USER QUESTS Policies
CREATE POLICY "Users view own completed quests"
  ON user_quests FOR SELECT
  USING (auth.uid() = user_id OR is_operator());

CREATE POLICY "Users can insert own quests"
  ON user_quests FOR INSERT
  WITH CHECK (auth.uid() = user_id OR is_operator());

-- LIBRARY & CHAPTERS (100% Free Public Reading Room)
CREATE POLICY "Public can view published volumes"
  ON library_volumes FOR SELECT
  USING (is_published = true OR is_operator());

CREATE POLICY "Operators manage volumes"
  ON library_volumes FOR ALL
  USING (is_operator());

CREATE POLICY "Public can view chapters"
  ON volume_chapters FOR SELECT
  USING (true);

CREATE POLICY "Operators manage chapters"
  ON volume_chapters FOR ALL
  USING (is_operator());

-- ACADEMY MODULES & PROGRESS
CREATE POLICY "Public can view published academy modules"
  ON academy_modules FOR SELECT
  USING (is_published = true OR is_operator());

CREATE POLICY "Operators manage academy modules"
  ON academy_modules FOR ALL
  USING (is_operator());

CREATE POLICY "Users view own module progress"
  ON user_module_progress FOR SELECT
  USING (auth.uid() = user_id OR is_operator());

CREATE POLICY "Users update own module progress"
  ON user_module_progress FOR ALL
  USING (auth.uid() = user_id OR is_operator());

-- DISPATCHES Policies
CREATE POLICY "Public can view published non-inner-circle dispatches"
  ON dispatches FOR SELECT
  USING (
    is_published = true AND (
      is_inner_circle_only = false OR
      EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND tier = 'sovereign_50') OR
      is_operator()
    )
  );

CREATE POLICY "Operators manage dispatches"
  ON dispatches FOR ALL
  USING (is_operator());

-- VIDEO CALL BOOKINGS
CREATE POLICY "Users view own call bookings"
  ON video_call_bookings FOR SELECT
  USING (auth.uid() = user_id OR is_operator());

CREATE POLICY "Users create own call bookings"
  ON video_call_bookings FOR INSERT
  WITH CHECK (auth.uid() = user_id OR is_operator());

CREATE POLICY "Operators manage all call bookings"
  ON video_call_bookings FOR ALL
  USING (is_operator());

-- ACTIVITY LOGS
CREATE POLICY "Operators view all activity logs"
  ON activity_logs FOR SELECT
  USING (is_operator());

CREATE POLICY "Users view own activity logs"
  ON activity_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "System and users insert activity logs"
  ON activity_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id OR is_operator());
