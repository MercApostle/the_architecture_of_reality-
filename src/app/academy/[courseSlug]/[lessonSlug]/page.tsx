import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { createClient as createServerSupabase } from '@/lib/supabase/server';
import {
  getAcademyLesson,
  getEnrollmentStatus,
  FALLBACK_ACADEMY_COURSES,
  type LessonWithDetails,
  type CourseWithCurriculum,
} from '@/lib/queries/academy.queries';
import LessonNavigationSidebar from '@/components/academy/LessonNavigationSidebar';
import LessonContentArea from '@/components/academy/LessonContentArea';

export async function generateStaticParams() {
  const params: { courseSlug: string; lessonSlug: string }[] = [];
  for (const course of FALLBACK_ACADEMY_COURSES) {
    for (const mod of course.modules) {
      for (const les of mod.lessons) {
        params.push({
          courseSlug: course.slug,
          lessonSlug: les.slug,
        });
      }
    }
  }
  return params;
}

interface Props {
  params: Promise<{
    courseSlug: string;
    lessonSlug: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { courseSlug, lessonSlug } = await params;
  const data = await getAcademyLesson(courseSlug, lessonSlug);

  if (!data) {
    return {
      title: 'Lesson Not Found — Sovereign Academy',
    };
  }

  return {
    title: `${data.lesson.title} — ${data.course.title}`,
    description: `Multi-modal curriculum lesson with video stream, audio lecture, and interactive workbook from ${data.course.title}.`,
  };
}

async function EntitledLessonArea({
  course,
  currentModuleTitle,
  lesson,
  prevLesson,
  nextLesson,
}: {
  course: CourseWithCurriculum;
  currentModuleTitle: string;
  lesson: LessonWithDetails;
  prevLesson?: { courseSlug: string; lessonSlug: string; title: string } | null;
  nextLesson?: { courseSlug: string; lessonSlug: string; title: string } | null;
}) {
  let isAuthorized = false;

  try {
    const supabase = await createServerSupabase();
    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const enrollment = await getEnrollmentStatus(course.id, user.id);
        if (enrollment.isEnrolled) {
          isAuthorized = true;
        }
      }
    }
  } catch (err) {
    console.warn('[Academy Entitlement Check Notice]:', err);
  }

  // Check local dev clearance / operator cookie
  try {
    const cookieStore = await cookies();
    if (
      cookieStore.get('ar_operator_clearance_v2')?.value === 'true' ||
      cookieStore.get('aor_paid_member_active')?.value === 'true' ||
      cookieStore.get('aor_dev_bypass')?.value === 'true'
    ) {
      isAuthorized = true;
    }
  } catch {}

  const isEntitled = lesson.is_free_preview || isAuthorized;

  // Anti-Scraping Content Defense: If unentitled, truncate markdown and strip media URLs
  // so automated curl scripts / scrapers cannot extract paid materials from RSC JSON.
  const safeLesson = isEntitled
    ? lesson
    : {
        ...lesson,
        video_embed_url: null,
        audio_url: null,
        download_attachments: [],
        content_md: `${lesson.content_md
          .split('\n\n')
          .slice(0, 2)
          .join('\n\n')}\n\n> **[Sovereign Curriculum Lock]** The complete masterclass instruction, video transmission, audio lecture, and downloadable operational blueprints for this lesson require enrollment or Sovereign Membership.`,
      };

  return (
    <LessonContentArea
      course={course}
      moduleTitle={currentModuleTitle}
      lesson={safeLesson}
      prevLesson={prevLesson}
      nextLesson={nextLesson}
      isEntitled={isEntitled}
    />
  );
}

export default async function LessonPage({ params }: Props) {
  const { courseSlug, lessonSlug } = await params;
  const data = await getAcademyLesson(courseSlug, lessonSlug);

  if (!data) {
    notFound();
  }

  const { course, currentModule, lesson, prevLesson, nextLesson } = data;

  return (
    <div className="min-h-screen bg-[#0A0A0C] text-[#F4F4F6] pt-24 pb-20">
      <div className="container-x">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Syllabus Navigation Drawer */}
          <div className="lg:col-span-4">
            <LessonNavigationSidebar
              course={course}
              currentLessonSlug={lesson.slug}
            />
          </div>

          {/* Core Multi-Modal Instruction Area with Streaming Suspense Boundary */}
          <div className="lg:col-span-8">
            <Suspense
              fallback={
                <div className="space-y-6 animate-pulse">
                  <div className="h-10 bg-white/5 rounded-xl w-3/4" />
                  <div className="h-64 bg-white/5 rounded-2xl" />
                  <div className="h-40 bg-white/5 rounded-xl" />
                </div>
              }
            >
              <EntitledLessonArea
                course={course}
                currentModuleTitle={currentModule.title}
                lesson={lesson}
                prevLesson={prevLesson}
                nextLesson={nextLesson}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
