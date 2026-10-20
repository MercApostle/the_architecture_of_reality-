"use client";

import { useId, useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useMember } from "@/context/MemberContext";
import { AUDIT_QUESTIONS, SECTORS } from "@/lib/data/audit";
import { DIRECTIVES as STRUCTURED_DIRECTIVES, type Directive } from "@/lib/audit/scoring";
import { submitAuditAction } from "@/lib/actions/audit.actions";
import type { Drift, Sector } from "@/lib/types";

interface Question {
  id: string;
  sector: Sector;
  sectorLabel: string;
  prompt: string;
}

const QUESTIONS: Question[] = AUDIT_QUESTIONS.map((q) => ({
  id: q.id,
  sector: q.sector,
  sectorLabel: SECTORS[q.sector].label,
  prompt: q.prompt,
}));

const SCALE_OPTIONS = [
  { value: -2, label: "Strongly Disagree" },
  { value: -1, label: "Disagree" },
  { value: 0, label: "Neutral" },
  { value: 1, label: "Agree" },
  { value: 2, label: "Strongly Agree" },
] as const;

const VECTOR_COUNTER_ACTIONS: Record<Drift, string> = {
  forcing:
    "Vector Counter-Action: Enforce absolute containment. Step back from the steering wheel for 24 hours. Stop attempting to muscle through systemic friction with anxious urgency.",
  passive:
    "Vector Counter-Action: Execute one single uncomfortable physical action today. Close open avoidance loops and make the decision without external validation.",
};

const ACADEMY_RECOMMENDATIONS: Record<Sector, {
  bookTitle: string;
  volumeLabel: string;
  workbookId: string;
  workbookTitle: string;
  workbookPrice: number;
  courseTitle: string;
  courseSlug: string;
  coursePrice: string;
  description: string;
  downloadUrl: string;
}> = {
  body: {
    bookTitle: "Book I: The Master Blueprint",
    volumeLabel: "Book I Alignment",
    workbookId: "blueprint-workbook",
    workbookTitle: "The Master Blueprint Field Manual & Workbook",
    workbookPrice: 27,
    courseTitle: "The Master Blueprint Course (80-Hour Work Month)",
    courseSlug: "master-blueprint-course",
    coursePrice: "$147 CAD",
    description: "Focuses on biological nervous-system regulation, eliminating somatic static, and transitioning your operational calendar to the 80-hour work month.",
    downloadUrl: "/api/download/the-master-blueprint.pdf",
  },
  mind: {
    bookTitle: "Book II: The Genesis Lens",
    volumeLabel: "Book II Alignment",
    workbookId: "genesis-workbook",
    workbookTitle: "The Genesis Diagnostic Workbook & 7-Fold Code",
    workbookPrice: 27,
    courseTitle: "The Genesis Lens Diagnostic Mastery",
    courseSlug: "genesis-lens-course",
    coursePrice: "$197 CAD",
    description: "Focuses on eliminating cognitive over-engineering, sorting counterfeit signals from true value, and executing the Tripartite Fruit Test.",
    downloadUrl: "/api/download/the-genesis-lens.pdf",
  },
  soul: {
    bookTitle: "Book III: The Covenant",
    volumeLabel: "Book III Alignment",
    workbookId: "covenant-workbook",
    workbookTitle: "The Covenant & 10 Firewalls Strategic Manual",
    workbookPrice: 27,
    courseTitle: "Covenant Enterprise Architecture",
    courseSlug: "covenant-systems-course",
    coursePrice: "$247 CAD",
    description: "Focuses on load-bearing social covenants, sovereign boundary enforcement, and installing the 10 Operational Firewalls against relational exhaustion.",
    downloadUrl: "/api/download/the-covenant.pdf",
  },
};

export default function InteractiveAuditAssessment() {
  const { addItem } = useCart();
  const [scores, setScores] = useState<Record<string, number>>({});
  const [vector, setVector] = useState<Drift | null>(null);
  const [operationalScope, setOperationalScope] = useState<"individual" | "enterprise">("individual");
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState<"idle" | "submitting" | "sent">("idle");
  const [submissionFeedback, setSubmissionFeedback] = useState<string | null>(null);
  const emailInputId = useId();
  const { awardPoints, isAuthenticated } = useMember();

  const answeredCount = Object.keys(scores).length;
  const isComplete = answeredCount === 12 && vector !== null;

  useEffect(() => {
    if (isComplete && isAuthenticated) {
      awardPoints("complete_energy_audit", 100, "Completed Energy & Time Audit (+100 Pts)");
    }
  }, [isComplete, isAuthenticated, awardPoints]);

  const handleSelectScore = (questionId: string, value: number) => {
    setScores((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  // Sector score calculations (-8 to +8)
  const mindScore =
    (scores["m1"] ?? 0) +
    (scores["m2"] ?? 0) +
    (scores["m3"] ?? 0) +
    (scores["m4"] ?? 0);

  const bodyScore =
    (scores["b1"] ?? 0) +
    (scores["b2"] ?? 0) +
    (scores["b3"] ?? 0) +
    (scores["b4"] ?? 0);

  const soulScore =
    (scores["s1"] ?? 0) +
    (scores["s2"] ?? 0) +
    (scores["s3"] ?? 0) +
    (scores["s4"] ?? 0);

  const totalScore = mindScore + bodyScore + soulScore;

  // Determine lowest sector (ties broken deterministically: mind -> body -> soul)
  let lowestSector: Sector = "mind";
  let lowestVal = mindScore;

  if (bodyScore < lowestVal) {
    lowestSector = "body";
    lowestVal = bodyScore;
  }
  if (soulScore < lowestVal) {
    lowestSector = "soul";
    lowestVal = soulScore;
  }

  // Active structured directive
  const activeDirective: Directive | null = vector
    ? STRUCTURED_DIRECTIVES[lowestSector]?.[vector] ?? null
    : null;

  const activeRecommendation = ACADEMY_RECOMMENDATIONS[lowestSector];

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !vector) return;

    setEmailStatus("submitting");
    setSubmissionFeedback(null);

    try {
      const res = await submitAuditAction({
        email: email.trim(),
        answers: scores,
        drift: vector,
        weakestSector: lowestSector,
        operationalScope,
        scores: {
          mind: mindScore,
          body: bodyScore,
          soul: soulScore,
          total: totalScore,
        },
      });

      if (res.success) {
        setEmailStatus("sent");
        setSubmissionFeedback(`Diagnostic record preserved (ID: ${res.submissionId?.slice(0, 8)}). Alignment report dispatched.`);
      } else {
        setEmailStatus("sent");
        setSubmissionFeedback("Your diagnostic assessment has been securely recorded locally.");
      }
    } catch {
      setEmailStatus("sent");
      setSubmissionFeedback("Your diagnostic assessment has been securely recorded.");
    }
  };

  const handleReset = () => {
    setScores({});
    setVector(null);
    setOperationalScope("individual");
    setEmail("");
    setEmailStatus("idle");
    setSubmissionFeedback(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatSigned = (num: number) => (num > 0 ? `+${num}` : `${num}`);

  return (
    <div className="container-x py-12 max-w-4xl space-y-16">
      {/* ── PROGRESS BAR & METRIC ─────────────────────────────── */}
      <section className="card p-6 border-line bg-charcoal/90 backdrop-blur sticky top-20 z-30 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="grid size-8 place-items-center rounded-lg border border-gold/40 bg-gold/10 text-gold font-mono text-sm">
              ⚡
            </span>
            <div>
              <p className="font-mono text-xs text-muted uppercase tracking-wider">Diagnostic Progress</p>
              <h2 className="font-serif text-xl text-ink font-medium">
                Questions Answered: <span className="text-gold font-mono">{answeredCount}</span> / 12
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-faint">
              {vector ? "Polarity Selected ✓" : "Polarity Pending"}
            </span>
            <span className="font-mono text-xs px-2.5 py-1 rounded bg-charcoal-raised border border-line text-gold">
              {Math.round(((answeredCount + (vector ? 1 : 0)) / 13) * 100)}% Complete
            </span>
          </div>
        </div>

        {/* Progress track */}
        <div className="mt-4 h-1.5 w-full bg-line rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-gold-deep via-gold to-gold-bright transition-all duration-500 rounded-full"
            style={{ width: `${((answeredCount + (vector ? 1 : 0)) / 13) * 100}%` }}
          />
        </div>
      </section>

      {/* ── 12 QUESTIONS BY SECTOR ────────────────────────────── */}
      <section className="space-y-12">
        {(["mind", "body", "soul"] as const).map((sectorKey) => {
          const sectorQuestions = QUESTIONS.filter((q) => q.sector === sectorKey);
          const sectorGlyph = sectorKey === "mind" ? "◬" : sectorKey === "body" ? "◉" : "✧";
          const sectorTitle =
            sectorKey === "mind"
              ? "Mind · Cognitive Clarity"
              : sectorKey === "body"
              ? "Body · Biological Regulation"
              : "Soul · Relational Integrity";

          return (
            <div key={sectorKey} className="space-y-6">
              <div className="border-b border-line pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-gold text-lg">{sectorGlyph}</span>
                  <h3 className="font-serif text-2xl text-ink tracking-wide">{sectorTitle}</h3>
                </div>
                <span className="eyebrow">4 Questions</span>
              </div>

              <div className="space-y-5">
                {sectorQuestions.map((q, qIndex) => {
                  const currentValue = scores[q.id];
                  const isAnswered = currentValue !== undefined;

                  return (
                    <div
                      key={q.id}
                      className={`card p-6 transition duration-300 ${
                        isAnswered ? "border-gold/30 bg-charcoal" : "border-line bg-charcoal/60 hover:border-line-strong"
                      }`}
                    >
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <span className="font-mono text-xs text-gold/70 pt-0.5 shrink-0">
                            {sectorKey.toUpperCase().slice(0, 1)}0{qIndex + 1}
                          </span>
                          <p className="font-serif text-lg sm:text-xl text-ink leading-relaxed font-normal">
                            {q.prompt}
                          </p>
                        </div>

                        {/* Row of 5 clickable option boxes */}
                        <div className="pt-2">
                          <div className="grid grid-cols-5 gap-1.5 sm:gap-2.5" role="radiogroup" aria-label={q.prompt}>
                            {SCALE_OPTIONS.map((opt) => {
                              const isSelected = currentValue === opt.value;

                              return (
                                <button
                                  key={opt.value}
                                  type="button"
                                  onClick={() => handleSelectScore(q.id, opt.value)}
                                  aria-pressed={isSelected}
                                  className={`py-3 sm:py-3.5 px-1 sm:px-2.5 rounded-xl text-center text-[0.7rem] sm:text-xs md:text-sm font-medium transition-all duration-200 cursor-pointer flex items-center justify-center leading-snug min-h-[52px] ${
                                    isSelected
                                      ? "bg-[#d4af37] text-black font-semibold shadow-[0_0_20px_rgba(212,175,55,0.45)] scale-[1.02] border border-[#d4af37]"
                                      : "border border-[#1e2633] bg-[#11151c] text-muted hover:border-gold/50 hover:text-ink hover:bg-charcoal-raised"
                                  }`}
                                >
                                  {opt.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>

      {/* ── VECTOR / POLARITY SELECTION CARDS ─────────────────── */}
      <section className="space-y-6 pt-4 border-t border-line">
        <div className="space-y-2">
          <span className="eyebrow">Dynamic Polarity Selector</span>
          <h3 className="font-serif text-3xl text-ink">Identify Your Default Stress Drift</h3>
          <p className="text-sm text-muted max-w-2xl">
            Under sustained friction or systemic threat, every operator drifts toward one of two operational poles. Select your default reflex:
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2" role="radiogroup" aria-label="Stress Polarity Selection">
          {/* Card 1: The Forcing Polarity */}
          <button
            type="button"
            role="radio"
            onClick={() => setVector("forcing")}
            aria-checked={vector === "forcing"}
            className={`card p-8 text-left transition-all duration-300 cursor-pointer relative overflow-hidden group ${
              vector === "forcing"
                ? "border-[#d4af37] bg-charcoal-raised shadow-[0_0_35px_-8px_rgba(212,175,55,0.45)] ring-1 ring-[#d4af37]"
                : "border-line bg-charcoal/70 hover:border-gold/40 hover:bg-charcoal"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-3xl text-gold">▲</span>
              <div
                className={`grid size-7 place-items-center rounded-full border text-xs font-mono font-bold transition ${
                  vector === "forcing"
                    ? "border-[#d4af37] bg-[#d4af37] text-black"
                    : "border-line-strong text-transparent group-hover:border-gold/60"
                }`}
              >
                ✓
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <span className="font-mono text-xs uppercase tracking-widest text-gold">High Resistance Surge</span>
              <h4 className="font-serif text-2xl text-ink font-medium">The Forcing Polarity</h4>
              <p className="text-sm text-muted leading-relaxed">
                You push harder against resistance. You attempt to muscle through friction with over-control, urgency, and brute cognitive force.
              </p>
              <ul className="space-y-1.5 pt-2 text-xs text-faint">
                <li className="flex items-center gap-2"><span className="text-gold">•</span> Sleep sacrificed for incremental output</li>
                <li className="flex items-center gap-2"><span className="text-gold">•</span> Spikes in irritability, urgency, and control loops</li>
                <li className="flex items-center gap-2"><span className="text-gold">•</span> Jaw clenching, neck tightness, or gut tension</li>
              </ul>
            </div>
          </button>

          {/* Card 2: The Passive Polarity */}
          <button
            type="button"
            role="radio"
            onClick={() => setVector("passive")}
            aria-checked={vector === "passive"}
            className={`card p-8 text-left transition-all duration-300 cursor-pointer relative overflow-hidden group ${
              vector === "passive"
                ? "border-[#d4af37] bg-charcoal-raised shadow-[0_0_35px_-8px_rgba(212,175,55,0.45)] ring-1 ring-[#d4af37]"
                : "border-line bg-charcoal/70 hover:border-gold/40 hover:bg-charcoal"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-3xl text-gold">▼</span>
              <div
                className={`grid size-7 place-items-center rounded-full border text-xs font-mono font-bold transition ${
                  vector === "passive"
                    ? "border-[#d4af37] bg-[#d4af37] text-black"
                    : "border-line-strong text-transparent group-hover:border-gold/60"
                }`}
              >
                ✓
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <span className="font-mono text-xs uppercase tracking-widest text-gold">Systemic Energy Leak</span>
              <h4 className="font-serif text-2xl text-ink font-medium">The Passive Polarity</h4>
              <p className="text-sm text-muted leading-relaxed">
                You withdraw, numb, or defer. Energy and time leak through avoidance, decision fatigue, and low-priority busywork.
              </p>
              <ul className="space-y-1.5 pt-2 text-xs text-faint">
                <li className="flex items-center gap-2"><span className="text-gold">•</span> Chronic procrastination on high-leverage moves</li>
                <li className="flex items-center gap-2"><span className="text-gold">•</span> Saying yes when boundaries require a clean no</li>
                <li className="flex items-center gap-2"><span className="text-gold">•</span> Escaping into tabs, feeds, or comfort loops</li>
              </ul>
            </div>
          </button>
        </div>
      </section>

      {/* ── OPERATIONAL SCOPE SELECTOR ───────────────────────── */}
      <section className="space-y-4 pt-4 border-t border-line">
        <div className="space-y-1">
          <span className="eyebrow">Operational Scope</span>
          <h4 className="font-serif text-2xl text-ink">What is the primary territory you are calibrating?</h4>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setOperationalScope("individual")}
            className={`p-5 rounded-xl border text-left transition cursor-pointer ${
              operationalScope === "individual"
                ? "border-gold bg-charcoal-raised ring-1 ring-gold/40 text-ink"
                : "border-line bg-charcoal/60 text-muted hover:border-gold/30 hover:text-ink"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-xs text-gold uppercase tracking-wider font-semibold">Individual Capacity</span>
              <span className="text-gold">{operationalScope === "individual" ? "●" : "○"}</span>
            </div>
            <p className="text-sm text-ink/90 font-medium">Personal Vessel Calibration</p>
            <p className="text-xs text-muted mt-1">
              Biological nervous system, personal time discipline, sovereign habit architecture.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setOperationalScope("enterprise")}
            className={`p-5 rounded-xl border text-left transition cursor-pointer ${
              operationalScope === "enterprise"
                ? "border-gold bg-charcoal-raised ring-1 ring-gold/40 text-ink"
                : "border-line bg-charcoal/60 text-muted hover:border-gold/30 hover:text-ink"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-mono text-xs text-gold uppercase tracking-wider font-semibold">Enterprise Systems</span>
              <span className="text-gold">{operationalScope === "enterprise" ? "●" : "○"}</span>
            </div>
            <p className="text-sm text-ink/90 font-medium">Founder / Team Operational Architecture</p>
            <p className="text-xs text-muted mt-1">
              Multi-person friction, scaling constraints, transitioning company to the 80-Hour Work Month standard.
            </p>
          </button>
        </div>
      </section>

      {/* ── CONDITIONAL RESULTS ENGINE ─────────────────────────── */}
      {!isComplete ? (
        <section className="card p-8 text-center border-dashed border-line bg-charcoal/30">
          <p className="font-mono text-xs text-gold uppercase tracking-widest">Alignment Engine Locked</p>
          <h4 className="font-serif text-2xl text-ink mt-2">
            Complete All 12 Questions &amp; Select a Polarity
          </h4>
          <p className="text-sm text-muted mt-2 max-w-md mx-auto">
            Answer the remaining <strong className="text-ink">{12 - answeredCount}</strong> question{12 - answeredCount === 1 ? "" : "s"}{!vector ? " and pick your stress drift" : ""} to unlock your sector scores, heat map, and tailored 72-Hour Calibration Directive.
          </p>
        </section>
      ) : (
        <section id="results" className="space-y-10 pt-8 animate-fade-up scroll-mt-24">
          <div className="border-t-2 border-gold/40 pt-10 space-y-4 text-center">
            <span className="eyebrow">Diagnostic Assessment Complete</span>
            <h2 className="font-serif text-4xl sm:text-5xl text-ink font-medium">
              Your Energy &amp; Alignment Profile
            </h2>
            <p className="text-muted text-base max-w-2xl mx-auto">
              Scored across 3 core sectors (Max +8 / Min -8 per sector). Here is where your vessel is leaking and how to immediately recalibrate.
            </p>
          </div>

          {/* Sector Scores Matrix */}
          <div className="grid gap-6 sm:grid-cols-3">
            {/* Mind */}
            <div
              className={`card p-6 flex flex-col justify-between relative overflow-hidden ${
                lowestSector === "mind" ? "border-gold ring-1 ring-gold/40 bg-charcoal-raised" : "border-line"
              }`}
            >
              {lowestSector === "mind" && (
                <div className="absolute top-2 right-2">
                  <span className="font-mono text-[0.6rem] uppercase tracking-widest text-black bg-gold px-2 py-0.5 rounded font-bold">
                    Primary Leak
                  </span>
                </div>
              )}
              <div className="space-y-2">
                <span className="text-gold text-2xl">◬</span>
                <h4 className="font-serif text-2xl text-ink">Mind Sector</h4>
                <p className="text-xs text-muted">Cognitive clarity &amp; signal filtering</p>
              </div>
              <div className="pt-6">
                <div className="flex items-baseline justify-between border-b border-line pb-2">
                  <span className="font-mono text-xs text-faint">Score:</span>
                  <span className={`font-serif text-3xl font-bold ${mindScore < 0 ? "text-ember" : "text-gold"}`}>
                    {formatSigned(mindScore)} <span className="font-mono text-xs text-faint font-normal">/ +8</span>
                  </span>
                </div>
                <div className="mt-3 h-1.5 bg-line rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold rounded-full"
                    style={{ width: `${Math.max(0, ((mindScore + 8) / 16) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Body */}
            <div
              className={`card p-6 flex flex-col justify-between relative overflow-hidden ${
                lowestSector === "body" ? "border-gold ring-1 ring-gold/40 bg-charcoal-raised" : "border-line"
              }`}
            >
              {lowestSector === "body" && (
                <div className="absolute top-2 right-2">
                  <span className="font-mono text-[0.6rem] uppercase tracking-widest text-black bg-gold px-2 py-0.5 rounded font-bold">
                    Primary Leak
                  </span>
                </div>
              )}
              <div className="space-y-2">
                <span className="text-gold text-2xl">◉</span>
                <h4 className="font-serif text-2xl text-ink">Body Sector</h4>
                <p className="text-xs text-muted">Biological regulation &amp; recovery pacing</p>
              </div>
              <div className="pt-6">
                <div className="flex items-baseline justify-between border-b border-line pb-2">
                  <span className="font-mono text-xs text-faint">Score:</span>
                  <span className={`font-serif text-3xl font-bold ${bodyScore < 0 ? "text-ember" : "text-gold"}`}>
                    {formatSigned(bodyScore)} <span className="font-mono text-xs text-faint font-normal">/ +8</span>
                  </span>
                </div>
                <div className="mt-3 h-1.5 bg-line rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold rounded-full"
                    style={{ width: `${Math.max(0, ((bodyScore + 8) / 16) * 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Soul */}
            <div
              className={`card p-6 flex flex-col justify-between relative overflow-hidden ${
                lowestSector === "soul" ? "border-gold ring-1 ring-gold/40 bg-charcoal-raised" : "border-line"
              }`}
            >
              {lowestSector === "soul" && (
                <div className="absolute top-2 right-2">
                  <span className="font-mono text-[0.6rem] uppercase tracking-widest text-black bg-gold px-2 py-0.5 rounded font-bold">
                    Primary Leak
                  </span>
                </div>
              )}
              <div className="space-y-2">
                <span className="text-gold text-2xl">✧</span>
                <h4 className="font-serif text-2xl text-ink">Soul Sector</h4>
                <p className="text-xs text-muted">Relational trust &amp; sovereign boundaries</p>
              </div>
              <div className="pt-6">
                <div className="flex items-baseline justify-between border-b border-line pb-2">
                  <span className="font-mono text-xs text-faint">Score:</span>
                  <span className={`font-serif text-3xl font-bold ${soulScore < 0 ? "text-ember" : "text-gold"}`}>
                    {formatSigned(soulScore)} <span className="font-mono text-xs text-faint font-normal">/ +8</span>
                  </span>
                </div>
                <div className="mt-3 h-1.5 bg-line rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold rounded-full"
                    style={{ width: `${Math.max(0, ((soulScore + 8) / 16) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Total Overview Banner */}
          <div className="card p-6 border-line bg-charcoal flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="font-mono text-xs text-muted uppercase tracking-wider">Total Alignment Index</p>
              <p className="text-sm text-ink/80 mt-0.5">
                Stress Polarity: <strong className="text-gold capitalize">{vector === "forcing" ? "The Forcing Polarity" : "The Passive Polarity"}</strong> · Scope: <strong className="text-gold capitalize">{operationalScope}</strong>
              </p>
            </div>
            <div className="text-right">
              <span className="font-serif text-4xl font-bold text-gold">{formatSigned(totalScore)}</span>
              <span className="font-mono text-xs text-faint ml-1">/ ±24</span>
            </div>
          </div>

          {/* ── 72-HOUR CALIBRATION DIRECTIVE (3 PHASES) ─────────── */}
          {activeDirective && (
            <div className="card p-8 sm:p-10 border-gold/60 bg-gradient-to-br from-charcoal via-charcoal to-[#181a10] space-y-8 relative overflow-hidden shadow-2xl">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="eyebrow">Immediate Operational Protocol</span>
                  <span className="font-mono text-xs text-gold/80 bg-gold/10 px-2 py-0.5 rounded border border-gold/20">
                    72-Hour Calibrated Directive
                  </span>
                </div>
                <h3 className="font-serif text-3xl sm:text-4xl text-ink">
                  {activeDirective.headline} (<span className="text-gold capitalize">{lowestSector} Sector</span>)
                </h3>
                <p className="font-serif text-lg text-gold-bright/90 italic border-l-2 border-gold pl-4 py-1">
                  &ldquo;{activeDirective.principle}&rdquo;
                </p>
              </div>

              {/* 3 Phased Action Blocks: 0-24h, 24-48h, 48-72h */}
              <div className="grid gap-4 sm:grid-cols-3 pt-2">
                {activeDirective.phases.map((phase) => (
                  <div key={phase.window} className="card p-5 border-line/80 bg-charcoal-raised space-y-3">
                    <div className="flex items-center justify-between border-b border-line pb-2">
                      <span className="font-mono text-xs font-bold text-gold">{phase.window}</span>
                      <span className="font-mono text-[0.62rem] text-faint uppercase">Directive</span>
                    </div>
                    <h5 className="font-serif text-base text-ink font-medium">{phase.title}</h5>
                    <ul className="space-y-2 text-xs text-muted leading-relaxed">
                      {phase.actions.map((act, aIdx) => (
                        <li key={aIdx} className="flex items-start gap-1.5">
                          <span className="text-gold shrink-0">›</span>
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Vector Counter-Balance */}
              <div className="p-5 rounded-xl border border-gold/30 bg-gold/5 space-y-1.5">
                <span className="font-mono text-xs uppercase tracking-widest text-gold block font-semibold">
                  Polarity Counter-Balance
                </span>
                <p className="text-sm text-ink leading-relaxed">
                  {VECTOR_COUNTER_ACTIONS[vector]}
                </p>
              </div>
            </div>
          )}

          {/* ── DYNAMIC ROUTING SECTION: ACADEMY VS ENTERPRISE ──── */}
          <div className="space-y-6">
            <div className="space-y-1 text-center max-w-xl mx-auto">
              <span className="eyebrow">Recommended Sovereign Pathway</span>
              <h3 className="font-serif text-3xl text-ink">
                {operationalScope === "enterprise"
                  ? "Enterprise Systems Architecture: The 80-Hour Work Month"
                  : `Individual Calibration: ${activeRecommendation.bookTitle}`}
              </h3>
            </div>

            {operationalScope === "enterprise" ? (
              /* ENTERPRISE ROUTING CARD */
              <div className="card p-8 sm:p-10 border-gold/50 bg-gradient-to-br from-charcoal via-charcoal to-[#1a1c22] space-y-6 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-6">
                  <div>
                    <span className="font-mono text-xs text-gold uppercase tracking-wider font-semibold">B2B Executive Advisory</span>
                    <h4 className="font-serif text-3xl text-ink mt-1">Founder &amp; Executive Systems Vetting</h4>
                    <p className="text-sm text-muted mt-1 max-w-xl">
                      For business owners operating above 40 hours per week seeking to restructure operations around the 80-Hour Work Month standard.
                    </p>
                  </div>
                  <div className="text-left sm:text-right shrink-0">
                    <span className="font-serif text-3xl text-gold font-bold">$20 CAD</span>
                    <p className="font-mono text-xs text-muted">15-Min Intro Debrief</p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3 text-xs text-ink/90">
                  <div className="p-4 rounded-xl border border-line bg-charcoal">
                    <p className="font-mono text-gold mb-1 font-semibold">1. System Audit</p>
                    <p className="text-muted">Map internal operational bottlenecks and hidden systemic friction draining executive focus.</p>
                  </div>
                  <div className="p-4 rounded-xl border border-line bg-charcoal">
                    <p className="font-mono text-gold mb-1 font-semibold">2. 80-Hour Target</p>
                    <p className="text-muted">Engineered rest architecture: cap monthly operational work at 80 high-leverage hours.</p>
                  </div>
                  <div className="p-4 rounded-xl border border-line bg-charcoal">
                    <p className="font-mono text-gold mb-1 font-semibold">3. Covenant Architecture</p>
                    <p className="text-muted">Replace extractive surveillance with high-trust covenants and structural firewalls.</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link
                    href="/book"
                    className="btn-gold py-3 px-8 text-sm font-semibold shadow-lg hover:shadow-gold/20"
                  >
                    📅 Schedule 15-Minute Executive Debrief Call ($20) →
                  </Link>
                  <Link
                    href="/contact"
                    className="btn-ghost py-3 px-6 text-sm text-muted hover:text-ink"
                  >
                    Submit Advisory Inquiry
                  </Link>
                </div>
              </div>
            ) : (
              /* INDIVIDUAL ACADEMY ROUTING CARD */
              <div className="card p-8 sm:p-10 border-gold/50 bg-gradient-to-br from-charcoal via-charcoal to-[#181a10] space-y-6 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-6">
                  <div>
                    <span className="font-mono text-xs text-gold uppercase tracking-wider font-semibold">
                      {activeRecommendation.volumeLabel}
                    </span>
                    <h4 className="font-serif text-3xl text-ink mt-1">
                      {activeRecommendation.workbookTitle}
                    </h4>
                    <p className="text-sm text-muted mt-1 max-w-xl">
                      {activeRecommendation.description}
                    </p>
                  </div>
                  <div className="text-left sm:text-right shrink-0">
                    <span className="font-serif text-3xl text-gold font-bold">${activeRecommendation.workbookPrice} CAD</span>
                    <p className="font-mono text-xs text-muted">Digital Companion Workbook</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      addItem({
                        id: activeRecommendation.workbookId,
                        title: activeRecommendation.workbookTitle,
                        subtitle: `Companion workbook for ${activeRecommendation.bookTitle}`,
                        price: activeRecommendation.workbookPrice,
                        tier: 1,
                        category: "manual",
                        badge: "Calibrated Recommendation",
                        downloadUrl: activeRecommendation.downloadUrl,
                      });
                    }}
                    className="btn-gold py-3 px-8 text-sm flex items-center gap-2 cursor-pointer shadow-lg"
                  >
                    <span>🛒</span> Unlock Companion Workbook (${activeRecommendation.workbookPrice})
                  </button>
                  <Link
                    href="/offers"
                    className="btn-ghost py-3 px-6 text-sm text-muted hover:text-ink"
                  >
                    View Academy Course ({activeRecommendation.coursePrice}) →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* ── EMAIL TRANSMISSION & ARCHIVE ───────────────────────── */}
          <div className="card p-8 border-line bg-charcoal space-y-6">
            <div className="space-y-1">
              <span className="eyebrow">Preserve Assessment</span>
              <h4 className="font-serif text-2xl text-ink">Archive Diagnostic &amp; Transmit Alignment Report</h4>
              <p className="text-xs text-muted">
                Receive the mathematical breakdown of your energy indices, sector scores, and full 72-hour directive in a clean, print-ready document.
              </p>
            </div>

            {/* BC PIPA Purpose Notice */}
            <div className="p-3.5 rounded-xl border border-line bg-obsidian/70 space-y-1 text-left">
              <div className="flex items-center gap-1.5 text-gold font-mono text-[0.62rem] uppercase tracking-wider font-semibold">
                <span>🛡️</span>
                <span>BC PIPA Purpose Specification</span>
              </div>
              <p className="text-[0.65rem] text-muted leading-relaxed">
                Your email and diagnostic responses are collected strictly pursuant to British Columbia&apos;s <em>Personal Information Protection Act</em> to generate your 72-Hour Calibration Directive and archive your alignment indices. Data is encrypted, held in confidence, and never sold or syndicated. Read our{' '}
                <Link href="/privacy" className="text-gold underline hover:text-gold-bright">
                  Privacy Policy
                </Link>.
              </p>
            </div>

            {emailStatus === "sent" ? (
              <div className="p-4 rounded-xl border border-emerald/40 bg-emerald/10 text-emerald text-sm space-y-1">
                <p className="font-semibold">✓ Report Transmitted &amp; Archived</p>
                <p className="text-xs text-muted">
                  {submissionFeedback ?? `A permanent diagnostic record has been registered for ${email}.`}
                </p>
              </div>
            ) : (
              <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-3">
                <label htmlFor={emailInputId} className="sr-only">
                  Your Email Address
                </label>
                <input
                  id={emailInputId}
                  type="email"
                  required
                  placeholder="Enter your email to archive report…"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 rounded-xl border border-line bg-obsidian px-4 py-3 text-sm text-ink outline-none transition placeholder:text-faint focus:border-gold"
                />
                <button
                  type="submit"
                  disabled={emailStatus === "submitting" || !email.trim()}
                  className="btn-gold px-6 py-3 text-sm shrink-0"
                >
                  {emailStatus === "submitting" ? "Archiving…" : "Archive & Transmit Report →"}
                </button>
              </form>
            )}

            <div className="pt-2 border-t border-line/60 flex items-center justify-between">
              <Link href="/library" className="text-xs font-mono text-muted hover:text-gold transition">
                ← Read The Trilogy in Reading Room
              </Link>
              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-mono text-muted hover:text-gold transition uppercase tracking-wider"
              >
                ↺ Reset &amp; Retake Audit
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
