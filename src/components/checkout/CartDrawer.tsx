"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    subtotal,
    discount,
    discountAmount,
    total,
    applyDiscount,
    removeDiscount,
    clearCart,
  } = useCart();

  const router = useRouter();
  const [promoCode, setPromoCode] = useState("");
  const [promoMsg, setPromoMsg] = useState<{ text: string; ok: boolean } | null>(null);

  if (!isOpen) return null;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode.trim()) return;
    const res = applyDiscount(promoCode);
    setPromoMsg({ text: res.message, ok: res.success });
    if (res.success) setPromoCode("");
  };

  const handleGoToCheckout = () => {
    closeCart();
    router.push("/checkout");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity animate-fade-in"
        onClick={closeCart}
      />

      {/* Drawer Panel */}
      <aside
        className="fixed inset-y-0 right-0 flex max-w-full pl-3 sm:pl-10"
        aria-labelledby="cart-title"
      >
        <div className="w-screen max-w-md bg-[#0e1218] border-l border-line-strong shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-6 border-b border-line flex items-center justify-between bg-charcoal/50">
            <div className="flex items-center gap-3">
              <span className="grid size-8 place-items-center rounded-lg border border-gold/40 bg-gold/10 text-gold text-sm">
                🛒
              </span>
              <div>
                <h2 id="cart-title" className="font-serif text-xl text-ink font-medium">
                  Sovereign Checkout
                </h2>
                <p className="font-mono text-[0.65rem] text-muted">
                  {items.length === 0
                    ? "Basket is empty"
                    : `${items.reduce((s, i) => s + i.quantity, 0)} item(s) staged for transmission`}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={closeCart}
              className="grid size-8 place-items-center rounded-lg border border-line text-muted hover:text-ink hover:border-gold/50 transition cursor-pointer"
              aria-label="Close cart"
            >
              ✕
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="py-12 text-center space-y-4">
                <div className="size-16 rounded-full border border-dashed border-line-strong mx-auto grid place-items-center text-2xl text-muted">
                  ⚡
                </div>
                <div className="space-y-1">
                  <p className="font-serif text-lg text-ink">Your checkout basket is empty</p>
                  <p className="text-xs text-muted max-w-xs mx-auto">
                    Select a field manual, mastery course, or collector&apos;s bundle to stage for checkout.
                  </p>
                </div>

                <div className="pt-4">
                  <Link
                    href="/offers"
                    onClick={closeCart}
                    className="btn-gold text-xs py-2 px-5 inline-block"
                  >
                    Explore Tier 1 &amp; Tier 2 Offers →
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="card p-4 border-line bg-charcoal/70 flex flex-col justify-between gap-3 relative hover:border-line-strong transition"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        {item.tier && (
                          <span className="font-mono text-[0.6rem] text-gold/80 uppercase tracking-widest block">
                            Tier {item.tier} System
                          </span>
                        )}
                        <h4 className="font-serif text-base text-ink font-medium leading-tight mt-0.5">
                          {item.title}
                        </h4>
                        {item.subtitle && (
                          <p className="text-[0.7rem] text-muted line-clamp-1 mt-0.5">
                            {item.subtitle}
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-muted hover:text-red-400 text-xs p-1 transition cursor-pointer"
                        title="Remove item"
                      >
                        ✕
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-line/60">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-line rounded-lg bg-obsidian overflow-hidden">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, -1)}
                          className="px-2.5 py-1 text-xs text-muted hover:text-gold hover:bg-charcoal transition cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="px-3 font-mono text-xs text-ink">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, 1)}
                          className="px-2.5 py-1 text-xs text-muted hover:text-gold hover:bg-charcoal transition cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      {/* Line Price Calculation */}
                      <div className="text-right">
                        <div className="font-serif text-base text-gold font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                        {item.quantity > 1 && (
                          <span className="font-mono text-[0.65rem] text-muted block">
                            ${item.price.toFixed(2)} ea
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={clearCart}
                  className="font-mono text-[0.65rem] text-muted hover:text-red-400 transition cursor-pointer pt-2 block ml-auto"
                >
                  Empty basket
                </button>
              </div>
            )}

            {/* Promo Code Box */}
            {items.length > 0 && (
              <div className="pt-4 border-t border-line">
                {discount ? (
                  <div className="flex items-center justify-between bg-gold/10 border border-gold/30 rounded-lg p-2.5 text-xs text-gold">
                    <span className="font-mono">
                      ✓ {discount.code} ({discount.description})
                    </span>
                    <button
                      type="button"
                      onClick={removeDiscount}
                      className="text-muted hover:text-ink text-xs underline cursor-pointer ml-2"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyPromo} className="space-y-1.5">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="Promo code (e.g. SOVEREIGN)"
                        className="input-dark flex-1 text-xs py-1.5 px-3 uppercase font-mono"
                      />
                      <button
                        type="submit"
                        className="btn-ghost text-xs py-1.5 px-3 shrink-0"
                      >
                        Apply
                      </button>
                    </div>
                    {promoMsg && (
                      <p
                        className={`text-[0.68rem] ${
                          promoMsg.ok ? "text-emerald-400" : "text-amber-400"
                        }`}
                      >
                        {promoMsg.text}
                      </p>
                    )}
                  </form>
                )}
              </div>
            )}
          </div>

          {/* Footer & Money Summary */}
          {items.length > 0 && (
            <div className="p-6 border-t border-line bg-charcoal/80 space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-muted">
                  <span>Subtotal</span>
                  <span className="font-mono text-ink">${subtotal.toFixed(2)}</span>
                </div>

                {discount && (
                  <div className="flex justify-between text-gold">
                    <span>Scholarship / Discount</span>
                    <span className="font-mono">-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-muted">
                  <span>Digital Delivery &amp; Tax</span>
                  <span className="font-mono text-emerald-400">$0.00 (Free)</span>
                </div>

                <div className="pt-2 border-t border-line flex justify-between items-baseline">
                  <span className="font-serif text-base text-ink font-medium">Total (CAD)</span>
                  <span className="font-serif text-2xl text-gold font-bold">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={handleGoToCheckout}
                  className="btn-gold w-full py-3 text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                >
                  <span>🔒</span> Proceed to Complete Checkout (${total.toFixed(2)}) →
                </button>

                <p className="font-mono text-[0.62rem] text-faint text-center">
                  256-Bit SSL Encrypted · Instant Transmission · 30-Day Guarantee
                </p>
              </div>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
