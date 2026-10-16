import type { Offer } from "@/lib/types";

/**
 * Checkout URLs come from env vars so Stripe Payment Links or Lemon Squeezy
 * checkout links can be added in Vercel without a code change.
 * Leave empty to show a "Join the waitlist" flow instead.
 */
const env = (v: string | undefined) => v ?? "";

export const OFFERS: Offer[] = [
  {
    id: "intro-call",
    title: "15-Min Intro Call with Jeremy",
    tier: 1,
    price: 20,
    description:
      "A direct 15-minute 1-on-1 introductory session on Google Meet to evaluate your energy audit and schedule alignment, clarify key principles, or evaluate advisory collaboration.",
    deliverables: [
      "15-minute 1-on-1 private Google Meet consultation",
      "Direct evaluation of your energy audit & time leaks",
      "Live calendar booking & native $20 CAD checkout via Cal.com",
    ],
    checkoutUrl: "/meet",
    badge: "15 Min · $20 CAD",
  },
  {
    id: "30min-strategy-call",
    title: "30-Min Strategy Call with Jeremy",
    tier: 1,
    price: 35,
    description:
      "A comprehensive 30-minute 1-on-1 private video consultation on Google Meet to analyze your Energy & Time Audit results, isolate chronic operational friction, and map out your 72-Hour Calibration Directive.",
    deliverables: [
      "30-minute private 1-on-1 Google Meet consultation",
      "In-depth analysis of Mind, Body & Soul alignment scores",
      "Custom 72-Hour Calibration Directive & containment protocols",
      "Live calendar booking & native $35 CAD checkout via Cal.com",
    ],
    checkoutUrl: "/meet",
    badge: "30 Min · $35 CAD",
  },
  {
    id: "field-manual",
    title: "The Energy & Time Field Manual",
    tier: 1,
    price: 27,
    description:
      "A tactical, print-ready manual distilling the Master Blueprint into daily calibration protocols for mind, body, and soul.",
    deliverables: [
      "64-page PDF field manual",
      "7 Universal Principles quick-reference card",
      "72-Hour Calibration templates (all 6 variants)",
    ],
    checkoutUrl: env(process.env.NEXT_PUBLIC_CHECKOUT_FIELD_MANUAL),
  },
  {
    id: "companion-workbook",
    title: "Trilogy Companion Workbooks",
    tier: 1,
    price: 47,
    description:
      "Guided workbooks for all three books — reflection prompts, the Tripartite Fruit Test worksheets, and the 10 Operational Firewalls audit.",
    deliverables: [
      "3 interactive PDF workbooks",
      "Tripartite Fruit Test decision worksheets",
      "Enterprise Firewall self-assessment",
    ],
    checkoutUrl: env(process.env.NEXT_PUBLIC_CHECKOUT_WORKBOOKS),
    badge: "Best value",
  },
  {
    id: "members-access",
    title: "Sovereign Membership Access",
    tier: 1,
    price: 50,
    description:
      "Full digital vault access, 8-module mastery curriculum, and three 30-minute 1-on-1 video conference meetings with Jeremy Ashe.",
    deliverables: [
      "Three (3) 30-minute 1-on-1 video conference calls with Jeremy Ashe",
      "Full unabridged PDF downloads of all 3 Trilogy books",
      "8-Module Sovereign Operator video & audio curriculum",
      "+200 Gamification Points & Sovereign Member Badge",
    ],
    checkoutUrl: "/members",
    badge: "3 Video Calls · $50 CAD",
  },
  {
    id: "master-blueprint-course",
    title: "The Master Blueprint Course (Book I)",
    tier: 2,
    price: 147,
    description:
      "Calibrating the Vessel & The 80-Hour Work Month. Master biological nervous system regulation, cognitive elimination, and transition your business to the 80-hour work month.",
    deliverables: [
      "6 multi-modal lessons (HD video embeds + audio lectures)",
      "Interactive in-browser workbooks with permanent Sovereign Vault persistence",
      "The 80-Hour Work Month Master Template & Somatic Protocols",
      "Lifetime access & permanent syllabus updates",
    ],
    checkoutUrl: "/academy/master-blueprint-course/biological-drag-and-limits",
    badge: "Book I · $147 CAD",
  },
  {
    id: "genesis-lens-course",
    title: "The Genesis Lens Diagnostic Mastery (Book II)",
    tier: 2,
    price: 197,
    description:
      "The 7-Fold Code & The Tripartite Fruit Test. Master the empirical diagnostic engine of creation. Test every partnership, signal, and strategy across Mind, Body, and Soul.",
    deliverables: [
      "6 multi-modal lessons (video + audio lectures)",
      "The Tripartite Fruit Test decision matrix & firmament protocols",
      "Interactive in-browser worksheets with cloud auto-save",
      "Full unabridged Book II vector edition",
    ],
    checkoutUrl: "/academy/genesis-lens-course/placing-the-firmament",
    badge: "Book II · $197 CAD",
  },
  {
    id: "covenant-systems-course",
    title: "Covenant Enterprise Architecture (Book III)",
    tier: 2,
    price: 247,
    description:
      "High-Trust Systems & The 10 Operational Firewalls. Transform your enterprise from an extractive bureaucracy into a high-trust, load-bearing sovereign organization.",
    deliverables: [
      "6 multi-modal lessons (video + audio lectures)",
      "The 10 Operational Firewalls governance checklist",
      "Interactive covenants worksheets with permanent cloud persistence",
      "Generational endurance and team covenant blueprints",
    ],
    checkoutUrl: "/academy/covenant-systems-course/covenants-vs-extractive-contracts",
    badge: "Book III · $247 CAD",
  },
  {
    id: "trilogy-mastery-bundle",
    title: "The Sovereign Trinity Pass (Books I, II, & III)",
    tier: 2,
    price: 347,
    description:
      "All 3 Flagship Academy Curricula, 18 interactive in-browser workbooks, full digital vault access, and asynchronous calibration access to Jeremy Ashe.",
    deliverables: [
      "All 3 Flagship Courses (Master Blueprint, Genesis Lens, Covenant Systems)",
      "18 Interactive In-Browser Workbooks saved to your Sovereign Vault",
      "Full unabridged PDF downloads of all 3 Trilogy Books",
      "Save $244 compared to individual course enrollments",
    ],
    checkoutUrl: "/academy",
    badge: "Full Trinity Pass · Save $244",
  },
  {
    id: "systems-sprint",
    title: "Sovereign Systems Sprint",
    tier: 3,
    price: null,
    description:
      "Private 1-on-1 advisory for founders and leaders building purposeful, high-trust enterprises. We architect your operating system end-to-end.",
    deliverables: [
      "Leadership & team energy & systems diagnostic",
      "Enterprise covenant + 10 Firewalls implementation",
      "Six weeks of 1-on-1 architecture sessions",
      "Async advisory access between sessions",
    ],
    checkoutUrl: "/meet",
    badge: "By application",
  },
];

export const TIER_LABELS: Record<Offer["tier"], { name: string; blurb: string }> = {
  1: { name: "Field Manuals & Consultations", blurb: "Downloadable tools and direct strategy calibrations." },
  2: { name: "Sovereign Academy Curricula", blurb: "Self-paced multi-modal operating systems and interactive workbooks." },
  3: { name: "Enterprise Advisory", blurb: "Bespoke systems architecture for purposeful leaders." },
};

export const getOffer = (id?: string) => OFFERS.find((o) => o.id === id);
