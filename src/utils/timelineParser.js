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

// Detect format
export function detectFormat(data) {
  if (data.locations && Array.isArray(data.locations)) return 'records';
  if (data.timelineObjects && Array.isArray(data.timelineObjects)) return 'semantic';
  if (data.deviceSettings && Array.isArray(data.deviceSettings)) return 'settings';
  if (data.timelineEdits && Array.isArray(data.timelineEdits)) return 'timelineEdits';
  return 'unknown';
}

// Parse Records.json
export function parseRecords(data) {
  const points = [];
  const fileId = Math.random().toString(36).substr(2, 9);

  if (!data.locations || !Array.isArray(data.locations)) {
    return { points, paths: [], metadata: { format: 'records' } };
  }

  // Process points in chunks to avoid blocking
  for (let i = 0; i < data.locations.length; i++) {
    const location = data.locations[i];
    if (!location.latitudeE7 || !location.longitudeE7) continue;

    const lat = e7ToDecimal(location.latitudeE7);
    const lng = e7ToDecimal(location.longitudeE7);
    if (!isValidCoordinate(lat, lng)) continue;

    points.push({
      id: `record-${fileId}-${i}`,
      lat,
      lng,
      timestamp: location.timestamp || null,
      accuracy: location.accuracy || null,
      type: 'location_record',
    });
  }

  // Sort by timestamp
  points.sort((a, b) => {
    if (!a.timestamp || !b.timestamp) return 0;
    return new Date(a.timestamp) - new Date(b.timestamp);
  });

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
