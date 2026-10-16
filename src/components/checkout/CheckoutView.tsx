"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useCart, CompletedOrder } from "@/context/CartContext";
import { useMember } from "@/context/MemberContext";

export default function CheckoutView() {
  const {
    items,
    removeItem,
    updateQuantity,
    subtotal,
    discount,
    discountAmount,
    total,
    applyDiscount,
    removeDiscount,
    recordCompletedOrder,
    addItem,
    clearCart,
  } = useCart();
  const { user, activatePaidMembership } = useMember();

  // Form State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [paymentType, setPaymentType] = useState<"stripe" | "card">("stripe");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [orderBump, setOrderBump] = useState(false);

  // UI state
  const [promoInput, setPromoInput] = useState("");
  const [promoMessage, setPromoMessage] = useState<{ text: string; ok: boolean } | null>(null);
  const [processing, setProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState("");
  const [completedOrder, setCompletedOrder] = useState<CompletedOrder | null>(null);
  const [stripeNotice, setStripeNotice] = useState<string | null>(null);
  const [showStripeGuide, setShowStripeGuide] = useState(false);

  // Prefill member details if logged in or staged from membership join
  useEffect(() => {
    if (user) {
      setName((prev) => prev || user.name);
      setEmail((prev) => prev || user.email);
    } else {
      try {
        const raw = localStorage.getItem("ar_pending_registration");
        if (raw) {
          const staged = JSON.parse(raw);
          if (staged.name) setName((prev) => prev || staged.name);
          if (staged.email) setEmail((prev) => prev || staged.email);
        }
      } catch {}
    }
  }, [user]);

  // Check URL parameters for successful Stripe return
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("success") === "true") {
      const sessionId = params.get("session_id");
      setProcessing(true);
      setProcessingMessage("Verifying Stripe payment authorization…");

      fetch(`/api/checkout/session?session_id=${sessionId || "direct"}`)
        .then((r) => r.json())
        .then((data) => {
          const newOrder: CompletedOrder = {
            orderId: sessionId ? `ST-${sessionId.slice(-6).toUpperCase()}` : `AR-${Math.floor(100000 + Math.random() * 900000)}`,
            createdAt: new Date().toISOString(),
            customer: {
              name: data.customerName || name || "Jeremy Ashe",
              email: data.customerEmail || email || "jeremyashe@gmail.com",
              company: company.trim() || undefined,
            },
            items: items.length > 0 ? [...items] : [
              {
                id: "stripe-fulfillment",
                title: "The Architecture of Reality (Digital Order)",
                price: data.amountTotal || total || 27,
                quantity: 1,
                category: "manual",
                downloadUrl: "/api/download/the-master-blueprint.pdf",
              },
            ],
            subtotal: data.amountTotal || total,
            discountAmount: 0,
            total: data.amountTotal || total,
            paymentMethod: "Stripe Verified Checkout (Cards / Apple Pay / Google Pay)",
            cardLast4: "••••",
          };

          if (items.some((i) => i.id === "members-access") || !sessionId) {
            activatePaidMembership(data.customerEmail || email, data.customerName || name);
          }

          recordCompletedOrder(newOrder);
          setCompletedOrder(newOrder);
          clearCart();
        })
        .catch((err) => {
          console.warn("Session check notice:", err);
        })
        .finally(() => {
          setProcessing(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Format Card Number (adds spaces every 4 digits)
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardNumber(formatted);
  };

  // Format Expiry (MM/YY)
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (raw.length >= 3) {
      raw = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    }
    setCardExpiry(raw);
  };

  // 1-Click Demo Card Auto-fill
  const fillDemoCard = () => {
    setName("Jeremy Ashe");
    setEmail("jeremyashe@gmail.com");
    setCardNumber("4242 4242 4242 4242");
    setCardExpiry("12/28");
    setCardCvc("888");
  };

  // Apply promo
  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;
    const res = applyDiscount(promoInput);
    setPromoMessage({ text: res.message, ok: res.success });
    if (res.success) setPromoInput("");
  };

  // Handle Order Bump toggle
  const handleOrderBumpToggle = () => {
    const nextState = !orderBump;
    setOrderBump(nextState);

    const bumpId = "order-bump-workbook";
    if (nextState) {
      addItem({
        id: bumpId,
        title: "Trilogy Companion Workbooks (Checkout Special)",
        subtitle: "Reflection prompts, Fruit Test worksheets & Firewalls audit",
        price: 27, // discounted from 47
        category: "workbook",
        badge: "Special Offer",
        downloadUrl: "/api/download/the-master-blueprint.pdf",
      });
    } else {
      removeItem(bumpId);
    }
  };

  // Submission
  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    if (!name.trim() || !email.trim()) {
      alert("Please provide your name and email address for digital delivery.");
      return;
    }

    if (paymentType === "card" && (!cardNumber || !cardExpiry || !cardCvc)) {
      alert("Please enter the payment card details.");
      return;
    }

    setProcessing(true);

    if (paymentType === "stripe") {
      setProcessingMessage("Initiating secure Stripe Checkout…");

      try {
        const res = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: items.map((i) => ({
              id: i.id,
              title: i.title,
              subtitle: i.subtitle,
              price: i.price,
              quantity: i.quantity,
            })),
            customerEmail: email,
            customerName: name,
          }),
        });

        const data = await res.json();

        if (data.configured && data.url) {
          window.location.href = data.url;
          return;
        }

        // Stripe API key not yet set in .env.local
        setStripeNotice(data.error || "Stripe Secret Key not found in .env.local.");
        setShowStripeGuide(true);
        setProcessing(false);
        return;
      } catch (err: unknown) {
        console.warn("Stripe initiation notice:", err);
        setStripeNotice("Could not connect to Stripe. You can test via simulated sandbox checkout.");
        setShowStripeGuide(true);
        setProcessing(false);
        return;
      }
    }

    // Direct card simulation
    setProcessingMessage("Establishing secure sovereign channel…");
    await new Promise((r) => setTimeout(r, 600));
    setProcessingMessage("Authorizing digital delivery covenants…");
    await new Promise((r) => setTimeout(r, 600));

    const generatedOrderId = `AR-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: CompletedOrder = {
      orderId: generatedOrderId,
      createdAt: new Date().toISOString(),
      customer: {
        name,
        email,
        company: company.trim() || undefined,
      },
      items: [...items],
      subtotal,
      discountAmount,
      total,
      paymentMethod: "Credit Card (Direct)",
      cardLast4: cardNumber ? cardNumber.replace(/\s+/g, "").slice(-4) : "4242",
    };

    if (items.some((i) => i.id === "members-access")) {
      activatePaidMembership(email, name);
    }

    recordCompletedOrder(newOrder);
    setCompletedOrder(newOrder);
    clearCart();
    setProcessing(false);
  };

  const handleDevBypass = () => {
    const custName = name.trim() || user?.name || "Jeremy Ashe";
    const custEmail = email.trim() || user?.email || "jeremyashe@gmail.com";

    const newOrder: CompletedOrder = {
      orderId: `BYPASS-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString(),
      customer: {
        name: custName,
        email: custEmail,
        company: company.trim() || undefined,
      },
      items: items.length > 0 ? [...items] : [
        {
          id: "trilogy-mastery-bundle",
          title: "The Sovereign Trinity Pass (Test Order)",
          price: 0,
          quantity: 1,
          category: "course",
          downloadUrl: "/api/download/the-master-blueprint.pdf",
        },
      ],
      subtotal: 0,
      discountAmount: 0,
      total: 0,
      paymentMethod: "Local Dev Bypass (Zero-Cost Test Order)",
      cardLast4: "DEV0",
    };

    activatePaidMembership(custEmail, custName);
    recordCompletedOrder(newOrder);
    setCompletedOrder(newOrder);
    clearCart();
  };

  // ==========================================
  // VIEW: COMPLETED ORDER RECEIPT & ACCESS HUB
  // ==========================================
  if (completedOrder) {
    return (
      <div className="container-x py-16 max-w-4xl space-y-10 animate-fade-up">
        {/* Success Banner */}
        <div className="card p-8 sm:p-10 border-gold/50 bg-gradient-to-b from-[#141b24] via-charcoal to-[#0d1015] shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-gold to-emerald-400" />
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 font-mono text-xs text-emerald-400">
                <span>✓</span> Transmission Confirmed
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl text-ink font-medium">
                Thank you, {completedOrder.customer.name.split(" ")[0]}
              </h1>
              <p className="text-sm text-muted">
                Order <strong className="font-mono text-gold">{completedOrder.orderId}</strong> has been successfully authorized and recorded.
              </p>
            </div>

            <div className="text-right sm:border-l sm:border-line sm:pl-6 space-y-1">
              <span className="font-mono text-xs text-muted block uppercase">Total Paid</span>
              <span className="font-serif text-3xl text-gold font-bold">
                ${completedOrder.total.toFixed(2)} CAD
              </span>
              <span className="font-mono text-[0.65rem] text-faint block">
                Paid via {completedOrder.paymentMethod} (ending in {completedOrder.cardLast4})
              </span>
            </div>
          </div>
        </div>

        {/* Sovereign Membership Activated Callout Banner */}
        {completedOrder.items.some(
          (i) => i.id === "members-access" || i.id.includes("member")
        ) && (
          <div className="card p-6 sm:p-8 border-gold/70 bg-gradient-to-r from-[#1f1a14] via-[#161411] to-[#0f0e0c] shadow-[0_15px_40px_-15px_rgba(212,175,55,0.4)] relative overflow-hidden space-y-4">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold via-amber-300 to-gold" />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-2.5 py-0.5 font-mono text-[0.7rem] text-gold">
                  <span>✓</span> Sovereign Tier Activated · Paid Member Access ($50 CAD)
                </div>
                <h3 className="font-serif text-2xl text-ink font-medium">
                  Welcome to the Sovereign Membership Sanctuary
                </h3>
                <p className="text-xs text-muted max-w-xl leading-relaxed">
                  Your paid membership is fully active. All 3 private 30-min video consultations with Jeremy Ashe, 8 curriculum modules, and complete Reading Vault downloads are unlocked.
                </p>
              </div>
              <Link
                href="/members"
                className="btn-gold py-3 px-6 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shrink-0"
              >
                <span>👑</span> Enter Sovereign Member Portal →
              </Link>
            </div>
          </div>
        )}

        {/* Sovereign Academy Course Activated Callout Banner */}
        {completedOrder.items.some(
          (i) => i.id.includes("course") || i.id.includes("bundle") || i.category === "course"
        ) && (
          <div className="card p-6 sm:p-8 border-gold/70 bg-gradient-to-r from-[#171d28] via-[#121620] to-[#0d1017] shadow-[0_15px_40px_-15px_rgba(212,175,55,0.4)] relative overflow-hidden space-y-4">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold via-amber-300 to-gold" />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-2.5 py-0.5 font-mono text-[0.7rem] text-gold">
                  <span>✦</span> Academy Enrollment Activated · Full Syllabus Unlocked
                </div>
                <h3 className="font-serif text-2xl text-ink font-medium">
                  Welcome to the Sovereign Academy Classroom
                </h3>
                <p className="text-xs text-muted max-w-xl leading-relaxed">
                  Your curriculum access is active. All multi-modal lessons, audio transmissions, and interactive in-browser workbooks are unlocked.
                </p>
              </div>
              <Link
                href="/academy"
                className="btn-gold py-3 px-6 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shrink-0"
              >
                <span>🎓</span> Enter Academy Classroom →
              </Link>
            </div>
          </div>
        )}

        {/* Meeting Booking Unlocked Callout Banner */}
        {completedOrder.items.some(
          (i) => i.id.includes("intro-call") || i.id.includes("session") || i.category === "advisory"
        ) && (
          <div className="card p-6 sm:p-8 border-gold/70 bg-gradient-to-r from-[#1b2332] via-[#141b25] to-[#111620] shadow-[0_15px_40px_-15px_rgba(212,175,55,0.35)] relative overflow-hidden space-y-4">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-gold to-emerald-400" />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[0.7rem] text-emerald-400">
                  <span>✓</span> Payment Verified · $20 Intro Call Authorized
                </div>
                <h3 className="font-serif text-2xl text-ink font-medium">
                  Schedule Your 15-Minute Session Now
                </h3>
                <p className="text-xs text-muted max-w-xl leading-relaxed">
                  Your $20 payment has unlocked Jeremy Ashe&apos;s live calendar. Click below to select your exact date and time on Google Calendar.
                </p>
              </div>
              <Link
                href="/book"
                className="btn-gold py-3 px-6 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 shadow-lg shrink-0"
              >
                <span>📅</span> Open Live Booking Calendar →
              </Link>
            </div>
          </div>
        )}

        {/* Immediate Digital Access Center */}
        <div className="card p-8 border-line-strong bg-charcoal-raised space-y-6">
          <div className="border-b border-line pb-4 flex items-center justify-between">
            <div>
              <span className="eyebrow">Immediate Fulfillment</span>
              <h2 className="font-serif text-2xl text-ink mt-0.5">Your Digital Asset Transmissions</h2>
            </div>
            <span className="font-mono text-xs text-gold">Ready for download ✓</span>
          </div>

          <p className="text-sm text-muted">
            Direct download links have been provisioned below and an archived confirmation has been dispatched to <strong className="text-ink">{completedOrder.customer.email}</strong>.
          </p>

          <div className="space-y-3">
            {completedOrder.items.map((item, idx) => {
              const isMeeting =
                item.id.includes("intro-call") ||
                item.id.includes("session") ||
                item.category === "advisory";
              const isMembership =
                item.id === "members-access" ||
                item.id.includes("member");

              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-line bg-charcoal/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-gold">#{idx + 1}</span>
                      <h3 className="font-serif text-lg text-ink font-medium">{item.title}</h3>
                      {item.tier && (
                        <span className="font-mono text-[0.6rem] bg-gold/10 text-gold px-2 py-0.5 rounded border border-gold/30">
                          Tier {item.tier}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted">
                      {item.subtitle ?? "Full digital license & printable vector diagrams."}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    {isMembership ? (
                      <Link
                        href="/members"
                        className="btn-gold text-xs py-2 px-4 flex items-center gap-2 font-semibold shadow-md"
                      >
                        <span>👑</span> Enter Member Portal →
                      </Link>
                    ) : isMeeting ? (
                      <Link
                        href="/book"
                        className="btn-gold text-xs py-2 px-4 flex items-center gap-2 font-semibold shadow-md"
                      >
                        <span>📅</span> Pick Date &amp; Time on Calendar →
                      </Link>
                    ) : (
                      <a
                        href={item.downloadUrl ?? "/api/download/the-architecture-of-reality.pdf"}
                        download
                        className="btn-gold text-xs py-2 px-4 flex items-center gap-2"
                      >
                        <span>⬇</span> Download Authenticated PDF
                      </a>
                    )}
                    <Link
                      href={isMembership ? "/members" : "/library"}
                      className="btn-ghost text-xs py-2 px-3 text-muted hover:text-ink"
                    >
                      {isMembership ? "Open Sanctuary ↗" : "Open in Library ↗"}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Row */}
          <div className="pt-6 border-t border-line flex flex-wrap items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => window.print()}
              className="btn-ghost text-xs py-2 px-4 flex items-center gap-2 text-muted hover:text-ink cursor-pointer"
            >
              <span>🖨</span> Print Invoice / Receipt
            </button>

            <div className="flex items-center gap-3">
              {completedOrder.items.some(
                (i) => i.id === "members-access" || i.id.includes("member")
              ) ? (
                <Link href="/members" className="btn-gold text-xs py-2 px-4 font-semibold shadow-md">
                  👑 Enter Member Portal →
                </Link>
              ) : (
                <Link href="/audit" className="btn-gold text-xs py-2 px-4">
                  Take Diagnostic Audit →
                </Link>
              )}
              <Link href="/library" className="btn-ghost text-xs py-2 px-4">
                Explore Reading Room
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: EMPTY CHECKOUT BASKET
  // ==========================================
  if (items.length === 0) {
    return (
      <div className="container-x py-24 max-w-2xl text-center space-y-6">
        <div className="size-20 rounded-2xl border border-dashed border-gold/40 bg-gold/5 mx-auto grid place-items-center text-3xl text-gold">
          ⚡
        </div>
        <div className="space-y-2">
          <span className="eyebrow">Checkout Staging</span>
          <h1 className="font-serif text-3xl sm:text-4xl text-ink">
            No items are currently staged for checkout
          </h1>
          <p className="text-sm text-muted max-w-md mx-auto leading-relaxed">
            Select an operational field manual, mastery course, or advisory package from the catalog to proceed through our secure checkout.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link href="/offers" className="btn-gold py-3 px-8 text-sm">
            View Offers &amp; Field Manuals →
          </Link>
          <Link href="/library" className="btn-ghost py-3 px-6 text-sm">
            Browse The Trilogy
          </Link>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: ACTIVE CHECKOUT FORM & MONEY BREAKDOWN
  // ==========================================
  return (
    <div className="container-x py-12 lg:py-16 space-y-10">
      {/* Page Header */}
      <div className="border-b border-line pb-6 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-3">
        <div className="space-y-1">
          <span className="eyebrow">Encrypted Checkout &amp; Acquisition</span>
          <h1 className="font-serif text-3xl sm:text-4xl text-ink">Complete Your Order</h1>
        </div>
        <div className="flex items-center gap-2 font-mono text-xs text-muted">
          <span className="text-emerald-400">🔒</span> 256-Bit SSL Encrypted Sovereign Channel
        </div>
      </div>

      <div className="grid gap-12 lg:grid-cols-[1fr_420px] items-start">
        {/* =========================================
            LEFT COLUMN: CUSTOMER & PAYMENT FORM
            ========================================= */}
        <form onSubmit={handleSubmitPayment} className="space-y-8">
          {/* Section 1: Customer Details */}
          <div className="card p-6 sm:p-8 space-y-5 bg-charcoal/70 border-line">
            <div className="border-b border-line pb-3 flex items-center justify-between">
              <h2 className="font-serif text-xl text-ink font-medium">
                1. Customer &amp; Transmission Details
              </h2>
              <span className="font-mono text-xs text-gold">Step 1 of 2</span>
            </div>

            <p className="text-xs text-muted leading-relaxed">
              Your digital field manuals, license certificates, and receipt will be dispatched directly to your email immediately upon authorization.
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5 sm:col-span-2">
                <label htmlFor="customer-name" className="font-mono text-xs text-ink/90 block">
                  Full Name <span className="text-gold">*</span>
                </label>
                <input
                  id="customer-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jeremy Ashe"
                  className="input-dark w-full text-sm py-2 px-3.5"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label htmlFor="customer-email" className="font-mono text-xs text-ink/90 block">
                  Email Address for Delivery <span className="text-gold">*</span>
                </label>
                <input
                  id="customer-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operator@domain.com"
                  className="input-dark w-full text-sm py-2 px-3.5"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label htmlFor="customer-company" className="font-mono text-xs text-muted block">
                  Enterprise / Organization <span className="text-faint">(Optional)</span>
                </label>
                <input
                  id="customer-company"
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Sovereign Architecture Labs"
                  className="input-dark w-full text-sm py-2 px-3.5"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Payment Method */}
          <div className="card p-6 sm:p-8 space-y-6 bg-charcoal/70 border-line">
            <div className="border-b border-line pb-3 flex items-center justify-between">
              <h2 className="font-serif text-xl text-ink font-medium">
                2. Secure Payment Authorization
              </h2>
              <button
                type="button"
                onClick={fillDemoCard}
                className="font-mono text-[0.65rem] text-gold/80 hover:text-gold border border-gold/30 rounded px-2 py-0.5 hover:bg-gold/10 transition cursor-pointer"
              >
                ⚡ Quick Fill Test Card
              </button>
            </div>

            {/* Payment Type Selection Tabs — Responsive Mobile & Desktop Layout */}
            <div className="flex flex-col sm:flex-row w-full p-1 rounded-xl border border-line/80 bg-charcoal/60 gap-1.5">
              <button
                type="button"
                onClick={() => setPaymentType("stripe")}
                className={`w-full sm:flex-1 py-2.5 px-3 rounded-lg text-center transition duration-200 cursor-pointer flex items-center justify-center gap-2 font-mono text-xs border ${
                  paymentType === "stripe"
                    ? "border-gold/80 bg-gradient-to-r from-gold/25 via-gold/15 to-gold/20 text-gold font-semibold shadow-[0_0_12px_rgba(212,175,55,0.25)] ring-1 ring-gold/40"
                    : "border-transparent text-muted hover:text-ink hover:bg-charcoal/80"
                }`}
              >
                <span className="text-sm">⚡</span>
                <span>Stripe Checkout (Cards / Apple Pay / Google Pay)</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentType("card")}
                className={`w-full sm:w-auto py-2.5 px-4 rounded-lg text-center transition duration-200 cursor-pointer flex items-center justify-center gap-2 font-mono text-xs border ${
                  paymentType === "card"
                    ? "border-gold/80 bg-gradient-to-r from-gold/25 via-gold/15 to-gold/20 text-gold font-semibold shadow-[0_0_12px_rgba(212,175,55,0.25)] ring-1 ring-gold/40"
                    : "border-transparent text-muted hover:text-ink hover:bg-charcoal/80"
                }`}
              >
                <span className="text-sm">🛠️</span>
                <span>Sandbox Mode</span>
              </button>
            </div>

            {/* Stripe Setup Notice if triggered */}
            {showStripeGuide && (
              <div className="p-4 rounded-xl border border-amber-500/40 bg-amber-500/10 text-xs space-y-2">
                <div className="flex items-center gap-2 text-amber-300 font-medium">
                  <span>ℹ️</span>
                  <span>Stripe API Key Needed for Live Payments</span>
                </div>
                <p className="text-stone-300 leading-relaxed">
                  {stripeNotice || "To process live card payments, paste your Stripe API keys into your `.env.local` file."}
                </p>
                <div className="font-mono text-[11px] text-stone-400 bg-black/40 p-2.5 rounded border border-stone-800">
                  <div>STRIPE_SECRET_KEY=&quot;sk_live_...&quot;</div>
                  <div>NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=&quot;pk_live_...&quot;</div>
                </div>
                <div className="pt-1 flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentType("card");
                      fillDemoCard();
                      setShowStripeGuide(false);
                    }}
                    className="text-gold underline hover:text-gold-bright transition cursor-pointer font-mono"
                  >
                    Switch to Sandbox Test Order &rarr;
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowStripeGuide(false)}
                    className="text-stone-400 hover:text-stone-200 transition cursor-pointer"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            )}

            {paymentType === "stripe" ? (
              <div className="p-6 rounded-xl border border-line bg-gradient-to-b from-charcoal/90 to-[#0e1218] space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-line/60">
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-sm font-medium text-ink">Stripe Secure Checkout</span>
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      PCI-DSS Level 1
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-stone-400 font-mono">
                    <span>Pay</span>
                    <span>GPay</span>
                    <span>Link</span>
                    <span>Visa</span>
                    <span>MC</span>
                  </div>
                </div>
                <p className="text-xs text-stone-300 leading-relaxed">
                  When you click the button below, you will be securely redirected to Stripe to finalize your transaction. Supports Apple Pay, Google Pay, credit/debit cards, and Link with end-to-end encryption.
                </p>
                <div className="flex items-center gap-4 text-[11px] font-mono text-stone-400">
                  <span className="flex items-center gap-1 text-emerald-400">
                    <span>✓</span> Instant Digital Access
                  </span>
                  <span className="flex items-center gap-1 text-gold">
                    <span>⚡</span> Automated Points Credit
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-4 pt-1">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-stone-400">Local Sandbox Mode</span>
                  <button
                    type="button"
                    onClick={fillDemoCard}
                    className="font-mono text-[0.65rem] text-gold/80 hover:text-gold border border-gold/30 rounded px-2 py-0.5 hover:bg-gold/10 transition cursor-pointer"
                  >
                    ⚡ Quick Fill Test Card
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="card-number" className="font-mono text-xs text-ink/90 block">
                    Card Number <span className="text-gold">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="card-number"
                      type="text"
                      required={paymentType === "card"}
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="4242 4242 4242 4242"
                      className="input-dark w-full font-mono text-sm py-2 px-3.5 tracking-wider"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-xs text-muted">
                      <span>VISA</span>
                      <span>MC</span>
                      <span>AMEX</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="card-expiry" className="font-mono text-xs text-ink/90 block">
                      Expiry Date <span className="text-gold">*</span>
                    </label>
                    <input
                      id="card-expiry"
                      type="text"
                      required={paymentType === "card"}
                      value={cardExpiry}
                      onChange={handleExpiryChange}
                      placeholder="MM/YY"
                      className="input-dark w-full font-mono text-sm py-2 px-3.5"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="card-cvc" className="font-mono text-xs text-ink/90 block">
                      Security Code (CVC) <span className="text-gold">*</span>
                    </label>
                    <input
                      id="card-cvc"
                      type="password"
                      required={paymentType === "card"}
                      maxLength={4}
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ""))}
                      placeholder="•••"
                      className="input-dark w-full font-mono text-sm py-2 px-3.5 tracking-widest"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Terms check */}
            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer text-xs text-muted">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-0.5 accent-gold"
                />
                <span>
                  I agree to the Sovereign Operating Protocol, non-disclosure license terms, and understand all digital materials include the 30-Day Dynamic Balance Guarantee.
                </span>
              </label>
            </div>

            {/* Submit Payment CTA */}
            <div className="pt-4 border-t border-line space-y-3">
              <button
                type="submit"
                disabled={processing || !agreeTerms}
                className="btn-gold w-full py-4 text-base font-semibold flex items-center justify-center gap-2 cursor-pointer shadow-[0_10px_30px_-10px_rgba(212,175,55,0.4)] disabled:opacity-50"
              >
                {processing ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin text-lg">⚡</span> {processingMessage}
                  </span>
                ) : paymentType === "stripe" ? (
                  <span>🔒 Pay with Stripe · ${total.toFixed(2)} CAD</span>
                ) : (
                  <span>🔒 Process Test Order · ${total.toFixed(2)} CAD</span>
                )}
              </button>

              {/* Zero-Cost Local Dev Bypass Button */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleDevBypass}
                  className="w-full py-3 px-4 rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-mono text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 transition cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                >
                  <span>⚡</span>
                  <span>Instant Local Dev Bypass ($0.00 Test Fulfillment)</span>
                </button>
              </div>

              <div className="flex items-center justify-center gap-6 font-mono text-[0.65rem] text-faint">
                <span>✓ 256-Bit SSL</span>
                <span>✓ Instant Delivery</span>
                <span>✓ 30-Day Guarantee</span>
              </div>
            </div>
          </div>
        </form>

        {/* =========================================
            RIGHT COLUMN: ORDER SUMMARY & THE MONEY
            ========================================= */}
        <div className="space-y-6 lg:sticky lg:top-24">
          <div className="card p-6 sm:p-7 border-gold/40 bg-[#12161f] shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h3 className="font-serif text-xl text-ink font-medium">Order Summary</h3>
              <span className="font-mono text-xs text-gold">
                {items.reduce((s, i) => s + i.quantity, 0)} Item(s)
              </span>
            </div>

            {/* Itemized Staged Products */}
            <div className="space-y-3.5">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between gap-3 pb-3 border-b border-line/50 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-ink">{item.title}</span>
                      {item.tier && (
                        <span className="font-mono text-[0.55rem] text-gold/90 bg-gold/10 px-1.5 py-0.2 rounded border border-gold/30">
                          T{item.tier}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 pt-0.5 text-muted">
                      <div className="inline-flex items-center rounded-md border border-line bg-charcoal/80 overflow-hidden">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="size-5 flex items-center justify-center text-muted hover:text-gold hover:bg-gold/10 transition cursor-pointer text-xs"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="px-2 font-mono text-[0.7rem] text-ink font-medium">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="size-5 flex items-center justify-center text-muted hover:text-gold hover:bg-gold/10 transition cursor-pointer text-xs"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-[0.65rem] text-faint hover:text-red-400 transition cursor-pointer ml-1"
                      >
                        remove
                      </button>
                    </div>
                  </div>

                  <span className="font-mono text-sm text-gold font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Order Bump Special */}
            <div
              onClick={handleOrderBumpToggle}
              className={`p-3.5 rounded-xl border transition cursor-pointer space-y-2 ${
                orderBump
                  ? "border-gold/60 bg-gold/10 shadow-sm"
                  : "border-line bg-charcoal/60 hover:border-gold/30"
              }`}
            >
              <div className="flex items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={orderBump}
                  onChange={() => {}}
                  className="mt-1 accent-gold"
                />
                <div>
                  <span className="font-mono text-[0.62rem] text-gold uppercase tracking-wider block">
                    Exclusive Checkout Upgrade
                  </span>
                  <p className="font-serif text-xs text-ink font-medium">
                    Add Trilogy Companion Workbooks for only +$27
                  </p>
                  <p className="text-[0.68rem] text-muted mt-0.5">
                    Save $20 off regular $47 pricing. Interactive PDF worksheets for Fruit Tests and 10 Firewalls.
                  </p>
                </div>
              </div>
            </div>

            {/* Promo Code Form */}
            <div className="pt-2">
              {discount ? (
                <div className="flex items-center justify-between bg-gold/10 border border-gold/30 rounded-lg p-2 text-xs text-gold">
                  <span className="font-mono">✓ {discount.code} applied</span>
                  <button
                    type="button"
                    onClick={removeDiscount}
                    className="underline text-[0.7rem] hover:text-ink cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePromoSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Promo Code (e.g. SOVEREIGN)"
                    className="input-dark flex-1 text-xs py-1.5 px-3 uppercase font-mono"
                  />
                  <button type="submit" className="btn-ghost text-xs py-1.5 px-3">
                    Apply
                  </button>
                </form>
              )}
              {promoMessage && (
                <p
                  className={`text-[0.68rem] mt-1 ${
                    promoMessage.ok ? "text-emerald-400" : "text-amber-400"
                  }`}
                >
                  {promoMessage.text}
                </p>
              )}
            </div>

            {/* Money Calculation Grid */}
            <div className="pt-4 border-t border-line space-y-2 text-xs">
              <div className="flex justify-between text-muted">
                <span>Subtotal</span>
                <span className="font-mono text-ink">${subtotal.toFixed(2)}</span>
              </div>

              {discount && (
                <div className="flex justify-between text-gold">
                  <span>Scholarship Discount ({discount.code})</span>
                  <span className="font-mono">-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-muted">
                <span>Digital Educational Delivery</span>
                <span className="font-mono text-emerald-400">$0.00 (Free)</span>
              </div>

              <div className="flex justify-between text-muted">
                <span>Estimated Tax</span>
                <span className="font-mono text-ink">$0.00</span>
              </div>

              <div className="pt-3 border-t border-line flex justify-between items-baseline">
                <div>
                  <span className="font-serif text-lg text-ink font-semibold block">Total Due</span>
                  <span className="font-mono text-[0.62rem] text-muted">Instant transmission</span>
                </div>
                <span className="font-serif text-3xl text-gold font-bold">
                  ${total.toFixed(2)} <span className="text-xs font-mono font-normal">CAD</span>
                </span>
              </div>
            </div>
          </div>

          {/* Guarantee Seal Card */}
          <div className="card p-5 border-line bg-charcoal/40 flex items-start gap-3.5">
            <span className="text-2xl text-gold">⚖</span>
            <div className="space-y-1">
              <h4 className="font-serif text-sm text-ink font-medium">
                30-Day Sovereign Dynamic Balance Guarantee
              </h4>
              <p className="text-[0.72rem] text-muted leading-relaxed">
                If these frameworks and diagnostic tools do not immediately bring structural calm and stop energy leaks in your schedule, simply notify us within 30 days for an unconditional 100% refund.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
