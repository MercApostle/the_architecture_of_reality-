export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'member' | 'operator' | 'client' | 'admin';
export type MembershipTier = 'free' | 'sovereign_50' | 'paid';
export type QuestCategory = 'ACCOUNT' | 'DISPATCH' | 'ASSESSMENT' | 'ACADEMY' | 'MEMBERSHIP' | 'ADVISORY';
export type Sector = 'mind' | 'body' | 'soul';
export type Drift = 'forcing' | 'passive' | 'centered';
export type RecommendedPath =
  | 'academy_blueprint'
  | 'academy_genesis'
  | 'academy_covenant'
  | 'consultancy_application';

export interface Profile {
  id: string;
  user_handle?: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  tier?: MembershipTier;
  has_all_access?: boolean;
  total_points: number;
  video_calls_total: number;
  video_calls_remaining: number;
  operator_notes?: string | null;
  stripe_customer_id?: string | null;
  stripe_subscription_status?: string | null;
  joined_at?: string;
  last_active_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Quest {
  id: string;
  category: QuestCategory;
  title: string;
  description: string;
  points_reward: number;
  target_url: string;
  reference_slug: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface UserQuest {
  id: string;
  user_id: string;
  quest_id: string;
  completed_at: string;
}

export interface LibraryVolume {
  id: string;
  slug: string;
  tab_label: string;
  title: string;
  subtitle: string | null;
  synopsis: string | null;
  blockquote: string | null;
  cover_image_url: string | null;
  pdf_url: string;
  file_size_label: string;
  sort_order: number;
  is_published: boolean;
}

export interface VolumeChapter {
  id: string;
  volume_id: string;
  chapter_number: number;
  roman_numeral: string | null;
  title: string;
  content_markdown: string;
  sort_order: number;
}

// Backward-compatible Volume & Chapter aliases
export type Volume = LibraryVolume & {
  volume_label?: string;
  description?: string | null;
};
export type Chapter = VolumeChapter & {
  slug: string;
  content_md?: string;
  principle_number?: number | null;
  estimated_read_mins?: number;
};

export interface AcademyModule {
  id: string;
  module_number: number;
  title: string;
  description: string | null;
  duration_minutes: number;
  video_url: string | null;
  worksheet_pdf_url: string | null;
  points_reward: number;
  is_published: boolean;
}

export interface UserModuleProgress {
  id: string;
  user_id: string;
  module_id: string;
  is_completed: boolean;
  completed_at: string | null;
}

export interface Dispatch {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content_markdown: string;
  cover_image_url: string | null;
  is_inner_circle_only: boolean;
  published_at?: string;
  is_published: boolean;
}

export interface VideoCallBooking {
  id: string;
  user_id: string;
  cal_booking_uid: string | null;
  scheduled_for: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  session_notes: string | null;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  action_type: string;
  metadata: Record<string, Json>;
  created_at: string;
}

export interface AuditSubmission {
  id: string;
  user_id: string | null;
  email: string | null;
  mind_score: number;
  body_score: number;
  soul_score: number;
  drift_tendency: Drift;
  weakest_sector: Sector;
  raw_answers: Record<string, number>;
  directive_slug: string | null;
  recommended_path: RecommendedPath | null;
  created_at?: string;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  book_alignment: 'foundation' | 'book_1' | 'book_2' | 'book_3';
  price_cents: number;
  stripe_price_id: string | null;
  is_published: boolean;
  created_at?: string;
}

export interface Module {
  id: string;
  course_id: string;
  title: string;
  sort_order: number;
  created_at?: string;
}

export interface Lesson {
  id: string;
  module_id: string;
  slug: string;
  title: string;
  sort_order: number;
  is_free_preview: boolean;
  video_embed_url: string | null;
  audio_url: string | null;
  content_md: string;
  download_attachments: Json[];
  workbook_schema: Json[];
  created_at?: string;
}

export interface UserEnrollment {
  id: string;
  user_id: string;
  course_id: string;
  unlocked_via: 'single_purchase' | 'bundle' | 'dev_bypass' | 'admin_grant' | 'all_access';
  created_at?: string;
}

export interface WorkbookSubmission {
  id: string;
  user_id: string;
  lesson_id: string;
  responses: Record<string, Json>;
  is_completed: boolean;
  updated_at?: string;
}

export type BusinessSector = 'ecommerce' | 'local_enterprise' | 'service_agency' | 'other';
export type QualificationStatus = 'qualified' | 'nurture' | 'declined';
export type MilestoneStatus = 'upcoming' | 'in_progress' | 'completed';

export interface ConsultancyApplication {
  id: string;
  user_id: string | null;
  full_name: string;
  email: string;
  company_name: string;
  business_sector: BusinessSector;
  current_weekly_hours: number;
  mission_alignment: string;
  primary_bottleneck: string;
  qualification_status: QualificationStatus;
  created_at?: string;
}

export interface ClientProject {
  id: string;
  client_user_id: string;
  project_name: string;
  target_monthly_hours: number;
  current_monthly_hours: number;
  system_health_score: number;
  architecture_summary_md: string;
  shared_links: Array<{ title: string; url: string; category?: string }>;
  created_at?: string;
  updated_at?: string;
}

export interface ClientMilestone {
  id: string;
  project_id: string;
  phase_number: number;
  title: string;
  deliverables_md: string;
  status: MilestoneStatus;
  due_date: string | null;
  created_at?: string;
}
