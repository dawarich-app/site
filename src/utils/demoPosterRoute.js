// Demo route for the map poster tool: the Berlin daily-life days of the
// dawarich app's public demo dataset (lib/assets/demo_data.json.gz — 27 days
// around Mitte; the Prague-trip days are dropped so the poster frames the
// dense city web). ~5.6k points at 18 m simplification, served as a static
// asset so it stays out of the page bundle. Rows are
// [latOffsetE5, lonOffsetE5, secondsOffset] against `base`.
export const DEMO_ROUTE_URL = '/demo/poster-demo-route.json';

export function decodeDemoRoute(payload) {
  const { base, rows } = payload;
  return rows.map(([latOffsetE5, lonOffsetE5, secondsOffset]) => ({
    lat: base.lat + latOffsetE5 / 1e5,
    lon: base.lon + lonOffsetE5 / 1e5,
    time: new Date(base.timeMs + secondsOffset * 1000).toISOString(),
  }));
}

let cachedPoints = null;

export async function fetchDemoRoutePoints() {
  if (cachedPoints) return cachedPoints;
  const response = await fetch(DEMO_ROUTE_URL);
  if (!response.ok) {
    throw new Error(`Failed to load the demo route (${response.status})`);
  }
  cachedPoints = decodeDemoRoute(await response.json());
  return cachedPoints;
}
