import type { AuditQuestion, Drift, Sector } from "@/lib/types";

export const SECTORS: Record<
  Sector,
  { label: string; title: string; description: string; glyph: string }
> = {
  mind: {
    label: "Mind",
    title: "Cognitive Clarity",
    description: "Clarity of signal vs. overthinking, rumination, and the energy cost of ego maintenance.",
    glyph: "◬",
  },
  body: {
    label: "Body",
    title: "Biological Regulation",
    description: "Nervous-system regulation, sleep architecture, and sustainable pacing across the 80-hour work month.",
    glyph: "◉",
  },
  soul: {
    label: "Soul",
    title: "Relational Integrity",
    description: "Relational trust, congruence between word and action, and the strength of sovereign boundaries.",
    glyph: "✧",
  },
};

export const SECTOR_ORDER: Sector[] = ["mind", "body", "soul"];

/** 12 questions — 4 per sector. Each answer is scored -2..+2 (sector range -8..+8). */
export const AUDIT_QUESTIONS: AuditQuestion[] = [
  // ── MIND ──────────────────────────────────────────────
  {
    id: "m1",
    sector: "mind",
    prompt: "I execute high-leverage work without chronic procrastination or compulsive distraction.",
    low: "Strongly Disagree (−2)",
    high: "Strongly Agree (+2)",
  },
  {
    id: "m2",
    sector: "mind",
    prompt: "My mind easily powers down after hours without running racing anxiety simulations.",
    low: "Strongly Disagree (−2)",
    high: "Strongly Agree (+2)",
  },
  {
    id: "m3",
    sector: "mind",
    prompt: "I maintain zero hidden pretenses or double standards that require defensive mental upkeep.",
    low: "Strongly Disagree (−2)",
    high: "Strongly Agree (+2)",
  },
  {
    id: "m4",
    sector: "mind",
    prompt: "Decisions are grounded in objective reality rather than ego-defense or fear of judgment.",
    low: "Strongly Disagree (−2)",
    high: "Strongly Agree (+2)",
  },
  // ── BODY ──────────────────────────────────────────────
  {
    id: "b1",
    sector: "body",
    prompt: "I sleep deeply, wake up restored, and stay free of middle-of-the-night cortisol spikes.",
    low: "Strongly Disagree (−2)",
    high: "Strongly Agree (+2)",
  },
  {
    id: "b2",
    sector: "body",
    prompt: "My body is free of chronic clenching (jaw tightness, locked neck/shoulders, gut tension).",
    low: "Strongly Disagree (−2)",
    high: "Strongly Agree (+2)",
  },
  {
    id: "b3",
    sector: "body",
    prompt: "I respect biological work limits (targeting a 20-hr focus week) without artificial stimulant reliance.",
    low: "Strongly Disagree (−2)",
    high: "Strongly Agree (+2)",
  },
  {
    id: "b4",
    sector: "body",
    prompt: "I enforce a non-negotiable weekly rest block where all strategy and operations shut down.",
    low: "Strongly Disagree (−2)",
    high: "Strongly Agree (+2)",
  },
  // ── SOUL ──────────────────────────────────────────────
  {
    id: "s1",
    sector: "soul",
    prompt: "My home and key relationships operate on calm transparency rather than eggshell-walking.",
    low: "Strongly Disagree (−2)",
    high: "Strongly Agree (+2)",
  },
  {
    id: "s2",
    sector: "soul",
    prompt: "My private daily habits completely mirror the standards I publicly stand for.",
    low: "Strongly Disagree (−2)",
    high: "Strongly Agree (+2)",
  },
  {
    id: "s3",
    sector: "soul",
    prompt: "I operate on mutual value creation rather than extracting energy or time from others.",
    low: "Strongly Disagree (−2)",
    high: "Strongly Agree (+2)",
  },
  {
    id: "s4",
    sector: "soul",
    prompt: "I set clean boundaries without feeling passive-aggressive guilt or resentment.",
    low: "Strongly Disagree (−2)",
    high: "Strongly Agree (+2)",
  },
];

export const SCALE: { value: number; label: string }[] = [
  { value: -2, label: "Strongly Disagree" },
  { value: -1, label: "Disagree" },
  { value: 0, label: "Neutral" },
  { value: 1, label: "Agree" },
  { value: 2, label: "Strongly Agree" },
];

export const DRIFT_MODES: Record<Drift, { title: string; subtitle: string; tagline: string; signs: string[] }> = {
  forcing: {
    title: "The Forcing Polarity",
    subtitle: "Excess Force & Over-Control",
    tagline: "Under sustained stress, you push harder against resistance, attempting to muscle through friction.",
    signs: [
      "Micromanagement, compulsive control, and artificial urgency",
      "Sleep and biological rhythms sacrificed for sheer output",
      "Spikes in irritation, resentment, and chronic somatic clenching",
    ],
  },
  passive: {
    title: "The Passive Polarity",
    subtitle: "Energy Leak & Avoidance",
    tagline: "Under sustained stress, you withdraw, numb, or defer, leaking energy and time through inaction.",
    signs: [
      "Chronic procrastination, avoidance loops, and decision paralysis",
      "Saying yes externally when boundaries demand a firm no",
      "Escaping into low-value busywork, excessive media, or distraction",
    ],
  },
};
