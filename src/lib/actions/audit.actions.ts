'use server';

import { revalidatePath } from 'next/cache';
import { createClient as createServerSupabase } from '@/lib/supabase/server';
import { auditRepository } from '@/lib/storage';
import { DIRECTIVES } from '@/lib/audit/scoring';
import { AuditSubmissionSchema, type AuditSubmissionInput } from '@/lib/schemas/audit';
import type { Drift, Sector } from '@/lib/types';

export type { AuditSubmissionInput };

export interface AuditActionResult {
  success: boolean;
  submissionId?: string;
  directive?: {
    headline: string;
    principle: string;
    phases: Array<{ window: string; title: string; actions: string[] }>;
  };
  recommendedPath?: 'academy_blueprint' | 'academy_genesis' | 'academy_covenant' | 'consultancy_application';
  error?: string;
}

export async function submitAuditAction(rawInput: AuditSubmissionInput): Promise<AuditActionResult> {
  // 1. Validate payload with Zod
  const parseResult = AuditSubmissionSchema.safeParse(rawInput);
  if (!parseResult.success) {
    const errorMsg = parseResult.error.issues.map((i) => i.message).join(', ');
    return { success: false, error: errorMsg };
  }

  const { email, answers, drift, weakestSector, operationalScope, scores } = parseResult.data;

  // 2. Compute dynamic recommended path based on operational scope and weakest sector
  let recommendedPath: 'academy_blueprint' | 'academy_genesis' | 'academy_covenant' | 'consultancy_application';

  if (operationalScope === 'enterprise') {
    recommendedPath = 'consultancy_application';
  } else {
    // Individual routing based on primary leak sector
    switch (weakestSector) {
      case 'body':
        recommendedPath = 'academy_blueprint'; // Book I: Physical hardware & 80-hour work month
        break;
      case 'mind':
        recommendedPath = 'academy_genesis'; // Book II: Cognitive clarity & 7-Fold Law
        break;
      case 'soul':
      default:
        recommendedPath = 'academy_covenant'; // Book III: Relational trust & social covenants
        break;
    }
  }

  const directiveSlug = `${weakestSector}-${drift}`;
  const directive = DIRECTIVES[weakestSector as Sector]?.[drift as Drift];

  let submissionId = typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : `${Date.now()}`;

  // 3. Persist to Supabase if available
  try {
    const supabase = await createServerSupabase();
    if (supabase) {
      // Check for authenticated user session if present
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data: inserted, error: insertError } = await supabase
        .from('audit_submissions')
        .insert({
          user_id: user?.id ?? null,
          email: email && email.length > 0 ? email : null,
          mind_score: scores.mind,
          body_score: scores.body,
          soul_score: scores.soul,
          drift_tendency: drift,
          weakest_sector: weakestSector,
          raw_answers: answers,
          directive_slug: directiveSlug,
          recommended_path: recommendedPath,
        })
        .select('id')
        .single();

      if (!insertError && inserted) {
        submissionId = inserted.id;
      } else if (insertError) {
        console.warn('[Audit Action] Supabase insert note:', insertError.message);
      }
    }
  } catch (err) {
    console.warn('[Audit Action] Supabase connection bypassed, using local store:', err);
  }

  // 4. Save to local fallback storage
  try {
    await auditRepository.save({
      id: submissionId,
      timestamp: new Date().toISOString(),
      scores,
      drift: drift as Drift,
      lowestSector: weakestSector as Sector,
      answers,
    });
  } catch {
    // Fallback storage note
  }

  // 5. Send real-time email notification to Jeremy Ashe via Resend
  try {
    const { sendAuditNotification } = await import('@/lib/email');
    sendAuditNotification({
      email,
      scores,
      drift,
      weakestSector,
      operationalScope,
      submissionId,
      directiveHeadline: directive?.headline,
    }).catch((err) => console.warn('[Audit Email Notification Failed]:', err));
  } catch (err) {
    console.warn('[Audit Email Import Warning]:', err);
  }

  revalidatePath('/audit');

  return {
    success: true,
    submissionId,
    directive,
    recommendedPath,
  };
}
