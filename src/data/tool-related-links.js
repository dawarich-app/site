// Hand-picked related links for each tool page. 3 links each.
// Mix of: reverse direction, sibling tool, related feature/blog/comparison.
// Used by <RelatedTools slug="..."/> at the bottom of every tool page.

const RELATED = {
  // ───── format-pair converters ─────
  'gpx-to-kml': [
    { href: '/tools/kml-to-gpx/',       label: 'KML to GPX',         note: 'Reverse direction' },
    { href: '/tools/gpx-to-geojson/',   label: 'GPX to GeoJSON',     note: 'Same source, web-mapping target' },
    { href: '/tools/gpx-merger/',       label: 'GPX Merger',         note: 'Combine multiple GPX files first' },
  ],
  'kml-to-gpx': [
    { href: '/tools/gpx-to-kml/',       label: 'GPX to KML',         note: 'Reverse direction' },
    { href: '/tools/kml-to-geojson/',   label: 'KML to GeoJSON',     note: 'Same source, web-mapping target' },
    { href: '/tools/kmz-to-gpx/',       label: 'KMZ to GPX',         note: 'Compressed KML version' },
  ],
  'gpx-to-geojson': [
    { href: '/tools/geojson-to-gpx/',   label: 'GeoJSON to GPX',     note: 'Reverse direction' },
    { href: '/tools/gpx-to-kml/',       label: 'GPX to KML',         note: 'Same source, Google Earth target' },
    { href: '/interactive-map/',        label: 'Interactive Map',    note: 'Visualize GeoJSON in Dawarich' },
  ],
  'geojson-to-gpx': [
    { href: '/tools/gpx-to-geojson/',   label: 'GPX to GeoJSON',     note: 'Reverse direction' },
    { href: '/tools/geojson-to-kml/',   label: 'GeoJSON to KML',     note: 'Same source, Google Earth target' },
    { href: '/tools/geojson-to-kmz/',   label: 'GeoJSON to KMZ',     note: 'Compressed Google Earth format' },
  ],
  'geojson-to-kml': [
    { href: '/tools/kml-to-geojson/',   label: 'KML to GeoJSON',     note: 'Reverse direction' },
    { href: '/tools/geojson-to-gpx/',   label: 'GeoJSON to GPX',     note: 'Same source, GPS-device target' },
    { href: '/tools/geojson-to-kmz/',   label: 'GeoJSON to KMZ',     note: 'Compressed Google Earth format' },
  ],
  'kml-to-geojson': [
    { href: '/tools/geojson-to-kml/',   label: 'GeoJSON to KML',     note: 'Reverse direction' },
    { href: '/tools/kml-to-gpx/',       label: 'KML to GPX',         note: 'Same source, GPS-device target' },
    { href: '/tools/kmz-to-geojson/',   label: 'KMZ to GeoJSON',     note: 'Compressed KML version' },
  ],
  'gpx-to-kmz': [
    { href: '/tools/kmz-to-gpx/',       label: 'KMZ to GPX',         note: 'Reverse direction' },
    { href: '/tools/gpx-to-kml/',       label: 'GPX to KML',         note: 'Uncompressed equivalent' },
    { href: '/tools/gpx-merger/',       label: 'GPX Merger',         note: 'Combine GPX files first' },
  ],
  'kmz-to-gpx': [
    { href: '/tools/gpx-to-kmz/',       label: 'GPX to KMZ',         note: 'Reverse direction' },
    { href: '/tools/kml-to-gpx/',       label: 'KML to GPX',         note: 'Uncompressed equivalent' },
    { href: '/tools/kmz-to-kml/',       label: 'KMZ to KML',         note: 'Decompress for editing' },
  ],
  'kml-to-kmz': [
    { href: '/tools/kmz-to-kml/',       label: 'KMZ to KML',         note: 'Reverse direction (decompress)' },
    { href: '/tools/kml-to-gpx/',       label: 'KML to GPX',         note: 'Same source, GPS-device target' },
    { href: '/tools/kml-to-geojson/',   label: 'KML to GeoJSON',     note: 'Same source, web-mapping target' },
  ],
  'kmz-to-kml': [
    { href: '/tools/kml-to-kmz/',       label: 'KML to KMZ',         note: 'Reverse direction (compress)' },
    { href: '/tools/kmz-to-gpx/',       label: 'KMZ to GPX',         note: 'Same source, GPS-device target' },
    { href: '/tools/kmz-to-geojson/',   label: 'KMZ to GeoJSON',     note: 'Same source, web-mapping target' },
  ],
  'kmz-to-geojson': [
    { href: '/tools/geojson-to-kmz/',   label: 'GeoJSON to KMZ',     note: 'Reverse direction' },
    { href: '/tools/kml-to-geojson/',   label: 'KML to GeoJSON',     note: 'Uncompressed equivalent' },
    { href: '/tools/kmz-to-kml/',       label: 'KMZ to KML',         note: 'Decompress for editing' },
  ],
  'geojson-to-kmz': [
    { href: '/tools/kmz-to-geojson/',   label: 'KMZ to GeoJSON',     note: 'Reverse direction' },
    { href: '/tools/geojson-to-kml/',   label: 'GeoJSON to KML',     note: 'Uncompressed equivalent' },
    { href: '/tools/geojson-to-gpx/',   label: 'GeoJSON to GPX',     note: 'Same source, GPS-device target' },
  ],

  // ───── FIT / TCX (fitness device formats) ─────
  'fit-to-gpx': [
    { href: '/tools/fit-to-kml/',       label: 'FIT to KML',         note: 'Same source, Google Earth target' },
    { href: '/tools/fit-to-geojson/',   label: 'FIT to GeoJSON',     note: 'Same source, web-mapping target' },
    { href: '/docs/comparisons/vs-strava/', label: 'Dawarich vs Strava', note: 'Where to keep your activities' },
  ],
  'fit-to-kml': [
    { href: '/tools/fit-to-gpx/',       label: 'FIT to GPX',         note: 'Most-compatible GPS format' },
    { href: '/tools/fit-to-geojson/',   label: 'FIT to GeoJSON',     note: 'Web-mapping target' },
    { href: '/tools/heatmap-generator/',label: 'Heatmap Generator',  note: 'Visualize FIT activities' },
  ],
  'fit-to-geojson': [
    { href: '/tools/fit-to-gpx/',       label: 'FIT to GPX',         note: 'Most-compatible GPS format' },
    { href: '/tools/fit-to-kml/',       label: 'FIT to KML',         note: 'Google Earth target' },
    { href: '/tools/heatmap-generator/',label: 'Heatmap Generator',  note: 'Visualize FIT activities' },
  ],
  'tcx-to-gpx': [
    { href: '/tools/tcx-to-kml/',       label: 'TCX to KML',         note: 'Same source, Google Earth target' },
    { href: '/tools/tcx-to-geojson/',   label: 'TCX to GeoJSON',     note: 'Web-mapping target' },
    { href: '/tools/fit-to-gpx/',       label: 'FIT to GPX',         note: 'Newer Garmin format' },
  ],
  'tcx-to-kml': [
    { href: '/tools/tcx-to-gpx/',       label: 'TCX to GPX',         note: 'Most-compatible GPS format' },
    { href: '/tools/tcx-to-geojson/',   label: 'TCX to GeoJSON',     note: 'Web-mapping target' },
    { href: '/tools/heatmap-generator/',label: 'Heatmap Generator',  note: 'Visualize TCX activities' },
  ],
  'tcx-to-geojson': [
    { href: '/tools/tcx-to-gpx/',       label: 'TCX to GPX',         note: 'Most-compatible GPS format' },
    { href: '/tools/tcx-to-kml/',       label: 'TCX to KML',         note: 'Google Earth target' },
    { href: '/tools/fit-to-geojson/',   label: 'FIT to GeoJSON',     note: 'Newer Garmin format' },
  ],

  // ───── Google Timeline tools ─────
  'google-timeline-converter': [
    { href: '/tools/google-timeline-splitter/', label: 'Timeline Splitter', note: 'Split a giant Takeout export' },
    { href: '/tools/timeline-merger/',  label: 'Timeline Merger',    note: 'Combine multiple exports' },
    { href: '/blog/migrating-from-google-location-history-to-dawarich/', label: 'Migration guide', note: 'Step-by-step move to Dawarich' },
  ],
  'google-timeline-splitter': [
    { href: '/tools/google-timeline-converter/', label: 'Timeline Converter', note: 'Convert split files to GPX/KML/CSV' },
    { href: '/tools/timeline-format-detector/', label: 'Format Detector',   note: 'Identify what kind of export you have' },
    { href: '/blog/whats-inside-your-google-timeline-export/', label: "What's in a Timeline export", note: 'Understand the formats' },
  ],
  'timeline-merger': [
    { href: '/tools/google-timeline-converter/', label: 'Timeline Converter', note: 'Convert merged file to GPX/KML/CSV' },
    { href: '/tools/timeline-statistics/', label: 'Timeline Statistics', note: 'Analyze your merged history' },
    { href: '/tools/google-timeline-splitter/', label: 'Timeline Splitter', note: 'Reverse direction' },
  ],
  'timeline-format-detector': [
    { href: '/tools/google-timeline-converter/', label: 'Timeline Converter', note: 'Convert once you know the format' },
    { href: '/tools/google-timeline-splitter/', label: 'Timeline Splitter', note: 'Split large exports' },
    { href: '/blog/whats-inside-your-google-timeline-export/', label: "What's in a Timeline export", note: 'Format reference' },
  ],
  'timeline-visualizer': [
    { href: '/interactive-map/',        label: 'Interactive Map',    note: 'Full visualization in Dawarich' },
    { href: '/tools/heatmap-generator/',label: 'Heatmap Generator',  note: 'Aggregate density view' },
    { href: '/tools/timeline-statistics/', label: 'Timeline Statistics', note: 'Numbers behind the map' },
  ],
  'timeline-statistics': [
    { href: '/tools/timeline-mileage-calculator/', label: 'Mileage Calculator', note: 'Distance-only quick stat' },
    { href: '/tools/timeline-visualizer/', label: 'Timeline Visualizer', note: 'See the same data on a map' },
    { href: '/statistics/',             label: 'Dawarich Statistics', note: 'Persistent dashboards' },
  ],
  'timeline-mileage-calculator': [
    { href: '/tools/timeline-statistics/', label: 'Timeline Statistics', note: 'Full stats breakdown' },
    { href: '/tools/timeline-visualizer/', label: 'Timeline Visualizer', note: 'Map view of the same data' },
    { href: '/statistics/',             label: 'Dawarich Statistics', note: 'Track mileage over time' },
  ],

  // ───── Mergers / splitters / generic ─────
  'gpx-merger': [
    { href: '/tools/gps-file-splitter/', label: 'GPS File Splitter', note: 'Reverse direction' },
    { href: '/tools/gpx-to-kml/',       label: 'GPX to KML',         note: 'Convert merged file' },
    { href: '/import-export/',          label: 'Import & Export',    note: 'Bring merged data into Dawarich' },
  ],
  'gps-file-splitter': [
    { href: '/tools/gpx-merger/',       label: 'GPX Merger',         note: 'Reverse direction' },
    { href: '/tools/google-timeline-splitter/', label: 'Timeline Splitter', note: 'Split Google Takeout exports' },
    { href: '/tools/timeline-format-detector/', label: 'Format Detector', note: 'Identify a file before splitting' },
  ],
  'heatmap-generator': [
    { href: '/interactive-map/',        label: 'Interactive Map',    note: 'Heatmap layer + tracks + visits' },
    { href: '/tools/timeline-visualizer/', label: 'Timeline Visualizer', note: 'Per-track view' },
    { href: '/tools/timeline-statistics/', label: 'Timeline Statistics', note: 'Numbers for the same data' },
  ],
  'photo-geotagging': [
    { href: '/integrations/',           label: 'Photo Integrations', note: 'Immich & PhotoPrism geodata import' },
    { href: '/docs/features/photos/',   label: 'Photos in Dawarich', note: 'How photos work in the app' },
    { href: '/docs/tools/phototagger/', label: 'PhotoTagger CLI',    note: 'Bulk geotagging on the command line' },
  ],
};

export default RELATED;
