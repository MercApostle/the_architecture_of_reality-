'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useMember } from '@/context/MemberContext';

interface QuestCompletionSentinelProps {
  questId: string;
  pointsReward?: number;
  questTitle?: string;
  referenceSlug?: string;
  className?: string;
}

export default function QuestCompletionSentinel({
  questId,
  pointsReward = 25,
  questTitle = 'Dispatch Assimilated',
  referenceSlug,
  className = '',
}: QuestCompletionSentinelProps) {
  const { user, awardQuestPoints } = useMember();
  const sentinelRef = useRef<HTMLDivElement>(null);

  const taskId = `quest_${questId}`;
  const isAlreadyDone = Boolean(
    user?.completedTasks.includes(taskId) ||
    (referenceSlug && user?.completedTasks.includes(`read_blog_${referenceSlug}`))
  );

  const [isCompleted, setIsCompleted] = useState<boolean>(isAlreadyDone);
  const [secondsOnPage, setSecondsOnPage] = useState<number>(0);
  const [inView, setInView] = useState<boolean>(false);
  const hasTriggeredRef = useRef<boolean>(false);

  // Sync completion from user state
  useEffect(() => {
    if (isAlreadyDone) {
      setIsCompleted(true);
    }
  }, [isAlreadyDone]);

  // 15-second time-on-page guard timer
  useEffect(() => {
    if (isCompleted) return;

    const interval = setInterval(() => {
      setSecondsOnPage((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isCompleted]);

  // IntersectionObserver for scroll-to-bottom detection (threshold 0.8)
  useEffect(() => {
    if (isCompleted || !sentinelRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && entry.intersectionRatio >= 0.8) {
          setInView(true);
        } else {
          setInView(false);
        }
      },
      {
        threshold: 0.8,
      }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [isCompleted]);

  // Trigger quest completion once in view AND 15 seconds have passed
  useEffect(() => {
    if (isCompleted || hasTriggeredRef.current) return;

    if (inView && secondsOnPage >= 15) {
      hasTriggeredRef.current = true;
      setIsCompleted(true);

      awardQuestPoints(questId, pointsReward, questTitle, referenceSlug).catch((err) => {
        console.warn('[Quest Sentinel Error]', err);
      });
    }
  }, [inView, secondsOnPage, isCompleted, questId, pointsReward, questTitle, referenceSlug, awardQuestPoints]);

  return (
    <div
      ref={sentinelRef}
      className={`mt-12 pt-6 border-t border-line/60 flex items-center justify-between gap-4 text-xs ${className}`}
      aria-label="Quest Assimilation Status"
    >
      <div className="flex items-center gap-2.5">
        {isCompleted ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-950/30 px-3 py-1 font-mono text-emerald-400 font-semibold tracking-wider">
            <span className="size-1.5 rounded-full bg-emerald-400" />
            Dispatch Assimilated &middot; +{pointsReward} Pts
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/5 px-3 py-1 font-mono text-gold/90 tracking-wider">
            <span className="size-1.5 rounded-full bg-gold animate-pulse" />
            {secondsOnPage < 15 ? (
              <span>Absorbing Transmission ({15 - secondsOnPage}s remaining)</span>
            ) : (
              <span>Scroll Verified &middot; Ready for Assimilation</span>
            )}
          </span>
        )}
      </div>

      <span className="font-mono text-[0.68rem] text-muted tracking-widest uppercase">
        {isCompleted ? 'Verified' : 'Verification Active'}
      </span>
    </div>
  );
}
