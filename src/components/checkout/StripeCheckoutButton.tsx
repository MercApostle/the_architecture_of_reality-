"use client";

import React, { useState } from "react";

export interface StripeCheckoutButtonProps {
  priceId?: string;
  cancelUrl?: string;
  successUrl?: string;
  buttonText?: string;
  subtext?: string;
  className?: string;
  variant?: "primary" | "compact" | "card";
  onSuccess?: (url: string) => void;
  onError?: (errorMessage: string) => void;
}

export default function StripeCheckoutButton({
  priceId,
  cancelUrl,
  successUrl,
  buttonText = "Proceed to Secure Stripe Checkout",
  subtext = "Apple Pay · Google Pay · Visa · MasterCard · Amex",
  className = "",
  variant = "primary",
  onSuccess,
  onError,
}: StripeCheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleCheckout = async () => {
    try {
      setIsLoading(true);
      setErrorMessage(null);

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId,
          cancelUrl: cancelUrl || (typeof window !== "undefined" ? window.location.href : undefined),
          successUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.error) {
        throw new Error(data.error || "Unable to initialize Stripe checkout session");
      }

      if (data.url) {
        if (onSuccess) onSuccess(data.url);
        // Redirect browser window to the Stripe-hosted checkout page
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned from server.");
      }
    } catch (err: unknown) {
      console.error("Stripe Checkout Trigger Error:", err);
      const msg = err instanceof Error ? err.message : "Payment checkout failed to start";
      setErrorMessage(msg);
      if (onError) onError(msg);
      setIsLoading(false);
    }
  };

  if (variant === "compact") {
    return (
      <div className={`inline-block ${className}`}>
        <button
          type="button"
          onClick={handleCheckout}
          disabled={isLoading}
          className="relative inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all duration-300 cursor-pointer bg-gradient-to-b from-[#1E232E] to-[#0D1016] text-[#F5F5F7] border border-[#C5A880]/60 hover:border-[#DFBA87] hover:text-white hover:shadow-[0_0_20px_rgba(197,168,128,0.25)] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#C5A880]" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span>Connecting Stripe...</span>
            </>
          ) : (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-[#C5A880]" />
              <span>{buttonText}</span>
            </>
          )}
        </button>
        {errorMessage && (
          <p className="mt-1.5 text-[11px] font-mono text-red-400">{errorMessage}</p>
        )}
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {errorMessage && (
        <div className="mb-4 p-3.5 rounded-xl bg-red-950/40 border border-red-800/60 text-xs text-red-300 font-mono flex items-start gap-2.5">
          <svg className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <div className="font-semibold">Checkout Connection Notice</div>
            <div className="mt-0.5 text-red-400/90 leading-relaxed">{errorMessage}</div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={handleCheckout}
        disabled={isLoading}
        className="group relative w-full overflow-hidden rounded-xl p-[1px] focus:outline-none focus:ring-2 focus:ring-[#C5A880]/50 active:scale-[0.99] transition-transform duration-200 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
      >
        {/* Metallic Gold Animated Border Glow */}
        <span className="absolute inset-0 bg-gradient-to-r from-[#C5A880]/40 via-[#DFBA87] to-[#C5A880]/40 group-hover:from-[#DFBA87] group-hover:to-[#C5A880] transition-colors duration-500" />

        {/* Button Core: Obsidian Dark Charcoal */}
        <span className="relative flex flex-col items-center justify-center w-full px-6 py-4 rounded-[11px] bg-gradient-to-b from-[#141822] to-[#0A0C11] text-[#F5F5F7] group-hover:bg-[#161B26] transition-colors duration-300">
          <span className="flex items-center gap-2.5 font-mono text-xs sm:text-sm uppercase tracking-wider text-stone-100 group-hover:text-white font-semibold">
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4 text-[#C5A880]" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                <span>Opening Stripe Secure Portal...</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 text-[#C5A880]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>{buttonText}</span>
                <span className="text-[#C5A880] group-hover:translate-x-0.5 transition-transform">→</span>
              </>
            )}
          </span>

          {subtext && (
            <span className="mt-1 text-[11px] font-mono text-stone-400 group-hover:text-stone-300 tracking-wide">
              {subtext}
            </span>
          )}
        </span>
      </button>

      {/* Security Endorsement Badges */}
      <div className="mt-3 flex items-center justify-center gap-4 text-[10px] font-mono text-stone-400 tracking-wider">
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5 text-[#C5A880]" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          256-Bit Encrypted
        </span>
        <span className="text-stone-700">·</span>
        <span>Stripe Vault Protected</span>
        <span className="text-stone-700">·</span>
        <span>Zero Storage of Card Data</span>
      </div>
    </div>
  );
}
