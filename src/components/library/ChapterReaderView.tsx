'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Markdown } from '@/components/ui/primitives';
import QuestCompletionSentinel from '@/components/gamification/QuestCompletionSentinel';
import type { Chapter, Volume } from '@/lib/supabase/types';

interface ChapterReaderViewProps {
  chapter: Chapter;
  volume: Volume;
  prevChapter: Chapter | null;
  nextChapter: Chapter | null;
  allChapters: Chapter[];
  canonicalVolumeSlug: string;
  pdfDownloadUrl: string;
  principleName?: string;
}

export default function ChapterReaderView({
  chapter,
  volume,
  prevChapter,
  nextChapter,
  allChapters,
  canonicalVolumeSlug,
  pdfDownloadUrl,
  principleName,
}: ChapterReaderViewProps) {
  // Reading comfort controls
  const [fontSize, setFontSize] = useState<'standard' | 'editorial' | 'immersive'>('editorial');
  const [fontFamily, setFontFamily] = useState<'serif' | 'sans'>('serif');
  const [isWide, setIsWide] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Track window scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const currentProgress = (window.scrollY / totalScroll) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'standard':
        return 'text-base sm:text-lg leading-relaxed';
      case 'immersive':
        return 'text-xl sm:text-2xl leading-[1.75]';
      case 'editorial':
      default:
        return 'text-lg sm:text-xl leading-relaxed';
    }
  };

  return (
    <article className="min-h-screen bg-obsidian text-ink selection:bg-gold/30 relative">
      {/* ── STICKY READING PROGRESS BAR ───────────────────────── */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-transparent pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-gold-deep via-gold to-emerald transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* ── BREADCRUMB & HEADER BAR ───────────────────────────── */}
      <div className="border-b border-line/80 bg-charcoal/80 backdrop-blur-md sticky top-16 z-20">
        <div className="container-x py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <nav className="flex items-center gap-2 font-mono text-muted overflow-x-auto py-1">
            <Link href="/library" className="hover:text-gold transition">
              Reading Room
            </Link>
            <span className="text-faint">/</span>
            <Link
              href={`/library?volume=${canonicalVolumeSlug}`}
              className="hover:text-gold transition truncate max-w-[150px] sm:max-w-none"
            >
              {volume.title}
            </Link>
            <span className="text-faint">/</span>
            <span className="text-gold truncate max-w-[170px] sm:max-w-none">
              Chapter {chapter.chapter_number}
            </span>
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            {/* Chapter Drawer Toggle */}
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="btn-ghost py-1 px-2.5 text-[0.68rem] font-mono text-muted hover:text-gold border border-line hover:border-gold/40 flex items-center gap-1.5 cursor-pointer"
            >
              <span>📑</span> Chapters ({chapter.chapter_number}/{allChapters.length})
            </button>

            {/* Direct PDF Download */}
            <a
              href={pdfDownloadUrl}
              download={`${volume.title}.pdf`}
              className="font-mono text-[0.68rem] text-gold/90 hover:text-gold flex items-center gap-1.5 border border-gold/30 hover:border-gold/60 bg-gold/5 px-2.5 py-1 rounded-md transition"
            >
              <span>⬇</span> PDF
            </a>
          </div>
        </div>
      </div>

      {/* ── CHAPTER HERO BANNER ───────────────────────────────── */}
      <header className="border-b border-line bg-gradient-to-b from-charcoal via-charcoal/60 to-obsidian py-12 sm:py-16">
        <div className={`container-x transition-all duration-300 space-y-4 ${isWide ? 'max-w-4xl' : 'max-w-3xl'}`}>
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="eyebrow">{volume.volume_label}</span>
            <span className="size-1 rounded-full bg-gold/60" />
            <span className="font-mono text-xs text-muted">
              Chapter {chapter.chapter_number} of {allChapters.length}
            </span>
            <span className="size-1 rounded-full bg-gold/60" />
            <span className="font-mono text-xs text-gold/90 bg-gold/10 px-2 py-0.5 rounded border border-gold/20">
              {chapter.estimated_read_mins || 10} min read
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl text-ink font-medium leading-[1.15]">
            {chapter.title}
          </h1>

          {principleName && (
            <div className="pt-2 flex items-center gap-2">
              <span className="font-mono text-[0.65rem] uppercase tracking-wider text-black bg-gold font-bold px-2 py-0.5 rounded">
                Law of Reality
              </span>
              <p className="font-mono text-xs text-gold/80 italic">
                Principle {chapter.principle_number}: {principleName}
              </p>
            </div>
          )}

          {/* ── READING COMFORT TOOLBAR ───────────────────────── */}
          <div className="pt-4 border-t border-line/50 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[0.65rem] text-faint uppercase">Typography:</span>
              <div className="inline-flex rounded-lg border border-line p-0.5 bg-obsidian">
                <button
                  type="button"
                  onClick={() => setFontFamily('serif')}
                  className={`px-2 py-0.5 rounded text-[0.68rem] font-serif transition cursor-pointer ${
                    fontFamily === 'serif' ? 'bg-gold/20 text-gold font-semibold' : 'text-muted hover:text-ink'
                  }`}
                >
                  Editorial Serif
                </button>
                <button
                  type="button"
                  onClick={() => setFontFamily('sans')}
                  className={`px-2 py-0.5 rounded text-[0.68rem] font-sans transition cursor-pointer ${
                    fontFamily === 'sans' ? 'bg-gold/20 text-gold font-semibold' : 'text-muted hover:text-ink'
                  }`}
                >
                  Clean Sans
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[0.65rem] text-faint uppercase">Size:</span>
                <div className="inline-flex rounded-lg border border-line p-0.5 bg-obsidian">
                  {(['standard', 'editorial', 'immersive'] as const).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setFontSize(s)}
                      className={`px-2 py-0.5 rounded text-[0.65rem] font-mono capitalize transition cursor-pointer ${
                        fontSize === s ? 'bg-gold/20 text-gold font-bold' : 'text-muted hover:text-ink'
                      }`}
                    >
                      {s === 'standard' ? 'A' : s === 'editorial' ? 'A+' : 'A++'}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsWide(!isWide)}
                className={`py-1 px-2 rounded border text-[0.68rem] font-mono transition cursor-pointer ${
                  isWide ? 'border-gold text-gold bg-gold/10 font-semibold' : 'border-line text-muted hover:text-ink'
                }`}
                title="Toggle Reading Aperture Width"
              >
                {isWide ? 'Narrow Focus' : 'Wide Canvas'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── EDITORIAL READING CONTAINER ──────────────────────── */}
      <main className={`container-x py-12 sm:py-16 transition-all duration-300 ${isWide ? 'max-w-4xl' : 'max-w-3xl'}`}>
        <div className={`prose-reality ${fontFamily === 'serif' ? 'font-serif' : 'font-sans'} ${getFontSizeClass()}`}>
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
              className="card p-5 border-line hover:border-gold/50 transition group space-y-1 block"
            >
              <span className="font-mono text-[0.65rem] text-faint uppercase group-hover:text-gold transition">
                ← Previous Chapter
              </span>
              <p className="font-serif text-lg text-ink font-medium group-hover:text-gold transition line-clamp-1">
                {prevChapter.chapter_number}. {prevChapter.title}
              </p>
            </Link>
          ) : (
            <div className="card p-5 border-dashed border-line/40 opacity-40">
              <span className="font-mono text-[0.65rem] text-faint uppercase">Volume Beginning</span>
              <p className="font-serif text-base text-faint">First chapter of this volume</p>
            </div>
          )}

          {nextChapter ? (
            <Link
              href={`/library/${canonicalVolumeSlug}/${nextChapter.slug}`}
              className="card p-5 border-line hover:border-gold/50 transition group space-y-1 text-right block"
            >
              <span className="font-mono text-[0.65rem] text-faint uppercase group-hover:text-gold transition">
                Next Chapter →
              </span>
              <p className="font-serif text-lg text-ink font-medium group-hover:text-gold transition line-clamp-1">
                {nextChapter.chapter_number}. {nextChapter.title}
              </p>
            </Link>
          ) : (
            <Link
              href="/library"
              className="card p-5 border-gold/40 bg-gold/5 hover:border-gold transition text-right group space-y-1 block"
            >
              <span className="font-mono text-[0.65rem] text-gold uppercase">Volume Completed ✓</span>
              <p className="font-serif text-base text-ink group-hover:text-gold transition">
                Return to Reading Room →
              </p>
            </Link>
          )}
        </nav>
      </main>

      {/* ── CHAPTER INDEX SLIDE-OVER DRAWER ─────────────────────── */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#0d0f14] border-l border-gold/40 h-full p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-2xl animate-fade-up overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-line pb-4">
                <div>
                  <span className="eyebrow">{volume.volume_label}</span>
                  <h3 className="font-serif text-2xl text-ink font-medium">{volume.title}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  className="size-8 rounded-full border border-line flex items-center justify-center text-muted hover:text-ink hover:border-gold cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-2">
                <span className="font-mono text-[0.65rem] text-gold uppercase tracking-wider block font-semibold">
                  Volume Table of Contents ({allChapters.length} Chapters):
                </span>
                <div className="space-y-1.5">
                  {allChapters.map((chap) => {
                    const isCurrent = chap.slug === chapter.slug;

                    return (
                      <Link
                        key={chap.slug}
                        href={`/library/${canonicalVolumeSlug}/${chap.slug}`}
                        onClick={() => setDrawerOpen(false)}
                        className={`p-3.5 rounded-xl border transition flex items-center justify-between gap-3 ${
                          isCurrent
                            ? 'border-gold bg-gold/15 text-gold font-medium ring-1 ring-gold/40'
                            : 'border-line/70 bg-charcoal/60 text-muted hover:text-ink hover:border-gold/40'
                        }`}
                      >
                        <div className="space-y-0.5">
                          <span className="font-mono text-[0.62rem] text-faint block uppercase">
                            Chapter {chap.chapter_number}
                          </span>
                          <p className="font-serif text-sm line-clamp-1">{chap.title}</p>
                        </div>

                        <span className="font-mono text-xs text-faint shrink-0">
                          {isCurrent ? 'Reading ●' : `${chap.estimated_read_mins || 10}m`}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-line space-y-2">
              <a
                href={pdfDownloadUrl}
                download={`${volume.title}.pdf`}
                className="btn-gold w-full text-center py-2.5 text-xs font-semibold block cursor-pointer"
              >
                Download Full {volume.title} PDF
              </a>
              <button
                type="button"
                onClick={() => setDrawerOpen(false)}
                className="btn-ghost w-full py-2 text-xs text-muted hover:text-ink cursor-pointer"
              >
                Close Table of Contents
              </button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
