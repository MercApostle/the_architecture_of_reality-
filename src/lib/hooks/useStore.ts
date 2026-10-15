"use client";

import { useCallback, useEffect, useState } from "react";
import { auditRepository, leadRepository, STORAGE_EVENT } from "@/lib/storage";
import type { AuditResponse, Lead } from "@/lib/types";

/** Reactive view over saved audits. Works identically once the repo is remote. */
export function useAuditHistory() {
  const [history, setHistory] = useState<AuditResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setHistory(await auditRepository.list());
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener(STORAGE_EVENT, refresh);
    return () => window.removeEventListener(STORAGE_EVENT, refresh);
  }, [refresh]);

  const save = useCallback((r: AuditResponse) => auditRepository.save(r), []);
  const clear = useCallback(() => auditRepository.clear(), []);

  return { history, latest: history[0] ?? null, loading, save, clear };
}

/** Lead capture with simple status tracking. */
export function useLeadCapture() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const capture = useCallback(async (lead: Omit<Lead, "id" | "createdAt">) => {
    setStatus("submitting");
    try {
      // Simulated latency so the UX matches a future network round-trip.
      await new Promise((r) => setTimeout(r, 600));
      const saved = await leadRepository.capture(lead);
      setStatus("success");
      return saved;
    } catch {
      setStatus("error");
      return null;
    }
  }, []);

  const reset = useCallback(() => setStatus("idle"), []);

  return { status, capture, reset };
}
