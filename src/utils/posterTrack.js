// Converts the flat {lat, lon, time} arrays produced by parseFile() into the
// track FeatureCollection buildPosterStyle() consumes. Mirrors the Rails
// Posters::TrackBuilder semantics (split on time gaps over an hour) so site
// and in-app posters of the same file look alike.

const DEFAULT_GAP_MINUTES = 60;

function isValidPoint(point) {
  return (
    point != null &&
    typeof point.lat === 'number' &&
    typeof point.lon === 'number' &&
    Number.isFinite(point.lat) &&
    Number.isFinite(point.lon) &&
    Math.abs(point.lat) <= 90 &&
    Math.abs(point.lon) <= 180
  );
}

function segmentFeature(points) {
  // GeoJSON wants [lon, lat] — the reverse of the {lat, lon} input order.
  const coordinates = points.map((p) => [p.lon, p.lat]);
  if (coordinates.length >= 2) {
    return {
      type: 'Feature',
      properties: {},
      geometry: { type: 'LineString', coordinates },
    };
  }
  return {
    type: 'Feature',
    properties: {},
    geometry: { type: 'Point', coordinates: coordinates[0] },
  };
}

export function pointsToTrackGeoJSON(points, { gapMinutes = DEFAULT_GAP_MINUTES } = {}) {
  const valid = (Array.isArray(points) ? points : []).filter(isValidPoint);

  const timed = [];
  const timeless = [];
  for (const point of valid) {
    const ts = point.time ? Date.parse(point.time) : Number.NaN;
    if (Number.isNaN(ts)) timeless.push(point);
    else timed.push({ ...point, ts });
  }
  timed.sort((a, b) => a.ts - b.ts);

  const gapMs = gapMinutes * 60 * 1000;
  const segments = [];
  let current = [];
  for (const point of timed) {
    if (current.length > 0 && point.ts - current[current.length - 1].ts > gapMs) {
      segments.push(current);
      current = [];
    }
    current.push(point);
  }
  if (current.length > 0) segments.push(current);
  if (timeless.length > 0) segments.push(timeless);

  return {
    type: 'FeatureCollection',
    features: segments.map(segmentFeature),
  };
}
