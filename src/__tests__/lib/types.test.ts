import {
  getRiskLevelFromScore,
  getRiskColor,
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
    it('returns green color for LOW risk', () => {
      expect(getRiskColor('LOW')).toBe('#00E676');
    });

    it('returns amber color for MEDIUM risk', () => {
      expect(getRiskColor('MEDIUM')).toBe('#FFB300');
    });

    it('returns red color for HIGH risk', () => {
      expect(getRiskColor('HIGH')).toBe('#FF3D57');
    });
  });
});
