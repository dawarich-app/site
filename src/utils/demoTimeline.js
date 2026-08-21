// Demo data for the Timeline Visualizer: a static copy of the dawarich app's
// own demo dataset (lib/assets/demo_derivatives.json.gz — 30 days of Berlin
// daily life plus a Prague weekend), the same days "Load demo data" seeds into
// a real account, encoded in src/data/timelineDemo.json.
//
// Payload shape: places are plain records; visits are
// [placeIndex, startOffset, duration, pointCount, statusIndex]; tracks are
// [startOffset, duration, distanceMeters, modeIndex, baseLatE5, baseLonE5,
// deltas] where deltas are alternating lat/lon steps at 1e5 precision.
//
// Offsets are seconds relative to the seeder's anchor. We re-anchor them to the
// visitor's local midnight, matching
// DemoData::Importer#user_local_beginning_of_day, so the demo always lands on
// the last 30 days.
import { buildDayIndex, buildYearStats } from './timelineDays';
import PAYLOAD from '@site/src/data/timelineDemo.json';

// buildDayIndex speaks Google Takeout activity types; these are the keys it
// maps back to the visualizer's own mode names.
const GOOGLE_ACTIVITY_FOR_MODE = {
  walking: 'WALKING',
  cycling: 'CYCLING',
  driving: 'IN_PASSENGER_VEHICLE',
};

export function localMidnight(now = new Date()) {
  return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
}

function decodeCoordinates(baseLat, baseLon, deltas) {
  const coordinates = [[baseLat / 1e5, baseLon / 1e5]];
  let lat = baseLat;
  let lon = baseLon;
  for (let i = 0; i < deltas.length; i += 2) {
    lat += deltas[i];
    lon += deltas[i + 1];
    coordinates.push([lat / 1e5, lon / 1e5]);
  }
  return coordinates;
}

export function decodeDemoTimeline(payload, anchorMs = localMidnight()) {
  const { places, modes, statuses } = payload;
  const at = (offsetSeconds) => new Date(anchorMs + offsetSeconds * 1000).toISOString();

  const extrasByVisitId = new Map();
  const points = payload.visits.map(([placeIdx, startOffset, duration, pointCount, statusIdx], i) => {
    const place = places[placeIdx];
    const id = `demo-v${i}`;
    extrasByVisitId.set(id, {
      pointCount,
      status: statuses[statusIdx],
      tags: place.tags,
      city: place.city,
      country: place.country,
    });
    return {
      id,
      type: 'place_visit',
      lat: place.lat,
      lng: place.lon,
      name: place.name,
      address: [place.city, place.country].filter(Boolean).join(', '),
      arrived: at(startOffset),
      departed: at(startOffset + duration),
      timestamp: at(startOffset),
    };
  });

  const paths = payload.tracks.map(
    ([startOffset, duration, distanceMeters, modeIdx, baseLat, baseLon, deltas], i) => ({
      id: `demo-t${i}`,
      startTimestamp: at(startOffset),
      endTimestamp: at(startOffset + duration),
      distance: distanceMeters,
      activityType: GOOGLE_ACTIVITY_FOR_MODE[modes[modeIdx]] || 'IN_PASSENGER_VEHICLE',
      coordinates: decodeCoordinates(baseLat, baseLon, deltas),
    }),
  );

  const dayIndex = buildDayIndex(points, paths);

  for (const day of dayIndex.values()) {
    day.isDemo = true;
    for (const entry of day.entries) {
      if (entry.type !== 'visit') continue;
      const extras = extrasByVisitId.get(entry.visitId);
      if (!extras) continue;
      entry.pointCount = extras.pointCount;
      entry.status = extras.status;
      entry.tags = extras.tags;
      entry.place.city = extras.city;
      entry.place.country = extras.country;
    }
  }

  const dates = [...dayIndex.keys()].sort();

  return {
    dayIndex,
    yearStats: buildYearStats(dayIndex),
    latestDate: dates[dates.length - 1] || null,
  };
}

// The anchor is the visitor's local midnight, so this has to run on the client —
// decoding during render would bake the build machine's date into the SSR HTML.
export function loadDemoTimeline(anchorMs = localMidnight()) {
  return decodeDemoTimeline(PAYLOAD, anchorMs);
}
