import { z } from 'zod';

export const WorkbookSubmissionSchema = z.object({
  lessonId: z.string().min(1, 'Lesson ID is required'),
  courseSlug: z.string().min(1, 'Course slug is required'),
  responses: z.record(z.string(), z.any()),
  isCompleted: z.boolean().default(true),
});

export type WorkbookSubmissionInput = z.infer<typeof WorkbookSubmissionSchema>;

export const CourseEnrollmentSchema = z.object({
  courseId: z.string().min(1, 'Course ID is required'),
  unlockedVia: z.enum(['single_purchase', 'bundle', 'dev_bypass', 'admin_grant', 'all_access']).default('dev_bypass'),
});

export type CourseEnrollmentInput = z.infer<typeof CourseEnrollmentSchema>;
