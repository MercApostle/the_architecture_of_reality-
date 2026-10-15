"use client";

import { useState } from "react";
import Link from "next/link";

export default function ContactView() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("Advisory & Collaboration");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) return;

    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Failed to transmit message.");
      }

      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Transmission failed. Please try again.");
    }
  };

  return (
    <div className="container-x py-12 lg:py-16 space-y-16">
      {/* Top Header */}
      <div className="border-b border-line pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <span className="eyebrow">Direct Channel &amp; Inquiries</span>
          <h1 className="font-serif text-3xl sm:text-5xl text-ink font-medium leading-tight">
            Get in <span className="text-gradient-gold italic">Contact</span>
          </h1>
          <p className="text-sm text-muted leading-relaxed">
            Whether you are inquiring about executive advisory sprints, speaking engagements, order assistance, or direct correspondence with Jeremy Ashe.
          </p>
        </div>

        <div className="shrink-0">
          <Link
            href="/book"
            className="btn-gold text-xs px-5 py-2.5 flex items-center gap-2 shadow-[0_0_15px_-3px_rgba(212,175,55,0.4)]"
          >
            <span>📅</span> Schedule a Meeting Directly →
          </Link>
        </div>
      </div>

      {/* Grid: Direct Channels & Interactive Form */}
      <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr]">
        {/* Left Column: Direct Inquiries & Quick Access */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="font-serif text-2xl text-ink">Communication Channels</h2>
            <p className="text-sm text-muted leading-relaxed">
              We respect your focus and time. Inquiries are triaged personally to ensure load-bearing, high-leverage conversations.
            </p>
          </div>

          <div className="space-y-4">
            {/* 1-on-1 Meeting Channel */}
            <div className="card p-6 border-line hover:border-gold/50 transition duration-300 space-y-3 bg-charcoal/70">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-gold uppercase tracking-widest font-semibold">
                  01 / 1-on-1 Strategy Call
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-gold/10 text-gold border border-gold/30 font-mono">
                  Google Meet
                </span>
              </div>
              <h3 className="font-serif text-xl text-ink">15-Min Intro or Alignment Call</h3>
              <p className="text-xs text-muted leading-relaxed">
                Connect directly with Jeremy Ashe on Google Meet to review your energy audit scores, explore advisory collaboration, or calibrate your schedule.
              </p>
              <Link
                href="/book"
                className="inline-flex items-center gap-1.5 font-mono text-xs text-gold uppercase tracking-wider hover:underline pt-1 font-semibold"
              >
                Go to Booking Page →
              </Link>
            </div>

            {/* Advisory & Enterprise Inquiries */}
            <div className="card p-6 border-line hover:border-gold/50 transition duration-300 space-y-3 bg-charcoal/70">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-gold uppercase tracking-widest font-semibold">
                  02 / Enterprise Advisory
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-charcoal text-muted border border-line font-mono">
                  Advisory Sprint
                </span>
              </div>
              <h3 className="font-serif text-xl text-ink">Sovereign Systems Sprint</h3>
              <p className="text-xs text-muted leading-relaxed">
                For executive leaders and founders building purposeful, high-trust enterprises with load-bearing covenants.
              </p>
              <Link
                href="/offers#tier-3"
                className="inline-flex items-center gap-1.5 font-mono text-xs text-gold uppercase tracking-wider hover:underline pt-1 font-semibold"
              >
                View Advisory Details →
              </Link>
            </div>

            {/* Direct Email Channel */}
            <div className="card p-6 border-line hover:border-gold/50 transition duration-300 space-y-3 bg-charcoal/70">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-gold uppercase tracking-widest font-semibold">
                  03 / Written Inquiries
                </span>
                <span className="text-xs px-2 py-0.5 rounded bg-emerald/10 text-emerald border border-emerald/30 font-mono">
                  Direct Response
                </span>
              </div>
              <h3 className="font-serif text-xl text-ink">Direct Desk Coordinates</h3>
              <p className="text-xs text-muted leading-relaxed">
                For media, publishing rights, bulk library requests, or general correspondence.
              </p>
              <div className="font-mono text-xs text-ink bg-obsidian/80 px-3 py-2 rounded-lg border border-line flex items-center justify-between">
                <span>jeremy@architectureofreality.com</span>
                <span className="text-faint text-[0.68rem]">24–48h response</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Contact Form */}
        <div className="card p-8 sm:p-10 border-line bg-charcoal space-y-8 relative overflow-hidden">
          <div className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-gold/10 blur-3xl" />

          <div className="space-y-2 relative">
            <span className="eyebrow">Transmission Form</span>
            <h2 className="font-serif text-3xl text-ink">Send a Direct Message</h2>
            <p className="text-xs text-muted">
              Fill out the details below. Messages are reviewed directly by Jeremy Ashe.
            </p>
          </div>

          {status === "success" ? (
            <div className="p-6 rounded-2xl border border-emerald/40 bg-emerald/10 text-ink space-y-4 animate-fade-up">
              <div className="size-10 rounded-full bg-emerald/20 border border-emerald text-emerald flex items-center justify-center font-bold text-lg">
                ✓
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-xl text-emerald">Message Transmitted</h3>
                <p className="text-xs text-muted leading-relaxed">
                  Thank you for reaching out. Your transmission has been securely logged. You will receive a response within 24–48 hours on business days.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="btn-ghost text-xs py-2 px-4"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 relative">
              {status === "error" && (
                <div className="p-3.5 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-300 text-xs">
                  {errorMessage}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label htmlFor="contact-name" className="font-mono text-[0.68rem] text-muted block uppercase tracking-wider">
                    Your Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Eleanor Vance"
                    className="w-full rounded-xl border border-line bg-obsidian px-4 py-2.5 text-xs text-ink placeholder:text-faint focus:border-gold focus:outline-none transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contact-email" className="font-mono text-[0.68rem] text-muted block uppercase tracking-wider">
                    Email Address <span className="text-gold">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@domain.com"
                    className="w-full rounded-xl border border-line bg-obsidian px-4 py-2.5 text-xs text-ink placeholder:text-faint focus:border-gold focus:outline-none transition"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="contact-subject" className="font-mono text-[0.68rem] text-muted block uppercase tracking-wider">
                  Inquiry Topic
                </label>
                <select
                  id="contact-subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-xl border border-line bg-obsidian px-4 py-2.5 text-xs text-ink focus:border-gold focus:outline-none transition"
                >
                  <option value="Advisory & Collaboration">Advisory &amp; Systems Sprint Collaboration</option>
                  <option value="15-Min Meeting Inquiry">15-Min Strategy Meeting Inquiry</option>
                  <option value="Keynote Speaking & Workshops">Keynote Speaking &amp; Executive Workshops</option>
                  <option value="Book & Order Assistance">The Trilogy Books &amp; Digital Access</option>
                  <option value="Philosophical Correspondence">Philosophical Correspondence &amp; Reader Feedback</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="contact-message" className="font-mono text-[0.68rem] text-muted block uppercase tracking-wider">
                  Your Message <span className="text-gold">*</span>
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share context on your systems, current bottlenecks, or what you would like to explore…"
                  className="w-full rounded-xl border border-line bg-obsidian p-4 text-xs text-ink placeholder:text-faint focus:border-gold focus:outline-none transition resize-y leading-relaxed"
                />
              </div>

              <button
                type="submit"
                id="contact-submit-btn"
                disabled={status === "submitting" || !email.trim() || !message.trim()}
                className="btn-gold w-full py-3 text-xs font-semibold cursor-pointer shadow-md disabled:opacity-50"
              >
                {status === "submitting" ? "Transmitting Message…" : "Transmit Message to Jeremy Ashe →"}
              </button>

              <p className="text-[0.65rem] text-faint text-center">
                Your data is held with strict confidentiality. No spam, tracking pixels, or third-party syndication.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
