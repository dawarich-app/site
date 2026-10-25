const CELL_DEGREES = 0.01;
const COAST_DEGREES = 0.15;

function ringBounds(ring) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const [x, y] of ring) {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }
  return [minX, minY, maxX, maxY];
}

function insideRing(ring, x, y) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

function insidePolygon(polygon, x, y) {
  if (!insideRing(polygon.rings[0], x, y)) return false;
  return !polygon.rings.slice(1).some((hole) => insideRing(hole, x, y));
}

const contains = ([minX, minY, maxX, maxY], x, y) => x >= minX && x <= maxX && y >= minY && y <= maxY;

const area = ([minX, minY, maxX, maxY]) => (maxX - minX) * (maxY - minY);

function segmentDistance(x, y, [x1, y1], [x2, y2]) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lengthSquared = dx * dx + dy * dy;
  const t = lengthSquared ? Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / lengthSquared)) : 0;
  return Math.hypot(x - (x1 + t * dx), y - (y1 + t * dy));
}

function ringDistance(ring, x, y) {
  let best = Infinity;
  for (let i = 1; i < ring.length; i += 1) best = Math.min(best, segmentDistance(x, y, ring[i - 1], ring[i]));
  return best;
}

export function buildCountryIndex(featureCollection) {
  return featureCollection.features
    .map((feature) => {
      const polygons = feature.geometry.coordinates.map((rings) => ({ rings, bounds: ringBounds(rings[0]) }));
      return { ...feature.properties, polygons, size: Math.max(...polygons.map((p) => area(p.bounds))) };
    })
    .sort((a, b) => a.size - b.size);
}

function nearestCountry(index, lon, lat) {
  let best = null;
  let bestDistance = COAST_DEGREES;
  for (const country of index) {
    for (const polygon of country.polygons) {
      const [minX, minY, maxX, maxY] = polygon.bounds;
      if (!contains([minX - COAST_DEGREES, minY - COAST_DEGREES, maxX + COAST_DEGREES, maxY + COAST_DEGREES], lon, lat)) continue;
      const distance = ringDistance(polygon.rings[0], lon, lat);
      if (distance <= bestDistance) {
        best = country;
        bestDistance = distance;
      }
    }
  }
  return best;
}

export function findCountry(index, lon, lat) {
  for (const country of index) {
    for (const polygon of country.polygons) {
      if (contains(polygon.bounds, lon, lat) && insidePolygon(polygon, lon, lat)) return country;
    }
  }
  return nearestCountry(index, lon, lat);
}

const utcDay = (time) => {
  if (!time) return null;
  const date = new Date(time);
  return Number.isNaN(date.getTime()) ? null : date.toISOString().slice(0, 10);
};

export function countVisitedCountries(points, index) {
  const cellCountry = new Map();
  const visits = new Map();
  for (const point of points) {
    const { lon, lat } = point;
    if (!Number.isFinite(lon) || !Number.isFinite(lat)) continue;
    const cell = `${Math.round(lon / CELL_DEGREES)}:${Math.round(lat / CELL_DEGREES)}`;
    if (!cellCountry.has(cell)) cellCountry.set(cell, findCountry(index, lon, lat));
    const country = cellCountry.get(cell);
    if (!country) continue;
    if (!visits.has(country.id)) {
      visits.set(country.id, { id: country.id, iso: country.iso, name: country.name, continent: country.continent, points: 0, daySet: new Set() });
    }
    const visit = visits.get(country.id);
    visit.points += 1;
    const day = utcDay(point.time);
    if (day) visit.daySet.add(day);
  }
  return [...visits.values()]
    .map(({ daySet, ...visit }) => {
      const days = [...daySet].sort();
      return { ...visit, days: days.length, firstDay: days[0] ?? null, lastDay: days[days.length - 1] ?? null };
    })
    .sort((a, b) => b.days - a.days || b.points - a.points);
}
