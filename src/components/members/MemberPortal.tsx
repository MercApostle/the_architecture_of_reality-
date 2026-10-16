"use client";

import { useState } from "react";
import Link from "next/link";
import { useMember } from "@/context/MemberContext";
import { useCart } from "@/context/CartContext";

interface Props {
  initialMode?: "signin" | "signup";
}

export default function MemberPortal({ initialMode = "signin" }: Props) {
  const {
    user,
    isAuthenticated,
    isLoading,
    login,
    loginWithDemo,
    signup,
    logout,
    toggleModuleComplete,
    upgradeToPaidMembership,
    downgradeToFree,
    bookMeetingCredit,
    getUserRank,
  } = useMember();

  const { addItem, openCart } = useCart();

  // Auth form state
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [authError, setAuthError] = useState("");
  const [authSubmitting, setAuthSubmitting] = useState(false);

  // Active dashboard tab
  const [activeTab, setActiveTab] = useState<"gamification" | "vault" | "curriculum" | "meetings" | "briefings">("gamification");
  const [activeModuleIndex, setActiveModuleIndex] = useState<number>(0);

  // Booking modal state for the 3 video conferences
  const [bookingCallNumber, setBookingCallNumber] = useState<number | null>(null);
  const [meetingTopic, setMeetingTopic] = useState("Energy & Time Calibration & Schedule Setup");
  const [meetingDate, setMeetingDate] = useState("2026-10-20");

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setAuthSubmitting(true);

    if (mode === "signin") {
      const res = await login(email, password);
      if (!res.success) {
        setAuthError(res.error || "Failed to sign in. Please check your credentials.");
      }
    } else {
      const res = await signup(name, email, password);
      if (!res.success) {
        setAuthError(res.error || "Failed to create free account.");
      }
    }

    setAuthSubmitting(false);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingCallNumber) return;

    bookMeetingCredit(bookingCallNumber, meetingTopic, meetingDate);
    setBookingCallNumber(null);
  };

  const handleCartUpgrade = () => {
    addItem({
      id: "members-access",
      title: "Sovereign Membership Access",
      subtitle: "3 × 30-Min Video Calls with Jeremy Ashe & Full Vault",
      price: 50,
      tier: 1,
      category: "course",
      badge: "3 Video Calls Included",
      deliverables: [
        "Three (3) 30-minute 1-on-1 video conference calls with Jeremy Ashe",
        "Full unabridged PDF downloads of all 3 Trilogy books",
        "8-Module Sovereign Operator video & audio curriculum",
        "+200 Gamification Points & Sovereign Member Badge",
      ],
    });
    openCart();
  };

  // Curriculum Data
  const modules = [
    {
      id: "m1",
      title: "Module 1: The 80-Hour Work Month Operating System",
      duration: "48 min",
      sector: "Mind & Time",
      isFree: true,
      summary:
        "Architecting your working calendar around 4-hour daily vectors. Eliminating artificial urgency and cognitive overthinking to achieve 3x output with zero biological depletion.",
      takeaways: [
        "The mathematical law of diminishing cognitive returns past hour 4",
        "Enforcing non-negotiable shutdown boundaries without anxiety",
        "Converting chaotic task lists into directional single-vector focus blocks",
      ],
    },
    {
      id: "m2",
      title: "Module 2: Dynamic Balance & Stress Drift Neutralization",
      duration: "42 min",
      sector: "Energy & Body",
      isFree: false,
      summary:
        "Detecting whether you default into Forcing Polarity (excess control, muscle-through) or Passive Polarity (avoidance, procrastination), and installing automated somatic counterweights.",
      takeaways: [
        "The biological signature of high stress: narrow aperture vs sovereign view",
        "Protocol for breaking avoidance loops in under 15 minutes",
        "Evening down-regulation protocols to reset nervous system tone",
      ],
    },
    {
      id: "m3",
      title: "Module 3: The Tripartite Fruit Test Decision Matrix",
      duration: "36 min",
      sector: "Soul & Integrity",
      isFree: false,
      summary:
        "A 3-fold evaluation filter for every critical enterprise and personal crossroad: testing for cognitive truth (Mind), somatic sustainability (Body), and relational congruence (Soul).",
      takeaways: [
        "Detecting hidden pretenses before they cause systemic damage",
        "Why gut intuition without somatic regulation is dangerous",
        "The 3 non-negotiable questions to ask before signing any contract",
      ],
    },
    {
      id: "m4",
      title: "Module 4: Enterprise Firewalls — The 10 Inviolate Covenants",
      duration: "54 min",
      sector: "Business Systems",
      isFree: false,
      summary:
        "Translating the 10 operational firewalls into team governance, clean communication architectures, and high-trust covenants that prevent internal sabotage and burnout.",
      takeaways: [
        "Eliminating Shav (empty words) in team commitments and agendas",
        "Building firewalls against Tachmod (coveting competitor roadmaps)",
        "Installing the weekly Sabbath shutdown firewall across executive teams",
      ],
    },
    {
      id: "m5",
      title: "Module 5: Biological Regulation & Nervous System Somatics",
      duration: "40 min",
      sector: "Body",
      isFree: false,
      summary:
        "Nervous-system regulation, sleep architecture restoration, and targeted physical recovery protocols that keep your cognitive container pristine under high-stakes loads.",
      takeaways: [
        "Vagus nerve resets to stop acute adrenaline dumps",
        "Optimizing the 90-minute ultradian rhythm for deep execution",
        "Non-stimulant energy architecture for sustained afternoon clarity",
      ],
    },
    {
      id: "m6",
      title: "Module 6: Sovereign Relational Boundaries & Congruence",
      duration: "38 min",
      sector: "Soul",
      isFree: false,
      summary:
        "Ending passive-aggressive avoidance, communicating absolute truth with kindness, and setting sovereign boundaries that protect your life mission without guilt.",
      takeaways: [
        "The art of delivering a clean, unassailable 'no'",
        "Distinguishing between mutual value creation vs parasitic extraction",
        "Auditing relational energy leaks across key partnerships",
      ],
    },
    {
      id: "m7",
      title: "Module 7: Calibrating the 4-Hour Daily Vector",
      duration: "32 min",
      sector: "Mind",
      isFree: false,
      summary:
        "Step-by-step setup for structuring your mornings around the highest leverage vector, handling interruptions, and entering effortless flow states.",
      takeaways: [
        "The First 90 Minutes rule: signal fasting and zero incoming feeds",
        "Eliminating micro-switching and open cognitive tabs",
        "The single metric that defines daily operational victory",
      ],
    },
    {
      id: "m8",
      title: "Module 8: The 90-Day Sovereign Architecture Blueprint",
      duration: "60 min",
      sector: "Integration",
      isFree: false,
      summary:
        "Synthesizing the entire Trilogy into a permanent personal and organizational architecture. Quarter-by-quarter calibration routines that ensure permanent sovereignty.",
      takeaways: [
        "Mapping your next 90 days against universal laws",
        "Quarterly audit cadence: scoring Mind, Body, and Soul progress",
        "Sustaining dynamic balance through economic and life transitions",
      ],
    },
  ];

  // Vault Items
  const vaultItems = [
    {
      id: "master-blueprint",
      title: "Book I: The Master Blueprint",
      subtitle: "Full Unabridged Master Edition",
      pages: "264 Pages · PDF Edition",
      badge: "Core Canon",
      filename: "the-master-blueprint.pdf",
      isFree: false,
      description:
        "The foundational architecture mapping the 7 Universal Principles to cognitive clarity, biological vitality, and high-trust enterprise mechanics.",
    },
    {
      id: "genesis-lens",
      title: "Book II: The Genesis Lens",
      subtitle: "Unabridged Field Edition",
      pages: "212 Pages · PDF Edition",
      badge: "Core Canon",
      filename: "the-genesis-lens.pdf",
      isFree: false,
      description:
        "Deciphering ancient linguistic root codes and operational laws to calibrate personal vision, eliminate deception, and master human energy.",
    },
    {
      id: "the-covenant",
      title: "Book III: The Covenant",
      subtitle: "Enterprise Operating Manual",
      pages: "198 Pages · PDF Edition",
      badge: "Core Canon",
      filename: "the-covenant.pdf",
      isFree: false,
      description:
        "The complete architecture for sovereign relationships, load-bearing agreements, and building unbreakable enterprises on foundational truth.",
    },
    {
      id: "field-manual",
      title: "The Energy & Time Field Manual & 72-Hour Protocols",
      subtitle: "Tactical Companion Workbook",
      pages: "64 Pages · Tactical Templates",
      badge: "Field Tool",
      filename: "the-master-blueprint.pdf",
      isFree: false,
      description:
        "Daily calibration worksheets, 80-hour work month scheduling grids, and complete step-by-step 72-hour directives for all 6 alignment variants.",
    },
  ];

  // Gamification Quests Registry
  const quests = [
    {
      id: "welcome_bonus",
      title: "Initialize Sovereign Account",
      description: "Create your free login on The Architecture of Reality",
      points: 50,
      category: "Account",
      href: "/login",
    },
    {
      id: "read_blog_shav-empty-words",
      title: "Read: Shav & The Business Cost of Empty Words",
      description: "Discover how empty promises erode coordination and trust",
      points: 25,
      category: "Dispatch",
      href: "/news/shav-empty-words",
    },
    {
      id: "read_blog_tachmod-desire-firewall",
      title: "Read: Tachmod, Desire & The 10th Firewall",
      description: "Understand the neuroscience of dopamine and comparison traps",
      points: 25,
      category: "Dispatch",
      href: "/news/tachmod-desire-firewall",
    },
    {
      id: "read_blog_mitzrayim-narrow-places",
      title: "Read: Mitzrayim & The Neuroscience of Narrow Places",
      description: "Map the biological signature of threat-locked forcing modes",
      points: 25,
      category: "Dispatch",
      href: "/news/mitzrayim-narrow-places",
    },
    {
      id: "complete_energy_audit",
      title: "Complete the 12-Question Energy & Time Audit",
      description: "Diagnose Mind, Body, and Soul sector leaks with live scoring",
      points: 100,
      category: "Assessment",
      href: "/audit",
    },
    {
      id: "complete_module_m1",
      title: "Master Lesson 1: The 80-Hour Work Month",
      description: "Complete the 48-minute foundational calendar architecture module",
      points: 50,
      category: "Academy",
      href: "#curriculum",
    },
    {
      id: "upgrade_membership",
      title: "Upgrade to Sovereign Member Access ($50 CAD)",
      description: "Unlock full Vault, all 8 modules, and 3 video calls with Jeremy",
      points: 200,
      category: "Membership",
      href: "#upgrade",
    },
    {
      id: "booked_call_1",
      title: "Schedule 1st Video Call with Jeremy",
      description: "Book your first 30-minute 1-on-1 video conference on Google Meet",
      points: 75,
      category: "Advisory",
      href: "#meetings",
    },
  ];

  if (isLoading) {
    return (
      <div className="container-x py-24 text-center">
        <div className="inline-block size-8 rounded-full border-2 border-gold border-t-transparent animate-spin mb-4" />
        <p className="font-mono text-xs text-gold uppercase tracking-widest">
          Authenticating Member Credentials…
        </p>
      </div>
    );
  }

  // ── UNAUTHENTICATED: SIGN IN / REGISTER GATE ───────────────────────────
  if (!isAuthenticated || !user) {
    return (
      <div className="container-x py-16 lg:py-24 max-w-xl mx-auto">
        <div className="card p-8 sm:p-12 border-gold/40 bg-gradient-to-b from-charcoal via-charcoal to-[#16130b] space-y-8 relative overflow-hidden shadow-[0_0_50px_-10px_rgba(212,175,55,0.15)]">
          <div className="pointer-events-none absolute -top-24 -right-24 size-64 rounded-full bg-gold/15 blur-3xl" />

          {/* Header */}
          <div className="text-center space-y-3 relative">
            <div className="mx-auto size-12 rounded-2xl border border-gold/50 bg-gold/10 text-gold flex items-center justify-center text-xl shadow-[0_0_20px_-3px_rgba(212,175,55,0.4)]">
              🔒
            </div>
            <span className="eyebrow block">Sovereign Member Portal</span>
            <h1 className="font-serif text-3xl sm:text-4xl text-ink font-medium">
              {mode === "signin" ? (
                <>Member <span className="text-gradient-gold italic">Log In</span></>
              ) : (
                <>Create <span className="text-gradient-gold italic">Free Account</span></>
              )}
            </h1>
            <p className="text-xs sm:text-sm text-muted leading-relaxed">
              Create a free account to track your reading, earn gamification points, and unlock Sovereign Member Access ($50 CAD) with three 1-on-1 video conference calls with Jeremy Ashe.
            </p>
          </div>

          {/* Sample Free Preview Option */}
          <div className="space-y-2">
            <button
              type="button"
              id="member-demo-free-btn"
              onClick={() => loginWithDemo(false)}
              className="w-full btn-ghost py-2.5 text-[0.72rem] font-semibold cursor-pointer border-line text-muted hover:text-gold hover:border-gold/40 flex items-center justify-center gap-2"
            >
              <span>⚡</span> Explore Sample Free Account (Preview)
            </button>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-line w-full" />
            <span className="bg-charcoal px-3 font-mono text-[0.65rem] text-faint uppercase tracking-wider relative">
              Or Use Your Credentials
            </span>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-obsidian border border-line">
            <button
              type="button"
              id="auth-tab-signin"
              onClick={() => {
                setMode("signin");
                setAuthError("");
              }}
              className={`py-2 text-xs font-mono tracking-wider rounded-lg transition cursor-pointer ${
                mode === "signin"
                  ? "bg-gold text-obsidian font-bold shadow-sm"
                  : "text-muted hover:text-ink"
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              id="auth-tab-signup"
              onClick={() => {
                setMode("signup");
                setAuthError("");
              }}
              className={`py-2 text-xs font-mono tracking-wider rounded-lg transition cursor-pointer ${
                mode === "signup"
                  ? "bg-gold text-obsidian font-bold shadow-sm"
                  : "text-muted hover:text-ink"
              }`}
            >
              Sign Up (Free)
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {authError && (
              <div className="p-3 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-300 text-xs">
                {authError}
              </div>
            )}

            {mode === "signup" && (
              <div className="space-y-1">
                <label className="font-mono text-[0.68rem] text-muted block uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Eleanor Vance"
                  className="w-full rounded-xl border border-line bg-obsidian px-4 py-2.5 text-xs text-ink placeholder:text-faint focus:border-gold focus:outline-none transition"
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="font-mono text-[0.68rem] text-muted block uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="member@domain.com"
                className="w-full rounded-xl border border-line bg-obsidian px-4 py-2.5 text-xs text-ink placeholder:text-faint focus:border-gold focus:outline-none transition"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="font-mono text-[0.68rem] text-muted block uppercase tracking-wider">
                  Password
                </label>
                <span className="font-mono text-[0.62rem] text-faint">min. 6 characters</span>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-line bg-obsidian px-4 py-2.5 text-xs text-ink placeholder:text-faint focus:border-gold focus:outline-none transition"
              />
            </div>

            <button
              type="submit"
              id="member-submit-auth-btn"
              disabled={authSubmitting}
              className="btn-gold w-full py-3 text-xs font-semibold cursor-pointer shadow-md disabled:opacity-50 mt-2"
            >
              {authSubmitting
                ? "Authenticating…"
                : mode === "signin"
                ? "Log In to Account →"
                : "Create Free Account (+50 Pts) →"}
            </button>
          </form>

          {/* Footer note */}
          <div className="pt-2 text-center space-y-2 border-t border-line text-xs text-muted">
            <p className="text-[0.72rem]">
              Free account gives you points tracking across blogs &amp; assessments. Upgrading to Paid Access ($50 CAD) includes 3 video calls with Jeremy.
            </p>
            <p className="text-[0.68rem] text-faint">
              Need assistance? <Link href="/contact" className="text-gold hover:underline">Contact Jeremy directly</Link>.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── AUTHENTICATED: MEMBER DASHBOARD ────────────────────────────────────
  const userRankInfo = getUserRank(user.points);
  const isPaid = user.tier === "paid";
  const completedCount = user.completedModules?.length || 0;

  return (
    <div className="container-x py-12 lg:py-16 space-y-12">
      {/* ── TOP BANNER / MEMBER PROFILE & TIER STATUS ──────────────────── */}
      <div className="card p-6 sm:p-8 border-gold/40 bg-gradient-to-r from-charcoal via-charcoal to-[#1a170e] flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="pointer-events-none absolute -right-24 -bottom-24 size-72 rounded-full bg-gold/10 blur-3xl" />

        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className={`size-2 rounded-full ${isPaid ? "bg-emerald" : "bg-gold"} animate-pulse-gold`} />
            <span className="font-mono text-xs uppercase tracking-widest text-gold font-bold">
              {isPaid ? "⚡ Sovereign Member ($50 CAD Tier)" : "Free Account"}
            </span>
            <span className="text-faint text-xs font-mono">• {userRankInfo.rank}</span>
            <span className="bg-gold/20 border border-gold/40 text-gold px-2.5 py-0.5 rounded-full font-mono text-xs font-bold">
              ⭐ {user.points} Points
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl text-ink font-medium">
            Welcome back, <span className="text-gradient-gold italic">{user.name}</span>
          </h1>

          <p className="text-xs sm:text-sm text-muted">
            Member ID: <span className="font-mono text-ink">{user.id}</span> · Joined {user.memberSince} · {user.email}
          </p>
        </div>

        {/* Member Actions */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          {!isPaid ? (
            <button
              type="button"
              id="banner-upgrade-btn"
              onClick={handleCartUpgrade}
              className="btn-gold text-xs px-4 py-2.5 flex items-center gap-2 shadow-[0_0_15px_-3px_rgba(212,175,55,0.5)] cursor-pointer"
            >
              <span>⭐</span> Upgrade to Paid Access ($50 CAD)
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("meetings")}
                className="btn-gold text-xs px-4 py-2 flex items-center gap-2 shadow-sm cursor-pointer"
              >
                <span>📅</span> {user.meetingCreditsRemaining} Video Calls Remaining
              </button>
              <button
                type="button"
                id="reset-tier-btn"
                onClick={downgradeToFree}
                title="Reset tier to free to test the real purchase flow"
                className="text-[0.68rem] font-mono text-muted hover:text-gold border border-line bg-obsidian/80 px-2.5 py-1.5 rounded transition cursor-pointer"
              >
                ↺ Reset to Free (Test)
              </button>
            </div>
          )}

          <button
            type="button"
            id="member-signout-btn"
            onClick={logout}
            className="btn-ghost text-xs py-2 px-3.5 text-muted hover:text-ink cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* ── PAID TIER HIGHLIGHT CARD (IF FREE USER) ────────────────────── */}
      {!isPaid && (
        <div id="upgrade" className="card p-8 border-gold bg-gradient-to-br from-[#1a1608] via-charcoal to-obsidian relative overflow-hidden space-y-6 shadow-[0_0_35px_-5px_rgba(212,175,55,0.25)] ring-1 ring-gold/40">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-gold uppercase tracking-widest font-bold">
                  Sovereign Member Upgrade
                </span>
                <span className="bg-gold text-obsidian px-2 py-0.5 rounded font-mono text-[0.65rem] font-bold">
                  $50 CAD One-Time
                </span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl text-ink font-medium">
                Unlock 3 Video Conferences with Jeremy Ashe &amp; Full Digital Vault
              </h2>
              <p className="text-sm text-muted leading-relaxed">
                Your login is free. Upgrading to the <strong className="text-gold">$50 CAD Sovereign Membership</strong> gives you <strong className="text-ink">three (3) 30-minute 1-on-1 video conference calls with Jeremy Ashe</strong>, complete unabridged PDF access to all three books, and all 8 mastery modules.
              </p>
              <ul className="grid sm:grid-cols-2 gap-2 pt-2 text-xs text-faint">
                <li className="flex items-center gap-2 text-ink">
                  <span className="text-gold font-bold">✓</span> 3 × 30-Min Video Calls with Jeremy Ashe (Google Meet)
                </li>
                <li className="flex items-center gap-2 text-ink">
                  <span className="text-gold font-bold">✓</span> Full PDF downloads of Books I, II, and III
                </li>
                <li className="flex items-center gap-2 text-ink">
                  <span className="text-gold font-bold">✓</span> All 8 Mastery Curriculum video/audio lessons
                </li>
                <li className="flex items-center gap-2 text-ink">
                  <span className="text-gold font-bold">✓</span> +200 Gamification Bonus Points &amp; Sovereign Badge
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
              <button
                type="button"
                id="portal-upgrade-now-btn"
                onClick={handleCartUpgrade}
                className="btn-gold text-xs py-3.5 px-8 font-semibold shadow-lg text-center cursor-pointer flex items-center justify-center gap-2"
              >
                <span>🚀</span> Upgrade Now for $50 CAD →
              </button>
              <p className="font-mono text-[0.65rem] text-faint text-center">
                Instant activation upon checkout
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── GAMIFICATION PROGRESS BAR ─────────────────────────────────── */}
      <div className="card p-6 border-line bg-charcoal/80 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="font-mono text-[0.65rem] text-muted uppercase tracking-wider block">
              Operator Rank &amp; Progression
            </span>
            <h3 className="font-serif text-2xl text-ink font-medium">
              Rank: <span className="text-gold">{userRankInfo.rank}</span>
            </h3>
          </div>
          <div className="text-right sm:space-y-1">
            <p className="font-mono text-xs text-gold font-bold">
              {user.points} Total Points
            </p>
            {userRankInfo.pointsToNext > 0 ? (
              <p className="font-mono text-[0.68rem] text-faint">
                {userRankInfo.pointsToNext} pts to {userRankInfo.nextRank}
              </p>
            ) : (
              <p className="font-mono text-[0.68rem] text-emerald">Highest Sovereign Rank</p>
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 w-full bg-obsidian rounded-full overflow-hidden border border-line">
          <div
            className="h-full bg-gradient-to-r from-gold-deep via-gold to-gold-bright transition-all duration-700 rounded-full"
            style={{ width: `${userRankInfo.progress}%` }}
          />
        </div>
      </div>

      {/* ── NAVIGATION TABS INSIDE MEMBER PORTAL ───────────────────────── */}
      <div className="border-b border-line flex items-center gap-2 overflow-x-auto pb-px">
        <button
          type="button"
          onClick={() => setActiveTab("gamification")}
          className={`py-3 px-5 font-mono text-xs tracking-wider transition border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === "gamification"
              ? "border-gold text-gold font-bold bg-gold/5"
              : "border-transparent text-muted hover:text-ink hover:border-line"
          }`}
        >
          ⭐ Quests &amp; Points ({user.completedTasks.length}/{quests.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("meetings")}
          className={`py-3 px-5 font-mono text-xs tracking-wider transition border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === "meetings"
              ? "border-gold text-gold font-bold bg-gold/5"
              : "border-transparent text-muted hover:text-ink hover:border-line"
          }`}
        >
          📹 3 Video Calls ({isPaid ? `${user.meetingCreditsRemaining} left` : "$50 CAD Tier"})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("vault")}
          className={`py-3 px-5 font-mono text-xs tracking-wider transition border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === "vault"
              ? "border-gold text-gold font-bold bg-gold/5"
              : "border-transparent text-muted hover:text-ink hover:border-line"
          }`}
        >
          📚 Reading Vault ({isPaid ? "Unlocked" : "Preview"})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("curriculum")}
          className={`py-3 px-5 font-mono text-xs tracking-wider transition border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === "curriculum"
              ? "border-gold text-gold font-bold bg-gold/5"
              : "border-transparent text-muted hover:text-ink hover:border-line"
          }`}
        >
          🎓 Mastery Academy ({completedCount}/{modules.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("briefings")}
          className={`py-3 px-5 font-mono text-xs tracking-wider transition border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === "briefings"
              ? "border-gold text-gold font-bold bg-gold/5"
              : "border-transparent text-muted hover:text-ink hover:border-line"
          }`}
        >
          🎙️ Inner Circle Field Notes
        </button>
      </div>

      {/* ── TAB 1: GAMIFICATION QUEST LOG & POINTS ─────────────────────── */}
      {activeTab === "gamification" && (
        <section className="space-y-8 animate-fade-up">
          <div className="space-y-2">
            <span className="eyebrow">Interactive Progression</span>
            <h2 className="font-serif text-3xl text-ink font-medium">Sovereign Quest Log &amp; Tasks</h2>
            <p className="text-sm text-muted max-w-2xl">
              Complete tasks across the platform to earn points, level up your rank, and demonstrate operational mastery. Reading blogs, completing audits, and exploring chapters all award points automatically.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {quests.map((quest) => {
              const isDone = user.completedTasks.includes(quest.id);

              return (
                <div
                  key={quest.id}
                  className={`card p-5 border transition flex items-start justify-between gap-4 ${
                    isDone
                      ? "border-emerald/40 bg-emerald/5"
                      : "border-line bg-charcoal/70 hover:border-gold/50"
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[0.62rem] text-gold uppercase tracking-wider bg-gold/10 px-2 py-0.5 rounded border border-gold/20">
                        {quest.category}
                      </span>
                      <span className="font-mono text-xs font-bold text-gold">
                        +{quest.points} pts
                      </span>
                    </div>

                    <h4 className="font-serif text-base text-ink font-medium">
                      {quest.title}
                    </h4>

                    <p className="text-xs text-muted leading-relaxed">
                      {quest.description}
                    </p>

                    {!isDone && quest.href && (
                      <div className="pt-2">
                        {quest.href.startsWith("#") ? (
                          <button
                            type="button"
                            onClick={() => {
                              if (quest.href === "#upgrade") handleCartUpgrade();
                              if (quest.href === "#curriculum") setActiveTab("curriculum");
                              if (quest.href === "#meetings") setActiveTab("meetings");
                            }}
                            className="text-gold font-mono text-xs hover:underline inline-flex items-center gap-1"
                          >
                            Execute Quest →
                          </button>
                        ) : (
                          <Link
                            href={quest.href}
                            className="text-gold font-mono text-xs hover:underline inline-flex items-center gap-1"
                          >
                            Execute Quest →
                          </Link>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="shrink-0 pt-1">
                    {isDone ? (
                      <span className="size-6 rounded-full bg-emerald text-obsidian flex items-center justify-center font-bold text-xs font-mono">
                        ✓
                      </span>
                    ) : (
                      <span className="size-6 rounded-full border border-line flex items-center justify-center text-xs font-mono text-faint">
                        ○
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── TAB 2: THREE 30-MINUTE VIDEO CONFERENCES ─────────────────────── */}
      {activeTab === "meetings" && (
        <section className="space-y-8 animate-fade-up">
          <div className="space-y-2">
            <span className="eyebrow">Video Conferencing Perk</span>
            <h2 className="font-serif text-3xl text-ink font-medium">Three 30-Minute Video Calls with Jeremy Ashe</h2>
            <p className="text-sm text-muted max-w-2xl">
              Included with the $50 Sovereign Member Access. Schedule three dedicated 30-minute 1-on-1 strategy sessions on Google Meet to calibrate your energy scores, structure your 80-hour work month, or review enterprise covenants.
            </p>
          </div>

          {!isPaid ? (
            <div className="card p-8 border-gold/60 bg-gradient-to-br from-[#1a1608] to-charcoal text-center space-y-4 max-w-xl mx-auto">
              <div className="size-14 rounded-full bg-gold/15 border border-gold/50 text-gold text-2xl flex items-center justify-center mx-auto shadow-md">
                🔒
              </div>
              <h3 className="font-serif text-2xl text-ink font-medium">
                Video Conferencing Locked to $50 CAD Tier
              </h3>
              <p className="text-xs text-muted leading-relaxed">
                Your current account is Free. Upgrade for $50 CAD to unlock all three 30-minute private video conference calls with Jeremy Ashe.
              </p>
              <button
                type="button"
                onClick={handleCartUpgrade}
                className="btn-gold py-3 px-8 text-xs font-semibold cursor-pointer shadow-md inline-flex items-center gap-2"
              >
                <span>⭐</span> Unlock 3 Calls for $50 CAD →
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="p-4 rounded-xl border border-emerald/40 bg-emerald/10 text-emerald text-xs flex items-center justify-between">
                <span>
                  ✓ <strong>Sovereign Membership Active:</strong> {user.meetingCreditsRemaining} of 3 video conference calls remaining.
                </span>
                <span className="font-mono text-gold font-bold">Google Meet Link Provided</span>
              </div>

              {/* 3 Call Cards */}
              <div className="grid gap-6 md:grid-cols-3">
                {[1, 2, 3].map((callNum) => {
                  const bookedCall = user.bookedMeetings.find((b) => b.callNumber === callNum);
                  const isScheduled = bookedCall?.status === "booked";

                  return (
                    <div
                      key={callNum}
                      className={`card p-6 border flex flex-col justify-between space-y-5 ${
                        isScheduled
                          ? "border-emerald/50 bg-emerald/5"
                          : "border-line bg-charcoal/80 hover:border-gold/50"
                      }`}
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs uppercase tracking-widest text-gold font-bold">
                            Call #{callNum}
                          </span>
                          <span className={`text-[0.68rem] px-2 py-0.5 rounded font-mono ${isScheduled ? "bg-emerald/20 text-emerald font-semibold" : "bg-charcoal text-muted border border-line"}`}>
                            {isScheduled ? "Scheduled ✓" : "Available"}
                          </span>
                        </div>

                        <h4 className="font-serif text-xl text-ink">
                          {isScheduled ? bookedCall.topic : `30-Min Strategy Call #${callNum}`}
                        </h4>

                        <p className="text-xs text-muted leading-relaxed">
                          {isScheduled
                            ? `Date: ${bookedCall.scheduledDate} · Hosted by Jeremy Ashe on Google Meet.`
                            : "Private 1-on-1 video conference to evaluate your systems, diagnose friction, and lock in calibration directives."}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-line">
                        {isScheduled ? (
                          <div className="space-y-2">
                            <a
                              href="https://meet.google.com"
                              target="_blank"
                              rel="noreferrer"
                              className="btn-gold w-full text-center text-xs py-2 block font-semibold"
                            >
                              Join Video Call 🎥
                            </a>
                            <span className="font-mono text-[0.62rem] text-faint block text-center">
                              Google Meet Encrypted Channel
                            </span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setBookingCallNumber(callNum)}
                            className="btn-gold w-full text-center text-xs py-2.5 font-semibold cursor-pointer"
                          >
                            Schedule Call #{callNum} →
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      )}

      {/* ── TAB 3: DIGITAL READING VAULT & PDFS ──────────────────────────── */}
      {activeTab === "vault" && (
        <section className="space-y-8 animate-fade-up">
          <div className="space-y-2">
            <span className="eyebrow">Authenticated Canon</span>
            <h2 className="font-serif text-3xl text-ink font-medium">The Sovereign Reading Vault</h2>
            <p className="text-sm text-muted max-w-2xl">
              Unabridged PDF manuscripts and companion field workbooks. {isPaid ? "Unlocked for unlimited download." : "Preview mode (Unlock all 4 for $50 CAD with your membership)."}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {vaultItems.map((item) => (
              <div
                key={item.id}
                className="card p-6 border-line hover:border-gold/50 transition duration-300 flex flex-col justify-between space-y-6 bg-charcoal/80"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-gold uppercase tracking-widest font-semibold">
                      {item.badge}
                    </span>
                    <span className="font-mono text-xs text-faint">{item.pages}</span>
                  </div>

                  <h3 className="font-serif text-2xl text-ink font-medium">{item.title}</h3>
                  <p className="font-mono text-xs text-muted">{item.subtitle}</p>

                  <p className="text-xs text-muted leading-relaxed">{item.description}</p>
                </div>

                <div className="pt-4 border-t border-line flex items-center justify-between gap-4">
                  {isPaid ? (
                    <>
                      <span className="inline-flex items-center gap-1.5 font-mono text-[0.68rem] text-emerald">
                        <span className="size-1.5 rounded-full bg-emerald" /> Unlocked &amp; Licensed
                      </span>
                      <a
                        href={`/api/download/${item.filename}`}
                        download={item.filename}
                        className="btn-gold text-xs py-2 px-4 flex items-center gap-2 cursor-pointer shadow-sm"
                      >
                        <span>📥</span> Download PDF
                      </a>
                    </>
                  ) : (
                    <>
                      <span className="inline-flex items-center gap-1.5 font-mono text-[0.68rem] text-faint">
                        🔒 Included in $50 CAD Tier
                      </span>
                      <button
                        type="button"
                        onClick={handleCartUpgrade}
                        className="btn-gold text-xs py-2 px-4 cursor-pointer"
                      >
                        Unlock ($50 CAD) →
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── TAB 4: MASTERY CURRICULUM ───────────────────────────────────── */}
      {activeTab === "curriculum" && (
        <section className="space-y-8 animate-fade-up">
          <div className="space-y-2">
            <span className="eyebrow">Interactive Curriculum</span>
            <h2 className="font-serif text-3xl text-ink font-medium">The Sovereign Operator Mastery Academy</h2>
            <p className="text-sm text-muted max-w-2xl">
              Eight comprehensive architectural modules. Each completed module awards +50 Gamification Points to your rank.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
            {/* Active Module Details */}
            <div className="card p-8 border-gold/40 bg-charcoal space-y-6 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-gold uppercase tracking-widest font-semibold">
                  {modules[activeModuleIndex].sector}
                </span>
                <span className="font-mono text-faint">{modules[activeModuleIndex].duration}</span>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-3xl text-ink font-medium">
                  {modules[activeModuleIndex].title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {modules[activeModuleIndex].summary}
                </p>
              </div>

              {/* Lecture Screen */}
              <div className="rounded-2xl border border-line bg-obsidian p-8 text-center space-y-4 relative overflow-hidden shadow-inner">
                {!isPaid && !modules[activeModuleIndex].isFree ? (
                  <div className="space-y-3 py-4">
                    <span className="text-2xl">🔒</span>
                    <h4 className="font-serif text-xl text-ink">Module Locked</h4>
                    <p className="text-xs text-muted max-w-sm mx-auto">
                      Upgrade to the $50 CAD Sovereign Membership to unlock all 8 curriculum modules and 3 video calls.
                    </p>
                    <button
                      type="button"
                      onClick={handleCartUpgrade}
                      className="btn-gold text-xs py-2 px-5 cursor-pointer"
                    >
                      Unlock All Modules ($50 CAD) →
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="size-16 rounded-full bg-gold/15 border border-gold/50 text-gold flex items-center justify-center text-2xl mx-auto shadow-[0_0_20px_-3px_rgba(212,175,55,0.4)]">
                      ▶
                    </div>
                    <div className="space-y-1">
                      <p className="font-serif text-xl text-ink font-medium">
                        Mastery Audio &amp; Slide Lecture
                      </p>
                      <p className="font-mono text-xs text-muted">
                        Narrated by Jeremy Ashe · High-Definition Audio Master
                      </p>
                    </div>
                    <div className="flex items-center justify-center gap-4 text-xs font-mono text-faint pt-2">
                      <span>0:00 / {modules[activeModuleIndex].duration}</span>
                      <div className="h-1 w-48 rounded-full bg-line overflow-hidden">
                        <div className="h-full bg-gold w-1/3" />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Key Takeaways */}
              <div className="space-y-3 pt-4 border-t border-line">
                <h4 className="font-serif text-xl text-ink">Core Strategic Takeaways:</h4>
                <ul className="space-y-2 text-xs text-muted leading-relaxed">
                  {modules[activeModuleIndex].takeaways.map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <span className="text-gold font-bold">◆</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Completion Action */}
              <div className="pt-4 border-t border-line flex flex-wrap items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() =>
                    toggleModuleComplete(
                      modules[activeModuleIndex].id,
                      modules[activeModuleIndex].title
                    )
                  }
                  className={`btn-gold text-xs py-2.5 px-5 flex items-center gap-2 cursor-pointer shadow-sm ${
                    user.completedModules.includes(modules[activeModuleIndex].id)
                      ? "bg-emerald text-obsidian border-emerald"
                      : ""
                  }`}
                >
                  {user.completedModules.includes(modules[activeModuleIndex].id) ? (
                    <>
                      <span>✓</span> Completed (+50 Pts Earned)
                    </>
                  ) : (
                    <>
                      <span>○</span> Mark as Complete (+50 Pts)
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Playlist Sidebar */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-line">
                <span className="font-mono text-xs text-muted uppercase tracking-wider">
                  Modules
                </span>
                <span className="font-mono text-xs text-gold">
                  {completedCount} / {modules.length} Completed
                </span>
              </div>

              <div className="space-y-2">
                {modules.map((mod, idx) => {
                  const isCurrent = idx === activeModuleIndex;
                  const isDone = user.completedModules.includes(mod.id);
                  const locked = !isPaid && !mod.isFree;

                  return (
                    <button
                      key={mod.id}
                      type="button"
                      onClick={() => setActiveModuleIndex(idx)}
                      className={`w-full text-left p-4 rounded-xl border transition cursor-pointer flex items-start justify-between gap-3 ${
                        isCurrent
                          ? "border-gold bg-gold/10 text-ink shadow-[0_0_12px_rgba(212,175,55,0.2)]"
                          : "border-line bg-charcoal/60 text-muted hover:border-gold/40 hover:text-ink"
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[0.65rem] text-gold uppercase tracking-wider block">
                            Module {idx + 1} · {mod.duration}
                          </span>
                          {locked && (
                            <span className="text-[0.6rem] font-mono text-faint bg-obsidian px-1.5 rounded">
                              $50 CAD Tier
                            </span>
                          )}
                        </div>
                        <h4 className="font-serif text-sm font-medium text-ink line-clamp-1">
                          {mod.title.replace(/^Module \d+: /, "")}
                        </h4>
                      </div>

                      <div className="shrink-0 pt-1">
                        {isDone ? (
                          <span className="size-5 rounded-full bg-emerald text-obsidian flex items-center justify-center text-xs font-bold font-mono">
                            ✓
                          </span>
                        ) : (
                          <span className="size-5 rounded-full border border-line flex items-center justify-center text-[0.65rem] font-mono text-faint">
                            {idx + 1}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── TAB 5: INNER CIRCLE TRANSMISSIONS ───────────────────────────── */}
      {activeTab === "briefings" && (
        <section className="space-y-8 animate-fade-up">
          <div className="space-y-2">
            <span className="eyebrow">Confidential Field Notes</span>
            <h2 className="font-serif text-3xl text-ink font-medium">Inner Circle Private Briefings</h2>
            <p className="text-sm text-muted max-w-2xl">
              Tactical dispatches reserved for members. Reading briefings adds points to your account.
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                id: "ic-01",
                date: "October 14, 2026",
                title: "The Subtle Seduction of Artificial Urgency",
                readTime: "6 min read",
                author: "Jeremy Ashe",
                summary:
                  "Why high-functioning operators manufacture crisis to simulate purpose — and how to break the dopamine cycle before your nervous system shuts down.",
              },
              {
                id: "ic-02",
                date: "October 02, 2026",
                title: "When Words Decay: The Operational Pathology of Corporate Euphemisms",
                readTime: "8 min read",
                author: "Jeremy Ashe",
                summary:
                  "A private briefing dissecting how softening difficult truths inside leadership teams creates multi-million dollar blind spots.",
              },
            ].map((briefing) => (
              <article
                key={briefing.id}
                className="card p-8 border-line hover:border-gold/40 transition duration-300 space-y-4 bg-charcoal/80"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
                  <span className="text-faint font-mono">{briefing.date}</span>
                  <span className="text-faint font-mono">{briefing.readTime}</span>
                </div>
                <h3 className="font-serif text-2xl text-ink font-medium">{briefing.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{briefing.summary}</p>
                <div className="pt-4 border-t border-line flex items-center justify-between text-xs">
                  <span className="font-mono text-gold">By {briefing.author}</span>
                  <span className="text-emerald font-mono">Member Transmission Unlocked ✓</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* ── VIDEO CALL SCHEDULER MODAL ─────────────────────────────────── */}
      {bookingCallNumber !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian/80 backdrop-blur-md animate-fade-up">
          <div className="card p-8 max-w-lg w-full border-gold bg-charcoal space-y-6 relative shadow-2xl">
            <div className="flex items-center justify-between border-b border-line pb-4">
              <div className="space-y-1">
                <span className="font-mono text-xs text-gold uppercase tracking-widest font-bold">
                  Schedule Video Call #{bookingCallNumber}
                </span>
                <h3 className="font-serif text-2xl text-ink">30-Min Meeting with Jeremy Ashe</h3>
              </div>
              <button
                type="button"
                onClick={() => setBookingCallNumber(null)}
                className="text-muted hover:text-ink text-sm p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="font-mono text-xs text-muted block">Consultation Topic</label>
                <select
                  value={meetingTopic}
                  onChange={(e) => setMeetingTopic(e.target.value)}
                  className="w-full rounded-xl border border-line bg-obsidian px-4 py-2.5 text-xs text-ink focus:border-gold focus:outline-none"
                >
                  <option value="Energy & Time Calibration & Schedule Setup">Energy &amp; Time Calibration &amp; Schedule Setup</option>
                  <option value="80-Hour Work Month Operating Architecture">80-Hour Work Month Operating Architecture</option>
                  <option value="Enterprise Covenants & Trust Firewalls">Enterprise Covenants &amp; Trust Firewalls</option>
                  <option value="General Strategy & Philosophical Alignment">General Strategy &amp; Philosophical Alignment</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-xs text-muted block">Preferred Date</label>
                <input
                  type="date"
                  required
                  value={meetingDate}
                  onChange={(e) => setMeetingDate(e.target.value)}
                  className="w-full rounded-xl border border-line bg-obsidian px-4 py-2.5 text-xs text-ink focus:border-gold focus:outline-none"
                />
              </div>

              <div className="p-3 rounded-xl border border-line bg-obsidian/80 space-y-1 text-[0.72rem] text-muted">
                <p className="font-semibold text-ink">Google Meet Video Conferencing:</p>
                <p>Direct calendar invitation with video room link will be confirmed instantly. Deducts 1 of your 3 included membership call credits.</p>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="submit"
                  className="btn-gold flex-1 py-2.5 text-xs font-semibold cursor-pointer shadow-md"
                >
                  Confirm &amp; Book Video Call →
                </button>
                <button
                  type="button"
                  onClick={() => setBookingCallNumber(null)}
                  className="btn-ghost py-2.5 px-4 text-xs cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
