import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getChapterBySlug, FALLBACK_VOLUMES, FALLBACK_CHAPTERS } from '@/lib/supabase/queries';
import { Markdown } from '@/components/ui/primitives';
import QuestCompletionSentinel from '@/components/gamification/QuestCompletionSentinel';

interface ChapterPageProps {
  params: Promise<{
    volumeSlug: string;
    chapterSlug: string;
  }>;
}

export async function generateStaticParams() {
  const params: Array<{ volumeSlug: string; chapterSlug: string }> = [];
  for (const vol of FALLBACK_VOLUMES) {
    const chapters = FALLBACK_CHAPTERS.filter((c) => c.volume_id === vol.id);
    for (const chap of chapters) {
      params.push({
        volumeSlug: vol.slug,
        chapterSlug: chap.slug,
      });
      if (vol.slug.startsWith('the-')) {
        params.push({
          volumeSlug: vol.slug.replace(/^the-/, ''),
          chapterSlug: chap.slug,
        });
      }
    }
  }
  return params;
}

const PRINCIPLE_NAMES: Record<number, string> = {
  1: 'Mentalism — The Origin Point & Primary Signal',
  2: 'Correspondence — As Above, So Below (The Mirror)',
  3: 'Vibration — Living Acoustic Resonance',
  4: 'Polarity — The Dynamic Fulcrum',
  5: 'Rhythm — Cycles of Time & Sustainable Cadence',
  6: 'Cause & Effect — The Law of the Seed',
  7: 'Generation — The Receptive Rest Container',
};

export async function generateMetadata({ params }: ChapterPageProps): Promise<Metadata> {
  const { volumeSlug, chapterSlug } = await params;
  const result = await getChapterBySlug(volumeSlug, chapterSlug);

  if (!result) {
    return {
      title: 'Chapter Not Found · The Reading Room',
      description: 'The requested chapter could not be located.',
    };
  }

  const { chapter, volume } = result;
  return {
    title: `${chapter.title} · ${volume.title} · The Architecture of Reality`,
    description: `Read ${chapter.title} from ${volume.title}. 100% free access in The Architecture of Reality Reading Room.`,
  };
}

export default async function ChapterReaderPage({ params }: ChapterPageProps) {
  const { volumeSlug, chapterSlug } = await params;
  const result = await getChapterBySlug(volumeSlug, chapterSlug);

  if (!result) {
    notFound();
  }

  const { chapter, volume, prevChapter, nextChapter, allChapters } = result;
  const canonicalVolumeSlug = volume.slug;
  const pdfDownloadUrl = volume.pdf_url.startsWith('/') ? volume.pdf_url : `/pdfs/${volume.slug}.pdf`;

  return (
    <article className="min-h-screen bg-obsidian text-ink selection:bg-gold/30">
      {/* ── BREADCRUMB & HEADER BAR ───────────────────────────── */}
      <div className="border-b border-line/80 bg-charcoal/80 backdrop-blur-md sticky top-16 z-20">
        <div className="container-x py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <nav className="flex items-center gap-2 font-mono text-muted overflow-x-auto py-1">
            <Link href="/library" className="hover:text-gold transition">
              Reading Room
            </Link>
            <span className="text-faint">/</span>
            <Link href={`/library?volume=${canonicalVolumeSlug}`} className="hover:text-gold transition truncate max-w-[160px] sm:max-w-none">
              {volume.title}
            </Link>
            <span className="text-faint">/</span>
            <span className="text-gold truncate max-w-[180px] sm:max-w-none">
              Chapter {chapter.chapter_number}
            </span>
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href={pdfDownloadUrl}
              download={`${volume.title}.pdf`}
              className="font-mono text-[0.68rem] text-gold/90 hover:text-gold flex items-center gap-1.5 border border-gold/30 hover:border-gold/60 bg-gold/5 px-2.5 py-1 rounded-md transition"
            >
              <span>⬇</span> Download PDF
            </a>
            <Link
              href="/audit"
              className="font-mono text-[0.68rem] text-muted hover:text-gold transition hidden sm:inline"
            >
              Energy Audit ⚡
            </Link>
          </div>
        </div>
      </div>

      {/* ── CHAPTER HERO BANNER ───────────────────────────────── */}
      <header className="border-b border-line bg-gradient-to-b from-charcoal via-charcoal/60 to-obsidian py-14 sm:py-20">
        <div className="container-x max-w-3xl space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="eyebrow">{volume.volume_label}</span>
            <span className="size-1 rounded-full bg-gold/60" />
            <span className="font-mono text-xs text-muted">
              Chapter {chapter.chapter_number} of {allChapters.length}
            </span>
            <span className="size-1 rounded-full bg-gold/60" />
            <span className="font-mono text-xs text-gold/90 bg-gold/10 px-2 py-0.5 rounded border border-gold/20">
              {chapter.estimated_read_mins} min read
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl text-ink font-medium leading-[1.15]">
            {chapter.title}
          </h1>

          {chapter.principle_number && PRINCIPLE_NAMES[chapter.principle_number] && (
            <div className="pt-2 flex items-center gap-2">
              <span className="font-mono text-[0.65rem] uppercase tracking-wider text-black bg-gold font-bold px-2 py-0.5 rounded">
                Law of Reality
              </span>
              <p className="font-mono text-xs text-gold/80 italic">
                Principle {chapter.principle_number}: {PRINCIPLE_NAMES[chapter.principle_number]}
              </p>
            </div>
          )}
        </div>
      </header>

      {/* ── EDITORIAL READING CONTAINER ──────────────────────── */}
      <main className="container-x max-w-3xl py-12 sm:py-16">
        <div className="prose-reality">
          <Markdown>{chapter.content_md || chapter.content_markdown || ''}</Markdown>
        </div>

        {/* Automatic Quest Verification: 15s Timer & Scroll Sentinel */}
        <QuestCompletionSentinel
          questId={`chap_${canonicalVolumeSlug}_${chapter.slug}`}
          pointsReward={25}
          questTitle={`Read: ${chapter.title}`}
          referenceSlug={`chapter_${chapter.slug}`}
        />

        {/* ── CHAPTER PAGINATION ────────────────────────────────── */}
        <nav className="mt-16 pt-8 border-t border-line grid grid-cols-1 sm:grid-cols-2 gap-4">
          {prevChapter ? (
            <Link
              href={`/library/${canonicalVolumeSlug}/${prevChapter.slug}`}
              className="card p-5 border-line hover:border-gold/50 transition group flex flex-col justify-between"
            >
              <span className="font-mono text-[0.65rem] text-muted uppercase tracking-wider group-hover:text-gold transition">
                ← Previous Chapter
              </span>
              <p className="font-serif text-lg text-ink group-hover:text-gold transition mt-1 truncate">
                {prevChapter.title}
              </p>
            </Link>
          ) : (
            <div className="card p-5 border-line/40 opacity-50">
              <span className="font-mono text-[0.65rem] text-faint uppercase tracking-wider">
                Beginning of Volume
              </span>
              <p className="font-serif text-lg text-faint mt-1">
                {volume.title}
              </p>
            </div>
          )}

          {nextChapter ? (
            <Link
              href={`/library/${canonicalVolumeSlug}/${nextChapter.slug}`}
              className="card p-5 border-line hover:border-gold/50 transition group text-right flex flex-col justify-between sm:items-end"
            >
              <span className="font-mono text-[0.65rem] text-muted uppercase tracking-wider group-hover:text-gold transition">
                Next Chapter →
              </span>
              <p className="font-serif text-lg text-ink group-hover:text-gold transition mt-1 truncate">
                {nextChapter.title}
              </p>
            </Link>
          ) : (
            <Link
              href="/library"
              className="card p-5 border-gold/40 bg-gold/5 text-right flex flex-col justify-between sm:items-end hover:bg-gold/10 transition"
            >
              <span className="font-mono text-[0.65rem] text-gold uppercase tracking-wider">
                Volume Concluded ✓
              </span>
              <p className="font-serif text-lg text-gold font-medium mt-1">
                Return to Reading Room →
              </p>
            </Link>
          )}
        </nav>

        {/* ── ACTION DEEPENING BANNER ──────────────────────────── */}
        <div className="mt-12 card p-8 border-gold/40 bg-gradient-to-br from-charcoal via-charcoal to-[#181a10] space-y-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-gold uppercase tracking-widest font-semibold">
              Practical System Calibration
            </span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl text-ink font-medium">
            Test Your Operational Alignment Against Universal Law
          </h3>
          <p className="text-sm text-muted leading-relaxed">
            Reading theory without empirical measurement leads to cognitive drift. Take the 12-Question Energy Audit to discover where your Mind, Body, or Soul is leaking energy.
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link href="/audit" className="btn-gold py-2.5 px-6 text-xs font-semibold">
              Take the 12-Question Audit ⚡
            </Link>
            <Link href="/library" className="btn-ghost py-2.5 px-5 text-xs text-muted hover:text-ink">
              Browse All Volumes
            </Link>
          </div>
        </div>
      </main>
    </article>
  );
}
