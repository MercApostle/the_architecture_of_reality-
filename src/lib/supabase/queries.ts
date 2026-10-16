import { createClient as createServerSupabase } from './server';
import { BOOKS } from '@/lib/data/books';
import type { Volume, Chapter } from './types';

function normalizeSlug(slug: string): string {
  return slug.trim().toLowerCase();
}

/** Fallback volumes generated from src/lib/data/books.ts */
export const FALLBACK_VOLUMES: Volume[] = BOOKS.map((b, index) => {
  const canonicalSlug = b.id.startsWith('the-') ? b.id : `the-${b.id}`;
  const label = b.volumeLabel ?? (b.number === 0 ? 'FOUNDATION VOLUME' : `BOOK ${['I', 'II', 'III'][b.number - 1] ?? b.number}`);
  return {
    id: `vol-${b.id}`,
    slug: canonicalSlug,
    tab_label: label,
    volume_label: label,
    title: b.title,
    subtitle: b.subtitle,
    synopsis: b.overview,
    description: b.overview,
    blockquote: null,
    cover_image_url: null,
    pdf_url: b.previewUrl ?? `/pdfs/${b.id}.pdf`,
    file_size_label: '2.4 MB',
    sort_order: index,
    is_published: true,
  };
});

/** Fallback chapters generated from src/lib/data/books.ts */
export const FALLBACK_CHAPTERS: Chapter[] = BOOKS.flatMap((b) => {
  return b.sections.map((sec, secIndex) => {
    // Map section index to principle 1..7
    const principleNum = ((secIndex * 2 + 1) % 7) || 7;
    return {
      id: `chap-${b.id}-${sec.id}`,
      volume_id: `vol-${b.id}`,
      chapter_number: secIndex + 1,
      roman_numeral: `Chapter ${secIndex + 1}`,
      slug: sec.id,
      title: sec.title,
      content_markdown: sec.body,
      content_md: sec.body,
      principle_number: principleNum,
      estimated_read_mins: Math.max(5, Math.ceil(sec.body.split(/\s+/).length / 180)),
      sort_order: secIndex + 1,
    };
  });
});

/** Fetch all volumes in sort order */
export async function getVolumes(): Promise<Volume[]> {
  try {
    const supabase = await createServerSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from('volumes')
        .select('*')
        .order('sort_order', { ascending: true });

      if (!error && data && data.length > 0) {
        return data as Volume[];
      }
    }
  } catch (err) {
    console.warn('[Supabase Fallback] Error fetching volumes from Supabase, using local fallback:', err);
  }

  return FALLBACK_VOLUMES;
}

/** Fetch a single volume by slug (handles slug variations like with/without 'the-') */
export async function getVolumeBySlug(slug: string): Promise<Volume | null> {
  const clean = normalizeSlug(slug);
  const altClean = clean.startsWith('the-') ? clean.replace(/^the-/, '') : `the-${clean}`;

  try {
    const supabase = await createServerSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from('volumes')
        .select('*')
        .or(`slug.eq.${clean},slug.eq.${altClean}`)
        .maybeSingle();

      if (!error && data) {
        return data as Volume;
      }
    }
  } catch (err) {
    console.warn('[Supabase Fallback] Error fetching volume by slug, using local fallback:', err);
  }

  const found = FALLBACK_VOLUMES.find(
    (v) => normalizeSlug(v.slug) === clean || normalizeSlug(v.slug) === altClean || normalizeSlug(v.slug.replace(/^the-/, '')) === clean.replace(/^the-/, '')
  );

  return found ?? null;
}

/** Fetch all chapters for a given volume ID or Volume slug */
export async function getChapters(volumeIdOrSlug: string): Promise<Chapter[]> {
  try {
    const supabase = await createServerSupabase();
    if (supabase) {
      // First try matching by volume_id directly
      const { data: byId, error: errById } = await supabase
        .from('chapters')
        .select('*')
        .eq('volume_id', volumeIdOrSlug)
        .order('chapter_number', { ascending: true });

      if (!errById && byId && byId.length > 0) {
        return byId as Chapter[];
      }

      // If not UUID or not found, find volume by slug first
      const volume = await getVolumeBySlug(volumeIdOrSlug);
      if (volume) {
        const { data: byVol, error: errByVol } = await supabase
          .from('chapters')
          .select('*')
          .eq('volume_id', volume.id)
          .order('chapter_number', { ascending: true });

        if (!errByVol && byVol && byVol.length > 0) {
          return byVol as Chapter[];
        }
      }
    }
  } catch (err) {
    console.warn('[Supabase Fallback] Error fetching chapters, using local fallback:', err);
  }

  // Fallback: check direct volume_id match first
  const matchedById = FALLBACK_CHAPTERS.filter((c) => c.volume_id === volumeIdOrSlug);
  if (matchedById.length > 0) {
    return matchedById.sort((a, b) => a.chapter_number - b.chapter_number);
  }

  // Otherwise resolve volume by slug
  const volume = await getVolumeBySlug(volumeIdOrSlug);
  if (!volume) return [];

  const matchedChapters = FALLBACK_CHAPTERS.filter(
    (c) => c.volume_id === volume.id
  ).sort((a, b) => a.chapter_number - b.chapter_number);

  return matchedChapters;
}

/** Fetch chapter with volume and sibling chapters (for pagination) */
export async function getChapterBySlug(
  volumeSlug: string,
  chapterSlug: string
): Promise<{
  chapter: Chapter;
  volume: Volume;
  prevChapter: Chapter | null;
  nextChapter: Chapter | null;
  allChapters: Chapter[];
} | null> {
  const volume = await getVolumeBySlug(volumeSlug);
  if (!volume) return null;

  const chapters = await getChapters(volume.id);
  const cleanChapSlug = normalizeSlug(chapterSlug);

  const currentIndex = chapters.findIndex(
    (c) => normalizeSlug(c.slug) === cleanChapSlug
  );

  if (currentIndex === -1) return null;

  const chapter = chapters[currentIndex];
  const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;

  return {
    chapter,
    volume,
    prevChapter,
    nextChapter,
    allChapters: chapters,
  };
}
