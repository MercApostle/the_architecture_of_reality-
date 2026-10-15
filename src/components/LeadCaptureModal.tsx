"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useLeadCapture } from "@/lib/hooks/useStore";
import type { Lead } from "@/lib/types";

interface Props {
  open: boolean;
  onClose: () => void;
  source: Lead["source"];
  auditId?: string;
  offerId?: string;
  title?: string;
  description?: string;
  submitLabel?: string;
}

export default function LeadCaptureModal({
  open,
  onClose,
  source,
  auditId,
  offerId,
  title = "Receive your full PDF report",
  description = "Enter your email and we'll send the complete Energy & Alignment report, including your sector breakdown and the full calibration protocol.",
  submitLabel = "Send my report",
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { status, capture, reset } = useLeadCapture();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [consent, setConsent] = useState(true);
  const idp = useId();

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const handleClose = () => {
    onClose();
    setTimeout(reset, 300);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await capture({ email: email.trim(), name: name.trim() || undefined, source, auditId, offerId });
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={handleClose}
      onClick={(e) => e.target === dialogRef.current && handleClose()}
      className="m-auto w-[min(92vw,30rem)] rounded-2xl border border-line-strong bg-charcoal p-0 text-ink shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)] backdrop:bg-obsidian/80 backdrop:backdrop-blur-sm"
    >
      <div className="relative p-8">
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close"
          className="absolute top-4 right-4 grid size-8 place-items-center rounded-full text-muted transition hover:bg-line hover:text-ink"
        >
          ✕
        </button>

        {status === "success" ? (
          <div className="space-y-4 py-6 text-center">
            <div className="mx-auto grid size-14 place-items-center rounded-full border border-emerald/40 bg-emerald/10 text-2xl text-emerald">✓</div>
            <h2 className="font-serif text-2xl">You&apos;re on the list.</h2>
            <p className="text-sm text-muted">
              We&apos;ve recorded <span className="text-ink">{email}</span>. Delivery automation will be connected at launch.
            </p>
            <button type="button" onClick={handleClose} className="btn-ghost mt-2">Close</button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-5">
            <div className="space-y-2">
              <p className="eyebrow">⚡ Lead Capture</p>
              <h2 className="font-serif text-2xl leading-tight">{title}</h2>
              <p className="text-sm leading-relaxed text-muted">{description}</p>
            </div>

            <div className="space-y-3">
              <label htmlFor={`${idp}-name`} className="block">
                <span className="mb-1.5 block font-mono text-[0.65rem] tracking-widest text-faint uppercase">First name (optional)</span>
                <input
                  id={`${idp}-name`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-lg border border-line bg-obsidian px-4 py-3 text-sm outline-none transition placeholder:text-faint focus:border-gold/60"
                  placeholder="Ada"
                />
              </label>
              <label htmlFor={`${idp}-email`} className="block">
                <span className="mb-1.5 block font-mono text-[0.65rem] tracking-widest text-faint uppercase">Email</span>
                <input
                  id={`${idp}-email`}
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-line bg-obsidian px-4 py-3 text-sm outline-none transition placeholder:text-faint focus:border-gold/60"
                  placeholder="you@domain.com"
                />
              </label>
              <label className="flex items-start gap-3 text-xs leading-relaxed text-muted">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 accent-[#d4af37]"
                />
                Send me occasional Dispatches. Unsubscribe anytime. No spam, ever.
              </label>
            </div>

            <button type="submit" disabled={status === "submitting" || !email} className="btn-gold w-full py-3">
              {status === "submitting" ? "Transmitting…" : submitLabel}
            </button>
            {status === "error" && <p className="text-center text-xs text-ember">Something went wrong. Please try again.</p>}
          </form>
        )}
      </div>
    </dialog>
  );
}
