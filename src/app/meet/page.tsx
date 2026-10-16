import type { Metadata } from 'next';
import ConsultancyVettingApp from '@/components/consultancy/ConsultancyVettingApp';
import { PageHero } from '@/components/ui/primitives';

export const metadata: Metadata = {
  title: 'Enterprise Consultancy Vetting & Private Advisory · Jeremy Ashe',
  description:
    'Apply for executive systems alignment, time leak containment, and transitioning your business to the 80-Hour Work Month standard. Qualified applicants unlock private calendar scheduling.',
};

export default function MeetPage() {
  return (
    <div className="min-h-screen bg-obsidian text-ink">
      <PageHero
        eyebrow="Enterprise Systems Architecture"
        title={
          <>
            Founder Vetting &amp; <span className="text-gradient-gold italic">Executive Advisory</span>
          </>
        }
        lede="We partner with sovereign business owners to eliminate chronic friction, install the 10 Operational Firewalls, and restructure operations around the 80-Hour Work Month standard."
      />

      <section className="container-x py-12">
        <ConsultancyVettingApp />
      </section>
    </div>
  );
}
