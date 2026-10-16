import type { Metadata } from 'next';
import { getAcademyCourses } from '@/lib/queries/academy.queries';
import AcademyCatalog from '@/components/academy/AcademyCatalog';
import { PageHero } from '@/components/ui/primitives';

export const metadata: Metadata = {
  title: 'Sovereign Academy LMS — The Architecture of Reality',
  description:
    'Structured multi-modal curriculums translating natural law into high-leverage execution, biological endurance, and covenant enterprise architecture.',
};

export default async function AcademyPage() {
  const courses = await getAcademyCourses();

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-[#F4F4F6] pb-24">
      <PageHero
        eyebrow="Sovereign Academy LMS"
        title={
          <>
            Operational Transmutation of{' '}
            <span className="text-gradient-gold italic">Natural Law</span>
          </>
        }
        lede="Three canonical curricula translating the Trilogy into high-leverage execution, biological preservation, and load-bearing covenant enterprise architectures."
      />

      <div className="container-x mt-8">
        <AcademyCatalog courses={courses} />
      </div>
    </div>
  );
}
