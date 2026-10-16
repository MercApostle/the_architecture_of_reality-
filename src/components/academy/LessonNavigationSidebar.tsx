'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { CourseWithCurriculum } from '@/lib/queries/academy.queries';

interface Props {
  course: CourseWithCurriculum;
  currentLessonSlug: string;
}

export default function LessonNavigationSidebar({ course, currentLessonSlug }: Props) {
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [isOpenMobile, setIsOpenMobile] = useState(false);

  // Read completed workbooks from localStorage
  useEffect(() => {
    try {
      const completed: string[] = [];
      for (const mod of course.modules) {
        for (const les of mod.lessons) {
          const item = localStorage.getItem(`ar_wb_${les.id}`);
          if (item) {
            const parsed = JSON.parse(item);
            if (parsed.isCompleted) {
              completed.push(les.id);
            }
          }
        }
      }
      setCompletedLessonIds(completed);
    } catch {}
  }, [course]);

  const totalLessons = course.totalLessons;
  const completedCount = completedLessonIds.length;
  const progressPercent = Math.min(100, Math.round((completedCount / totalLessons) * 100));

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden mb-6 flex items-center justify-between p-4 rounded-xl border border-white/10 bg-[#121318]/90">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-gold uppercase tracking-wider">
            Syllabus: {completedCount}/{totalLessons} Complete
          </span>
        </div>
        <button
          onClick={() => setIsOpenMobile(!isOpenMobile)}
          className="text-xs font-mono text-ink bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg hover:border-gold/40 transition"
        >
          {isOpenMobile ? 'Hide Index ✕' : 'View Course Index ☰'}
        </button>
      </div>

      {/* Navigation Card */}
      <aside
        className={`${
          isOpenMobile ? 'block' : 'hidden lg:block'
        } rounded-2xl border border-white/10 bg-[#121318]/90 p-5 backdrop-blur-md sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto space-y-6 shadow-xl`}
      >
        <div>
          <Link
            href="/academy"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-muted hover:text-gold transition mb-3"
          >
            <span>←</span>
            <span>Back to Academy</span>
          </Link>
          <span className="font-mono text-[0.6rem] uppercase tracking-widest text-gold bg-gold/10 px-2 py-0.5 rounded border border-gold/20 block w-fit mb-1.5">
            {course.book_alignment.toUpperCase().replace('_', ' ')}
          </span>
          <h2 className="font-serif text-lg font-medium text-ink leading-snug">
            {course.title}
          </h2>
        </div>

        {/* Course Progress */}
        <div className="space-y-1.5 pt-4 border-t border-white/10">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-muted">Mastery Progress</span>
            <span className="text-gold">{progressPercent}%</span>
          </div>
          <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gold h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Modules & Lessons */}
        <div className="space-y-5 pt-4 border-t border-white/10">
          {course.modules.map((mod) => (
            <div key={mod.id} className="space-y-2">
              <h3 className="font-mono text-[0.68rem] tracking-wider uppercase text-muted font-medium">
                {mod.title}
              </h3>

              <div className="space-y-1 pl-1">
                {mod.lessons.map((les) => {
                  const isActive = les.slug === currentLessonSlug;
                  const isDone = completedLessonIds.includes(les.id);

                  return (
                    <Link
                      key={les.id}
                      href={`/academy/${course.slug}/${les.slug}`}
                      className={`group flex items-start gap-2.5 p-2 rounded-lg text-xs transition duration-200 ${
                        isActive
                          ? 'bg-gold/15 text-gold border border-gold/40 shadow-[0_0_15px_rgba(212,175,55,0.15)]'
                          : 'text-muted hover:text-ink hover:bg-white/5 border border-transparent'
                      }`}
                    >
                      <span className="mt-0.5 shrink-0">
                        {isDone ? (
                          <span className="text-emerald-400 font-bold">✓</span>
                        ) : isActive ? (
                          <span className="text-gold font-bold">▶</span>
                        ) : (
                          <span className="size-1.5 rounded-full bg-white/30 block mt-1.5" />
                        )}
                      </span>

                      <div className="flex-1 min-w-0">
                        <span className="block truncate font-medium">
                          {les.title}
                        </span>
                        {les.is_free_preview && (
                          <span className="inline-block font-mono text-[0.58rem] uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-1.5 rounded mt-0.5">
                            Free Preview
                          </span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}
