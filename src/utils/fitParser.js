import FitParser from 'fit-file-parser';

/**
 * Parse FIT format to internal format
 * @param {ArrayBuffer} buffer - FIT file as ArrayBuffer
 * @returns {Promise<Array>} - Parsed points
 */
export function parseFIT(buffer) {
  return new Promise((resolve, reject) => {
    const fitParser = new FitParser({
      force: true,
      speedUnit: 'km/h',
      lengthUnit: 'km',
      temperatureUnit: 'celsius',
      elapsedRecordField: true,
      mode: 'cascade',
    });

    fitParser.parse(buffer, (error, data) => {
      if (error) {
        reject(error);
        return;
      }

      const points = [];

      // Extract records (main GPS data)
      if (data.records && data.records.length > 0) {
        data.records.forEach(record => {
          if (record.position_lat !== undefined && record.position_long !== undefined) {
            points.push({
              type: 'trackpoint',
              lat: record.position_lat,
              lon: record.position_long,
              elevation: record.altitude,
              time: record.timestamp ? new Date(record.timestamp).toISOString() : undefined,
              heartRate: record.heart_rate,
              cadence: record.cadence,
              power: record.power,
              speed: record.speed,
              temperature: record.temperature,
            });
          }
        });
      }

      // Extract laps as waypoints (optional markers)
      if (data.laps && data.laps.length > 0) {
        data.laps.forEach((lap, index) => {
          if (lap.start_position_lat !== undefined && lap.start_position_long !== undefined) {
            points.push({
              type: 'waypoint',
              lat: lap.start_position_lat,
              lon: lap.start_position_long,
              name: `Lap ${index + 1}`,
              time: lap.start_time ? new Date(lap.start_time).toISOString() : undefined,
            });
          }
        });
      }

      resolve(points);
    });
  });
}

/**
 * Get activity metadata from FIT file
 * @param {ArrayBuffer} buffer - FIT file as ArrayBuffer
 * @returns {Promise<Object>} - Activity metadata
 */
export function getFITMetadata(buffer) {
  return new Promise((resolve, reject) => {
    const fitParser = new FitParser({
      force: true,
      mode: 'cascade',
    });

    fitParser.parse(buffer, (error, data) => {
      if (error) {
        reject(error);
        return;
      }

      const session = data.sessions?.[0];
      
      const metadata = {
        name: 'FIT Activity',
        description: '',
        sport: data.activity?.sport || session?.sport,
        subSport: session?.sub_sport,
        startTime: data.activity?.timestamp || session?.start_time,
        totalDistance: session?.total_distance,
        totalTime: session?.total_elapsed_time,
        avgHeartRate: session?.avg_heart_rate,
        maxHeartRate: session?.max_heart_rate,
        avgSpeed: session?.avg_speed,
        maxSpeed: session?.max_speed,
        totalAscent: session?.total_ascent,
        totalDescent: session?.total_descent,
        avgCadence: session?.avg_cadence,
        avgPower: session?.avg_power,
        deviceManufacturer: data.file_id?.manufacturer,
        deviceProduct: data.file_id?.product,
      };

      // Build description from metadata
      const parts = [];
      if (metadata.sport) {
        const sportName = metadata.subSport && metadata.subSport !== 'generic' 
          ? `${metadata.sport} (${metadata.subSport})` 
          : metadata.sport;
        parts.push(`Sport: ${sportName}`);
      }
      if (metadata.totalDistance) {
        parts.push(`Distance: ${(metadata.totalDistance / 1000).toFixed(2)} km`);
      }
      if (metadata.totalAscent) {
        parts.push(`Elevation Gain: ${metadata.totalAscent}m`);
      }
      if (metadata.avgHeartRate) {
        parts.push(`Avg HR: ${metadata.avgHeartRate} bpm`);
      }
      if (metadata.deviceManufacturer) {
        parts.push(`Device: ${metadata.deviceManufacturer}`);
      }
      metadata.description = parts.join(' | ');

      resolve(metadata);
    });
  });
}
