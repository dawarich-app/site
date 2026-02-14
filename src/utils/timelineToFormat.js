/**
 * Bridge utility mapping timeline parser output to format converter input.
 *
 * Timeline parser outputs:
 *   points: { lat, lng, timestamp, type: 'place_visit'|'location_record'|... }
 *   paths:  { coordinates: [[lat,lng],...], startTimestamp, endTimestamp, activityType }
 *
 * Format converters expect:
 *   points: { lat, lon, time, type: 'trackpoint'|'waypoint'|'point', elevation, name }
 */

/**
 * Convert timeline parser points/paths to format converter points
 * @param {Array} points - Timeline parser points
 * @param {Array} paths - Timeline parser paths
 * @returns {Array} Format converter compatible points
 */
export function timelineToConverterPoints(points, paths) {
  const converterPoints = [];

  // Convert place visits to waypoints, everything else to trackpoints
  points.forEach(point => {
    if (point.type === 'place_visit') {
      converterPoints.push({
        type: 'waypoint',
        lat: point.lat,
        lon: point.lng,
        time: point.timestamp ? new Date(point.timestamp).toISOString() : undefined,
        name: point.name || point.address || undefined,
        elevation: point.altitude || undefined,
      });
    } else {
      converterPoints.push({
        type: 'trackpoint',
        lat: point.lat,
        lon: point.lng,
        time: point.timestamp ? new Date(point.timestamp).toISOString() : undefined,
        elevation: point.altitude || undefined,
      });
    }
  });

  // Convert path coordinates to trackpoints
  if (paths && paths.length > 0) {
    paths.forEach(path => {
      path.coordinates.forEach((coord, idx) => {
        converterPoints.push({
          type: 'trackpoint',
          lat: coord[0],
          lon: coord[1],
          time: idx === 0 && path.startTimestamp
            ? new Date(path.startTimestamp).toISOString()
            : idx === path.coordinates.length - 1 && path.endTimestamp
              ? new Date(path.endTimestamp).toISOString()
              : undefined,
        });
      });
    });
  }

  return converterPoints;
}

/**
 * Generate CSV string from timeline data
 * @param {Array} points - Timeline parser points
 * @param {Array} paths - Timeline parser paths
 * @returns {string} CSV content
 */
export function timelineToCSV(points, paths) {
  const rows = [['latitude', 'longitude', 'timestamp', 'type', 'name', 'address', 'activity_type', 'altitude', 'accuracy']];

  points.forEach(point => {
    rows.push([
      point.lat,
      point.lng,
      point.timestamp || '',
      point.type || '',
      point.name || '',
      point.address || '',
      point.activityType || '',
      point.altitude || '',
      point.accuracy || '',
    ]);
  });

  if (paths && paths.length > 0) {
    paths.forEach(path => {
      path.coordinates.forEach((coord, idx) => {
        rows.push([
          coord[0],
          coord[1],
          idx === 0 ? path.startTimestamp || '' : idx === path.coordinates.length - 1 ? path.endTimestamp || '' : '',
          'activity_segment',
          '',
          '',
          path.activityType || '',
          '',
          '',
        ]);
      });
    });
  }

  return rows.map(row => row.map(cell => {
    const str = String(cell);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }).join(',')).join('\n');
}
