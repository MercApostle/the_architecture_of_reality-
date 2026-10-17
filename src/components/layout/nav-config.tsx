/** Shared (server-safe) navigation config + brand mark. */

export interface NavLinkItem {
  href: string;
  label: string;
  badge?: string;
  badgeColor?: string;
  description?: string;
}

export const NAV_LINKS: NavLinkItem[] = [
  { href: "/why", label: "The Why", description: "The Architect's Thesis & Bella Coola" },
  { href: "/library", label: "Library", badge: "Free", badgeColor: "text-emerald bg-emerald/15 border-emerald/30", description: "4 Foundational Volumes · Browser & PDF" },
  { href: "/academy", label: "Academy", badge: "LMS", badgeColor: "text-gold bg-gold/15 border-gold/30", description: "8 Master Lessons & Interactive Workbooks" },
  { href: "/offers", label: "Offers", description: "Sovereign Membership & Course Bundles" },
  { href: "/meet", label: "Advisory", badge: "80h", badgeColor: "text-gold/90 bg-gold/10 border-gold/30", description: "80-Hour Work Month Vetting & Cal.com" },
  { href: "/portal", label: "Portal", description: "Private Client Command Center" },
  { href: "/news", label: "News", description: "Dispatches, Ancient Roots & Physics" },
  { href: "/contact", label: "Contact", description: "Direct Communication & Inquiry" },
];

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="group inline-flex items-center gap-3 select-none">
      <span className="relative grid size-9 place-items-center rounded-xl border border-gold/40 bg-gold/5 text-gold transition-all duration-300 group-hover:border-gold group-hover:bg-gold/15 group-hover:shadow-[0_0_20px_-3px_rgba(212,175,55,0.65)] group-hover:scale-105 shrink-0">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-4.5 text-gold drop-shadow-[0_0_8px_rgba(212,175,55,0.5)] transition-transform duration-300 group-hover:rotate-6"
          aria-hidden="true"
        >
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor" fillOpacity="0.25" />
        </svg>
      </span>
      {!compact && (
        <span className="flex flex-col leading-tight">
          <span className="font-mono text-[0.6rem] tracking-[0.28em] text-gold/80 uppercase font-semibold">The</span>
          <span className="font-serif text-lg sm:text-xl tracking-wide text-ink font-medium group-hover:text-gold transition-colors">
            Architecture of Reality
          </span>
        </span>
      )}
    </span>
  );
}
