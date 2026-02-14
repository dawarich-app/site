/**
 * Timeline data deduplication and merging utilities.
 * Used by the Data Merger tool.
 */

import { haversineDistance } from './geo';

/**
 * Deduplicate points based on proximity and time thresholds
 * @param {Array} points - Array of timeline parser points
 * @param {Object} options - Deduplication options
 * @param {number} options.distanceThreshold - Max distance in meters to consider duplicate (default 50)
 * @param {number} options.timeThreshold - Max time diff in seconds to consider duplicate (default 60)
 * @returns {Object} { uniquePoints, duplicatesRemoved }
 */
export function deduplicatePoints(points, options = {}) {
  const { distanceThreshold = 50, timeThreshold = 60 } = options;
  const timeThresholdMs = timeThreshold * 1000;

  if (points.length === 0) return { uniquePoints: [], duplicatesRemoved: 0 };

  // Sort by timestamp first
  const sorted = [...points].sort((a, b) => {
    if (!a.timestamp && !b.timestamp) return 0;
    if (!a.timestamp) return 1;
    if (!b.timestamp) return -1;
    return new Date(a.timestamp) - new Date(b.timestamp);
  });

  const uniquePoints = [sorted[0]];
  let duplicatesRemoved = 0;

  for (let i = 1; i < sorted.length; i++) {
    const curr = sorted[i];
    const prev = uniquePoints[uniquePoints.length - 1];

    // Check time proximity
    let timeDiff = Infinity;
    if (curr.timestamp && prev.timestamp) {
      timeDiff = Math.abs(new Date(curr.timestamp) - new Date(prev.timestamp));
    }

    // Check spatial proximity
    let distance = Infinity;
    if (curr.lat != null && curr.lng != null && prev.lat != null && prev.lng != null) {
      distance = haversineDistance(curr.lat, curr.lng, prev.lat, prev.lng);
    }

    // If both within thresholds, it's a duplicate
    if (distance <= distanceThreshold && timeDiff <= timeThresholdMs) {
      duplicatesRemoved++;
      // Keep the one with more metadata
      const currFields = Object.values(curr).filter(v => v != null && v !== '').length;
      const prevFields = Object.values(prev).filter(v => v != null && v !== '').length;
      if (currFields > prevFields) {
        uniquePoints[uniquePoints.length - 1] = curr;
      }
    } else {
      uniquePoints.push(curr);
    }
  }

  return { uniquePoints, duplicatesRemoved };
}

/**
 * Calculate overlap report between two parsed files
 * @param {Object} fileA - Parsed file { points, paths, metadata }
 * @param {Object} fileB - Parsed file { points, paths, metadata }
 * @returns {Object} Overlap report
 */
export function calculateOverlapReport(fileA, fileB) {
  const getDateRange = (points) => {
    const timestamps = points
      .filter(p => p.timestamp)
      .map(p => new Date(p.timestamp).getTime())
      .filter(t => !isNaN(t));

    if (timestamps.length === 0) return null;
    return {
      start: new Date(Math.min(...timestamps)),
      end: new Date(Math.max(...timestamps)),
    };
  };

  const rangeA = getDateRange(fileA.points);
  const rangeB = getDateRange(fileB.points);

  let overlapDays = 0;
  let overlapStart = null;
  let overlapEnd = null;

  if (rangeA && rangeB) {
    const oStart = Math.max(rangeA.start.getTime(), rangeB.start.getTime());
    const oEnd = Math.min(rangeA.end.getTime(), rangeB.end.getTime());

    if (oStart < oEnd) {
      overlapStart = new Date(oStart);
      overlapEnd = new Date(oEnd);
      overlapDays = Math.ceil((oEnd - oStart) / (1000 * 60 * 60 * 24));
    }
  }

  return {
    fileA: {
      pointCount: fileA.points.length,
      pathCount: fileA.paths.length,
      dateRange: rangeA,
      format: fileA.metadata?.format || 'unknown',
    },
    fileB: {
      pointCount: fileB.points.length,
      pathCount: fileB.paths.length,
      dateRange: rangeB,
      format: fileB.metadata?.format || 'unknown',
    },
    overlap: {
      start: overlapStart,
      end: overlapEnd,
      days: overlapDays,
      hasOverlap: overlapDays > 0,
    },
  };
}

/**
 * Merge multiple parsed timeline files with deduplication
 * @param {Array} parsedFiles - Array of { points, paths, metadata, filename }
 * @param {Object} options - Merge options
 * @param {number} options.distanceThreshold - Dedup distance threshold in meters
 * @param {number} options.timeThreshold - Dedup time threshold in seconds
 * @returns {Object} Merged result with stats
 */
export function mergeWithDedup(parsedFiles, options = {}) {
  const allPoints = [];
  const allPaths = [];
  const fileInfos = [];

  // Collect all points and paths
  parsedFiles.forEach((file, idx) => {
    const fileLabel = file.filename || `File ${idx + 1}`;
    fileInfos.push({
      name: fileLabel,
      pointCount: file.points.length,
      pathCount: file.paths.length,
      format: file.metadata?.format || 'unknown',
    });

    file.points.forEach(point => {
      allPoints.push({ ...point, sourceFile: fileLabel });
    });

    file.paths.forEach(path => {
      allPaths.push({ ...path, sourceFile: fileLabel });
    });
  });

  // Deduplicate points
  const { uniquePoints, duplicatesRemoved } = deduplicatePoints(allPoints, options);

  // Calculate pairwise overlap reports
  const overlapReports = [];
  for (let i = 0; i < parsedFiles.length; i++) {
    for (let j = i + 1; j < parsedFiles.length; j++) {
      overlapReports.push({
        fileA: parsedFiles[i].filename || `File ${i + 1}`,
        fileB: parsedFiles[j].filename || `File ${j + 1}`,
        ...calculateOverlapReport(parsedFiles[i], parsedFiles[j]),
      });
    }
  }

  return {
    points: uniquePoints,
    paths: allPaths,
    metadata: {
      totalInputPoints: allPoints.length,
      totalOutputPoints: uniquePoints.length,
      duplicatesRemoved,
      totalPaths: allPaths.length,
      fileCount: parsedFiles.length,
      fileInfos,
      overlapReports,
    },
  };
}
