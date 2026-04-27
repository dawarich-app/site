import { describe, it, expect } from 'vitest';
import { mapModeFromGoogleActivity } from './timelineDays';

describe('mapModeFromGoogleActivity', () => {
  it('maps known activities to dawarich modes', () => {
    expect(mapModeFromGoogleActivity('WALKING')).toBe('walking');
    expect(mapModeFromGoogleActivity('RUNNING')).toBe('running');
    expect(mapModeFromGoogleActivity('CYCLING')).toBe('cycling');
    expect(mapModeFromGoogleActivity('IN_PASSENGER_VEHICLE')).toBe('driving');
    expect(mapModeFromGoogleActivity('DRIVING')).toBe('driving');
    expect(mapModeFromGoogleActivity('IN_BUS')).toBe('bus');
    expect(mapModeFromGoogleActivity('IN_TRAIN')).toBe('train');
    expect(mapModeFromGoogleActivity('IN_SUBWAY')).toBe('train');
    expect(mapModeFromGoogleActivity('FLYING')).toBe('flying');
    expect(mapModeFromGoogleActivity('SAILING')).toBe('boat');
    expect(mapModeFromGoogleActivity('MOTORCYCLING')).toBe('motorcycle');
  });

  it('returns "unknown" for unrecognized or null input', () => {
    expect(mapModeFromGoogleActivity('SKIING')).toBe('unknown');
    expect(mapModeFromGoogleActivity(null)).toBe('unknown');
    expect(mapModeFromGoogleActivity(undefined)).toBe('unknown');
    expect(mapModeFromGoogleActivity('')).toBe('unknown');
  });

  it('is case-sensitive on Google input (matches export format)', () => {
    expect(mapModeFromGoogleActivity('walking')).toBe('unknown');
  });
});

import { heatBucketForDay } from './timelineDays';

describe('heatBucketForDay', () => {
  it('returns 0 for zero or missing tracked seconds', () => {
    expect(heatBucketForDay(0, 36000)).toBe(0);
    expect(heatBucketForDay(null, 36000)).toBe(0);
  });

  it('returns 5 for the busiest day in the year', () => {
    expect(heatBucketForDay(36000, 36000)).toBe(5);
  });

  it('scales linearly across 5 buckets relative to busiest', () => {
    // busiest = 50000s; 10000s = 20% → bucket 1
    expect(heatBucketForDay(10000, 50000)).toBe(1);
    expect(heatBucketForDay(20000, 50000)).toBe(2);
    expect(heatBucketForDay(30000, 50000)).toBe(3);
    expect(heatBucketForDay(40000, 50000)).toBe(4);
    expect(heatBucketForDay(50000, 50000)).toBe(5);
  });

  it('clamps negative input to 0', () => {
    expect(heatBucketForDay(-100, 36000)).toBe(0);
  });

  it('returns 0 when busiestSeconds is 0 (empty year)', () => {
    expect(heatBucketForDay(0, 0)).toBe(0);
    expect(heatBucketForDay(100, 0)).toBe(0);
  });
});

import { buildDayIndex } from './timelineDays';

describe('buildDayIndex', () => {
  const visit = (overrides) => ({
    id: 'v1',
    type: 'place_visit',
    lat: 52.52,
    lng: 13.40,
    timestamp: '2024-04-14T08:30:00Z',
    arrived: '2024-04-14T08:30:00Z',
    departed: '2024-04-14T09:12:00Z',
    name: 'Café Nero',
    ...overrides,
  });

  const path = (overrides) => ({
    id: 'p1',
    type: 'activity_segment',
    coordinates: [[52.52, 13.40], [52.53, 13.41]],
    activityType: 'WALKING',
    distance: 4700, // meters
    startTimestamp: '2024-04-14T09:12:00Z',
    endTimestamp: '2024-04-14T09:48:00Z',
    ...overrides,
  });

  it('groups visits and paths by local date', () => {
    const idx = buildDayIndex([visit()], [path()]);
    expect(idx.size).toBe(1);
    const day = [...idx.values()][0];
    expect(day.entries).toHaveLength(2);
    expect(day.entries[0].type).toBe('visit');
    expect(day.entries[1].type).toBe('journey');
  });

  it('sorts entries by startedAt within a day', () => {
    const idx = buildDayIndex([
      visit({ id: 'v1', timestamp: '2024-04-14T14:00:00Z', arrived: '2024-04-14T14:00:00Z', departed: '2024-04-14T15:00:00Z' }),
    ], [
      path({ id: 'p1', startTimestamp: '2024-04-14T09:00:00Z', endTimestamp: '2024-04-14T10:00:00Z' }),
    ]);
    const day = [...idx.values()][0];
    expect(day.entries[0].type).toBe('journey');
    expect(day.entries[1].type).toBe('visit');
  });

  it('computes day summary stats', () => {
    const idx = buildDayIndex([visit()], [path()]);
    const day = [...idx.values()][0];
    expect(day.summary.totalDistance).toBeCloseTo(4.7, 1);
    expect(day.summary.distanceUnit).toBe('km');
    expect(day.summary.placesVisited).toBe(1);
    expect(day.summary.timeMovingMinutes).toBe(36);  // 36 min path
    expect(day.summary.timeStationaryMinutes).toBe(42); // 42 min visit
    expect(day.summary.trackedSeconds).toBeGreaterThan(0);
  });

  it('computes bounds enclosing all visits and paths', () => {
    const idx = buildDayIndex([visit()], [path()]);
    const day = [...idx.values()][0];
    expect(day.bounds.swLat).toBeCloseTo(52.52, 2);
    expect(day.bounds.neLat).toBeCloseTo(52.53, 2);
    expect(day.bounds.swLng).toBeCloseTo(13.40, 2);
    expect(day.bounds.neLng).toBeCloseTo(13.41, 2);
  });

  it('produces searchTokens lowercased', () => {
    const idx = buildDayIndex([visit({ name: 'Café Nero' })], []);
    const day = [...idx.values()][0];
    expect(day.entries[0].searchTokens).toBe('café nero');
  });

  it('marks status confirmed and tags empty for Google data', () => {
    const idx = buildDayIndex([visit()], []);
    const day = [...idx.values()][0];
    expect(day.entries[0].status).toBe('confirmed');
    expect(day.entries[0].tags).toEqual([]);
  });

  it('maps activity → mode via mapModeFromGoogleActivity', () => {
    const idx = buildDayIndex([], [path({ activityType: 'CYCLING' })]);
    const day = [...idx.values()][0];
    expect(day.entries[0].dominantMode).toBe('cycling');
  });

  it('computes journey avgSpeed in km/h', () => {
    // 4.7 km in 36 minutes = 7.83 km/h
    const idx = buildDayIndex([], [path()]);
    const day = [...idx.values()][0];
    expect(day.entries[0].avgSpeed).toBeCloseTo(7.8, 1);
    expect(day.entries[0].speedUnit).toBe('km/h');
  });

  it('returns empty Map for empty input', () => {
    expect(buildDayIndex([], []).size).toBe(0);
  });

  it('drops non-visit, non-journey points (location_record, activity_start, etc.)', () => {
    const records = [
      { id: 'r1', lat: 52.52, lng: 13.40, type: 'location_record', timestamp: '2024-04-14T08:30:00Z' },
      { id: 'a1', lat: 52.52, lng: 13.40, type: 'activity_start', timestamp: '2024-04-14T08:30:00Z' },
    ];
    expect(buildDayIndex(records, []).size).toBe(0);
  });
});

import { buildYearStats, buildMonthGrid } from './timelineDays';

describe('buildYearStats', () => {
  it('aggregates day index by year and tracks busiest day', () => {
    const idx = new Map([
      ['2024-04-14', { date: '2024-04-14', summary: { trackedSeconds: 36000 } }],
      ['2024-04-15', { date: '2024-04-15', summary: { trackedSeconds: 50000 } }],
      ['2023-12-31', { date: '2023-12-31', summary: { trackedSeconds: 100 } }],
    ]);
    const stats = buildYearStats(idx);
    expect(stats.size).toBe(2);
    expect(stats.get(2024).busiestSeconds).toBe(50000);
    expect(stats.get(2024).totalDays).toBe(2);
    expect(stats.get(2024).months.has('2024-04')).toBe(true);
    expect(stats.get(2023).busiestSeconds).toBe(100);
  });

  it('returns empty map for empty index', () => {
    expect(buildYearStats(new Map()).size).toBe(0);
  });
});

describe('buildMonthGrid', () => {
  it('returns 6 weeks × 7 days, Monday-aligned', () => {
    const idx = new Map();
    const stats = new Map([[2024, { busiestSeconds: 0 }]]);
    const grid = buildMonthGrid(idx, stats, 2024, '2024-04');
    expect(grid.weeks).toHaveLength(6);
    expect(grid.weeks[0]).toHaveLength(7);
  });

  it('marks days outside the month with inMonth: false and disabled: true', () => {
    const grid = buildMonthGrid(new Map(), new Map([[2024, { busiestSeconds: 0 }]]), 2024, '2024-04');
    // April 1, 2024 is a Monday — so first cell IS in month
    expect(grid.weeks[0][0].inMonth).toBe(true);
    expect(grid.weeks[0][0].date).toBe('2024-04-01');
  });

  it('Monday-aligns: April 2024 starts on Monday → first row is week 1 fully in April', () => {
    const grid = buildMonthGrid(new Map(), new Map([[2024, { busiestSeconds: 0 }]]), 2024, '2024-04');
    expect(grid.weeks[0][0].date).toBe('2024-04-01');
  });

  it('assigns heatBucket from per-year busiest day', () => {
    const idx = new Map([
      ['2024-04-14', { date: '2024-04-14', summary: { trackedSeconds: 36000 } }],
    ]);
    const stats = new Map([[2024, { busiestSeconds: 36000 }]]);
    const grid = buildMonthGrid(idx, stats, 2024, '2024-04');
    const cell = grid.weeks.flat().find(c => c.date === '2024-04-14');
    expect(cell.heatBucket).toBe(5);
    expect(cell.trackedSeconds).toBe(36000);
  });

  it('cells without data have heatBucket 0', () => {
    const grid = buildMonthGrid(new Map(), new Map([[2024, { busiestSeconds: 0 }]]), 2024, '2024-04');
    expect(grid.weeks.flat().every(c => c.heatBucket === 0)).toBe(true);
  });
});
