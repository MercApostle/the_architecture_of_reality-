import { Suspense } from 'react';
import type { Metadata } from 'next';
import {
  getRegisteredMembers,
  getOperatorRadar,
  getVideoCallBookings,
  isOperatorAuthorized,
} from '@/lib/actions/operator.actions';
import { getAllDispatchesForOperator, getSiteSettingsAction } from '@/lib/actions/content.actions';
import OperatorVault from '@/components/operator/OperatorVault';

export const metadata: Metadata = {
  title: 'Sovereign Operator Vault · Jeremy Ashe Root Command',
  description: 'Private root-level control center exclusively for Jeremy Ashe. Member surveillance, real-time website updates, telemetry radar, and email dispatches.',
};

async function OperatorContent() {
  const isAuthorized = await isOperatorAuthorized();

  const [members, activityLogs, bookings, dispatches, siteSettings] = await Promise.all([
    isAuthorized ? getRegisteredMembers() : Promise.resolve([]),
    isAuthorized ? getOperatorRadar() : Promise.resolve([]),
    isAuthorized ? getVideoCallBookings() : Promise.resolve([]),
    getAllDispatchesForOperator(),
    getSiteSettingsAction(),
  ]);

  return (
    <OperatorVault
      initialMembers={members}
      initialActivityLogs={activityLogs}
      initialBookings={bookings}
      initialDispatches={dispatches}
      initialSiteSettings={siteSettings}
      initialUnlocked={isAuthorized}
    />
  );
}

export default function OperatorPage() {
  return (
    <div className="min-h-screen bg-obsidian text-ink">
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full" />
          </div>
        }
      >
        <OperatorContent />
      </Suspense>
    </div>
  );
}
