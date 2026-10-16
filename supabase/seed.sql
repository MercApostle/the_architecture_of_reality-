-- ============================================================================
-- The Architecture of Reality — Master Seed Data (v2.0)
-- Canonical Quests, Library Volumes, Academy Modules, Dispatches & Operators
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. SEED QUESTS (Categorized Gamification Registry)
-- ----------------------------------------------------------------------------
INSERT INTO quests (id, category, title, description, points_reward, target_url, reference_slug, sort_order)
VALUES
  -- ACCOUNT
  ('11111111-1111-4000-8000-000000000001', 'ACCOUNT', 'Initialize Sovereign Identity', 'Register your account and secure your personal operator handle in the digital vault.', 50, '/signup', 'account_init', 1),
  ('11111111-1111-4000-8000-000000000002', 'ACCOUNT', 'Calibrate Vessel Bio', 'Set your operator handle, timezone, and communication parameters.', 25, '/members', 'profile_calibrate', 2),

  -- DISPATCH
  ('11111111-1111-4000-8000-000000000003', 'DISPATCH', 'Assimilate: Shav & False Speech', 'Read Dispatch 01 exploring the biological and energetic cost of empty promises.', 25, '/news/shav-empty-words', 'shav-empty-words', 3),
  ('11111111-1111-4000-8000-000000000004', 'DISPATCH', 'Assimilate: Khata & Misalignment', 'Read Dispatch 02 examining sin as practical mechanical friction outside design specs.', 25, '/news/khata-missing-mark', 'khata-missing-mark', 4),
  ('11111111-1111-4000-8000-000000000005', 'DISPATCH', 'Assimilate: Dynamic Balance & Equilibrium', 'Read Dispatch 03 detailing why static perfection fails and how to steer dynamically.', 25, '/news/dynamic-balance', 'dynamic-balance', 5),

  -- ASSESSMENT
  ('11111111-1111-4000-8000-000000000006', 'ASSESSMENT', 'Complete 12-Question Energy Audit', 'Complete the 3-sector diagnostic audit to uncover Forcing vs. Passive drift.', 75, '/audit', 'energy_audit_main', 6),

  -- ACADEMY
  ('11111111-1111-4000-8000-000000000007', 'ACADEMY', 'Complete Module 1: The 80-Hour Work Month', 'Master executive restructuring and transition operations to a 20-hour work week standard.', 50, '/academy/master-blueprint/the-80-hour-work-month', 'module-1', 7),
  ('11111111-1111-4000-8000-000000000008', 'ACADEMY', 'Complete Module 2: The 10 Operational Firewalls', 'Install hard organizational barriers preventing chronic client intrusion and founder burnout.', 50, '/academy/master-blueprint/operational-firewalls', 'module-2', 8),
  ('11111111-1111-4000-8000-000000000009', 'ACADEMY', 'Complete Module 3: The 7-Fold Creation Matrix', 'Align organizational systems with the seven unbending principles of universal law.', 50, '/academy/genesis-lens/creation-matrix', 'module-3', 9),
  ('11111111-1111-4000-8000-000000000010', 'ACADEMY', 'Complete Module 4: The Tripartite Fruit Test', 'Implement empirical fruit testing across Mind, Body, and Soul metrics.', 50, '/academy/genesis-lens/tripartite-test', 'module-4', 10),

  -- MEMBERSHIP
  ('11111111-1111-4000-8000-000000000011', 'MEMBERSHIP', 'Activate Sovereign Membership', 'Upgrade to the $50 Sovereign Tier unlocking three 30-min strategy calls and full LMS access.', 250, '/offers', 'membership_upgrade', 11),

  -- ADVISORY
  ('11111111-1111-4000-8000-000000000012', 'ADVISORY', 'Submit Founder Vetting Application', 'Apply for bespoke systems advisory and private calendar access with Jeremy Ashe.', 100, '/meet', 'founder_vetting', 12)
ON CONFLICT (id) DO UPDATE SET
  category = EXCLUDED.category,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  points_reward = EXCLUDED.points_reward,
  target_url = EXCLUDED.target_url,
  reference_slug = EXCLUDED.reference_slug,
  sort_order = EXCLUDED.sort_order;

-- ----------------------------------------------------------------------------
-- 2. SEED ACADEMY MODULES (8 Master Lessons)
-- ----------------------------------------------------------------------------
INSERT INTO academy_modules (id, module_number, title, description, duration_minutes, video_url, worksheet_pdf_url, points_reward)
VALUES
  ('22222222-2222-4000-8000-000000000001', 1, 'Master Lesson 1: The 80-Hour Work Month', 'Radical operational restructuring: eliminate low-yield friction and compress founder work into 20 focused hours per week.', 48, 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ', '/pdfs/The Architecture of Reality.pdf', 50),
  ('22222222-2222-4000-8000-000000000002', 2, 'Master Lesson 2: The 10 Operational Firewalls', 'Architecting structural containment: install ten mandatory safeguards against urgent client demands and organizational drift.', 52, 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ', '/pdfs/1. The Master Blueprint.pdf', 50),
  ('22222222-2222-4000-8000-000000000003', 3, 'Master Lesson 3: The 7-Fold Creation Matrix', 'The empirical architecture of creation: mapping Mentalism, Correspondence, Vibration, Polarity, Rhythm, Cause & Effect, and Generation.', 64, 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ', '/pdfs/2. The Genesis Lens.pdf', 50),
  ('22222222-2222-4000-8000-000000000004', 4, 'Master Lesson 4: The Tripartite Vessel Diagnostic', 'Diagnostic precision: evaluating physical hardware, mental software, and relational covenant integrity without dogmatic moralizing.', 45, 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ', '/pdfs/3. The Covenant.pdf', 50),
  ('22222222-2222-4000-8000-000000000005', 5, 'Master Lesson 5: Sealing Energy & Time Leaks', 'Biological and cognitive containment: identifying high-performer leakage points, overthinking loops, and autonomic nervous system dysregulation.', 50, 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ', '/pdfs/The Architecture of Reality.pdf', 50),
  ('22222222-2222-4000-8000-000000000006', 6, 'Master Lesson 6: Load-Bearing Social Covenants', 'High-trust relational mechanics: transitioning partnerships from brittle extraction contracts to resilient, sovereign covenants.', 58, 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ', '/pdfs/3. The Covenant.pdf', 50),
  ('22222222-2222-4000-8000-000000000007', 7, 'Master Lesson 7: Sovereign Enterprise Economics', 'Building self-funding, zero-overhead business engines that nourish human flourishment rather than extracting vital energy.', 55, 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ', '/pdfs/1. The Master Blueprint.pdf', 50),
  ('22222222-2222-4000-8000-000000000008', 8, 'Master Lesson 8: Dynamic Equilibrium & Center Path', 'The art of continuous micro-steering: holding polarity tension, refusing premature harvest panic, and executing master calibration.', 60, 'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ', '/pdfs/2. The Genesis Lens.pdf', 50)
ON CONFLICT (id) DO UPDATE SET
  module_number = EXCLUDED.module_number,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  duration_minutes = EXCLUDED.duration_minutes,
  points_reward = EXCLUDED.points_reward;

-- ----------------------------------------------------------------------------
-- 3. SEED LIBRARY VOLUMES (4 Free Canonical Volumes)
-- ----------------------------------------------------------------------------
INSERT INTO library_volumes (id, slug, tab_label, title, subtitle, synopsis, blockquote, pdf_url, sort_order)
VALUES
  (
    '33333333-3333-4000-8000-000000000001',
    'the-architecture-of-reality',
    'FOUNDATION VOLUME',
    'The Architecture of Reality',
    'Bridging Human Energy, Universal Law, and Sovereign Life',
    'The foundational treatise bridging ancient wisdom with empirical physics. Redefines human misalignment as biological friction and lays out the 7-fold master code.',
    'Life feels like a battle because we are building against the grain of reality.',
    '/api/download/the-architecture-of-reality.pdf',
    0
  ),
  (
    '33333333-3333-4000-8000-000000000002',
    'the-master-blueprint',
    'BOOK I',
    'The Master Blueprint',
    'The Human Vessel, Polarity Mechanics, and the 80-Hour Work Month',
    'Operating manuals for the human vessel. How to stop chronic biological leaks, harness polarity tension, and operate an enterprise under the 80-hour work month standard.',
    'The vessel is not broken; it is simply operating without an architectural blueprint.',
    '/api/download/the-master-blueprint.pdf',
    1
  ),
  (
    '33333333-3333-4000-8000-000000000003',
    'the-genesis-lens',
    'BOOK II',
    'The Genesis Lens',
    'The Diagnostic Operating System and the 7-Fold Code',
    'A rigorous diagnostic framework decoding the seven-day creation cycle as an empirical system architecture for cognitive and operational clarity.',
    'Creation is not an ancient event; it is the recurring code through which reality manifests every day.',
    '/api/download/the-genesis-lens.pdf',
    2
  ),
  (
    '33333333-3333-4000-8000-000000000004',
    'the-covenant',
    'BOOK III',
    'The Covenant',
    'Load-Bearing Social Architecture and High-Trust Enterprise Firewalls',
    'The architectural principles of load-bearing human relationships and sovereign enterprise design. Replaces extraction contracts with unbreakable social covenants.',
    'A community that trades covenant trust for contractual extraction will inevitably collapse under its own friction.',
    '/api/download/the-covenant.pdf',
    3
  )
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  tab_label = EXCLUDED.tab_label,
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  synopsis = EXCLUDED.synopsis,
  blockquote = EXCLUDED.blockquote,
  pdf_url = EXCLUDED.pdf_url,
  sort_order = EXCLUDED.sort_order;

-- ----------------------------------------------------------------------------
-- 4. SEED DISPATCHES (Newsroom & Inner Circle)
-- ----------------------------------------------------------------------------
INSERT INTO dispatches (id, slug, title, excerpt, content_markdown, is_inner_circle_only)
VALUES
  (
    '44444444-4444-4000-8000-000000000001',
    'shav-empty-words',
    'Shav: The Energetic Cost of False Speech',
    'Why unkept commitments drain cognitive bandwidth and how ancient Hebrew root mechanics reveal speech as physical frequency.',
    'Speech is acoustic kinetic energy. In the ancient Hebrew lexicon, the root *shav* (שָׁוְא) represents falsehood—not merely as an abstract ethical failing, but as emptiness, vanity, and wasted structural capacity.\n\nWhen a leader speaks words that do not match physical execution, the friction is immediate. The nervous system must maintain the cognitive load of duplicity, while surrounding peers begin holding back their own energy. Truth creates structural stability; false speech creates thermodynamic debt.',
    false
  ),
  (
    '44444444-4444-4000-8000-000000000002',
    'khata-missing-mark',
    'Khata: Redefining Misalignment as Biological Friction',
    'Moving past moral guilt to understand sin as operating human hardware outside engineered tolerances.',
    'The historical concept of sin has been burdened with centuries of guilt, manipulation, and authoritarian fear. Yet the earliest biblical term, *khata* (חָטָא), is an archer''s term meaning simply "to miss the mark."\n\nWhen you fire an arrow and miss the target, the bow is not wicked, and the wind is not angry. You simply miscalculated the trajectory. In human life, attempting to work 80 hours a week, consuming inflammatory fuel, and ignoring restorative rest is operational misalignment. The resulting burnout is not wrath; it is physics.',
    false
  ),
  (
    '44444444-4444-4000-8000-000000000003',
    'dynamic-balance',
    'Dynamic Equilibrium: Why Static Balance Always Collapses',
    'How high performers steer between Forcing and Passive drift without freezing into rigid perfectionism.',
    'Most people envision balance as a tightrope walker standing completely motionless. But in living systems, static stillness is death. Balance is dynamic equilibrium—a continuous, mindful dance between opposing polarities.\n\nUnder high stress, human operators naturally drift into one of two misalignments: Forcing (over-efforting, micromanagement, muscular tension) or Passive (avoidance, numbness, withdrawal). Sovereignty is the capacity to notice the drift early and execute quiet micro-corrections.',
    false
  ),
  (
    '44444444-4444-4000-8000-000000000004',
    'inner-circle-firewalls',
    'Executive Memo: Installing the 10 Operational Firewalls',
    'Private operational blueprint reserved for Sovereign Members on establishing unbreakable company boundaries.',
    'This dispatch is restricted to Sovereign Members and active Consulting Clients.\n\nWhen an enterprise founder operates as the central hub of all communications, the organization becomes fragile. To achieve the 80-Hour Work Month standard, ten non-negotiable operational firewalls must be installed immediately across customer intake, calendar blocks, and delegation containers.',
    true
  )
ON CONFLICT (id) DO UPDATE SET
  slug = EXCLUDED.slug,
  title = EXCLUDED.title,
  excerpt = EXCLUDED.excerpt,
  content_markdown = EXCLUDED.content_markdown,
  is_inner_circle_only = EXCLUDED.is_inner_circle_only;

-- ----------------------------------------------------------------------------
-- 5. SEED OPERATOR ELEVATION (Jeremy Ashe - jeremyashe@gmail.com)
-- ----------------------------------------------------------------------------
-- If Jeremy Ashe's profile already exists in public.profiles, elevate immediately
UPDATE public.profiles
SET 
  role = 'operator'::user_role,
  tier = 'sovereign_50'::membership_tier,
  total_points = GREATEST(total_points, 10000)
WHERE LOWER(email) = 'jeremyashe@gmail.com';

