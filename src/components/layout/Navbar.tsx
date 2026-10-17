"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BrandMark, NAV_LINKS } from "./nav-config";
import { useCart } from "@/context/CartContext";
import { useMember } from "@/context/MemberContext";
import siteSettingsData from "@/data/site-settings.json";

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [announcementDismissed, setAnnouncementDismissed] = useState(false);
  const { toggleCart, itemCount } = useCart();
  const { user, isAuthenticated, logout } = useMember();
  const [mounted, setMounted] = useState(false);

  // Monitor scroll state for backdrop styling
  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close mobile drawer on route change or Escape key
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  // Primary desktop navigation links (curated to 6 high-value destinations)
  const desktopNavLinks = NAV_LINKS.filter(
    (l) => l.href !== "/portal" && l.href !== "/contact"
  );

  return (
    <header
      className={`no-print sticky top-0 z-50 transition-all duration-300 ${
        scrolled || open
          ? "border-b border-white/10 bg-[#07080a]/95 backdrop-blur-xl shadow-2xl shadow-black/80"
          : "border-b border-white/5 bg-[#07080a]/85 backdrop-blur-md"
      }`}
    >
      {/* ── TOP ANNOUNCEMENT TICKER (COMPACT & SLIM) ────────────────── */}
      {siteSettingsData.announcementActive && !announcementDismissed && (
        <div className="relative border-b border-gold/20 bg-gradient-to-r from-[#0a0c12] via-[#141824] to-[#0a0c12] py-1 px-4 text-center font-mono text-[0.68rem] text-stone-300">
          <div className="container-x flex items-center justify-center gap-2">
            <span className="inline-block size-1.5 rounded-full bg-emerald animate-pulse" />
            <span className="inline-block rounded border border-gold/40 bg-gold/15 px-1.5 py-0.2 text-[0.58rem] font-bold uppercase tracking-wider text-gold">
              {siteSettingsData.announcementBadge || "ANNOUNCEMENT"}
            </span>
            <Link
              href={siteSettingsData.announcementLink || "/meet"}
              onClick={() => setOpen(false)}
              className="truncate text-stone-200 transition-colors hover:text-gold"
            >
              <span className="font-medium">{siteSettingsData.announcementText}</span>
              <span className="ml-1 text-gold/80">&rarr;</span>
            </Link>
          </div>
          <button
            type="button"
            onClick={() => setAnnouncementDismissed(true)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200 p-0.5 text-xs transition"
            aria-label="Dismiss announcement"
            title="Dismiss announcement"
          >
            &times;
          </button>
        </div>
      )}

      {/* ── MAIN NAVIGATION ROW (SQUISHED & COMPRESSED TIGHTER HEADER) ── */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-15 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Brand Mark */}
        <Link
          href="/"
          id="nav-home"
          onClick={() => setOpen(false)}
          aria-label="The Architecture of Reality — Home"
          className="shrink-0"
        >
          <BrandMark />
        </Link>

        {/* Center: Desktop Navigation Bar with Stacked Subtags (lg:flex) */}
        <nav
          className="hidden lg:flex items-center gap-1 rounded-full border border-white/10 bg-[#11141c]/80 backdrop-blur-md p-1 shadow-inner"
          aria-label="Primary Navigation"
        >
          {desktopNavLinks.map((l) => {
            const active = pathname === l.href || pathname.startsWith(`${l.href}/`);
            return (
              <Link
                key={l.href}
                id={`nav-${l.displayName.toLowerCase().replace(/\s+/g, "-")}`}
                href={l.href}
                className={`group relative flex flex-col items-center justify-center min-w-[58px] sm:min-w-[64px] h-10 px-2.5 rounded-full transition-all duration-200 cursor-pointer ${
                  active
                    ? "border border-gold/60 bg-gradient-to-b from-gold/25 via-gold/15 to-transparent text-gold shadow-[0_0_12px_rgba(212,175,55,0.25)] ring-1 ring-gold/30"
                    : "border border-transparent text-stone-300 hover:text-white hover:border-white/10 hover:bg-white/5"
                }`}
                title={l.description || l.displayName}
              >
                {/* Top Tag (e.g. THE over WHY) */}
                {l.topTag && (
                  <span className="text-[0.48rem] font-mono tracking-[0.2em] text-gold/80 uppercase font-semibold leading-none mb-0.5">
                    {l.topTag}
                  </span>
                )}

                {/* Primary Button Label */}
                <span className="text-[0.72rem] font-mono tracking-wider font-bold leading-none">
                  {l.label}
                </span>

                {/* Sub Tag (e.g. FREE under LIBRARY, LMS under ACADEMY, 80H under ADVISORY) */}
                {l.subTag && (
                  <span
                    className={`font-mono tracking-[0.14em] uppercase font-bold leading-none mt-0.5 ${
                      l.subTagColor || "text-stone-400 text-[0.5rem]"
                    }`}
                  >
                    {l.subTag}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right: Desktop Action Cluster (lg:flex) */}
        <div className="hidden lg:flex items-center gap-2.5 shrink-0">
          {/* Energy Audit Button CTA */}
          <Link
            href="/audit"
            id="nav-audit-cta"
            className="group relative inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-gold via-[#e5c158] to-gold px-3 py-1.5 font-mono text-[0.68rem] font-bold uppercase tracking-wider text-obsidian transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_18px_rgba(212,175,55,0.45)] active:scale-95 shadow-sm shadow-gold/20"
          >
            <span>⚡</span>
            <span>Energy Audit</span>
          </Link>

          {/* User Account / Membership Status Pill */}
          {!mounted ? (
            <div className="h-7 w-20 rounded-full bg-white/5 animate-pulse" />
          ) : !isAuthenticated ? (
            <div className="flex items-center gap-1.5 border-l border-white/10 pl-2.5">
              <Link
                href="/login"
                id="nav-login-link"
                className="font-mono text-xs text-stone-300 hover:text-gold transition font-medium px-2 py-1"
              >
                Log In
              </Link>
              <Link
                href="/signup"
                id="nav-signup-link"
                className="font-mono text-xs text-gold hover:text-gold-bright transition font-semibold rounded-full border border-gold/40 bg-gold/5 hover:bg-gold/15 px-2.5 py-0.5"
              >
                Join
              </Link>
            </div>
          ) : user ? (
            <div className="flex items-center gap-2 border-l border-white/10 pl-2.5">
              {/* Member Pill: ONLY GREEN DOT + JEREMY (POINTS REMOVED PER USER INSTRUCTION) */}
              <Link
                href="/members"
                id="nav-member-hub"
                title={`Logged in as ${user.name} · Open Member Hub`}
                className="inline-flex items-center gap-1.5 rounded-full border border-emerald/40 bg-emerald/10 px-2.5 py-1 text-xs transition hover:border-emerald-400 hover:bg-emerald/20"
              >
                <span className="size-2 rounded-full bg-emerald animate-pulse" />
                <span className="font-mono text-xs font-semibold text-emerald-400 truncate max-w-[90px]">
                  {user.name.split(" ")[0]}
                </span>
              </Link>

              {/* Jeremy Ashe Operator Vault Badge */}
              {(user.email?.toLowerCase().includes("jeremyashe") ||
                user.role === "operator" ||
                user.name === "MercApostle") && (
                <Link
                  href="/operator"
                  id="nav-operator-badge"
                  title="Jeremy Ashe Operator Vault"
                  className="rounded-full border border-gold/50 bg-gold/15 px-2 py-0.5 font-mono text-[0.62rem] font-bold text-gold shadow-sm transition hover:bg-gold/30"
                >
                  ⚡ Vault
                </Link>
              )}

              <button
                type="button"
                onClick={logout}
                title="Sign Out"
                className="text-stone-400 hover:text-rose-400 font-mono text-[0.68rem] transition cursor-pointer px-1"
              >
                Sign Out
              </button>
            </div>
          ) : null}

          {/* Shopping Cart Button with Live Counter */}
          <button
            id="nav-cart-btn"
            type="button"
            onClick={toggleCart}
            className={`relative flex items-center justify-center size-8.5 rounded-full border transition-all duration-300 cursor-pointer group ${
              itemCount > 0
                ? "border-gold bg-gold/15 text-gold shadow-[0_0_12px_rgba(212,175,55,0.3)] hover:scale-105"
                : "border-white/15 bg-white/5 text-stone-300 hover:border-gold/50 hover:text-gold hover:bg-gold/5"
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
              className="size-3.5 text-gold group-hover:scale-110 transition-transform"
              aria-hidden="true"
            >
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>

            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 size-4 rounded-full bg-gold text-obsidian font-mono text-[0.55rem] font-bold flex items-center justify-center shadow-[0_0_8px_rgba(212,175,55,0.9)] border border-obsidian animate-scaleIn">
                {itemCount}
              </span>
            )}
          </button>
        </div>

        {/* ── MOBILE & TABLET ACTION BAR (lg:hidden) ───────────────────── */}
        <div className="flex items-center gap-2 lg:hidden">
          {/* Quick Cart Trigger */}
          <button
            id="nav-cart-btn-mobile"
            type="button"
            onClick={toggleCart}
            className={`relative size-8.5 rounded-full border flex items-center justify-center transition-all duration-300 cursor-pointer ${
              itemCount > 0
                ? "border-gold bg-gold/20 text-gold shadow-[0_0_10px_rgba(212,175,55,0.4)]"
                : "border-white/15 bg-white/5 text-stone-300 hover:text-gold"
            }`}
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
              className="size-3.5 text-gold"
              aria-hidden="true"
            >
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 size-3.5 rounded-full bg-gold text-obsidian font-mono text-[0.52rem] font-bold flex items-center justify-center shadow-gold">
                {itemCount}
              </span>
            )}
          </button>

          {/* Animated Hamburger Toggle */}
          <button
            id="nav-menu-toggle"
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-expanded={open}
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            className="size-8.5 rounded-lg border border-white/15 bg-white/5 flex flex-col items-center justify-center gap-1 text-stone-200 transition hover:border-gold/50 hover:text-gold active:scale-95 cursor-pointer"
          >
            <span
              className={`h-0.5 w-4 rounded-full bg-current transition-all duration-300 ${
                open ? "translate-y-1.5 rotate-45" : ""
              }`}
            />
            <span
              className={`h-0.5 w-4 rounded-full bg-current transition-all duration-300 ${
                open ? "opacity-0 scale-0" : ""
              }`}
            />
            <span
              className={`h-0.5 w-4 rounded-full bg-current transition-all duration-300 ${
                open ? "-translate-y-1.5 -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* ── MOBILE FULL-SCREEN SLIDE-OVER SHEET (lg:hidden) ───────────── */}
      {open && (
        <div
          id="mobile-nav-drawer"
          className="fixed inset-x-0 top-14 sm:top-15 bottom-0 z-40 bg-[#07080a]/98 backdrop-blur-2xl flex flex-col justify-between overflow-y-auto px-4 py-5 overscroll-contain animate-fadeIn border-t border-white/10"
        >
          <div className="space-y-5">
            {/* Primary Action Feature Cards */}
            <div className="grid gap-2.5">
              {/* ⚡ 12-Question Energy Audit Spotlight Card */}
              <Link
                href="/audit"
                onClick={() => setOpen(false)}
                className="group relative block p-3.5 rounded-xl border border-gold/40 bg-gradient-to-r from-gold/15 via-[#12151e] to-[#0d1017] shadow-[0_0_15px_rgba(212,175,55,0.15)] transition-all active:scale-[0.98]"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[0.62rem] uppercase tracking-widest text-gold font-bold flex items-center gap-1.5">
                    <span>⚡</span>
                    <span>Diagnostic Engine</span>
                  </span>
                  <span className="text-gold text-xs font-mono group-hover:translate-x-1 transition-transform">
                    Start Audit &rarr;
                  </span>
                </div>
                <h3 className="font-serif text-base text-white font-medium">12-Question Energy Audit</h3>
                <p className="text-[0.72rem] text-muted mt-0.5">
                  Diagnose Mind, Body &amp; Soul friction · Receive 72h Directive
                </p>
              </Link>

              {/* 📖 The Free Reading Room Spotlight Card */}
              <Link
                href="/library"
                onClick={() => setOpen(false)}
                className="group flex items-center justify-between p-3 rounded-xl border border-white/10 bg-[#11141c]/80 transition-all hover:border-gold/40 active:scale-[0.98]"
              >
                <div className="flex items-center gap-2.5">
                  <span className="size-8 rounded-lg bg-gold/10 border border-gold/30 flex items-center justify-center text-xs shrink-0">
                    📖
                  </span>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-serif text-sm text-white font-medium">The Reading Room</h4>
                      <span className="text-[0.55rem] font-mono bg-emerald/20 text-emerald border border-emerald/30 px-1 rounded font-bold">
                        100% Free
                      </span>
                    </div>
                    <p className="text-[0.68rem] text-muted">Foundation Volume &amp; Trilogy (Browser + PDF)</p>
                  </div>
                </div>
                <span className="text-stone-400 text-xs font-mono group-hover:text-gold transition-colors">
                  &rarr;
                </span>
              </Link>
            </div>

            {/* Core Navigation Links */}
            <div className="space-y-1">
              <span className="block font-mono text-[0.6rem] uppercase tracking-[0.2em] text-muted px-2 mb-1.5 font-bold">
                Platform Navigation
              </span>
              <ul className="space-y-1">
                {NAV_LINKS.map((l) => {
                  const active = pathname === l.href || pathname.startsWith(`${l.href}/`);
                  return (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        onClick={() => setOpen(false)}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-all ${
                          active
                            ? "bg-gold/15 text-gold border border-gold/40 font-semibold"
                            : "text-stone-200 hover:text-white hover:bg-white/5 font-medium"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-serif text-sm tracking-wide">
                            {l.displayName}
                          </span>
                          {l.subTag && (
                            <span
                              className={`text-[0.55rem] font-mono uppercase tracking-wider px-1 py-0.2 rounded border border-white/10 ${
                                l.subTagColor || "text-gold bg-gold/10"
                              }`}
                            >
                              {l.subTag}
                            </span>
                          )}
                          {l.topTag && (
                            <span className="text-[0.55rem] font-mono uppercase tracking-wider px-1 py-0.2 rounded border border-gold/30 text-gold bg-gold/10">
                              {l.topTag}
                            </span>
                          )}
                        </div>
                        <span className="text-stone-400 font-mono text-xs">&rarr;</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Drawer Footer: User Account & Identity State (NO POINTS) */}
          <div className="pt-4 border-t border-white/10 mt-4 space-y-2.5">
            {!mounted ? (
              <div className="h-9 rounded-lg bg-white/5 animate-pulse" />
            ) : !isAuthenticated ? (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="btn-ghost text-center text-xs py-2 text-stone-200 border border-white/10 rounded-lg hover:border-gold/40"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className="btn-gold text-center text-xs py-2 rounded-lg font-bold"
                >
                  Join Sovereign
                </Link>
              </div>
            ) : user ? (
              <div className="p-3 rounded-xl border border-emerald/40 bg-emerald/5 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-emerald animate-pulse" />
                    <div>
                      {/* ONLY GREEN JEREMY - NO POINTS PER USER INSTRUCTION */}
                      <p className="font-mono text-xs text-emerald-400 font-bold">{user.name}</p>
                      <p className="text-[0.62rem] text-muted font-mono">{user.email}</p>
                    </div>
                  </div>
                  <span className="text-[0.58rem] font-mono uppercase tracking-widest text-emerald-400 border border-emerald/40 px-1.5 py-0.5 rounded bg-emerald/10 font-bold">
                    ACTIVE
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-white/10">
                  <Link
                    href="/members"
                    onClick={() => setOpen(false)}
                    className="btn-gold text-center text-xs py-1.5 rounded font-semibold"
                  >
                    Member Hub
                  </Link>

                  {(user.email?.toLowerCase().includes("jeremyashe") ||
                    user.role === "operator" ||
                    user.name === "MercApostle") ? (
                    <Link
                      href="/operator"
                      onClick={() => setOpen(false)}
                      className="btn-ghost text-center text-xs py-1.5 rounded text-gold border-gold/50 bg-gold/10 font-bold"
                    >
                      ⚡ Operator
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setOpen(false);
                      }}
                      className="btn-ghost text-center text-xs py-1.5 rounded text-stone-400 hover:text-rose-400"
                    >
                      Sign Out
                    </button>
                  )}
                </div>
              </div>
            ) : null}

            {/* Shopping Cart Trigger Bar */}
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                toggleCart();
              }}
              className="w-full flex items-center justify-between p-2.5 rounded-lg border border-white/10 bg-white/5 hover:border-gold/30 transition text-stone-200 cursor-pointer"
            >
              <span className="flex items-center gap-2 font-mono text-xs">
                <span>🛒</span>
                <span>Review Shopping Cart</span>
              </span>
              <span className="rounded-full bg-gold/20 text-gold px-2 py-0.2 font-mono text-[0.68rem] font-bold border border-gold/40">
                {itemCount} {itemCount === 1 ? "item" : "items"}
              </span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
