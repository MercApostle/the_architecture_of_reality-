"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import type { DispatchArticle } from "@/lib/types";

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

interface Props {
  articles: DispatchArticle[];
}

export default function NewsCatalog({ articles }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = useMemo(() => {
    const set = new Set<string>();
    articles.forEach((a) => {
      if (a.category) set.add(a.category);
    });
    return ["All", ...Array.from(set)];
  }, [articles]);

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesCategory =
        selectedCategory === "All" || article.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        article.title.toLowerCase().includes(q) ||
        article.summary.toLowerCase().includes(q) ||
        (article.transliteration && article.transliteration.toLowerCase().includes(q)) ||
        (article.category && article.category.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [articles, selectedCategory, searchQuery]);

  return (
    <div className="space-y-10">
      {/* Search & Category Filter Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-line pb-6">
        {/* Categories */}
        <div className="flex flex-wrap items-center gap-1.5">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-3.5 py-1 text-xs font-mono tracking-wider transition cursor-pointer ${
                  isSelected
                    ? "bg-gold text-obsidian font-bold shadow-[0_0_12px_rgba(212,175,55,0.4)]"
                    : "border border-line bg-charcoal/60 text-muted hover:border-gold/50 hover:text-ink"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search news & essays…"
            className="w-full rounded-xl border border-line bg-obsidian px-4 py-2 text-xs text-ink placeholder:text-faint focus:border-gold focus:outline-none transition"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted hover:text-gold"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Articles Grid */}
      {filteredArticles.length === 0 ? (
        <div className="card p-12 text-center space-y-3">
          <p className="font-serif text-2xl text-ink">No articles found</p>
          <p className="text-sm text-muted">
            Try adjusting your search query or switching categories.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("All");
              setSearchQuery("");
            }}
            className="btn-ghost text-xs"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          {filteredArticles.map((article) => (
            <article
              key={article.slug}
              className="card card-hover group flex flex-col justify-between p-8 relative overflow-hidden transition-all duration-300 hover:border-gold/60"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-gold tracking-widest uppercase text-[0.7rem] font-semibold">
                    {article.category}
                  </span>
                  <span className="text-faint font-mono text-[0.7rem]">{article.readTime}</span>
                </div>

                {article.hebrew && (
                  <div className="flex items-baseline gap-3 pt-1">
                    <span className="font-serif text-3xl text-gold/90 font-normal">{article.hebrew}</span>
                    <span className="font-mono text-xs text-muted tracking-wider">
                      ({article.transliteration})
                    </span>
                  </div>
                )}

                <h2 className="font-serif text-2xl sm:text-3xl text-ink group-hover:text-gold transition-colors leading-snug">
                  <Link href={`/news/${article.slug}`} className="focus:outline-none">
                    {article.title}
                  </Link>
                </h2>

                <p className="text-sm leading-relaxed text-muted line-clamp-3">
                  {article.summary}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-line flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-6 rounded-full bg-gold/15 border border-gold/40 text-gold text-[0.6rem] font-bold flex items-center justify-center font-mono">
                    JA
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[0.72rem] text-ink font-medium">Jeremy Ashe</span>
                    <span className="font-mono text-[0.65rem] text-faint">
                      {formatDate(article.publishedAt)}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/news/${article.slug}`}
                  className="inline-flex items-center gap-1.5 font-mono text-xs text-gold uppercase tracking-wider group-hover:translate-x-1 transition-transform font-semibold"
                >
                  Read Article <span>→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
