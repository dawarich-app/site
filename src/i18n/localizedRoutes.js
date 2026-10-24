import { DEFAULT_LOCALE, LOCALES } from './locales.js';

export const LOCALIZED_ROUTES = [
  '/tools/google-timeline-converter/',
  '/tools/fit-to-geojson/',
  '/tools/fit-to-gpx/',
  '/tools/fit-to-kml/',
  '/tools/geojson-to-gpx/',
  '/tools/geojson-to-kml/',
  '/tools/geojson-to-kmz/',
  '/tools/gpx-to-geojson/',
  '/tools/gpx-to-kml/',
  '/tools/gpx-to-kmz/',
  '/tools/kml-to-geojson/',
  '/tools/kml-to-gpx/',
  '/tools/kml-to-kmz/',
  '/tools/kmz-to-geojson/',
  '/tools/kmz-to-gpx/',
  '/tools/kmz-to-kml/',
  '/tools/tcx-to-geojson/',
  '/tools/tcx-to-gpx/',
  '/tools/tcx-to-kml/',
  '/',
  '/pricing/',
  '/interactive-map/',
  '/trips/',
  '/statistics/',
  '/location-tracking/',
  '/import-export/',
  '/integrations/',
  '/location-sharing/',
  '/family/',
  '/tax-residency/',
  '/poster-studio/',
  '/cloud/',
  '/about/',
  '/google-timeline-alternative/',
];

function normalize(path) {
  const pathname = path.replace(/[?#].*$/, '');
  return pathname.endsWith('/') ? pathname : `${pathname}/`;
}

export function stripLocalePrefix(pathname, locales = LOCALES) {
  for (const locale of locales) {
    if (locale === DEFAULT_LOCALE) continue;
    const prefix = `/${locale}`;
    if (pathname === prefix) return '/';
    if (pathname.startsWith(`${prefix}/`)) return pathname.slice(prefix.length);
  }
  return pathname;
}

export function isLocalizedRoute(path, routes = LOCALIZED_ROUTES) {
  const target = normalize(path);
  return routes.some((route) => normalize(route) === target);
}
