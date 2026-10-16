import { createClient as createServerSupabase } from '@/lib/supabase/server';
import type { ClientProject, ClientMilestone } from '@/lib/supabase/types';

export interface FullClientProjectData {
  project: ClientProject;
  milestones: ClientMilestone[];
  hoursReductionPercentage: number;
}

export const FALLBACK_CLIENT_PROJECT: ClientProject = {
  id: 'proj-flagship-01',
  client_user_id: 'client-user-demo',
  project_name: 'Apex Sovereign Systems & Calendar Architecture',
  target_monthly_hours: 80,
  current_monthly_hours: 135,
  system_health_score: 74,
  architecture_summary_md: `### Operational Architecture Summary
The enterprise is currently transitioning from founder-centric ad-hoc firefighting to **autonomous covenant-based operations**.

#### Core Firewalls Installed
- **Firewall 1 (Temporal Curfew)**: Hard operational shutdown at 18:00 daily. No internal Slack communications on weekends.
- **Firewall 4 (Decision Escalation Gate)**: Decisions under $5,000 resolved autonomously by team leads using the *Fruit Test* standard.
- **Firewall 7 (The Rest Container)**: Mandatory 48-hour quiet incubation window prior to committing to major product pivots.

#### Active Objective
Systematically reduce executive operational drag from 135 monthly hours toward the target **80-hour work month (20 focus hours/week)** while increasing enterprise throughput.`,
  shared_links: [
    {
      title: 'The 80-Hour Work Month Executive Blueprint (PDF)',
      url: '/pdfs/the-master-blueprint.pdf',
      category: 'Architecture',
    },
    {
      title: 'The 10 Operational Firewalls Specification',
      url: '/library/the-covenant/ten-operational-firewalls',
      category: 'Protocols',
    },
    {
      title: 'Executive Cal.com Debrief Portal',
      url: '/meet',
      category: 'Advisory',
    },
  ],
  updated_at: new Date().toISOString(),
};

export const FALLBACK_MILESTONES: ClientMilestone[] = [
  {
    id: 'mile-01',
    project_id: 'proj-flagship-01',
    phase_number: 1,
    title: 'Phase I: Diagnostic & Time Leak Containment',
    deliverables_md: 'Complete 12-Question Energy Audit across Mind, Body, and Soul. Map all open operational loops and identify the top 3 executive friction leaks.',
    status: 'completed',
    due_date: '2026-10-01',
  },
  {
    id: 'mile-02',
    project_id: 'proj-flagship-01',
    phase_number: 2,
    title: 'Phase II: The Operational Curfew & Static Purge',
    deliverables_md: 'Implement non-negotiable 18:00 operational curfew. Eliminate 5 low-leverage internal recurring meetings. Reclaim 15 hours per week of cognitive bandwidth.',
    status: 'in_progress',
    due_date: '2026-10-25',
  },
  {
    id: 'mile-03',
    project_id: 'proj-flagship-01',
    phase_number: 3,
    title: 'Phase III: The 10 Operational Firewalls & Delegation Covenants',
    deliverables_md: 'Draft and ratify team covenants replacing surveillance with mutual trust. Install decision-making threshold matrix and firewalls against customer scope creep.',
    status: 'upcoming',
    due_date: '2026-11-15',
  },
  {
    id: 'mile-04',
    project_id: 'proj-flagship-01',
    phase_number: 4,
    title: 'Phase IV: The 80-Hour Work Month Autonomous Cadence',
    deliverables_md: 'Lock in sustainable 20-hour weekly executive rhythm (80 hours/month). Run 30-day stress test to verify enterprise autonomy without founder intervention.',
    status: 'upcoming',
    due_date: '2026-12-05',
  },
];

export async function getClientProjectData(userId?: string): Promise<FullClientProjectData> {
  try {
    const supabase = await createServerSupabase();
    if (supabase && userId) {
      const { data: project, error: projError } = await supabase
        .from('client_projects')
        .select('*')
        .eq('client_user_id', userId)
        .maybeSingle();

      if (!projError && project) {
        const { data: milestones } = await supabase
          .from('client_milestones')
          .select('*')
          .eq('project_id', project.id)
          .order('phase_number', { ascending: true });

        const currentHours = project.current_monthly_hours || 140;
        const targetHours = project.target_monthly_hours || 80;
        const reductionPct = Math.max(0, Math.round(((160 - currentHours) / (160 - targetHours)) * 100));

        return {
          project: project as ClientProject,
          milestones: (milestones as ClientMilestone[]) || [],
          hoursReductionPercentage: reductionPct,
        };
      }
    }
  } catch (err) {
    console.warn('[Client Queries] Using fallback client project data:', err);
  }

  // Graceful fallback for Local Dev Bypass or unconfigured Supabase
  const currentHours = FALLBACK_CLIENT_PROJECT.current_monthly_hours;
  const targetHours = FALLBACK_CLIENT_PROJECT.target_monthly_hours;
  const reductionPct = Math.max(0, Math.round(((160 - currentHours) / (160 - targetHours)) * 100));

  return {
    project: FALLBACK_CLIENT_PROJECT,
    milestones: FALLBACK_MILESTONES,
    hoursReductionPercentage: reductionPct,
  };
}
