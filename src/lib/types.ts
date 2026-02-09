export interface SecurityAssessRequest {
  flags: string[];
  additionalContext: string;
}

export interface SecurityAssessResponse {
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  assessment: string;
  supervisorNotification: string;
  ticketDocumentation: string;
}

export const SECURITY_FLAGS = [
  'Caller could not verify their full name',
  'Caller failed security questions',
  'Caller refused to provide employee ID',
  'Caller is requesting access to another user\'s account',
  'Caller is requesting password reset for a VIP/admin account',
  'Caller is pressuring for immediate action / urgency',
  'Caller\'s phone number doesn\'t match records',
  'Caller has unusual knowledge of internal systems',
  'Request involves disabling security features (MFA, etc.)',
] as const;

export type SecurityFlag = (typeof SECURITY_FLAGS)[number];

export function getRiskLevelFromScore(score: number): 'LOW' | 'MEDIUM' | 'HIGH' {
  if (score <= 3) return 'LOW';
  if (score <= 6) return 'MEDIUM';
  return 'HIGH';
}

export function getRiskColor(level: 'LOW' | 'MEDIUM' | 'HIGH'): string {
  switch (level) {
    case 'LOW':
      return '#10b981'; // emerald-500
    case 'MEDIUM':
      return '#f59e0b'; // amber-500
    case 'HIGH':
      return '#f43f5e'; // rose-500
  }
}
