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
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#07080A] py-24 text-center font-mono text-sm text-[#C5A880]">
          Loading sovereign calendar…
        </div>
      }
    >
      <SovereignBookingWidget />
    </Suspense>
  );
}
