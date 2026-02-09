export interface TroubleshootRequest {
  category: string;
  description: string;
}

export interface TroubleshootResponse {
  reasonForCall: string;
  troubleshootingSteps: string;
  ticketNotes: string;
  escalationCriteria: string;
}

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

export interface SessionHistoryItem {
  id: string;
  category: string;
  description: string;
  timestamp: Date;
  response?: string;
}

export const CATEGORIES = [
  'Password Reset / Account Lockout / SSPR',
  'MFA / Authenticator / RSA SecurID',
  'VPN / BIG-IP Edge Client',
  'SAP / SAP Fiori / SAP Work Manager',
  'Microsoft 365 (Outlook, Teams, OneDrive, SharePoint)',
  'Network / Internet / File Sharing',
  'Hardware (Monitor, Printer, Docking Station)',
  'Software Center / Install Issues',
  'Mobile Device (iPhone, Android, Tablet)',
  'CRS / Java Issues',
  'Field Apps (GFEE, WorkStudio, VegWorker, FieldSmart, MDT)',
  'MacOS Support',
  'BitLocker / McAfee Recovery',
  'Concur / Workday / SumTotal / UKG',
  'VDI / Remote Desktop',
  'Cybersecurity Concern',
  'Other / General',
] as const;

export type Category = (typeof CATEGORIES)[number];

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
