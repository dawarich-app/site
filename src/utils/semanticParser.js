/**
 * Parser for Google Timeline Semantic.json format
 * Based on Semantic.schema.json specification
 */

/**
 * Convert E7 coordinate to decimal degrees
 * @param {number} e7Value - Coordinate in E7 format (degrees * 10^7)
 * @returns {number|null} Decimal degrees or null if invalid
 */
function e7ToDecimal(e7Value) {
  if (e7Value === undefined || e7Value === null || isNaN(e7Value)) {
    return null;
  }
  return e7Value / 10000000.0;
}

/**
 * Parse a single place visit
 * @param {object} placeVisit - Place visit object from timeline
 * @param {number} index - Index for generating unique ID
 * @returns {object} Parsed point
 */
function parsePlaceVisit(placeVisit, index) {
  const location = placeVisit.location || {};
  const duration = placeVisit.duration || {};

  // Use centerLatE7/centerLngE7 if available, otherwise latitudeE7/longitudeE7 from location
  const lat = placeVisit.centerLatE7
    ? e7ToDecimal(placeVisit.centerLatE7)
    : location.latitudeE7
    ? e7ToDecimal(location.latitudeE7)
    : null;

  const lng = placeVisit.centerLngE7
    ? e7ToDecimal(placeVisit.centerLngE7)
    : location.longitudeE7
    ? e7ToDecimal(location.longitudeE7)
    : null;

  if (!lat || !lng) {
    return null;
  }

  return {
    id: `place-${index}-${duration.startTimestamp || Date.now()}`,
    lat,
    lng,
    timestamp: duration.startTimestamp,
    type: 'place_visit',
    name: location.name || 'Unknown Location',
    address: location.address || '',
    placeId: location.placeId,
    semanticType: location.semanticType,
    startTime: duration.startTimestamp,
    endTime: duration.endTimestamp,
    placeConfidence: placeVisit.placeConfidence,
    visitConfidence: placeVisit.visitConfidence,
  };
}

/**
 * Parse a single activity segment into a path
 * @param {object} activitySegment - Activity segment object from timeline
 * @param {number} index - Index for generating unique ID
 * @returns {object|null} Parsed path or null if invalid
 */
function parseActivitySegment(activitySegment, index) {
  const startLocation = activitySegment.startLocation;
  const endLocation = activitySegment.endLocation;
  const duration = activitySegment.duration || {};

  if (!startLocation || !endLocation) {
    return null;
  }

  const startLat = e7ToDecimal(startLocation.latitudeE7);
  const startLng = e7ToDecimal(startLocation.longitudeE7);
  const endLat = e7ToDecimal(endLocation.latitudeE7);
  const endLng = e7ToDecimal(endLocation.longitudeE7);

  // Validate start/end coordinates
  if (startLat === null || startLng === null || endLat === null || endLng === null) {
    return null;
  }

  // Build coordinates array from waypoints or simplified raw path if available
  let coordinates = [[startLat, startLng]];

  if (activitySegment.waypointPath?.waypoints) {
    const waypoints = activitySegment.waypointPath.waypoints
      .map(wp => {
        const lat = e7ToDecimal(wp.latE7);
        const lng = e7ToDecimal(wp.lngE7);
        return lat !== null && lng !== null ? [lat, lng] : null;
      })
      .filter(coord => coord !== null);

    coordinates = [[startLat, startLng], ...waypoints, [endLat, endLng]];
  } else if (activitySegment.simplifiedRawPath?.points) {
    const points = activitySegment.simplifiedRawPath.points
      .map(p => {
        const lat = e7ToDecimal(p.latE7);
        const lng = e7ToDecimal(p.lngE7);
        return lat !== null && lng !== null ? [lat, lng] : null;
      })
      .filter(coord => coord !== null);

    if (points.length > 0) {
      coordinates = points;
    }
  } else {
    // Just use start and end
    coordinates = [[startLat, startLng], [endLat, endLng]];
  }

  return {
    id: `activity-${index}-${duration.startTimestamp || Date.now()}`,
    coordinates,
    activityType: activitySegment.activityType || 'UNKNOWN',
    distance: activitySegment.distance,
    startTime: duration.startTimestamp,
    endTime: duration.endTimestamp,
    confidence: activitySegment.confidence,
  };
}

/**
 * Parse Semantic.json file
 * @param {object} data - Parsed JSON data from Semantic.json
 * @returns {object} Object with points and paths arrays
 */
export function parseSemantic(data) {
  const points = [];
  const paths = [];

  if (!data.timelineObjects || !Array.isArray(data.timelineObjects)) {
    console.warn('No timelineObjects found in Semantic data');
    return { points, paths };
  }

  // Sort timeline objects by start time
  const sortedObjects = [...data.timelineObjects].sort((a, b) => {
    const aTime = a.placeVisit?.duration?.startTimestamp ||
                  a.activitySegment?.duration?.startTimestamp ||
                  0;
    const bTime = b.placeVisit?.duration?.startTimestamp ||
                  b.activitySegment?.duration?.startTimestamp ||
                  0;
    return new Date(aTime) - new Date(bTime);
  });

  sortedObjects.forEach((obj, index) => {
    // Check if this is a place visit
    if (obj.placeVisit) {
      const point = parsePlaceVisit(obj.placeVisit, index);
      if (point) {
        points.push(point);
      }
    }

    // Check if this is an activity segment
    if (obj.activitySegment) {
      const path = parseActivitySegment(obj.activitySegment, index);
      if (path) {
        paths.push(path);
      }
    }
  });

  console.log(`Parsed Semantic data: ${points.length} points, ${paths.length} paths`);
  return { points, paths };
}
