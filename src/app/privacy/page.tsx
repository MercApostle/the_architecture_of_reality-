import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/ui/primitives';
import PrivacyRequestConsole from '@/components/privacy/PrivacyRequestConsole';

export const metadata: Metadata = {
  title: 'Privacy Policy & BC PIPA Regulatory Compliance · The Architecture of Reality',
  description:
    'Comprehensive statutory privacy policy, data minimization standards, and data subject rights pursuant to the British Columbia Personal Information Protection Act (BC PIPA).',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-obsidian text-ink">
      <PageHero
        eyebrow="Statutory Compliance & Data Sovereignty"
        title={
          <>
            Privacy Policy &amp; <span className="text-gradient-gold italic">BC PIPA Accord</span>
          </>
        }
        lede="The Architecture of Reality operates under strict British Columbia regulatory compliance, rigorous data minimization principles, and load-bearing security safeguards. We do not sell, track, or syndicate personal information."
      />

      <section className="container-x py-14 max-w-4xl space-y-14">
        {/* Summary Card */}
        <div className="card p-6 sm:p-8 border-gold/40 bg-gradient-to-r from-charcoal via-charcoal to-[#181a10] space-y-3">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-widest text-gold font-bold">
              Jurisdiction: British Columbia, Canada
            </span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-ink font-medium">
            Sovereign Data Governance Protocol
          </h2>
          <p className="text-xs sm:text-sm text-muted leading-relaxed">
            This policy outlines how personal information is collected, used, protected, and managed pursuant to British Columbia&apos;s <em>Personal Information Protection Act</em> (SBC 2003, c. 63) (&ldquo;BC PIPA&rdquo;) and applicable Canadian federal privacy principles.
          </p>
        </div>

        {/* Policy Sections */}
        <div className="space-y-10 text-sm text-muted leading-relaxed divide-y divide-line">
          {/* Section 1: Explicit Purpose Specification */}
          <div className="space-y-4 pt-6 first:pt-0">
            <h3 className="font-serif text-2xl text-ink flex items-center gap-3">
              <span className="font-mono text-xs text-gold border border-gold/30 px-2 py-0.5 rounded bg-gold/10">01</span>
              Explicit Purpose of Collection
            </h3>
            <p>
              Under BC PIPA Section 10, personal information may only be collected for purposes that a reasonable person would consider appropriate in the circumstances. We collect personal data strictly for the following operational purposes:
            </p>
            <ul className="space-y-2 list-disc list-inside text-ink/90 pl-2">
              <li>
                <strong className="text-gold">Energy &amp; Time Diagnostic Assessment (/audit):</strong> Calculated sector scores, stress polarity, and email are collected solely to generate and transmit your tailored 72-Hour Calibration Directive.
              </li>
              <li>
                <strong className="text-gold">Sovereign Academy &amp; Member Vault (/academy, /members):</strong> Member ID, email, and password hashes are collected to authenticate encrypted access, maintain curriculum completion, and allocate 1-on-1 strategy calls.
              </li>
              <li>
                <strong className="text-gold">Executive Advisory Applications (/meet):</strong> Executive contact information, business workload hours, and mission alignment details are collected solely to evaluate consultation suitability.
              </li>
              <li>
                <strong className="text-gold">Digital Commerce &amp; Fulfillment (/checkout):</strong> Name, email, and billing coordinates are processed securely via PCI-DSS Level 1 certified processors (Stripe) to deliver digital orders and tax receipts.
              </li>
              <li>
                <strong className="text-gold">Direct Correspondence (/contact):</strong> Inquiries transmitted to Jeremy Ashe are used exclusively to provide direct replies.
              </li>
            </ul>
          </div>

          {/* Section 2: Data Minimization & Consent */}
          <div className="space-y-4 pt-8">
            <h3 className="font-serif text-2xl text-ink flex items-center gap-3">
              <span className="font-mono text-xs text-gold border border-gold/30 px-2 py-0.5 rounded bg-gold/10">02</span>
              Data Minimization &amp; Consent Framework
            </h3>
            <p>
              We operate under a strict <strong>Data Minimization Invariant</strong>: we never harvest excess, speculative, or biometric user data.
            </p>
            <p>
              Consent is collected explicitly before or at the time of data collection. Marketing opt-ins and newsletters are unbundled from essential operational terms, allowing users to participate in courses or assessments without being compelled to receive promotional communications.
            </p>
          </div>

          {/* Section 3: Technical Safeguards & Anti-Scraping Defenses */}
          <div className="space-y-4 pt-8">
            <h3 className="font-serif text-2xl text-ink flex items-center gap-3">
              <span className="font-mono text-xs text-gold border border-gold/30 px-2 py-0.5 rounded bg-gold/10">03</span>
              Reasonable Security Arrangements &amp; Bot Defense
            </h3>
            <p>
              Pursuant to BC PIPA Section 34, we maintain reasonable physical, organizational, and technological safeguards to protect personal information against unauthorized access, collection, use, disclosure, or modification:
            </p>
            <div className="grid gap-4 sm:grid-cols-2 pt-2 text-xs">
              <div className="card p-4 border-line bg-charcoal space-y-1">
                <span className="font-mono text-gold font-semibold uppercase">Encryption In Transit &amp; Rest</span>
                <p className="text-muted">All web transmissions enforce HTTPS TLS 1.3 encryption. Cloud databases maintain AES-256 encryption at rest.</p>
              </div>
              <div className="card p-4 border-line bg-charcoal space-y-1">
                <span className="font-mono text-gold font-semibold uppercase">Edge Rate Limiting &amp; Bot Defense</span>
                <p className="text-muted">Edge middleware enforces IP rate limits and blocks unauthorized commercial LLM web scrapers and crawlers.</p>
              </div>
              <div className="card p-4 border-line bg-charcoal space-y-1">
                <span className="font-mono text-gold font-semibold uppercase">Role-Based Access Control (RBAC)</span>
                <p className="text-muted">Administrative vaults require signed session tokens and strict Supabase Row Level Security (RLS) policies.</p>
              </div>
              <div className="card p-4 border-line bg-charcoal space-y-1">
                <span className="font-mono text-gold font-semibold uppercase">Zero Third-Party Trackers</span>
                <p className="text-muted">We do not deploy Facebook Pixels, TikTok trackers, or cross-site tracking advertising beacons.</p>
              </div>
            </div>
          </div>

          {/* Section 4: Data Retention & Deletion */}
          <div className="space-y-4 pt-8">
            <h3 className="font-serif text-2xl text-ink flex items-center gap-3">
              <span className="font-mono text-xs text-gold border border-gold/30 px-2 py-0.5 rounded bg-gold/10">04</span>
              Retention &amp; Destruction Lifecycle
            </h3>
            <p>
              Pursuant to BC PIPA Section 35, personal information is retained only as long as necessary to fulfill the operational purpose for which it was collected or to satisfy statutory accounting requirements.
            </p>
            <p>
              Transient rate limit logs are purged within minutes. When a user requests account deletion, all personal identifiers, member notes, and workbook submissions are permanently erased or anonymized.
            </p>
          </div>

          {/* Section 5: Data Subject Rights */}
          <div className="space-y-4 pt-8">
            <h3 className="font-serif text-2xl text-ink flex items-center gap-3">
              <span className="font-mono text-xs text-gold border border-gold/30 px-2 py-0.5 rounded bg-gold/10">05</span>
              Your Rights Under BC PIPA
            </h3>
            <p>
              As an individual residing in British Columbia or interacting with our platform, you have enforceable legal rights under BC PIPA:
            </p>
            <ul className="space-y-2 list-disc list-inside text-ink/90 pl-2">
              <li><strong>Right of Access (Section 23):</strong> Request a copy of all personal information we hold concerning you.</li>
              <li><strong>Right of Correction (Section 24):</strong> Request that an error or omission in your personal information be corrected.</li>
              <li><strong>Right to Erasure (Section 35):</strong> Request that your personal profile and diagnostic history be destroyed.</li>
            </ul>
          </div>
        </div>

        {/* Interactive Self-Service Compliance Console */}
        <div className="space-y-4 pt-6">
          <div className="space-y-1">
            <span className="eyebrow">Interactive Compliance Tool</span>
            <h3 className="font-serif text-2xl text-ink">BC PIPA Data Rights Self-Service Console</h3>
            <p className="text-xs text-muted">
              Enter the email address associated with your diagnostic assessment, course enrollment, or inquiry to export or delete your stored records.
            </p>
          </div>
          <PrivacyRequestConsole />
        </div>

        {/* Section 6: Privacy Officer Coordinates */}
        <div className="card p-6 sm:p-8 border-gold/40 bg-charcoal space-y-4">
          <div className="space-y-1">
            <span className="font-mono text-xs text-gold uppercase tracking-wider font-semibold">
              Designated Privacy Officer
            </span>
            <h4 className="font-serif text-2xl text-ink font-medium">Jeremy Ashe</h4>
            <p className="text-xs text-muted">
              Principal Architect &middot; The Architecture of Reality
            </p>
          </div>
          <div className="space-y-1 font-mono text-xs text-ink/90 pt-2 border-t border-line">
            <p>Jurisdiction: British Columbia, Canada</p>
            <p>Inquiries: <a href="mailto:jeremy@architectureofreality.com" className="text-gold hover:underline">jeremy@architectureofreality.com</a></p>
            <p>Response Pacing: 30 days pursuant to BC PIPA Section 29 statutory time limits</p>
          </div>
          <div className="pt-2">
            <Link href="/contact" className="btn-ghost text-xs py-2 px-4 border border-line hover:border-gold/50">
              Transmit Direct Inquiry to Privacy Officer &rarr;
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
