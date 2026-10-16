import type { Metadata } from 'next';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { getStoredApplications } from '@/lib/actions/consultancy.actions';
import { getClientProjectData } from '@/lib/queries/consultancy.queries';
import {
  getRegisteredMembers,
  getOperatorRadar,
  getVideoCallBookings,
} from '@/lib/actions/operator.actions';
import { PageHero } from '@/components/ui/primitives';

export const metadata: Metadata = {
  title: 'Operator Command Center & Member Vault · The Architecture of Reality',
  description:
    'Internal management command center to monitor real-time member progression, inspect the activity radar, manage video bookings, and review founder applications.',
};

export default async function AdminPage() {
  const [applications, clientData, members, activityLogs, videoBookings] =
    await Promise.all([
      getStoredApplications(),
      getClientProjectData(),
      getRegisteredMembers(),
      getOperatorRadar(),
      getVideoCallBookings(),
    ]);

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
        <AdminDashboard
          initialApplications={applications}
          initialClientData={clientData}
          initialMembers={members}
          initialActivityLogs={activityLogs}
          initialBookings={videoBookings}
        />
      </section>
    </div>
  );
}
