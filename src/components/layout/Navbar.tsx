"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BrandMark, NAV_LINKS } from "./nav-config";
import { useCart } from "@/context/CartContext";
import { useMember } from "@/context/MemberContext";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { toggleCart, itemCount } = useCart();
  const { user, isAuthenticated, logout } = useMember();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile drawer on route change.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  return (
    <header
      className={`no-print sticky top-0 z-50 border-b transition-colors duration-500 ${
        scrolled || open ? "border-line bg-obsidian/80 backdrop-blur-xl" : "border-transparent bg-transparent"
      }`}
    >
      <nav className="container-x flex h-16 items-center justify-between" aria-label="Primary">
        <Link href="/" id="nav-home" aria-label="The Architecture of Reality — Home">
          <BrandMark />
        </Link>

        {/* Navigation Tabs — Compact Gold Button Styling */}
        <ul className="hidden items-center gap-1 rounded-full border border-line/80 bg-charcoal/60 backdrop-blur-md px-1.5 py-1 md:flex shadow-inner">
          {NAV_LINKS.map((l) => {
            const active = pathname === l.href || pathname.startsWith(`${l.href}/`);
            return (
              <li key={l.href}>
                <Link
                  id={`nav-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
                  href={l.href}
                  className={`relative rounded-full px-3.5 py-1.5 font-mono text-[0.8rem] tracking-wider transition duration-200 cursor-pointer ${
                    active
                      ? "border border-gold/70 bg-gradient-to-b from-gold/25 to-gold/10 text-gold font-semibold shadow-[0_0_12px_rgba(212,175,55,0.3)] ring-1 ring-gold/40"
                      : "border border-transparent text-muted hover:text-ink hover:border-gold/30 hover:bg-gold/5 font-medium"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Log In & Sign Up / Member State */}
          {!mounted ? (
            <div className="hidden sm:flex items-center gap-2 h-7 w-20" aria-hidden="true" />
          ) : !isAuthenticated ? (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/login"
                id="nav-login-btn"
                className="font-mono text-sm text-muted hover:text-gold transition px-2.5 py-1 font-medium"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                id="nav-signup-btn"
                className="rounded-full border border-gold/70 bg-gold/10 px-3.5 py-1.5 font-mono text-[0.76rem] tracking-wider text-gold uppercase transition hover:bg-gold hover:text-obsidian hover:shadow-[0_0_12px_rgba(212,175,55,0.3)] font-semibold"
              >
                Sign Up
              </Link>
            </div>
          ) : user ? (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                href="/members"
                id="nav-member-badge"
                title={`Member: ${user.name} (${user.points} pts)`}
                className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3.5 py-1.5 font-mono text-[0.76rem] tracking-wider text-gold hover:border-gold hover:bg-gold/20 transition font-medium"
              >
                <span className="size-2 rounded-full bg-emerald animate-pulse-gold" />
                <span className="max-w-[95px] truncate font-semibold">{user.name.split(" ")[0]}</span>
                <span className="bg-gold/20 px-2 py-0.5 rounded-full text-[0.68rem] font-bold text-gold">
                  ⭐ {user.points}
                </span>
              </Link>
              <button
                type="button"
                id="nav-logout-btn"
                onClick={logout}
                className="font-mono text-xs text-muted hover:text-gold transition cursor-pointer px-1 py-1 font-medium"
                title="Sign Out"
              >
                Sign Out
              </button>
            </div>
          ) : null}

          {/* Shopping Cart Button — Sleek Gold Button, Icon Only, No Wording */}
          <button
            id="nav-cart-btn"
            type="button"
            onClick={toggleCart}
            className={`relative size-9 rounded-full border transition duration-300 flex items-center justify-center cursor-pointer group shadow-[0_0_15px_-3px_rgba(212,175,55,0.3)] hover:scale-105 active:scale-95 ${
              itemCount > 0
                ? "border-gold bg-gradient-to-b from-gold/25 via-gold/15 to-transparent text-gold ring-1 ring-gold/40"
                : "border-gold/40 bg-gold/5 text-gold/80 hover:border-gold hover:text-gold hover:bg-gold/15"
            }`}
            aria-label={`Shopping cart${itemCount > 0 ? ` (${itemCount} items)` : ""}`}
            title="View Shopping Cart"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4 transition-transform group-hover:scale-110"
              aria-hidden="true"
            >
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>

            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 size-4 rounded-full bg-gold text-obsidian font-mono text-[0.58rem] font-bold flex items-center justify-center shadow-[0_0_8px_rgba(212,175,55,0.8)] border border-obsidian">
                {itemCount}
              </span>
            )}
          </button>

          <Link
            href="/audit"
            id="nav-cta-audit"
            className="hidden rounded-full border border-gold/70 bg-gold/10 px-3.5 py-1 font-mono text-[0.68rem] tracking-widest text-gold uppercase transition hover:bg-gold hover:text-obsidian hover:shadow-[0_0_14px_rgba(212,175,55,0.4)] sm:inline-flex font-semibold"
          >
            Audit
          </Link>
          <button
            id="nav-menu-toggle"
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label="Toggle menu"
            className="grid size-9 place-items-center rounded-lg border border-line text-ink md:hidden"
          >
            <span className="relative block h-3 w-4">
              <span className={`absolute left-0 h-px w-4 bg-current transition ${open ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute top-1.5 left-0 h-px w-4 bg-current transition ${open ? "opacity-0" : ""}`} />
              <span className={`absolute left-0 h-px w-4 bg-current transition ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
            </span>
          </button>
        </div>
      </nav>

      {open && (
        <div className="border-t border-line md:hidden">
          <ul className="container-x flex flex-col py-4">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="block py-3 font-serif text-xl text-ink hover:text-gold">
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="pt-3 space-y-2">
              {!mounted ? (
                <div className="h-9 pb-1" aria-hidden="true" />
              ) : !isAuthenticated ? (
                <div className="grid grid-cols-2 gap-2 pb-1">
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="btn-ghost text-center text-xs py-2 text-ink"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setOpen(false)}
                    className="btn-gold text-center text-xs py-2"
                  >
                    Sign Up
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 pb-1">
                  <Link
                    href="/members"
                    onClick={() => setOpen(false)}
                    className="btn-gold text-center text-xs py-2 truncate"
                  >
                    Vault ({user?.name.split(" ")[0]})
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      setOpen(false);
                    }}
                    className="btn-ghost text-center text-xs py-2 text-muted"
                  >
                    Sign Out
                  </button>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  toggleCart();
                }}
                className="btn-gold w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold cursor-pointer"
                aria-label="View shopping cart"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="size-4"
                  aria-hidden="true"
                >
                  <circle cx="8" cy="21" r="1" />
                  <circle cx="19" cy="21" r="1" />
                  <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                </svg>
                {itemCount > 0 && (
                  <span className="font-mono text-xs font-bold">
                    ({itemCount})
                  </span>
                )}
              </button>
              <Link href="/audit" className="btn-ghost w-full text-center block text-xs py-2 text-gold border-gold/40">
                Audit
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
