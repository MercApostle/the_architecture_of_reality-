/** Shared (server-safe) navigation config + brand mark. */

export const NAV_LINKS = [
  { href: "/library", label: "Library" },
  { href: "/academy", label: "Academy" },
  { href: "/offers", label: "Offers" },
  { href: "/meet", label: "Meet" },
  { href: "/portal", label: "Portal" },
  { href: "/news", label: "News" },
  { href: "/contact", label: "Contacts" },
];

export function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="group inline-flex items-center gap-2.5">
      <span className="relative grid size-8 place-items-center rounded-lg border border-gold/40 bg-gold/5 text-gold transition group-hover:border-gold group-hover:shadow-[0_0_20px_-4px_rgba(212,175,55,0.6)]">
        <span aria-hidden className="text-base leading-none">⚡</span>
      </span>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="font-mono text-[0.58rem] tracking-[0.3em] text-muted uppercase">The</span>
          <span className="font-serif text-lg tracking-wide text-ink">Architecture of Reality</span>
        </span>
      )}
    </span>
  );
}
