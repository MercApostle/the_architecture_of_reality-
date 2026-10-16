export interface SessionType {
  id: string;
  title: string;
  subtitle: string;
  durationMinutes: number;
  price: number | null; // null = free / included with audit
  description: string;
  deliverables: string[];
  location: string;
}

export const GOOGLE_CALENDAR_URL = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_URL || "https://calendar.app.google/E5bhgY2739jpbAcQ8";
export const CAL_COM_SLUG = process.env.NEXT_PUBLIC_CALCOM_LINK || process.env.NEXT_PUBLIC_CAL_LINK || "jeremy-ashe-u8qpu7/15min";
export const CAL_COM_URL = process.env.NEXT_PUBLIC_CAL_URL || `https://cal.com/${CAL_COM_SLUG}`;

export const CAL_COM_15MIN_SLUG = process.env.NEXT_PUBLIC_CALCOM_LINK || process.env.NEXT_PUBLIC_CAL_LINK || "jeremy-ashe-u8qpu7/15min";
export const CAL_COM_15MIN_URL = `https://cal.com/${CAL_COM_15MIN_SLUG}`;
export const CAL_COM_30MIN_SLUG = process.env.NEXT_PUBLIC_CALCOM_30MIN_LINK || "jeremy-ashe-u8qpu7/30min";
export const CAL_COM_30MIN_URL = `https://cal.com/${CAL_COM_30MIN_SLUG}`;

export const SESSION_TYPES: SessionType[] = [
  {
    id: "intro-call",
    title: "15-Min Intro Call",
    subtitle: "Initial Systems & Energy Alignment Consultation",
    durationMinutes: 15,
    price: 20,
    description:
      "A direct 15-minute 1-on-1 introductory session with Jeremy Ashe to evaluate your energy audit and schedule alignment, clarify key principles, and discuss advisory collaboration.",
    deliverables: [
      "15-minute private 1-on-1 Google Meet consultation",
      "Direct evaluation of your energy audit & polarity drift",
      "Immediate feedback on stopping your primary energy and time leaks",
      "Live calendar reservation & native $20 CAD payment via Cal.com",
    ],
    location: "Google Meet (Encrypted Video Link via Cal.com)",
  },
  {
    id: "strategy-call-30",
    title: "30-Min Strategy Call",
    subtitle: "In-Depth Diagnostic Review & Systems Calibration",
    durationMinutes: 30,
    price: 35,
    description:
      "A comprehensive 30-minute 1-on-1 video call with Jeremy Ashe on his calendar to review your audit results, stop chronic energy leaks, and design your customized sovereign operating schedule.",
    deliverables: [
      "30-minute private 1-on-1 Google Meet consultation",
      "Review of Mind, Body & Soul sector energy scores",
      "Analysis of your Forcing vs. Passive polarity drift",
      "Custom 72-hour operational containment protocol & directive",
      "Live calendar reservation & native $35 CAD payment via Cal.com",
    ],
    location: "Google Meet (Encrypted Video Link via Cal.com)",
  },
  {
    id: "systems-sprint-intake",
    title: "Tier 3 Systems Sprint Advisory Intake",
    subtitle: "45-Minute Enterprise Alignment & Covenant Consultation",
    durationMinutes: 45,
    price: null,
    description:
      "For founders, operators, and executive leaders considering the Tier 3 Sovereign Systems Sprint. We evaluate your organization's trust infrastructure, firewall integrity, and leadership capacity.",
    deliverables: [
      "Enterprise trust firewall diagnostic review",
      "Scope and roadmap for 6-week architecture sprint",
      "Custom covenant structure recommendations",
      "Assessment of organizational fit (max 2 clients per quarter)",
    ],
    location: "Google Meet (Executive Private Room)",
  },
  {
    id: "executive-calibration",
    title: "Executive 1-on-1 Calibration Session",
    subtitle: "60-Minute Intensive Vessel & Operational Architecture",
    durationMinutes: 60,
    price: 350,
    description:
      "An intensive private architecture deep-dive for high-output operators navigating intense stress, chronic over-commitment, or relational friction in high-stakes environments.",
    deliverables: [
      "Full vessel calibration across Mind, Body, and Soul",
      "Implementation of the 80-Hour Work Month boundary system",
      "Dynamic equilibrium protocols for active crisis management",
      "Direct follow-up summary notes & recording access",
    ],
    location: "Google Meet (Encrypted Channel)",
  },
];

export interface BookedMeeting {
  id: string;
  sessionId: string;
  sessionTitle: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "10:30 AM"
  timezone: string;
  name: string;
  email: string;
  company?: string;
  notes?: string;
  meetLink: string;
  createdAt: string;
}
