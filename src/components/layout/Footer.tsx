import Link from "next/link";
import { BrandMark, NAV_LINKS } from "./nav-config";

export default function Footer() {
  const year = 2026;
  return (
    <footer className="no-print mt-32 border-t border-line bg-obsidian">
      <div className="container-x grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-4">
          <BrandMark />
          <p className="max-w-sm text-sm leading-relaxed text-muted">
            Bridging human energy, universal law, and sovereign life — a systems-level philosophy for individuals and
            high-trust enterprises.
          </p>
          <p className="inline-flex items-center gap-2 font-mono text-[0.65rem] tracking-widest text-emerald uppercase">
            <span className="size-1.5 animate-pulse-gold rounded-full bg-emerald" /> All systems operational
          </p>
        </div>

        <div>
          <h2 className="eyebrow mb-4">Navigate</h2>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link href="/" className="text-muted transition hover:text-gold">Home</Link>
            </li>
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-muted transition hover:text-gold">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/checkout" className="text-muted transition hover:text-gold">
                Sovereign Checkout
              </Link>
            </li>
            <li>
              <Link href="/operator" className="text-muted transition hover:text-gold flex items-center gap-1.5">
                <span>🔒</span> Operator Vault (Jeremy Ashe)
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="eyebrow mb-4">The Trilogy</h2>
          <ul className="space-y-2.5 text-sm">
            <li><Link href="/library#master-blueprint" className="text-muted transition hover:text-gold">I · The Master Blueprint</Link></li>
            <li><Link href="/library#genesis-lens" className="text-muted transition hover:text-gold">II · The Genesis Lens</Link></li>
            <li><Link href="/library#the-covenant" className="text-muted transition hover:text-gold">III · The Covenant</Link></li>
          </ul>
        </div>
      </div>

      <div className="hairline" />
      <div className="container-x flex flex-col gap-4 py-8 text-xs leading-relaxed text-faint md:flex-row md:justify-between">
        <p>© {year} The Architecture of Reality. All rights reserved.</p>
        <p className="max-w-2xl md:text-right">
          Operational disclaimer: content and diagnostics are educational and philosophical in nature. They are not
          medical, psychological, legal, or financial advice. Consult a qualified professional for your specific
          circumstances.
        </p>
      </div>
    </footer>
  );
}
