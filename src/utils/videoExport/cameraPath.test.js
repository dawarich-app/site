import { describe, it, expect } from 'vitest';
import { buildRouteTimeline, sliceAtFraction } from './routeTimeline';
import { followCenter, lerpCamera } from './cameraPath';

const LINE = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: [
          [13.4, 52.5],
          [13.41, 52.5],
          [13.42, 52.5],
          [13.43, 52.5],
        ],
      },
    },
  ],
};

describe('followCenter', () => {
  const timeline = buildRouteTimeline(LINE);

  it('returns null for an empty timeline', () => {
    expect(followCenter(buildRouteTimeline(null), 0.5)).toBeNull();
  });

  it('returns the head itself when the smoothing window is zero', () => {
    const head = sliceAtFraction(timeline, 0.5).head;
    const center = followCenter(timeline, 0.5, { windowM: 0 });
    expect(center[0]).toBeCloseTo(head[0], 6);
    expect(center[1]).toBeCloseTo(head[1], 6);
  });

  it('lags behind the head on an eastward line, within the window', () => {
    const head = sliceAtFraction(timeline, 0.75).head;
    const center = followCenter(timeline, 0.75, { windowM: 800 });
    expect(center[0]).toBeLessThan(head[0]);
    expect(center[0]).toBeGreaterThan(head[0] - 0.015);
    expect(center[1]).toBeCloseTo(52.5, 5);
  });

  it('stays finite at the very start of the route', () => {
    const center = followCenter(timeline, 0, { windowM: 800 });
    expect(Number.isFinite(center[0])).toBe(true);
    expect(center[0]).toBeCloseTo(13.4, 4);
  });
});

describe('lerpCamera', () => {
  const from = { center: [13.4, 52.5], zoom: 14 };
  const to = { center: [13.5, 52.6], zoom: 12 };

  it('returns the endpoints at t 0 and 1', () => {
    expect(lerpCamera(from, to, 0)).toEqual(from);
    expect(lerpCamera(from, to, 1)).toEqual(to);
  });

  it('interpolates center and zoom at the midpoint', () => {
    const mid = lerpCamera(from, to, 0.5);
    expect(mid.center[0]).toBeCloseTo(13.45, 6);
    expect(mid.center[1]).toBeCloseTo(52.55, 6);
    expect(mid.zoom).toBeCloseTo(13, 6);
  });
});
