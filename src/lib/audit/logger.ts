/**
 * Structured Server Audit Logger
 * 
 * Complies with British Columbia PIPA and Canadian Privacy Standards by recording
 * structured, immutable logs for critical security events, data subject requests,
 * and access control enforcement.
 */

export type AuditSeverity = 'INFO' | 'WARN' | 'SECURITY' | 'ERROR';

export type ComplianceCategory =
  | 'BC_PIPA_DATA_ACCESS'
  | 'BC_PIPA_DATA_CORRECTION'
  | 'BC_PIPA_DATA_DELETION'
  | 'SECURITY_RATE_LIMIT'
  | 'SECURITY_AUTH_ATTEMPT'
  | 'SECURITY_BOT_BLOCKED'
  | 'OPERATOR_VAULT_CLEARANCE'
  | 'COMMERCE_TRANSACTION';

export interface AuditLogEntry {
  timestamp: string;
  severity: AuditSeverity;
  category: ComplianceCategory;
  action: string;
  actor: {
    identifier: string; // User ID, email hash, or IP
    type: 'USER' | 'OPERATOR' | 'ANONYMOUS_CLIENT' | 'SYSTEM' | 'BOT';
  };
  details: Record<string, unknown>;
  environment: string;
}

export function logAudit(
  severity: AuditSeverity,
  category: ComplianceCategory,
  action: string,
  actor: { identifier: string; type: 'USER' | 'OPERATOR' | 'ANONYMOUS_CLIENT' | 'SYSTEM' | 'BOT' },
  details: Record<string, unknown> = {}
): void {
  const entry: AuditLogEntry = {
    timestamp: new Date().toISOString(),
    severity,
    category,
    action,
    actor,
    details,
    environment: process.env.NODE_ENV || 'development',
  };

  const formattedLog = `[AUDIT_LOG] ${JSON.stringify(entry)}`;

  switch (severity) {
    case 'SECURITY':
    case 'ERROR':
      console.error(formattedLog);
      break;
    case 'WARN':
      console.warn(formattedLog);
      break;
    case 'INFO':
    default:
      console.log(formattedLog);
      break;
  }
}

export function logRateLimitTrigger(ip: string, route: string, remaining: number): void {
  logAudit(
    'SECURITY',
    'SECURITY_RATE_LIMIT',
    'RATE_LIMIT_EXCEEDED',
    { identifier: ip, type: 'ANONYMOUS_CLIENT' },
    { route, remaining, status: 429 }
  );
}

export function logBotBlocked(ip: string, userAgent: string, route: string): void {
  logAudit(
    'SECURITY',
    'SECURITY_BOT_BLOCKED',
    'KNOWN_BOT_ACCESS_DENIED',
    { identifier: ip, type: 'BOT' },
    { userAgent, route, status: 403 }
  );
}

export function logOperatorClearanceAttempt(
  actorEmail: string,
  success: boolean,
  method: string
): void {
  logAudit(
    success ? 'INFO' : 'SECURITY',
    'OPERATOR_VAULT_CLEARANCE',
    success ? 'OPERATOR_AUTHENTICATED' : 'OPERATOR_AUTH_DENIED',
    { identifier: actorEmail, type: 'OPERATOR' },
    { method, success }
  );
}

export function logComplianceRequest(
  category: 'BC_PIPA_DATA_ACCESS' | 'BC_PIPA_DATA_CORRECTION' | 'BC_PIPA_DATA_DELETION',
  subjectEmail: string,
  status: 'RECEIVED' | 'FULFILLED' | 'REJECTED',
  meta: Record<string, unknown> = {}
): void {
  logAudit(
    'INFO',
    category,
    `SUBJECT_RIGHT_${status}`,
    { identifier: subjectEmail, type: 'USER' },
    meta
  );
}
