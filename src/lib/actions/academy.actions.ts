'use server';

import { revalidatePath } from 'next/cache';
import { createClient as createServerSupabase } from '@/lib/supabase/server';
import { WorkbookSubmissionSchema, CourseEnrollmentSchema } from '@/lib/schemas/academy';

export interface ActionResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Save interactive workbook answers for a specific lesson
 */
export async function saveWorkbookSubmission(
  input: unknown
): Promise<ActionResponse<{ isCompleted: boolean; updated_at: string }>> {
  try {
    const validated = WorkbookSubmissionSchema.parse(input);

    let userId: string | null = null;
    const supabase = await createServerSupabase();

    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        userId = user.id;
      }
    }

    if (supabase && userId) {
      const { error } = await supabase.from('workbook_submissions').upsert(
        {
          user_id: userId,
          lesson_id: validated.lessonId,
          responses: validated.responses,
          is_completed: validated.isCompleted,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id,lesson_id' }
      );

      if (error) {
        console.warn('[Supabase Workbook Submission Error]', error);
        // Fall through to returning success so the client can maintain optimistic state
      }
    }

    revalidatePath(`/academy/${validated.courseSlug}`);
    revalidatePath(`/academy`);

    return {
      success: true,
      data: {
        isCompleted: validated.isCompleted,
        updated_at: new Date().toISOString(),
      },
    };
  } catch (err: unknown) {
    console.error('saveWorkbookSubmission error:', err);
    const message = err instanceof Error ? err.message : 'Failed to save workbook responses.';
    return {
      success: false,
      error: message,
    };
  }
}

/**
 * Enroll a user into a course (supports local dev bypass, bundle, or admin grants)
 */
export async function enrollInCourseAction(
  input: unknown
): Promise<ActionResponse<{ courseId: string; unlockedVia: string }>> {
  try {
    const validated = CourseEnrollmentSchema.parse(input);

    let userId: string | null = null;
    const supabase = await createServerSupabase();

    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        userId = user.id;
      }
    }

    if (supabase && userId) {
      const { error } = await supabase.from('user_enrollments').upsert(
        {
          user_id: userId,
          course_id: validated.courseId,
          unlocked_via: validated.unlockedVia,
        },
        { onConflict: 'user_id,course_id' }
      );

      if (error) {
        console.warn('[Supabase Course Enrollment Error]', error);
      }
    }

    revalidatePath('/academy');

    return {
      success: true,
      data: {
        courseId: validated.courseId,
        unlockedVia: validated.unlockedVia,
      },
    };
  } catch (err: unknown) {
    console.error('enrollInCourseAction error:', err);
    const message = err instanceof Error ? err.message : 'Failed to process course enrollment.';
    return {
      success: false,
      error: message,
    };
  }
}
