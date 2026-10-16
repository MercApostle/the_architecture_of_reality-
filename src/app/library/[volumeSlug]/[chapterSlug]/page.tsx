import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getChapterBySlug, FALLBACK_VOLUMES, FALLBACK_CHAPTERS } from '@/lib/supabase/queries';
import ChapterReaderView from '@/components/library/ChapterReaderView';

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
  const principleName = chapter.principle_number ? PRINCIPLE_NAMES[chapter.principle_number] : undefined;

  return (
    <ChapterReaderView
      chapter={chapter}
      volume={volume}
      prevChapter={prevChapter}
      nextChapter={nextChapter}
      allChapters={allChapters}
      canonicalVolumeSlug={canonicalVolumeSlug}
      pdfDownloadUrl={pdfDownloadUrl}
      principleName={principleName}
    />
  );
}
