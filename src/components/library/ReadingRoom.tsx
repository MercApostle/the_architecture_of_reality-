"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BOOKS } from "@/lib/data/books";
import { BookCover, Markdown } from "@/components/ui/primitives";
import { useCart } from "@/context/CartContext";
import { useMember } from "@/context/MemberContext";
import type { Book } from "@/lib/types";

export default function ReadingRoom() {
  const { addItem } = useCart();
  const { awardPoints, isAuthenticated } = useMember();
  const [activeBookId, setActiveBookId] = useState<string>(BOOKS[0].id);

  useEffect(() => {
    if (isAuthenticated) {
      awardPoints("explore_library", 25, "Explored Trilogy Reading Room (+25 Pts)");
    }
  }, [isAuthenticated, awardPoints]);
  const [viewMode, setViewMode] = useState<"text" | "pdf">("text");
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const b of BOOKS) {
      if (b.sections.length > 0) {
        initial[`${b.id}-${b.sections[0].id}`] = true;
      }
    }
    return initial;
  });

  const activeBook = BOOKS.find((b) => b.id === activeBookId) || BOOKS[0];
  const pdfUrl = activeBook.previewUrl ?? `/pdfs/${activeBook.id}.pdf`;
  const pdfFilename = activeBook.filename ?? `${activeBook.title}.pdf`;

  const toggleSection = (bookId: string, sectionId: string) => {
    const key = `${bookId}-${sectionId}`;
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const expandAll = (book: Book) => {
    setOpenSections((prev) => {
      const next = { ...prev };
      for (const s of book.sections) {
        next[`${book.id}-${s.id}`] = true;
      }
      return next;
    });
  };

  const collapseAll = (book: Book) => {
    setOpenSections((prev) => {
      const next = { ...prev };
      for (const s of book.sections) {
        next[`${book.id}-${s.id}`] = false;
      }
      return next;
    });
  };



  return (
    <div className="container-x py-12">
      {/* Book Switcher Tabs — Compact Gold Button Styling */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 mb-8 p-1.5 rounded-2xl border border-line/70 bg-charcoal/40 backdrop-blur-md">
        {BOOKS.map((book) => {
          const isActive = book.id === activeBookId;
          const label = book.volumeLabel ?? `Book ${book.number}`;

          return (
            <button
              key={book.id}
              type="button"
              onClick={() => {
                setActiveBookId(book.id);
                const key = `${book.id}-${book.sections[0]?.id}`;
                setOpenSections((prev) => ({ ...prev, [key]: true }));
              }}
              className={`text-left px-3.5 py-2.5 rounded-xl transition duration-200 cursor-pointer flex items-center justify-between gap-2 border ${
                isActive
                  ? "border-gold bg-gradient-to-r from-gold/25 via-gold/15 to-gold/20 text-ink shadow-[0_4px_18px_-4px_rgba(212,175,55,0.35)] ring-1 ring-gold/40"
                  : "border-transparent bg-transparent text-muted hover:text-ink hover:border-gold/30 hover:bg-charcoal/60"
              }`}
            >
              <div className="space-y-0.5 truncate">
                <div className="flex items-center gap-1.5">
                  <span className={`font-mono text-[0.6rem] uppercase tracking-wider ${isActive ? "text-gold font-semibold" : "text-faint"}`}>
                    {label}
                  </span>
                  {isActive && <span className="font-mono text-[0.55rem] text-gold/80 bg-gold/15 px-1 rounded">Active</span>}
                </div>
                <h3 className="font-serif text-xs sm:text-sm text-ink font-medium leading-snug truncate">
                  {book.title}
                </h3>
              </div>
              {isActive && (
                <span className="size-1.5 rounded-full bg-gold shadow-[0_0_8px_rgba(212,175,55,0.8)] shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Active Book Detail View */}
      <div className="grid gap-12 lg:grid-cols-[300px_1fr] items-start">
        {/* Sticky Book Overview Column */}
        <div className="lg:sticky lg:top-24 space-y-6">
          <div className="max-w-[240px] mx-auto lg:mx-0">
            <BookCover
              number={activeBook.number}
              title={activeBook.title}
              subtitle={activeBook.subtitle}
              volumeLabel={activeBook.volumeLabel}
            />
          </div>

          <div className="card p-6 space-y-4">
            <div>
              <p className="eyebrow">{activeBook.volumeLabel ?? `Book ${activeBook.number}`}</p>
              <h2 className="mt-1 font-serif text-2xl text-ink">{activeBook.title}</h2>
              <p className="font-mono text-xs text-gold mt-0.5">{activeBook.subtitle}</p>
            </div>

            <p className="text-sm leading-relaxed text-muted">{activeBook.overview}</p>

            <blockquote className="border-l-2 border-gold/40 pl-3 py-1 font-serif text-sm italic text-ink/90">
              &ldquo;{activeBook.tagline}&rdquo;
            </blockquote>

            {/* Direct Reading & PDF Actions */}
            <div className="pt-3 border-t border-line space-y-2">
              <button
                type="button"
                onClick={() => setViewMode(viewMode === "pdf" ? "text" : "pdf")}
                className="btn-gold w-full text-xs py-2.5 flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>{viewMode === "pdf" ? "📖" : "👁"}</span>
                {viewMode === "pdf" ? "Switch to Text Chapters" : "Read Original PDF Online"}
              </button>

              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost w-full text-xs py-2.5 flex items-center justify-center gap-2"
              >
                <span>↗</span> Open PDF in Full Window
              </a>

              <a
                href={activeBook.downloadUrl ?? `/api/download/${activeBook.id}.pdf`}
                download={pdfFilename}
                className="btn-ghost w-full text-xs py-2 flex items-center justify-center gap-2 text-muted hover:text-gold"
              >
                <span>⬇</span> Download ({activeBook.fileSize ?? "PDF"})
              </a>

              {activeBook.googleDriveUrl && (
                <a
                  href={activeBook.googleDriveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-ghost w-full text-xs py-2 flex items-center justify-center gap-2 text-muted hover:text-gold"
                >
                  <span>☁</span> View on Google Drive ↗
                </a>
              )}
            </div>

            <div className="pt-2 border-t border-line space-y-2">
              <Link
                href="/audit"
                className="block text-center font-mono text-xs text-gold hover:underline py-1"
              >
                Take the Diagnostic Audit ⚡
              </Link>
            </div>
          </div>

          {/* Complete 4-Volume Collector's Master Bundle Card */}
          <div className="card p-5 border-gold/40 bg-gradient-to-b from-[#161b24] to-charcoal space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[0.62rem] text-gold uppercase tracking-wider font-semibold">
                Collector&apos;s Edition
              </span>
              <span className="font-serif text-lg text-gold font-bold">$49 CAD</span>
            </div>
            <h4 className="font-serif text-base text-ink font-medium leading-tight">
              Complete 4-Volume Master Bundle
            </h4>
            <p className="text-[0.72rem] text-muted leading-relaxed">
              All 4 authentic manuscripts in high-resolution vector print formats, with the 7-Fold Code quick-reference card.
            </p>
            <button
              type="button"
              onClick={() => {
                addItem({
                  id: "complete-collector-bundle",
                  title: "Complete 4-Volume Collector's Master Edition",
                  subtitle: "All 4 authentic manuscripts + 7-Fold vector blueprints",
                  price: 49,
                  category: "bundle",
                  badge: "Collector's Pack",
                  downloadUrl: "/api/download/the-architecture-of-reality.pdf",
                });
              }}
              className="btn-gold w-full text-xs py-2 flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <span>🛒</span> Add Bundle to Checkout ($49)
            </button>
          </div>
        </div>

        {/* Chapters & Content Column */}
        <div className="space-y-6">
          {/* View Mode Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-line pb-4 gap-3">
            <div className="space-y-0.5">
              <span className="eyebrow">
                {viewMode === "pdf" ? "Original PDF Document" : "Reading Room"}
              </span>
              <h2 className="font-serif text-3xl text-ink">
                {activeBook.title}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              {/* Toggle Buttons */}
              <div className="inline-flex rounded-lg border border-line p-1 bg-charcoal">
                <button
                  type="button"
                  onClick={() => setViewMode("text")}
                  className={`px-3 py-1.5 rounded text-xs font-mono transition cursor-pointer ${
                    viewMode === "text"
                      ? "bg-gold text-black font-semibold"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  Chapters
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("pdf")}
                  className={`px-3 py-1.5 rounded text-xs font-mono transition cursor-pointer ${
                    viewMode === "pdf"
                      ? "bg-gold text-black font-semibold"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  PDF Document
                </button>
              </div>

              {viewMode === "text" ? (
                <div className="hidden sm:flex gap-2">
                  <button
                    type="button"
                    onClick={() => expandAll(activeBook)}
                    className="text-xs font-mono text-muted hover:text-gold transition px-2 py-1"
                  >
                    Expand
                  </button>
                  <span className="text-line-strong">•</span>
                  <button
                    type="button"
                    onClick={() => collapseAll(activeBook)}
                    className="text-xs font-mono text-muted hover:text-gold transition px-2 py-1"
                  >
                    Collapse
                  </button>
                </div>
              ) : (
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs text-gold border border-gold/40 rounded-full px-3 py-1 hover:bg-gold/10 transition"
                >
                  Full Tab ↗
                </a>
              )}
            </div>
          </div>

          {/* Conditional Rendering: PDF View vs Text Chapters */}
          {viewMode === "pdf" ? (
            <div className="space-y-4 animate-fade-up">
              <div className="card p-4 flex flex-col sm:flex-row items-center justify-between gap-3 bg-charcoal-raised border-gold/30">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-gold font-medium">{pdfFilename}</span>
                    <span className="rounded-full bg-gold/10 border border-gold/30 px-2 py-0.5 text-[0.65rem] font-mono text-gold">
                      {activeBook.fileSize ?? "Authentic Manuscript"}
                    </span>
                  </div>
                  <p className="text-xs text-muted">
                    Full original manuscript rendered in-page. Use embedded controls to zoom, scroll, or print.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={activeBook.downloadUrl ?? `/api/download/${activeBook.id}.pdf`}
                    download={pdfFilename}
                    className="btn-gold text-xs py-1.5 px-3 flex items-center gap-1.5"
                  >
                    <span>⬇</span> Download ({activeBook.fileSize ?? "PDF"})
                  </a>
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-ghost text-xs py-1.5 px-3 flex items-center gap-1.5"
                  >
                    <span>↗</span> Full Tab
                  </a>
                </div>
              </div>

              <div className="w-full h-[85vh] rounded-2xl overflow-hidden border border-line-strong bg-[#151a23] shadow-2xl">
                <object
                  data={`${pdfUrl}#toolbar=1&view=FitH`}
                  type="application/pdf"
                  className="w-full h-full border-none"
                  title={`${activeBook.title} PDF Document`}
                >
                  <iframe
                    src={`${pdfUrl}#toolbar=1&view=FitH`}
                    className="w-full h-full border-none"
                    title={`${activeBook.title} PDF Document`}
                  >
                    <div className="p-8 text-center text-muted">
                      <p>Your browser does not support inline PDF viewing.</p>
                      <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-gold mt-4 inline-block"
                      >
                        Open PDF in New Window ↗
                      </a>
                    </div>
                  </iframe>
                </object>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {activeBook.sections.map((section, idx) => {
                const key = `${activeBook.id}-${section.id}`;
                const isOpen = !!openSections[key];

                return (
                  <div
                    key={section.id}
                    id={section.id}
                    className={`card transition-colors duration-300 ${
                      isOpen ? "border-line-strong bg-charcoal" : "border-line bg-charcoal/50 hover:border-gold/30"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleSection(activeBook.id, section.id)}
                      className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                      aria-expanded={isOpen}
                    >
                      <div className="flex items-center gap-4">
                        <span className="font-mono text-xs text-gold/60 w-6">
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <h3 className="font-serif text-xl sm:text-2xl text-ink">
                          {section.title}
                        </h3>
                      </div>
                      <span
                        className={`grid size-7 place-items-center rounded-full border border-line text-xs font-mono text-gold transition-transform duration-300 ${
                          isOpen ? "rotate-180 bg-gold/10" : ""
                        }`}
                      >
                        ↓
                      </span>
                    </button>

                    {isOpen && (
                      <div className="px-6 pb-8 pt-2 border-t border-line/60">
                        <div className="flex items-center justify-between pb-3 mb-4 border-b border-line/40 text-xs font-mono">
                          <span className="text-muted">
                            Reading Room Chapter {idx + 1}
                          </span>
                          <Link
                            href={`/library/${activeBook.id.startsWith("the-") ? activeBook.id : `the-${activeBook.id}`}/${section.id}`}
                            className="text-gold hover:text-gold-bright flex items-center gap-1.5 border border-gold/30 hover:border-gold bg-gold/5 hover:bg-gold/10 px-2.5 py-1 rounded-md transition duration-200"
                          >
                            <span>Deep Reader Mode ↗</span>
                          </Link>
                        </div>
                        <div className="max-w-2xl">
                          <Markdown>{section.body}</Markdown>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Inter-chapter Call to Action */}
          <div className="card p-8 border-gold/30 bg-gradient-to-r from-charcoal via-charcoal to-[#161b24] mt-10">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-1">
                <span className="eyebrow">Practical Integration</span>
                <h4 className="font-serif text-2xl text-ink">Ready to apply these principles?</h4>
                <p className="text-sm text-muted">
                  Test for energy and time leaks and receive your 72-hour directive.
                </p>
              </div>
              <Link href="/audit" className="btn-gold shrink-0">
                Take the Energy Audit →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
