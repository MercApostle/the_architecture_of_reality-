'use server';

import { revalidatePath } from 'next/cache';
import { createClient as createServerSupabase } from '@/lib/supabase/server';
import { ConsultancyApplicationSchema, type ConsultancyApplicationInput } from '@/lib/schemas/consultancy';
import type { QualificationStatus, MilestoneStatus } from '@/lib/supabase/types';

export type { ConsultancyApplicationInput };

export interface ConsultancyActionResult {
  success: boolean;
  applicationId?: string;
  qualificationStatus?: QualificationStatus;
  message?: string;
  error?: string;
}

// In-memory fallback repository for applications when Supabase is unconfigured
const IN_MEMORY_APPLICATIONS: Array<ConsultancyApplicationInput & { id: string; qualificationStatus: QualificationStatus; createdAt: string }> = [
  {
    id: 'app-seed-01',
    fullName: 'David Sterling',
    email: 'david@sterlingcraft.com',
    companyName: 'Sterling Craft Organics',
    businessSector: 'ecommerce',
    currentWeeklyHours: 65,
    missionAlignment: 'We manufacture clean, regenerative mineral water filtration hardware without microplastics.',
    primaryBottleneck: 'Founder is the operational choke point for supply chain decisions and customer escalation.',
    qualificationStatus: 'qualified',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'app-seed-02',
    fullName: 'Elena Rostova',
    email: 'elena@apollosystems.io',
    companyName: 'Apollo Engineering',
    businessSector: 'service_agency',
    currentWeeklyHours: 55,
    missionAlignment: 'High-trust software architecture for decentralised public health records and privacy.',
    primaryBottleneck: 'Exhausted by constant client urgency and scope creep. Need 10 Operational Firewalls installed.',
    qualificationStatus: 'qualified',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

export async function submitConsultancyApplication(
  rawInput: ConsultancyApplicationInput
): Promise<ConsultancyActionResult> {
  const parseResult = ConsultancyApplicationSchema.safeParse(rawInput);
  if (!parseResult.success) {
    const errorMsg = parseResult.error.issues.map((i) => i.message).join(', ');
    return { success: false, error: errorMsg };
  }

  const {
    fullName,
    email,
    companyName,
    businessSector,
    currentWeeklyHours,
    missionAlignment,
    primaryBottleneck,
  } = parseResult.data;

  // Qualification Rule:
  // Operating at >= 30 hours/week with authentic mission alignment qualifies for executive vetting
  const isQualified = currentWeeklyHours >= 30 && missionAlignment.trim().length >= 15;
  const qualificationStatus: QualificationStatus = isQualified ? 'qualified' : 'nurture';

  let applicationId = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `app-${Date.now()}`;

  try {
    const supabase = await createServerSupabase();
    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data: inserted, error: insertError } = await supabase
        .from('consultancy_applications')
        .insert({
          user_id: user?.id ?? null,
          full_name: fullName,
          email,
          company_name: companyName,
          business_sector: businessSector,
          current_weekly_hours: currentWeeklyHours,
          mission_alignment: missionAlignment,
          primary_bottleneck: primaryBottleneck,
          qualification_status: qualificationStatus,
        })
        .select('id')
        .single();

      if (!insertError && inserted) {
        applicationId = inserted.id;
      }
    }
  } catch (err) {
    console.warn('[Consultancy Action] Supabase bypassed, saving to local state:', err);
  }

  // Preserve in memory store
  IN_MEMORY_APPLICATIONS.unshift({
    ...parseResult.data,
    id: applicationId,
    qualificationStatus,
    createdAt: new Date().toISOString(),
  });

  // Send real-time email notification to Jeremy Ashe via Resend
  try {
    const { sendConsultancyApplicationAlert } = await import('@/lib/email');
    sendConsultancyApplicationAlert({
      fullName,
      email,
      companyName,
      businessSector,
      currentWeeklyHours,
      missionAlignment,
      primaryBottleneck,
      qualificationStatus,
      applicationId,
    }).catch((err) => console.warn('[Consultancy Email Notification Failed]:', err));
  } catch (err) {
    console.warn('[Consultancy Email Import Warning]:', err);
  }

  revalidatePath('/meet');
  revalidatePath('/admin');

  return {
    success: true,
    applicationId,
    qualificationStatus,
    message: isQualified
      ? 'Application qualified. Calendar scheduler unlocked.'
      : 'Application recorded. Reviewing alignment metrics.',
  };
}

export async function getStoredApplications() {
  try {
    const supabase = await createServerSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from('consultancy_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data;
      }
    }
  } catch (err) {
    console.warn('[Consultancy Queries] Supabase bypassed:', err);
  }

  return IN_MEMORY_APPLICATIONS;
}

export async function updateMilestoneStatus(
  milestoneId: string,
  newStatus: MilestoneStatus
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createServerSupabase();
    if (supabase) {
      const { error } = await supabase
        .from('client_milestones')
        .update({ status: newStatus })
        .eq('id', milestoneId);

      if (error) {
        return { success: false, error: error.message };
      }
    }
  } catch (err) {
    console.warn('[Milestone Update] Supabase note:', err);
  }

  revalidatePath('/portal');
  revalidatePath('/admin');
  return { success: true };
}
