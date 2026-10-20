'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import type { CourseWithCurriculum } from '@/lib/queries/academy.queries';

interface SovereignAccessGateProps {
  course: CourseWithCurriculum;
  lessonTitle: string;
}

export default function SovereignAccessGate({
  course,
  lessonTitle,
}: SovereignAccessGateProps) {
  const { addItem, openCart } = useCart();

  const handleUnlockCourse = () => {
    addItem({
      id: course.slug,
      title: course.title,
      subtitle: course.subtitle || 'Sovereign Academy Curriculum',
      price: Math.round(course.price_cents / 100),
      category: 'course',
      badge: 'Full Curriculum Access',
    });
    openCart();
  };

  const handleUnlockAllAccess = () => {
    addItem({
      id: 'members-access',
      title: 'Sovereign Membership (All-Access Pass)',
      subtitle: '3 × 30-Min Calls with Jeremy Ashe + All Courses',
      price: 50,
      category: 'course',
      badge: 'VIP All-Access',
    });
    openCart();
  };

  return (
    <div className="card p-8 sm:p-10 border border-gold/40 bg-gradient-to-b from-[#141720] via-charcoal to-[#0d0f14] space-y-8 relative overflow-hidden shadow-[0_0_50px_-15px_rgba(212,175,55,0.25)] animate-fade-up">
      <div className="pointer-events-none absolute -top-24 -right-24 size-72 rounded-full bg-gold/15 blur-3xl" />

      {/* Header */}
      <div className="space-y-3 relative">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-gold animate-pulse" />
          <span className="font-mono text-xs uppercase tracking-widest text-gold font-bold">
            Proprietary Lesson Locked · Entitlement Required
          </span>
        </div>
        <h3 className="font-serif text-3xl sm:text-4xl text-ink font-medium">
          Unlock Full Curriculum: <span className="text-gradient-gold italic">{lessonTitle}</span>
        </h3>
        <p className="text-xs sm:text-sm text-muted max-w-2xl leading-relaxed">
          This lesson contains proprietary operational frameworks, video masterclasses, audio instruction, and downloadable field blueprints from <strong className="text-ink">{course.title}</strong>. Choose an access tier to continue:
        </p>
      </div>

      {/* Pricing Tier Options */}
      <div className="grid gap-4 sm:grid-cols-2 relative">
        {/* Option 1: Single Course */}
        <div className="p-6 rounded-2xl border border-line bg-charcoal/80 space-y-4 hover:border-gold/40 transition">
          <div className="space-y-1">
            <span className="font-mono text-[0.68rem] text-muted uppercase tracking-wider block">
              Individual Course Access
            </span>
            <h4 className="font-serif text-xl text-ink">{course.title}</h4>
            <div className="pt-2">
              <span className="font-serif text-3xl font-bold text-gold">
                ${Math.round(course.price_cents / 100)}
              </span>
              <span className="font-mono text-xs text-muted ml-1">CAD · Lifetime Access</span>
            </div>
          </div>
          <ul className="space-y-1.5 text-xs text-muted">
            <li className="flex items-center gap-2"><span className="text-gold">✓</span> All modules &amp; video lectures in this course</li>
            <li className="flex items-center gap-2"><span className="text-gold">✓</span> Interactive in-browser workbooks &amp; saved responses</li>
            <li className="flex items-center gap-2"><span className="text-gold">✓</span> Downloadable PDF blueprints &amp; scheduling templates</li>
          </ul>
          <button
            type="button"
            onClick={handleUnlockCourse}
            className="btn-gold w-full py-2.5 text-xs font-semibold cursor-pointer shadow-md"
          >
            Unlock This Course (${Math.round(course.price_cents / 100)}) →
          </button>
        </div>

        {/* Option 2: Sovereign All-Access Pass ($50 CAD) */}
        <div className="p-6 rounded-2xl border border-gold/60 bg-gradient-to-b from-charcoal-raised to-[#181a10] space-y-4 relative shadow-lg">
          <div className="absolute top-3 right-3">
            <span className="px-2 py-0.5 rounded font-mono text-[0.62rem] bg-gold text-black font-bold uppercase tracking-wider">
              Most Popular
            </span>
          </div>
          <div className="space-y-1">
            <span className="font-mono text-[0.68rem] text-gold uppercase tracking-wider block font-semibold">
              All-Access Sovereign Pass
            </span>
            <h4 className="font-serif text-xl text-ink">All 3 Trilogy Courses &amp; Video Calls</h4>
            <div className="pt-2">
              <span className="font-serif text-3xl font-bold text-gold">$50</span>
              <span className="font-mono text-xs text-muted ml-1">CAD · Full Vault Pass</span>
            </div>
          </div>
          <ul className="space-y-1.5 text-xs text-ink/90">
            <li className="flex items-center gap-2"><span className="text-gold font-bold">✓</span> <strong>Three (3) 30-min Video Calls</strong> with Jeremy Ashe</li>
            <li className="flex items-center gap-2"><span className="text-gold font-bold">✓</span> Unabridged PDF downloads of all 3 Trilogy Books</li>
            <li className="flex items-center gap-2"><span className="text-gold font-bold">✓</span> Full 8-Module Video &amp; Audio Curriculum</li>
          </ul>
          <button
            type="button"
            onClick={handleUnlockAllAccess}
            className="btn-gold w-full py-2.5 text-xs font-semibold cursor-pointer shadow-md"
          >
            ⚡ Unlock All-Access Membership ($50 CAD) →
          </button>
        </div>
      </div>

      {/* Member Sign In Link & Notice */}
      <div className="pt-4 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted">
        <p>
          Already enrolled in this course or a Sovereign Member?{' '}
          <Link href="/members" className="text-gold hover:underline font-semibold">
            Sign In to Your Member Vault &rarr;
          </Link>
        </p>
        <Link href="/offers" className="font-mono text-[0.68rem] text-faint hover:text-gold">
          View All Curriculum Offers &amp; Bundles &rarr;
        </Link>
      </div>
    </div>
  );
}
