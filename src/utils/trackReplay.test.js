import { describe, it, expect } from 'vitest';
import { nextFrame, seekToFraction, replayCadenceMs } from './trackReplay';

describe('replayCadenceMs', () => {
  it('returns 50ms when no per-point times are available', () => {
    expect(replayCadenceMs(null)).toBe(50);
    expect(replayCadenceMs([])).toBe(50);
  });

  it('returns proportional cadence at 60x speed when point times are available', () => {
    const pointTimes = [
      '2024-04-14T09:00:00Z',
      '2024-04-14T09:01:00Z', // 60s real-time gap → 1000ms / 60x = 16.67ms (clamped to 16)
    ];
    // Between idx 0 and idx 1: 60s → 1000ms at 60x
    expect(replayCadenceMs(pointTimes, 0)).toBeCloseTo(1000, -1);
  });

  it('clamps cadence to a sane range', () => {
    const pointTimes = ['2024-04-14T09:00:00Z', '2024-04-14T09:00:00.001Z'];
    expect(replayCadenceMs(pointTimes, 0)).toBeGreaterThanOrEqual(16);
  });
});

describe('nextFrame', () => {
  it('advances frameIndex by 1', () => {
    expect(nextFrame({ frameIndex: 0 }, 100)).toEqual({ frameIndex: 1, done: false });
    expect(nextFrame({ frameIndex: 5 }, 100)).toEqual({ frameIndex: 6, done: false });
  });

  it('marks done when at the last coordinate', () => {
    expect(nextFrame({ frameIndex: 99 }, 100)).toEqual({ frameIndex: 99, done: true });
  });
});

describe('seekToFraction', () => {
  it('maps fraction [0,1] to a frame index', () => {
    expect(seekToFraction(0, 100)).toBe(0);
    expect(seekToFraction(0.5, 100)).toBe(50);
    expect(seekToFraction(1, 100)).toBe(99);
  });

  it('clamps fraction outside [0,1]', () => {
    expect(seekToFraction(-0.5, 100)).toBe(0);
    expect(seekToFraction(2, 100)).toBe(99);
  });
});
