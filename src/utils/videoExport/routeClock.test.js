import { describe, it, expect } from 'vitest';
import { buildRouteClock, timeAtFraction } from './routeClock';

// Local-time constructors keep the tests timezone-independent.
const t = (h, m) => new Date(2026, 5, 14, h, m).toISOString();

const timedPoints = [
  { lat: 52.5, lon: 13.4, time: t(8, 0) },
  { lat: 52.5, lon: 13.41, time: t(8, 30) },
  { lat: 52.5, lon: 13.42, time: t(9, 0) },
];

describe('buildRouteClock', () => {
  it('maps cumulative distance to recorded timestamps', () => {
    const clock = buildRouteClock(timedPoints);
    expect(clock.startTs).toBe(new Date(2026, 5, 14, 8, 0).getTime());
    expect(clock.endTs).toBe(new Date(2026, 5, 14, 9, 0).getTime());
    expect(clock.totalDistance).toBeGreaterThan(1300);
    expect(clock.entries).toHaveLength(3);
  });

  it('plateaus distance across a long gap while time jumps', () => {
    const gapped = [
      { lat: 52.5, lon: 13.4, time: t(8, 0) },
      { lat: 52.5, lon: 13.41, time: t(8, 30) },
      { lat: 52.6, lon: 13.6, time: t(14, 0) },
      { lat: 52.6, lon: 13.61, time: t(14, 30) },
    ];
    const clock = buildRouteClock(gapped);
    expect(clock.entries[2].dist).toBe(clock.entries[1].dist);
    expect(clock.entries[2].ts).toBe(new Date(2026, 5, 14, 14, 0).getTime());
  });

  it('returns null without at least two timed points', () => {
    expect(buildRouteClock([{ lat: 52.5, lon: 13.4 }])).toBeNull();
    expect(buildRouteClock([{ lat: 52.5, lon: 13.4, time: t(8, 0) }])).toBeNull();
    expect(buildRouteClock([])).toBeNull();
  });
});

describe('timeAtFraction', () => {
  const clock = buildRouteClock(timedPoints);

  it('interpolates the playhead time along the distance', () => {
    expect(timeAtFraction(clock, 0)).toBe(new Date(2026, 5, 14, 8, 0).getTime());
    expect(timeAtFraction(clock, 1)).toBe(new Date(2026, 5, 14, 9, 0).getTime());
    const mid = timeAtFraction(clock, 0.5);
    expect(mid).toBeGreaterThan(new Date(2026, 5, 14, 8, 25).getTime());
    expect(mid).toBeLessThan(new Date(2026, 5, 14, 8, 35).getTime());
  });

  it('clamps fractions outside 0..1', () => {
    expect(timeAtFraction(clock, -1)).toBe(clock.startTs);
    expect(timeAtFraction(clock, 2)).toBe(clock.endTs);
  });
});
