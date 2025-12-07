import JSZip from 'jszip';

/**
 * Convert internal format to GPX
 */
export function toGPX(points, metadata = {}) {
  const { name = 'Converted Track', description = 'Converted from other format' } = metadata;

  let gpx = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Dawarich Converter" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>${escapeXml(name)}</name>
    <desc>${escapeXml(description)}</desc>
  </metadata>`;

  const waypoints = points.filter(p => p.type === 'waypoint' || p.type === 'placemark' || p.type === 'point');
  const trackpoints = points.filter(p => p.type === 'trackpoint' || p.type === 'linepoint');

  // Add waypoints
  waypoints.forEach(point => {
    gpx += `
  <wpt lat="${point.lat}" lon="${point.lon}">`;
    if (point.name) gpx += `
    <name>${escapeXml(point.name)}</name>`;
    if (point.elevation !== undefined) gpx += `
    <ele>${point.elevation}</ele>`;
    if (point.time) gpx += `
    <time>${point.time}</time>`;
    gpx += `
  </wpt>`;
  });

  // Add track
  if (trackpoints.length > 0) {
    gpx += `
  <trk>
    <name>${escapeXml(name)}</name>
    <trkseg>`;

    trackpoints.forEach(point => {
      gpx += `
      <trkpt lat="${point.lat}" lon="${point.lon}">`;
      if (point.elevation !== undefined) gpx += `
        <ele>${point.elevation}</ele>`;
      if (point.time) gpx += `
        <time>${point.time}</time>`;
      gpx += `
      </trkpt>`;
    });

    gpx += `
    </trkseg>
  </trk>`;
  }

  gpx += `
</gpx>`;

  return gpx;
}

/**
 * Convert internal format to GeoJSON
 */
export function toGeoJSON(points) {
  const features = [];

  // Group track/line points into LineStrings
  const trackpoints = points.filter(p => p.type === 'trackpoint' || p.type === 'linepoint');
  if (trackpoints.length > 0) {
    features.push({
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: trackpoints.map(p => [p.lon, p.lat, p.elevation].filter(v => v !== undefined))
      }
    });
  }

  // Add individual points
  const individualPoints = points.filter(p => p.type === 'waypoint' || p.type === 'placemark' || p.type === 'point');
  individualPoints.forEach(point => {
    features.push({
      type: 'Feature',
      properties: {
        name: point.name,
        description: point.description,
        ...point.properties
      },
      geometry: {
        type: 'Point',
        coordinates: [point.lon, point.lat, point.elevation].filter(v => v !== undefined)
      }
    });
  });

  return JSON.stringify({
    type: 'FeatureCollection',
    features
  }, null, 2);
}

/**
 * Convert internal format to KML
 */
export function toKML(points, metadata = {}) {
  const { name = 'Converted Data', description = 'Converted from other format' } = metadata;

  let kml = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>${escapeXml(name)}</name>
    <description>${escapeXml(description)}</description>`;

  // Add individual placemarks/waypoints
  const individualPoints = points.filter(p => p.type === 'waypoint' || p.type === 'placemark' || p.type === 'point');
  individualPoints.forEach(point => {
    kml += `
    <Placemark>
      <name>${escapeXml(point.name || 'Point')}</name>`;
    if (point.description) kml += `
      <description>${escapeXml(point.description)}</description>`;
    kml += `
      <Point>
        <coordinates>${point.lon},${point.lat}${point.elevation !== undefined ? ',' + point.elevation : ''}</coordinates>
      </Point>
    </Placemark>`;
  });

  // Add track as LineString
  const trackpoints = points.filter(p => p.type === 'trackpoint' || p.type === 'linepoint');
  if (trackpoints.length > 0) {
    kml += `
    <Placemark>
      <name>Track</name>
      <LineString>
        <coordinates>`;

    trackpoints.forEach((point, idx) => {
      kml += `${idx > 0 ? ' ' : ''}${point.lon},${point.lat}${point.elevation !== undefined ? ',' + point.elevation : ''}`;
    });

    kml += `</coordinates>
      </LineString>
    </Placemark>`;
  }

  kml += `
  </Document>
</kml>`;

  return kml;
}

/**
 * Convert internal format to KMZ (zipped KML)
 */
export async function toKMZ(points, metadata = {}) {
  const kml = toKML(points, metadata);
  const zip = new JSZip();
  zip.file('doc.kml', kml);

  return await zip.generateAsync({ type: 'blob' });
}

/**
 * Parse KMZ file (extract KML from zip)
 */
export async function parseKMZ(file) {
  const zip = await JSZip.loadAsync(file);
  const kmlFile = zip.file(/\.kml$/i)[0];

  if (!kmlFile) {
    throw new Error('No KML file found in KMZ archive');
  }

  return await kmlFile.async('string');
}

/**
 * Helper to escape XML special characters
 */
function escapeXml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
