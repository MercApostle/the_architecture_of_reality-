'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Markdown } from '@/components/ui/primitives';
import type { FullClientProjectData } from '@/lib/queries/consultancy.queries';

interface ClientCommandCenterProps {
  initialData: FullClientProjectData;
}

export default function ClientCommandCenter({ initialData }: ClientCommandCenterProps) {
  const [data] = useState<FullClientProjectData>(initialData);
  const [activeTab, setActiveTab] = useState<'overview' | 'milestones' | 'architecture'>('overview');
  const [expandedMilestone, setExpandedMilestone] = useState<string | null>(data.milestones[1]?.id ?? null);
  const [devBypassActive, setDevBypassActive] = useState<boolean>(true);

  const { project, milestones } = data;

  // Metric computations
  const currentHours = project.current_monthly_hours;
  const targetHours = project.target_monthly_hours;
  const hoursReclaimed = Math.max(0, 160 - currentHours);
  const targetProgress = Math.min(100, Math.max(0, Math.round(((160 - currentHours) / (160 - targetHours)) * 100)));

  // Health Score categorization
  const healthScore = project.system_health_score;
  const healthColor =
    healthScore >= 80 ? 'text-emerald border-emerald/40 bg-emerald/10' :
    healthScore >= 50 ? 'text-gold border-gold/40 bg-gold/10' :
    'text-red-400 border-red-500/40 bg-red-500/10';

  const healthLabel =
    healthScore >= 80 ? 'Sovereign Order' :
    healthScore >= 50 ? 'Operational Friction' :
    'Critical Leak Alert';

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      {/* ── CLIENT PROJECT HERO HEADER ───────────────────────── */}
      <div className="card p-6 sm:p-8 border-line bg-gradient-to-r from-charcoal via-charcoal to-[#161a22] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5">
            <span className="eyebrow">Client Command Center</span>
            <span className="size-1 rounded-full bg-gold/60" />
            <span className="font-mono text-xs text-muted">ID: {project.id}</span>
            {devBypassActive && (
              <span className="font-mono text-[0.62rem] text-gold/90 bg-gold/15 px-2 py-0.5 rounded border border-gold/30">
                Dev Bypass Active
              </span>
            )}
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-ink font-medium">
            {project.project_name}
          </h2>
          <p className="text-xs text-muted">
            Executive systems telemetry, calendar restructuring, and milestone roadmap.
          </p>
        </div>

        {/* Quick Nav Action */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <Link
            href="/meet"
            className="btn-gold py-2 px-4 text-xs font-semibold flex items-center gap-1.5 shadow-md"
          >
            <span>📅</span> Executive Debrief
          </Link>
          <button
            type="button"
            onClick={() => setDevBypassActive(!devBypassActive)}
            className="btn-ghost py-2 px-3 text-xs text-muted hover:text-gold font-mono"
            title="Toggle between live session and local client preview"
          >
            {devBypassActive ? 'Preview Mode: On' : 'Preview Mode: Off'}
          </button>
        </div>
      </div>

      {/* ── HIGH-LEVEL TELEMETRY METRICS ─────────────────────── */}
      <div className="grid gap-6 sm:grid-cols-3">
        {/* Metric 1: 80-Hour Work Month Gauge */}
        <div className="card p-6 border-line bg-charcoal space-y-4 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-muted uppercase tracking-wider">Work Month Cadence</span>
            <span className="font-serif text-lg text-gold font-bold">Target: {targetHours}h</span>
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-4xl font-bold text-ink">{currentHours}</span>
              <span className="font-mono text-xs text-muted">hrs / month</span>
            </div>
            <p className="text-xs text-emerald flex items-center gap-1">
              <span>↓</span> {hoursReclaimed} hrs/mo reclaimed from standard 160h base
            </p>
          </div>

          {/* Progress bar towards 80h standard */}
          <div className="space-y-1.5 pt-2">
            <div className="flex justify-between text-[0.65rem] font-mono text-faint">
              <span>160h (Standard Grinding)</span>
              <span>80h (Sovereign Target)</span>
            </div>
            <div className="h-2 w-full bg-line rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-gold-deep via-gold to-emerald rounded-full transition-all duration-700"
                style={{ width: `${targetProgress}%` }}
              />
            </div>
            <span className="font-mono text-[0.65rem] text-gold/80 block text-right">
              {targetProgress}% toward 80h cadence
            </span>
          </div>
        </div>

        {/* Metric 2: System Health Score */}
        <div className="card p-6 border-line bg-charcoal space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-muted uppercase tracking-wider">System Health Score</span>
            <span className={`font-mono text-[0.68rem] px-2.5 py-0.5 rounded-full border ${healthColor}`}>
              {healthLabel}
            </span>
          </div>

          <div className="space-y-1">
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-4xl font-bold text-ink">{healthScore}</span>
              <span className="font-mono text-xs text-muted">/ 100 Index</span>
            </div>
            <p className="text-xs text-muted">
              Aggregated across Firewalls, Calendar Curfews, and Team Autonomy.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-line text-center font-mono text-[0.65rem]">
            <div className="p-1.5 rounded bg-charcoal-raised border border-line">
              <span className="text-faint block">Signal</span>
              <span className="text-gold font-bold">88%</span>
            </div>
            <div className="p-1.5 rounded bg-charcoal-raised border border-line">
              <span className="text-faint block">Pacing</span>
              <span className="text-gold font-bold">65%</span>
            </div>
            <div className="p-1.5 rounded bg-charcoal-raised border border-line">
              <span className="text-faint block">Covenant</span>
              <span className="text-gold font-bold">78%</span>
            </div>
          </div>
        </div>

        {/* Metric 3: Active Milestone Status */}
        <div className="card p-6 border-line bg-charcoal space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-muted uppercase tracking-wider">Active Roadmap</span>
            <span className="font-mono text-xs text-gold">Phase 2 Active</span>
          </div>

          <div className="space-y-1">
            <h4 className="font-serif text-xl text-ink font-medium line-clamp-1">
              {milestones.find((m) => m.status === 'in_progress')?.title || 'Phase Transition'}
            </h4>
            <p className="text-xs text-muted line-clamp-2">
              {milestones.find((m) => m.status === 'in_progress')?.deliverables_md || 'All active phases proceeding.'}
            </p>
          </div>

          <div className="pt-2 border-t border-line flex items-center justify-between text-xs font-mono">
            <span className="text-faint">Target Completion:</span>
            <span className="text-gold">{milestones.find((m) => m.status === 'in_progress')?.due_date ?? 'In Progress'}</span>
          </div>
        </div>
      </div>

      {/* ── TAB SWITCHER: OVERVIEW / MILESTONES / ARCHITECTURE ── */}
      <div className="border-b border-line flex gap-6">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`pb-3 font-mono text-xs tracking-wider uppercase transition cursor-pointer border-b-2 ${
            activeTab === 'overview'
              ? 'border-gold text-gold font-semibold'
              : 'border-transparent text-muted hover:text-ink'
          }`}
        >
          Phase Milestones ({milestones.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('architecture')}
          className={`pb-3 font-mono text-xs tracking-wider uppercase transition cursor-pointer border-b-2 ${
            activeTab === 'architecture'
              ? 'border-gold text-gold font-semibold'
              : 'border-transparent text-muted hover:text-ink'
          }`}
        >
          Architecture Summary &amp; Firewalls
        </button>
      </div>

      {/* ── TAB 1: PHASE MILESTONES TIMELINE ─────────────────── */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fade-up">
          <div className="space-y-1">
            <span className="eyebrow">Transformation Roadmap</span>
            <h3 className="font-serif text-2xl text-ink">The 4 Sovereign Operational Phases</h3>
          </div>

          <div className="space-y-4">
            {milestones.map((m) => {
              const isExpanded = expandedMilestone === m.id;
              const isCompleted = m.status === 'completed';
              const isInProgress = m.status === 'in_progress';

              const statusBadge =
                isCompleted ? 'bg-emerald/10 text-emerald border-emerald/30' :
                isInProgress ? 'bg-gold/15 text-gold border-gold/40' :
                'bg-charcoal text-muted border-line';

              return (
                <div
                  key={m.id}
                  className={`card transition duration-300 ${
                    isInProgress
                      ? 'border-gold/50 bg-charcoal-raised shadow-lg'
                      : isCompleted
                      ? 'border-line/70 bg-charcoal/80'
                      : 'border-line bg-charcoal/40 opacity-75'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setExpandedMilestone(isExpanded ? null : m.id)}
                    className="w-full p-6 text-left flex items-start sm:items-center justify-between gap-4 cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <span className={`grid size-9 place-items-center rounded-xl border text-xs font-mono font-bold ${
                        isCompleted ? 'border-emerald text-emerald bg-emerald/10' :
                        isInProgress ? 'border-gold text-black bg-gold' :
                        'border-line text-muted bg-charcoal'
                      }`}>
                        {isCompleted ? '✓' : `0${m.phase_number}`}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`font-mono text-[0.62rem] uppercase tracking-wider px-2 py-0.5 rounded border ${statusBadge}`}>
                            {m.status.replace('_', ' ')}
                          </span>
                          {m.due_date && (
                            <span className="font-mono text-[0.65rem] text-faint">
                              Due: {m.due_date}
                            </span>
                          )}
                        </div>
                        <h4 className="font-serif text-xl sm:text-2xl text-ink mt-1">
                          {m.title}
                        </h4>
                      </div>
                    </div>

                    <span className="text-gold font-mono text-sm shrink-0">
                      {isExpanded ? '▲' : '▼'}
                    </span>
                  </button>

                  {isExpanded && (
                    <div className="px-6 pb-6 pt-2 border-t border-line/60 space-y-4">
                      <div className="p-4 rounded-xl border border-line bg-charcoal text-sm text-ink/90 leading-relaxed font-sans">
                        <p className="font-mono text-[0.68rem] text-gold uppercase tracking-wider mb-1 font-semibold">
                          Deliverables &amp; Sovereign Protocols:
                        </p>
                        <p>{m.deliverables_md}</p>
                      </div>

                      <div className="flex items-center justify-between text-xs font-mono pt-2">
                        <span className="text-muted">Phase {m.phase_number} Execution Target</span>
                        <Link href="/meet" className="text-gold hover:underline">
                          Schedule Milestone Review Call &rarr;
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── TAB 2: ARCHITECTURE SUMMARY & SHARED BLUEPRINTS ──── */}
      {activeTab === 'architecture' && (
        <div className="grid gap-8 lg:grid-cols-[1fr_320px] items-start animate-fade-up">
          <div className="card p-8 border-line bg-charcoal space-y-6">
            <span className="eyebrow">Enterprise Blueprint</span>
            <div className="prose-reality">
              <Markdown>{project.architecture_summary_md}</Markdown>
            </div>
          </div>

          {/* Shared Resources & Blueprints Sidebar */}
          <div className="space-y-6">
            <div className="card p-6 border-gold/40 bg-charcoal-raised space-y-4">
              <span className="eyebrow">Shared Blueprints</span>
              <h4 className="font-serif text-xl text-ink font-medium">Downloadable Assets</h4>
              <p className="text-xs text-muted leading-relaxed">
                Direct access to high-resolution vector print architecture manuals and enterprise firewall templates.
              </p>

              <div className="space-y-2 pt-2 border-t border-line">
                {project.shared_links.map((link, idx) => (
                  <a
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 rounded-xl border border-line bg-charcoal hover:border-gold/50 transition group"
                  >
                    <span className="font-mono text-[0.62rem] text-gold uppercase tracking-wider block">
                      {link.category ?? 'Resource'}
                    </span>
                    <span className="text-xs font-serif text-ink group-hover:text-gold transition font-medium">
                      {link.title} &rarr;
                    </span>
                  </a>
                ))}
              </div>
            </div>

            <div className="card p-6 border-line bg-charcoal space-y-3">
              <span className="font-mono text-xs text-gold uppercase tracking-wider font-semibold">
                Direct Sovereign Support
              </span>
              <p className="text-xs text-muted leading-relaxed">
                Need urgent triage on an operational boundary or decision threshold?
              </p>
              <Link
                href="/meet"
                className="btn-gold w-full text-xs py-2.5 flex items-center justify-center gap-2"
              >
                <span>📅</span> Book Executive Alignment Call
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
