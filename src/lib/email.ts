import { Resend } from 'resend';

const OPERATOR_EMAIL = process.env.CONTACT_NOTIFICATION_EMAIL || 'jeremyashe@gmail.com';
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'The Architecture of Reality <onboarding@resend.dev>';

function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY || process.env.Resend_API_Key || process.env.RESEND_KEY;
  if (!apiKey || apiKey.trim().length === 0) {
    return null;
  }
  return new Resend(apiKey);
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export interface OperatorEmailAlertOptions {
  subject: string;
  badge?: string;
  headline: string;
  details: Array<{ label: string; value: string }>;
  bodyText?: string;
  ctaUrl?: string;
  ctaText?: string;
}

export async function sendOperatorAlert(options: OperatorEmailAlertOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const resend = getResendClient();
  const { subject, badge = 'OPERATOR TELEMETRY', headline, details, bodyText, ctaUrl, ctaText } = options;

  const html = `
    <div style="background-color: #07080a; color: #f4f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 36px 20px; max-width: 620px; margin: 0 auto; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
      <div style="border-bottom: 1px solid rgba(212,175,55,0.3); padding-bottom: 18px; margin-bottom: 24px;">
        <span style="font-family: monospace; font-size: 10px; letter-spacing: 0.25em; color: #d4af37; text-transform: uppercase; font-weight: bold;">
          ⚡ ${escapeHtml(badge)}
        </span>
        <h1 style="margin: 8px 0 0 0; font-size: 22px; color: #f4f4f6; font-weight: 600; line-height: 1.3;">
          ${escapeHtml(headline)}
        </h1>
      </div>

      <div style="background-color: #11141c; border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 20px; margin-bottom: 24px;">
        ${details
          .map(
            (d) => `
          <div style="margin-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.04); padding-bottom: 8px;">
            <span style="font-family: monospace; font-size: 11px; text-transform: uppercase; color: #94a3b8; display: block; margin-bottom: 3px;">
              ${escapeHtml(d.label)}
            </span>
            <span style="font-size: 14px; color: #f4f4f6; font-weight: 500;">
              ${escapeHtml(d.value)}
            </span>
          </div>`
          )
          .join('')}

        ${
          bodyText
            ? `
        <div style="margin-top: 16px; padding-top: 14px; border-top: 1px solid rgba(212,175,55,0.2);">
          <span style="font-family: monospace; font-size: 11px; text-transform: uppercase; color: #d4af37; display: block; margin-bottom: 6px;">
            Transmission Payload:
          </span>
          <p style="margin: 0; font-size: 13px; color: #cbd5e1; line-height: 1.6; white-space: pre-wrap;">
            ${escapeHtml(bodyText)}
          </p>
        </div>`
            : ''
        }
      </div>

      ${
        ctaUrl && ctaText
          ? `
      <div style="text-align: center; margin-bottom: 24px;">
        <a href="${ctaUrl}" style="background-color: #d4af37; color: #07080a; padding: 12px 28px; border-radius: 8px; font-weight: bold; font-size: 13px; text-decoration: none; display: inline-block;">
          ${escapeHtml(ctaText)} &rarr;
        </a>
      </div>`
          : ''
      }

      <div style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 16px; text-align: center;">
        <p style="margin: 0; font-family: monospace; font-size: 10px; color: #64748b; letter-spacing: 0.1em; text-transform: uppercase;">
          The Architecture of Reality &middot; Sovereign Life, Universal Law &middot; Private Operator Relay
        </p>
      </div>
    </div>
  `;

  if (!resend) {
    console.log(`[Email Dispatcher Fallback] RESEND_API_KEY unconfigured. Email not sent to ${OPERATOR_EMAIL}. Subject: "${subject}"`);
    return { success: false, error: 'RESEND_API_KEY is not configured in .env.local.' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: OPERATOR_EMAIL,
      subject: `[AoR Relay] ${subject}`,
      html,
    });

    if (error) {
      console.warn('[Email Dispatcher Error]:', error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown email dispatch error';
    console.warn('[Email Dispatcher Exception]:', message);
    return { success: false, error: message };
  }
}

/**
 * Dispatch notification when someone completes the 12-Question Energy Audit
 */
export async function sendAuditNotification(auditData: {
  email?: string | null;
  scores: { mind: number; body: number; soul: number; total?: number };
  drift: string;
  weakestSector: string;
  operationalScope?: string;
  submissionId: string;
  directiveHeadline?: string;
}) {
  const { email, scores, drift, weakestSector, operationalScope = 'individual', submissionId, directiveHeadline } = auditData;

  const totalScore = scores.total ?? (scores.mind + scores.body + scores.soul);

  return sendOperatorAlert({
    badge: '12-QUESTION ENERGY AUDIT COMPLETED',
    subject: `New Energy Audit Completed — ${email || 'Anonymous Participant'} (Score: ${totalScore}/60)`,
    headline: `Energy Audit Diagnostic Captured`,
    details: [
      { label: 'Participant Email', value: email || 'Anonymous (No email entered)' },
      { label: 'Weakest Sector', value: `${weakestSector.toUpperCase()} (Primary Leak)` },
      { label: 'Drift Tendency', value: `${drift.toUpperCase()} POLARITY` },
      { label: 'Sector Scores', value: `Mind: ${scores.mind}/20 · Body: ${scores.body}/20 · Soul: ${scores.soul}/20 (Total: ${totalScore}/60)` },
      { label: 'Operational Scope', value: operationalScope === 'enterprise' ? 'Enterprise / Business Systems' : 'Individual Life & Energy' },
      { label: 'Submission ID', value: submissionId },
    ],
    bodyText: directiveHeadline ? `Assigned 72-Hour Calibration Directive:\n"${directiveHeadline}"` : undefined,
    ctaUrl: 'http://localhost:3000/operator',
    ctaText: 'Inspect in Operator Vault',
  });
}

/**
 * Dispatch applicant's 72-Hour Calibration Directive and scorecard directly to their email
 */
export async function sendAuditApplicantEmail(applicantData: {
  toEmail: string;
  scores: { mind: number; body: number; soul: number; total?: number };
  drift: string;
  weakestSector: string;
  directive: {
    headline: string;
    principle: string;
    phases: Array<{ window: string; title: string; actions: string[] }>;
  };
  recommendedPath?: string;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const resend = getResendClient();
  const { toEmail, scores, drift, weakestSector, directive } = applicantData;

  const totalScore = scores.total ?? (scores.mind + scores.body + scores.soul);

  const phasesHtml = directive.phases
    .map(
      (p) => `
    <div style="margin-top: 14px; padding: 14px; background-color: #171b26; border-radius: 8px; border-left: 3px solid #d4af37;">
      <span style="font-family: monospace; font-size: 11px; color: #d4af37; text-transform: uppercase; font-weight: bold; display: block; margin-bottom: 4px;">
        ${escapeHtml(p.window)} &middot; ${escapeHtml(p.title)}
      </span>
      <ul style="margin: 6px 0 0 16px; padding: 0; font-size: 13px; color: #cbd5e1; line-height: 1.6;">
        ${p.actions.map((a) => `<li>${escapeHtml(a)}</li>`).join('')}
      </ul>
    </div>`
    )
    .join('');

  const html = `
    <div style="background-color: #07080a; color: #f4f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 36px 20px; max-width: 620px; margin: 0 auto; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);">
      <div style="border-bottom: 1px solid rgba(212,175,55,0.3); padding-bottom: 18px; margin-bottom: 24px; text-align: center;">
        <span style="font-family: monospace; font-size: 10px; letter-spacing: 0.25em; color: #d4af37; text-transform: uppercase; font-weight: bold;">
          ⚡ THE ARCHITECTURE OF REALITY &middot; DIAGNOSTIC REPORT
        </span>
        <h1 style="margin: 10px 0 0 0; font-size: 22px; color: #f4f4f6; font-weight: 600; line-height: 1.3;">
          Your 72-Hour Calibration Directive
        </h1>
      </div>

      <div style="background-color: #11141c; border: 1px solid rgba(255,255,255,0.08); border-radius: 8px; padding: 20px; margin-bottom: 24px;">
        <div style="border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 12px; margin-bottom: 14px;">
          <p style="margin: 0 0 6px 0; font-family: monospace; font-size: 12px; color: #94a3b8;">
            PRIMARY LEAK: <span style="color: #f87171; font-weight: bold;">${escapeHtml(weakestSector.toUpperCase())}</span> &middot; 
            POLARITY: <span style="color: #fbbf24; font-weight: bold;">${escapeHtml(drift.toUpperCase())}</span> &middot; 
            SCORE: <span style="color: #34d399; font-weight: bold;">${totalScore}/60</span>
          </p>
          <p style="margin: 0; font-size: 11px; color: #64748b; font-family: monospace;">
            Mind: ${scores.mind}/20 &middot; Body: ${scores.body}/20 &middot; Soul: ${scores.soul}/20
          </p>
        </div>

        <div style="border-top: 1px solid rgba(212,175,55,0.25); padding-top: 14px;">
          <span style="font-family: monospace; font-size: 10px; color: #d4af37; text-transform: uppercase; font-weight: bold; letter-spacing: 0.1em;">
            Governing Law: ${escapeHtml(directive.principle)}
          </span>
          <h2 style="margin: 6px 0 10px 0; font-size: 17px; color: #f4f4f6; font-weight: 600;">
            ${escapeHtml(directive.headline)}
          </h2>
          ${phasesHtml}
        </div>
      </div>

      <div style="text-align: center; margin-bottom: 24px;">
        <a href="http://localhost:3000/library" style="background-color: #d4af37; color: #07080a; padding: 12px 28px; border-radius: 8px; font-weight: bold; font-size: 13px; text-decoration: none; display: inline-block;">
          Access the Free Reading Room &rarr;
        </a>
      </div>

      <div style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 16px; text-align: center;">
        <p style="margin: 0; font-family: monospace; font-size: 10px; color: #64748b; letter-spacing: 0.1em; text-transform: uppercase;">
          The Architecture of Reality &middot; Jeremy Ashe &middot; Universal Law & Sovereign Systems
        </p>
      </div>
    </div>
  `;

  if (!resend) {
    return { success: false, error: 'Resend API key missing.' };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: toEmail,
      subject: `Your 72-Hour Calibration Directive — The Architecture of Reality`,
      html,
    });

    if (error) {
      console.warn('[Applicant Email Error]:', error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown email dispatch error';
    console.warn('[Applicant Email Exception]:', message);
    return { success: false, error: message };
  }
}

/**
 * Dispatch notification when someone submits the Founder Vetting Application on /meet
 */
export async function sendConsultancyApplicationAlert(appData: {
  fullName: string;
  email: string;
  companyName: string;
  businessSector: string;
  currentWeeklyHours: number;
  missionAlignment: string;
  primaryBottleneck: string;
  qualificationStatus: string;
  applicationId: string;
}) {
  const {
    fullName,
    email,
    companyName,
    businessSector,
    currentWeeklyHours,
    missionAlignment,
    primaryBottleneck,
    qualificationStatus,
    applicationId,
  } = appData;

  const isQualified = qualificationStatus === 'qualified';

  return sendOperatorAlert({
    badge: isQualified ? 'QUALIFIED FOUNDER VETTING APPLICATION' : 'NEW FOUNDER APPLICATION (NURTURE)',
    subject: `[Founder Application] ${companyName} (${fullName}) — ${currentWeeklyHours} hrs/wk [${qualificationStatus.toUpperCase()}]`,
    headline: `${fullName} from ${companyName} Applied for Bespoke Advisory`,
    details: [
      { label: 'Founder Name', value: fullName },
      { label: 'Direct Email', value: email },
      { label: 'Company / Organization', value: companyName },
      { label: 'Business Sector', value: businessSector.replace('_', ' ').toUpperCase() },
      { label: 'Current Weekly Load', value: `${currentWeeklyHours} hours/week (Target: 20 hrs/week)` },
      { label: 'Qualification Status', value: qualificationStatus.toUpperCase() },
      { label: 'Application ID', value: applicationId },
    ],
    bodyText: `Mission Alignment:\n${missionAlignment}\n\nPrimary Bottleneck:\n${primaryBottleneck}`,
    ctaUrl: `mailto:${email}`,
    ctaText: 'Reply Directly to Founder',
  });
}

/**
 * Dispatch notification when someone books a 1-on-1 strategy video call on /members
 */
export async function sendVideoBookingAlert(bookingData: {
  memberId: string;
  callNumber: number;
  topic: string;
  scheduledDate: string;
}) {
  const { memberId, callNumber, topic, scheduledDate } = bookingData;

  return sendOperatorAlert({
    badge: 'VIDEO STRATEGY SESSION SCHEDULED',
    subject: `Video Call #${callNumber} Scheduled by ${memberId} (${scheduledDate})`,
    headline: `1-on-1 Strategy Session Booked on Google Meet`,
    details: [
      { label: 'Member User ID', value: memberId },
      { label: 'Call Allowance', value: `Call #${callNumber} of 3 included sessions` },
      { label: 'Requested Date', value: scheduledDate },
      { label: 'Calibration Topic', value: topic },
    ],
    bodyText: `The member has booked their 30-minute video session on Google Meet. Calendar invitation and link have been verified in the Member Vault.`,
    ctaUrl: 'https://meet.google.com',
    ctaText: 'Open Google Meet Room',
  });
}

/**
 * 1-Click Test Ping to confirm Resend live inbox delivery
 */
export async function sendTestPingEmail(): Promise<{ success: boolean; messageId?: string; error?: string }> {
  return sendOperatorAlert({
    badge: 'LIVE OPERATOR INBOX HANDSHAKE',
    subject: `Operator Inbox Verification Test (${new Date().toLocaleTimeString('en-US')})`,
    headline: `System Handshake Confirmed for Jeremy Ashe`,
    details: [
      { label: 'Target Inbox', value: OPERATOR_EMAIL },
      { label: 'Resend From Relay', value: FROM_EMAIL },
      { label: 'Handshake Timestamp', value: new Date().toISOString() },
      { label: 'Status', value: 'Live · Full Resend Pipeline Operational ✓' },
    ],
    bodyText: `This confirms that your Resend API key is authentic, active, and successfully relaying all platform notifications directly to ${OPERATOR_EMAIL}.\n\nYou will automatically receive notifications whenever someone completes an Energy Audit, applies for Founder Vetting, submits a contact inquiry, or books a video strategy call.`,
    ctaUrl: 'http://localhost:3000/operator',
    ctaText: 'Return to Operator Vault',
  });
}
