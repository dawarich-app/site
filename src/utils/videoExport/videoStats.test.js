import { describe, it, expect } from 'vitest';
import {
  buildStatRows,
  computeTrackStats,
  formatDistance,
  formatDuration,
  formatSpeed,
} from './videoStats';

const timedPoints = [
  { lat: 52.5, lon: 13.4, time: '2026-05-01T09:00:00Z' },
  { lat: 52.5, lon: 13.41, time: '2026-05-01T09:10:00Z' },
  // Four-hour gap: excluded from moving time, splits the track.
  { lat: 52.6, lon: 13.6, time: '2026-05-01T13:10:00Z' },
  { lat: 52.6, lon: 13.61, time: '2026-05-01T13:20:00Z' },
];

describe('computeTrackStats', () => {
  it('sums distance and moving time, excluding long gaps', () => {
    const stats = computeTrackStats(timedPoints);
    expect(stats.distanceM).toBeGreaterThan(1300);
    expect(stats.distanceM).toBeLessThan(1400);
    expect(stats.movingTimeMs).toBe(20 * 60 * 1000);
    expect(stats.pointCount).toBe(4);
  });

  it('derives average speed from distance over moving time', () => {
    const stats = computeTrackStats(timedPoints);
    const expectedKmh = (stats.distanceM / 1000) / (20 / 60);
    expect(stats.avgSpeedKmh).toBeCloseTo(expectedKmh, 3);
  });

  it('reports null speed and zero moving time without timestamps', () => {
    const stats = computeTrackStats([
      { lat: 52.5, lon: 13.4 },
      { lat: 52.5, lon: 13.41 },
    ]);
    expect(stats.distanceM).toBeGreaterThan(600);
    expect(stats.movingTimeMs).toBe(0);
    expect(stats.avgSpeedKmh).toBeNull();
  });

  it('handles empty input', () => {
    const stats = computeTrackStats([]);
    expect(stats.distanceM).toBe(0);
    expect(stats.avgSpeedKmh).toBeNull();
    expect(stats.pointCount).toBe(0);
  });
});

describe('formatters', () => {
  it('formats distance in km and miles', () => {
    expect(formatDistance(12345, 'km')).toBe('12.3 km');
    expect(formatDistance(12345, 'mi')).toBe('7.7 mi');
    expect(formatDistance(850, 'km')).toBe('850 m');
    expect(formatDistance(850, 'mi')).toBe('0.5 mi');
  });

  it('formats durations at second, minute, and hour scale', () => {
    expect(formatDuration(45 * 1000)).toBe('45 s');
    expect(formatDuration(38 * 60 * 1000)).toBe('38 min');
    expect(formatDuration((84 * 60 + 3600) * 1000)).toBe('2 h 24 min');
    expect(formatDuration(0)).toBe('—');
  });

  it('formats multi-day durations as days, not hundreds of hours', () => {
    expect(formatDuration(48 * 3600 * 1000)).toBe('2 days');
    expect(formatDuration(435.66 * 3600 * 1000)).toBe('18 days');
    expect(formatDuration(47 * 3600 * 1000)).toBe('47 h 0 min');
  });

  it('formats speed per unit system', () => {
    expect(formatSpeed(12.34, 'km')).toBe('12.3 km/h');
    expect(formatSpeed(12.34, 'mi')).toBe('7.7 mph');
    expect(formatSpeed(null, 'km')).toBe('—');
  });
});

describe('buildStatRows', () => {
  const base = { distanceM: 194300, movingTimeMs: 90 * 60 * 1000, avgSpeedKmh: 5.2 };

  it('includes distance, duration, and speed for a normal track', () => {
    const rows = buildStatRows(base, 'km');
    expect(rows.map(([label]) => label)).toEqual(['Distance', 'Duration', 'Avg speed']);
    expect(rows[0][1]).toBe('194.3 km');
  });

  it('drops average speed below walking pace — location history, not a workout', () => {
    const rows = buildStatRows({ ...base, avgSpeedKmh: 0.4 }, 'km');
    expect(rows.map(([label]) => label)).toEqual(['Distance', 'Duration']);
  });

  it('drops duration and speed when there are no timestamps', () => {
    const rows = buildStatRows({ distanceM: 1000, movingTimeMs: 0, avgSpeedKmh: null }, 'km');
    expect(rows.map(([label]) => label)).toEqual(['Distance']);
  });
});
