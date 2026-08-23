import { describe, it, expect } from 'vitest';
import { buildRouteTimeline, sliceAtFraction, sliceWindow } from './routeTimeline';

// Two eastward steps of 0.01° longitude at 52.5°N ≈ 677.6 m each.
const STRAIGHT_LINE = {
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
        ],
      },
    },
  ],
};

const TWO_SEGMENTS = {
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
        ],
      },
    },
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: [
          [13.6, 52.6],
          [13.61, 52.6],
        ],
      },
    },
  ],
};

describe('buildRouteTimeline', () => {
  it('accumulates haversine distance along a line', () => {
    const timeline = buildRouteTimeline(STRAIGHT_LINE);
    expect(timeline.totalDistance).toBeCloseTo(1355, -1);
    expect(timeline.entries).toHaveLength(3);
    expect(timeline.entries[0].dist).toBe(0);
    expect(timeline.entries[2].dist).toBeCloseTo(timeline.totalDistance, 5);
  });

  it('does not count the jump between disjoint segments as distance', () => {
    const timeline = buildRouteTimeline(TWO_SEGMENTS);
    // Two segments of one ~677.6 m step each; the ~25 km gap contributes nothing.
    expect(timeline.totalDistance).toBeCloseTo(2 * 677.6, -1);
    expect(timeline.entries[2].dist).toBe(timeline.entries[1].dist);
    expect(timeline.entries[1].seg).toBe(0);
    expect(timeline.entries[2].seg).toBe(1);
  });

  it('rounds sharp corners when smoothing is enabled', () => {
    const cornered = {
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
              [13.41, 52.51],
            ],
          },
        },
      ],
    };
    const raw = buildRouteTimeline(cornered);
    const smoothed = buildRouteTimeline(cornered, { smooth: true });
    expect(smoothed.entries.length).toBeGreaterThan(raw.entries.length);
    expect(smoothed.entries.some((e) => e.coord[0] === 13.41 && e.coord[1] === 52.5)).toBe(false);
    expect(smoothed.totalDistance).toBeLessThan(raw.totalDistance);
    expect(smoothed.totalDistance).toBeGreaterThan(raw.totalDistance * 0.97);
  });

  it('ignores Point features and handles empty input', () => {
    const withPoint = {
      type: 'FeatureCollection',
      features: [
        { type: 'Feature', properties: {}, geometry: { type: 'Point', coordinates: [13.4, 52.5] } },
      ],
    };
    expect(buildRouteTimeline(withPoint).totalDistance).toBe(0);
    expect(buildRouteTimeline(null).entries).toHaveLength(0);
  });
});

describe('sliceAtFraction', () => {
  it('returns the interpolated head at the midpoint of a straight line', () => {
    const timeline = buildRouteTimeline(STRAIGHT_LINE);
    const slice = sliceAtFraction(timeline, 0.5);
    expect(slice.head[0]).toBeCloseTo(13.41, 3);
    expect(slice.head[1]).toBeCloseTo(52.5, 5);
    expect(slice.features).toHaveLength(1);
    const coords = slice.features[0].geometry.coordinates;
    expect(coords[0]).toEqual([13.4, 52.5]);
    expect(coords[coords.length - 1][0]).toBeCloseTo(13.41, 3);
  });

  it('emits the finished segment whole plus a partial second segment', () => {
    const timeline = buildRouteTimeline(TWO_SEGMENTS);
    const slice = sliceAtFraction(timeline, 0.75);
    expect(slice.features).toHaveLength(2);
    expect(slice.features[0].geometry.coordinates).toHaveLength(2);
    const partial = slice.features[1].geometry.coordinates;
    expect(partial[partial.length - 1][0]).toBeCloseTo(13.605, 3);
    expect(slice.head[1]).toBeCloseTo(52.6, 5);
  });

  it('clamps fractions outside 0..1', () => {
    const timeline = buildRouteTimeline(STRAIGHT_LINE);
    expect(sliceAtFraction(timeline, -1).features).toHaveLength(0);
    expect(sliceAtFraction(timeline, -1).head).toEqual([13.4, 52.5]);
    const full = sliceAtFraction(timeline, 2);
    expect(full.features[0].geometry.coordinates).toHaveLength(3);
    expect(full.head[0]).toBeCloseTo(13.42, 6);
  });

  it('returns an empty slice for an empty timeline', () => {
    const timeline = buildRouteTimeline(null);
    const slice = sliceAtFraction(timeline, 0.5);
    expect(slice.features).toHaveLength(0);
    expect(slice.head).toBeNull();
  });
});

describe('sliceWindow', () => {
  it('returns the sub-path between two distances with interpolated ends', () => {
    const timeline = buildRouteTimeline(STRAIGHT_LINE);
    const window = sliceWindow(timeline, timeline.totalDistance * 0.25, timeline.totalDistance * 0.75);
    expect(window.features).toHaveLength(1);
    const coords = window.features[0].geometry.coordinates;
    expect(coords[0][0]).toBeCloseTo(13.405, 3);
    expect(coords[coords.length - 1][0]).toBeCloseTo(13.415, 3);
  });

  it('spans a segment gap as two features', () => {
    const timeline = buildRouteTimeline(TWO_SEGMENTS);
    const window = sliceWindow(timeline, timeline.totalDistance * 0.25, timeline.totalDistance * 0.75);
    expect(window.features).toHaveLength(2);
  });

  it('clamps to the route and returns empty for an empty window', () => {
    const timeline = buildRouteTimeline(STRAIGHT_LINE);
    const full = sliceWindow(timeline, -100, timeline.totalDistance + 100);
    expect(full.features[0].geometry.coordinates).toHaveLength(3);
    expect(sliceWindow(timeline, 500, 500).features).toHaveLength(0);
    expect(sliceWindow(buildRouteTimeline(null), 0, 100).features).toHaveLength(0);
  });
});
