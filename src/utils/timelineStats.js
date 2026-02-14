/**
 * Statistics engine for Google Timeline data.
 * Used by the Statistics Analyzer and Mileage Calculator tools.
 */

import { haversineDistance, metersToKm, metersToMiles } from './geo';

/**
 * Calculate total distance from an array of points
 * @param {Array} points - Sorted array of { lat, lng, timestamp }
 * @returns {number} Total distance in meters
 */
export function calculateTotalDistance(points) {
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    if (prev.lat != null && prev.lng != null && curr.lat != null && curr.lng != null) {
      const d = haversineDistance(prev.lat, prev.lng, curr.lat, curr.lng);
      // Skip unreasonable jumps (> 500km between consecutive points)
      if (d < 500000) {
        total += d;
      }
    }
  }
  return total;
}

/**
 * Calculate distance from paths (activity segments)
 * @param {Array} paths - Array of path objects with coordinates
 * @returns {number} Total distance in meters
 */
export function calculatePathDistance(paths) {
  let total = 0;
  paths.forEach(path => {
    if (path.distance) {
      total += path.distance;
    } else if (path.coordinates && path.coordinates.length >= 2) {
      for (let i = 1; i < path.coordinates.length; i++) {
        const prev = path.coordinates[i - 1];
        const curr = path.coordinates[i];
        total += haversineDistance(prev[0], prev[1], curr[0], curr[1]);
      }
    }
  });
  return total;
}

/**
 * Extract unique places from points (place_visit types with names/addresses)
 * @param {Array} points - Timeline parser points
 * @returns {Array} Unique places with visit counts
 */
export function extractUniquePlaces(points) {
  const placeMap = new Map();

  points.forEach(point => {
    if (point.type === 'place_visit' && (point.name || point.address)) {
      const key = point.name || point.address;
      if (placeMap.has(key)) {
        const place = placeMap.get(key);
        place.visitCount++;
        if (point.timestamp) {
          place.lastVisit = point.timestamp;
        }
      } else {
        placeMap.set(key, {
          name: point.name || '',
          address: point.address || '',
          lat: point.lat,
          lng: point.lng,
          visitCount: 1,
          firstVisit: point.timestamp || null,
          lastVisit: point.timestamp || null,
        });
      }
    }
  });

  return Array.from(placeMap.values());
}

/**
 * Get top N most visited places
 * @param {Array} points - Timeline parser points
 * @param {number} limit - Maximum number of places
 * @returns {Array} Top visited places sorted by visit count
 */
export function calculateTopVisitedPlaces(points, limit = 10) {
  const places = extractUniquePlaces(points);
  return places.sort((a, b) => b.visitCount - a.visitCount).slice(0, limit);
}

/**
 * Calculate time breakdown: time traveling vs stationary
 * @param {Array} points - Timeline parser points
 * @param {Array} paths - Timeline parser paths
 * @returns {Object} Time breakdown in milliseconds
 */
export function calculateTimeBreakdown(points, paths) {
  let travelingMs = 0;
  let stationaryMs = 0;

  // Calculate stationary time from place visits
  points.forEach(point => {
    if (point.type === 'place_visit' && point.arrived && point.departed) {
      const arrived = new Date(point.arrived).getTime();
      const departed = new Date(point.departed).getTime();
      if (!isNaN(arrived) && !isNaN(departed) && departed > arrived) {
        stationaryMs += departed - arrived;
      }
    }
  });

  // Calculate travel time from activity segments
  paths.forEach(path => {
    if (path.startTimestamp && path.endTimestamp) {
      const start = new Date(path.startTimestamp).getTime();
      const end = new Date(path.endTimestamp).getTime();
      if (!isNaN(start) && !isNaN(end) && end > start) {
        travelingMs += end - start;
      }
    }
  });

  return {
    travelingMs,
    stationaryMs,
    travelingHours: travelingMs / 3600000,
    stationaryHours: stationaryMs / 3600000,
  };
}

/**
 * Calculate activity type distribution
 * @param {Array} points - Points with activityType field
 * @param {Array} paths - Paths with activityType field
 * @returns {Object} Map of activity type to count and distance
 */
export function calculateActivityTypeDistribution(points, paths) {
  const distribution = {};

  // From paths (more reliable for activity types)
  paths.forEach(path => {
    const type = path.activityType || 'UNKNOWN';
    if (!distribution[type]) {
      distribution[type] = { count: 0, distanceMeters: 0, durationMs: 0 };
    }
    distribution[type].count++;

    if (path.distance) {
      distribution[type].distanceMeters += path.distance;
    } else if (path.coordinates && path.coordinates.length >= 2) {
      for (let i = 1; i < path.coordinates.length; i++) {
        const prev = path.coordinates[i - 1];
        const curr = path.coordinates[i];
        distribution[type].distanceMeters += haversineDistance(prev[0], prev[1], curr[0], curr[1]);
      }
    }

    if (path.startTimestamp && path.endTimestamp) {
      const dur = new Date(path.endTimestamp) - new Date(path.startTimestamp);
      if (dur > 0) distribution[type].durationMs += dur;
    }
  });

  // From points (Records.json format has activityType per point)
  points.forEach(point => {
    if (point.activityType) {
      const type = point.activityType;
      if (!distribution[type]) {
        distribution[type] = { count: 0, distanceMeters: 0, durationMs: 0 };
      }
      distribution[type].count++;
    }
  });

  return distribution;
}

/**
 * Calculate yearly/monthly breakdowns
 * @param {Array} points - Timeline parser points
 * @param {Array} paths - Timeline parser paths
 * @returns {Object} Yearly and monthly stats
 */
export function calculateYearlyBreakdown(points, paths) {
  const yearly = {};

  points.forEach(point => {
    if (!point.timestamp) return;
    const date = new Date(point.timestamp);
    if (isNaN(date.getTime())) return;
    const year = date.getFullYear();
    const month = date.getMonth();

    if (!yearly[year]) {
      yearly[year] = { pointCount: 0, months: {}, distanceMeters: 0 };
    }
    yearly[year].pointCount++;

    const monthKey = date.toLocaleString('en-US', { month: 'short' });
    if (!yearly[year].months[monthKey]) {
      yearly[year].months[monthKey] = { pointCount: 0 };
    }
    yearly[year].months[monthKey].pointCount++;
  });

  // Calculate distance per year
  const sortedPoints = [...points].filter(p => p.timestamp).sort((a, b) =>
    new Date(a.timestamp) - new Date(b.timestamp)
  );

  for (let i = 1; i < sortedPoints.length; i++) {
    const prev = sortedPoints[i - 1];
    const curr = sortedPoints[i];
    const year = new Date(curr.timestamp).getFullYear();
    if (yearly[year] && prev.lat != null && prev.lng != null && curr.lat != null && curr.lng != null) {
      const d = haversineDistance(prev.lat, prev.lng, curr.lat, curr.lng);
      if (d < 500000) {
        yearly[year].distanceMeters += d;
      }
    }
  }

  return yearly;
}

/**
 * Calculate complete travel statistics
 * @param {Array} points - Timeline parser points
 * @param {Array} paths - Timeline parser paths
 * @returns {Object} Complete stats object
 */
export function calculateTravelStats(points, paths) {
  const totalDistanceFromPoints = calculateTotalDistance(points);
  const totalDistanceFromPaths = calculatePathDistance(paths);
  const totalDistance = Math.max(totalDistanceFromPoints, totalDistanceFromPaths);

  const topPlaces = calculateTopVisitedPlaces(points);
  const uniquePlaces = extractUniquePlaces(points);
  const timeBreakdown = calculateTimeBreakdown(points, paths);
  const activityDistribution = calculateActivityTypeDistribution(points, paths);
  const yearlyBreakdown = calculateYearlyBreakdown(points, paths);

  // Date range
  const timestamps = points
    .filter(p => p.timestamp)
    .map(p => new Date(p.timestamp).getTime())
    .filter(t => !isNaN(t));

  const dateRange = timestamps.length > 0
    ? { start: new Date(Math.min(...timestamps)), end: new Date(Math.max(...timestamps)) }
    : null;

  // Extract country/city from addresses (Semantic data only)
  const countries = new Set();
  const cities = new Set();
  points.forEach(point => {
    if (point.address) {
      // Try to extract country (last part of address after last comma)
      const parts = point.address.split(',').map(s => s.trim());
      if (parts.length >= 2) {
        countries.add(parts[parts.length - 1]);
        cities.add(parts[parts.length - 2]);
      }
    }
  });

  return {
    totalPoints: points.length,
    totalPaths: paths.length,
    totalDistanceMeters: totalDistance,
    totalDistanceKm: metersToKm(totalDistance),
    totalDistanceMiles: metersToMiles(totalDistance),
    topPlaces,
    uniquePlacesCount: uniquePlaces.length,
    timeBreakdown,
    activityDistribution,
    yearlyBreakdown,
    dateRange,
    countries: Array.from(countries).filter(c => c.length > 0),
    cities: Array.from(cities).filter(c => c.length > 0),
    hasSemanticData: points.some(p => p.type === 'place_visit' && (p.name || p.address)),
  };
}

/**
 * Generate mileage log from driving segments
 * @param {Array} points - Timeline parser points
 * @param {Array} paths - Timeline parser paths
 * @param {Object} options - Filter options
 * @param {Date} options.startDate - Start date filter
 * @param {Date} options.endDate - End date filter
 * @param {string} options.unit - 'km' or 'miles'
 * @returns {Object} Mileage log with trips and summaries
 */
export function generateMileageLog(points, paths, options = {}) {
  const { startDate, endDate, unit = 'km' } = options;
  const convert = unit === 'miles' ? metersToMiles : metersToKm;

  // Filter driving segments from paths
  const drivingTypes = ['IN_PASSENGER_VEHICLE', 'IN_BUS', 'IN_TRAIN', 'IN_SUBWAY', 'MOTORCYCLING', 'DRIVING'];

  let drivingPaths = paths.filter(path => {
    if (!drivingTypes.includes(path.activityType)) return false;

    if (startDate && path.startTimestamp) {
      if (new Date(path.startTimestamp) < startDate) return false;
    }
    if (endDate && path.endTimestamp) {
      if (new Date(path.endTimestamp) > endDate) return false;
    }

    return true;
  });

  // Also extract driving segments from points (Records.json format)
  const drivingPoints = points.filter(point => {
    if (!drivingTypes.includes(point.activityType)) return false;
    if (!point.timestamp) return false;

    const ts = new Date(point.timestamp);
    if (startDate && ts < startDate) return false;
    if (endDate && ts > endDate) return false;

    return true;
  });

  // Build trip list from paths
  const trips = drivingPaths.map((path, idx) => {
    let distanceMeters = 0;
    if (path.distance) {
      distanceMeters = path.distance;
    } else if (path.coordinates && path.coordinates.length >= 2) {
      for (let i = 1; i < path.coordinates.length; i++) {
        const prev = path.coordinates[i - 1];
        const curr = path.coordinates[i];
        distanceMeters += haversineDistance(prev[0], prev[1], curr[0], curr[1]);
      }
    }

    return {
      id: idx + 1,
      date: path.startTimestamp ? new Date(path.startTimestamp).toISOString().split('T')[0] : 'Unknown',
      startTime: path.startTimestamp || null,
      endTime: path.endTimestamp || null,
      activityType: path.activityType,
      distanceMeters,
      distance: convert(distanceMeters),
      duration: path.duration || null,
    };
  });

  // Calculate summaries
  const totalDistanceMeters = trips.reduce((sum, t) => sum + t.distanceMeters, 0);

  // Daily summary
  const dailySummary = {};
  trips.forEach(trip => {
    if (!dailySummary[trip.date]) {
      dailySummary[trip.date] = { distance: 0, tripCount: 0 };
    }
    dailySummary[trip.date].distance += trip.distance;
    dailySummary[trip.date].tripCount++;
  });

  // Monthly summary
  const monthlySummary = {};
  trips.forEach(trip => {
    const monthKey = trip.date.substring(0, 7); // YYYY-MM
    if (!monthlySummary[monthKey]) {
      monthlySummary[monthKey] = { distance: 0, tripCount: 0 };
    }
    monthlySummary[monthKey].distance += trip.distance;
    monthlySummary[monthKey].tripCount++;
  });

  return {
    trips,
    totalDistance: convert(totalDistanceMeters),
    totalDistanceMeters,
    totalTrips: trips.length,
    unit,
    dailySummary,
    monthlySummary,
  };
}

/**
 * Generate CSV for mileage log
 * @param {Object} mileageLog - Output from generateMileageLog
 * @returns {string} CSV content
 */
export function mileageLogToCSV(mileageLog) {
  const { trips, unit } = mileageLog;
  const header = `Trip #,Date,Start Time,End Time,Activity Type,Distance (${unit}),Duration`;
  const rows = trips.map(trip =>
    [
      trip.id,
      trip.date,
      trip.startTime || '',
      trip.endTime || '',
      trip.activityType,
      trip.distance.toFixed(2),
      trip.duration || '',
    ].map(cell => {
      const str = String(cell);
      if (str.includes(',') || str.includes('"')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    }).join(',')
  );

  const totalRow = `\nTotal,,,,,"${mileageLog.totalDistance.toFixed(2)}",${mileageLog.totalTrips} trips`;

  return header + '\n' + rows.join('\n') + totalRow;
}
