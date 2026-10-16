'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { saveWorkbookSubmission } from '@/lib/actions/academy.actions';
import type { WorkbookField } from '@/lib/queries/academy.queries';

interface Props {
  lessonId: string;
  lessonTitle: string;
  courseSlug: string;
  schema: WorkbookField[];
  nextLesson?: { courseSlug: string; lessonSlug: string; title: string } | null;
}

export default function InteractiveWorkbook({
  lessonId,
  lessonTitle,
  courseSlug,
  schema,
  nextLesson,
}: Props) {
  const storageKey = `ar_wb_${lessonId}`;
  const [responses, setResponses] = useState<Record<string, string | number>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        setResponses(parsed.responses || {});
        setIsCompleted(parsed.isCompleted || false);
      }
    } catch (e) {
      console.warn('Could not read cached workbook responses', e);
    }
  }, [storageKey]);

  const handleChange = (fieldId: string, value: string | number) => {
    const updated = { ...responses, [fieldId]: value };
    setResponses(updated);
    setSaveStatus('idle');

    // Auto-cache to local storage
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          responses: updated,
          isCompleted,
          updatedAt: new Date().toISOString(),
        })
      );
    } catch {}
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus('saving');

    try {
      const res = await saveWorkbookSubmission({
        lessonId,
        courseSlug,
        responses,
        isCompleted: true,
      });

      if (res.success) {
        setIsCompleted(true);
        setSaveStatus('saved');
        try {
          localStorage.setItem(
            storageKey,
            JSON.stringify({
              responses,
              isCompleted: true,
              updatedAt: new Date().toISOString(),
            })
          );
        } catch {}
      } else {
        setSaveStatus('error');
      }
    } catch {
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  if (!schema || schema.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 rounded-2xl border border-gold/30 bg-[#121318]/90 p-6 md:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[0.65rem] uppercase tracking-widest text-gold bg-gold/10 px-2.5 py-0.5 rounded border border-gold/20">
              Interactive In-Browser Workbook
            </span>
            {isCompleted && (
              <span className="font-mono text-[0.65rem] uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                <span>✓</span> Completed &amp; Vaulted
              </span>
            )}
          </div>
          <h3 className="font-serif text-2xl text-ink mt-2">
            Operational Calibration: {lessonTitle}
          </h3>
          <p className="text-sm text-muted mt-1">
            Responses are saved directly to your private Sovereign Vault. All changes are cached in real time.
          </p>
        </div>

        {saveStatus === 'saved' && (
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full shrink-0 flex items-center gap-1.5 animate-pulse">
            <span className="size-1.5 rounded-full bg-emerald-400" />
            Saved to Sovereign Vault
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {schema.map((field) => (
          <div key={field.id} className="space-y-2">
            <label
              htmlFor={field.id}
              className="block text-sm font-medium text-ink"
            >
              {field.label}
            </label>

            {field.helperText && (
              <p className="text-xs text-muted italic">{field.helperText}</p>
            )}

            {field.type === 'textarea' && (
              <textarea
                id={field.id}
                rows={4}
                value={responses[field.id] || ''}
                onChange={(e) => handleChange(field.id, e.target.value)}
                placeholder={field.placeholder}
                className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-ink placeholder:text-faint focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition font-sans"
              />
            )}

            {field.type === 'select' && (
              <select
                id={field.id}
                value={responses[field.id] || ''}
                onChange={(e) => handleChange(field.id, e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-ink focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition font-sans"
              >
                <option value="" disabled>
                  Select an assessment…
                </option>
                {field.options?.map((opt) => (
                  <option key={opt} value={opt} className="bg-[#121318] text-ink">
                    {opt}
                  </option>
                ))}
              </select>
            )}

            {field.type === 'number' && (
              <input
                id={field.id}
                type="number"
                value={responses[field.id] || ''}
                onChange={(e) => handleChange(field.id, e.target.value)}
                placeholder={field.placeholder}
                className="w-full max-w-xs rounded-xl border border-white/15 bg-black/40 px-4 py-2.5 text-sm text-ink placeholder:text-faint focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition font-sans"
              />
            )}

            {field.type === 'text' && (
              <input
                id={field.id}
                type="text"
                value={responses[field.id] || ''}
                onChange={(e) => handleChange(field.id, e.target.value)}
                placeholder={field.placeholder}
                className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-2.5 text-sm text-ink placeholder:text-faint focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition font-sans"
              />
            )}
          </div>
        ))}

        <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gold px-6 py-3 font-mono text-xs uppercase tracking-widest text-[#0A0A0C] font-semibold hover:bg-[#E5C158] transition shadow-[0_0_20px_rgba(212,175,55,0.2)] disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <span className="size-3.5 border-2 border-[#0A0A0C] border-t-transparent rounded-full animate-spin" />
                Commiting to Vault…
              </>
            ) : isCompleted ? (
              'Update Calibration & Vault Responses'
            ) : (
              'Commit Calibration & Complete Lesson'
            )}
          </button>

          {nextLesson && (
            <Link
              href={`/academy/${nextLesson.courseSlug}/${nextLesson.lessonSlug}`}
              className="w-full sm:w-auto text-center font-mono text-xs text-muted hover:text-gold transition flex items-center justify-center gap-1.5"
            >
              <span>Next Lesson: {nextLesson.title}</span>
              <span>→</span>
            </Link>
          )}
        </div>
      </form>
    </div>
  );
}
