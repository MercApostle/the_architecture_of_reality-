"use client";

import React, { useEffect, useState } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";

export interface BookingTierOption {
  id: "15min" | "30min";
  calLink: string;
  durationLabel: string;
  durationMinutes: number;
  price: number;
  title: string;
  subtitle: string;
  description: string;
}

const BOOKING_TIERS: BookingTierOption[] = [
  {
    id: "15min",
    calLink: "jeremy-ashe-u8qpu7/15min",
    durationLabel: "15-Min Intro ($20 CAD)",
    durationMinutes: 15,
    price: 20,
    title: "15-Minute Intro Strategy Call",
    subtitle: "Initial Systems & Energy Alignment Consultation",
    description:
      "A direct 15-minute 1-on-1 private consultation with author Jeremy Ashe. We review your daily operational cadence, pinpoint your primary energy and time leaks, and lock in an immediate containment directive.",
  },
  {
    id: "30min",
    calLink: "jeremy-ashe-u8qpu7/30min",
    durationLabel: "30-Min Strategy ($35 CAD)",
    durationMinutes: 30,
    price: 35,
    title: "30-Minute In-Depth Strategy Call",
    subtitle: "Diagnostic Review & Sovereign Schedule Calibration",
    description:
      "A comprehensive 30-minute 1-on-1 private video call with Jeremy Ashe on his calendar. Deep-dive into your 12-question Energy & Time Audit results, isolate chronic friction points across Mind, Body, and Soul, and map out your customized 72-Hour Calibration Directive.",
  },
];

const LEGACY_GOLD = "#C5A880";
const LEGACY_GOLD_HOVER = "#DFBA87";

interface SovereignBookingWidgetProps {
  initialTierId?: "15min" | "30min";
}

export default function SovereignBookingWidget({
  initialTierId = "15min",
}: SovereignBookingWidgetProps) {
  const [activeTier, setActiveTier] = useState<BookingTierOption>(
    BOOKING_TIERS.find((t) => t.id === initialTierId) || BOOKING_TIERS[0]
  );
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    (async function initCal() {
      try {
        const cal = await getCalApi();
        if (!isMounted) return;

        // Inject UI configuration: Force dark mode, month_view layout, and map brand colors to legacy gold
        cal("ui", {
          theme: "dark",
          styles: {
            branding: {
              brandColor: LEGACY_GOLD,
            },
          },
          cssVarsPerTheme: {
            dark: {
              "cal-brand": LEGACY_GOLD,
              "cal-brand-emphasis": LEGACY_GOLD_HOVER,
              "cal-brand-text": "#0B0D11",
              "cal-brand-subtle": "#171A21",
              "cal-border-booker": "#2A303C",
            },
            light: {
              "cal-brand": LEGACY_GOLD,
            },
          },
          hideEventTypeDetails: false,
          layout: "month_view",
        });

        setIsLoaded(true);
      } catch (err) {
        console.warn("Cal.com embed initialization notice:", err);
        if (isMounted) setIsLoaded(true);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [activeTier.calLink]);

  const directBookingUrl = `https://cal.com/${activeTier.calLink}`;

  return (
    <section className="relative w-full py-10 sm:py-16 md:py-20 bg-[#07080A] text-[#F5F5F7] overflow-x-hidden selection:bg-[#C5A880]/30 selection:text-white">
      {/* Background Ambient Lighting (Dark Charcoal / Obsidian Glow) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] md:w-[900px] h-[350px] bg-gradient-to-b from-[#C5A880]/10 via-[#13171F]/40 to-transparent blur-3xl opacity-70" />
        <div className="absolute top-1/3 -left-48 w-96 h-96 bg-[#0E1219]/80 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-48 w-96 h-96 bg-[#161B26]/60 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Introduction Card with subtle Legacy Gold Top Border */}
        <div className="relative rounded-2xl bg-[#0D0F14] border border-stone-800/90 shadow-2xl p-6 sm:p-8 md:p-10 mb-8 overflow-hidden border-t-2 border-t-[#C5A880] shadow-[0_-6px_35px_-8px_rgba(197,168,128,0.18)]">
          {/* Subtle Inner Accent Gradient */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#C5A880]/10 via-transparent to-transparent pointer-events-none" />

          {/* Session Selector Tabs — Responsive Mobile & Desktop Layout */}
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-stone-800/80">
            <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-[#161A22] border border-[#C5A880]/40 text-[#C5A880] font-mono text-[11px] sm:text-xs tracking-wider uppercase shadow-inner self-start">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880] animate-pulse" />
              Strategic Advisory · Private Calibration
            </div>

            {/* Duration Switcher */}
            <div className="flex items-center p-1 rounded-xl bg-[#08090C] border border-stone-800 w-full sm:w-auto">
              {BOOKING_TIERS.map((tier) => {
                const isActive = activeTier.id === tier.id;
                return (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => {
                      if (activeTier.id !== tier.id) {
                        setIsLoaded(false);
                        setActiveTier(tier);
                      }
                    }}
                    className={`flex-1 sm:flex-initial px-3 sm:px-3.5 py-2 sm:py-1.5 rounded-lg font-mono text-xs tracking-wider transition duration-200 cursor-pointer flex items-center justify-center gap-2 ${
                      isActive
                        ? "border border-gold/70 bg-gradient-to-b from-gold/25 to-gold/10 text-gold font-semibold shadow-[0_0_12px_rgba(212,175,55,0.3)] ring-1 ring-gold/40"
                        : "border border-transparent text-stone-400 hover:text-stone-200 hover:bg-stone-800/50"
                    }`}
                  >
                    <span>{tier.durationMinutes} Min</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-black/50 text-[#DFBA87] border border-stone-800">
                      ${tier.price}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="max-w-2xl">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#F5F5F7] tracking-tight leading-tight">
                {activeTier.title}
              </h1>

              <p className="mt-2 text-sm sm:text-base text-stone-300 font-sans leading-relaxed">
                {activeTier.subtitle}
              </p>

              <p className="mt-4 text-xs sm:text-sm text-stone-400 font-sans leading-relaxed">
                {activeTier.description}
              </p>
            </div>

            {/* Fee & Protocol Pillar */}
            <div className="flex md:flex-col items-center md:items-end justify-between md:justify-start gap-3 p-4 rounded-xl bg-[#08090C] border border-[#C5A880]/20 min-w-[200px]">
              <div className="text-left md:text-right">
                <div className="text-[11px] font-mono uppercase tracking-wider text-stone-400">
                  Consultation Fee
                </div>
                <div className="text-2xl sm:text-3xl font-serif font-semibold text-[#DFBA87]">
                  ${activeTier.price} <span className="text-xs font-mono text-stone-400 font-normal">CAD</span>
                </div>
              </div>
              <div className="text-right">
                <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-mono uppercase tracking-wider bg-[#C5A880]/15 text-[#DFBA87] border border-[#C5A880]/30">
                  {activeTier.durationMinutes} Minutes
                </span>
                <div className="text-[11px] text-stone-400 mt-1 font-sans">
                  Gated natively via Stripe
                </div>
              </div>
            </div>
          </div>

          {/* Three Key Assurance Badges */}
          <div className="mt-8 pt-6 border-t border-stone-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-stone-300 font-sans">
            <div className="flex items-center gap-2.5">
              <svg className="w-4 h-4 text-[#C5A880] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Live schedule sync & real-time slots</span>
            </div>
            <div className="flex items-center gap-2.5">
              <svg className="w-4 h-4 text-[#C5A880] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Cal.com native ${activeTier.price} CAD Stripe checkout</span>
            </div>
            <div className="flex items-center gap-2.5">
              <svg className="w-4 h-4 text-[#C5A880] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <span>Instant encrypted Google Meet link</span>
            </div>
          </div>
        </div>

        {/* The Native Cal.com Responsive Embed Container */}
        <div className="relative rounded-2xl bg-[#0A0C10] border border-stone-800 shadow-2xl overflow-hidden border-t-2 border-t-[#C5A880]/80 shadow-[0_8px_35px_rgba(0,0,0,0.85)]">
          {/* Top Bar for Enterprise Trust / Brand Context */}
          <div className="px-5 py-3.5 bg-[#0D0F14] border-b border-stone-800/80 flex items-center justify-between text-xs text-stone-400 font-mono">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400/90" />
              <span className="text-stone-300 font-medium">Cal.com Sovereign Booker</span>
              <span className="text-stone-500 hidden sm:inline">· {activeTier.durationLabel}</span>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={directBookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#C5A880] hover:text-[#DFBA87] transition-colors underline decoration-[#C5A880]/40 underline-offset-4 flex items-center gap-1"
              >
                <span>Direct Window</span>
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>

          {/* Cal.com Component Embed Wrapper */}
          <div
            className="w-full relative bg-[#07080A] min-h-[640px] sm:min-h-[700px] overflow-hidden"
            style={{
              // CSS Variables mapped to Legacy Gold
              ["--cal-brand" as string]: LEGACY_GOLD,
              ["--cal-brand-emphasis" as string]: LEGACY_GOLD_HOVER,
              ["--cal-brand-text" as string]: "#0B0D11",
              ["--cal-brand-subtle" as string]: "#161922",
            }}
          >
            {/* Elegant obsidian loading placeholder while Cal initializes */}
            {!isLoaded && (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#07080A] text-[#C5A880] p-6 text-center">
                <div className="w-8 h-8 rounded-full border-2 border-[#C5A880]/30 border-t-[#C5A880] animate-spin mb-4" />
                <div className="font-mono text-xs uppercase tracking-widest text-stone-300">
                  Initializing Sovereign Booker…
                </div>
                <div className="text-[11px] text-stone-400 mt-1">
                  Loading encrypted {activeTier.durationMinutes}-min calendar & native ${activeTier.price} CAD checkout
                </div>
              </div>
            )}

            {/* Cal.com React Embed Component */}
            <Cal
              key={activeTier.calLink}
              calLink={activeTier.calLink}
              style={{
                width: "100%",
                height: "100%",
                minHeight: "680px",
                overflow: "auto",
                backgroundColor: "#07080A",
                colorScheme: "dark",
              }}
              config={{
                layout: "month_view",
                theme: "dark",
              }}
              initConfig={{
                uiDebug: false,
              }}
            />
          </div>

          {/* Footer Security & Info Strip */}
          <div className="px-5 py-3.5 bg-[#0D0F14] border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left text-xs text-stone-400 font-sans">
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-[#C5A880]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Secured with 256-bit encryption. The ${activeTier.price} CAD fee is processed natively within the booking form.
            </span>
            <span className="font-mono text-[11px] text-stone-500">
              Session link dispatched upon confirmation
            </span>
          </div>
        </div>

        {/* Mobile Viewport Optimization Note (e.g., iPhone 16 Pro Max viewport width) */}
        <div className="mt-8 text-center">
          <p className="text-xs text-stone-400 font-sans">
            Optimized for desktop and flagship mobile viewports. If you encounter strict third-party cookie restrictions, you can also{" "}
            <a
              href={directBookingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#C5A880] hover:text-[#DFBA87] underline decoration-[#C5A880]/50 transition-colors"
            >
              reserve directly in a standalone secure window
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
