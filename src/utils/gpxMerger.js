/**
 * Parse GPX file and extract structured data
 * @param {string} gpxText - GPX file content
 * @param {string} fileName - Original filename for reference
 * @returns {Object} - Parsed GPX data with tracks, waypoints, routes
 */
export function parseGPXDetailed(gpxText, fileName) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(gpxText, 'text/xml');

  // Check for parsing errors
  const parseError = xmlDoc.querySelector('parsererror');
  if (parseError) {
    throw new Error(`Invalid GPX file: ${fileName}`);
  }

  const result = {
    fileName,
    metadata: {},
    waypoints: [],
    tracks: [],
    routes: [],
  };

  // Parse metadata
  const metadata = xmlDoc.querySelector('metadata');
  if (metadata) {
    const name = metadata.querySelector('name');
    const desc = metadata.querySelector('desc');
    const time = metadata.querySelector('time');
    result.metadata = {
      name: name?.textContent || '',
      description: desc?.textContent || '',
      time: time?.textContent || '',
    };
  }

  // Parse waypoints
  const waypoints = xmlDoc.querySelectorAll('wpt');
  waypoints.forEach(wpt => {
    result.waypoints.push({
      lat: parseFloat(wpt.getAttribute('lat')),
      lon: parseFloat(wpt.getAttribute('lon')),
      name: wpt.querySelector('name')?.textContent || '',
      desc: wpt.querySelector('desc')?.textContent || '',
      ele: wpt.querySelector('ele')?.textContent || '',
      time: wpt.querySelector('time')?.textContent || '',
      sym: wpt.querySelector('sym')?.textContent || '',
      type: wpt.querySelector('type')?.textContent || '',
    });
  });

  // Parse tracks
  const tracks = xmlDoc.querySelectorAll('trk');
  tracks.forEach(trk => {
    const track = {
      name: trk.querySelector('name')?.textContent || '',
      desc: trk.querySelector('desc')?.textContent || '',
      type: trk.querySelector('type')?.textContent || '',
      segments: [],
    };

    const segments = trk.querySelectorAll('trkseg');
    segments.forEach(seg => {
      const points = [];
      const trkpts = seg.querySelectorAll('trkpt');
      trkpts.forEach(pt => {
        points.push({
          lat: parseFloat(pt.getAttribute('lat')),
          lon: parseFloat(pt.getAttribute('lon')),
          ele: pt.querySelector('ele')?.textContent || '',
          time: pt.querySelector('time')?.textContent || '',
        });
      });
      track.segments.push(points);
    });

    result.tracks.push(track);
  });

  // Parse routes
  const routes = xmlDoc.querySelectorAll('rte');
  routes.forEach(rte => {
    const route = {
      name: rte.querySelector('name')?.textContent || '',
      desc: rte.querySelector('desc')?.textContent || '',
      points: [],
    };

    const rtepts = rte.querySelectorAll('rtept');
    rtepts.forEach(pt => {
      route.points.push({
        lat: parseFloat(pt.getAttribute('lat')),
        lon: parseFloat(pt.getAttribute('lon')),
        name: pt.querySelector('name')?.textContent || '',
        ele: pt.querySelector('ele')?.textContent || '',
      });
    });

    result.routes.push(route);
  });

  return result;
}

/**
 * Merge multiple parsed GPX files into one
 * @param {Array} gpxFiles - Array of parsed GPX data objects
 * @param {Object} options - Merge options
 * @returns {string} - Merged GPX as string
 */
export function mergeGPXFiles(gpxFiles, options = {}) {
  const {
    mergeTracksIntoOne = false,
    sortByTime = false,
    outputName = 'Merged Tracks',
  } = options;

  // Collect all data
  let allWaypoints = [];
  let allTracks = [];
  let allRoutes = [];
  let allTrackPoints = []; // For merge into single track

  gpxFiles.forEach(gpx => {
    allWaypoints.push(...gpx.waypoints);
    allRoutes.push(...gpx.routes);

    if (mergeTracksIntoOne) {
      // Collect all track points for single merged track
      gpx.tracks.forEach(track => {
        track.segments.forEach(segment => {
          allTrackPoints.push(...segment);
        });
      });
    } else {
      // Keep tracks separate
      allTracks.push(...gpx.tracks);
    }
  });

  // Sort by time if requested
  if (sortByTime) {
    allTrackPoints.sort((a, b) => {
      if (!a.time || !b.time) return 0;
      return new Date(a.time) - new Date(b.time);
    });
  }

  // Build GPX output
  let gpx = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Dawarich GPX Merger" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>${escapeXml(outputName)}</name>
    <desc>Merged from ${gpxFiles.length} files: ${gpxFiles.map(f => f.fileName).join(', ')}</desc>
    <time>${new Date().toISOString()}</time>
  </metadata>`;

  // Add waypoints
  allWaypoints.forEach(wpt => {
    gpx += `
  <wpt lat="${wpt.lat}" lon="${wpt.lon}">`;
    if (wpt.name) gpx += `
    <name>${escapeXml(wpt.name)}</name>`;
    if (wpt.desc) gpx += `
    <desc>${escapeXml(wpt.desc)}</desc>`;
    if (wpt.ele) gpx += `
    <ele>${wpt.ele}</ele>`;
    if (wpt.time) gpx += `
    <time>${wpt.time}</time>`;
    if (wpt.sym) gpx += `
    <sym>${escapeXml(wpt.sym)}</sym>`;
    if (wpt.type) gpx += `
    <type>${escapeXml(wpt.type)}</type>`;
    gpx += `
  </wpt>`;
  });

  // Add tracks
  if (mergeTracksIntoOne && allTrackPoints.length > 0) {
    // Single merged track
    gpx += `
  <trk>
    <name>${escapeXml(outputName)}</name>
    <trkseg>`;
    allTrackPoints.forEach(pt => {
      gpx += `
      <trkpt lat="${pt.lat}" lon="${pt.lon}">`;
      if (pt.ele) gpx += `
        <ele>${pt.ele}</ele>`;
      if (pt.time) gpx += `
        <time>${pt.time}</time>`;
      gpx += `
      </trkpt>`;
    });
    gpx += `
    </trkseg>
  </trk>`;
  } else {
    // Keep tracks separate
    allTracks.forEach(track => {
      gpx += `
  <trk>`;
      if (track.name) gpx += `
    <name>${escapeXml(track.name)}</name>`;
      if (track.desc) gpx += `
    <desc>${escapeXml(track.desc)}</desc>`;
      if (track.type) gpx += `
    <type>${escapeXml(track.type)}</type>`;

      track.segments.forEach(segment => {
        gpx += `
    <trkseg>`;
        segment.forEach(pt => {
          gpx += `
      <trkpt lat="${pt.lat}" lon="${pt.lon}">`;
          if (pt.ele) gpx += `
        <ele>${pt.ele}</ele>`;
          if (pt.time) gpx += `
        <time>${pt.time}</time>`;
          gpx += `
      </trkpt>`;
        });
        gpx += `
    </trkseg>`;
      });
      gpx += `
  </trk>`;
    });
  }

  // Add routes
  allRoutes.forEach(route => {
    gpx += `
  <rte>`;
    if (route.name) gpx += `
    <name>${escapeXml(route.name)}</name>`;
    if (route.desc) gpx += `
    <desc>${escapeXml(route.desc)}</desc>`;

    route.points.forEach(pt => {
      gpx += `
    <rtept lat="${pt.lat}" lon="${pt.lon}">`;
      if (pt.name) gpx += `
      <name>${escapeXml(pt.name)}</name>`;
      if (pt.ele) gpx += `
      <ele>${pt.ele}</ele>`;
      gpx += `
    </rtept>`;
    });
    gpx += `
  </rte>`;
  });

  gpx += `
</gpx>`;

  return gpx;
}

/**
 * Calculate statistics for parsed GPX files
 * @param {Array} gpxFiles - Array of parsed GPX data objects
 * @returns {Object} - Statistics
 */
export function calculateMergeStats(gpxFiles) {
  let totalTracks = 0;
  let totalSegments = 0;
  let totalTrackPoints = 0;
  let totalWaypoints = 0;
  let totalRoutes = 0;
  let totalRoutePoints = 0;

  gpxFiles.forEach(gpx => {
    totalWaypoints += gpx.waypoints.length;
    totalRoutes += gpx.routes.length;
    gpx.routes.forEach(r => {
      totalRoutePoints += r.points.length;
    });
    totalTracks += gpx.tracks.length;
    gpx.tracks.forEach(track => {
      totalSegments += track.segments.length;
      track.segments.forEach(seg => {
        totalTrackPoints += seg.length;
      });
    });
  });

  return {
    files: gpxFiles.length,
    tracks: totalTracks,
    segments: totalSegments,
    trackPoints: totalTrackPoints,
    waypoints: totalWaypoints,
    routes: totalRoutes,
    routePoints: totalRoutePoints,
  };
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
