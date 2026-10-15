# The Architecture of Reality — Web Platform & Operating System

> **A sovereign digital sanctuary bridging ancient wisdom, modern mechanics, and practical energy architecture.**

This repository contains the complete web application for *The Architecture of Reality* trilogy by Jeremy Ashe. Built with **Next.js (App Router)**, **React 19**, **Tailwind CSS**, and **TypeScript**.

---

## 🗂️ Content Editing & Management Guide

All content is cleanly organized in single-source-of-truth files so you can easily edit text, add articles, adjust questions, and update pricing down the line without digging through complex code.

### 1. Blog Articles & Dispatches (`content/dispatches/`)
The **News** page functions as a file-based CMS. Each `.md` file in `content/dispatches/` automatically becomes a published article with live reading time, Hebrew typography, and automated gamification tracking.

* **Location:** [`content/dispatches/`](file:///Users/jeremyashe/Documents/Jeremy/The%20Trilogy%20Books/Website/content/dispatches/)
* **How to Add a New Post:**
  Create a new file (e.g. `my-new-dispatch.md`) with this YAML header:
  ```markdown
  ---
  title: "Your Title Here"
  summary: "A 1-2 sentence preview summary."
  category: "Business Systems" # Options: Mind & Cognitive, Biological Regulation, Relational Trust, Business Systems
  readTime: "5 min"
  publishedAt: "2026-10-15"
  hebrew: "שָׁוְא" # Optional Hebrew root glyph
  transliteration: "Shav" # Optional transliteration
  relatedOfferId: "field-manual" # Optional related offer link
  ---

  Your article text written in clean Markdown here...
  ```
* **Gamification:** Reading an article automatically tracks completion and credits members **+25 points** toward their operator rank.

---

### 2. Energy & Time Audit (`src/lib/data/audit.ts`)
The 12-question diagnostic assessment is centrally configured here.

* **Location:** [`src/lib/data/audit.ts`](file:///Users/jeremyashe/Documents/Jeremy/The%20Trilogy%20Books/Website/src/lib/data/audit.ts)
* **What you can edit:**
  * **Sectors:** Mind, Body, Soul labels, descriptions, and glyphs (`SECTORS`).
  * **Questions:** The 12 diagnostic prompts (4 per sector) (`AUDIT_QUESTIONS`).
  * **Polarity Modes:** The Forcing vs. Passive drift descriptions and containment fixes (`DRIFT_MODES`).

---

### 3. Library & Reading Room (`src/lib/data/books.ts`)
Controls the reading room reader, book overviews, taglines, and chapter excerpts for all 4 canonical volumes.

* **Location:** [`src/lib/data/books.ts`](file:///Users/jeremyashe/Documents/Jeremy/The%20Trilogy%20Books/Website/src/lib/data/books.ts)
* **Volumes included:**
  1. *Foundation Volume: The Architecture of Reality*
  2. *Book I: The Master Blueprint*
  3. *Book II: The Genesis Lens*
  4. *Book III: The Covenant*
* **Downloadable PDFs:** Located in [`public/pdfs/`](file:///Users/jeremyashe/Documents/Jeremy/The%20Trilogy%20Books/Website/public/pdfs/) and served via secure stream at `/api/download/[filename]`.

---

### 4. Offers & Advisory Tiers (`src/lib/data/offers.ts`)
The single source of truth for all products, books, courses, and consulting tiers.

* **Location:** [`src/lib/data/offers.ts`](file:///Users/jeremyashe/Documents/Jeremy/The%20Trilogy%20Books/Website/src/lib/data/offers.ts)
* **Tiers:**
  * **15-Min Intro Call ($20 CAD):** Direct Cal.com booking on `/book`.
  * **30-Min Strategy Call ($35 CAD):** Direct Cal.com booking on `/book`.
  * **The Energy & Time Field Manual ($27 CAD):** 64-page PDF distillation.
  * **Trilogy Companion Workbooks ($47 CAD):** Diagnostic worksheets.
  * **Sovereign Membership Access ($50 CAD):** Three 30-min 1-on-1 video calls with Jeremy Ashe, unmetered Digital Vault PDF access, and all 8 course modules.
  * **12-Week Systemic Alignment ($497 CAD):** Group curriculum.
  * **Sovereign Systems Sprint ($2,400 CAD):** Enterprise advisory.

---

### 5. Cal.com Meeting Scheduling (`.env.local` & `SovereignBookingWidget.tsx`)
The **"Meet"** tab runs on a native `@calcom/embed-react` widget with forced dark mode, month view, and metallic legacy gold accents (`#C5A880`).

* **Active Link:** `jeremy-ashe-u8qpu7/15min`
* **Configuration:**
  * Edit `NEXT_PUBLIC_CAL_LINK` in [`.env.local`](file:///Users/jeremyashe/Documents/Jeremy/The%20Trilogy%20Books/Website/.env.local) to change calendar slugs anytime.
  * Widget Component: [`src/components/booking/SovereignBookingWidget.tsx`](file:///Users/jeremyashe/Documents/Jeremy/The%20Trilogy%20Books/Website/src/components/booking/SovereignBookingWidget.tsx).

---

### 6. Members Portal & Gamification (`src/context/MemberContext.tsx`)
Manages member authentication, free accounts, $50 paid upgrades, points, and 3 video call bookings.

* **Context & Storage:** [`src/context/MemberContext.tsx`](file:///Users/jeremyashe/Documents/Jeremy/The%20Trilogy%20Books/Website/src/context/MemberContext.tsx)
* **Portal UI Component:** [`src/components/members/MemberPortal.tsx`](file:///Users/jeremyashe/Documents/Jeremy/The%20Trilogy%20Books/Website/src/components/members/MemberPortal.tsx)
* **Operator Ranks:**
  * 0 – 99 pts: *Initiate Explorer*
  * 100 – 249 pts: *Sovereign Apprentice*
  * 250 – 499 pts: *Vessel Architect*
  * 500+ pts: *Sovereign Master*

---

## 🏗️ Directory Map

```
├── content/
│   ├── books/              # Raw manuscript source exports
│   └── dispatches/         # Markdown CMS articles for the News page
├── public/
│   └── pdfs/               # Canonical book and manual PDFs
├── src/
│   ├── app/                # Next.js App Router pages
│   │   ├── audit/          # Energy & Time Audit page
│   │   ├── book/           # "Meet" Cal.com scheduling page
│   │   ├── checkout/       # Shopping cart & checkout flow
│   │   ├── contact/        # Contact & direct inquiries page
│   │   ├── library/        # Reading room & canon reader
│   │   ├── login/          # Member login screen
│   │   ├── members/        # Member portal, quests, 3 video calls & vault
│   │   ├── news/           # Dispatches catalog & [slug] reader
│   │   ├── offers/         # Product & advisory catalog
│   │   └── signup/         # Free member registration
│   ├── components/         # Reusable React UI components
│   │   ├── audit/          # Interactive audit assessment engine
│   │   ├── booking/        # Cal.com SovereignBookingWidget
│   │   ├── checkout/       # Cart drawer & checkout view
│   │   ├── gamification/   # Toast notifications & read tracking
│   │   ├── layout/         # Navbar, Footer, brand styling
│   │   ├── library/        # Reading room & in-page PDF viewer
│   │   ├── members/        # Member dashboard & video call scheduler
│   │   ├── news/           # News catalog
│   │   └── offers/         # Offers catalog
│   ├── context/            # React context providers (CartContext, MemberContext)
│   └── lib/                # Shared utilities & data models
│       ├── audit/          # Audit scoring math & bands
│       ├── data/           # Single-source-of-truth catalogs (audit, booking, books, offers)
│       └── dispatches.ts   # Server-side dispatch loader & markdown parser
```

---

## ⚡ Development Commands

```bash
# Run local dev server (http://localhost:3000)
npm run dev

# Run ESLint validation
npm run lint

# Compile production build
npm run build
```
