"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { OFFERS, TIER_LABELS } from "@/lib/data/offers";
import LeadCaptureModal from "@/components/LeadCaptureModal";
import { useCart } from "@/context/CartContext";
import StripeCheckoutButton from "@/components/checkout/StripeCheckoutButton";
import type { Offer } from "@/lib/types";

export default function OffersCatalog() {
  const router = useRouter();
  const { addItem } = useCart();
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handlePurchase = (offer: Offer) => {
    if (offer.price !== null) {
      addItem({
        id: offer.id,
        title: offer.title,
        subtitle: offer.description,
        tier: offer.tier,
        price: offer.price,
        category: offer.id === "intro-call" ? "advisory" : offer.tier === 1 ? "manual" : "course",
        deliverables: offer.deliverables,
        badge: offer.badge,
        downloadUrl:
          offer.id === "field-manual"
            ? "/api/download/the-master-blueprint.pdf"
            : "/api/download/the-architecture-of-reality.pdf",
      });
    } else {
      // Tier 3 Advisory deposit
      addItem({
        id: offer.id,
        title: "Sovereign Systems Sprint (Intake Deposit)",
        subtitle: "Private 1-on-1 advisory architecture retainer",
        tier: offer.tier,
        price: 1500,
        category: "advisory",
        deliverables: offer.deliverables,
        badge: "Retainer Deposit",
      });
    }
  };

  const handleBuyNow = (offer: Offer) => {
    handlePurchase(offer);
    router.push("/checkout");
  };

  const tiers = [1, 2, 3] as const;

  return (
    <div className="container-x py-16 space-y-20">
      {tiers.map((tier) => {
        const tierOffers = OFFERS.filter((o) => o.tier === tier);
        const meta = TIER_LABELS[tier];

        return (
          <section key={tier} id={`tier-${tier}`} className="space-y-8 scroll-mt-24">
            <div className="border-b border-line pb-4 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
              <div>
                <span className="eyebrow">Tier {tier}</span>
                <h2 className="font-serif text-3xl sm:text-4xl text-ink mt-1">{meta.name}</h2>
              </div>
              <p className="text-sm text-muted max-w-md">{meta.blurb}</p>
            </div>

            <div className={`grid gap-8 ${tierOffers.length > 1 ? "md:grid-cols-2" : "max-w-2xl"}`}>
              {tierOffers.map((offer) => {
                const isFeatured = offer.tier === 2;

                return (
                  <div
                    key={offer.id}
                    className={`card p-8 flex flex-col justify-between relative overflow-hidden transition duration-500 ${
                      isFeatured
                        ? "border-gold/60 bg-gradient-to-b from-[#181d26] to-charcoal shadow-[0_20px_50px_-20px_rgba(212,175,55,0.25)]"
                        : "hover:border-gold/30"
                    }`}
                  >
                    {isFeatured && (
                      <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-gold-deep via-gold to-gold-bright" />
                    )}

                    <div className="space-y-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className="font-mono text-[0.65rem] tracking-widest text-faint uppercase">
                            Tier {offer.tier} System
                          </span>
                          <h3 className="font-serif text-2xl sm:text-3xl text-ink mt-1">{offer.title}</h3>
                        </div>
                        {offer.badge && (
                          <span className="font-mono text-[0.65rem] uppercase tracking-widest text-gold bg-gold/10 px-2.5 py-1 rounded-full border border-gold/30 shrink-0">
                            {offer.badge}
                          </span>
                        )}
                      </div>

                      <div className="flex items-baseline gap-2">
                        {offer.price !== null ? (
                          <>
                            <span className="font-serif text-4xl text-gold">${offer.price}</span>
                            <span className="font-mono text-xs text-muted uppercase">CAD · One-time</span>
                          </>
                        ) : (
                          <span className="font-serif text-3xl text-gradient-gold">Private Architecture</span>
                        )}
                      </div>

                      <p className="text-sm text-muted leading-relaxed">{offer.description}</p>

                      <div className="pt-4 border-t border-line space-y-3">
                        <span className="font-mono text-[0.65rem] tracking-widest text-faint uppercase block">
                          Included Deliverables
                        </span>
                        <ul className="space-y-2 text-sm text-ink/90">
                          {offer.deliverables.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2.5">
                              <span className="text-gold text-xs mt-1">✓</span>
                              <span className="leading-snug">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-line space-y-2.5">
                      {offer.price !== null ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handlePurchase(offer)}
                            className={`w-full ${isFeatured ? "btn-gold py-3.5 text-base" : "btn-gold py-3 text-sm"} flex items-center justify-center gap-2 cursor-pointer shadow-md`}
                          >
                            <span>🛒</span> Add to Checkout — ${offer.price}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleBuyNow(offer)}
                            className="btn-ghost w-full py-2.5 text-xs text-muted hover:text-gold flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <span>⚡</span> Instant Buy Now →
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => handlePurchase(offer)}
                            className="btn-gold w-full py-3.5 text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md"
                          >
                            <span>🔒</span> Stage Advisory Retainer Deposit ($1,500)
                          </button>
                          <Link
                            href="/book"
                            className="btn-ghost w-full py-2.5 text-xs text-gold hover:bg-gold/10 flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <span>📅</span> Book an Online Advisory Strategy Call →
                          </Link>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedOffer(offer);
                              setModalOpen(true);
                            }}
                            className="btn-ghost w-full py-2 text-xs text-muted hover:text-ink cursor-pointer"
                          >
                            Or Submit Written Intake Application →
                          </button>
                        </>
                      )}
                      <p className="text-center font-mono text-[0.65rem] text-faint mt-1">
                        {offer.price !== null
                          ? "Zero-friction checkout · Instant digital transmission · 30-Day Guarantee"
                          : "Limited to 2 advisory clients per quarter"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}

      {/* Express Stripe-Hosted Checkout Section */}
      <section className="relative rounded-2xl bg-[#0D0F14] border border-stone-800/90 shadow-2xl p-6 sm:p-10 border-t-2 border-t-[#C5A880] shadow-[0_-6px_35px_-8px_rgba(197,168,128,0.2)] overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-bl from-[#C5A880]/10 via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10 grid gap-8 lg:grid-cols-2 items-center">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#161A22] border border-[#C5A880]/40 text-[#DFBA87] font-mono text-[11px] uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880] animate-pulse" />
              Direct Transmission · Stripe Hosted Checkout
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#F5F5F7]">
              Instant Sovereign Calibration Access
            </h3>
            <p className="text-sm text-stone-300 leading-relaxed">
              Bypass cart staging for immediate one-click checkout. Handled securely via Stripe-hosted checkout (Apple Pay, Google Pay, Cards). Upon confirmation, your session redirects automatically to your unlocked <code className="text-[#DFBA87] font-mono text-xs">/success</code> protocol hub.
            </p>
          </div>

          <div className="flex flex-col items-center justify-center sm:items-end">
            <div className="w-full max-w-md">
              <StripeCheckoutButton
                buttonText="Initiate Direct Stripe Checkout · $50 CAD"
                subtext="Apple Pay · Google Pay · Card · Instant /success Unlock"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Advisory FAQ & Audit Link */}
      <section className="card p-8 sm:p-12 border-line bg-charcoal/50">
        <div className="grid gap-8 lg:grid-cols-2 items-center">
          <div className="space-y-4">
            <span className="eyebrow">Diagnostic Prerequisite</span>
            <h3 className="font-serif text-3xl text-ink">
              Unsure which tier matches your current energy and schedule demand?
            </h3>
            <p className="text-sm text-muted leading-relaxed">
              We recommend completing the free 12-question Energy &amp; Alignment Audit first. It evaluates your current cognitive, biological, and relational capacity to ensure you don&apos;t invest in high-output systems while suffering from energy and time leaks.
            </p>
          </div>
          <div className="flex sm:justify-end">
            <Link href="/audit" className="btn-gold px-8 py-3.5">
              Take the Energy Audit First ⚡
            </Link>
          </div>
        </div>
      </section>

      {/* Lead / Checkout Modal */}
      {selectedOffer && (
        <LeadCaptureModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          source="offer-waitlist"
          offerId={selectedOffer.id}
          title={
            selectedOffer.price === null
              ? "Apply for the Sovereign Systems Sprint"
              : `Access: ${selectedOffer.title}`
          }
          description={
            selectedOffer.price === null
              ? "Please provide your details. We review advisory applications within 48 hours for organizational fit."
              : `Payment link provisioning is in progress for this tier ($${selectedOffer.price}). Enter your email for immediate priority access.`
          }
          submitLabel={selectedOffer.price === null ? "Submit Application" : "Reserve Priority Access"}
        />
      )}
    </div>
  );
}
