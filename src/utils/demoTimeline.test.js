import { describe, it, expect } from 'vitest';
import { decodeDemoTimeline, loadDemoTimeline, localMidnight } from './demoTimeline';

const PAYLOAD = {
  modes: ['walking', 'cycling', 'driving'],
  statuses: ['confirmed', 'suggested'],
  places: [
    { name: 'Home', lat: 52.517, lon: 13.407, city: 'Berlin', country: 'Deutschland', tags: ['home'] },
    { name: 'Office', lat: 52.53, lon: 13.42, city: 'Berlin', country: 'Deutschland', tags: ['work'] },
  ],
  // [placeIdx, startOffset, duration, pointCount, statusIdx]
  visits: [
    [0, -90000, 3600, 12, 0],
    [1, -50400, 7200, 30, 1],
  ],
  // [startOffset, duration, distanceMeters, modeIdx, baseLatE5, baseLonE5, deltas]
  tracks: [
    [-86400, 1800, 3000, 0, 5251700, 1340700, [100, -200, 50, 50]],
    [-43200, 900, 12000, 2, 5253000, 1342000, [-300, 400]],
  ],
};

// 2026-03-10T00:00 local
const ANCHOR = new Date(2026, 2, 10).getTime();

describe('decodeDemoTimeline', () => {
  it('anchors offsets so the demo ends just before the anchor day', () => {
    const { dayIndex, latestDate } = decodeDemoTimeline(PAYLOAD, ANCHOR);
    expect(latestDate).toBe('2026-03-09');
    expect([...dayIndex.keys()].sort()).toEqual(['2026-03-08', '2026-03-09']);
  });

  it('marks every day as demo data', () => {
    const { dayIndex } = decodeDemoTimeline(PAYLOAD, ANCHOR);
    for (const day of dayIndex.values()) expect(day.isDemo).toBe(true);
  });

  it('keeps the real point count and place details on visits', () => {
    const { dayIndex } = decodeDemoTimeline(PAYLOAD, ANCHOR);
    const visits = [...dayIndex.values()].flatMap((d) => d.entries).filter((e) => e.type === 'visit');
    expect(visits).toHaveLength(2);
    const home = visits.find((v) => v.name === 'Home');
    expect(home.pointCount).toBe(12);
    expect(home.duration).toBe(60);
    expect(home.place).toMatchObject({ name: 'Home', lat: 52.517, lng: 13.407, city: 'Berlin' });
    expect(home.tags).toEqual(['home']);
    expect(home.status).toBe('confirmed');
    expect(visits.find((v) => v.name === 'Office').status).toBe('suggested');
  });

  it('decodes delta-encoded track coordinates and maps modes', () => {
    const { dayIndex } = decodeDemoTimeline(PAYLOAD, ANCHOR);
    const journeys = [...dayIndex.values()].flatMap((d) => d.entries).filter((e) => e.type === 'journey');
    expect(journeys).toHaveLength(2);
    expect(journeys[0].dominantMode).toBe('walking');
    expect(journeys[1].dominantMode).toBe('driving');
    expect(journeys[0].coordinates).toEqual([
      [52.517, 13.407],
      [52.518, 13.405],
      [52.5185, 13.4055],
    ]);
    expect(journeys[0].distance).toBe(3.0);
  });

  it('orders entries within a day chronologically', () => {
    const { dayIndex } = decodeDemoTimeline(PAYLOAD, ANCHOR);
    for (const day of dayIndex.values()) {
      const times = day.entries.map((e) => new Date(e.startedAt).getTime());
      expect(times).toEqual([...times].sort((a, b) => a - b));
    }
  });

  it('builds year stats covering the demo days', () => {
    const { yearStats } = decodeDemoTimeline(PAYLOAD, ANCHOR);
    expect(yearStats.get(2026).totalDays).toBe(2);
    expect([...yearStats.get(2026).months]).toEqual(['2026-03']);
  });
});

describe('localMidnight', () => {
  it('returns the local beginning of the given day', () => {
    const noon = new Date(2026, 4, 20, 12, 34, 56, 789);
    expect(localMidnight(noon)).toBe(new Date(2026, 4, 20).getTime());
  });
});

describe('the shipped dawarich demo payload', () => {
  const ANCHOR = new Date(2026, 7, 21).getTime();

  it('covers 30 days ending the day before the anchor', () => {
    const { dayIndex, latestDate } = loadDemoTimeline(ANCHOR);
    expect(dayIndex.size).toBe(30);
    expect(latestDate).toBe('2026-08-20');
  });

  it('carries the Prague weekend drive', () => {
    const { dayIndex } = loadDemoTimeline(ANCHOR);
    const journeys = [...dayIndex.values()].flatMap((d) => d.entries).filter((e) => e.type === 'journey');
    expect(journeys.filter((j) => j.distance > 300)).toHaveLength(2);
  });

  it('gives every entry the fields the timeline panel renders', () => {
    const { dayIndex } = loadDemoTimeline(ANCHOR);
    for (const day of dayIndex.values()) {
      for (const entry of day.entries) {
        expect(Number.isFinite(new Date(entry.startedAt).getTime())).toBe(true);
        if (entry.type === 'visit') {
          expect(entry.name).toBeTruthy();
          expect(Number.isFinite(entry.place.lat)).toBe(true);
          expect(Number.isFinite(entry.place.lng)).toBe(true);
          expect(entry.pointCount).toBeGreaterThan(0);
        } else {
          expect(entry.coordinates.length).toBeGreaterThan(1);
          expect(['walking', 'cycling', 'driving']).toContain(entry.dominantMode);
        }
      }
    }
  });
});
