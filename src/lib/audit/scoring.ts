import { AUDIT_QUESTIONS, SECTOR_ORDER } from "@/lib/data/audit";
import type { AuditResponse, Drift, Sector, SectorScores } from "@/lib/types";

export const SECTOR_MAX = 8;
export const SECTOR_MIN = -8;
export const TOTAL_MAX = SECTOR_MAX * 3;

export type Answers = Record<string, number>;

/** Sum answers by sector. Unanswered questions contribute 0. */
export function scoreAnswers(answers: Answers): SectorScores {
  const scores: SectorScores = { mind: 0, body: 0, soul: 0, total: 0 };
  for (const q of AUDIT_QUESTIONS) {
    const v = answers[q.id];
    if (typeof v === "number") {
      scores[q.sector] += v;
      scores.total += v;
    }
  }
  return scores;
}

/** Lowest sector; ties broken by canonical order (mind → body → soul). */
export function lowestSector(scores: SectorScores): Sector {
  return SECTOR_ORDER.reduce((low, s) => (scores[s] < scores[low] ? s : low), SECTOR_ORDER[0]);
}

export type AlignmentBand = "critical" | "leaking" | "stable" | "aligned";

export function bandFor(score: number): AlignmentBand {
  if (score <= -4) return "critical";
  if (score < 1) return "leaking";
  if (score < 5) return "stable";
  return "aligned";
}

export const BAND_META: Record<AlignmentBand, { label: string; color: string }> = {
  critical: { label: "Critical Leak", color: "var(--color-ember)" },
  leaking: { label: "Energy Leak", color: "#d98b3a" },
  stable: { label: "Stable", color: "var(--color-gold)" },
  aligned: { label: "Aligned", color: "var(--color-emerald)" },
};

/** Map a -2..+2 (or any range) value to a heat colour. */
export function heatColor(value: number, min: number, max: number): string {
  const t = (value - min) / (max - min); // 0..1
  if (t < 0.5) {
    const p = Math.round((t / 0.5) * 100);
    return `color-mix(in oklab, var(--color-gold) ${p}%, var(--color-ember))`;
  }
  const p = Math.round(((t - 0.5) / 0.5) * 100);
  return `color-mix(in oklab, var(--color-emerald) ${p}%, var(--color-gold))`;
}

/** Percent position of a sector score on a -8..+8 track. */
export function toPercent(score: number, min = SECTOR_MIN, max = SECTOR_MAX) {
  return ((score - min) / (max - min)) * 100;
}

export function buildResponse(answers: Answers, drift: Drift): AuditResponse {
  const scores = scoreAnswers(answers);
  return {
    id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}`,
    timestamp: new Date().toISOString(),
    scores,
    drift,
    lowestSector: lowestSector(scores),
    answers,
  };
}

/* ──────────────────────────────────────────────────────────────────────────
   72-Hour Calibration Directives — keyed by lowest sector × stress drift.
   ────────────────────────────────────────────────────────────────────────── */

export interface DirectivePhase {
  window: string;
  title: string;
  actions: string[];
}

export interface Directive {
  headline: string;
  principle: string;
  phases: DirectivePhase[];
}

export const DIRECTIVES: Record<Sector, Record<Drift, Directive>> = {
  mind: {
    forcing: {
      headline: "Stop the Energy Leaks",
      principle: "Principle of Mentalism — the field follows the frame.",
      phases: [
        { window: "0–24h", title: "Signal Fast", actions: ["No news, feeds, or inbox for the first 90 minutes after waking.", "Write every open loop onto one page. Circle only three."] },
        { window: "24–48h", title: "Decide & Release", actions: ["Make the single decision you have been over-engineering. Set a 20-minute limit.", "Delegate or delete one task you are holding for control."] },
        { window: "48–72h", title: "Re-frame", actions: ["Journal: 'What am I protecting by over-thinking this?'", "Schedule one block of unstructured thinking time — no output required."] },
      ],
    },
    passive: {
      headline: "Restore Directional Clarity",
      principle: "Principle of Cause & Effect — motion precedes motivation.",
      phases: [
        { window: "0–24h", title: "One Clear Vector", actions: ["Name the one outcome that would make this week a win.", "Complete a 25-minute focused sprint on it before noon."] },
        { window: "24–48h", title: "Close Loops", actions: ["Reply to, decline, or archive five messages you've been avoiding.", "Replace one hour of passive scrolling with reading Book I, Ch. 1."] },
        { window: "48–72h", title: "Commit Publicly", actions: ["Tell one trusted person what you will finish by Friday.", "Review: what did action reveal that thinking could not?"] },
      ],
    },
  },
  body: {
    forcing: {
      headline: "Lower the Load, Rebuild the Vessel",
      principle: "Principle of Rhythm — every surge demands a return.",
      phases: [
        { window: "0–24h", title: "Hard Stop", actions: ["Set a non-negotiable shutdown time tonight. Devices out of the bedroom.", "Caffeine cut-off at 12:00."] },
        { window: "24–48h", title: "Down-Regulate", actions: ["10 minutes of extended-exhale breathing (4-in, 8-out) twice today.", "A 30-minute walk outdoors without audio."] },
        { window: "48–72h", title: "Re-Pace", actions: ["Map next month's working hours. Cap at roughly 80 focused hours.", "Block one full recovery day on the calendar now."] },
      ],
    },
    passive: {
      headline: "Re-Ignite the Biological Baseline",
      principle: "Principle of Vibration — raise the frequency through movement.",
      phases: [
        { window: "0–24h", title: "Light & Motion", actions: ["Morning sunlight within 30 minutes of waking — 10 minutes minimum.", "20 minutes of movement that raises your heart rate."] },
        { window: "24–48h", title: "Fuel the Vessel", actions: ["Prepare tomorrow's first meal tonight — protein-forward, unprocessed.", "Same bedtime and wake time as yesterday (±30 min)."] },
        { window: "48–72h", title: "Anchor the Rhythm", actions: ["Choose one daily physical anchor and attach it to an existing habit.", "Log energy (1–10) at 10am, 2pm, and 8pm to find your leak window."] },
      ],
    },
  },
  soul: {
    forcing: {
      headline: "Soften Control, Rebuild Trust",
      principle: "Principle of Polarity — strength without receptivity becomes brittle.",
      phases: [
        { window: "0–24h", title: "Listen First", actions: ["In your next three conversations, ask one more question before giving an answer.", "Identify where you are forcing an outcome in a relationship."] },
        { window: "24–48h", title: "Repair", actions: ["Make one clean apology or acknowledgement — no qualifiers.", "Honor one small promise exactly as stated."] },
        { window: "48–72h", title: "Covenant Check", actions: ["Write the three commitments your closest people can rely on you for.", "Remove one obligation that violates your congruence."] },
      ],
    },
    passive: {
      headline: "Reclaim the Sovereign Boundary",
      principle: "Principle of Correspondence — as within, so without.",
      phases: [
        { window: "0–24h", title: "Name the Leak", actions: ["List the relationships or obligations where you say yes but mean no.", "Choose one to address this week."] },
        { window: "24–48h", title: "Hold the Line", actions: ["Deliver one clear, kind 'no' using: 'I'm not able to commit to that.'", "Spend 30 minutes on work that genuinely expresses your purpose."] },
        { window: "48–72h", title: "Congruence Audit", actions: ["Compare your calendar to your stated values. Mark the gaps.", "Reach out to one high-trust person and deepen the connection."] },
      ],
    },
  },
};
