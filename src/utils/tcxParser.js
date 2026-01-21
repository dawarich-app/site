/**
 * Parse TCX (Training Center XML) format to internal format
 * TCX is used by Garmin, Wahoo, and other fitness devices
 * @param {string} tcxText - TCX file content as string
 * @returns {Array} - Parsed points
 */
export function parseTCX(tcxText) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(tcxText, 'text/xml');

  // Check for parsing errors
  const parseError = xmlDoc.querySelector('parsererror');
  if (parseError) {
    throw new Error('Invalid TCX file: XML parsing failed');
  }

  const points = [];

  // Parse all Trackpoints
  const trackpoints = xmlDoc.querySelectorAll('Trackpoint');
  trackpoints.forEach(tp => {
    const position = tp.querySelector('Position');
    if (!position) return; // Skip trackpoints without position data

    const latEl = position.querySelector('LatitudeDegrees');
    const lonEl = position.querySelector('LongitudeDegrees');
    
    if (!latEl || !lonEl) return;

    const lat = parseFloat(latEl.textContent);
    const lon = parseFloat(lonEl.textContent);

    if (isNaN(lat) || isNaN(lon)) return;

    const timeEl = tp.querySelector('Time');
    const altitudeEl = tp.querySelector('AltitudeMeters');
    const heartRateEl = tp.querySelector('HeartRateBpm Value');
    const cadenceEl = tp.querySelector('Cadence');
    const speedEl = tp.querySelector('Extensions > TPX > Speed') || 
                    tp.querySelector('Extensions > ns3\\:TPX > ns3\\:Speed') ||
                    tp.querySelector('[localName="Speed"]');
    const powerEl = tp.querySelector('Extensions > TPX > Watts') ||
                    tp.querySelector('Extensions > ns3\\:TPX > ns3\\:Watts') ||
                    tp.querySelector('[localName="Watts"]');
    const distanceEl = tp.querySelector('DistanceMeters');

    points.push({
      type: 'trackpoint',
      lat,
      lon,
      elevation: altitudeEl ? parseFloat(altitudeEl.textContent) : undefined,
      time: timeEl ? timeEl.textContent : undefined,
      heartRate: heartRateEl ? parseInt(heartRateEl.textContent) : undefined,
      cadence: cadenceEl ? parseInt(cadenceEl.textContent) : undefined,
      speed: speedEl ? parseFloat(speedEl.textContent) : undefined,
      power: powerEl ? parseInt(powerEl.textContent) : undefined,
      distance: distanceEl ? parseFloat(distanceEl.textContent) : undefined,
    });
  });

  // Parse Lap start positions as waypoints
  const laps = xmlDoc.querySelectorAll('Lap');
  laps.forEach((lap, index) => {
    const startTime = lap.getAttribute('StartTime');
    
    // Try to get the first trackpoint of this lap for position
    const firstTrackpoint = lap.querySelector('Trackpoint Position');
    if (firstTrackpoint) {
      const latEl = firstTrackpoint.parentElement.querySelector('LatitudeDegrees');
      const lonEl = firstTrackpoint.parentElement.querySelector('LongitudeDegrees');
      
      if (latEl && lonEl) {
        const lat = parseFloat(latEl.textContent);
        const lon = parseFloat(lonEl.textContent);
        
        if (!isNaN(lat) && !isNaN(lon)) {
          points.push({
            type: 'waypoint',
            lat,
            lon,
            name: `Lap ${index + 1}`,
            time: startTime || undefined,
          });
        }
      }
    }
  });

  return points;
}

/**
 * Get activity metadata from TCX file
 * @param {string} tcxText - TCX file content as string
 * @returns {Object} - Activity metadata
 */
export function getTCXMetadata(tcxText) {
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(tcxText, 'text/xml');

  const activity = xmlDoc.querySelector('Activity');
  const lap = xmlDoc.querySelector('Lap');

  const metadata = {
    name: 'TCX Activity',
    description: '',
    sport: activity ? activity.getAttribute('Sport') : undefined,
    startTime: lap ? lap.getAttribute('StartTime') : undefined,
    totalTime: undefined,
    totalDistance: undefined,
    totalCalories: undefined,
    avgHeartRate: undefined,
    maxHeartRate: undefined,
    avgSpeed: undefined,
    maxSpeed: undefined,
    avgCadence: undefined,
    deviceName: undefined,
  };

  // Aggregate data from all laps
  const laps = xmlDoc.querySelectorAll('Lap');
  let totalTime = 0;
  let totalDistance = 0;
  let totalCalories = 0;
  let avgHRSum = 0;
  let avgHRCount = 0;
  let maxHR = 0;

  laps.forEach(lap => {
    const totalTimeEl = lap.querySelector('TotalTimeSeconds');
    const distanceEl = lap.querySelector('DistanceMeters');
    const caloriesEl = lap.querySelector('Calories');
    const avgHREl = lap.querySelector('AverageHeartRateBpm Value');
    const maxHREl = lap.querySelector('MaximumHeartRateBpm Value');

    if (totalTimeEl) totalTime += parseFloat(totalTimeEl.textContent);
    if (distanceEl) totalDistance += parseFloat(distanceEl.textContent);
    if (caloriesEl) totalCalories += parseInt(caloriesEl.textContent);
    if (avgHREl) {
      avgHRSum += parseInt(avgHREl.textContent);
      avgHRCount++;
    }
    if (maxHREl) {
      const hr = parseInt(maxHREl.textContent);
      if (hr > maxHR) maxHR = hr;
    }
  });

  metadata.totalTime = totalTime || undefined;
  metadata.totalDistance = totalDistance || undefined;
  metadata.totalCalories = totalCalories || undefined;
  metadata.avgHeartRate = avgHRCount > 0 ? Math.round(avgHRSum / avgHRCount) : undefined;
  metadata.maxHeartRate = maxHR > 0 ? maxHR : undefined;

  // Get device info
  const creator = xmlDoc.querySelector('Creator Name');
  if (creator) {
    metadata.deviceName = creator.textContent;
  }

  // Build description from metadata
  const parts = [];
  if (metadata.sport) parts.push(`Sport: ${metadata.sport}`);
  if (metadata.totalDistance) parts.push(`Distance: ${(metadata.totalDistance / 1000).toFixed(2)} km`);
  if (metadata.avgHeartRate) parts.push(`Avg HR: ${metadata.avgHeartRate} bpm`);
  if (metadata.deviceName) parts.push(`Device: ${metadata.deviceName}`);
  metadata.description = parts.join(' | ');

  return metadata;
}
