import { describe, it, expect } from 'vitest';
import { haversineDistance } from '../geo';
import { smoothSegmentCoords } from './pathSmoothing';

// ~90° corner with two ~1.1 km legs at the equator.
const SHARP_CORNER = [
  [0, 0],
  [0.01, 0],
  [0.01, 0.01],
];

describe('smoothSegmentCoords', () => {
  it('preserves the endpoints exactly', () => {
    const out = smoothSegmentCoords(SHARP_CORNER);
    expect(out[0]).toEqual([0, 0]);
    expect(out[out.length - 1]).toEqual([0.01, 0.01]);
  });

  it('replaces a sharp corner with an arc of nearby points', () => {
    const out = smoothSegmentCoords(SHARP_CORNER, { maxCornerM: 30 });
    expect(out.length).toBeGreaterThan(SHARP_CORNER.length);
    expect(out.some(([lon, lat]) => lon === 0.01 && lat === 0)).toBe(false);
    // Every new point hugs the corner: within ~2× the corner radius of the
    // original vertex, never a quarter of the way down a 1.1 km leg.
    for (const [lon, lat] of out.slice(1, -1)) {
      expect(haversineDistance(0, 0.01, lat, lon)).toBeLessThan(65);
    }
  });

  it('keeps collinear input on its line', () => {
    const straight = [
      [13.4, 52.5],
      [13.41, 52.5],
      [13.42, 52.5],
    ];
    for (const [, lat] of smoothSegmentCoords(straight)) {
      expect(lat).toBeCloseTo(52.5, 9);
    }
  });

  it('passes dense recordings through unchanged', () => {
    // Edges of ~5.6 m — already smooth at any video zoom.
    const dense = [0, 1, 2, 3].map((i) => [i * 0.00005, 0]);
    expect(smoothSegmentCoords(dense, { minEdgeM: 12 })).toEqual(dense);
  });

  it('returns short or degenerate input as-is', () => {
    expect(smoothSegmentCoords([[1, 1]])).toEqual([[1, 1]]);
    const two = [
      [0, 0],
      [1, 1],
    ];
    expect(smoothSegmentCoords(two)).toEqual(two);
    const withDuplicate = [
      [0, 0],
      [0, 0],
      [0.01, 0],
    ];
    for (const coord of smoothSegmentCoords(withDuplicate)) {
      expect(Number.isFinite(coord[0])).toBe(true);
      expect(Number.isFinite(coord[1])).toBe(true);
    }
  });
});
