/**
 * Storage layer.
 *
 * UI code talks ONLY to the `Repository` interfaces below. Today they are
 * backed by localStorage. To move to Supabase later, implement the same
 * interfaces in `supabase.ts` (e.g. `supabase.from('audit_responses').insert(...)`)
 * and swap the exports at the bottom of this file — no component changes needed.
 */
import type { AuditResponse, Lead } from "@/lib/types";

export interface AuditRepository {
  save(response: AuditResponse): Promise<AuditResponse>;
  list(): Promise<AuditResponse[]>;
  latest(): Promise<AuditResponse | null>;
  clear(): Promise<void>;
}

export interface LeadRepository {
  capture(lead: Omit<Lead, "id" | "createdAt">): Promise<Lead>;
  list(): Promise<Lead[]>;
}

const KEYS = {
  audits: "aor:audits:v1",
  leads: "aor:leads:v1",
} as const;

function read<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(key) ?? "[]") as T[];
  } catch {
    return [];
  }
}

function write<T>(key: string, value: T[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
  window.dispatchEvent(new CustomEvent("aor:storage", { detail: { key } }));
}

const uid = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;

const localAuditRepository: AuditRepository = {
  async save(response) {
    const all = read<AuditResponse>(KEYS.audits);
    write(KEYS.audits, [response, ...all].slice(0, 50));
    return response;
  },
  async list() {
    return read<AuditResponse>(KEYS.audits);
  },
  async latest() {
    return read<AuditResponse>(KEYS.audits)[0] ?? null;
  },
  async clear() {
    write(KEYS.audits, []);
  },
};

const localLeadRepository: LeadRepository = {
  async capture(input) {
    const lead: Lead = { ...input, id: uid(), createdAt: new Date().toISOString() };
    write(KEYS.leads, [lead, ...read<Lead>(KEYS.leads)]);
    return lead;
  },
  async list() {
    return read<Lead>(KEYS.leads);
  },
};

// ── Active adapters (swap here for Supabase) ────────────────────────────────
export const auditRepository: AuditRepository = localAuditRepository;
export const leadRepository: LeadRepository = localLeadRepository;
export const STORAGE_EVENT = "aor:storage";
