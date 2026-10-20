'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useMember } from '@/context/MemberContext';
import type { ActivityLog, VideoCallBooking } from '@/lib/supabase/types';
import type { DispatchArticle } from '@/lib/types';
import {
  type AdminMemberRecord,
  updateMemberOperatorNotes,
  sendTestPingEmailAction,
  authenticateOperatorAction,
  lockOperatorVaultAction,
} from '@/lib/actions/operator.actions';
import {
  saveDispatchAction,
  deleteDispatchAction,
  updateSiteSettingsAction,
  type SiteSettings,
  type DispatchInput,
} from '@/lib/actions/content.actions';

interface OperatorVaultProps {
  initialMembers: AdminMemberRecord[];
  initialActivityLogs: ActivityLog[];
  initialBookings: VideoCallBooking[];
  initialDispatches: DispatchArticle[];
  initialSiteSettings: SiteSettings;
  initialUnlocked?: boolean;
}

export default function OperatorVault({
  initialMembers,
  initialActivityLogs,
  initialBookings,
  initialDispatches,
  initialSiteSettings,
  initialUnlocked = false,
}: OperatorVaultProps) {
  const { user } = useMember();

  // Authentication & Clearance State
  const [isUnlocked, setIsUnlocked] = useState(initialUnlocked);
  const [passphraseInput, setPassphraseInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [submittingAuth, setSubmittingAuth] = useState(false);

  // Hydrate clearance
  useEffect(() => {
    if (initialUnlocked) {
      setIsUnlocked(true);
    } else if (user?.email?.toLowerCase() === 'jeremyashe@gmail.com' || user?.role === 'operator') {
      setIsUnlocked(true);
    }
  }, [initialUnlocked, user]);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passphraseInput.trim()) return;

    setAuthError('');
    setSubmittingAuth(true);

    const res = await authenticateOperatorAction(passphraseInput);
    if (res.success) {
      setIsUnlocked(true);
      window.location.reload();
    } else {
      setAuthError(res.error || 'Access denied: Invalid operator authorization credentials.');
    }
    setSubmittingAuth(false);
  };

  const handleLock = async () => {
    setIsUnlocked(false);
    await lockOperatorVaultAction();
    window.location.reload();
  };

  // Vault tabs
  const [activeTab, setActiveTab] = useState<'members' | 'radar' | 'content' | 'settings' | 'email'>('members');

  // Member Surveillance State
  const [members, setMembers] = useState<AdminMemberRecord[]>(initialMembers);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState<AdminMemberRecord | null>(null);
  const [operatorNotesText, setOperatorNotesText] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesFeedback, setNotesFeedback] = useState<string | null>(null);

  // Content Studio State (Dispatches)
  const [dispatches, setDispatches] = useState<DispatchArticle[]>(initialDispatches);
  const [isEditingDispatch, setIsEditingDispatch] = useState(false);
  const [dispatchForm, setDispatchForm] = useState<DispatchInput>({
    slug: '',
    title: '',
    summary: '',
    category: 'Dispatch',
    readTime: '6 min read',
    hebrew: '',
    transliteration: '',
    content: '',
  });
  const [savingDispatch, setSavingDispatch] = useState(false);
  const [dispatchFeedback, setDispatchFeedback] = useState<string | null>(null);

  // Site Settings State
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(initialSiteSettings);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsFeedback, setSettingsFeedback] = useState<string | null>(null);

  // Email System State
  const [testEmailSending, setTestEmailSending] = useState(false);
  const [testEmailResult, setTestEmailResult] = useState<{ success?: boolean; messageId?: string; error?: string } | null>(null);

  // Member search filtering
  const filteredMembers = members.filter((m) => {
    const q = searchQuery.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.id.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.rank.toLowerCase().includes(q)
    );
  });

  // Select member to inspect
  const handleSelectMember = (member: AdminMemberRecord) => {
    setSelectedMember(member);
    setOperatorNotesText(member.operatorNotes || '');
    setNotesFeedback(null);
  };

  // Save notes for selected member
  const handleSaveNotes = async () => {
    if (!selectedMember) return;
    setSavingNotes(true);
    setNotesFeedback(null);
    const res = await updateMemberOperatorNotes(selectedMember.id, operatorNotesText);
    if (res.success) {
      setMembers((prev) =>
        prev.map((m) => (m.id === selectedMember.id ? { ...m, operatorNotes: operatorNotesText } : m))
      );
      setSelectedMember((prev) => (prev ? { ...prev, operatorNotes: operatorNotesText } : null));
      setNotesFeedback('Confidential notes saved to vessel profile.');
    } else {
      setNotesFeedback(res.error || 'Failed to save notes.');
    }
    setSavingNotes(false);
  };

  // Content Dispatch Actions
  const handleNewDispatch = () => {
    setDispatchForm({
      slug: '',
      title: '',
      summary: '',
      category: 'Dispatch',
      readTime: '6 min read',
      hebrew: '',
      transliteration: '',
      content: '## Executive Signal\n\nWrite transmission content here...\n\n### Operational Law\n\nDefine the actionable principle...',
    });
    setDispatchFeedback(null);
    setIsEditingDispatch(true);
  };

  const handleEditDispatch = (article: DispatchArticle) => {
    setDispatchForm({
      slug: article.slug,
      title: article.title,
      summary: article.summary,
      category: article.category,
      readTime: article.readTime,
      hebrew: article.hebrew || '',
      transliteration: article.transliteration || '',
      content: article.content,
    });
    setDispatchFeedback(null);
    setIsEditingDispatch(true);
  };

  const handleSaveDispatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingDispatch(true);
    setDispatchFeedback(null);
    const res = await saveDispatchAction(dispatchForm);
    if (res.success && res.slug) {
      setDispatches((prev) => {
        const idx = prev.findIndex((d) => d.slug === res.slug);
        const updatedItem: DispatchArticle = {
          slug: res.slug!,
          title: dispatchForm.title,
          summary: dispatchForm.summary,
          category: dispatchForm.category,
          readTime: dispatchForm.readTime,
          publishedAt: new Date().toISOString().split('T')[0],
          hebrew: dispatchForm.hebrew,
          transliteration: dispatchForm.transliteration,
          content: dispatchForm.content,
        };
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = updatedItem;
          return next;
        }
        return [updatedItem, ...prev];
      });
      setDispatchFeedback(`Dispatch "${res.slug}" published successfully.`);
      setTimeout(() => setIsEditingDispatch(false), 800);
    } else {
      setDispatchFeedback(res.error || 'Failed to publish dispatch.');
    }
    setSavingDispatch(false);
  };

  const handleDeleteDispatch = async (slug: string) => {
    if (!confirm(`Are you sure you want to permanently delete dispatch "${slug}"?`)) return;
    const res = await deleteDispatchAction(slug);
    if (res.success) {
      setDispatches((prev) => prev.filter((d) => d.slug !== slug));
    }
  };

  // Site Settings Save
  const handleSaveSiteSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsFeedback(null);
    const res = await updateSiteSettingsAction(siteSettings);
    if (res.success) {
      setSettingsFeedback('Site settings and announcement banner updated across the web platform.');
    } else {
      setSettingsFeedback(res.error || 'Failed to update settings.');
    }
    setSavingSettings(false);
  };

  // Test Email Ping
  const handleSendTestPing = async () => {
    setTestEmailSending(true);
    setTestEmailResult(null);
    const res = await sendTestPingEmailAction();
    setTestEmailResult(res);
    setTestEmailSending(false);
  };

  // ── LOCKED VAULT GATE SCREEN ──────────────────────────────────────────
  if (!isUnlocked) {
    return (
      <div className="container-x py-20 lg:py-28 max-w-lg mx-auto animate-fade-up">
        <div className="card p-8 sm:p-12 border-gold/50 bg-gradient-to-b from-[#11141c] via-[#0d0f14] to-[#07080a] space-y-8 relative overflow-hidden shadow-[0_0_60px_-10px_rgba(212,175,55,0.25)]">
          <div className="pointer-events-none absolute -top-20 -right-20 size-60 rounded-full bg-gold/15 blur-3xl" />

          <div className="text-center space-y-3 relative">
            <div className="mx-auto size-16 rounded-2xl border border-gold/60 bg-gold/10 text-gold flex items-center justify-center text-3xl shadow-[0_0_25px_-5px_rgba(212,175,55,0.4)]">
              ⚡
            </div>
            <span className="eyebrow block">High Clearance Terminal</span>
            <h1 className="font-serif text-3xl sm:text-4xl text-ink font-medium">
              Sovereign <span className="text-gradient-gold italic">Operator Vault</span>
            </h1>
            <p className="text-xs sm:text-sm text-muted leading-relaxed">
              Restricted to <strong className="text-ink">Jeremy Ashe</strong>. Root access to monitor member progression, update live canon, and supervise telemetry.
            </p>
          </div>

          <form onSubmit={handleUnlock} className="space-y-4">
            {authError && (
              <div className="p-3 rounded-xl border border-rose-500/40 bg-rose-500/10 text-rose-300 text-xs">
                {authError}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="font-mono text-xs text-muted block uppercase tracking-wider">
                Operator Master Passkey
              </label>
              <input
                type="password"
                required
                value={passphraseInput}
                onChange={(e) => setPassphraseInput(e.target.value)}
                placeholder="Enter master passkey..."
                className="w-full rounded-xl border border-line bg-obsidian px-4 py-3 text-xs text-ink placeholder:text-faint focus:border-gold focus:outline-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={submittingAuth}
              className="btn-gold w-full py-3.5 text-xs font-semibold cursor-pointer shadow-lg disabled:opacity-50"
            >
              {submittingAuth ? 'Verifying Clearance…' : 'Authenticate Operator Clearance →'}
            </button>
          </form>

          {/* Secure Audit Notice */}
          <div className="pt-4 border-t border-line text-center space-y-1.5">
            <p className="font-mono text-[0.65rem] text-muted flex items-center justify-center gap-1.5">
              <span>🔒</span>
              <span>Sovereign Operator Clearance Terminal</span>
            </p>
            <p className="font-mono text-[0.62rem] text-faint max-w-xs mx-auto leading-relaxed">
              Protected under BC PIPA statutory safeguards. All authentication attempts are rate-limited and immutably audit-logged.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ── UNLOCKED OPERATOR VAULT ───────────────────────────────────────────
  return (
    <div className="container-x py-10 lg:py-14 space-y-8 animate-fade-up">
      {/* ── HEADER BANNER ────────────────────────────────────────────── */}
      <div className="card p-6 sm:p-8 border-gold/50 bg-gradient-to-r from-charcoal via-charcoal to-[#1a170e] flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="pointer-events-none absolute -right-20 -bottom-20 size-72 rounded-full bg-gold/15 blur-3xl" />

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald animate-pulse" />
            <span className="font-mono text-xs uppercase tracking-widest text-gold font-bold">
              Root Level Operator Clearance
            </span>
            <span className="text-faint font-mono text-xs">&middot; Jeremy Ashe Authorized</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-ink font-medium">
            Jeremy Ashe &middot; <span className="text-gradient-gold italic">Operator Command Vault</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted">
            Direct database surveillance, website content publishing, live activity radar, and Resend email alerts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <a
            href="/pdfs/The_Architecture_of_Reality_Operator_Manual.pdf"
            download="The_Architecture_of_Reality_Operator_Manual.pdf"
            className="btn-gold text-xs py-2 px-3.5 flex items-center gap-1.5 shadow-gold/20"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>📥</span>
            <span>Operator Manual (PDF)</span>
          </a>
          <a
            href="/pdfs/The_Architecture_of_Reality_AI_Operating_System_Manual.pdf"
            download="The_Architecture_of_Reality_AI_Operating_System_Manual.pdf"
            className="btn-gold text-xs py-2 px-3.5 flex items-center gap-1.5 shadow-gold/20"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>⚡</span>
            <span>AI Systems Manual (PDF)</span>
          </a>
          <Link
            href="/members"
            className="btn-ghost text-xs py-2 px-3.5 border border-line text-muted hover:text-gold"
          >
            Open Member View &rarr;
          </Link>
          <Link
            href="/admin"
            className="btn-ghost text-xs py-2 px-3.5 border border-line text-muted hover:text-gold"
          >
            Open Admin Overview &rarr;
          </Link>
          <button
            type="button"
            onClick={handleLock}
            className="btn-ghost text-xs py-2 px-3 text-faint hover:text-rose-400 cursor-pointer"
          >
            Lock Vault
          </button>
        </div>
      </div>

      {/* ── TOP STATS OVERVIEW ───────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card p-5 border-line bg-charcoal/80 space-y-1">
          <span className="font-mono text-xs text-muted uppercase tracking-wider">Total Members Monitored</span>
          <p className="font-serif text-3xl font-bold text-ink">{members.length}</p>
          <span className="font-mono text-[0.65rem] text-gold">10,000 Pt Scale Active</span>
        </div>

        <div className="card p-5 border-emerald/40 bg-charcoal/80 space-y-1">
          <span className="font-mono text-xs text-emerald uppercase tracking-wider">Published Dispatches</span>
          <p className="font-serif text-3xl font-bold text-emerald">{dispatches.length}</p>
          <span className="font-mono text-[0.65rem] text-muted">Live on /news</span>
        </div>

        <div className="card p-5 border-gold/40 bg-charcoal/80 space-y-1">
          <span className="font-mono text-xs text-gold uppercase tracking-wider">Video Strategy Calls</span>
          <p className="font-serif text-3xl font-bold text-gold">{initialBookings.length}</p>
          <span className="font-mono text-[0.65rem] text-muted">Google Meet pipeline</span>
        </div>

        <div className="card p-5 border-line bg-charcoal/80 space-y-1">
          <span className="font-mono text-xs text-muted uppercase tracking-wider">Resend Email Status</span>
          <p className="font-serif text-2xl font-bold text-emerald-400 flex items-center gap-2">
            <span>●</span> Live &amp; Ready
          </p>
          <span className="font-mono text-[0.65rem] text-muted">Routing to jeremyashe@gmail.com</span>
        </div>
      </div>

      {/* ── VAULT NAVIGATION TABS ────────────────────────────────────── */}
      <div className="border-b border-line flex items-center gap-2 overflow-x-auto pb-px">
        <button
          type="button"
          onClick={() => setActiveTab('members')}
          className={`py-3 px-5 font-mono text-xs tracking-wider transition border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'members'
              ? 'border-gold text-gold font-bold bg-gold/5'
              : 'border-transparent text-muted hover:text-ink hover:border-line'
          }`}
        >
          👤 Member Intelligence ({members.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('radar')}
          className={`py-3 px-5 font-mono text-xs tracking-wider transition border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'radar'
              ? 'border-gold text-gold font-bold bg-gold/5'
              : 'border-transparent text-muted hover:text-ink hover:border-line'
          }`}
        >
          📡 Live Activity Radar ({initialActivityLogs.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('content')}
          className={`py-3 px-5 font-mono text-xs tracking-wider transition border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'content'
              ? 'border-gold text-gold font-bold bg-gold/5'
              : 'border-transparent text-muted hover:text-ink hover:border-line'
          }`}
        >
          ✍️ Content Studio &amp; Dispatches ({dispatches.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`py-3 px-5 font-mono text-xs tracking-wider transition border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'settings'
              ? 'border-gold text-gold font-bold bg-gold/5'
              : 'border-transparent text-muted hover:text-ink hover:border-line'
          }`}
        >
          📢 Global Site Announcement
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('email')}
          className={`py-3 px-5 font-mono text-xs tracking-wider transition border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'email'
              ? 'border-gold text-gold font-bold bg-gold/5'
              : 'border-transparent text-muted hover:text-ink hover:border-line'
          }`}
        >
          ✉️ Email Dispatches &amp; Test Handshake
        </button>
      </div>

      {/* ── TAB 1: MEMBER INTELLIGENCE & DOSSIER ─────────────────────── */}
      {activeTab === 'members' && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="eyebrow">Database Ledger</span>
              <h3 className="font-serif text-2xl sm:text-3xl text-ink font-medium">
                Member Surveillance &amp; Intelligence Ledger
              </h3>
              <p className="text-xs text-muted">
                Inspect registered member progression, track accumulated points against the 10,000 pt threshold, and append private diagnostic notes.
              </p>
            </div>

            <div className="w-full sm:w-72">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search member, email, rank..."
                className="w-full rounded-xl border border-line bg-charcoal px-4 py-2 text-xs text-ink placeholder:text-faint focus:border-gold focus:outline-none"
              />
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
            {/* Member List */}
            <div className="space-y-3">
              {filteredMembers.map((member) => {
                const isSelected = selectedMember?.id === member.id;

                return (
                  <div
                    key={member.id}
                    onClick={() => handleSelectMember(member)}
                    className={`card p-5 border transition cursor-pointer space-y-3 ${
                      isSelected
                        ? 'border-gold bg-gold/10 shadow-[0_0_15px_rgba(212,175,55,0.2)]'
                        : 'border-line bg-charcoal/80 hover:border-gold/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h4 className="font-serif text-lg font-medium text-ink">{member.name}</h4>
                          <span className={`px-2 py-0.5 rounded font-mono text-[0.62rem] border uppercase tracking-wider ${
                            member.rank === 'Sovereign Master' ? 'bg-gold/20 text-gold border-gold/40' :
                            member.rank === 'Systems Architect' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' :
                            member.rank === 'Apprentice Builder' ? 'bg-amber-500/20 text-amber-400 border-amber-500/40' :
                            'bg-slate-500/20 text-slate-300 border-slate-500/40'
                          }`}>
                            {member.rank}
                          </span>
                          <span className="px-2 py-0.5 rounded font-mono text-[0.6rem] bg-obsidian border border-line text-muted uppercase">
                            {member.tier === 'paid' ? '⚡ $50 Sovereign Tier' : 'Free Member'}
                          </span>
                        </div>
                        <p className="font-mono text-xs text-muted">
                          ID: <span className="text-gold font-bold">{member.id}</span> &middot; {member.email}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="font-mono text-sm font-bold text-gold">
                          {member.points} <span className="text-faint text-[0.65rem] font-normal">/ 10,000 pts</span>
                        </p>
                        <p className="font-mono text-[0.65rem] text-muted">
                          📹 {member.meetingCreditsRemaining} call credits
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-1.5 w-full bg-obsidian rounded-full overflow-hidden border border-line">
                      <div
                        className="h-full bg-gradient-to-r from-gold via-gold-bright to-emerald rounded-full"
                        style={{ width: `${Math.min(100, Math.max(1, (member.points / 10000) * 100))}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Member Dossier & Operator Notes */}
            <div className="card p-6 border-gold/40 bg-charcoal space-y-5 sticky top-24 self-start">
              {selectedMember ? (
                <>
                  <div className="border-b border-line pb-4 space-y-1">
                    <span className="font-mono text-[0.65rem] text-gold uppercase tracking-wider font-semibold block">
                      Vessel Dossier
                    </span>
                    <h3 className="font-serif text-2xl text-ink font-medium">
                      {selectedMember.name}
                    </h3>
                    <p className="font-mono text-xs text-muted">
                      Email: <a href={`mailto:${selectedMember.email}`} className="text-gold hover:underline">{selectedMember.email}</a>
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div className="p-3 rounded-lg border border-line bg-obsidian space-y-0.5">
                      <span className="font-mono text-[0.6rem] text-muted uppercase block">Rank Status</span>
                      <p className="font-serif text-base text-gold font-medium">{selectedMember.rank}</p>
                    </div>
                    <div className="p-3 rounded-lg border border-line bg-obsidian space-y-0.5">
                      <span className="font-mono text-[0.6rem] text-muted uppercase block">Sovereign Points</span>
                      <p className="font-serif text-base text-ink font-medium">{selectedMember.points} pts</p>
                    </div>
                    <div className="p-3 rounded-lg border border-line bg-obsidian space-y-0.5">
                      <span className="font-mono text-[0.6rem] text-muted uppercase block">Call Allowance</span>
                      <p className="font-serif text-base text-ink font-medium">{selectedMember.meetingCreditsRemaining} / 3 left</p>
                    </div>
                    <div className="p-3 rounded-lg border border-line bg-obsidian space-y-0.5">
                      <span className="font-mono text-[0.6rem] text-muted uppercase block">Joined Sanctuary</span>
                      <p className="font-serif text-base text-muted font-medium">{selectedMember.memberSince}</p>
                    </div>
                  </div>

                  {/* Private Operator Notes */}
                  <div className="space-y-2 pt-2 border-t border-line">
                    <div className="flex items-center justify-between">
                      <label className="font-mono text-xs text-gold uppercase tracking-wider font-semibold">
                        Private Operator Notes (Jeremy Ashe Only):
                      </label>
                      <span className="font-mono text-[0.62rem] text-faint">Confidential</span>
                    </div>

                    {notesFeedback && (
                      <div className="p-2.5 rounded-lg border border-gold/40 bg-gold/10 text-gold text-xs">
                        {notesFeedback}
                      </div>
                    )}

                    <textarea
                      rows={5}
                      value={operatorNotesText}
                      onChange={(e) => setOperatorNotesText(e.target.value)}
                      placeholder="Enter diagnostic assessments, calibration directives, or high-stakes founder observations..."
                      className="w-full rounded-xl border border-line bg-obsidian p-3 text-xs text-ink placeholder:text-faint focus:border-gold focus:outline-none leading-relaxed"
                    />

                    <button
                      type="button"
                      disabled={savingNotes}
                      onClick={handleSaveNotes}
                      className="btn-gold w-full py-2.5 text-xs font-semibold cursor-pointer shadow-md disabled:opacity-50"
                    >
                      {savingNotes ? 'Saving Notes…' : 'Save Confidential Notes →'}
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 space-y-2 text-muted">
                  <span className="text-3xl block">👤</span>
                  <p className="font-serif text-lg text-ink font-medium">Select a Member to Inspect</p>
                  <p className="text-xs max-w-xs mx-auto">
                    Click any member card on the left to review their complete score profile, call credits, and append operator notes.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── TAB 2: LIVE ACTIVITY RADAR ──────────────────────────────── */}
      {activeTab === 'radar' && (
        <section className="space-y-6">
          <div>
            <span className="eyebrow">Telemetry Stream</span>
            <h3 className="font-serif text-2xl sm:text-3xl text-ink font-medium">
              Live Operator Activity Radar
            </h3>
            <p className="text-xs text-muted">
              Chronological feed capturing user actions, quest completions, and energy audit submissions.
            </p>
          </div>

          <div className="card p-6 border-line bg-charcoal/80 space-y-4">
            <div className="divide-y divide-line">
              {initialActivityLogs.map((log) => {
                const date = new Date(log.created_at).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div key={log.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-faint">{date}</span>
                      <span className="size-1 rounded-full bg-line" />
                      <span className="font-mono text-gold font-semibold">{log.user_id}</span>
                      <span className="size-1 rounded-full bg-line" />
                      <span className="px-2 py-0.5 rounded font-mono text-[0.65rem] bg-obsidian border border-line text-ink">
                        {log.action_type.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>

                    <div className="font-mono text-xs text-muted">
                      {JSON.stringify(log.metadata).replace(/[{}"]/g, ' ')}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── TAB 3: CONTENT STUDIO & DISPATCHES ───────────────────────── */}
      {activeTab === 'content' && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="eyebrow">Editorial Canon</span>
              <h3 className="font-serif text-2xl sm:text-3xl text-ink font-medium">
                Content Studio &amp; Dispatches Publisher
              </h3>
              <p className="text-xs text-muted">
                Publish new articles, edit existing field notes, and update Hebrew root linguistic codes.
              </p>
            </div>

            <button
              type="button"
              onClick={handleNewDispatch}
              className="btn-gold py-2.5 px-5 text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-md"
            >
              <span>✍️</span> Publish New Dispatch &rarr;
            </button>
          </div>

          {dispatchFeedback && (
            <div className="p-3 rounded-xl border border-gold/40 bg-gold/10 text-gold text-xs">
              {dispatchFeedback}
            </div>
          )}

          {/* Dispatch Editor Modal / Drawer */}
          {isEditingDispatch && (
            <div className="card p-6 sm:p-8 border-gold bg-gradient-to-b from-[#141820] to-obsidian space-y-5 shadow-2xl">
              <div className="flex items-center justify-between border-b border-line pb-3">
                <h4 className="font-serif text-xl text-ink font-medium">
                  {dispatchForm.slug ? `Edit Dispatch: ${dispatchForm.slug}` : 'Create New Field Dispatch'}
                </h4>
                <button
                  type="button"
                  onClick={() => setIsEditingDispatch(false)}
                  className="text-muted hover:text-ink text-sm cursor-pointer p-1"
                >
                  ✕ Close
                </button>
              </div>

              <form onSubmit={handleSaveDispatch} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="font-mono text-xs text-muted block uppercase">Article Title</label>
                    <input
                      type="text"
                      required
                      value={dispatchForm.title}
                      onChange={(e) => setDispatchForm({ ...dispatchForm, title: e.target.value })}
                      placeholder="e.g. Shav: The Business Cost of Empty Words"
                      className="w-full rounded-xl border border-line bg-obsidian px-4 py-2.5 text-xs text-ink focus:border-gold focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-xs text-muted block uppercase">URL Slug</label>
                    <input
                      type="text"
                      required
                      value={dispatchForm.slug}
                      onChange={(e) => setDispatchForm({ ...dispatchForm, slug: e.target.value })}
                      placeholder="e.g. shav-empty-words"
                      className="w-full rounded-xl border border-line bg-obsidian px-4 py-2.5 text-xs text-ink focus:border-gold focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="font-mono text-xs text-muted block uppercase">Category</label>
                    <input
                      type="text"
                      value={dispatchForm.category}
                      onChange={(e) => setDispatchForm({ ...dispatchForm, category: e.target.value })}
                      placeholder="e.g. Linguistic Roots or Firewalls"
                      className="w-full rounded-xl border border-line bg-obsidian px-4 py-2.5 text-xs text-ink focus:border-gold focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-xs text-muted block uppercase">Hebrew Root (Optional)</label>
                    <input
                      type="text"
                      value={dispatchForm.hebrew}
                      onChange={(e) => setDispatchForm({ ...dispatchForm, hebrew: e.target.value })}
                      placeholder="e.g. שָׁוְא"
                      className="w-full rounded-xl border border-line bg-obsidian px-4 py-2.5 text-xs text-ink focus:border-gold focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-xs text-muted block uppercase">Transliteration (Optional)</label>
                    <input
                      type="text"
                      value={dispatchForm.transliteration}
                      onChange={(e) => setDispatchForm({ ...dispatchForm, transliteration: e.target.value })}
                      placeholder="e.g. Shav"
                      className="w-full rounded-xl border border-line bg-obsidian px-4 py-2.5 text-xs text-ink focus:border-gold focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-xs text-muted block uppercase">Executive Summary / Synopsis</label>
                  <textarea
                    rows={2}
                    required
                    value={dispatchForm.summary}
                    onChange={(e) => setDispatchForm({ ...dispatchForm, summary: e.target.value })}
                    placeholder="Brief 1-2 sentence lede summarizing the operational principle..."
                    className="w-full rounded-xl border border-line bg-obsidian p-3 text-xs text-ink focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono text-xs text-muted block uppercase">Markdown Article Content</label>
                  <textarea
                    rows={10}
                    required
                    value={dispatchForm.content}
                    onChange={(e) => setDispatchForm({ ...dispatchForm, content: e.target.value })}
                    placeholder="Write article in standard Markdown..."
                    className="w-full rounded-xl border border-line bg-obsidian p-3 font-mono text-xs text-ink focus:border-gold focus:outline-none leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingDispatch(false)}
                    className="btn-ghost py-2 px-4 text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingDispatch}
                    className="btn-gold py-2 px-6 text-xs font-semibold cursor-pointer shadow-md disabled:opacity-50"
                  >
                    {savingDispatch ? 'Publishing…' : 'Save & Publish to /news →'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* List of Published Dispatches */}
          <div className="grid gap-4 md:grid-cols-2">
            {dispatches.map((article) => (
              <div
                key={article.slug}
                className="card p-6 border-line bg-charcoal/80 space-y-4 hover:border-gold/30 transition flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-gold uppercase tracking-wider">{article.category}</span>
                    <span className="font-mono text-faint">{article.publishedAt}</span>
                  </div>

                  <h4 className="font-serif text-xl text-ink font-medium">{article.title}</h4>
                  <p className="text-xs text-muted line-clamp-2 leading-relaxed">{article.summary}</p>
                </div>

                <div className="pt-4 border-t border-line flex items-center justify-between text-xs">
                  <Link
                    href={`/news/${article.slug}`}
                    target="_blank"
                    className="text-gold font-mono text-xs hover:underline inline-flex items-center gap-1"
                  >
                    View Live ↗
                  </Link>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleEditDispatch(article)}
                      className="btn-ghost py-1 px-3 text-xs border border-line hover:border-gold/50 cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteDispatch(article.slug)}
                      className="text-rose-400 hover:text-rose-300 font-mono text-xs p-1 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── TAB 4: GLOBAL ANNOUNCEMENT & BROADCAST ───────────────────── */}
      {activeTab === 'settings' && (
        <section className="space-y-6 max-w-2xl">
          <div>
            <span className="eyebrow">Platform Broadcast</span>
            <h3 className="font-serif text-2xl sm:text-3xl text-ink font-medium">
              Global Site Announcement Banner
            </h3>
            <p className="text-xs text-muted">
              Control the top banner broadcast across the entire website in real time.
            </p>
          </div>

          {settingsFeedback && (
            <div className="p-3 rounded-xl border border-gold/40 bg-gold/10 text-gold text-xs">
              {settingsFeedback}
            </div>
          )}

          <form onSubmit={handleSaveSiteSettings} className="card p-6 border-gold/30 bg-charcoal space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl border border-line bg-obsidian">
              <div>
                <p className="font-serif text-sm text-ink font-medium">Enable Global Announcement Banner</p>
                <p className="text-xs text-muted">Display banner on top of all pages</p>
              </div>
              <input
                type="checkbox"
                checked={siteSettings.announcementActive}
                onChange={(e) => setSiteSettings({ ...siteSettings, announcementActive: e.target.checked })}
                className="size-5 rounded accent-gold cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <label className="font-mono text-xs text-muted block uppercase">Banner Eyebrow Badge</label>
              <input
                type="text"
                value={siteSettings.announcementBadge}
                onChange={(e) => setSiteSettings({ ...siteSettings, announcementBadge: e.target.value })}
                placeholder="e.g. FOUNDER ADVISORY OPEN"
                className="w-full rounded-xl border border-line bg-obsidian px-4 py-2.5 text-xs text-ink focus:border-gold focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-mono text-xs text-muted block uppercase">Announcement Message</label>
              <textarea
                rows={3}
                value={siteSettings.announcementText}
                onChange={(e) => setSiteSettings({ ...siteSettings, announcementText: e.target.value })}
                placeholder="Message broadcast across the site..."
                className="w-full rounded-xl border border-line bg-obsidian p-3 text-xs text-ink focus:border-gold focus:outline-none leading-relaxed"
              />
            </div>

            <div className="space-y-1">
              <label className="font-mono text-xs text-muted block uppercase">Destination Link</label>
              <input
                type="text"
                value={siteSettings.announcementLink}
                onChange={(e) => setSiteSettings({ ...siteSettings, announcementLink: e.target.value })}
                placeholder="/meet or /offers"
                className="w-full rounded-xl border border-line bg-obsidian px-4 py-2.5 text-xs text-ink focus:border-gold focus:outline-none"
              />
            </div>

            {/* ── TOP UTILITY SHELF SPONSOR / PROMO CONTROLS ── */}
            <div className="pt-4 border-t border-line space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl border border-line bg-obsidian">
                <div>
                  <p className="font-serif text-sm text-ink font-medium">Top Bar Sponsor / Deal / Product Promotion</p>
                  <p className="text-xs text-muted">Override top utility shelf ticker with custom sponsor or deal</p>
                </div>
                <input
                  type="checkbox"
                  checked={Boolean(siteSettings.topBarPromoActive)}
                  onChange={(e) => setSiteSettings({ ...siteSettings, topBarPromoActive: e.target.checked })}
                  className="size-5 rounded accent-gold cursor-pointer"
                />
              </div>

              {siteSettings.topBarPromoActive && (
                <div className="space-y-3 p-4 rounded-xl border border-gold/30 bg-obsidian/60 animate-fade-up">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="font-mono text-[0.68rem] text-gold uppercase block font-semibold">Promo Badge</label>
                      <input
                        type="text"
                        value={siteSettings.topBarPromoBadge || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, topBarPromoBadge: e.target.value })}
                        placeholder="e.g. SPONSOR, DEAL, EXCLUSIVE"
                        className="w-full rounded-lg border border-line bg-charcoal px-3 py-2 text-xs text-ink focus:border-gold focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="font-mono text-[0.68rem] text-gold uppercase block font-semibold">Promo Target Link</label>
                      <input
                        type="text"
                        value={siteSettings.topBarPromoLink || ''}
                        onChange={(e) => setSiteSettings({ ...siteSettings, topBarPromoLink: e.target.value })}
                        placeholder="/offers, /library, or https://..."
                        className="w-full rounded-lg border border-line bg-charcoal px-3 py-2 text-xs text-ink focus:border-gold focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono text-[0.68rem] text-gold uppercase block font-semibold">Promotion Headline / Copy</label>
                    <input
                      type="text"
                      value={siteSettings.topBarPromoText || ''}
                      onChange={(e) => setSiteSettings({ ...siteSettings, topBarPromoText: e.target.value })}
                      placeholder="e.g. 50% Off Sovereign Bundle · Limited Q4 Availability"
                      className="w-full rounded-lg border border-line bg-charcoal px-3 py-2 text-xs text-ink focus:border-gold focus:outline-none"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={savingSettings}
                className="btn-gold py-2.5 px-6 text-xs font-semibold cursor-pointer shadow-md disabled:opacity-50"
              >
                {savingSettings ? 'Broadcasting…' : 'Save Broadcast & Promotions →'}
              </button>
            </div>
          </form>
        </section>
      )}

      {/* ── TAB 5: EMAIL DISPATCHES & TEST PING ───────────────────────── */}
      {activeTab === 'email' && (
        <section className="space-y-6 max-w-3xl">
          <div>
            <span className="eyebrow">Relay Telemetry</span>
            <h3 className="font-serif text-2xl sm:text-3xl text-ink font-medium">
              Resend Email Pipeline &amp; Test Handshake
            </h3>
            <p className="text-xs text-muted">
              Live configuration of notifications routed directly to Jeremy Ashe&apos;s personal inbox.
            </p>
          </div>

          <div className="card p-6 border-line bg-charcoal space-y-5">
            <h4 className="font-serif text-lg text-ink font-medium border-b border-line pb-3">
              Active Email Channels Routing to Jeremy Ashe:
            </h4>

            <div className="grid gap-3 sm:grid-cols-2 text-xs">
              <div className="p-3.5 rounded-xl border border-emerald/30 bg-emerald/5 space-y-1">
                <span className="font-mono text-[0.62rem] text-emerald uppercase font-bold block">
                  ⚡ 12-Question Energy Audit
                </span>
                <p className="text-ink font-semibold">Instant Audit Scorecard Dispatched</p>
                <p className="text-muted text-[0.7rem]">
                  Routes Mind, Body, Soul scores, Forcing vs. Passive drift, and directive.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-gold/30 bg-gold/5 space-y-1">
                <span className="font-mono text-[0.62rem] text-gold uppercase font-bold block">
                  ⚡ Founder Vetting Application (/meet)
                </span>
                <p className="text-ink font-semibold">Executive Application Alert</p>
                <p className="text-muted text-[0.7rem]">
                  Routes company name, weekly hours, bottleneck, and mission alignment.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-line bg-obsidian space-y-1">
                <span className="font-mono text-[0.62rem] text-muted uppercase font-bold block">
                  ⚡ Direct Message Inquiries (/contact)
                </span>
                <p className="text-ink font-semibold">General Contact Inquiries</p>
                <p className="text-muted text-[0.7rem]">
                  Transmits visitor messages directly with reply-to headers configured.
                </p>
              </div>

              <div className="p-3.5 rounded-xl border border-line bg-obsidian space-y-1">
                <span className="font-mono text-[0.62rem] text-muted uppercase font-bold block">
                  ⚡ 1-on-1 Video Call Bookings
                </span>
                <p className="text-ink font-semibold">Google Meet Booking Alert</p>
                <p className="text-muted text-[0.7rem]">
                  Routes scheduled meeting dates, member IDs, and calibration topics.
                </p>
              </div>
            </div>

            {/* Test Ping Tool */}
            <div className="p-5 rounded-2xl border border-gold/50 bg-gradient-to-r from-obsidian to-charcoal space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h5 className="font-serif text-base text-ink font-medium">Verify Live Delivery to jeremyashe@gmail.com</h5>
                  <p className="text-xs text-muted">
                    Sends an authentic test handshake through the Resend relay to verify receipt.
                  </p>
                </div>

                <button
                  type="button"
                  disabled={testEmailSending}
                  onClick={handleSendTestPing}
                  className="btn-gold py-2.5 px-6 text-xs font-semibold cursor-pointer shadow-lg disabled:opacity-50 shrink-0"
                >
                  {testEmailSending ? 'Sending Handshake…' : 'Send Test Ping to Jeremy →'}
                </button>
              </div>

              {testEmailResult && (
                <div
                  className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                    testEmailResult.success
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                      : 'border-rose-500/40 bg-rose-500/10 text-rose-300'
                  }`}
                >
                  {testEmailResult.success ? (
                    <div className="space-y-1">
                      <p className="font-semibold">✓ Test Handshake Successfully Dispatched!</p>
                      <p className="text-[0.72rem] text-emerald-400/90 font-mono">
                        Message ID: {testEmailResult.messageId} &middot; Target: jeremyashe@gmail.com
                      </p>
                      <p className="text-[0.72rem]">Check your inbox to confirm the obsidian &amp; gold formatted transmission.</p>
                    </div>
                  ) : (
                    <p>Dispatch Error: {testEmailResult.error || 'Failed to dispatch email'}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
