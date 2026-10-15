/**
 * Core domain types for The Architecture of Reality.
 * These mirror the planned Supabase tables so the localStorage adapters
 * can be swapped for a remote backend without touching UI code.
 */

export type Sector = "mind" | "body" | "soul";
export type Drift = "forcing" | "passive";

export interface SectorScores {
  mind: number;
  body: number;
  soul: number;
  total: number;
}

export interface AuditResponse {
  id: string;
  timestamp: string; // ISO-8601
  scores: SectorScores;
  drift: Drift;
  lowestSector: Sector;
  /** Raw answers keyed by question id (-2..+2). Optional for lightweight storage. */
  answers?: Record<string, number>;
}

export interface Lead {
  id: string;
  email: string;
  name?: string;
  source: "audit-report" | "offer-waitlist" | "newsletter";
  auditId?: string;
  offerId?: string;
  createdAt: string;
}

export interface DispatchArticle {
  slug: string;
  title: string;
  summary: string;
  content: string; // Markdown
  category: string;
  readTime: string;
  publishedAt: string; // ISO date
  /** Hebrew root explored in the piece, e.g. "מִצְרַיִם" */
  hebrew?: string;
  transliteration?: string;
  relatedOfferId?: string;
}

export type OfferTier = 1 | 2 | 3;

export interface Offer {
  id: string;
  title: string;
  tier: OfferTier;
  /** CAD (Canadian Dollars). `null` = by application / custom quote. */
  price: number | null;
  description: string;
  deliverables: string[];
  /** Stripe Payment Link or Lemon Squeezy checkout URL. Empty string = not yet live. */
  checkoutUrl: string;
  badge?: string;
}

export interface BookSection {
  id: string;
  title: string;
  body: string; // Markdown
}

export interface Book {
  id: string;
  number: number; // 0 for Foundation Volume, 1, 2, 3
  volumeLabel?: string;
  title: string;
  subtitle: string;
  tagline: string;
  overview: string;
  sections: BookSection[];
  downloadUrl: string | null;
  previewUrl?: string | null;
  filename?: string;
  fileSize?: string;
  googleDriveUrl?: string | null;
}

export interface AuditQuestion {
  id: string;
  sector: Sector;
  prompt: string;
  /** Description of the -2 pole */
  low: string;
  /** Description of the +2 pole */
  high: string;
}
