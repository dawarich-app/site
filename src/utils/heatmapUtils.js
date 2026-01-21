import { parseGPX, parseGeoJSON, parseKML } from './formatParsers';
import { parseFIT } from './fitParser';
import { parseTCX } from './tcxParser';
import JSZip from 'jszip';

/**
 * Detect file type and parse accordingly
 * @param {File} file - The uploaded file
 * @returns {Promise<Array>} - Array of points with lat/lon
 */
export async function parseFile(file) {
  const extension = file.name.split('.').pop().toLowerCase();
  
  switch (extension) {
    case 'gpx':
      return parseGPX(await file.text());
    case 'geojson':
    case 'json':
      return parseGeoJSON(await file.text());
    case 'kml':
      return parseKML(await file.text());
    case 'kmz':
      const zip = await JSZip.loadAsync(file);
      const kmlFile = zip.file(/\.kml$/i)[0];
      if (!kmlFile) throw new Error('No KML file found in KMZ archive');
      const kmlText = await kmlFile.async('string');
      return parseKML(kmlText);
    case 'fit':
      return parseFIT(await file.arrayBuffer());
    case 'tcx':
      return parseTCX(await file.text());
    default:
      throw new Error(`Unsupported file format: .${extension}`);
  }
}

/**
 * Convert points array to GeoJSON for MapLibre
 * @param {Array} points - Array of points with lat/lon
 * @returns {Object} - GeoJSON FeatureCollection
 */
export function pointsToGeoJSON(points) {
  const features = points
    .filter(p => p.lat !== undefined && p.lon !== undefined && !isNaN(p.lat) && !isNaN(p.lon))
    .map(point => ({
      type: 'Feature',
      properties: {
        time: point.time,
        elevation: point.elevation,
      },
      geometry: {
        type: 'Point',
        coordinates: [point.lon, point.lat],
      },
    }));

  return {
    type: 'FeatureCollection',
    features,
  };
}

/**
 * Calculate bounds from points
 * @param {Array} points - Array of points with lat/lon
 * @returns {Object} - Bounds object { minLat, maxLat, minLon, maxLon }
 */
export function calculateBounds(points) {
  const validPoints = points.filter(
    p => p.lat !== undefined && p.lon !== undefined && !isNaN(p.lat) && !isNaN(p.lon)
  );

  if (validPoints.length === 0) {
    return null;
  }

  return validPoints.reduce(
    (bounds, point) => ({
      minLat: Math.min(bounds.minLat, point.lat),
      maxLat: Math.max(bounds.maxLat, point.lat),
      minLon: Math.min(bounds.minLon, point.lon),
      maxLon: Math.max(bounds.maxLon, point.lon),
    }),
    {
      minLat: Infinity,
      maxLat: -Infinity,
      minLon: Infinity,
      maxLon: -Infinity,
    }
  );
}

/**
 * Calculate statistics from points
 * @param {Array} points - Array of points
 * @returns {Object} - Statistics object
 */
export function calculateStats(points) {
  const validPoints = points.filter(
    p => p.lat !== undefined && p.lon !== undefined && !isNaN(p.lat) && !isNaN(p.lon)
  );

  // Calculate total distance (simple haversine)
  let totalDistance = 0;
  for (let i = 1; i < validPoints.length; i++) {
    totalDistance += haversineDistance(
      validPoints[i - 1].lat,
      validPoints[i - 1].lon,
      validPoints[i].lat,
      validPoints[i].lon
    );
  }

  // Get time range if available
  const pointsWithTime = validPoints.filter(p => p.time);
  let timeRange = null;
  if (pointsWithTime.length > 0) {
    const times = pointsWithTime.map(p => new Date(p.time).getTime()).filter(t => !isNaN(t));
    if (times.length > 0) {
      timeRange = {
        start: new Date(Math.min(...times)),
        end: new Date(Math.max(...times)),
      };
    }
  }

  return {
    totalPoints: validPoints.length,
    totalDistance: totalDistance / 1000, // km
    timeRange,
  };
}

/**
 * Calculate haversine distance between two points
 * @returns {number} - Distance in meters
 */
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth's radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Export heatmap as PNG image
 * @param {Object} map - MapLibre map instance
 * @param {string} filename - Output filename
 */
export function exportMapAsImage(map, filename = 'heatmap.png') {
  const canvas = map.getCanvas();
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
