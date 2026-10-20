"use client";

import { useState } from "react";
import Link from "next/link";
import { useMember } from "@/context/MemberContext";
import { useCart } from "@/context/CartContext";

interface Props {
  initialMode?: "signin" | "signup";
}

interface QuestItem {
  id: string;
  title: string;
  description: string;
  points: number;
  category: "ACCOUNT" | "DISPATCH" | "ASSESSMENT" | "ACADEMY" | "MEMBERSHIP" | "ADVISORY";
  href?: string;
  referenceSlug?: string;
}

export default function MemberPortal({ initialMode = "signin" }: Props) {
  const {
    user,
    isAuthenticated,
    isLoading,
    login,
    loginWithDemo,
    signup,
    updateUserProfile,
    logout,
    toggleModuleComplete,
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

  // Profile editing state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editError, setEditError] = useState("");
  const [editSaving, setEditSaving] = useState(false);

  // Active dashboard tab
  const [activeTab, setActiveTab] = useState<"gamification" | "vault" | "curriculum" | "meetings" | "briefings">("gamification");
  const [questCategoryFilter, setQuestCategoryFilter] = useState<string>("ALL");
  const [activeModuleIndex, setActiveModuleIndex] = useState<number>(0);

  // Booking modal state for the 3 video conferences
  const [bookingCallNumber, setBookingCallNumber] = useState<number | null>(null);
  const [meetingTopic, setMeetingTopic] = useState("Energy & Time Calibration & Schedule Setup");
  const [meetingDate, setMeetingDate] = useState("2026-10-22");

  const openProfileModal = () => {
    setEditName(user?.name === "Sovereign Operator" ? "Jeremy Ashe" : user?.name || "Jeremy Ashe");
    setEditEmail(
      user?.email?.includes("realityarchitecture.io")
        ? "jeremyashe@gmail.com"
        : user?.email || "jeremyashe@gmail.com"
    );
    setEditError("");
    setIsEditingProfile(true);
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditError("");
    setEditSaving(true);
    const res = await updateUserProfile(editName, editEmail);
    if (!res.success) {
      setEditError(res.error || "Could not update profile.");
    } else {
      setIsEditingProfile(false);
    }
    setEditSaving(false);
  };

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
        setAuthError(res.error || "Failed to initiate registration.");
      } else {
        // Automatically add $50 Sovereign Membership to cart and open checkout
        handleCartUpgrade();
      }
    }

    setAuthSubmitting(false);
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingCallNumber) return;

    bookMeetingCredit(bookingCallNumber, meetingTopic, meetingDate);

    // Asynchronously notify Jeremy Ashe via Resend
    import("@/lib/actions/operator.actions").then(({ recordVideoCallBookingAction }) => {
      recordVideoCallBookingAction({
        memberId: user?.name || user?.id || "Member",
        callNumber: bookingCallNumber,
        topic: meetingTopic,
        scheduledDate: meetingDate,
      }).catch((err) => console.warn("[Booking Notification Note]:", err));
    }).catch(() => {});

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
        "+250 Gamification Points & Sovereign Member Badge",
      ],
    });
    openCart();
  };

  // 8 Canonical Academy Modules
  const modules = [
    {
      id: "m1",
      moduleNumber: 1,
      title: "Master Lesson 1: The 80-Hour Work Month",
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
      moduleNumber: 2,
      title: "Master Lesson 2: The 10 Operational Firewalls",
      duration: "52 min",
      sector: "Business Systems",
      isFree: false,
      summary:
        "Architecting structural containment: installing ten mandatory safeguards against urgent client demands, scope creep, and executive organizational drift.",
      takeaways: [
        "Eliminating Shav (empty words) in team commitments and client agendas",
        "Building firewalls against Tachmod (coveting competitor roadmaps)",
        "Installing the weekly Sabbath shutdown firewall across executive teams",
      ],
    },
    {
      id: "m3",
      moduleNumber: 3,
      title: "Master Lesson 3: The 7-Fold Creation Matrix",
      duration: "64 min",
      sector: "Universal Law",
      isFree: false,
      summary:
        "The empirical architecture of creation: mapping Mentalism, Correspondence, Vibration, Polarity, Rhythm, Cause & Effect, and Generation to human life and enterprise.",
      takeaways: [
        "The principle of Correspondence: internal psychology mirrors external enterprise",
        "Harnessing Polarity to neutralize fear and emotional reactivity",
        "The law of Rhythm: timing cycles and refusing premature harvest panic",
      ],
    },
    {
      id: "m4",
      moduleNumber: 4,
      title: "Master Lesson 4: The Tripartite Vessel Diagnostic",
      duration: "45 min",
      sector: "Integration",
      isFree: false,
      summary:
        "Diagnostic precision: evaluating physical hardware (Body), mental software (Mind), and relational covenant integrity (Soul) without dogmatic moralizing.",
      takeaways: [
        "Detecting hidden pretenses before they cause systemic damage",
        "Why gut intuition without somatic regulation produces false positives",
        "The 3 non-negotiable questions to ask before signing any contract",
      ],
    },
    {
      id: "m5",
      moduleNumber: 5,
      title: "Master Lesson 5: Sealing Energy & Time Leaks",
      duration: "50 min",
      sector: "Energy & Body",
      isFree: false,
      summary:
        "Biological and cognitive containment: identifying high-performer leakage points, overthinking loops, and autonomic nervous system dysregulation.",
      takeaways: [
        "Vagus nerve resets to stop acute adrenaline dumps in high-stakes meetings",
        "Optimizing the 90-minute ultradian rhythm for deep execution",
        "Non-stimulant energy architecture for sustained afternoon clarity",
      ],
    },
    {
      id: "m6",
      moduleNumber: 6,
      title: "Master Lesson 6: Load-Bearing Social Covenants",
      duration: "58 min",
      sector: "Soul & Covenants",
      isFree: false,
      summary:
        "High-trust relational mechanics: transitioning partnerships from brittle extraction contracts to resilient, sovereign covenants built on foundational truth.",
      takeaways: [
        "The art of delivering a clean, unassailable 'no' with complete poise",
        "Distinguishing between mutual value creation vs parasitic extraction",
        "Auditing relational energy leaks across key partnerships",
      ],
    },
    {
      id: "m7",
      moduleNumber: 7,
      title: "Master Lesson 7: Sovereign Enterprise Economics",
      duration: "55 min",
      sector: "Economics",
      isFree: false,
      summary:
        "Building self-funding, zero-overhead business engines that nourish human flourishment rather than extracting vital energy.",
      takeaways: [
        "Fixed overhead elimination: operating without debt or venture shackles",
        "Pricing on value sovereignty rather than billable hours",
        "Structuring automated cash flow flywheels that respect founder health",
      ],
    },
    {
      id: "m8",
      moduleNumber: 8,
      title: "Master Lesson 8: Dynamic Equilibrium & Center Path",
      duration: "60 min",
      sector: "Dynamic Balance",
      isFree: false,
      summary:
        "The art of continuous micro-steering: holding polarity tension, refusing premature harvest panic, and executing master calibration routines that ensure permanent sovereignty.",
      takeaways: [
        "Mapping your next 90 days against universal laws",
        "Quarterly audit cadence: scoring Mind, Body, and Soul progress",
        "Sustaining dynamic balance through economic cycles and market transitions",
      ],
    },
  ];

  // Vault Items
  const vaultItems = [
    {
      id: "foundation-volume",
      title: "The Architecture of Reality",
      subtitle: "Foundation Volume · Bridging Universal Law & Sovereign Life",
      pages: "310 Pages · PDF Edition",
      badge: "Foundation Treatise",
      filename: "the-architecture-of-reality.pdf",
      isFree: true,
      description:
        "The foundational treatise bridging ancient wisdom with empirical physics. Redefines human misalignment as biological friction and lays out the 7-fold master code.",
    },
    {
      id: "master-blueprint",
      title: "Book I: The Master Blueprint",
      subtitle: "Full Unabridged Master Edition",
      pages: "264 Pages · PDF Edition",
      badge: "Book I Canon",
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
      badge: "Book II Canon",
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
      badge: "Book III Canon",
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

  // Canonical Quests Registry (categorized across all 6 core categories)
  const quests: QuestItem[] = [
    {
      id: "welcome_bonus",
      title: "Initialize Sovereign Identity",
      description: "Secure your personal operator handle and register in the digital vault.",
      points: 50,
      category: "ACCOUNT",
      href: "/members",
    },
    {
      id: "profile_calibrate",
      title: "Calibrate Vessel Bio & Operator Parameters",
      description: "Set your operator handle, timezone, and communication parameters.",
      points: 25,
      category: "ACCOUNT",
      href: "#profile",
    },
    {
      id: "read_blog_shav-empty-words",
      title: "Assimilate: Shav & False Speech",
      description: "Read Dispatch 01 exploring the biological and energetic cost of empty promises.",
      points: 25,
      category: "DISPATCH",
      href: "/news/shav-empty-words",
      referenceSlug: "shav-empty-words",
    },
    {
      id: "read_blog_khata-missing-mark",
      title: "Assimilate: Khata & Misalignment",
      description: "Read Dispatch 02 examining sin as practical mechanical friction outside design specs.",
      points: 25,
      category: "DISPATCH",
      href: "/news/khata-missing-mark",
      referenceSlug: "khata-missing-mark",
    },
    {
      id: "read_blog_dynamic-balance",
      title: "Assimilate: Dynamic Balance & Equilibrium",
      description: "Read Dispatch 03 detailing why static perfection fails and how to steer dynamically.",
      points: 25,
      category: "DISPATCH",
      href: "/news/dynamic-balance",
      referenceSlug: "dynamic-balance",
    },
    {
      id: "read_blog_tachmod-desire-firewall",
      title: "Assimilate: Tachmod, Desire & The 10th Firewall",
      description: "Understand the neuroscience of dopamine, comparison traps, and desire firewalls.",
      points: 25,
      category: "DISPATCH",
      href: "/news/tachmod-desire-firewall",
      referenceSlug: "tachmod-desire-firewall",
    },
    {
      id: "read_blog_mitzrayim-narrow-places",
      title: "Assimilate: Mitzrayim & The Neuroscience of Narrow Places",
      description: "Map the biological signature of threat-locked forcing modes in high-pressure seasons.",
      points: 25,
      category: "DISPATCH",
      href: "/news/mitzrayim-narrow-places",
      referenceSlug: "mitzrayim-narrow-places",
    },
    {
      id: "complete_energy_audit",
      title: "Complete 12-Question Energy Audit",
      description: "Complete the 3-sector diagnostic audit to uncover Forcing vs. Passive drift.",
      points: 75,
      category: "ASSESSMENT",
      href: "/audit",
    },
    {
      id: "complete_module_m1",
      title: "Master Lesson 1: The 80-Hour Work Month",
      description: "Complete the foundational calendar architecture module to shift to 20 hrs/week.",
      points: 50,
      category: "ACADEMY",
      href: "#curriculum",
    },
    {
      id: "complete_module_m2",
      title: "Master Lesson 2: The 10 Operational Firewalls",
      description: "Complete the lesson on installing hard organizational boundaries and covenants.",
      points: 50,
      category: "ACADEMY",
      href: "#curriculum",
    },
    {
      id: "upgrade_membership",
      title: "Activate Sovereign Membership ($50 CAD)",
      description: "Unlock full Vault, all 8 modules, and 3 video calls with Jeremy Ashe.",
      points: 250,
      category: "MEMBERSHIP",
      href: "#upgrade",
    },
    {
      id: "booked_call_1",
      title: "Schedule 1st Video Call with Jeremy",
      description: "Book your first 30-minute 1-on-1 strategy session on Google Meet.",
      points: 75,
      category: "ADVISORY",
      href: "#meetings",
    },
    {
      id: "submit_vetting_app",
      title: "Submit Founder Vetting Application",
      description: "Apply for bespoke systems advisory and private calendar access.",
      points: 100,
      category: "ADVISORY",
      href: "/meet",
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

  // ── UNAUTHENTICATED: SIGN IN / SIGN UP ──────────────────────────────
  if (!isAuthenticated || !user) {
    return (
      <div className="container-x py-16 lg:py-24 max-w-xl mx-auto animate-fade-up">
        <div className="card p-8 sm:p-12 border-gold/40 bg-gradient-to-b from-charcoal via-charcoal to-[#16130b] space-y-8 relative overflow-hidden shadow-[0_0_50px_-10px_rgba(212,175,55,0.2)]">
          <div className="pointer-events-none absolute -top-24 -right-24 size-64 rounded-full bg-gold/15 blur-3xl" />

          {/* Header */}
          <div className="text-center space-y-3 relative">
            <div className="mx-auto size-14 rounded-2xl border border-gold/50 bg-gold/10 text-gold flex items-center justify-center text-2xl shadow-[0_0_20px_-3px_rgba(212,175,55,0.4)]">
              🔒
            </div>
            <span className="eyebrow block">Sovereign Member Sanctuary</span>
            <h1 className="font-serif text-3xl sm:text-4xl text-ink font-medium">
              {mode === "signin" ? (
                <>Member <span className="text-gradient-gold italic">Sign In</span></>
              ) : (
                <>Join <span className="text-gradient-gold italic">Sovereign Membership</span></>
              )}
            </h1>
            <p className="text-xs sm:text-sm text-muted leading-relaxed max-w-md mx-auto">
              {mode === "signin"
                ? "Enter your credentials to access your private video conferences, 8-module curriculum, and unabridged vault."
                : "Membership is exclusive to Sovereign Operators ($50 CAD). Includes three private 1-on-1 video calls with Jeremy Ashe and full curriculum access."}
            </p>
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
              className={`py-2.5 text-xs font-mono tracking-wider rounded-lg transition cursor-pointer ${
                mode === "signin"
                  ? "bg-gold text-obsidian font-bold shadow-sm"
                  : "text-muted hover:text-ink"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              id="auth-tab-signup"
              onClick={() => {
                setMode("signup");
                setAuthError("");
              }}
              className={`py-2.5 text-xs font-mono tracking-wider rounded-lg transition cursor-pointer ${
                mode === "signup"
                  ? "bg-gold text-obsidian font-bold shadow-sm"
                  : "text-muted hover:text-ink"
              }`}
            >
              Join ($50 CAD)
            </button>
          </div>

          {/* Deliverables Box on Join Tab */}
          {mode === "signup" && (
            <div className="p-4 rounded-xl border border-gold/40 bg-gold/5 space-y-2.5 text-xs">
              <span className="font-mono text-[0.65rem] text-gold uppercase tracking-wider font-bold block">
                ⚡ What You Unlock ($50 CAD One-Time):
              </span>
              <ul className="space-y-1.5 text-ink/90">
                <li className="flex items-center gap-2">
                  <span className="text-gold font-bold">✓</span>
                  <span><strong>Three (3) 30-min 1-on-1 Video Conferences</strong> with Jeremy Ashe</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gold font-bold">✓</span>
                  <span><strong>Full 8-Module Video Curriculum</strong> (80-Hour Work Month &amp; Firewalls)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gold font-bold">✓</span>
                  <span><strong>Unabridged Digital PDF Vault</strong> (All 4 Manuscripts)</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-gold font-bold">✓</span>
                  <span><strong>500 Bonus Points</strong> &amp; Sovereign Operator Status</span>
                </li>
              </ul>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            {authError && (
              <div className="p-3.5 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-300 text-xs leading-relaxed space-y-2">
                <p>{authError}</p>
                {authError.includes("unlock") && (
                  <button
                    type="button"
                    onClick={handleCartUpgrade}
                    className="text-gold underline hover:text-gold-bright font-mono text-[11px] block cursor-pointer"
                  >
                    Unlock Sovereign Membership ($50 CAD) Now →
                  </button>
                )}
              </div>
            )}

            {mode === "signup" && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-mono text-[0.68rem] text-muted block uppercase tracking-wider">
                    Chosen Member User ID (Your Name)
                  </label>
                  <span className="font-mono text-[0.62rem] text-gold font-bold">
                    Unique · No duplicates allowed
                  </span>
                </div>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (authError) setAuthError("");
                  }}
                  placeholder="e.g. Jeremy Ashe"
                  className="w-full rounded-xl border border-line bg-obsidian px-4 py-2.5 text-xs text-ink placeholder:text-faint focus:border-gold focus:outline-none transition"
                />
              </div>
            )}

            <div className="space-y-1">
              <label className="font-mono text-[0.68rem] text-muted block uppercase tracking-wider">
                {mode === "signin" ? "Member User ID or Email Address" : "Email Address"}
              </label>
              <input
                type={mode === "signin" ? "text" : "email"}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={mode === "signin" ? "e.g. Jeremy Ashe or member@domain.com" : "member@domain.com"}
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

            {/* BC PIPA Statutory Notice */}
            <div className="p-3 rounded-xl border border-line bg-obsidian/70 space-y-1 text-left">
              <div className="flex items-center gap-1.5 text-gold font-mono text-[0.6rem] uppercase tracking-wider font-semibold">
                <span>🛡️</span>
                <span>BC PIPA Privacy Notice</span>
              </div>
              <p className="text-[0.62rem] text-muted leading-relaxed">
                Your Member ID and email are collected pursuant to British Columbia&apos;s <em>Personal Information Protection Act</em> solely to authenticate access to your member dashboard, track curriculum progress, and allocate video conference credits. Data is held in strict confidence. Read our{' '}
                <Link href="/privacy" className="text-gold underline hover:text-gold-bright">
                  Privacy Policy
                </Link>.
              </p>
            </div>

            <button
              type="submit"
              id="member-submit-auth-btn"
              disabled={authSubmitting}
              className="btn-gold w-full py-3.5 text-xs font-semibold cursor-pointer shadow-lg disabled:opacity-50 mt-2"
            >
              {authSubmitting
                ? "Securing Channel…"
                : mode === "signin"
                ? "Enter Sovereign Member Portal →"
                : "Proceed to Secure Stripe Checkout ($50 CAD) →"}
            </button>
          </form>

          {/* Test Preview Demo (for development verification) */}
          <div className="pt-2 text-center space-y-2 border-t border-line text-xs text-muted">
            <button
              type="button"
              onClick={() => loginWithDemo(true)}
              className="font-mono text-[0.68rem] text-muted hover:text-gold transition cursor-pointer"
            >
              ⚡ Instant Developer Preview (Marcus Sterling Paid Session)
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── AUTHENTICATED: MEMBER DASHBOARD ────────────────────────────────────
  const userRankInfo = getUserRank(user.points);
  const isPaid = user.tier === "paid";
  const completedCount = user.completedModules?.length || 0;
  const progressPercent = Math.min(100, Math.max(1, (user.points / 10000) * 100));

  const filteredQuests = questCategoryFilter === "ALL"
    ? quests
    : quests.filter((q) => q.category === questCategoryFilter);

  return (
    <div className="container-x py-12 lg:py-16 space-y-10">
      {/* ── TOP BANNER: MEMBER PROFILE & 10,000 PT PROGRESSION ───────────── */}
      <div className="card p-6 sm:p-8 border-gold/40 bg-gradient-to-r from-charcoal via-charcoal to-[#1a170e] flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="pointer-events-none absolute -right-24 -bottom-24 size-72 rounded-full bg-gold/10 blur-3xl" />

        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <span className={`size-2 rounded-full ${isPaid ? "bg-emerald" : "bg-gold"} animate-pulse-gold`} />
            <span className="font-mono text-xs uppercase tracking-widest text-gold font-bold">
              {isPaid ? "⚡ Sovereign Member ($50 CAD Tier)" : "Free Account"}
            </span>
            <span className={`px-2.5 py-0.5 rounded-full font-mono text-xs font-semibold border ${userRankInfo.badgeBg} ${userRankInfo.badgeBorder} ${userRankInfo.badgeColor}`}>
              {userRankInfo.rank}
            </span>
            <span className="bg-gold/20 border border-gold/40 text-gold px-2.5 py-0.5 rounded-full font-mono text-xs font-bold">
              ⭐ {user.points} / 10,000 pts
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl text-ink font-medium">
            Welcome back, <span className="text-gradient-gold italic">{user.name}</span>
          </h1>

          <p className="text-xs sm:text-sm text-muted">
            User ID: <span className="font-mono text-gold font-bold">{user.id}</span> · Joined {user.memberSince} · {user.email}
          </p>
        </div>

        {/* Member Actions */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("meetings")}
            className="btn-gold text-xs px-4 py-2.5 flex items-center gap-2 shadow-md cursor-pointer"
          >
            <span>📹</span> {user.meetingCreditsRemaining} Video Calls Remaining
          </button>

          <button
            type="button"
            onClick={openProfileModal}
            className="btn-ghost text-xs py-2 px-3.5 text-muted hover:text-gold border border-line hover:border-gold/50 cursor-pointer flex items-center gap-1.5"
          >
            <span>✏️</span> Edit Profile
          </button>

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

      {/* ── 10,000 POINT PROGRESSION CEILING & 4-TIER MILESTONE GAUGE ───── */}
      <div className="card p-6 border-gold/30 bg-charcoal/80 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="font-mono text-[0.65rem] text-gold uppercase tracking-wider block font-semibold">
              Sovereign Progression Engine &middot; 10,000 PT Master Scale
            </span>
            <h3 className="font-serif text-2xl text-ink font-medium">
              Current Rank: <span className={userRankInfo.badgeColor}>{userRankInfo.rank}</span>
            </h3>
          </div>
          <div className="text-right sm:space-y-1">
            <p className="font-mono text-sm text-gold font-bold">
              {user.points} <span className="text-muted text-xs font-normal">/ 10,000 Total Points ({progressPercent.toFixed(1)}%)</span>
            </p>
            {userRankInfo.pointsToNext > 0 ? (
              <p className="font-mono text-[0.68rem] text-faint">
                {userRankInfo.pointsToNext} pts to {userRankInfo.nextRank}
              </p>
            ) : (
              <p className="font-mono text-[0.68rem] text-emerald font-semibold">Highest Sovereign Rank Unlocked ✓</p>
            )}
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="h-2.5 w-full bg-obsidian rounded-full overflow-hidden border border-line relative">
          <div
            className="h-full bg-gradient-to-r from-gold-deep via-gold to-emerald transition-all duration-700 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* 4 Rank Tier Badges & Thresholds */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
          <div className={`p-3 rounded-xl border text-xs transition ${
            user.points < 500
              ? "border-slate-400/50 bg-slate-500/10 text-slate-200 ring-1 ring-slate-400/30"
              : "border-line bg-obsidian/60 text-muted opacity-80"
          }`}>
            <span className="font-mono text-[0.6rem] text-slate-400 uppercase tracking-wider block font-semibold">
              Tier I &middot; 0–499 pts
            </span>
            <h5 className="font-serif text-sm font-medium text-slate-100">Initiate</h5>
            <span className="font-mono text-[0.62rem] text-faint block mt-1">Foundation Alignment</span>
          </div>

          <div className={`p-3 rounded-xl border text-xs transition ${
            user.points >= 500 && user.points < 2000
              ? "border-amber-500/50 bg-amber-500/10 text-amber-200 ring-1 ring-amber-500/30"
              : "border-line bg-obsidian/60 text-muted opacity-80"
          }`}>
            <span className="font-mono text-[0.6rem] text-amber-400 uppercase tracking-wider block font-semibold">
              Tier II &middot; 500–1,999 pts
            </span>
            <h5 className="font-serif text-sm font-medium text-amber-200">Apprentice Builder</h5>
            <span className="font-mono text-[0.62rem] text-faint block mt-1">Systems Installation</span>
          </div>

          <div className={`p-3 rounded-xl border text-xs transition ${
            user.points >= 2000 && user.points < 5000
              ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-200 ring-1 ring-emerald-500/30"
              : "border-line bg-obsidian/60 text-muted opacity-80"
          }`}>
            <span className="font-mono text-[0.6rem] text-emerald-400 uppercase tracking-wider block font-semibold">
              Tier III &middot; 2,000–4,999 pts
            </span>
            <h5 className="font-serif text-sm font-medium text-emerald-200">Systems Architect</h5>
            <span className="font-mono text-[0.62rem] text-faint block mt-1">Dynamic Equilibrium</span>
          </div>

          <div className={`p-3 rounded-xl border text-xs transition ${
            user.points >= 5000
              ? "border-gold/60 bg-gold/15 text-gold ring-1 ring-gold/40"
              : "border-line bg-obsidian/60 text-muted opacity-80"
          }`}>
            <span className="font-mono text-[0.6rem] text-gold uppercase tracking-wider block font-semibold">
              Tier IV &middot; 5,000–10,000+ pts
            </span>
            <h5 className="font-serif text-sm font-medium text-gradient-gold">Sovereign Master</h5>
            <span className="font-mono text-[0.62rem] text-faint block mt-1">Full Ecosystem Mastery</span>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="card p-6 sm:p-8 max-w-md w-full border-gold/70 bg-gradient-to-b from-[#141820] to-obsidian space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-line pb-3">
              <h3 className="font-serif text-xl text-ink font-medium">Update Member Profile</h3>
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="text-muted hover:text-ink text-sm cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            {editError && (
              <div className="p-3 rounded-lg border border-rose-500/40 bg-rose-500/10 text-rose-300 text-xs leading-relaxed">
                {editError}
              </div>
            )}

            <form onSubmit={handleProfileSave} className="space-y-4">
              <div className="space-y-1">
                <label className="font-mono text-[0.68rem] text-muted block uppercase tracking-wider">
                  Member User ID (Your Unique Name)
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="e.g. Jeremy Ashe"
                  className="w-full rounded-xl border border-line bg-obsidian px-4 py-2.5 text-xs text-ink placeholder:text-faint focus:border-gold focus:outline-none transition"
                />
              </div>

              <div className="space-y-1">
                <label className="font-mono text-[0.68rem] text-muted block uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  placeholder="e.g. jeremyashe@gmail.com"
                  className="w-full rounded-xl border border-line bg-obsidian px-4 py-2.5 text-xs text-ink placeholder:text-faint focus:border-gold focus:outline-none transition"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-line">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="btn-ghost text-xs py-2 px-3.5 text-muted hover:text-ink cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editSaving}
                  className="btn-gold text-xs py-2 px-5 font-semibold cursor-pointer shadow-md disabled:opacity-50"
                >
                  {editSaving ? "Saving…" : "Save & Update Profile →"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── PAID TIER UPGRADE BANNER (IF FREE USER) ────────────────────── */}
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
                Upgrading to the <strong className="text-gold">$50 CAD Sovereign Membership</strong> gives you <strong className="text-ink">three (3) 30-minute 1-on-1 video conference calls with Jeremy Ashe</strong>, complete unabridged PDF access to all four books, and all 8 mastery modules.
              </p>
              <ul className="grid sm:grid-cols-2 gap-2 pt-2 text-xs text-faint">
                <li className="flex items-center gap-2 text-ink">
                  <span className="text-gold font-bold">✓</span> 3 × 30-Min Video Calls with Jeremy Ashe (Google Meet)
                </li>
                <li className="flex items-center gap-2 text-ink">
                  <span className="text-gold font-bold">✓</span> Full PDF downloads of Foundation Volume &amp; Books I, II, III
                </li>
                <li className="flex items-center gap-2 text-ink">
                  <span className="text-gold font-bold">✓</span> All 8 Mastery Curriculum video/audio lessons
                </li>
                <li className="flex items-center gap-2 text-ink">
                  <span className="text-gold font-bold">✓</span> +250 Gamification Bonus Points &amp; Sovereign Badge
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
            </div>
          </div>
        </div>
      )}

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
          ⭐ Quests &amp; Tasks ({user.completedTasks.length}/{quests.length})
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
          🎙️ Inner Circle Transmissions
        </button>
      </div>

      {/* ── TAB 1: GAMIFICATION QUEST LOG & TASKS ───────────────────────── */}
      {activeTab === "gamification" && (
        <section className="space-y-6 animate-fade-up">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="eyebrow">Interactive Progression</span>
              <h2 className="font-serif text-3xl text-ink font-medium">Sovereign Quest Log &amp; Tasks</h2>
              <p className="text-sm text-muted max-w-2xl">
                Complete quests across the platform to earn points and level up your rank toward Sovereign Master. Reading dispatches with the 15-second sentinel, completing audits, and mastering lessons award points automatically.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-obsidian border border-line">
              {["ALL", "ACCOUNT", "DISPATCH", "ASSESSMENT", "ACADEMY", "MEMBERSHIP", "ADVISORY"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setQuestCategoryFilter(cat)}
                  className={`px-2.5 py-1 text-[0.65rem] font-mono rounded-lg transition cursor-pointer ${
                    questCategoryFilter === cat
                      ? "bg-gold text-obsidian font-bold"
                      : "text-muted hover:text-ink"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {filteredQuests.map((quest) => {
              const isDone = user.completedTasks.includes(quest.id) ||
                (quest.referenceSlug && user.completedTasks.includes(`read_${quest.referenceSlug}`));

              return (
                <div
                  key={quest.id}
                  className={`card p-5 border transition flex items-start justify-between gap-4 ${
                    isDone
                      ? "card-completed"
                      : "border-line bg-charcoal/70 hover:border-gold/50"
                  }`}
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[0.62rem] text-gold uppercase tracking-wider bg-gold/10 px-2 py-0.5 rounded border border-gold/20">
                        {quest.category}
                      </span>
                      <span className="font-mono text-xs font-bold text-gold">
                        +{quest.points} pts
                      </span>
                      {isDone && (
                        <span className="font-mono text-[0.6rem] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 font-semibold">
                          Verified ✓
                        </span>
                      )}
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
                              if (quest.href === "#profile") openProfileModal();
                            }}
                            className="text-gold font-mono text-xs hover:underline inline-flex items-center gap-1 cursor-pointer"
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
                      <span className="size-6 rounded-full bg-emerald text-obsidian flex items-center justify-center font-bold text-xs font-mono shadow-sm">
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
            <span className="eyebrow">Video Conferencing Allowance</span>
            <h2 className="font-serif text-3xl text-ink font-medium">Three 30-Minute Video Calls with Jeremy Ashe</h2>
            <p className="text-sm text-muted max-w-2xl">
              Included with the $50 Sovereign Member Access. Schedule three dedicated 30-minute 1-on-1 strategy sessions on Google Meet to calibrate your energy scores, structure your 80-hour work month, or review enterprise covenants.
            </p>
          </div>

          <div className="space-y-6">
            <div className="p-4 rounded-xl border border-emerald/40 bg-emerald/10 text-emerald text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
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
                        ? "card-completed"
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
                            className="btn-gold w-full text-center text-xs py-2 block font-semibold cursor-pointer shadow"
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
                          className="btn-gold w-full text-center text-xs py-2.5 font-semibold cursor-pointer shadow"
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
                  {isPaid || item.isFree ? (
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

      {/* ── TAB 4: MASTERY CURRICULUM (8 MODULES) ───────────────────────── */}
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
                <span className="font-mono text-xs text-gold font-semibold">
                  {completedCount} / {modules.length} Completed
                </span>
              </div>

              <div className="space-y-2">
                {modules.map((mod, idx) => {
                  const isCurrent = idx === activeModuleIndex;
                  const isDone = user.completedModules.includes(mod.id);

                  return (
                    <button
                      key={mod.id}
                      type="button"
                      onClick={() => setActiveModuleIndex(idx)}
                      className={`w-full text-left p-4 rounded-xl border transition cursor-pointer flex items-start justify-between gap-3 ${
                        isCurrent
                          ? "border-gold bg-gold/10 text-ink shadow-[0_0_12px_rgba(212,175,55,0.2)]"
                          : isDone
                          ? "card-completed text-muted hover:text-ink"
                          : "border-line bg-charcoal/60 text-muted hover:border-gold/40 hover:text-ink"
                      }`}
                    >
                      <div className="space-y-1">
                        <span className="font-mono text-[0.65rem] text-gold uppercase tracking-wider block">
                          Module {idx + 1} · {mod.duration}
                        </span>
                        <h4 className="font-serif text-sm font-medium text-ink line-clamp-1">
                          {mod.title.replace(/^Master Lesson \d+: /, "")}
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
                <h3 className="font-serif text-2xl text-ink">30-Min Strategy Call with Jeremy Ashe</h3>
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
