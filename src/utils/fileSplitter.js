/**
 * File splitting utilities for GPS/location files.
 * Supports splitting by size, point count, or date.
 */

import JSZip from 'jszip';
import { toGPX, toGeoJSON, toKML } from './formatConverters';

/**
 * Estimate output size per point for a given format
 * @param {string} format - Output format (gpx, geojson, kml, csv, json)
 * @returns {number} Estimated bytes per point
 */
export function estimateChunkSize(format) {
  const estimates = {
    gpx: 180,      // ~180 bytes per trkpt element
    geojson: 150,  // ~150 bytes per Feature
    kml: 160,      // ~160 bytes per coordinate
    csv: 80,       // ~80 bytes per CSV row
    json: 120,     // ~120 bytes per JSON object
  };
  return estimates[format] || 150;
}

/**
 * Split points into chunks targeting a specific file size
 * @param {Array} points - Array of points
 * @param {number} targetSizeMB - Target size per chunk in MB
 * @param {string} format - Output format
 * @returns {Array} Array of point arrays (chunks)
 */
export function splitBySize(points, targetSizeMB, format) {
  const targetBytes = targetSizeMB * 1024 * 1024;
  const bytesPerPoint = estimateChunkSize(format);
  const pointsPerChunk = Math.max(1, Math.floor(targetBytes / bytesPerPoint));

  return splitByCount(points, pointsPerChunk);
}

/**
 * Split points into chunks by point count
 * @param {Array} points - Array of points
 * @param {number} countPerChunk - Points per chunk
 * @returns {Array} Array of point arrays (chunks)
 */
export function splitByCount(points, countPerChunk) {
  const chunks = [];
  for (let i = 0; i < points.length; i += countPerChunk) {
    chunks.push(points.slice(i, i + countPerChunk));
  }
  return chunks;
}

/**
 * Split points into chunks by date (year or month)
 * @param {Array} points - Array of points with time/timestamp field
 * @param {string} granularity - 'year' or 'month'
 * @returns {Array} Array of { label, points } objects
 */
export function splitByDate(points, granularity) {
  const groups = new Map();

  points.forEach(point => {
    const ts = point.time || point.timestamp;
    if (!ts) {
      const key = 'no-date';
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(point);
      return;
    }

    const date = new Date(ts);
    if (isNaN(date.getTime())) {
      const key = 'no-date';
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(point);
      return;
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const key = granularity === 'month' ? `${year}-${month}` : String(year);

    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(point);
  });

  // Sort by key and return
  return Array.from(groups.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([label, pts]) => ({ label, points: pts }));
}

/**
 * Convert points to a specific format string
 * @param {Array} points - Format converter compatible points
 * @param {string} format - Output format
 * @param {string} name - Chunk name for metadata
 * @returns {string} Formatted content
 */
function pointsToFormat(points, format, name) {
  switch (format) {
    case 'gpx':
      return toGPX(points, { name, description: `Split chunk: ${name}` });
    case 'geojson':
      return toGeoJSON(points);
    case 'kml':
      return toKML(points, { name, description: `Split chunk: ${name}` });
    case 'csv': {
      const header = 'latitude,longitude,elevation,time,type,name';
      const rows = points.map(p =>
        [p.lat, p.lon, p.elevation || '', p.time || '', p.type || '', p.name || '']
          .map(cell => {
            const str = String(cell);
            if (str.includes(',') || str.includes('"')) return `"${str.replace(/"/g, '""')}"`;
            return str;
          }).join(',')
      );
      return header + '\n' + rows.join('\n');
    }
    case 'json':
      return JSON.stringify(points, null, 2);
    default:
      return JSON.stringify(points, null, 2);
  }
}

/**
 * Get file extension for a format
 * @param {string} format
 * @returns {string}
 */
function getExtension(format) {
  const exts = { gpx: 'gpx', geojson: 'geojson', kml: 'kml', csv: 'csv', json: 'json' };
  return exts[format] || 'json';
}

/**
 * Package chunks into a ZIP file
 * @param {Array} chunks - Array of point arrays or { label, points } objects
 * @param {string} format - Output format
 * @param {string} baseFilename - Base name for files
 * @returns {Promise<Blob>} ZIP blob
 */
export async function packageAsZip(chunks, format, baseFilename) {
  const zip = new JSZip();
  const ext = getExtension(format);
  const baseName = baseFilename.replace(/\.[^.]+$/, '');

  chunks.forEach((chunk, idx) => {
    const points = Array.isArray(chunk) ? chunk : chunk.points;
    const label = chunk.label || String(idx + 1).padStart(3, '0');
    const filename = `${baseName}_${label}.${ext}`;
    const content = pointsToFormat(points, format, `${baseName} - Part ${label}`);
    zip.file(filename, content);
  });

  return await zip.generateAsync({ type: 'blob' });
}

/**
 * Parse input file to get normalized points for splitting
 * Handles both format-parser points (lat/lon) and timeline-parser points (lat/lng)
 * @param {Array} points - Input points from any parser
 * @returns {Array} Normalized points with lat/lon fields
 */
export function normalizePointsForSplit(points) {
  return points.map(p => ({
    ...p,
    lat: p.lat,
    lon: p.lon !== undefined ? p.lon : p.lng,
    time: p.time || (p.timestamp ? new Date(p.timestamp).toISOString() : undefined),
    type: p.type || 'trackpoint',
  }));
}
