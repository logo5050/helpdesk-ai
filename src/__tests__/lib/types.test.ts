import {
  getRiskLevelFromScore,
  getRiskColor,
  CATEGORIES,
  SECURITY_FLAGS
} from '@/lib/types';

describe('types', () => {
  describe('getRiskLevelFromScore', () => {
    it('returns LOW for scores 1-3', () => {
      expect(getRiskLevelFromScore(1)).toBe('LOW');
      expect(getRiskLevelFromScore(2)).toBe('LOW');
      expect(getRiskLevelFromScore(3)).toBe('LOW');
    });

    it('returns MEDIUM for scores 4-6', () => {
      expect(getRiskLevelFromScore(4)).toBe('MEDIUM');
      expect(getRiskLevelFromScore(5)).toBe('MEDIUM');
      expect(getRiskLevelFromScore(6)).toBe('MEDIUM');
    });

    it('returns HIGH for scores 7-10', () => {
      expect(getRiskLevelFromScore(7)).toBe('HIGH');
      expect(getRiskLevelFromScore(8)).toBe('HIGH');
      expect(getRiskLevelFromScore(9)).toBe('HIGH');
      expect(getRiskLevelFromScore(10)).toBe('HIGH');
    });
  });

  describe('getRiskColor', () => {
    it('returns emerald color for LOW risk', () => {
      expect(getRiskColor('LOW')).toBe('#10b981');
    });

    it('returns amber color for MEDIUM risk', () => {
      expect(getRiskColor('MEDIUM')).toBe('#f59e0b');
    });

    it('returns rose color for HIGH risk', () => {
      expect(getRiskColor('HIGH')).toBe('#f43f5e');
    });
  });

  describe('CATEGORIES', () => {
    it('contains all 17 categories', () => {
      expect(CATEGORIES).toHaveLength(17);
    });

    it('includes expected categories', () => {
      expect(CATEGORIES).toContain('Password Reset / Account Lockout / SSPR');
      expect(CATEGORIES).toContain('MFA / Authenticator / RSA SecurID');
      expect(CATEGORIES).toContain('VPN / BIG-IP Edge Client');
      expect(CATEGORIES).toContain('Microsoft 365 (Outlook, Teams, OneDrive, SharePoint)');
      expect(CATEGORIES).toContain('Cybersecurity Concern');
      expect(CATEGORIES).toContain('Other / General');
    });
  });

  describe('SECURITY_FLAGS', () => {
    it('contains all 9 security flags', () => {
      expect(SECURITY_FLAGS).toHaveLength(9);
    });

    it('includes expected flags', () => {
      expect(SECURITY_FLAGS).toContain('Caller could not verify their full name');
      expect(SECURITY_FLAGS).toContain('Caller failed security questions');
      expect(SECURITY_FLAGS).toContain('Caller is requesting password reset for a VIP/admin account');
      expect(SECURITY_FLAGS).toContain('Request involves disabling security features (MFA, etc.)');
    });
  });
});
