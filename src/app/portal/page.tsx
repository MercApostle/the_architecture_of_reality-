import type { Metadata } from 'next';
import { getClientProjectData } from '@/lib/queries/consultancy.queries';
import ClientCommandCenter from '@/components/portal/ClientCommandCenter';
import { PageHero } from '@/components/ui/primitives';

export const metadata: Metadata = {
  title: 'Client Command Center · The 80-Hour Work Month Portal',
  description:
    'Private client command center displaying the 80-Hour Work Month progress meter, System Health Score, phase milestones, and enterprise architecture blueprints.',
};

export default async function PortalPage() {
  const projectData = await getClientProjectData();

  return (
    <div className="min-h-screen bg-obsidian text-ink">
      <PageHero
        eyebrow="Consulting Command Center"
        title={
          <>
            Client Portal &amp; <span className="text-gradient-gold italic">80-Hour Cadence</span>
          </>
        }
        lede="Private executive telemetry tracking system health scores, milestone roadmaps, and the structured trajectory toward the 80-hour work month standard."
      />

      <section className="container-x py-12">
        <ClientCommandCenter initialData={projectData} />
      </section>
    </div>
  );
}
