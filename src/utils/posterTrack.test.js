import { describe, expect, it } from 'vitest';
import { pointsToTrackGeoJSON } from './posterTrack';
import demoPayload from '../../static/demo/poster-demo-route.json';
import { decodeDemoRoute } from './demoPosterRoute';

const BERLIN = { lat: 52.52, lon: 13.405 };

function timedPoint(lat, lon, minutes) {
  return { lat, lon, time: new Date(Date.UTC(2026, 4, 16, 9, minutes)).toISOString() };
}

describe('pointsToTrackGeoJSON', () => {
  it('emits [lon, lat] GeoJSON coordinate order', () => {
    const fc = pointsToTrackGeoJSON([
      timedPoint(51.3402, 12.3712, 0),
      timedPoint(51.3411, 12.3725, 1),
    ]);
    expect(fc.features).toHaveLength(1);
    expect(fc.features[0].geometry.type).toBe('LineString');
    const [lon, lat] = fc.features[0].geometry.coordinates[0];
    expect(lon).toBeCloseTo(12.3712, 4);
    expect(lat).toBeCloseTo(51.3402, 4);
  });

  it('splits into two LineStrings on a gap over 60 minutes', () => {
    const fc = pointsToTrackGeoJSON([
      timedPoint(51.34, 12.37, 0),
      timedPoint(51.341, 12.371, 5),
      timedPoint(51.35, 12.38, 90),
      timedPoint(51.351, 12.381, 95),
    ]);
    const lines = fc.features.filter((f) => f.geometry.type === 'LineString');
    expect(lines).toHaveLength(2);
    expect(lines[0].geometry.coordinates).toHaveLength(2);
    expect(lines[1].geometry.coordinates).toHaveLength(2);
  });

  it('keeps a gap of exactly 60 minutes or less as one segment', () => {
    const fc = pointsToTrackGeoJSON([
      timedPoint(51.34, 12.37, 0),
      timedPoint(51.341, 12.371, 60),
    ]);
    expect(fc.features).toHaveLength(1);
    expect(fc.features[0].geometry.coordinates).toHaveLength(2);
  });

  it('honors a custom gapMinutes option', () => {
    const fc = pointsToTrackGeoJSON(
      [timedPoint(51.34, 12.37, 0), timedPoint(51.341, 12.371, 10)],
      { gapMinutes: 5 },
    );
    expect(fc.features.filter((f) => f.geometry.type === 'Point')).toHaveLength(2);
  });

  it('sorts unsorted timed input chronologically before splitting', () => {
    const fc = pointsToTrackGeoJSON([
      timedPoint(51.343, 12.374, 10),
      timedPoint(51.34, 12.371, 0),
      timedPoint(51.3415, 12.3725, 5),
    ]);
    expect(fc.features).toHaveLength(1);
    expect(fc.features[0].geometry.coordinates).toEqual([
      [12.371, 51.34],
      [12.3725, 51.3415],
      [12.374, 51.343],
    ]);
  });

  it('keeps timeless points as one trailing segment in input order', () => {
    const fc = pointsToTrackGeoJSON([
      timedPoint(51.34, 12.37, 0),
      timedPoint(51.341, 12.371, 5),
      { lat: 51.36, lon: 12.39 },
      { lat: 51.361, lon: 12.391 },
    ]);
    const lines = fc.features.filter((f) => f.geometry.type === 'LineString');
    expect(lines).toHaveLength(2);
    expect(lines[1].geometry.coordinates).toEqual([
      [12.39, 51.36],
      [12.391, 51.361],
    ]);
  });

  it('turns isolated single points into Point features', () => {
    const fc = pointsToTrackGeoJSON([
      timedPoint(51.34, 12.37, 0),
      timedPoint(51.35, 12.38, 120),
      timedPoint(51.351, 12.381, 125),
    ]);
    const points = fc.features.filter((f) => f.geometry.type === 'Point');
    const lines = fc.features.filter((f) => f.geometry.type === 'LineString');
    expect(points).toHaveLength(1);
    expect(points[0].geometry.coordinates).toEqual([12.37, 51.34]);
    expect(lines).toHaveLength(1);
  });

  it('filters invalid coordinates and returns an empty FeatureCollection for garbage', () => {
    expect(pointsToTrackGeoJSON([]).features).toHaveLength(0);
    expect(pointsToTrackGeoJSON(null).features).toHaveLength(0);
    const fc = pointsToTrackGeoJSON([
      { lat: Number.NaN, lon: 12.37 },
      { lat: 51.34, lon: undefined },
      { lat: 999, lon: 12.37 },
      { lat: 51.34, lon: 190 },
    ]);
    expect(fc.features).toHaveLength(0);
    expect(fc.type).toBe('FeatureCollection');
  });
});

describe('demoPosterRoute', () => {
  it('decodes 2000+ chronological points inside the Berlin metro box', () => {
    const points = decodeDemoRoute(demoPayload);
    expect(points.length).toBeGreaterThanOrEqual(2000);
    let previous = 0;
    for (const point of points) {
      expect(point.lat).toBeGreaterThanOrEqual(52.3);
      expect(point.lat).toBeLessThanOrEqual(52.72);
      expect(point.lon).toBeGreaterThanOrEqual(13.05);
      expect(point.lon).toBeLessThanOrEqual(13.76);
      const ts = Date.parse(point.time);
      expect(Number.isNaN(ts)).toBe(false);
      expect(ts).toBeGreaterThanOrEqual(previous);
      previous = ts;
    }
  });

  it('renders as a rich multi-day track through the poster track builder', () => {
    const fc = pointsToTrackGeoJSON(decodeDemoRoute(demoPayload));
    const lines = fc.features.filter((f) => f.geometry.type === 'LineString');
    expect(lines.length).toBeGreaterThanOrEqual(5);
    const coordCount = lines.reduce((n, f) => n + f.geometry.coordinates.length, 0);
    expect(coordCount).toBeGreaterThanOrEqual(2000);
  });
});
