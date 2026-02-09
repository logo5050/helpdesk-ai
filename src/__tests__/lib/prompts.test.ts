import {
  TROUBLESHOOT_SYSTEM_PROMPT,
  CYBERSECURITY_SYSTEM_PROMPT
} from '@/lib/prompts';

describe('prompts', () => {
  describe('TROUBLESHOOT_SYSTEM_PROMPT', () => {
    it('is defined and non-empty', () => {
      expect(TROUBLESHOOT_SYSTEM_PROMPT).toBeDefined();
      expect(TROUBLESHOOT_SYSTEM_PROMPT.length).toBeGreaterThan(100);
    });

    it('contains required section headers', () => {
      expect(TROUBLESHOOT_SYSTEM_PROMPT).toContain('REASON FOR THE CALL');
      expect(TROUBLESHOOT_SYSTEM_PROMPT).toContain('TROUBLESHOOTING STEPS');
      expect(TROUBLESHOOT_SYSTEM_PROMPT).toContain('TICKET NOTES');
      expect(TROUBLESHOOT_SYSTEM_PROMPT).toContain('ESCALATION CRITERIA');
    });

    it('mentions enterprise context', () => {
      expect(TROUBLESHOOT_SYSTEM_PROMPT).toContain('enterprise');
    });

    it('mentions common tools and systems', () => {
      expect(TROUBLESHOOT_SYSTEM_PROMPT).toContain('Active Directory');
      expect(TROUBLESHOOT_SYSTEM_PROMPT).toContain('Microsoft 365');
    });
  });

  describe('CYBERSECURITY_SYSTEM_PROMPT', () => {
    it('is defined and non-empty', () => {
      expect(CYBERSECURITY_SYSTEM_PROMPT).toBeDefined();
      expect(CYBERSECURITY_SYSTEM_PROMPT.length).toBeGreaterThan(100);
    });

    it('contains risk score guidance', () => {
      expect(CYBERSECURITY_SYSTEM_PROMPT).toContain('RISK SCORE');
      expect(CYBERSECURITY_SYSTEM_PROMPT).toContain('1-3');
      expect(CYBERSECURITY_SYSTEM_PROMPT).toContain('4-6');
      expect(CYBERSECURITY_SYSTEM_PROMPT).toContain('7-10');
    });

    it('contains required documentation sections', () => {
      expect(CYBERSECURITY_SYSTEM_PROMPT).toContain('SUPERVISOR NOTIFICATION');
      expect(CYBERSECURITY_SYSTEM_PROMPT).toContain('TICKET DOCUMENTATION');
    });

    it('mentions social engineering', () => {
      expect(CYBERSECURITY_SYSTEM_PROMPT).toContain('social engineering');
    });
  });
});
