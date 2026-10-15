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
    checkoutUrl: "/book",
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
    checkoutUrl: "/book",
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
    id: "sovereign-operator",
    title: "The Sovereign Operator Mastery Course",
    tier: 2,
    price: 297,
    description:
      "A self-paced academy for operators who refuse to trade their vessel for their output. Master the 80-Hour Work Month and the discipline of Dynamic Balance.",
    deliverables: [
      "8 modules · 40+ lessons (video + transcripts)",
      "The 80-Hour Work Month operating system",
      "Dynamic Balance protocols for Forcing & Passive drift",
      "Quarterly re-audit with progress tracking",
      "Lifetime access & updates",
    ],
    checkoutUrl: env(process.env.NEXT_PUBLIC_CHECKOUT_COURSE),
    badge: "Flagship",
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
    checkoutUrl: env(process.env.NEXT_PUBLIC_CHECKOUT_ADVISORY),
    badge: "By application",
  },
];

export const TIER_LABELS: Record<Offer["tier"], { name: string; blurb: string }> = {
  1: { name: "Field Manuals", blurb: "Downloadable tools to start calibrating today." },
  2: { name: "Mastery Academy", blurb: "A complete, self-paced operating system." },
  3: { name: "Advisory", blurb: "Bespoke architecture for purposeful enterprises." },
};

export const getOffer = (id?: string) => OFFERS.find((o) => o.id === id);
