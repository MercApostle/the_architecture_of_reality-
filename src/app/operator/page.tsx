import type { Metadata } from 'next';
import { getRegisteredMembers, getOperatorRadar, getVideoCallBookings } from '@/lib/actions/operator.actions';
import { getAllDispatchesForOperator, getSiteSettingsAction } from '@/lib/actions/content.actions';
import OperatorVault from '@/components/operator/OperatorVault';

export const metadata: Metadata = {
  title: 'Sovereign Operator Vault · Jeremy Ashe Root Command',
  description: 'Private root-level control center exclusively for Jeremy Ashe. Member surveillance, real-time website updates, telemetry radar, and email dispatches.',
};

export default async function OperatorPage() {
  const [members, activityLogs, bookings, dispatches, siteSettings] = await Promise.all([
    getRegisteredMembers(),
    getOperatorRadar(),
    getVideoCallBookings(),
    getAllDispatchesForOperator(),
    getSiteSettingsAction(),
  ]);

  return (
    <div className="min-h-screen bg-obsidian text-ink">
      <OperatorVault
        initialMembers={members}
        initialActivityLogs={activityLogs}
        initialBookings={bookings}
        initialDispatches={dispatches}
        initialSiteSettings={siteSettings}
      />
    </div>
  );
}
