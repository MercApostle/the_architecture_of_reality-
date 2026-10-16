import type { Metadata } from 'next';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { getStoredApplications } from '@/lib/actions/consultancy.actions';
import { getClientProjectData } from '@/lib/queries/consultancy.queries';
import { PageHero } from '@/components/ui/primitives';

export const metadata: Metadata = {
  title: 'Executive Admin & Consultancy Operations · The Architecture of Reality',
  description:
    'Internal management command center to review founder vetting applications, inspect client project health metrics, and advance transformation milestones.',
};

export default async function AdminPage() {
  const applications = await getStoredApplications();
  const clientData = await getClientProjectData();

  return (
    <div className="min-h-screen bg-obsidian text-ink">
      <PageHero
        eyebrow="Executive Administration"
        title={
          <>
            Operations Command &amp; <span className="text-gradient-gold italic">Client Pipeline</span>
          </>
        }
        lede="Inspect incoming founder applications, evaluate mission alignment and weekly workload, and manage active transformation roadmaps toward the 80-hour work month."
      />

      <section className="container-x py-12">
        <AdminDashboard
          initialApplications={applications}
          initialClientData={clientData}
        />
      </section>
    </div>
  );
}
