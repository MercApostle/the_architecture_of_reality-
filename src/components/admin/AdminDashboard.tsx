'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { QualificationStatus, ActivityLog, VideoCallBooking } from '@/lib/supabase/types';
import type { FullClientProjectData } from '@/lib/queries/consultancy.queries';
import {
  type AdminMemberRecord,
  updateMemberOperatorNotes,
} from '@/lib/actions/operator.actions';

interface StoredApp {
  id: string;
  fullName: string;
  email: string;
  companyName: string;
  businessSector: string;
  currentWeeklyHours: number;
  missionAlignment: string;
  primaryBottleneck: string;
  qualificationStatus: QualificationStatus;
  createdAt: string;
}

interface AdminDashboardProps {
  initialApplications: StoredApp[];
  initialClientData: FullClientProjectData;
  initialMembers: AdminMemberRecord[];
  initialActivityLogs: ActivityLog[];
  initialBookings: VideoCallBooking[];
}

export default function AdminDashboard({
  initialApplications,
  initialClientData,
  initialMembers,
  initialActivityLogs,
  initialBookings,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'members' | 'radar' | 'bookings' | 'applications' | 'client_roadmap'>('members');
  const [members, setMembers] = useState<AdminMemberRecord[]>(initialMembers);
  const [activityLogs] = useState<ActivityLog[]>(initialActivityLogs);
  const [bookings] = useState<VideoCallBooking[]>(initialBookings);
  const [applications] = useState<StoredApp[]>(initialApplications);
  const [appFilter, setAppFilter] = useState<'all' | 'qualified' | 'nurture'>('all');
  const [clientData] = useState<FullClientProjectData>(initialClientData);

  // Operator note editing state
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [noteContent, setNoteContent] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [noteMessage, setNoteMessage] = useState<string | null>(null);

  const filteredApps = applications.filter((app) => {
    if (appFilter === 'all') return true;
    return app.qualificationStatus === appFilter;
  });

  const handleStartEditNote = (member: AdminMemberRecord) => {
    setEditingMemberId(member.id);
    setNoteContent(member.operatorNotes || '');
    setNoteMessage(null);
  };

  const handleSaveNote = async (memberId: string) => {
    setSavingNote(true);
    setNoteMessage(null);
    const res = await updateMemberOperatorNotes(memberId, noteContent);
    if (res.success) {
      setMembers((prev) =>
        prev.map((m) => (m.id === memberId ? { ...m, operatorNotes: noteContent } : m))
      );
      setEditingMemberId(null);
      setNoteMessage('Note saved successfully.');
    } else {
      setNoteMessage(res.error || 'Failed to save note.');
    }
    setSavingNote(false);
  };

  const getRankBadgeClasses = (rank: string) => {
    switch (rank) {
      case 'Sovereign Master':
        return 'bg-gold/20 text-gold border-gold/40';
      case 'Systems Architect':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      case 'Apprentice Builder':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/40';
    }
  };

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      {/* ── TOP STATS OVERVIEW ──────────────────────────────── */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card p-5 border-line bg-charcoal/80 space-y-1 relative overflow-hidden">
          <div className="pointer-events-none absolute -right-6 -bottom-6 size-24 rounded-full bg-gold/10 blur-xl" />
          <span className="font-mono text-xs text-muted uppercase tracking-wider">Registered Operators</span>
          <p className="font-serif text-3xl font-bold text-ink">{members.length}</p>
          <span className="font-mono text-[0.65rem] text-gold">10,000 Pt Scale Active</span>
        </div>

        <div className="card p-5 border-emerald/40 bg-charcoal/80 space-y-1">
          <span className="font-mono text-xs text-emerald uppercase tracking-wider">Activity Radar Events</span>
          <p className="font-serif text-3xl font-bold text-emerald">{activityLogs.length}</p>
          <span className="font-mono text-[0.65rem] text-muted">Real-time engagement telemetry</span>
        </div>

        <div className="card p-5 border-gold/40 bg-charcoal/80 space-y-1">
          <span className="font-mono text-xs text-gold uppercase tracking-wider">Cal.com Video Sessions</span>
          <p className="font-serif text-3xl font-bold text-gold">{bookings.length}</p>
          <span className="font-mono text-[0.65rem] text-muted">3-Call per member allowance</span>
        </div>

        <div className="card p-5 border-line bg-charcoal/80 space-y-1">
          <span className="font-mono text-xs text-muted uppercase tracking-wider">Qualified Inbound Leads</span>
          <p className="font-serif text-3xl font-bold text-ink">
            {applications.filter((a) => a.qualificationStatus === 'qualified').length}
            <span className="font-mono text-xs text-faint font-normal"> / {applications.length}</span>
          </p>
          <span className="font-mono text-[0.65rem] text-muted">Founder vetting pipeline</span>
        </div>
      </div>

      {/* ── COMMAND NAVIGATION TABS ──────────────────────────── */}
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
          👤 Member Directory &amp; Notes ({members.length})
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
          📡 Activity Radar ({activityLogs.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('bookings')}
          className={`py-3 px-5 font-mono text-xs tracking-wider transition border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'bookings'
              ? 'border-gold text-gold font-bold bg-gold/5'
              : 'border-transparent text-muted hover:text-ink hover:border-line'
          }`}
        >
          📹 Video Bookings ({bookings.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('applications')}
          className={`py-3 px-5 font-mono text-xs tracking-wider transition border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'applications'
              ? 'border-gold text-gold font-bold bg-gold/5'
              : 'border-transparent text-muted hover:text-ink hover:border-line'
          }`}
        >
          📑 Founder Applications ({applications.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('client_roadmap')}
          className={`py-3 px-5 font-mono text-xs tracking-wider transition border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'client_roadmap'
              ? 'border-gold text-gold font-bold bg-gold/5'
              : 'border-transparent text-muted hover:text-ink hover:border-line'
          }`}
        >
          🗺️ Enterprise Roadmaps
        </button>
      </div>

      {/* ── TAB 1: MEMBER MANAGEMENT & OPERATOR NOTES ────────── */}
      {activeTab === 'members' && (
        <section className="space-y-6 animate-fade-up">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="eyebrow">Database Ledger</span>
              <h3 className="font-serif text-2xl sm:text-3xl text-ink font-medium">
                Registered Members &amp; Sovereign Progress
              </h3>
              <p className="text-xs text-muted">
                Inspect member handles, track accumulated points against the 10,000 pt threshold, and append private operator notes.
              </p>
            </div>
          </div>

          {noteMessage && (
            <div className="p-3 rounded-xl border border-gold/40 bg-gold/10 text-gold text-xs">
              {noteMessage}
            </div>
          )}

          <div className="space-y-4">
            {members.map((member) => (
              <div
                key={member.id}
                className="card p-6 border-line bg-charcoal/80 hover:border-gold/30 transition space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-serif text-xl font-medium text-ink">
                        {member.name}
                      </span>
                      <span className={`px-2 py-0.5 rounded font-mono text-[0.62rem] border uppercase tracking-wider ${getRankBadgeClasses(member.rank)}`}>
                        {member.rank}
                      </span>
                      <span className="px-2 py-0.5 rounded font-mono text-[0.62rem] border border-line bg-obsidian text-muted uppercase">
                        {member.tier === 'paid' ? '⚡ $50 Sovereign Tier' : 'Free Member'}
                      </span>
                      {member.role === 'operator' && (
                        <span className="px-2 py-0.5 rounded font-mono text-[0.62rem] bg-gold text-obsidian font-bold uppercase">
                          Root Operator
                        </span>
                      )}
                    </div>
                    <p className="font-mono text-xs text-muted">
                      ID: <span className="text-gold font-bold">{member.id}</span> &middot; {member.email} &middot; Joined {member.memberSince}
                    </p>
                  </div>

                  <div className="flex items-center gap-6 shrink-0">
                    <div className="text-right">
                      <p className="font-mono text-sm font-bold text-gold">
                        {member.points} <span className="text-faint text-[0.68rem] font-normal">/ 10,000 pts</span>
                      </p>
                      <p className="font-mono text-[0.65rem] text-muted">
                        📹 {member.meetingCreditsRemaining} call credits
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleStartEditNote(member)}
                      className="btn-ghost py-1.5 px-3 text-xs border border-line text-muted hover:text-gold cursor-pointer"
                    >
                      {member.operatorNotes ? 'Edit Notes' : '+ Add Note'}
                    </button>
                  </div>
                </div>

                {/* Progression Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[0.65rem] font-mono text-muted">
                    <span>Rank Progress: {Math.min(100, (member.points / 10000) * 100).toFixed(1)}%</span>
                    <span>10,000 pt Sovereign Ceiling</span>
                  </div>
                  <div className="h-1.5 w-full bg-obsidian rounded-full overflow-hidden border border-line">
                    <div
                      className="h-full bg-gradient-to-r from-gold via-gold-bright to-emerald rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, Math.max(1, (member.points / 10000) * 100))}%` }}
                    />
                  </div>
                </div>

                {/* Operator Notes Display / Editor */}
                {editingMemberId === member.id ? (
                  <div className="p-4 rounded-xl border border-gold/50 bg-obsidian space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="font-mono text-xs text-gold uppercase tracking-wider font-semibold">
                        Edit Confidential Operator Notes:
                      </label>
                      <span className="font-mono text-[0.65rem] text-faint">Internal use only</span>
                    </div>
                    <textarea
                      rows={3}
                      value={noteContent}
                      onChange={(e) => setNoteContent(e.target.value)}
                      placeholder="Add diagnostic notes, high-stakes context, or advisory directives..."
                      className="w-full rounded-lg border border-line bg-charcoal p-3 text-xs text-ink placeholder:text-faint focus:border-gold focus:outline-none"
                    />
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingMemberId(null)}
                        className="btn-ghost py-1 px-3 text-xs text-muted hover:text-ink cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={savingNote}
                        onClick={() => handleSaveNote(member.id)}
                        className="btn-gold py-1 px-4 text-xs font-semibold cursor-pointer disabled:opacity-50"
                      >
                        {savingNote ? 'Saving…' : 'Save Notes →'}
                      </button>
                    </div>
                  </div>
                ) : member.operatorNotes ? (
                  <div className="p-3.5 rounded-xl border border-line bg-obsidian/70 space-y-1">
                    <span className="font-mono text-[0.62rem] text-gold uppercase tracking-wider font-semibold">
                      Operator Directive &amp; Observations:
                    </span>
                    <p className="text-xs text-ink/90 leading-relaxed font-sans">
                      {member.operatorNotes}
                    </p>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── TAB 2: ACTIVITY RADAR ────────────────────────────── */}
      {activeTab === 'radar' && (
        <section className="space-y-6 animate-fade-up">
          <div>
            <span className="eyebrow">Telemetry Stream</span>
            <h3 className="font-serif text-2xl sm:text-3xl text-ink font-medium">
              Operator Activity Radar
            </h3>
            <p className="text-xs text-muted">
              Real-time audit log of user quest completions, energy diagnostic submissions, and vault downloads.
            </p>
          </div>

          <div className="card p-6 border-line bg-charcoal/80 space-y-4">
            <div className="divide-y divide-line">
              {activityLogs.map((log) => {
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

      {/* ── TAB 3: CAL.COM VIDEO BOOKINGS ────────────────────── */}
      {activeTab === 'bookings' && (
        <section className="space-y-6 animate-fade-up">
          <div>
            <span className="eyebrow">Advisory Sessions</span>
            <h3 className="font-serif text-2xl sm:text-3xl text-ink font-medium">
              Cal.com Video Call Bookings
            </h3>
            <p className="text-xs text-muted">
              Scheduled 1-on-1 strategy sessions included in the Sovereign $50 CAD Membership.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {bookings.map((booking) => {
              const dateStr = new Date(booking.scheduled_for).toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <div
                  key={booking.id}
                  className="card p-6 border-gold/30 bg-charcoal/80 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-gold font-bold">
                      📹 30-Min Strategy Call
                    </span>
                    <span className="px-2 py-0.5 rounded font-mono text-[0.62rem] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
                      {booking.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h4 className="font-serif text-xl text-ink">
                      Client: <span className="text-gradient-gold italic">{booking.user_id}</span>
                    </h4>
                    <p className="font-mono text-xs text-muted">
                      Scheduled Date: <strong className="text-ink">{dateStr}</strong>
                    </p>
                    {booking.cal_booking_uid && (
                      <p className="font-mono text-[0.65rem] text-faint">
                        Cal UID: {booking.cal_booking_uid}
                      </p>
                    )}
                  </div>

                  {booking.session_notes && (
                    <div className="p-3 rounded-lg border border-line bg-obsidian text-xs text-muted leading-relaxed">
                      <span className="font-mono text-[0.62rem] text-gold uppercase block mb-1">
                        Session Agenda &amp; Context:
                      </span>
                      {booking.session_notes}
                    </div>
                  )}

                  <div className="pt-2 flex items-center justify-between text-xs">
                    <a
                      href="https://meet.google.com"
                      target="_blank"
                      rel="noreferrer"
                      className="btn-gold py-1.5 px-3 font-semibold text-xs inline-flex items-center gap-1"
                    >
                      <span>🎥</span> Launch Google Meet Room
                    </a>
                    <span className="font-mono text-[0.65rem] text-faint">Encrypted Video</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── TAB 4: FOUNDER APPLICATIONS (READ-ONLY) ───────────── */}
      {activeTab === 'applications' && (
        <section className="space-y-6 animate-fade-up">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
            <div>
              <span className="eyebrow">Executive Pipeline</span>
              <h3 className="font-serif text-2xl sm:text-3xl text-ink font-medium">
                Submitted Consultancy Applications
              </h3>
              <p className="text-xs text-muted">
                Review incoming founder vetting profiles against the 80-Hour Work Month criteria and mission alignment.
              </p>
            </div>

            <div className="inline-flex rounded-lg border border-line p-1 bg-charcoal">
              {(['all', 'qualified', 'nurture'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setAppFilter(tab)}
                  className={`px-3 py-1 rounded text-xs font-mono transition cursor-pointer capitalize ${
                    appFilter === tab
                      ? 'bg-gold text-black font-semibold'
                      : 'text-muted hover:text-ink'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredApps.length === 0 ? (
              <div className="card p-8 text-center text-muted text-sm border-dashed">
                No applications currently matching the selected filter.
              </div>
            ) : (
              filteredApps.map((app) => {
                const isQualified = app.qualificationStatus === 'qualified';

                return (
                  <div
                    key={app.id}
                    className={`card p-6 border transition duration-300 space-y-4 ${
                      isQualified ? 'border-emerald/40 bg-charcoal' : 'border-line bg-charcoal'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-mono text-[0.62rem] uppercase tracking-wider px-2 py-0.5 rounded border ${
                              isQualified
                                ? 'bg-emerald/15 text-emerald border-emerald/30 font-bold'
                                : 'bg-gold/10 text-gold border-gold/30'
                            }`}
                          >
                            {app.qualificationStatus}
                          </span>
                          <span className="font-mono text-xs text-muted">
                            Sector: {app.businessSector.replace('_', ' ')}
                          </span>
                          <span className="size-1 rounded-full bg-gold/60" />
                          <span className="font-mono text-xs text-gold">
                            {app.currentWeeklyHours} hrs/week
                          </span>
                        </div>
                        <h4 className="font-serif text-2xl text-ink font-medium mt-1">
                          {app.companyName} &middot;{' '}
                          <span className="text-muted font-normal text-lg">{app.fullName}</span>
                        </h4>
                      </div>

                      <div className="text-left sm:text-right shrink-0">
                        <a
                          href={`mailto:${app.email}`}
                          className="btn-gold py-1.5 px-3 text-xs inline-flex items-center gap-1.5"
                        >
                          <span>✉</span> Contact Founder
                        </a>
                        <p className="font-mono text-[0.65rem] text-faint mt-1">{app.email}</p>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 text-xs">
                      <div className="p-3 rounded-xl border border-line bg-obsidian space-y-1">
                        <span className="font-mono text-[0.65rem] text-gold uppercase tracking-wider font-semibold">
                          Mission Alignment:
                        </span>
                        <p className="text-ink/90 leading-relaxed">{app.missionAlignment}</p>
                      </div>
                      <div className="p-3 rounded-xl border border-line bg-obsidian space-y-1">
                        <span className="font-mono text-[0.65rem] text-gold uppercase tracking-wider font-semibold">
                          Primary Bottleneck:
                        </span>
                        <p className="text-ink/90 leading-relaxed">{app.primaryBottleneck}</p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      )}

      {/* ── TAB 5: CLIENT ROADMAP & HEALTH (READ-ONLY) ────────── */}
      {activeTab === 'client_roadmap' && (
        <section className="card p-8 border-line bg-charcoal space-y-6 animate-fade-up">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
            <div>
              <span className="eyebrow">Client Delivery Control</span>
              <h3 className="font-serif text-2xl text-ink font-medium">
                Milestone &amp; Roadmap Management
              </h3>
              <p className="text-xs text-muted">
                Active Client Project: <strong>{clientData.project.project_name}</strong>
              </p>
            </div>

            <Link href="/portal" className="btn-ghost py-2 px-4 text-xs text-gold border-gold/40">
              Open Client Command Center &rarr;
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="p-4 rounded-xl border border-line bg-obsidian space-y-1">
              <span className="font-mono text-xs text-muted uppercase">Monthly Hours</span>
              <p className="font-serif text-2xl font-bold text-ink">
                {clientData.project.current_monthly_hours} hrs{' '}
                <span className="text-xs text-faint font-normal">/ {clientData.project.target_monthly_hours} target</span>
              </p>
            </div>

            <div className="p-4 rounded-xl border border-emerald/30 bg-obsidian space-y-1">
              <span className="font-mono text-xs text-emerald uppercase">System Health Score</span>
              <p className="font-serif text-2xl font-bold text-emerald">
                {clientData.project.system_health_score} / 100
              </p>
            </div>

            <div className="p-4 rounded-xl border border-line bg-obsidian space-y-1">
              <span className="font-mono text-xs text-muted uppercase">Active Milestones</span>
              <p className="font-serif text-2xl font-bold text-ink">
                {clientData.milestones.length} Phases
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <h4 className="font-serif text-lg text-ink font-medium">Phase Milestones</h4>
            <div className="space-y-3">
              {clientData.milestones.map((milestone) => (
                <div
                  key={milestone.id}
                  className="p-4 rounded-xl border border-line bg-obsidian flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[0.62rem] text-gold uppercase tracking-wider font-bold">
                        Phase {milestone.phase_number}
                      </span>
                      <span className="size-1 rounded-full bg-line" />
                      <span className={`font-mono text-[0.62rem] px-2 py-0.5 rounded border uppercase ${
                        milestone.status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                      }`}>
                        {milestone.status.replace('_', ' ')}
                      </span>
                    </div>
                    <h5 className="font-serif text-base text-ink font-medium">
                      {milestone.title}
                    </h5>
                    <p className="text-muted leading-relaxed font-sans">
                      {milestone.deliverables_md}
                    </p>
                  </div>

                  <span className="font-mono text-xs text-faint shrink-0">
                    Due: {milestone.due_date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
