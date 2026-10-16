import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllDispatches, getDispatch, formatDate } from "@/lib/dispatches";
import { getOffer } from "@/lib/data/offers";
import { Markdown } from "@/components/ui/primitives";
import QuestCompletionSentinel from "@/components/gamification/QuestCompletionSentinel";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const dispatches = getAllDispatches();
  return dispatches.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const dispatch = getDispatch(slug);
  if (!dispatch) return {};

  return {
    title: `${dispatch.title} — News & Blog`,
    description: dispatch.summary,
  };
}

export default async function NewsDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const dispatch = getDispatch(slug);

  if (!dispatch) {
    notFound();
  }

  const relatedOffer = dispatch.relatedOfferId ? getOffer(dispatch.relatedOfferId) : null;

  // Split content around <!-- audit-cta --> marker if present to embed a rich callout inline
  const parts = dispatch.content.split("<!-- audit-cta -->");
  const hasInlineCta = parts.length > 1;

  return (
    <article className="min-h-screen py-16 sm:py-24">
      <div className="container-x max-w-3xl">
        {/* Back Link */}
        <div className="mb-10">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 font-mono text-xs text-muted hover:text-gold transition"
          >
            ← Back to News &amp; Blog
          </Link>
        </div>

        {/* Article Header */}
        <header className="space-y-6 pb-12 border-b border-line">
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
            <span className="eyebrow">{dispatch.category}</span>
            <div className="flex items-center gap-3 font-mono text-faint">
              <span>{formatDate(dispatch.publishedAt)}</span>
              <span>•</span>
              <span>{dispatch.readTime} read</span>
            </div>
          </div>

          {dispatch.hebrew && (
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-lg border border-gold/30 bg-gold/5">
              <span className="font-serif text-3xl text-gold">{dispatch.hebrew}</span>
              <span className="font-mono text-xs text-muted tracking-wider">
                Root: <strong className="text-ink">{dispatch.transliteration}</strong>
              </span>
            </div>
          )}

          <h1 className="font-serif text-4xl sm:text-5xl leading-[1.08] font-medium text-ink">
            {dispatch.title}
          </h1>

          <div className="flex items-center gap-3 pt-2">
            <div className="size-8 rounded-full bg-gold/15 border border-gold/40 text-gold text-xs font-bold flex items-center justify-center font-mono">
              JA
            </div>
            <div>
              <p className="text-xs text-ink font-medium">Jeremy Ashe</p>
              <p className="text-[0.68rem] text-muted font-mono">Author · The Architecture of Reality</p>
            </div>
          </div>

          <p className="text-lg leading-relaxed text-muted border-l-2 border-gold/40 pl-4 py-1">
            {dispatch.summary}
          </p>
        </header>

        {/* Article Body */}
        <div className="py-12">
          {hasInlineCta ? (
            <>
              <Markdown>{parts[0]}</Markdown>

              {/* Contextual Inline Audit Callout */}
              <aside className="my-12 p-8 card border-gold/40 bg-gradient-to-br from-charcoal via-charcoal to-[#1a1608]">
                <div className="space-y-3">
                  <span className="eyebrow">⚡ Field Diagnostic</span>
                  <h3 className="font-serif text-2xl text-ink">
                    Are you trapped in a high-stress narrow place?
                  </h3>
                  <p className="text-sm text-muted">
                    Take the 12-question Energy &amp; Time Alignment Audit to diagnose whether your bottleneck is cognitive overthinking, biological depletion, or relational friction.
                  </p>
                  <div className="pt-2">
                    <Link href="/audit" className="btn-gold text-xs py-2.5 px-6">
                      Take the Energy Audit →
                    </Link>
                  </div>
                </div>
              </aside>

              <Markdown>{parts[1]}</Markdown>
            </>
          ) : (
            <Markdown>{dispatch.content}</Markdown>
          )}

          {/* Automatic Quest Verification: 15s Timer & Scroll Sentinel */}
          <QuestCompletionSentinel
            questId={`dispatch_${slug}`}
            pointsReward={25}
            questTitle={`Assimilate: ${dispatch.title}`}
            referenceSlug={slug}
          />
        </div>

        {/* Contextual Offer Link Block */}
        {relatedOffer && (
          <aside className="mt-12 p-8 card border-line-strong bg-charcoal-raised relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="eyebrow">Connected System &amp; Protocol</span>
              {relatedOffer.badge && (
                <span className="font-mono text-[0.65rem] uppercase tracking-widest text-gold bg-gold/10 px-2 py-0.5 rounded border border-gold/30">
                  {relatedOffer.badge}
                </span>
              )}
            </div>
            <h3 className="mt-3 font-serif text-2xl text-ink">{relatedOffer.title}</h3>
            <p className="mt-2 text-sm text-muted leading-relaxed">{relatedOffer.description}</p>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-line">
              <span className="font-serif text-xl text-gold">
                {relatedOffer.price !== null ? `$${relatedOffer.price}` : "By Application"}
              </span>
              <Link href={`/offers#tier-${relatedOffer.tier}`} className="btn-gold text-xs py-2 px-5">
                Explore Protocol &amp; Modules →
              </Link>
            </div>
          </aside>
        )}

        {/* Bottom Navigation */}
        <div className="mt-16 pt-8 border-t border-line flex items-center justify-between">
          <Link href="/news" className="btn-ghost text-xs py-2 px-4">
            ← All News &amp; Articles
          </Link>
          <Link href="/audit" className="btn-gold text-xs py-2 px-5">
            Take Energy Audit ⚡
          </Link>
        </div>
      </div>
    </article>
  );
}
