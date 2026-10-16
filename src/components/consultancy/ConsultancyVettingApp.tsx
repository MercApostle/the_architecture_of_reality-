'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import SovereignBookingWidget from '@/components/booking/SovereignBookingWidget';
import { submitConsultancyApplication } from '@/lib/actions/consultancy.actions';
import type { BusinessSector, QualificationStatus } from '@/lib/supabase/types';

interface FormData {
  fullName: string;
  email: string;
  companyName: string;
  businessSector: BusinessSector;
  currentWeeklyHours: number;
  missionAlignment: string;
  primaryBottleneck: string;
}

const SECTOR_OPTIONS: Array<{ value: BusinessSector; label: string; desc: string }> = [
  { value: 'ecommerce', label: 'E-Commerce / Physical Goods', desc: 'Direct-to-consumer or manufacturing operations' },
  { value: 'service_agency', label: 'Consulting / Agency / Tech', desc: 'High-touch client services, development, design' },
  { value: 'local_enterprise', label: 'Local / Regional Enterprise', desc: 'Physical facilities, clinics, brick-and-mortar' },
  { value: 'other', label: 'Other Sovereign Enterprise', desc: 'Specialized systems, media, or investment holdings' },
];

const HOURS_TIERS = [
  { value: 25, label: '20–30 hrs/week', note: 'Near Sovereign Standard' },
  { value: 40, label: '35–45 hrs/week', note: 'Standard Industrial Strain' },
  { value: 55, label: '50–60 hrs/week', note: 'Chronic Extraction Zone' },
  { value: 70, label: '65+ hrs/week', note: 'Critical Vessel Exhaustion' },
];

export default function ConsultancyVettingApp() {
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    companyName: '',
    businessSector: 'ecommerce',
    currentWeeklyHours: 55,
    missionAlignment: '',
    primaryBottleneck: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<QualificationStatus | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleNext = () => {
    setErrorMessage(null);
    if (step === 1) {
      if (!formData.fullName.trim() || !formData.email.trim() || !formData.companyName.trim()) {
        setErrorMessage('Please complete all contact and company fields.');
        return;
      }
    }
    if (step === 3) {
      if (formData.missionAlignment.trim().length < 10) {
        setErrorMessage('Please provide a brief description (at least 10 characters) of how your mission aligns with health, truth, or community purpose.');
        return;
      }
    }
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const handlePrev = () => {
    setErrorMessage(null);
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.primaryBottleneck.trim()) {
      setErrorMessage('Please describe your primary operational bottleneck.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await submitConsultancyApplication(formData);
      if (res.success && res.qualificationStatus) {
        setStatus(res.qualificationStatus);
      } else {
        setErrorMessage(res.error || 'Failed to submit application. Please try again.');
      }
    } catch {
      setErrorMessage('A network error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-12 max-w-4xl mx-auto">
      {/* ── STANDARD COMPARISON BANNER ──────────────────────── */}
      <div className="card p-6 border-gold/40 bg-charcoal/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="eyebrow">The Executive Standard</span>
          <h4 className="font-serif text-xl sm:text-2xl text-ink font-medium">
            The 80-Hour Work Month (20 Hours / Week)
          </h4>
          <p className="text-xs text-muted max-w-xl">
            We partner with sovereign business owners whose organizations serve genuine human flourishment. Restructure operations, install the 10 Operational Firewalls, and protect executive capacity.
          </p>
        </div>
        <div className="flex items-center gap-2 sm:border-l sm:border-line sm:pl-6 shrink-0">
          <div className="text-left sm:text-right">
            <span className="font-mono text-xs text-muted block">Target Standard</span>
            <span className="font-serif text-2xl font-bold text-gold">80 hrs/mo</span>
          </div>
        </div>
      </div>

      {/* ── VETTING WIZARD OR UNLOCKED SCHEDULER ─────────────── */}
      {status === 'qualified' ? (
        <div className="space-y-8 animate-fade-up">
          {/* Qualification Confirmation Card */}
          <div className="card p-8 border-emerald/50 bg-gradient-to-br from-charcoal via-charcoal to-[#0d1a15] space-y-4">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald animate-pulse" />
              <span className="font-mono text-xs text-emerald uppercase tracking-widest font-semibold">
                Application Verified &middot; Qualified
              </span>
            </div>
            <h3 className="font-serif text-3xl sm:text-4xl text-ink font-medium">
              Welcome, {formData.fullName.split(' ')[0]}. Executive Scheduler Unlocked.
            </h3>
            <p className="text-sm text-ink/90 leading-relaxed max-w-2xl">
              Your application for <strong>{formData.companyName}</strong> meets our criteria for high-trust systems architecture. Select your consultation window below with Jeremy Ashe to review your time leak audit and map your 80-Hour Work Month transition.
            </p>
          </div>

          {/* Embedded Cal.com Scheduler */}
          <div className="card p-6 sm:p-8 border-line bg-charcoal space-y-6">
            <div className="border-b border-line pb-4 flex items-center justify-between">
              <div>
                <span className="eyebrow">Direct Strategy Calendar</span>
                <h4 className="font-serif text-2xl text-ink">Select Private Session</h4>
              </div>
              <span className="font-mono text-xs text-gold">Confirmed VIP Access</span>
            </div>
            <SovereignBookingWidget />
          </div>
        </div>
      ) : status === 'nurture' ? (
        <div className="card p-8 sm:p-10 border-gold/40 bg-charcoal space-y-6 text-center max-w-2xl mx-auto animate-fade-up">
          <div className="inline-grid size-12 place-items-center rounded-full bg-gold/10 border border-gold/30 text-gold text-xl mx-auto">
            ✦
          </div>
          <div className="space-y-2">
            <span className="eyebrow">Application Preserved</span>
            <h3 className="font-serif text-3xl text-ink">Foundational Study Recommended</h3>
            <p className="text-sm text-muted leading-relaxed">
              Thank you for sharing your journey with <strong>{formData.companyName}</strong>. Based on your current operational stage, your highest-leverage move is foundational calibration through the Trilogy Reading Room and the Sovereign Academy before booking enterprise advisory.
            </p>
          </div>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link href="/library/the-covenant" className="btn-gold text-xs py-2.5 px-6">
              Read Book III: The Covenant (Free) →
            </Link>
            <Link href="/offers" className="btn-ghost text-xs py-2.5 px-5 text-muted hover:text-ink">
              Explore Sovereign Academy Courses
            </Link>
          </div>
        </div>
      ) : (
        /* STEP-BY-STEP APPLICATION FORM */
        <div className="card p-8 sm:p-10 border-line bg-charcoal space-y-8">
          {/* Progress Header */}
          <div className="flex items-center justify-between border-b border-line pb-4">
            <div className="space-y-0.5">
              <span className="eyebrow">Founder Vetting Application</span>
              <h3 className="font-serif text-2xl text-ink">
                Step {step} of 4: {
                  step === 1 ? 'Organization Profile' :
                  step === 2 ? 'Operational Workload' :
                  step === 3 ? 'Mission & Alignment' : 'Primary Bottleneck'
                }
              </h3>
            </div>
            <span className="font-mono text-xs text-gold">
              {Math.round((step / 4) * 100)}%
            </span>
          </div>

          {errorMessage && (
            <div className="p-4 rounded-xl border border-red-500/40 bg-red-500/10 text-red-400 text-xs font-mono">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* STEP 1: ORGANIZATION PROFILE */}
            {step === 1 && (
              <div className="space-y-5 animate-fade-up">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-mono text-xs text-muted uppercase tracking-wider">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Jeremy Ashe"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="input-dark w-full"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-mono text-xs text-muted uppercase tracking-wider">
                      Executive Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="you@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input-dark w-full"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono text-xs text-muted uppercase tracking-wider">
                    Company or Organization Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sterling Craft Organics"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="input-dark w-full"
                  />
                </div>

                <div className="space-y-2 pt-2">
                  <label className="font-mono text-xs text-muted uppercase tracking-wider block">
                    Business Sector *
                  </label>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {SECTOR_OPTIONS.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, businessSector: opt.value })}
                        className={`p-3.5 rounded-xl border text-left transition cursor-pointer ${
                          formData.businessSector === opt.value
                            ? 'border-gold bg-charcoal-raised ring-1 ring-gold/40 text-ink'
                            : 'border-line bg-charcoal/60 text-muted hover:border-gold/30 hover:text-ink'
                        }`}
                      >
                        <p className="font-serif text-base text-ink">{opt.label}</p>
                        <p className="text-[0.72rem] text-muted mt-0.5">{opt.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: OPERATIONAL WORKLOAD */}
            {step === 2 && (
              <div className="space-y-6 animate-fade-up">
                <div className="space-y-1">
                  <h4 className="font-serif text-2xl text-ink">What is your current weekly working time?</h4>
                  <p className="text-xs text-muted">
                    We compare your current output against our target 80-Hour Work Month (20 focused hours per week).
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {HOURS_TIERS.map((tier) => (
                    <button
                      key={tier.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, currentWeeklyHours: tier.value })}
                      className={`p-4 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                        formData.currentWeeklyHours === tier.value
                          ? 'border-gold bg-charcoal-raised ring-1 ring-gold/40 text-ink'
                          : 'border-line bg-charcoal/60 text-muted hover:border-gold/30 hover:text-ink'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-serif text-xl text-ink font-medium">{tier.label}</span>
                        <span className="text-gold font-mono text-sm">
                          {formData.currentWeeklyHours === tier.value ? '✓' : ''}
                        </span>
                      </div>
                      <span className="font-mono text-[0.65rem] text-gold/80 mt-2 block">
                        {tier.note}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="p-4 rounded-xl border border-line bg-charcoal-raised text-xs text-muted flex items-center gap-3">
                  <span className="text-gold text-lg font-mono">⚡</span>
                  <p>
                    Transitioning an enterprise from 55 hrs/week down to 20 hrs/week reclaims <strong className="text-gold">140 hours per month</strong> of biological capacity while elevating structural profitability.
                  </p>
                </div>
              </div>
            )}

            {/* STEP 3: MISSION & ALIGNMENT */}
            {step === 3 && (
              <div className="space-y-4 animate-fade-up">
                <div className="space-y-1">
                  <h4 className="font-serif text-2xl text-ink">Mission &amp; Regenerative Alignment</h4>
                  <p className="text-xs text-muted">
                    We do not consult with extractive gambling, adult entertainment, or predatory financial schemes. How does your company advance health, truth, or community purpose?
                  </p>
                </div>

                <textarea
                  required
                  rows={5}
                  value={formData.missionAlignment}
                  onChange={(e) => setFormData({ ...formData, missionAlignment: e.target.value })}
                  placeholder="Describe your core product/service and why its existence makes the world more truthful, healthier, or orderly..."
                  className="input-dark w-full text-sm leading-relaxed"
                />
              </div>
            )}

            {/* STEP 4: PRIMARY BOTTLENECK */}
            {step === 4 && (
              <div className="space-y-4 animate-fade-up">
                <div className="space-y-1">
                  <h4 className="font-serif text-2xl text-ink">Primary Operational Bottleneck</h4>
                  <p className="text-xs text-muted">
                    Where is systemic friction accumulating? (e.g. founder as decision bottleneck, team communication chaos, lack of firewalls against scope creep).
                  </p>
                </div>

                <textarea
                  required
                  rows={5}
                  value={formData.primaryBottleneck}
                  onChange={(e) => setFormData({ ...formData, primaryBottleneck: e.target.value })}
                  placeholder="Explain what is preventing your company from running smoothly without your constant personal intervention..."
                  className="input-dark w-full text-sm leading-relaxed"
                />
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-line">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handlePrev}
                  className="btn-ghost py-2.5 px-5 text-xs text-muted hover:text-ink cursor-pointer"
                >
                  &larr; Previous Step
                </button>
              ) : (
                <div />
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn-gold py-2.5 px-6 text-xs font-semibold cursor-pointer"
                >
                  Continue to Step {step + 1} &rarr;
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-gold py-3 px-8 text-sm font-semibold cursor-pointer shadow-lg disabled:opacity-50"
                >
                  {isSubmitting ? 'Evaluating Application...' : 'Submit Application & Unlock Scheduler →'}
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
