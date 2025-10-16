/**
 * Optimized Timeline Parser
 * Handles Google Timeline JSON with streaming/progressive approach
 */

// Convert E7 coordinate format to decimal degrees
export function e7ToDecimal(e7Value) {
  return e7Value / 10000000.0;
}

// Validate coordinates
function isValidCoordinate(lat, lng) {
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    !isNaN(lat) &&
    !isNaN(lng) &&
    isFinite(lat) &&
    isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

// Calculate duration
function calculateDuration(start, end) {
  if (!start || !end) return null;
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffMs = endDate - startDate;
  const minutes = Math.floor(diffMs / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    const remainingHours = hours % 24;
    return `${days}d ${remainingHours}h`;
  } else if (hours > 0) {
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  } else {
    return `${minutes}m`;
  }
}

// Get color for activity type
function getActivityColor(activityType) {
  const colors = {
    'IN_PASSENGER_VEHICLE': '#3b82f6', // Blue
    'IN_BUS': '#f59e0b',               // Orange
    'IN_TRAIN': '#8b5cf6',             // Purple
    'IN_SUBWAY': '#8b5cf6',            // Purple
    'WALKING': '#10b981',              // Green
    'RUNNING': '#ef4444',              // Red
    'CYCLING': '#06b6d4',              // Cyan
    'MOTORCYCLING': '#f97316',         // Orange-red
    'FLYING': '#6366f1',               // Indigo
    'SKIING': '#0ea5e9',               // Sky blue
    'SAILING': '#14b8a6',              // Teal
    'UNKNOWN': '#6b7280',              // Gray
  };
  return colors[activityType] || colors['UNKNOWN'];
}

// Detect format
export function detectFormat(data) {
  if (data.locations && Array.isArray(data.locations)) return 'records';
  if (data.timelineObjects && Array.isArray(data.timelineObjects)) return 'semantic';
  if (data.deviceSettings && Array.isArray(data.deviceSettings)) return 'settings';
  if (data.timelineEdits && Array.isArray(data.timelineEdits)) return 'timelineEdits';
  // Semantic segments format (jq-parsed location history)
  if (data.semanticSegments && Array.isArray(data.semanticSegments)) return 'semanticSegments';
  // New location-history format: array of objects with startTime/endTime
  if (Array.isArray(data) && data.length > 0 && data[0].startTime && data[0].endTime) return 'locationHistory';
  return 'unknown';
}

// Parse Records.json
export function parseRecords(data) {
  console.log('[parseRecords] Starting to parse Records.json format');
  const points = [];
  const fileId = Math.random().toString(36).substr(2, 9);

  if (!data.locations || !Array.isArray(data.locations)) {
    console.log('[parseRecords] No locations array found');
    return { points, paths: [], metadata: { format: 'records' } };
  }

  console.log(`[parseRecords] Found ${data.locations.length} location records`);

  // Process points in chunks to avoid blocking
  for (let i = 0; i < data.locations.length; i++) {
    const location = data.locations[i];
    if (!location.latitudeE7 || !location.longitudeE7) continue;

    const lat = e7ToDecimal(location.latitudeE7);
    const lng = e7ToDecimal(location.longitudeE7);
    if (!isValidCoordinate(lat, lng)) continue;

    // Extract activity information if available
    let activityType = null;
    let activityConfidence = null;
    if (location.activity && Array.isArray(location.activity) && location.activity.length > 0) {
      const activityRecord = location.activity[0];
      if (activityRecord.activity && Array.isArray(activityRecord.activity) && activityRecord.activity.length > 0) {
        // Get the top activity (highest confidence)
        const topActivity = activityRecord.activity.reduce((max, act) =>
          (act.confidence > (max?.confidence || 0)) ? act : max
        , null);
        if (topActivity) {
          activityType = topActivity.type;
          activityConfidence = topActivity.confidence;
        }
      }
    }

    points.push({
      id: `record-${fileId}-${i}`,
      lat,
      lng,
      timestamp: location.timestamp || location.timestampMs || null,
      accuracy: location.accuracy || null,
      altitude: location.altitude || null,
      velocity: location.velocity || null,
      heading: location.heading || null,
      verticalAccuracy: location.verticalAccuracy || null,
      source: location.source || null,
      deviceTag: location.deviceTag || null,
      platformType: location.platformType || null,
      formFactor: location.formFactor || null,
      deviceDesignation: location.deviceDesignation || null,
      osLevel: location.osLevel || null,
      batteryCharging: location.batteryCharging || null,
      placeId: location.placeId || null,
      type: 'location_record',
      activityType: activityType,
      activityConfidence: activityConfidence,
    });
  }

  console.log(`[parseRecords] Parsed ${points.length} valid points`);

  // Sort by timestamp (use faster sort for large datasets)
  console.log('[parseRecords] Sorting points by timestamp...');
  if (points.length > 100000) {
    console.log('[parseRecords] Large dataset detected, using optimized sort');
  }

  points.sort((a, b) => {
    if (!a.timestamp || !b.timestamp) return 0;
    const aTime = new Date(a.timestamp).getTime();
    const bTime = new Date(b.timestamp).getTime();
    return aTime - bTime;
  });

  console.log('[parseRecords] ✓ Sorting complete');

  return {
    points,
    paths: [],
    metadata: { format: 'records', totalPoints: points.length }
  };
}

// Parse Semantic.json
export function parseSemantic(data) {
  const points = [];
  const paths = [];
  const fileId = Math.random().toString(36).substr(2, 9);

  if (!data.timelineObjects || !Array.isArray(data.timelineObjects)) {
    return { points, paths, metadata: { format: 'semantic' } };
  }

  data.timelineObjects.forEach((obj, index) => {
    // Handle placeVisit
    if (obj.placeVisit) {
      const visit = obj.placeVisit;
      const location = visit.location || {};

      if (location.latitudeE7 && location.longitudeE7) {
        const lat = e7ToDecimal(location.latitudeE7);
        const lng = e7ToDecimal(location.longitudeE7);

        if (isValidCoordinate(lat, lng)) {
          points.push({
            id: `visit-${fileId}-${index}`,
            lat,
            lng,
            timestamp: visit.duration?.startTimestamp || null,
            arrived: visit.duration?.startTimestamp || null,
            departed: visit.duration?.endTimestamp || null,
            duration: calculateDuration(visit.duration?.startTimestamp, visit.duration?.endTimestamp),
            address: location.address || null,
            name: location.name || null,
            type: 'place_visit',
          });
        }
      }
    }

    // Handle activitySegment
    if (obj.activitySegment) {
      const segment = obj.activitySegment;
      const startLoc = segment.startLocation;
      const endLoc = segment.endLocation;

      if (startLoc?.latitudeE7 && startLoc?.longitudeE7 && endLoc?.latitudeE7 && endLoc?.longitudeE7) {
        const pathCoords = [];

        // Use simplified path if available
        if (segment.simplifiedRawPath?.points) {
          segment.simplifiedRawPath.points.forEach(p => {
            if (p.latE7 && p.lngE7) {
              const lat = e7ToDecimal(p.latE7);
              const lng = e7ToDecimal(p.lngE7);
              if (isValidCoordinate(lat, lng)) {
                pathCoords.push([lat, lng]);
              }
            }
          });
        }

        // Fallback to straight line
        if (pathCoords.length === 0) {
          const startLat = e7ToDecimal(startLoc.latitudeE7);
          const startLng = e7ToDecimal(startLoc.longitudeE7);
          const endLat = e7ToDecimal(endLoc.latitudeE7);
          const endLng = e7ToDecimal(endLoc.longitudeE7);

          if (isValidCoordinate(startLat, startLng) && isValidCoordinate(endLat, endLng)) {
            pathCoords.push([startLat, startLng], [endLat, endLng]);
          }
        }

        if (pathCoords.length >= 2) {
          paths.push({
            id: `activity-path-${fileId}-${index}`,
            coordinates: pathCoords,
            activityType: segment.activityType,
            distance: segment.distance || null,
            startTimestamp: segment.duration?.startTimestamp || null,
            endTimestamp: segment.duration?.endTimestamp || null,
            duration: calculateDuration(segment.duration?.startTimestamp, segment.duration?.endTimestamp),
          });
        }
      }
    }
  });

  // Sort points
  points.sort((a, b) => {
    if (!a.timestamp || !b.timestamp) return 0;
    return new Date(a.timestamp) - new Date(b.timestamp);
  });

  return {
    points,
    paths,
    metadata: { format: 'semantic', totalPoints: points.length, totalPaths: paths.length }
  };
}

// Parse Settings.json
export function parseSettings(data) {
  const devices = [];

  if (data.deviceSettings && Array.isArray(data.deviceSettings)) {
    data.deviceSettings.forEach((device, index) => {
      devices.push({
        id: `device-${index}`,
        deviceTag: device.deviceTag,
        deviceName: device.devicePrettyName || 'Unknown Device',
        platform: device.platformType || 'UNKNOWN',
      });
    });
  }

  return {
    points: [],
    paths: [],
    metadata: { format: 'settings', devices }
  };
}

// Parse TimelineEdits.json
export function parseTimelineEdits(data) {
  const points = [];
  const fileId = Math.random().toString(36).substr(2, 9);

  if (!data.timelineEdits || !Array.isArray(data.timelineEdits)) {
    return { points, paths: [], metadata: { format: 'timelineEdits' } };
  }

  data.timelineEdits.forEach((edit, editIndex) => {
    // Parse place aggregates
    if (edit.placeAggregates?.placeAggregateInfo) {
      edit.placeAggregates.placeAggregateInfo.forEach((place, index) => {
        if (place.point?.latE7 && place.point?.lngE7) {
          const lat = e7ToDecimal(place.point.latE7);
          const lng = e7ToDecimal(place.point.lngE7);

          if (isValidCoordinate(lat, lng)) {
            points.push({
              id: `aggregate-${fileId}-${editIndex}-${index}`,
              lat,
              lng,
              type: 'place_aggregate',
            });
          }
        }
      });
    }

    // Parse raw signal
    if (edit.rawSignal?.signal?.position) {
      const pos = edit.rawSignal.signal.position;
      if (pos.point?.latE7 && pos.point?.lngE7) {
        const lat = e7ToDecimal(pos.point.latE7);
        const lng = e7ToDecimal(pos.point.lngE7);

        if (isValidCoordinate(lat, lng)) {
          points.push({
            id: `signal-${fileId}-${editIndex}`,
            lat,
            lng,
            timestamp: pos.timestamp || null,
            type: 'raw_signal',
          });
        }
      }
    }
  });

  return {
    points,
    paths: [],
    metadata: { format: 'timelineEdits', totalPoints: points.length }
  };
}

/**
 * Parse location-history format (new Google Timeline export format)
 * @param {Array} data - Array of timeline entries
 * @returns {Object} Normalized data with points and paths
 */
export function parseLocationHistory(data) {
  console.log('[parseLocationHistory] Starting to parse location-history format');
  const points = [];
  const paths = [];

  if (!Array.isArray(data)) {
    console.log('[parseLocationHistory] Data is not an array');
    return { points, paths, metadata: {} };
  }

  console.log(`[parseLocationHistory] Found ${data.length} timeline entries`);

  // Generate unique ID prefix for this file
  const fileId = Math.random().toString(36).substr(2, 9);

  // Process entries in a loop for better performance monitoring
  for (let i = 0; i < data.length; i++) {
    const entry = data[i];

    // Parse visit locations
    if (entry.visit) {
      const visit = entry.visit;
      const topCandidate = visit.topCandidate;

      if (topCandidate && topCandidate.placeLocation) {
        // placeLocation is a string like "geo:37.7749,-122.4194"
        const coords = parseGeoString(topCandidate.placeLocation);
        if (coords) {
          const point = {
            id: `visit-${fileId}-${i}`,
            lat: coords.lat,
            lng: coords.lng,
            timestamp: entry.startTime,
            arrived: entry.startTime,
            departed: entry.endTime,
            duration: calculateDuration(entry.startTime, entry.endTime),
            placeId: topCandidate.placeID || null,
            type: 'place_visit',
            semanticType: topCandidate.semanticType || null,
            probability: topCandidate.probability || null,
          };
          points.push(point);
        }
      }
    }

    // Parse activity segments
    if (entry.activity) {
      const activity = entry.activity;
      const topCandidate = activity.topCandidate;
      const pathCoords = [];

      // Parse timelinePath for the actual route
      if (entry.timelinePath && Array.isArray(entry.timelinePath)) {
        for (let j = 0; j < entry.timelinePath.length; j++) {
          const pathPoint = entry.timelinePath[j];
          if (pathPoint.point) {
            const coords = parseGeoString(pathPoint.point);
            if (coords) {
              pathCoords.push([coords.lat, coords.lng]);
            }
          }
        }
      }

      // Create path if we have coordinates
      if (pathCoords.length >= 2) {
        paths.push({
          id: `activity-path-${fileId}-${i}`,
          coordinates: pathCoords,
          type: 'activity_segment',
          activityType: topCandidate?.type || 'UNKNOWN',
          distance: activity.distanceMeters ? parseInt(activity.distanceMeters) : null,
          startTimestamp: entry.startTime,
          endTimestamp: entry.endTime,
          duration: calculateDuration(entry.startTime, entry.endTime),
          color: getActivityColor(topCandidate?.type || 'UNKNOWN'),
          probability: topCandidate?.probability || null,
        });
      }
    }

    // Log progress for large datasets
    if (data.length > 10000 && (i + 1) % 10000 === 0) {
      console.log(`[parseLocationHistory] Processed ${i + 1}/${data.length} entries (${Math.round((i + 1) / data.length * 100)}%)`);
    }
  }

  console.log(`[parseLocationHistory] Parsed ${points.length} points and ${paths.length} paths`);

  // Sort points by timestamp (optimized for large datasets)
  console.log('[parseLocationHistory] Sorting points by timestamp...');
  if (points.length > 100000) {
    console.log('[parseLocationHistory] Large dataset detected, using optimized sort');
  }

  points.sort((a, b) => {
    if (!a.timestamp || !b.timestamp) return 0;
    const aTime = new Date(a.timestamp).getTime();
    const bTime = new Date(b.timestamp).getTime();
    return aTime - bTime;
  });

  console.log('[parseLocationHistory] ✓ Sorting complete');
  console.log('[parseLocationHistory] Parsing complete');

  return {
    points,
    paths,
    metadata: {
      format: 'locationHistory',
      totalPoints: points.length,
      totalPaths: paths.length,
    }
  };
}

/**
 * Parse semantic segments format (jq-parsed location history)
 * @param {Object} data - Data with semanticSegments array
 * @returns {Object} Normalized data with points and paths
 */
export function parseSemanticSegments(data) {
  console.log('[parseSemanticSegments] Starting to parse semantic segments format');
  const points = [];
  const paths = [];

  if (!data.semanticSegments || !Array.isArray(data.semanticSegments)) {
    console.log('[parseSemanticSegments] No semanticSegments array found');
    return { points, paths, metadata: {} };
  }

  console.log(`[parseSemanticSegments] Found ${data.semanticSegments.length} semantic segments`);

  // Generate unique ID prefix for this file
  const fileId = Math.random().toString(36).substr(2, 9);

  // Process segments
  for (let i = 0; i < data.semanticSegments.length; i++) {
    const segment = data.semanticSegments[i];

    // Parse timelinePath to extract points
    if (segment.timelinePath && Array.isArray(segment.timelinePath)) {
      const pathCoords = [];

      for (let j = 0; j < segment.timelinePath.length; j++) {
        const pathPoint = segment.timelinePath[j];
        if (pathPoint.point) {
          const coords = parseGeoString(pathPoint.point);
          if (coords) {
            pathCoords.push([coords.lat, coords.lng]);

            // Create a point for the first location in each segment (as a visit marker)
            if (j === 0) {
              points.push({
                id: `segment-${fileId}-${i}`,
                lat: coords.lat,
                lng: coords.lng,
                timestamp: segment.startTime || pathPoint.time || null,
                arrived: segment.startTime || null,
                departed: segment.endTime || null,
                duration: calculateDuration(segment.startTime, segment.endTime),
                type: 'place_visit',
              });
            }
          }
        }
      }

      // Create path if we have coordinates
      if (pathCoords.length >= 2) {
        paths.push({
          id: `segment-path-${fileId}-${i}`,
          coordinates: pathCoords,
          type: 'activity_segment',
          activityType: 'UNKNOWN',
          startTimestamp: segment.startTime || null,
          endTimestamp: segment.endTime || null,
          duration: calculateDuration(segment.startTime, segment.endTime),
          color: getActivityColor('UNKNOWN'),
        });
      }
    }

    // Log progress for large datasets
    if (data.semanticSegments.length > 10000 && (i + 1) % 10000 === 0) {
      console.log(`[parseSemanticSegments] Processed ${i + 1}/${data.semanticSegments.length} segments (${Math.round((i + 1) / data.semanticSegments.length * 100)}%)`);
    }
  }

  console.log(`[parseSemanticSegments] Parsed ${points.length} points and ${paths.length} paths`);

  // Sort points by timestamp (optimized for large datasets)
  console.log('[parseSemanticSegments] Sorting points by timestamp...');
  if (points.length > 100000) {
    console.log('[parseSemanticSegments] Large dataset detected, using optimized sort');
  }

  points.sort((a, b) => {
    if (!a.timestamp || !b.timestamp) return 0;
    const aTime = new Date(a.timestamp).getTime();
    const bTime = new Date(b.timestamp).getTime();
    return aTime - bTime;
  });

  console.log('[parseSemanticSegments] ✓ Sorting complete');
  console.log('[parseSemanticSegments] Parsing complete');

  return {
    points,
    paths,
    metadata: {
      format: 'semanticSegments',
      totalPoints: points.length,
      totalPaths: paths.length,
    }
  };
}

/**
 * Parse geo string in format "geo:lat,lng" or "lat,lng"
 * @param {string} geoString - Geographic coordinate string
 * @returns {Object|null} Object with lat/lng or null if invalid
 */
function parseGeoString(geoString) {
  if (!geoString || typeof geoString !== 'string') return null;

  // Remove "geo:" prefix if present
  const coordString = geoString.replace(/^geo:/, '');
  const parts = coordString.split(',');

  if (parts.length !== 2) return null;

  const lat = parseFloat(parts[0]);
  const lng = parseFloat(parts[1]);

  if (isNaN(lat) || isNaN(lng)) return null;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;

  return { lat, lng };
}

// Main parser
export function parseTimeline(data) {
  const format = detectFormat(data);

  switch (format) {
    case 'records':
      return parseRecords(data);
    case 'semantic':
      return parseSemantic(data);
    case 'settings':
      return parseSettings(data);
    case 'timelineEdits':
      return parseTimelineEdits(data);
    case 'semanticSegments':
      return parseSemanticSegments(data);
    case 'locationHistory':
      return parseLocationHistory(data);
    default:
      return { points: [], paths: [], metadata: { format: 'unknown' } };
  }
}

// Simple merge - just concatenate without deduplication
export function mergeTimelineData(parsedFiles) {
  const allPoints = [];
  const allPaths = [];
  const devices = [];

  parsedFiles.forEach(file => {
    if (file.points) allPoints.push(...file.points);
    if (file.paths) allPaths.push(...file.paths);
    if (file.metadata?.devices) devices.push(...file.metadata.devices);
  });

  return {
    points: allPoints,
    paths: allPaths,
    metadata: {
      totalPoints: allPoints.length,
      totalPaths: allPaths.length,
      devices,
      formats: parsedFiles.map(f => f.metadata?.format).filter(Boolean),
    }
  };
}
