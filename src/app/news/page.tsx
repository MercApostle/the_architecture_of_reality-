import type { Metadata } from "next";
import { getAllDispatches } from "@/lib/dispatches";
import { CtaBanner, PageHero } from "@/components/ui/primitives";
import NewsCatalog from "@/components/news/NewsCatalog";

export const metadata: Metadata = {
  title: "News & Blog — Insights, Hebrew Roots, Neuroscience, and Systems",
  description:
    "Articles, insights, and field notes by Jeremy Ashe mapping ancient Hebrew roots to cognitive science, biological regulation, and sovereign enterprise architecture.",
};

export default function NewsPage() {
  const articles = getAllDispatches();

  return (
    <>
      <PageHero
        eyebrow="News &amp; Field Notes"
        title={
          <>
            News &amp; <span className="text-gradient-gold italic">Blog</span>
          </>
        }
        lede="Articles, dispatches, and field notes exploring ancient linguistic root codes mapped directly to modern neuroscience, human energy, and load-bearing enterprise architecture."
      />

      <section className="container-x py-16">
        <NewsCatalog articles={articles} />
      </section>

      <div className="pt-4 pb-20">
        <CtaBanner
          title="Detect where your energy and time leak."
          body="Take the 12-question Energy & Time Alignment Audit to identify whether overthinking or biological depletion is bottlenecking your performance."
          cta="Take the Energy Audit →"
          href="/audit"
        />
      </div>
    </>
  );
}
