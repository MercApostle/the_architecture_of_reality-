"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMember } from "@/context/MemberContext";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const isDemoMode = searchParams.get("demo_mode") === "true" || searchParams.get("demo") === "true";
  const [copied, setCopied] = useState(false);
  const { upgradeToPaidMembership } = useMember();

  useEffect(() => {
    // Elevate member account upon confirmed checkout
    upgradeToPaidMembership();
    try {
      localStorage.setItem("aor_membership_tier", "paid");
      localStorage.setItem("aor_paid_member_active", "true");
      localStorage.setItem("aor_member_points", "500");
    } catch {
      // Storage access may be restricted in private browsing
    }
  }, [upgradeToPaidMembership]);

  const copySessionId = () => {
    if (!sessionId) return;
    navigator.clipboard.writeText(sessionId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-[#07080A] text-[#F5F5F7] overflow-hidden selection:bg-[#C5A880]/30 selection:text-white">
      {/* Background Ambient Charcoal & Gold Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] md:w-[800px] h-[400px] bg-gradient-to-b from-[#C5A880]/15 via-[#13171F]/40 to-transparent blur-3xl opacity-75" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-[#0E1219]/70 rounded-full blur-3xl" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-[#161B26]/60 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-2xl w-full">
        {/* Main Sovereign Confirmation Card */}
        <div className="relative rounded-2xl bg-[#0D0F14] border border-stone-800/90 shadow-2xl p-6 sm:p-10 overflow-hidden border-t-2 border-t-[#C5A880] shadow-[0_-6px_35px_-8px_rgba(197,168,128,0.22)]">
          {/* Subtle Inner Accent Gradient */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#C5A880]/10 via-transparent to-transparent pointer-events-none" />

          {/* Gold Checkmark / Seal Emblem */}
          <div className="flex items-center justify-center w-16 h-16 mx-auto rounded-full bg-[#161A22] border border-[#C5A880]/50 shadow-[0_0_24px_rgba(197,168,128,0.3)]">
            <svg className="w-8 h-8 text-[#DFBA87]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Status Pillar Badge */}
          <div className="mt-6 flex justify-center">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161A22] border border-[#C5A880]/40 text-[#DFBA87] font-mono text-[11px] uppercase tracking-wider shadow-inner">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880] animate-pulse" />
              {isDemoMode ? "Stripe Sandbox Preview Confirmed" : "Transmission Confirmed · Access Unlocked"}
            </span>
          </div>

          {/* Primary Header */}
          <div className="mt-4 text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif text-[#F5F5F7] tracking-tight">
              Order & Calibration Confirmed
            </h1>
            <p className="mt-2 text-sm sm:text-base text-stone-300 font-sans max-w-lg mx-auto leading-relaxed">
              Your payment has been successfully recorded through Stripe. Your access covenants, digital manuals, and sovereign membership privileges are now activated.
            </p>
          </div>

          {/* Session Identification Box */}
          {sessionId && (
            <div className="mt-6 p-4 rounded-xl bg-[#08090C] border border-stone-800/80">
              <div className="flex items-center justify-between text-[11px] font-mono text-stone-400 uppercase tracking-wider mb-1.5">
                <span>Stripe Session ID</span>
                <button
                  type="button"
                  onClick={copySessionId}
                  className="text-[#C5A880] hover:text-[#DFBA87] underline cursor-pointer"
                >
                  {copied ? "Copied" : "Copy ID"}
                </button>
              </div>
              <div className="font-mono text-xs text-stone-300 break-all select-all bg-[#050608] p-2.5 rounded-lg border border-stone-800">
                {sessionId}
              </div>
            </div>
          )}

          {/* Notice if in Vercel Pending Preview Mode */}
          {isDemoMode && (
            <div className="mt-4 p-3.5 rounded-xl bg-[#151922] border border-[#C5A880]/30 text-xs text-stone-300 font-sans">
              <span className="font-mono text-[#DFBA87] font-semibold">Deployment Note:</span> This checkout preview confirmed successfully. Once your <code className="font-mono text-stone-200">STRIPE_SECRET_KEY</code> is added to Vercel/Supabase environment variables, live transactions will automatically route to your official Stripe account.
            </div>
          )}

          {/* Three Direct Next Action Cards */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link
              href="/members"
              className="group p-4 rounded-xl bg-[#08090C] border border-stone-800 hover:border-[#C5A880]/50 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-[#C5A880]">01 · Sanctuary</div>
                <div className="text-sm font-semibold text-stone-100 group-hover:text-white mt-1">Member Portal</div>
                <div className="text-[11px] text-stone-400 mt-1">Access member perks and 500 bonus points.</div>
              </div>
              <span className="text-xs font-mono text-[#C5A880] mt-3 group-hover:translate-x-0.5 transition-transform inline-block">
                Enter →
              </span>
            </Link>

            <Link
              href="/library"
              className="group p-4 rounded-xl bg-[#08090C] border border-stone-800 hover:border-[#C5A880]/50 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-[#C5A880]">02 · Texts</div>
                <div className="text-sm font-semibold text-stone-100 group-hover:text-white mt-1">Field Manuals</div>
                <div className="text-[11px] text-stone-400 mt-1">Read, download, and review digital releases.</div>
              </div>
              <span className="text-xs font-mono text-[#C5A880] mt-3 group-hover:translate-x-0.5 transition-transform inline-block">
                View Library →
              </span>
            </Link>

            <Link
              href="/book"
              className="group p-4 rounded-xl bg-[#08090C] border border-stone-800 hover:border-[#C5A880]/50 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-[#C5A880]">03 · Advisory</div>
                <div className="text-sm font-semibold text-stone-100 group-hover:text-white mt-1">Book Meeting</div>
                <div className="text-[11px] text-stone-400 mt-1">Reserve a 15 or 30-min call on Cal.com.</div>
              </div>
              <span className="text-xs font-mono text-[#C5A880] mt-3 group-hover:translate-x-0.5 transition-transform inline-block">
                Schedule →
              </span>
            </Link>
          </div>

          {/* Primary CTA Button back to Dashboard / Home */}
          <div className="mt-8 pt-6 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link
              href="/"
              className="text-xs font-mono text-stone-400 hover:text-stone-200 uppercase tracking-wider transition-colors"
            >
              ← Return to Main Terminal
            </Link>

            <Link
              href="/members"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider bg-gradient-to-b from-[#1F2430] to-[#0D1016] text-[#F5F5F7] border border-[#C5A880]/70 hover:border-[#DFBA87] hover:text-white hover:shadow-[0_0_20px_rgba(197,168,128,0.25)] transition-all cursor-pointer font-semibold"
            >
              <span>Access Member Dashboard</span>
              <span className="text-[#C5A880]">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center bg-[#07080A] text-[#F5F5F7]">
          <div className="flex items-center gap-3 font-mono text-xs text-stone-400">
            <svg className="animate-spin h-4 w-4 text-[#C5A880]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            <span>Finalizing Sovereign Transmission...</span>
          </div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
