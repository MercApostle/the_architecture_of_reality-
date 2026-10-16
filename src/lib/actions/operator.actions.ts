'use server';

import fs from 'fs';
import path from 'path';
import { revalidatePath } from 'next/cache';
import { createClient as createServerSupabase } from '@/lib/supabase/server';
import type { ActivityLog, VideoCallBooking } from '@/lib/supabase/types';

export interface AdminMemberRecord {
  id: string;
  name: string;
  email: string;
  tier: 'free' | 'paid' | 'sovereign_50';
  role: 'member' | 'operator' | 'admin';
  points: number;
  rank: string;
  meetingCreditsRemaining: number;
  memberSince: string;
  operatorNotes: string;
}

const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'registered-members.json');

function calculateRank(points: number): string {
  if (points < 500) return 'Initiate';
  if (points < 2000) return 'Apprentice Builder';
  if (points < 5000) return 'Systems Architect';
  return 'Sovereign Master';
}

function readLocalMembers(): AdminMemberRecord[] {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      const raw = JSON.parse(content);
      if (Array.isArray(raw)) {
        return raw.map((item) => ({
          id: item.id || item.name || 'member',
          name: item.name || item.id || 'Anonymous Member',
          email: item.email || 'unknown@domain.com',
          tier: item.tier === 'paid' ? 'paid' : 'free',
          role: (item.role as 'member' | 'operator' | 'admin') || (item.email?.includes('jeremyashe') ? 'operator' : 'member'),
          points: typeof item.points === 'number' ? item.points : 50,
          rank: calculateRank(item.points || 50),
          meetingCreditsRemaining: typeof item.meetingCreditsRemaining === 'number' ? item.meetingCreditsRemaining : 3,
          memberSince: item.memberSince || 'October 2026',
          operatorNotes: item.operatorNotes || '',
        }));
      }
    }
  } catch (err) {
    console.warn('[Operator Actions] Error reading registered-members.json:', err);
  }

  return [
    {
      id: 'Marcus Sterling',
      name: 'Marcus Sterling',
      email: 'member@architectureofreality.com',
      tier: 'paid',
      role: 'member',
      points: 275,
      rank: 'Initiate',
      meetingCreditsRemaining: 2,
      memberSince: 'March 2026',
      operatorNotes: 'High-functioning ecommerce founder. Defaulting into forcing polarity on inventory cycles.',
    },
    {
      id: 'MercApostle',
      name: 'Jeremy Ashe',
      email: 'jeremyashe@gmail.com',
      tier: 'paid',
      role: 'operator',
      points: 5000,
      rank: 'Sovereign Master',
      meetingCreditsRemaining: 3,
      memberSince: 'October 2026',
      operatorNotes: 'Principal Systems Architect & Founder. All-access root permissions.',
    },
  ];
}

function writeLocalMembers(members: AdminMemberRecord[]): void {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(members, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[Operator Actions] Error saving registered-members.json:', err);
  }
}

export async function getRegisteredMembers(): Promise<AdminMemberRecord[]> {
  try {
    const supabase = await createServerSupabase();
    if (supabase) {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('total_points', { ascending: false });

      if (!error && profiles && profiles.length > 0) {
        return profiles.map((p) => ({
          id: p.id,
          name: p.full_name || p.user_handle || p.email,
          email: p.email,
          tier: p.tier === 'sovereign_50' ? 'paid' : 'free',
          role: (p.role as 'member' | 'operator' | 'admin') || 'member',
          points: p.total_points || 50,
          rank: calculateRank(p.total_points || 50),
          meetingCreditsRemaining: p.video_calls_remaining ?? 3,
          memberSince: p.joined_at ? new Date(p.joined_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'October 2026',
          operatorNotes: p.operator_notes || '',
        }));
      }
    }
  } catch (err) {
    console.warn('[Operator Actions] Supabase fallback to local members:', err);
  }

  return readLocalMembers();
}

export async function updateMemberOperatorNotes(
  memberId: string,
  operatorNotes: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. Update Supabase if available
    try {
      const supabase = await createServerSupabase();
      if (supabase) {
        await supabase
          .from('profiles')
          .update({ operator_notes: operatorNotes })
          .eq('id', memberId);
      }
    } catch {}

    // 2. Update local storage file
    const local = readLocalMembers();
    const idx = local.findIndex((m) => m.id === memberId || m.name === memberId);
    if (idx >= 0) {
      local[idx].operatorNotes = operatorNotes;
    } else {
      local.push({
        id: memberId,
        name: memberId,
        email: 'member@domain.com',
        tier: 'paid',
        role: 'member',
        points: 500,
        rank: 'Apprentice Builder',
        meetingCreditsRemaining: 3,
        memberSince: 'October 2026',
        operatorNotes,
      });
    }
    writeLocalMembers(local);
    revalidatePath('/admin');
    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update operator notes';
    return { success: false, error: message };
  }
}

export async function getOperatorRadar(): Promise<ActivityLog[]> {
  try {
    const supabase = await createServerSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from('activity_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(25);

      if (!error && data && data.length > 0) {
        return data as ActivityLog[];
      }
    }
  } catch (err) {
    console.warn('[Operator Actions] Fallback to seeded activity logs:', err);
  }

  // Seeded Activity Radar Stream
  const now = 1792172400000;
  return [
    {
      id: 'act-01',
      user_id: 'Marcus Sterling',
      action_type: 'quest_completed',
      metadata: { quest_title: 'Assimilate: Shav & False Speech', points: 25, category: 'DISPATCH' },
      created_at: new Date(now - 1000 * 60 * 12).toISOString(),
    },
    {
      id: 'act-02',
      user_id: 'David Sterling',
      action_type: 'audit_taken',
      metadata: { mind_score: 16, body_score: 11, soul_score: 14, drift: 'forcing' },
      created_at: new Date(now - 1000 * 60 * 45).toISOString(),
    },
    {
      id: 'act-03',
      user_id: 'Elena Rostova',
      action_type: 'pdf_downloaded',
      metadata: { title: 'Book I: The Master Blueprint', volume_slug: 'the-master-blueprint' },
      created_at: new Date(now - 1000 * 60 * 110).toISOString(),
    },
    {
      id: 'act-04',
      user_id: 'Jeremy Ashe',
      action_type: 'call_booked',
      metadata: { call_number: 1, topic: 'Energy & Time Calibration & Schedule Setup' },
      created_at: new Date(now - 1000 * 60 * 240).toISOString(),
    },
    {
      id: 'act-05',
      user_id: 'Marcus Sterling',
      action_type: 'module_completed',
      metadata: { module_number: 1, title: 'Master Lesson 1: The 80-Hour Work Month', points: 50 },
      created_at: new Date(now - 1000 * 60 * 480).toISOString(),
    },
  ];
}

export async function getVideoCallBookings(): Promise<VideoCallBooking[]> {
  try {
    const supabase = await createServerSupabase();
    if (supabase) {
      const { data, error } = await supabase
        .from('video_call_bookings')
        .select('*')
        .order('scheduled_for', { ascending: true });

      if (!error && data && data.length > 0) {
        return data as VideoCallBooking[];
      }
    }
  } catch (err) {
    console.warn('[Operator Actions] Fallback to seeded video bookings:', err);
  }

  const now = 1792172400000;
  return [
    {
      id: 'vcb-01',
      user_id: 'Marcus Sterling',
      cal_booking_uid: 'cal_live_938472',
      scheduled_for: new Date(now + 86400000 * 3).toISOString(),
      status: 'scheduled',
      session_notes: 'Initial 80-Hour calendar setup. Evaluate 4-hour daily vector boundaries.',
      created_at: new Date(now - 86400000).toISOString(),
    },
    {
      id: 'vcb-02',
      user_id: 'Elena Rostova',
      cal_booking_uid: 'cal_live_109283',
      scheduled_for: new Date(now + 86400000 * 6).toISOString(),
      status: 'scheduled',
      session_notes: 'Reviewing 10 Operational Firewalls against high-demand enterprise software clients.',
      created_at: new Date(now - 86400000 * 2).toISOString(),
    },
  ];
}
