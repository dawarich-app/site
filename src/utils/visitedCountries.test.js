import { describe, it, expect } from 'vitest';
import { buildCountryIndex, findCountry, countVisitedCountries } from './visitedCountries';

const square = (x0, y0, x1, y1) => [[[x0, y0], [x1, y0], [x1, y1], [x0, y1], [x0, y0]]];
const feature = (id, iso, continent, polygons) => ({
  type: 'Feature',
  properties: { id, iso, name: id, continent },
  geometry: { type: 'MultiPolygon', coordinates: polygons },
});
const WORLD = {
  type: 'FeatureCollection',
  features: [
    feature('BIG', 'BG', 'Europe', [square(60, 0, 80, 20)]),
    feature('ENCLAVE', 'EN', 'Europe', [square(69, 9, 71, 11)]),
    feature('AA', 'AA', 'Europe', [square(0, 0, 10, 10)]),
    feature('BB', 'BB', 'Europe', [square(10, 0, 20, 10), square(30, 30, 31, 31)]),
    feature('CC', null, 'Asia', [[[[40, 0], [50, 0], [50, 10], [40, 10], [40, 0]], [[44, 4], [46, 4], [46, 6], [44, 6], [44, 4]]]]),
  ],
};

describe('findCountry', () => {
  const index = buildCountryIndex(WORLD);

  it('should find the country that contains a point, including on a second polygon', () => {
    expect(findCountry(index, 5, 5).id).toBe('AA');
    expect(findCountry(index, 15, 5).id).toBe('BB');
    expect(findCountry(index, 30.5, 30.5).id).toBe('BB');
  });

  it('should prefer an enclave over the country around it', () => {
    expect(findCountry(index, 70, 10).id).toBe('ENCLAVE');
    expect(findCountry(index, 65, 5).id).toBe('BIG');
  });

  it('should give a coastal point just off the simplified shore to the nearest country', () => {
    expect(findCountry(index, 10.05 + 10, 5).id).toBe('BB');
    expect(findCountry(index, 5, -0.05).id).toBe('AA');
    expect(findCountry(index, 5, -3)).toBeNull();
  });

  it('should skip holes and open water', () => {
    expect(findCountry(index, 45, 5)).toBeNull();
    expect(findCountry(index, 42, 5).id).toBe('CC');
    expect(findCountry(index, 25, 25)).toBeNull();
  });
});

describe('countVisitedCountries', () => {
  const index = buildCountryIndex(WORLD);

  it('should count points and distinct UTC days per country, ignoring water', () => {
    const points = [
      { lon: 5, lat: 5, time: '2024-05-01T10:00:00Z' },
      { lon: 5.01, lat: 5.01, time: '2024-05-01T12:00:00Z' },
      { lon: 6, lat: 6, time: '2024-05-02T09:00:00Z' },
      { lon: 15, lat: 5, time: '2024-05-03T09:00:00Z' },
      { lon: 25, lat: 25, time: '2024-05-03T10:00:00Z' },
      { lon: 42, lat: 5 },
    ];
    const result = countVisitedCountries(points, index);
    expect(result.map((c) => [c.id, c.points, c.days])).toEqual([
      ['AA', 3, 2],
      ['BB', 1, 1],
      ['CC', 1, 0],
    ]);
    expect(result[0]).toMatchObject({ continent: 'Europe', firstDay: '2024-05-01', lastDay: '2024-05-02' });
  });

  it('should ignore points without valid coordinates', () => {
    expect(countVisitedCountries([{ lon: NaN, lat: 5 }, { lat: 5 }], index)).toEqual([]);
  });
});
