import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAcademyLesson, FALLBACK_ACADEMY_COURSES } from '@/lib/queries/academy.queries';
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

          {/* Core Multi-Modal Instruction Area */}
          <div className="lg:col-span-8">
            <LessonContentArea
              course={course}
              moduleTitle={currentModule.title}
              lesson={lesson}
              prevLesson={prevLesson}
              nextLesson={nextLesson}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
