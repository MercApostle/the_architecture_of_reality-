/** Shared (server-safe) navigation config + brand mark. */

export interface NavLinkItem {
  href: string;
  label: string;          // Main uppercase label for stacked pill (e.g. "WHY", "LIBRARY")
  displayName: string;    // Human-readable title for footer and accessibility (e.g. "The Why", "Library")
  topTag?: string;        // Small stacked text above (e.g. "THE")
  subTag?: string;        // Small stacked text underneath (e.g. "FREE", "LMS", "80H")
  subTagColor?: string;   // Accent color for tag (e.g. "text-emerald", "text-gold")
  description?: string;
}

export const NAV_LINKS: NavLinkItem[] = [
  {
    href: "/why",
    label: "WHY",
    displayName: "The Why",
    topTag: "THE",
    description: "The Architect's Thesis & Bella Coola",
  },
  {
    href: "/library",
    label: "LIBRARY",
    displayName: "Library",
    subTag: "FREE",
    subTagColor: "text-emerald text-[0.55rem]",
    description: "4 Foundational Volumes · Browser & PDF",
  },
  {
    href: "/academy",
    label: "ACADEMY",
    displayName: "Academy",
    subTag: "LMS",
    subTagColor: "text-gold text-[0.55rem]",
    description: "8 Master Lessons & Interactive Workbooks",
  },
  {
    href: "/offers",
    label: "OFFERS",
    displayName: "Offers",
    subTag: "$50",
    subTagColor: "text-stone-400 text-[0.55rem]",
    description: "Sovereign Membership & Course Bundles",
  },
  {
    href: "/meet",
    label: "ADVISORY",
    displayName: "Advisory",
    subTag: "80H",
    subTagColor: "text-gold text-[0.55rem]",
    description: "80-Hour Work Month Vetting & Cal.com",
  },
  {
    href: "/news",
    label: "NEWS",
    displayName: "News",
    subTag: "LOGS",
    subTagColor: "text-stone-400 text-[0.55rem]",
    description: "Dispatches, Ancient Roots & Physics",
  },
  {
    href: "/portal",
    label: "PORTAL",
    displayName: "Portal",
    subTag: "HQ",
    subTagColor: "text-stone-400 text-[0.55rem]",
    description: "Private Client Command Center",
  },
  {
    href: "/contact",
    label: "CONTACT",
    displayName: "Contact",
    subTag: "DIRECT",
    subTagColor: "text-stone-400 text-[0.55rem]",
    description: "Direct Communication & Inquiry",
  },
];

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="group inline-flex items-center gap-2 select-none">
      <span className="relative grid size-8 place-items-center rounded-lg border border-gold/40 bg-gold/5 text-gold transition-all duration-300 group-hover:border-gold group-hover:bg-gold/15 group-hover:shadow-[0_0_15px_-3px_rgba(212,175,55,0.65)] group-hover:scale-105 shrink-0">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="size-4 text-gold drop-shadow-[0_0_6px_rgba(212,175,55,0.5)] transition-transform duration-300 group-hover:rotate-6"
          aria-hidden="true"
        >
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor" fillOpacity="0.25" />
        </svg>
      </span>
      {!compact && (
        <span className="flex flex-col leading-tight">
          <span className="font-mono text-[0.55rem] tracking-[0.25em] text-gold/80 uppercase font-semibold">The</span>
          <span className="font-serif text-base sm:text-lg tracking-wide text-ink font-medium group-hover:text-gold transition-colors">
            Architecture of Reality
          </span>
        </span>
      )}
    </span>
  );
}
