import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/** Server-rendered Markdown with the site's reading typography. */
export function Markdown({ children, className = "" }: { children: string; className?: string }) {
  return (
    <div className={`prose-reality ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href = "", children }) =>
            href.startsWith("/") ? <Link href={href}>{children}</Link> : <a href={href} target="_blank" rel="noreferrer">{children}</a>,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  lede,
  align = "left",
  as: Tag = "h2",
}: {
  eyebrow: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2";
}) {
  return (
    <div className={`max-w-3xl space-y-4 ${align === "center" ? "mx-auto text-center" : ""}`}>
      <p className="eyebrow">{eyebrow}</p>
      <Tag className="font-serif text-4xl leading-[1.08] font-medium text-ink sm:text-5xl">{title}</Tag>
      {lede && <p className="text-lg leading-relaxed text-muted">{lede}</p>}
    </div>
  );
}

export function PageHero({ eyebrow, title, lede }: { eyebrow: string; title: React.ReactNode; lede?: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="grid-bg pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[48rem] -translate-x-1/2 rounded-full bg-gold/10 blur-3xl" />
      <div className="container-x relative animate-fade-up py-20 sm:py-28">
        <SectionHeader as="h1" eyebrow={eyebrow} title={title} lede={lede} />
      </div>
    </section>
  );
}

export function CtaBanner({
  title = "Where is your energy leaking?",
  body = "Twelve questions. Three sectors. An immediate 72-Hour Calibration Directive tailored to your weakest point.",
  href = "/audit",
  cta = "Begin the Energy Audit",
  id = "cta-banner-audit",
}: {
  title?: string;
  body?: string;
  href?: string;
  cta?: string;
  id?: string;
}) {
  return (
    <section className="container-x">
      <div className="relative overflow-hidden rounded-3xl border border-gold/30 bg-gradient-to-br from-charcoal via-charcoal to-[#1a1608] p-10 sm:p-14">
        <div className="pointer-events-none absolute -right-24 -bottom-24 size-80 rounded-full bg-gold/15 blur-3xl" />
        {/* Subtle, elegant vector sacred geometry watermark (no emoji bleed on mobile) */}
        <div className="pointer-events-none absolute -top-8 -right-8 size-64 sm:size-80 opacity-[0.08] text-gold select-none" aria-hidden="true">
          <svg viewBox="0 0 200 200" fill="none" className="w-full h-full stroke-current">
            <circle cx="100" cy="100" r="90" strokeWidth="1" strokeDasharray="4 4" />
            <circle cx="100" cy="100" r="70" strokeWidth="1" />
            <circle cx="100" cy="100" r="50" strokeWidth="0.8" strokeDasharray="2 2" />
            <circle cx="100" cy="100" r="30" strokeWidth="0.8" />
            <polygon points="100,10 125,75 190,100 125,125 100,190 75,125 10,100 75,75" strokeWidth="0.8" />
          </svg>
        </div>
        <div className="relative flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl space-y-3.5">
            <p className="eyebrow">The Diagnostic Audit</p>
            <h2 className="font-serif text-3xl sm:text-5xl font-semibold text-ink leading-tight">{title}</h2>
            <p className="text-base sm:text-lg text-muted leading-relaxed">{body}</p>
          </div>
          <Link href={href} id={id} className="btn-gold shrink-0 px-8 py-4 text-base font-semibold">
            {cta} <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

/** Typographic book cover — no image assets required. */
export function BookCover({
  number,
  title,
  subtitle,
  volumeLabel,
}: {
  number: number;
  title: string;
  subtitle: string;
  volumeLabel?: string;
}) {
  const numeral = number === 0 ? "0" : number === 1 ? "I" : number === 2 ? "II" : "III";
  const label = volumeLabel ?? (number === 0 ? "Foundation Volume" : `Book ${numeral}`);

  return (
    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-gold/25 bg-gradient-to-b from-[#161b24] to-obsidian shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9)]">
      <div className="absolute inset-3 rounded-lg border border-gold/15" />
      <svg aria-hidden viewBox="0 0 100 100" className="absolute top-1/2 left-1/2 w-3/4 -translate-x-1/2 -translate-y-[60%] text-gold/20">
        <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.4" />
        <circle cx="50" cy="50" r="28" fill="none" stroke="currentColor" strokeWidth="0.4" />
        {Array.from({ length: number === 2 ? 7 : number === 3 ? 10 : 6 }).map((_, i, a) => {
          const ang = (i / a.length) * Math.PI * 2 - Math.PI / 2;
          return <line key={i} x1="50" y1="50" x2={50 + Math.cos(ang) * 40} y2={50 + Math.sin(ang) * 40} stroke="currentColor" strokeWidth="0.4" />;
        })}
      </svg>
      <div className="relative flex h-full flex-col items-center justify-between p-6 text-center">
        <span className="font-mono text-[0.6rem] tracking-[0.35em] text-gold/70 uppercase">{label}</span>
        <div className="space-y-2">
          <p className="font-serif text-5xl text-gold">{numeral}</p>
          <p className="font-serif text-xl leading-tight text-ink">{title}</p>
          <p className="text-[0.7rem] tracking-wide text-muted">{subtitle}</p>
        </div>
        <span className="font-mono text-[0.55rem] tracking-[0.3em] text-faint uppercase">The Architecture of Reality</span>
      </div>
    </div>
  );
}
