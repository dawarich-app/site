export const FOOTER_LINK_CAP = 60;

const BRAND_HTML =
  '<p style="display:inline-flex;align-items:center;gap:0.375rem;margin:0 0 0.5rem;"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg><span>Made and hosted in Europe</span></p><p>&copy;ZeitFlow UG (haftungsbeschränkt)</p><p>Berlin, Germany</p><p class="dawarich-footer-cta"><a href="https://my.dawarich.app/users/sign_up?utm_source=site&utm_medium=footer&utm_campaign=footer_cta">Start tracking →</a></p>';

export const footerLinks = [
  {
    title: 'Dawarich',
    items: [{ html: BRAND_HTML }],
  },
  {
    title: 'Product',
    items: [
      { label: 'Interactive Map', to: '/interactive-map' },
      { label: 'Trips & Journaling', to: '/trips' },
      { label: 'Statistics', to: '/statistics' },
      { label: 'Location Tracking', to: '/location-tracking' },
      { label: 'Import & Export', to: '/import-export' },
      { label: 'Photo Integrations', to: '/integrations' },
      { label: 'Pricing', to: '/pricing' },
      { label: 'Dawarich Cloud', to: '/cloud' },
      { label: 'Roadmap', to: '/roadmap' },
      { label: 'Changelog', to: '/docs/changelog' },
    ],
  },
  {
    title: 'Tools',
    items: [
      { label: 'Google Timeline Visualizer', to: '/tools/timeline-visualizer' },
      { label: 'KML to KMZ Converter', to: '/tools/kml-to-kmz' },
      { label: 'Extract GPS From Photo', to: '/tools/photo-geotagging' },
      { label: 'Google Timeline Converter', to: '/tools/google-timeline-converter' },
      { label: 'KMZ to KML Converter', to: '/tools/kmz-to-kml' },
      { label: 'Mileage Calculator', to: '/tools/timeline-mileage-calculator' },
      { label: 'GeoJSON to KML Converter', to: '/tools/geojson-to-kml' },
      { label: 'GPX Merger', to: '/tools/gpx-merger' },
      { label: 'TCX to GPX Converter', to: '/tools/tcx-to-gpx' },
      { label: 'GPS Heatmap Generator', to: '/tools/heatmap-generator' },
      { label: 'KMZ to GPX Converter', to: '/tools/kmz-to-gpx' },
      { label: 'GPS File Splitter', to: '/tools/gps-file-splitter' },
      { label: 'GPX to KMZ Converter', to: '/tools/gpx-to-kmz' },
      { label: 'Timeline Statistics', to: '/tools/timeline-statistics' },
      { label: 'Timeline Merger', to: '/tools/timeline-merger' },
      { label: 'KML to GPX Converter', to: '/tools/kml-to-gpx' },
      { label: 'FIT to GPX Converter', to: '/tools/fit-to-gpx' },
      { label: 'All 29 tools →', to: '/tools' },
    ],
  },
  {
    title: 'Compare',
    items: [
      { label: 'Google Timeline Alternative', to: '/google-timeline-alternative' },
      { label: 'vs OwnTracks', to: '/docs/comparisons/vs-owntracks' },
      { label: 'vs Traccar', to: '/docs/comparisons/vs-traccar' },
      { label: 'vs Google Timeline', to: '/docs/comparisons/vs-google-timeline' },
      { label: 'vs Strava', to: '/docs/comparisons/vs-strava' },
      { label: 'vs Polarsteps', to: '/docs/comparisons/vs-polarsteps' },
      { label: 'vs Life360', to: '/docs/comparisons/vs-life360' },
      { label: 'vs Arc', to: '/docs/comparisons/vs-arc' },
      { label: 'vs GeoPulse', to: '/docs/comparisons/vs-geopulse' },
      { label: 'vs Reitti', to: '/docs/comparisons/vs-reitti' },
    ],
  },
  {
    title: 'Docs',
    items: [
      { label: 'Documentation', to: '/docs/intro' },
      { label: 'Self-Hosting Guide', to: '/docs/self-hosting/introduction' },
      { label: 'Importing existing data', to: '/docs/getting-started/import-existing-data' },
      { label: 'Exporting data', to: '/docs/getting-started/export-your-data' },
      { label: 'API Docs', to: '/docs/api/dawarich-api' },
      { label: 'FAQ', to: '/docs/FAQ' },
      { label: 'Dawarich for iOS', to: '/docs/dawarich-for-ios' },
      { label: 'Dawarich for Android', to: '/docs/dawarich-for-android' },
      { label: 'Community', href: 'https://discourse.dawarich.app/' },
    ],
  },
  {
    title: 'Company',
    items: [
      { label: 'About Us', to: '/about' },
      { label: 'Contact', to: '/contact' },
      { label: 'Blog', to: '/blog' },
      { label: 'Credits', to: '/credits' },
      { label: 'Impressum', to: '/impressum' },
      { label: 'Privacy Policy', to: '/privacy-policy' },
      { label: 'Terms and Conditions', to: '/terms-and-conditions' },
      { label: 'Refund Policy', to: '/refund-policy' },
    ],
  },
];
