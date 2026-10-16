export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'member' | 'client' | 'admin';
export type Sector = 'mind' | 'body' | 'soul';
export type Drift = 'forcing' | 'passive' | 'centered';
export type RecommendedPath =
  | 'academy_blueprint'
  | 'academy_genesis'
  | 'academy_covenant'
  | 'consultancy_application';

export interface Volume {
  id: string;
  slug: string;
  volume_label: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  pdf_url: string;
  sort_order: number;
  created_at?: string;
}

export interface Chapter {
  id: string;
  volume_id: string;
  chapter_number: number;
  slug: string;
  title: string;
  content_md: string;
  principle_number: number | null;
  estimated_read_mins: number;
  created_at?: string;
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

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  has_all_access: boolean;
  stripe_customer_id: string | null;
  stripe_subscription_status: string | null;
  created_at?: string;
  updated_at?: string;
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

