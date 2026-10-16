import { Suspense } from "react";
import type { Metadata } from "next";
import SovereignBookingWidget from "@/components/booking/SovereignBookingWidget";

export const metadata: Metadata = {
  title: "Meet with Jeremy Ashe · 15-Minute Intro Strategy Call ($20)",
  description:
    "Schedule a direct 15-minute 1-on-1 strategy call with Jeremy Ashe. Systems and energy alignment debrief, time leak containment, and sovereign executive architecture.",
};

export default function BookPage() {
  return (
    <div className="space-y-4">
      <div className="bg-charcoal/90 border-b border-line py-3">
        <div className="container-x flex items-center justify-between text-xs font-mono">
          <span className="text-muted">Enterprise Founder Vetting:</span>
          <a href="/meet" className="text-gold hover:underline flex items-center gap-1 font-semibold">
            <span>Take the Founder Vetting Application on /meet &rarr;</span>
          </a>
        </div>
      </div>
      <Suspense
        fallback={
          <div className="min-h-screen bg-[#07080A] py-24 text-center font-mono text-sm text-[#C5A880]">
            Loading sovereign calendar…
          </div>
        }
      >
        <SovereignBookingWidget />
      </Suspense>
    </div>
  );
}
