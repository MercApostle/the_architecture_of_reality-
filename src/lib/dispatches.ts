import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { DispatchArticle } from "@/lib/types";

/**
 * File-based CMS: each Markdown file in /content/dispatches is an article.
 * Swap this module for a headless CMS / Supabase query later — keep the
 * same function signatures and the pages won't need to change.
 */
const DIR = path.join(process.cwd(), "content", "dispatches");

function parse(file: string): DispatchArticle {
  const raw = fs.readFileSync(path.join(DIR, file), "utf8");
  const { data, content } = matter(raw);
  return {
    slug: file.replace(/\.md$/, ""),
    title: String(data.title),
    summary: String(data.summary ?? ""),
    category: String(data.category ?? "Dispatch"),
    readTime: String(data.readTime ?? ""),
    publishedAt: String(data.publishedAt),
    hebrew: data.hebrew,
    transliteration: data.transliteration,
    relatedOfferId: data.relatedOfferId,
    content,
  };
}

export function getAllDispatches(): DispatchArticle[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map(parse)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getDispatch(slug: string): DispatchArticle | null {
  const file = `${slug}.md`;
  if (!/^[a-z0-9-]+$/.test(slug) || !fs.existsSync(path.join(DIR, file))) return null;
  return parse(file);
}

export const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
