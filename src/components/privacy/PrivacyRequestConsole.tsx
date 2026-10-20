'use client';

import React, { useState } from 'react';
import { exportUserDataAction, requestDataDeletionAction } from '@/lib/actions/compliance.actions';

export default function PrivacyRequestConsole() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState<string | null>(null);
  const [exportedJson, setExportedJson] = useState<string | null>(null);

  const handleExport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setMessage('Please enter a valid email address.');
      setStatus('error');
      return;
    }

    setStatus('loading');
    setMessage(null);
    setExportedJson(null);

    const res = await exportUserDataAction(email);
    if (res.success && res.data) {
      setStatus('success');
      setMessage(res.message || 'Personal data archive compiled.');
      setExportedJson(JSON.stringify(res.data, null, 2));
    } else {
      setStatus('error');
      setMessage(res.error || 'Could not compile personal data.');
    }
  };

  const handleDelete = async () => {
    if (!email.trim() || !email.includes('@')) {
      setMessage('Please enter a valid email address to request erasure.');
      setStatus('error');
      return;
    }

    const confirmed = confirm(
      `Are you sure you want to permanently delete all personal records for "${email}" pursuant to BC PIPA Section 35? This action cannot be reversed.`
    );
    if (!confirmed) return;

    setStatus('loading');
    setMessage(null);
    setExportedJson(null);

    const res = await requestDataDeletionAction(email);
    if (res.success) {
      setStatus('success');
      setMessage(res.message || 'Records permanently erased from systems.');
    } else {
      setStatus('error');
      setMessage(res.error || 'Failed to complete erasure request.');
    }
  };

  const handleDownloadJson = () => {
    if (!exportedJson) return;
    const blob = new Blob([exportedJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bc-pipa-data-export-${email.replace(/[@.]/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="card p-6 sm:p-8 border-line bg-charcoal space-y-6">
      <form onSubmit={handleExport} className="space-y-4">
        <div className="space-y-1.5">
          <label className="font-mono text-xs text-muted uppercase tracking-wider block">
            Subject Email Address
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. member@architectureofreality.com"
              className="flex-1 rounded-xl border border-line bg-obsidian px-4 py-2.5 text-xs text-ink placeholder:text-faint focus:border-gold focus:outline-none"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="btn-gold py-2.5 px-5 text-xs font-semibold cursor-pointer shrink-0 disabled:opacity-50"
            >
              {status === 'loading' ? 'Processing…' : 'Export My Data (JSON) →'}
            </button>
            <button
              type="button"
              disabled={status === 'loading'}
              onClick={handleDelete}
              className="btn-ghost py-2.5 px-4 text-xs text-rose-400 hover:text-rose-300 border border-rose-500/30 hover:border-rose-500/60 cursor-pointer shrink-0 disabled:opacity-50"
            >
              Request Data Deletion
            </button>
          </div>
        </div>
      </form>

      {message && (
        <div
          className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
            status === 'success'
              ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
              : 'border-rose-500/40 bg-rose-500/10 text-rose-300'
          }`}
        >
          {message}
        </div>
      )}

      {exportedJson && (
        <div className="space-y-3 pt-2 border-t border-line">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-gold uppercase tracking-wider">
              Compiled Personal Data (BC PIPA Section 23):
            </span>
            <button
              type="button"
              onClick={handleDownloadJson}
              className="font-mono text-xs text-gold hover:underline cursor-pointer"
            >
              📥 Download .json File
            </button>
          </div>
          <pre className="bg-obsidian border border-line rounded-xl p-4 text-[0.7rem] font-mono text-ink/90 overflow-x-auto max-h-60 leading-relaxed">
            <code>{exportedJson}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
