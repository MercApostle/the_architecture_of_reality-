import Link from "next/link";
import { BOOKS, UNIVERSAL_PRINCIPLES } from "@/lib/data/books";
import { BookCover, CtaBanner, SectionHeader } from "@/components/ui/primitives";
import { VesselGlyph } from "@/components/ui/VesselGlyph";
import WhySection from "@/components/home/WhySection";

const THESIS = [
  {
    k: "01",
    title: "Friction",
    body: "Every system loses energy at its points of resistance. Most suffering is unexamined friction — between design and demand, word and deed.",
  },
  {
    k: "02",
    title: "Energy & Time Leaks",
    body: "High performers rarely lack capacity. They lack containment. Overthinking, dysregulation, and incongruence drain energy and time before they can be directed.",
  },
  {
    k: "03",
    title: "Dynamic Balance",
    body: "Balance is not stillness — it is continuous correction. Under stress we drift toward Forcing or Passive. Mastery is noticing early and counter-steering.",
  },
  {
    k: "04",
    title: "Universal Alignment",
    body: "Reality has an architecture. Aligning mind, body, and soul with seven operating principles turns effort into leverage.",
  },
];

export default function Home() {
  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative -mt-16 overflow-hidden pt-16">
        <div className="grid-bg pointer-events-none absolute inset-0" />
        <div className="pointer-events-none absolute top-1/3 -left-40 size-[30rem] rounded-full bg-gold/5 blur-3xl" />
        <div className="container-x relative grid items-center gap-12 py-20 sm:py-28 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="animate-fade-up space-y-8">
            <p className="inline-flex items-center gap-2 rounded-full border border-line bg-charcoal/60 px-3.5 py-1.5 font-mono text-xs sm:text-[0.75rem] tracking-[0.22em] text-muted uppercase font-medium">
              <span className="size-2 rounded-full bg-emerald" /> A systems-level philosophy
            </p>
            <h1 className="font-serif text-4xl leading-[1.05] font-semibold text-ink sm:text-6xl lg:text-7xl">
              The Architecture <br className="hidden sm:block" />
              of <span className="text-gradient-gold italic">Reality</span>
            </h1>
            <p className="max-w-xl text-lg sm:text-2xl leading-relaxed text-muted">
              Bridging <span className="text-ink font-medium">Human Energy</span>, <span className="text-ink font-medium">Universal Law</span>, and{" "}
              <span className="text-ink font-medium">Sovereign Life</span> — a blueprint for calibrating the vessel and building
              enterprises that bear weight.
            </p>
            <div className="flex flex-wrap gap-3.5">
              <Link href="/audit" id="hero-cta-audit" className="btn-gold px-8 py-4 text-base font-semibold">
                Take the Energy Audit <span aria-hidden>→</span>
              </Link>
              <Link href="/library" id="hero-cta-library" className="btn-ghost px-8 py-4 text-base font-semibold">
                Explore the Trilogy
              </Link>
            </div>
            <dl className="grid max-w-md grid-cols-3 gap-6 border-t border-line pt-6">
              {[
                ["3", "Books"],
                ["7", "Principles"],
                ["12", "Diagnostics"],
              ].map(([n, l]) => (
                <div key={l}>
                  <dt className="sr-only">{l}</dt>
                  <dd className="font-serif text-3xl sm:text-4xl font-bold text-gold">{n}</dd>
                  <dd className="font-mono text-xs tracking-widest text-muted uppercase font-semibold">{l}</dd>
                </div>
              ))}
            </dl>
          </div>
          <VesselGlyph className="mx-auto w-full max-w-md" />
        </div>
      </section>

      {/* ── THESIS ───────────────────────────────────────────── */}
      <section className="container-x py-24" id="thesis">
        <SectionHeader
          eyebrow="The Core Thesis"
          title={
            <>
              Your life is an energy system. <span className="text-muted italic">Design it like one.</span>
            </>
          }
          lede="The same laws that govern circuits, ecosystems, and civilisations govern the human vessel. Learn where energy and time leak — and how to seal them."
        />
        <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
          {THESIS.map((t) => (
            <article key={t.k} className="group bg-charcoal p-8 transition hover:bg-charcoal-raised sm:p-10">
              <p className="font-mono text-sm text-gold/90 font-bold">{t.k}</p>
              <h3 className="mt-4 font-serif text-2xl sm:text-3xl text-ink font-semibold transition group-hover:text-gold">{t.title}</h3>
              <p className="mt-3 text-base sm:text-lg leading-relaxed text-muted">{t.body}</p>
            </article>
          ))}
        </div>

        {/* 7 Principles strip */}
        <div className="mt-16">
          <p className="eyebrow mb-6">The 7 Universal Principles</p>
          <ol className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
            {UNIVERSAL_PRINCIPLES.map((p, i) => (
              <li key={p.name} className="card card-hover p-4 sm:p-5">
                <span className="font-mono text-xs font-bold text-gold">{String(i + 1).padStart(2, "0")}</span>
                <p className="mt-2 font-serif text-xl font-semibold leading-tight text-ink">{p.name}</p>
                <p className="mt-1.5 text-sm leading-snug text-muted">{p.line}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── THE ARCHITECT'S THESIS: WHY WE ARE BUILDING THIS IN BELLA COOLA ── */}
      <WhySection />

      {/* ── TRILOGY ──────────────────────────────────────────── */}
      <section className="border-y border-line bg-charcoal/40 py-24" id="trilogy">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeader
              eyebrow="The Trilogy"
              title="Three books. One architecture."
              lede="From the individual vessel, to the code of reality, to the covenant that holds communities together."
            />
            <Link href="/library" className="btn-ghost shrink-0 px-6 py-3 text-sm sm:text-base font-semibold">Enter the Reading Room →</Link>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {BOOKS.map((b) => (
              <article key={b.id} className="card card-hover group flex flex-col p-6 sm:p-7">
                <div className="mx-auto w-full max-w-[210px] transition duration-700 group-hover:-translate-y-1 group-hover:rotate-[-1deg]">
                  <BookCover
                    number={b.number}
                    title={b.title}
                    subtitle={b.subtitle}
                    volumeLabel={b.volumeLabel}
                  />
                </div>
                <div className="mt-6 flex flex-1 flex-col">
                  <p className="eyebrow">{b.volumeLabel ?? `Book ${b.number}`}</p>
                  <h3 className="mt-2 font-serif text-2xl text-ink font-semibold leading-tight">{b.title}</h3>
                  <p className="text-sm text-gold/90 mt-1 font-medium">{b.subtitle}</p>
                  <p className="mt-3.5 flex-1 text-sm sm:text-base leading-relaxed text-muted line-clamp-4">{b.overview}</p>
                  <div className="mt-6 flex gap-2.5">
                    <Link href={`/library#${b.id}`} id={`home-read-${b.id}`} className="btn-gold flex-1 py-2.5 text-sm font-semibold">
                      Read
                    </Link>
                    {b.downloadUrl ? (
                      <a
                        href={b.downloadUrl}
                        download={b.filename ?? `${b.title}.pdf`}
                        className="btn-ghost flex-1 py-2.5 text-sm font-semibold text-center"
                      >
                        PDF ↓
                      </a>
                    ) : (
                      <Link href="/offers#tier-1" className="btn-ghost flex-1 py-2.5 text-sm font-semibold text-center">
                        Get PDF
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <div className="pt-24">
        <CtaBanner />
      </div>
    </>
  );
}
