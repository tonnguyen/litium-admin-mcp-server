export interface AuditLogEntry {
  timestamp: string;
  correlationId: string;
  action: string;
  args: Record<string, unknown>;
  durationMs: number;
  success: boolean;
  errorCode?: string;
  userId?: string;
}

class AuditLogger {
  private logs: AuditLogEntry[] = [];
  private maxSize = 1000;

  log(entry: AuditLogEntry): void {
    this.logs.push(entry);
    if (this.logs.length > this.maxSize) {
      this.logs.shift();
    }
    console.log(`[AUDIT] ${entry.timestamp} ${entry.correlationId} ${entry.action} ${entry.success ? 'OK' : 'FAIL'} ${entry.durationMs}ms`);
  }

  getRecent(limit = 50): AuditLogEntry[] {
    return this.logs.slice(-limit);
  }
}

export const auditLogger = new AuditLogger();

export function generateCorrelationId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function sanitizeArgs(args: Record<string, unknown>): Record<string, unknown> {
  const sanitized = { ...args };
  // Redact sensitive fields
  if ('value' in sanitized) sanitized.value = '***REDACTED***';
  if ('password' in sanitized) sanitized.password = '***REDACTED***';
  if ('secret' in sanitized) sanitized.secret = '***REDACTED***';
  if ('certificate' in sanitized) sanitized.certificate = '***REDACTED***';
  return sanitized;
}
