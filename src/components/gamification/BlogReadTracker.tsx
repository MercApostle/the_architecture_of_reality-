"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useMember } from "@/context/MemberContext";

interface Props {
  slug: string;
  title: string;
}

export default function BlogReadTracker({ slug, title }: Props) {
  const { user, isAuthenticated, awardPoints } = useMember();

  useEffect(() => {
    if (isAuthenticated && user) {
      const taskId = `read_blog_${slug}`;
      awardPoints(taskId, 25, `Read: ${title}`);
    }
  }, [isAuthenticated, user, slug, title, awardPoints]);

  if (!isAuthenticated) {
    return (
      <div className="my-8 p-4 rounded-xl border border-line bg-charcoal/60 flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2.5">
          <span className="text-gold text-base">⭐</span>
          <span className="text-muted">
            Earn <strong className="text-gold">+25 Points</strong> toward your Sovereign rank by reading this dispatch.
          </span>
        </div>
        <Link href="/login" className="btn-gold text-[0.7rem] py-1.5 px-3 shrink-0">
          Sign In to Claim →
        </Link>
      </div>
    );
  }

  return (
    <div className="my-8 p-4 rounded-xl border border-emerald/40 bg-emerald/10 flex items-center justify-between gap-4 text-xs text-emerald animate-fade-up">
      <div className="flex items-center gap-2.5">
        <span className="size-5 rounded-full bg-emerald text-obsidian flex items-center justify-center font-bold text-[0.65rem]">
          ✓
        </span>
        <span className="font-mono">
          Task Complete: <strong className="text-ink">+25 Points</strong> credited to your account ({user?.points} pts total)
        </span>
      </div>
      <Link href="/members" className="text-gold hover:underline font-mono text-[0.7rem] shrink-0">
        View Quest Log →
      </Link>
    </div>
  );
}
