import { describe, expect, it } from 'vitest';
import { parseTimeline } from './timelineParser';
import { buildDayIndex } from './timelineDays';
import { generateMileageLog } from './timelineStats';

const activity = (overrides = {}) => ({
  startTime: '2026-09-10T09:00:00Z',
  endTime: '2026-09-10T09:20:00Z',
  activity: {
    start: 'geo:52.52,13.40',
    end: 'geo:52.53,13.41',
    topCandidate: { type: 'in passenger vehicle', probability: '0.9' },
    distanceMeters: '1234.5',
    ...overrides,
  },
});

// iOS exports geometry in time buckets separate from visits and activities.
const bucket = (timelinePath, overrides = {}) => ({
  startTime: '2026-09-10T08:00:00Z',
  endTime: '2026-09-10T10:00:00Z',
  timelinePath,
  ...overrides,
});
const sample = (point, offset) => ({
  point,
  durationMinutesOffsetFromStartTime: String(offset),
});
const visit = {
  startTime: '2026-09-10T09:20:00Z',
  endTime: '2026-09-10T10:00:00Z',
  visit: { topCandidate: { placeLocation: 'geo:52.53,13.41' } },
};

describe('iOS Location History activities', () => {
  it('preserves separate geometry, visits, driving mode and mileage end to end', () => {
    const parsed = parseTimeline([
      activity(),
      bucket([
        sample('geo:52.52,13.40', 60),
        sample('geo:52.525,13.405', 70),
        sample('geo:52.53,13.41', 80),
      ]),
      visit,
    ]);
    expect(parsed.points).toHaveLength(1);
    expect(parsed.paths).toHaveLength(1);
    expect(parsed.paths[0]).toMatchObject({
      coordinates: [[52.52, 13.40], [52.525, 13.405], [52.53, 13.41]],
      activityType: 'IN_PASSENGER_VEHICLE',
      distance: 1234.5,
    });
    const day = [...buildDayIndex(parsed.points, parsed.paths).values()][0];
    expect(day.entries.map(e => e.type)).toEqual(['journey', 'visit']);
    expect(day.entries[0].dominantMode).toBe('driving');
    expect(day.summary.totalDistance).toBe(1.2);
    const mileage = generateMileageLog(parsed.points, parsed.paths, { unit: 'miles' });
    expect(mileage.totalTrips).toBe(1);
    expect(mileage.totalDistanceMeters).toBe(1234.5);
    expect(mileage.totalDistance).toBeCloseTo(0.7671, 4);
  });

  it('clips a shared bucket to each activity instead of joining unrelated trips', () => {
    const walk = activity({
      start: 'geo:52.54,13.42', end: 'geo:52.55,13.43',
      topCandidate: { type: 'walking' }, distanceMeters: '500',
    });
    walk.startTime = '2026-09-10T09:30:00Z';
    walk.endTime = '2026-09-10T09:50:00Z';
    const parsed = parseTimeline([activity(), walk, bucket([
      sample('geo:51,12', 59),
      sample('geo:52.525,13.405', 70),
      sample('geo:51,12', 85),
      sample('geo:52.545,13.425', 100),
      sample('geo:51,12', 111),
    ])]);
    expect(parsed.paths.map(p => p.coordinates)).toEqual([
      [[52.52, 13.40], [52.525, 13.405], [52.53, 13.41]],
      [[52.54, 13.42], [52.545, 13.425], [52.55, 13.43]],
    ]);
    expect(parsed.paths.map(p => p.activityType)).toEqual(['IN_PASSENGER_VEHICLE', 'WALKING']);
    expect(generateMileageLog(parsed.points, parsed.paths).totalTrips).toBe(1);
  });

  it('sorts samples across buckets using absolute time, including timezone offsets', () => {
    const parsed = parseTimeline([
      bucket([sample('geo:52.527,13.407', 15)], {
        startTime: '2026-09-10T11:00:00+02:00', endTime: '2026-09-10T13:00:00+02:00',
      }),
      activity(),
      bucket([sample('geo:52.523,13.403', 65)]),
    ]);
    expect(parsed.paths[0].coordinates).toEqual([
      [52.52, 13.40], [52.523, 13.403], [52.527, 13.407], [52.53, 13.41],
    ]);
  });

  it('does not double-count an inline path when separate geometry also exists', () => {
    const entry = activity();
    entry.timelinePath = [{ point: 'geo:52.52,13.40' }, { point: 'geo:52.53,13.41' }];
    const parsed = parseTimeline([entry, bucket([
      sample('geo:52.525,13.405', 70),
    ])]);
    expect(parsed.paths).toHaveLength(1);
    expect(parsed.paths[0].coordinates).toEqual([[52.52, 13.40], [52.53, 13.41]]);
    expect(generateMileageLog(parsed.points, parsed.paths).totalDistanceMeters).toBe(1234.5);
  });

  it('falls back to valid endpoints when geometry is absent', () => {
    const parsed = parseTimeline([activity()]);
    expect(parsed.paths[0]).toMatchObject({
      coordinates: [[52.52, 13.40], [52.53, 13.41]], distance: 1234.5,
    });
  });

  it('preserves reported distance for a round trip with equal endpoints', () => {
    const parsed = parseTimeline([activity({ end: 'geo:52.52,13.40' })]);
    expect(parsed.paths).toHaveLength(1);
    expect(parsed.paths[0].coordinates).toEqual([[52.52, 13.40], [52.52, 13.40]]);
    expect(generateMileageLog(parsed.points, parsed.paths).totalDistanceMeters).toBe(1234.5);
  });

  it('ignores malformed coordinates and untimed samples in separate buckets', () => {
    const parsed = parseTimeline([activity(), bucket([
      sample('geo:200,13', 61),
      sample('bad', 62),
      sample('geo:52.9,13.9', 'NaN'),
      { point: 'geo:52.8,13.8' },
      sample('geo:52.525,13.405', 70),
    ])]);
    expect(parsed.paths[0].coordinates).toEqual([
      [52.52, 13.40], [52.525, 13.405], [52.53, 13.41],
    ]);
  });

  it('skips activities without enough valid geometry', () => {
    const parsed = parseTimeline([activity({ start: 'bad', end: 'geo:200,13' }), visit]);
    expect(parsed.paths).toEqual([]);
    expect(parsed.points).toHaveLength(1);
  });

  it('can use timed geometry when endpoints are invalid', () => {
    const parsed = parseTimeline([activity({ start: 'bad', end: null }), bucket([
      sample('geo:52.52,13.40', 60), sample('geo:52.53,13.41', 80),
    ])]);
    expect(parsed.paths[0].coordinates).toEqual([[52.52, 13.40], [52.53, 13.41]]);
  });

  it('ignores orphan geometry without inventing an activity', () => {
    const parsed = parseTimeline([bucket([
      sample('geo:52.52,13.40', 60), sample('geo:52.53,13.41', 80),
    ]), visit]);
    expect(parsed.paths).toEqual([]);
    expect(parsed.points).toHaveLength(1);
  });

  it('removes duplicate consecutive samples from overlapping buckets', () => {
    const geometry = bucket([
      sample('geo:52.52,13.40', 60), sample('geo:52.525,13.405', 70),
      sample('geo:52.53,13.41', 80),
    ]);
    const parsed = parseTimeline([activity(), geometry, geometry]);
    expect(parsed.paths[0].coordinates).toEqual([
      [52.52, 13.40], [52.525, 13.405], [52.53, 13.41],
    ]);
  });

  it.each(['IN_PASSENGER_VEHICLE', 'in passenger vehicle', '  In Passenger Vehicle  '])(
    'normalizes the driving type %s', type => {
      const parsed = parseTimeline([activity({ topCandidate: { type } })]);
      expect(parsed.paths[0].activityType).toBe('IN_PASSENGER_VEHICLE');
    },
  );

  it.each([undefined, 'not-a-distance', '-1', 'Infinity'])(
    'does not retain an invalid reported distance %s', distanceMeters => {
      const parsed = parseTimeline([activity({ distanceMeters })]);
      expect(parsed.paths[0].distance).toBeNull();
    },
  );

  it('preserves a valid zero reported distance', () => {
    expect(parseTimeline([activity({ distanceMeters: '0' })]).paths[0].distance).toBe(0);
  });
});
