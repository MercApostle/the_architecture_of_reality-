'use server';

import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { revalidatePath } from 'next/cache';
import { createClient as createServerSupabase } from '@/lib/supabase/server';
import type { DispatchArticle } from '@/lib/types';

const DISPATCHES_DIR = path.join(process.cwd(), 'content', 'dispatches');
const SETTINGS_FILE = path.join(process.cwd(), 'src', 'data', 'site-settings.json');

export interface DispatchInput {
  slug: string;
  title: string;
  summary: string;
  category: string;
  readTime: string;
  publishedAt?: string;
  hebrew?: string;
  transliteration?: string;
  content: string;
  isPublished?: boolean;
}

export interface SiteSettings {
  announcementActive: boolean;
  announcementBadge: string;
  announcementText: string;
  announcementLink: string;
  founderCohortOpen: boolean;
  lastUpdated: string;
}

export async function getAllDispatchesForOperator(): Promise<DispatchArticle[]> {
  if (!fs.existsSync(DISPATCHES_DIR)) return [];
  try {
    const files = fs.readdirSync(DISPATCHES_DIR).filter((f) => f.endsWith('.md'));
    const articles = files.map((file) => {
      const raw = fs.readFileSync(path.join(DISPATCHES_DIR, file), 'utf8');
      const { data, content } = matter(raw);
      return {
        slug: file.replace(/\.md$/, ''),
        title: String(data.title || 'Untitled Dispatch'),
        summary: String(data.summary || ''),
        category: String(data.category || 'Dispatch'),
        readTime: String(data.readTime || '5 min read'),
        publishedAt: String(data.publishedAt || new Date().toISOString().split('T')[0]),
        hebrew: data.hebrew ? String(data.hebrew) : undefined,
        transliteration: data.transliteration ? String(data.transliteration) : undefined,
        relatedOfferId: data.relatedOfferId ? String(data.relatedOfferId) : undefined,
        content,
      };
    });

    return articles.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  } catch (err) {
    console.warn('[Content Action] Error reading dispatches for operator:', err);
    return [];
  }
}

export async function saveDispatchAction(
  input: DispatchInput
): Promise<{ success: boolean; slug?: string; error?: string }> {
  try {
    const cleanSlug = input.slug
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]+/g, '-')
      .replace(/^-|-$/g, '');

    if (!cleanSlug || cleanSlug.length < 2) {
      return { success: false, error: 'A valid URL slug is required.' };
    }

    if (!input.title || input.title.trim().length < 3) {
      return { success: false, error: 'Title must be at least 3 characters.' };
    }

    if (!fs.existsSync(DISPATCHES_DIR)) {
      fs.mkdirSync(DISPATCHES_DIR, { recursive: true });
    }

    const frontmatter: Record<string, unknown> = {
      title: input.title.trim(),
      summary: input.summary.trim(),
      category: input.category.trim() || 'Dispatch',
      readTime: input.readTime.trim() || '5 min read',
      publishedAt: input.publishedAt || new Date().toISOString().split('T')[0],
    };

    if (input.hebrew && input.hebrew.trim()) {
      frontmatter.hebrew = input.hebrew.trim();
    }
    if (input.transliteration && input.transliteration.trim()) {
      frontmatter.transliteration = input.transliteration.trim();
    }

    const fileContent = matter.stringify(input.content || '', frontmatter);
    const targetPath = path.join(DISPATCHES_DIR, `${cleanSlug}.md`);

    fs.writeFileSync(targetPath, fileContent, 'utf-8');

    // Also update Supabase dispatches table if connected
    try {
      const supabase = await createServerSupabase();
      if (supabase) {
        await supabase
          .from('dispatches')
          .upsert({
            slug: cleanSlug,
            title: input.title.trim(),
            excerpt: input.summary.trim(),
            content_markdown: input.content || '',
            is_published: input.isPublished ?? true,
          }, { onConflict: 'slug' });
      }
    } catch (dbErr) {
      console.warn('[Content Action] Supabase dispatch upsert notice:', dbErr);
    }

    revalidatePath('/news');
    revalidatePath(`/news/${cleanSlug}`);
    revalidatePath('/operator');

    return { success: true, slug: cleanSlug };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to save dispatch';
    return { success: false, error: message };
  }
}

export async function deleteDispatchAction(
  slug: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const cleanSlug = slug.trim().toLowerCase();
    const targetPath = path.join(DISPATCHES_DIR, `${cleanSlug}.md`);

    if (fs.existsSync(targetPath)) {
      fs.unlinkSync(targetPath);
    }

    try {
      const supabase = await createServerSupabase();
      if (supabase) {
        await supabase.from('dispatches').delete().eq('slug', cleanSlug);
      }
    } catch {}

    revalidatePath('/news');
    revalidatePath('/operator');

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to delete dispatch';
    return { success: false, error: message };
  }
}

export async function getSiteSettingsAction(): Promise<SiteSettings> {
  try {
    if (fs.existsSync(SETTINGS_FILE)) {
      const raw = fs.readFileSync(SETTINGS_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('[Site Settings] Error reading settings file:', err);
  }

  return {
    announcementActive: true,
    announcementBadge: 'FOUNDER ADVISORY OPEN',
    announcementText: 'Jeremy Ashe is currently accepting three enterprise founders for Q4 80-Hour Work Month system installation.',
    announcementLink: '/meet',
    founderCohortOpen: true,
    lastUpdated: new Date().toISOString(),
  };
}

export async function updateSiteSettingsAction(
  settings: Partial<SiteSettings>
): Promise<{ success: boolean; error?: string }> {
  try {
    const current = await getSiteSettingsAction();
    const updated: SiteSettings = {
      ...current,
      ...settings,
      lastUpdated: new Date().toISOString(),
    };

    const dir = path.dirname(SETTINGS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(updated, null, 2), 'utf-8');

    revalidatePath('/');
    revalidatePath('/operator');

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update site settings';
    return { success: false, error: message };
  }
}
