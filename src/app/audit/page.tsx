import type { Metadata } from "next";
import InteractiveAuditAssessment from "@/components/audit/InteractiveAuditAssessment";
import { PageHero } from "@/components/ui/primitives";

export const metadata: Metadata = {
  title: "Energy & Time Alignment Audit",
  description:
    "Assess cognitive clarity, biological regulation, and relational trust across 12 diagnostic dimensions with real-time scoring, polarity drift analysis, and custom 72-hour directives.",
};

export default function AuditPage() {
  return (
    <>
      <PageHero
        eyebrow="Interactive Assessment"
        title={
          <>
            Energy &amp; Time <span className="text-gradient-gold italic">Audit</span>
          </>
        }
        lede="Identify where friction accumulates, detect where your energy and time leak, and receive an automated 72-Hour Calibration Directive tailored to your primary leak."
      />
      <InteractiveAuditAssessment />
    </>
  );
}
