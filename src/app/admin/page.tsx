import { Suspense } from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { getStoredApplications } from '@/lib/actions/consultancy.actions';
import { getClientProjectData } from '@/lib/queries/consultancy.queries';
import {
  getRegisteredMembers,
  getOperatorRadar,
  getVideoCallBookings,
  isOperatorAuthorized,
} from '@/lib/actions/operator.actions';
import { PageHero } from '@/components/ui/primitives';

export const metadata: Metadata = {
  title: 'Operator Command Center & Member Vault · The Architecture of Reality',
  description:
    'Internal management command center to monitor real-time member progression, inspect the activity radar, manage video bookings, and review founder applications.',
};

async function AdminContent() {
  const isAuthorized = await isOperatorAuthorized();
  if (!isAuthorized) {
    redirect('/operator');
  }

  const [applications, clientData, members, activityLogs, videoBookings] =
    await Promise.all([
      getStoredApplications(),
      getClientProjectData(),
      getRegisteredMembers(),
      getOperatorRadar(),
      getVideoCallBookings(),
    ]);

  return (
    <AdminDashboard
      initialApplications={applications}
      initialClientData={clientData}
      initialMembers={members}
      initialActivityLogs={activityLogs}
      initialBookings={videoBookings}
    />
  );
}

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-obsidian text-ink">
      <PageHero
        eyebrow="Root Level Access"
        title={
          <>
            Operator <span className="text-gradient-gold italic">Command Center</span>
          </>
        }
        lede="Unified command center: track real-time member progression across the 10,000 pt threshold, inspect the chronological activity radar, view Cal.com video bookings, and review qualified applications."
      />

      <section className="container-x py-12">
        <Suspense
          fallback={
            <div className="min-h-[400px] flex items-center justify-center">
              <div className="animate-spin w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full" />
            </div>
          }
        >
          <AdminContent />
        </Suspense>
      </section>
    </div>
  );
}
