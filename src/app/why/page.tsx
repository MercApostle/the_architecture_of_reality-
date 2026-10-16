import type { Metadata } from 'next';
import WhySection from '@/components/home/WhySection';
import { CtaBanner } from '@/components/ui/primitives';

export const metadata: Metadata = {
  title: "The Architect's Thesis · Why We Are Building This in Bella Coola · The Architecture of Reality",
  description:
    "Where others see evil tools, I see individuals refusing to take ownership of their own decisions. The foundational thesis on sovereign responsibility, natural order, and the 40-year horizon in Bella Coola.",
};

export default function WhyPage() {
  return (
    <main className="min-h-screen bg-obsidian text-ink">
      <div className="pt-8">
        <WhySection />
      </div>
      <div className="py-24">
        <CtaBanner />
      </div>
    </main>
  );
}
