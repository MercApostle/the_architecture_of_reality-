'use client';

import Link from 'next/link';
import LessonAudioPlayer from './LessonAudioPlayer';
import InteractiveWorkbook from './InteractiveWorkbook';
import type { LessonWithDetails, CourseWithCurriculum } from '@/lib/queries/academy.queries';

interface Props {
  course: CourseWithCurriculum;
  moduleTitle: string;
  lesson: LessonWithDetails;
  prevLesson?: { courseSlug: string; lessonSlug: string; title: string } | null;
  nextLesson?: { courseSlug: string; lessonSlug: string; title: string } | null;
}

export default function LessonContentArea({
  course,
  moduleTitle,
  lesson,
  prevLesson,
  nextLesson,
}: Props) {
  return (
    <article className="space-y-10">
      {/* Lesson Header */}
      <header className="space-y-4 border-b border-white/10 pb-8">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[0.65rem] uppercase tracking-widest text-gold bg-gold/10 px-2.5 py-1 rounded border border-gold/20">
            {moduleTitle}
          </span>
          {lesson.is_free_preview && (
            <span className="font-mono text-[0.65rem] uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
              Free Open Preview
            </span>
          )}
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-ink tracking-tight">
          {lesson.title}
        </h1>

        <div className="flex items-center gap-4 text-xs font-mono text-muted">
          <span>Curriculum: {course.title}</span>
          <span>•</span>
          <span>Lesson {lesson.sort_order}</span>
        </div>
      </header>

      {/* Video Embed Player */}
      {lesson.video_embed_url && (
        <section className="space-y-3">
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-gold/30 bg-black/60 shadow-2xl">
            <iframe
              src={lesson.video_embed_url}
              title={lesson.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 size-full"
            />
          </div>
          <p className="text-[0.68rem] font-mono text-faint text-center">
            Transmission Source: Encrypted Sovereign Stream · High-Definition
          </p>
        </section>
      )}

      {/* Audio Lecture Player */}
      {lesson.audio_url && (
        <section>
          <LessonAudioPlayer audioUrl={lesson.audio_url} title={lesson.title} />
        </section>
      )}

      {/* Editorial Lecture Markdown Text */}
      <section className="prose-reality max-w-none text-[#F4F4F6] space-y-6 text-base sm:text-lg leading-relaxed border-t border-white/10 pt-8">
        {lesson.content_md.split('\n\n').map((paragraph, idx) => {
          if (paragraph.startsWith('### ')) {
            return (
              <h3 key={idx} className="font-serif text-2xl text-ink mt-8 mb-4">
                {paragraph.replace('### ', '')}
              </h3>
            );
          }
          if (paragraph.startsWith('#### ')) {
            return (
              <h4 key={idx} className="font-serif text-xl text-gold mt-6 mb-3">
                {paragraph.replace('#### ', '')}
              </h4>
            );
          }
          if (paragraph.startsWith('> ')) {
            return (
              <blockquote
                key={idx}
                className="border-l-2 border-gold pl-4 py-2 italic text-[#D4AF37] bg-gold/5 rounded-r-lg my-6"
              >
                {paragraph.replace('> ', '')}
              </blockquote>
            );
          }
          if (paragraph.startsWith('```')) {
            const cleanCode = paragraph.replace(/```[a-z]*\n?/gi, '');
            return (
              <pre
                key={idx}
                className="bg-black/60 border border-white/10 rounded-xl p-4 font-mono text-xs text-muted overflow-x-auto my-6"
              >
                <code>{cleanCode}</code>
              </pre>
            );
          }
          if (paragraph.startsWith('1. ') || paragraph.startsWith('- ')) {
            const lines = paragraph.split('\n');
            return (
              <ul key={idx} className="space-y-2 list-disc list-inside my-4 text-muted">
                {lines.map((l, lIdx) => (
                  <li key={lIdx} className="leading-relaxed">
                    <span className="text-ink">{l.replace(/^[-*]|\d+\.\s*/, '')}</span>
                  </li>
                ))}
              </ul>
            );
          }
          return (
            <p key={idx} className="text-[#94A3B8] leading-relaxed">
              {paragraph}
            </p>
          );
        })}
      </section>

      {/* Downloadable Blueprints & Field Manuals */}
      {lesson.download_attachments && lesson.download_attachments.length > 0 && (
        <section className="rounded-2xl border border-white/10 bg-[#121318]/90 p-6 backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-gold">📎</span>
            <h3 className="font-serif text-lg text-ink font-medium">
              Curriculum Blueprints &amp; Field Attachments
            </h3>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {lesson.download_attachments.map((file, fIdx) => (
              <a
                key={fIdx}
                href={file.file_url}
                download
                className="group flex items-center justify-between p-3.5 rounded-xl border border-white/10 bg-white/5 hover:border-gold/40 hover:bg-gold/5 transition"
              >
                <div>
                  <span className="block text-sm font-medium text-ink group-hover:text-gold transition">
                    {file.title}
                  </span>
                  <span className="font-mono text-[0.65rem] text-muted">
                    {file.type} {file.size ? `· ${file.size}` : ''}
                  </span>
                </div>
                <span className="text-muted group-hover:text-gold transition text-xs font-mono">
                  Download ↓
                </span>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Interactive In-Browser Workbook */}
      <InteractiveWorkbook
        lessonId={lesson.id}
        lessonTitle={lesson.title}
        courseSlug={course.slug}
        schema={lesson.workbook_schema}
        nextLesson={nextLesson}
      />

      {/* Lesson Pagination Footer */}
      <footer className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        {prevLesson ? (
          <Link
            href={`/academy/${prevLesson.courseSlug}/${prevLesson.lessonSlug}`}
            className="w-full sm:w-auto p-4 rounded-xl border border-white/10 bg-white/5 hover:border-gold/30 hover:bg-white/10 transition group text-left"
          >
            <span className="font-mono text-[0.62rem] uppercase tracking-wider text-muted block group-hover:text-gold transition">
              ← Previous Lesson
            </span>
            <span className="font-serif text-sm text-ink group-hover:text-gold transition line-clamp-1">
              {prevLesson.title}
            </span>
          </Link>
        ) : (
          <div />
        )}

        {nextLesson ? (
          <Link
            href={`/academy/${nextLesson.courseSlug}/${nextLesson.lessonSlug}`}
            className="w-full sm:w-auto p-4 rounded-xl border border-gold/40 bg-gold/5 hover:bg-gold/10 transition group text-right sm:text-right"
          >
            <span className="font-mono text-[0.62rem] uppercase tracking-wider text-gold block">
              Next Lesson →
            </span>
            <span className="font-serif text-sm text-ink group-hover:text-gold transition line-clamp-1">
              {nextLesson.title}
            </span>
          </Link>
        ) : (
          <Link
            href="/academy"
            className="w-full sm:w-auto p-4 rounded-xl border border-gold bg-gold text-[#0A0A0C] font-mono text-xs uppercase tracking-widest font-semibold text-center hover:bg-[#E5C158] transition"
          >
            Complete Course Syllabus ✦
          </Link>
        )}
      </footer>
    </article>
  );
}
