'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useMember } from '@/context/MemberContext';
import type { CourseWithCurriculum } from '@/lib/queries/academy.queries';

interface Props {
  courses: CourseWithCurriculum[];
}

export default function AcademyCatalog({ courses }: Props) {
  const { addItem, openCart } = useCart();
  const { user } = useMember();

  // Local Dev Bypass Mode for $0 zero-friction testing
  const [devBypassActive, setDevBypassActive] = useState(true);
  const [expandedSyllabus, setExpandedSyllabus] = useState<string | null>(null);
  const [completedWorkbooksCount, setCompletedWorkbooksCount] = useState(0);

  // Check saved workbooks in localStorage
  useEffect(() => {
    try {
      let count = 0;
      for (const course of courses) {
        for (const mod of course.modules) {
          for (const les of mod.lessons) {
            const raw = localStorage.getItem(`ar_wb_${les.id}`);
            if (raw) {
              const parsed = JSON.parse(raw);
              if (parsed.isCompleted) count++;
            }
          }
        }
      }
      setCompletedWorkbooksCount(count);
    } catch {}
  }, [courses]);

  const toggleSyllabus = (courseId: string) => {
    setExpandedSyllabus((prev) => (prev === courseId ? null : courseId));
  };

  const handleEnroll = (course: CourseWithCurriculum) => {
    addItem({
      id: course.slug,
      title: course.title,
      subtitle: course.subtitle || course.description || undefined,
      tier: 2,
      price: Math.round(course.price_cents / 100),
      category: 'course',
      badge: 'Flagship Curriculum',
      deliverables: [
        `${course.totalLessons} multi-modal lessons (video + audio lecture)`,
        'Interactive in-browser workbooks saved to personal Sovereign Vault',
        'Downloadable field manuals and high-leverage PDF templates',
        'Lifetime access & permanent curriculum updates',
      ],
    });
    openCart();
  };

  const totalLessonsAcrossAll = courses.reduce((acc, c) => acc + c.totalLessons, 0);

  return (
    <div className="space-y-16">
      {/* Dev Bypass & Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl border border-white/10 bg-[#121318]/90 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-mono text-xs text-[#F4F4F6]">
            Sovereign Operator Vault: <strong className="text-gold">{completedWorkbooksCount}</strong> of {totalLessonsAcrossAll} Workbooks Completed
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-[0.68rem] text-muted uppercase tracking-wider">
            Zero-Cost Dev Bypass:
          </span>
          <button
            onClick={() => setDevBypassActive(!devBypassActive)}
            className={`font-mono text-xs px-3 py-1 rounded-full border transition ${
              devBypassActive
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 font-semibold'
                : 'bg-white/5 text-muted border-white/10 hover:border-white/30'
            }`}
          >
            {devBypassActive ? 'Active (All Access Unlocked)' : 'Disabled (Visitor Mode)'}
          </button>
        </div>
      </div>

      {/* Courses Catalog Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {courses.map((course) => {
          const isEnrolled = devBypassActive || user?.tier === 'paid';
          const firstLesson = course.modules[0]?.lessons[0];
          const isSyllabusOpen = expandedSyllabus === course.id;

          return (
            <div
              key={course.id}
              className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#121318]/90 p-6 md:p-8 backdrop-blur-md hover:border-gold/40 transition duration-300 relative group overflow-hidden shadow-xl"
            >
              <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-transparent via-gold/40 to-transparent group-hover:via-gold transition duration-500" />

              <div className="space-y-6">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[0.65rem] uppercase tracking-widest text-gold bg-gold/10 px-2.5 py-1 rounded border border-gold/20">
                    {course.book_alignment.toUpperCase().replace('_', ' ')}
                  </span>
                  <span className="font-mono text-xs text-muted">
                    {course.totalLessons} Lessons · {course.totalDurationMins}m
                  </span>
                </div>

                <div>
                  <h3 className="font-serif text-2xl text-ink font-normal group-hover:text-gold transition">
                    {course.title}
                  </h3>
                  <p className="font-mono text-xs text-gold/80 mt-1">
                    {course.subtitle}
                  </p>
                  <p className="text-sm text-muted mt-3 line-clamp-3 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                {/* Modules Preview Pills */}
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <span className="font-mono text-[0.65rem] uppercase tracking-wider text-muted block">
                    Curriculum Pillars:
                  </span>
                  <div className="space-y-1.5">
                    {course.modules.map((m) => (
                      <div
                        key={m.id}
                        className="text-xs text-ink/80 flex items-center gap-2 bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5"
                      >
                        <span className="size-1 rounded-full bg-gold" />
                        <span className="truncate">{m.title}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Collapsible Full Syllabus */}
                <div>
                  <button
                    onClick={() => toggleSyllabus(course.id)}
                    className="font-mono text-xs text-muted hover:text-gold transition flex items-center gap-1.5"
                  >
                    <span>{isSyllabusOpen ? 'Hide Syllabus' : 'Inspect Full Syllabus'}</span>
                    <span>{isSyllabusOpen ? '▲' : '▼'}</span>
                  </button>

                  {isSyllabusOpen && (
                    <div className="mt-4 space-y-4 rounded-xl border border-white/10 bg-black/40 p-4 animate-in fade-in">
                      {course.modules.map((mod) => (
                        <div key={mod.id} className="space-y-2">
                          <span className="font-mono text-[0.62rem] text-gold uppercase tracking-wider block">
                            {mod.title}
                          </span>
                          <div className="space-y-1.5 pl-2">
                            {mod.lessons.map((les) => (
                              <Link
                                key={les.id}
                                href={`/academy/${course.slug}/${les.slug}`}
                                className="flex items-center justify-between text-xs text-muted hover:text-gold transition py-1 group/les"
                              >
                                <span className="truncate group-hover/les:translate-x-1 transition-transform">
                                  {les.title}
                                </span>
                                {les.is_free_preview && (
                                  <span className="font-mono text-[0.58rem] uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded shrink-0 ml-2">
                                    Free Preview
                                  </span>
                                )}
                              </Link>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-8 border-t border-white/10 mt-6 space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-mono text-muted">Investment</span>
                  <span className="font-serif text-2xl text-ink">
                    ${Math.round(course.price_cents / 100)}{' '}
                    <span className="text-xs font-mono text-muted">CAD</span>
                  </span>
                </div>

                {isEnrolled ? (
                  <Link
                    href={`/academy/${course.slug}/${firstLesson?.slug || ''}`}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gold px-5 py-3 font-mono text-xs uppercase tracking-widest text-[#0A0A0C] font-semibold hover:bg-[#E5C158] transition shadow-[0_0_20px_rgba(212,175,55,0.2)]"
                  >
                    Enter Classroom ↗
                  </Link>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    {firstLesson && (
                      <Link
                        href={`/academy/${course.slug}/${firstLesson.slug}`}
                        className="inline-flex items-center justify-center rounded-xl border border-white/20 bg-white/5 px-3 py-2.5 font-mono text-xs text-ink hover:border-gold/40 hover:bg-gold/5 transition text-center"
                      >
                        Free Preview
                      </Link>
                    )}
                    <button
                      onClick={() => handleEnroll(course)}
                      className="inline-flex items-center justify-center rounded-xl bg-gold px-3 py-2.5 font-mono text-xs uppercase tracking-wider text-[#0A0A0C] font-semibold hover:bg-[#E5C158] transition text-center"
                    >
                      Enroll Now
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Trilogy Bundle Highlight Card */}
      <div className="rounded-2xl border border-gold/40 bg-gradient-to-r from-[#121318] via-[#1a1c24] to-[#121318] p-8 md:p-12 backdrop-blur-md relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <span className="font-mono text-[0.68rem] uppercase tracking-widest text-gold bg-gold/10 px-3 py-1 rounded border border-gold/30">
              The Sovereign Trinity Pass
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-ink">
              Full Trilogy Academy Curriculum &amp; Sovereign Vault
            </h2>
            <p className="text-sm text-muted max-w-2xl leading-relaxed">
              Unlock all 3 Flagship Curricula (Books I, II, &amp; III), all 18 interactive in-browser workbooks, unabridged PDF editions of the entire trilogy, and private strategy calibrations with Jeremy Ashe.
            </p>
          </div>

          <div className="lg:col-span-4 flex flex-col items-start lg:items-end gap-4">
            <div className="text-left lg:text-right">
              <span className="font-mono text-xs text-muted block line-through">$591 CAD Standalone</span>
              <span className="font-serif text-4xl text-gold">$347 <span className="text-sm font-mono text-muted">CAD</span></span>
            </div>

            <button
              onClick={() => {
                addItem({
                  id: 'trilogy-mastery-bundle',
                  title: 'The Sovereign Trinity Pass (Books I, II, & III)',
                  subtitle: 'Full 18-lesson curriculum + Sovereign Vault access',
                  tier: 2,
                  price: 347,
                  category: 'course',
                  badge: 'Full Academy Pass',
                  deliverables: [
                    'All 3 Flagship Courses (Master Blueprint, Genesis Lens, Covenant Systems)',
                    '18 Interactive In-Browser Workbooks with permanent cloud persistence',
                    'Full unabridged PDF downloads of all 3 Trilogy Books',
                    'Direct asynchronous access to Jeremy Ashe for curriculum calibration',
                  ],
                });
                openCart();
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gold px-8 py-3.5 font-mono text-xs uppercase tracking-widest text-[#0A0A0C] font-semibold hover:bg-[#E5C158] transition shadow-[0_0_25px_rgba(212,175,55,0.3)]"
            >
              Unlock All 3 Courses ✦
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
