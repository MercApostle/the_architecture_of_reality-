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
      className={`no-print sticky top-0 z-50 transition-colors duration-500 ${
        scrolled || open ? "border-b border-line bg-obsidian/95 backdrop-blur-xl shadow-2xl" : "border-b border-white/5 bg-obsidian/85 backdrop-blur-md"
      }`}
    >
      {/* ── UPPER LEVEL (TOP UTILITY SHELF — DESKTOP ONLY) ───────────── */}
      <div className="hidden md:block border-b border-white/5 bg-[#050608]/90 text-[0.72rem] font-mono">
        <div className="container-x h-8 flex items-center justify-between">
          {/* Left: Brand Axiom / Operational Status */}
          <div className="flex items-center gap-3 text-muted">
            <span className="inline-flex items-center gap-1.5 text-gold/90 font-medium">
              <span className="size-1.5 rounded-full bg-emerald animate-pulse-gold" />
              <span>Universal Law &middot; Sovereign Systems</span>
            </span>
            <span className="text-white/10">|</span>
            <span className="text-stone-400 hidden lg:inline">
              Foundation Volume &amp; Trilogy Available in Reading Room
            </span>
          </div>

          {/* Right: Elevated Utility Cluster (Audit · Membership · Cart) */}
          <div className="flex items-center gap-3.5">
            {/* 12-Question Energy Audit Link */}
            <Link
              href="/audit"
              id="top-shelf-audit"
              className="text-stone-300 hover:text-gold transition flex items-center gap-1 font-medium"
            >
              <span>⚡</span>
              <span>12-Question Audit</span>
            </Link>

            <span className="text-white/15">|</span>

            {/* Membership / Account / Log In State */}
            {!mounted ? (
              <div className="w-16 h-4 bg-white/5 rounded animate-pulse" />
            ) : !isAuthenticated ? (
              <div className="flex items-center gap-2.5">
                <Link
                  href="/login"
                  id="nav-login-btn"
                  className="text-stone-300 hover:text-gold transition font-medium"
                >
                  Log In
                </Link>
                <span className="text-white/15">&middot;</span>
                <Link
                  href="/signup"
                  id="nav-signup-btn"
                  className="text-gold hover:text-gold-bright font-semibold transition"
                >
                  Sign Up
                </Link>
              </div>
            ) : user ? (
              <div className="flex items-center gap-2.5">
                <Link
                  href="/members"
                  id="nav-member-badge"
                  title={`Member: ${user.name} (${user.points} pts)`}
                  className="inline-flex items-center gap-1.5 text-stone-200 hover:text-gold transition font-medium"
                >
                  <span className="size-1.5 rounded-full bg-emerald" />
                  <span className="font-semibold text-gold truncate max-w-[110px]">{user.name.split(" ")[0]}</span>
                  <span className="text-[0.65rem] text-gold/90 bg-gold/15 px-1.5 py-0.5 rounded border border-gold/30">
                    ⭐ {user.points}
                  </span>
                </Link>

                {(user.email?.toLowerCase().includes("jeremyashe") || user.role === "operator" || user.name === "MercApostle") && (
                  <Link
                    href="/operator"
                    id="nav-operator-badge"
                    title="Jeremy Ashe Operator Vault"
                    className="text-gold bg-gold/15 hover:bg-gold/30 px-2 py-0.5 rounded text-[0.65rem] font-bold border border-gold/50 transition shadow-sm"
                  >
                    ⚡ Vault
                  </Link>
                )}

                <button
                  type="button"
                  id="nav-logout-btn"
                  onClick={logout}
                  className="text-stone-400 hover:text-gold transition cursor-pointer text-[0.7rem]"
                  title="Sign Out"
                >
                  Sign Out
                </button>
              </div>
            ) : null}

            <span className="text-white/15">|</span>

            {/* Shopping Cart Button */}
            <button
              id="nav-cart-btn"
              type="button"
              onClick={toggleCart}
              className="flex items-center gap-1.5 text-stone-200 hover:text-gold transition cursor-pointer group"
              title="View Shopping Cart"
              aria-label={`Shopping cart${itemCount > 0 ? ` (${itemCount} items)` : ""}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-3.5 text-gold group-hover:scale-110 transition-transform"
                aria-hidden="true"
              >
                <circle cx="8" cy="21" r="1" />
                <circle cx="19" cy="21" r="1" />
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
              </svg>
              <span className="text-stone-300 group-hover:text-gold font-medium">Cart</span>
              <span
                className={`px-1.5 py-0.5 rounded-full font-mono text-[0.62rem] font-bold transition-all ${
                  itemCount > 0
                    ? "bg-gold text-obsidian shadow-[0_0_8px_rgba(212,175,55,0.7)]"
                    : "bg-white/10 text-stone-400"
                }`}
              >
                {itemCount}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ── LOWER LEVEL (MAIN NAVIGATION BAR) ─────────────────────────── */}
      <nav className="container-x flex h-16 items-center justify-between" aria-label="Primary">
        <Link href="/" id="nav-home" onClick={() => setOpen(false)} aria-label="The Architecture of Reality — Home">
          <BrandMark />
        </Link>

        {/* Navigation Tabs — Generous, Uncluttered Editorial Layout */}
        <ul className="hidden items-center gap-1 rounded-full border border-line/80 bg-charcoal/60 backdrop-blur-md px-2 py-1 md:flex shadow-inner">
          {NAV_LINKS.map((l) => {
            const active = pathname === l.href || pathname.startsWith(`${l.href}/`);
            return (
              <li key={l.href}>
                <Link
                  id={`nav-${l.label.toLowerCase().replace(/\s+/g, "-")}`}
                  href={l.href}
                  className={`relative rounded-full px-3.5 py-1.5 font-mono text-[0.82rem] tracking-wider transition duration-200 cursor-pointer ${
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

        {/* Mobile Action Controls: Cart Button + Hamburger Drawer (md:hidden) */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            id="nav-cart-btn-mobile"
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

          <button
            id="nav-menu-toggle"
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-label="Toggle menu"
            className="grid size-9 place-items-center rounded-lg border border-line text-ink"
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
            {NAV_LINKS.map((l) => {
              const active = pathname === l.href || pathname.startsWith(`${l.href}/`);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={`block py-3 font-serif text-xl transition flex items-center justify-between ${
                      active ? "text-gold font-medium pl-2 border-l-2 border-gold" : "text-ink hover:text-gold"
                    }`}
                  >
                    <span>{l.label}</span>
                    {active && <span className="font-mono text-xs text-gold/80">Active</span>}
                  </Link>
                </li>
              );
            })}
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
              <Link
                href="/audit"
                onClick={() => setOpen(false)}
                className="btn-ghost w-full text-center block text-xs py-2 text-gold border-gold/40"
              >
                Audit
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
