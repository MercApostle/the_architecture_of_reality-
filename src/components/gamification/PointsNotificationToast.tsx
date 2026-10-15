"use client";

import { useMember } from "@/context/MemberContext";

export default function PointsNotificationToast() {
  const { toasts, removeToast, user } = useMember();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none max-w-sm w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto card p-4 border-gold/70 bg-obsidian/95 backdrop-blur-xl shadow-[0_0_30px_-5px_rgba(212,175,55,0.4)] flex items-start justify-between gap-3 animate-fade-up rounded-2xl ring-1 ring-gold/40"
        >
          <div className="flex items-start gap-3">
            <div className="size-9 rounded-xl bg-gradient-to-br from-gold to-[#997a15] text-obsidian font-bold text-base flex items-center justify-center shrink-0 shadow-md">
              ⭐
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-gold uppercase tracking-wider">
                  +{toast.points} Points Earned!
                </span>
                {user && (
                  <span className="font-mono text-[0.62rem] text-faint bg-charcoal px-1.5 py-0.2 rounded border border-line">
                    Total: {user.points} pts
                  </span>
                )}
              </div>
              <p className="text-xs text-ink font-medium leading-snug">{toast.title}</p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => removeToast(toast.id)}
            className="text-muted hover:text-gold text-xs p-1 cursor-pointer transition shrink-0"
            aria-label="Dismiss notification"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
