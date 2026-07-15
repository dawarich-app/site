import { describe, it, expect } from 'vitest';
import { expectedCtr, CTR_BY_POSITION } from './ctrCurve.mjs';

describe('expectedCtr', () => {
  it('returns the tabulated value at whole positions', () => {
    expect(expectedCtr(1)).toBeCloseTo(0.28, 5);
    expect(expectedCtr(5)).toBeCloseTo(0.06, 5);
    expect(expectedCtr(10)).toBeCloseTo(0.018, 5);
  });

  it('interpolates linearly between whole positions', () => {
    expect(expectedCtr(5.5)).toBeCloseTo((0.06 + 0.045) / 2, 5);
  });

  it('clamps positions better than 1 to the position-1 value', () => {
    expect(expectedCtr(0.4)).toBeCloseTo(CTR_BY_POSITION[1], 5);
  });

  it('decays beyond position 10 without going negative', () => {
    expect(expectedCtr(15)).toBeLessThan(expectedCtr(10));
    expect(expectedCtr(60)).toBeGreaterThan(0);
  });

  it('is monotonically non-increasing across the curve', () => {
    for (let p = 1; p < 20; p += 0.5) {
      expect(expectedCtr(p + 0.5)).toBeLessThanOrEqual(expectedCtr(p) + 1e-9);
    }
  });
});
