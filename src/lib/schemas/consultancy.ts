import { z } from 'zod';

export const ConsultancyApplicationSchema = z.object({
  fullName: z.string().min(2, 'Please provide your full name.'),
  email: z.string().email('Please provide a valid work email address.'),
  companyName: z.string().min(2, 'Company or organization name is required.'),
  businessSector: z.enum(['ecommerce', 'local_enterprise', 'service_agency', 'other']),
  currentWeeklyHours: z.number().min(5, 'Minimum 5 hours.').max(120, 'Maximum 120 hours.'),
  missionAlignment: z.string().min(10, 'Please share how your business prioritizes health, truth, or community purpose.'),
  primaryBottleneck: z.string().min(5, 'Please specify your primary operational friction or bottleneck.'),
});

export type ConsultancyApplicationInput = z.infer<typeof ConsultancyApplicationSchema>;
