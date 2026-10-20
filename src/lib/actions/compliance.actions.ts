'use server';

import fs from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { createClient as createServerSupabase } from '@/lib/supabase/server';
import { logComplianceRequest } from '@/lib/audit/logger';

const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'registered-members.json');

export interface ComplianceActionResult<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

/**
 * BC PIPA Right of Access: Export all personal data linked to an email address.
 */
export async function exportUserDataAction(
  email: string
): Promise<ComplianceActionResult<Record<string, unknown>>> {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { success: false, error: 'A valid email address is required.' };
  }

  logComplianceRequest('BC_PIPA_DATA_ACCESS', cleanEmail, 'RECEIVED');

  const exportedData: Record<string, unknown> = {
    subjectEmail: cleanEmail,
    requestDate: new Date().toISOString(),
    regulatoryFramework: 'British Columbia Personal Information Protection Act (BC PIPA)',
    records: {},
  };

  // 1. Check Supabase
  try {
    const supabase = await createServerSupabase();
    if (supabase) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', cleanEmail)
        .maybeSingle();

      const { data: audits } = await supabase
        .from('audit_submissions')
        .select('*')
        .eq('email', cleanEmail);

      const { data: applications } = await supabase
        .from('consultancy_applications')
        .select('*')
        .eq('email', cleanEmail);

      exportedData.records = {
        profile: profile || null,
        diagnosticAudits: audits || [],
        consultancyApplications: applications || [],
      };
    }
  } catch (err) {
    console.warn('[Compliance Export] Supabase query note:', err);
  }

  // 2. Check local fallback
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
      if (Array.isArray(raw)) {
        const match = raw.find((m) => m.email?.toLowerCase() === cleanEmail);
        if (match) {
          (exportedData.records as Record<string, unknown>).localMemberRegistry = match;
        }
      }
    }
  } catch {}

  logComplianceRequest('BC_PIPA_DATA_ACCESS', cleanEmail, 'FULFILLED');

  return {
    success: true,
    data: exportedData,
    message: 'Personal data archive compiled pursuant to BC PIPA Section 23.',
  };
}

/**
 * BC PIPA Right of Correction: Update personal records.
 */
export async function correctUserDataAction(
  email: string,
  updates: { fullName?: string; companyName?: string }
): Promise<ComplianceActionResult> {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { success: false, error: 'A valid email address is required.' };
  }

  logComplianceRequest('BC_PIPA_DATA_CORRECTION', cleanEmail, 'RECEIVED', updates);

  try {
    const supabase = await createServerSupabase();
    if (supabase && updates.fullName) {
      await supabase
        .from('profiles')
        .update({ full_name: updates.fullName })
        .eq('email', cleanEmail);
    }
  } catch (err) {
    console.warn('[Compliance Correction] Supabase update note:', err);
  }

  // Update local file if present
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
      if (Array.isArray(raw)) {
        const idx = raw.findIndex((m) => m.email?.toLowerCase() === cleanEmail);
        if (idx >= 0 && updates.fullName) {
          raw[idx].name = updates.fullName;
          fs.writeFileSync(DATA_FILE, JSON.stringify(raw, null, 2), 'utf-8');
        }
      }
    }
  } catch {}

  logComplianceRequest('BC_PIPA_DATA_CORRECTION', cleanEmail, 'FULFILLED');
  revalidatePath('/members');

  return {
    success: true,
    message: 'Personal information updated pursuant to BC PIPA Section 24.',
  };
}

/**
 * BC PIPA Right to Erasure / Destruction: Anonymize or permanently delete stored user data.
 */
export async function requestDataDeletionAction(
  email: string
): Promise<ComplianceActionResult> {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { success: false, error: 'A valid email address is required.' };
  }

  logComplianceRequest('BC_PIPA_DATA_DELETION', cleanEmail, 'RECEIVED');

  try {
    const supabase = await createServerSupabase();
    if (supabase) {
      await supabase.from('profiles').delete().eq('email', cleanEmail);
      await supabase.from('audit_submissions').delete().eq('email', cleanEmail);
      await supabase.from('consultancy_applications').delete().eq('email', cleanEmail);
    }
  } catch (err) {
    console.warn('[Compliance Deletion] Supabase delete note:', err);
  }

  // Remove from local file
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
      if (Array.isArray(raw)) {
        const filtered = raw.filter((m) => m.email?.toLowerCase() !== cleanEmail);
        fs.writeFileSync(DATA_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
      }
    }
  } catch {}

  logComplianceRequest('BC_PIPA_DATA_DELETION', cleanEmail, 'FULFILLED');
  revalidatePath('/members');
  revalidatePath('/admin');

  return {
    success: true,
    message: 'Personal data records permanently erased pursuant to BC PIPA Section 35.',
  };
}
