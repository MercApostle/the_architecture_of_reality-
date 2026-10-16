import { z } from 'zod';

export const AuditSubmissionSchema = z.object({
  email: z.string().email('Please provide a valid email address.').optional().or(z.literal('')),
  answers: z.record(z.string(), z.number()),
  drift: z.enum(['forcing', 'passive']),
  weakestSector: z.enum(['mind', 'body', 'soul']),
  operationalScope: z.enum(['individual', 'enterprise']).default('individual'),
  scores: z.object({
    mind: z.number(),
    body: z.number(),
    soul: z.number(),
    total: z.number(),
  }),
});

export type AuditSubmissionInput = z.infer<typeof AuditSubmissionSchema>;
