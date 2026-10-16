'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { updateMilestoneStatus } from '@/lib/actions/consultancy.actions';
import type { MilestoneStatus, QualificationStatus } from '@/lib/supabase/types';
import type { FullClientProjectData } from '@/lib/queries/consultancy.queries';

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
}

export default function AdminDashboard({
  initialApplications,
  initialClientData,
}: AdminDashboardProps) {
  const [applications] = useState<StoredApp[]>(initialApplications);
  const [filter, setFilter] = useState<'all' | 'qualified' | 'nurture'>('all');
  const [clientData, setClientData] = useState<FullClientProjectData>(initialClientData);
  const [updatingMilestoneId, setUpdatingMilestoneId] = useState<string | null>(null);

  const filteredApps = applications.filter((app) => {
    if (filter === 'all') return true;
    return app.qualificationStatus === filter;
  });

  const handleToggleMilestone = async (milestoneId: string, currentStatus: MilestoneStatus) => {
    const nextStatus: MilestoneStatus =
      currentStatus === 'completed' ? 'in_progress' :
      currentStatus === 'in_progress' ? 'completed' : 'in_progress';

    setUpdatingMilestoneId(milestoneId);

    try {
      await updateMilestoneStatus(milestoneId, nextStatus);
      setClientData((prev) => ({
        ...prev,
        milestones: prev.milestones.map((m) =>
          m.id === milestoneId ? { ...m, status: nextStatus } : m
        ),
      }));
    } finally {
      setUpdatingMilestoneId(null);
    }
  };

  return (
    <div className="space-y-12 max-w-6xl mx-auto">
      {/* ── ADMIN OVERVIEW STATS ──────────────────────────────── */}
      <div className="grid gap-6 sm:grid-cols-4">
        <div className="card p-5 border-line bg-charcoal space-y-1">
          <span className="font-mono text-xs text-muted uppercase tracking-wider">Total Applications</span>
          <p className="font-serif text-3xl font-bold text-ink">{applications.length}</p>
        </div>

        <div className="card p-5 border-emerald/40 bg-charcoal space-y-1">
          <span className="font-mono text-xs text-emerald uppercase tracking-wider">Qualified Leaders</span>
          <p className="font-serif text-3xl font-bold text-emerald">
            {applications.filter((a) => a.qualificationStatus === 'qualified').length}
          </p>
        </div>

        <div className="card p-5 border-gold/40 bg-charcoal space-y-1">
          <span className="font-mono text-xs text-gold uppercase tracking-wider">Nurture Pipeline</span>
          <p className="font-serif text-3xl font-bold text-gold">
            {applications.filter((a) => a.qualificationStatus === 'nurture').length}
          </p>
        </div>

        <div className="card p-5 border-line bg-charcoal space-y-1">
          <span className="font-mono text-xs text-muted uppercase tracking-wider">Client Health Score</span>
          <p className="font-serif text-3xl font-bold text-ink">
            {clientData.project.system_health_score} <span className="font-mono text-xs text-faint font-normal">/ 100</span>
          </p>
        </div>
      </div>

      {/* ── SECTION 1: CONSULTANCY VETTING INBOX ───────────────── */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
          <div>
            <span className="eyebrow">Executive Pipeline</span>
            <h3 className="font-serif text-2xl sm:text-3xl text-ink">
              Submitted Consultancy Applications
            </h3>
          </div>

          <div className="inline-flex rounded-lg border border-line p-1 bg-charcoal">
            {(['all', 'qualified', 'nurture'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={`px-3 py-1 rounded text-xs font-mono transition cursor-pointer capitalize ${
                  filter === tab
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
                    isQualified ? 'border-emerald/40 bg-charcoal-raised' : 'border-line bg-charcoal'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className={`font-mono text-[0.62rem] uppercase tracking-wider px-2 py-0.5 rounded border ${
                          isQualified ? 'bg-emerald/15 text-emerald border-emerald/30 font-bold' : 'bg-gold/10 text-gold border-gold/30'
                        }`}>
                          {app.qualificationStatus}
                        </span>
                        <span className="font-mono text-xs text-muted">Sector: {app.businessSector.replace('_', ' ')}</span>
                        <span className="size-1 rounded-full bg-gold/60" />
                        <span className="font-mono text-xs text-gold">{app.currentWeeklyHours} hrs/week</span>
                      </div>
                      <h4 className="font-serif text-2xl text-ink font-medium mt-1">
                        {app.companyName} &middot; <span className="text-muted font-normal text-lg">{app.fullName}</span>
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
                    <div className="p-3 rounded-xl border border-line bg-charcoal space-y-1">
                      <span className="font-mono text-[0.65rem] text-gold uppercase tracking-wider font-semibold">
                        Mission Alignment:
                      </span>
                      <p className="text-ink/90 leading-relaxed">{app.missionAlignment}</p>
                    </div>
                    <div className="p-3 rounded-xl border border-line bg-charcoal space-y-1">
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
      </div>

      {/* ── SECTION 2: CLIENT ROADMAP MANAGEMENT ──────────────── */}
      <div className="card p-8 border-line bg-charcoal space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-4">
          <div>
            <span className="eyebrow">Client Delivery Control</span>
            <h3 className="font-serif text-2xl text-ink">
              Milestone &amp; Roadmap Management
            </h3>
            <p className="text-xs text-muted">
              Project: <strong>{clientData.project.project_name}</strong>
            </p>
          </div>

          <Link href="/portal" className="btn-ghost py-2 px-4 text-xs text-gold border-gold/40">
            Open Client Command Center &rarr;
          </Link>
        </div>

        <div className="space-y-3">
          {clientData.milestones.map((m) => {
            const isCompleted = m.status === 'completed';

            return (
              <div
                key={m.id}
                className="card p-4 border-line bg-charcoal-raised flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <span className={`grid size-7 place-items-center rounded-lg font-mono text-xs font-bold ${
                    isCompleted ? 'bg-emerald text-black' : 'bg-charcoal border border-line text-muted'
                  }`}>
                    {isCompleted ? '✓' : `0${m.phase_number}`}
                  </span>
                  <div>
                    <h5 className="font-serif text-base text-ink font-medium">{m.title}</h5>
                    <p className="text-xs text-muted line-clamp-1">{m.deliverables_md}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className={`font-mono text-[0.65rem] px-2 py-0.5 rounded border capitalize ${
                    isCompleted ? 'bg-emerald/10 text-emerald border-emerald/30' : 'bg-gold/10 text-gold border-gold/30'
                  }`}>
                    {m.status.replace('_', ' ')}
                  </span>
                  <button
                    type="button"
                    disabled={updatingMilestoneId === m.id}
                    onClick={() => handleToggleMilestone(m.id, m.status)}
                    className="btn-ghost py-1 px-3 text-xs text-muted hover:text-ink cursor-pointer disabled:opacity-50"
                  >
                    {isCompleted ? 'Reopen' : 'Mark Complete'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
