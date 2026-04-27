const GOOGLE_ACTIVITY_TO_MODE = {
  WALKING: 'walking',
  RUNNING: 'running',
  CYCLING: 'cycling',
  IN_PASSENGER_VEHICLE: 'driving',
  DRIVING: 'driving',
  IN_BUS: 'bus',
  IN_TRAIN: 'train',
  IN_SUBWAY: 'train',
  FLYING: 'flying',
  SAILING: 'boat',
  MOTORCYCLING: 'motorcycle',
};

export function mapModeFromGoogleActivity(activityType) {
  if (!activityType) return 'unknown';
  return GOOGLE_ACTIVITY_TO_MODE[activityType] || 'unknown';
}

export function heatBucketForDay(trackedSeconds, busiestSeconds) {
  const s = Number(trackedSeconds) || 0;
  const max = Number(busiestSeconds) || 0;
  if (s <= 0 || max <= 0) return 0;
  if (s >= max) return 5;
  const fraction = s / max;
  return Math.max(1, Math.min(5, Math.ceil(fraction * 5)));
}

function isoToLocalDateKey(isoString) {
  if (!isoString) return null;
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return null;
  // YYYY-MM-DD in local timezone
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function visitDurationMinutes(point) {
  if (!point.arrived || !point.departed) return 0;
  return Math.round((new Date(point.departed) - new Date(point.arrived)) / 60000);
}

function pathDurationSeconds(path) {
  if (!path.startTimestamp || !path.endTimestamp) return 0;
  return Math.round((new Date(path.endTimestamp) - new Date(path.startTimestamp)) / 1000);
}

function buildVisitEntry(point) {
  const tokens = [point.name, point.address].filter(Boolean).join(' ').toLowerCase();
  return {
    type: 'visit',
    visitId: point.id,
    name: point.name || 'Unnamed',
    startedAt: point.arrived || point.timestamp,
    endedAt: point.departed || point.timestamp,
    duration: visitDurationMinutes(point),
    pointCount: 1,
    place: { name: point.name || null, lat: point.lat, lng: point.lng, city: null, country: null },
    area: null,
    tags: [],
    status: 'confirmed',
    searchTokens: tokens,
  };
}

function buildJourneyEntry(path) {
  const distanceM = Number(path.distance) || 0;
  const distanceKm = distanceM / 1000;
  const durationS = pathDurationSeconds(path);
  const avgSpeed = durationS > 0 ? Number(((distanceKm / (durationS / 3600))).toFixed(1)) : 0;
  return {
    type: 'journey',
    trackId: path.id,
    startedAt: path.startTimestamp,
    endedAt: path.endTimestamp,
    duration: durationS,
    distance: Number(distanceKm.toFixed(1)),
    distanceUnit: 'km',
    dominantMode: mapModeFromGoogleActivity(path.activityType),
    avgSpeed,
    speedUnit: 'km/h',
    coordinates: path.coordinates || [],
    pointTimes: null,
  };
}

function expandBounds(bounds, lat, lng) {
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return bounds;
  if (!bounds) return { swLat: lat, swLng: lng, neLat: lat, neLng: lng };
  return {
    swLat: Math.min(bounds.swLat, lat),
    swLng: Math.min(bounds.swLng, lng),
    neLat: Math.max(bounds.neLat, lat),
    neLng: Math.max(bounds.neLng, lng),
  };
}

export function buildDayIndex(points, paths) {
  const days = new Map();
  const ensureDay = (key) => {
    if (!days.has(key)) {
      days.set(key, {
        date: key,
        summary: {
          totalDistance: 0,
          distanceUnit: 'km',
          placesVisited: 0,
          timeMovingMinutes: 0,
          timeStationaryMinutes: 0,
          trackedSeconds: 0,
        },
        bounds: null,
        entries: [],
        _placeNames: new Set(),
        _firstTs: null,
        _lastTs: null,
      });
    }
    return days.get(key);
  };

  for (const p of points) {
    if (p.type !== 'place_visit') continue;
    const key = isoToLocalDateKey(p.arrived || p.timestamp);
    if (!key) continue;
    const day = ensureDay(key);
    const entry = buildVisitEntry(p);
    day.entries.push(entry);
    day.summary.timeStationaryMinutes += entry.duration;
    if (entry.place.name) day._placeNames.add(entry.place.name);
    day.bounds = expandBounds(day.bounds, p.lat, p.lng);
    const t = new Date(entry.startedAt).getTime();
    if (Number.isFinite(t)) {
      if (day._firstTs === null || t < day._firstTs) day._firstTs = t;
      const tEnd = new Date(entry.endedAt).getTime();
      if (Number.isFinite(tEnd) && (day._lastTs === null || tEnd > day._lastTs)) day._lastTs = tEnd;
    }
  }

  for (const path of paths) {
    const key = isoToLocalDateKey(path.startTimestamp);
    if (!key) continue;
    const day = ensureDay(key);
    const entry = buildJourneyEntry(path);
    day.entries.push(entry);
    day.summary.totalDistance = Number((day.summary.totalDistance + entry.distance).toFixed(1));
    day.summary.timeMovingMinutes += Math.round(entry.duration / 60);
    for (const [lat, lng] of entry.coordinates) {
      day.bounds = expandBounds(day.bounds, lat, lng);
    }
    const t = new Date(entry.startedAt).getTime();
    if (Number.isFinite(t)) {
      if (day._firstTs === null || t < day._firstTs) day._firstTs = t;
      const tEnd = new Date(entry.endedAt).getTime();
      if (Number.isFinite(tEnd) && (day._lastTs === null || tEnd > day._lastTs)) day._lastTs = tEnd;
    }
  }

  for (const day of days.values()) {
    day.entries.sort((a, b) => new Date(a.startedAt) - new Date(b.startedAt));
    day.summary.placesVisited = day._placeNames.size;
    day.summary.trackedSeconds = day._firstTs && day._lastTs ? Math.round((day._lastTs - day._firstTs) / 1000) : 0;
    delete day._placeNames;
    delete day._firstTs;
    delete day._lastTs;
  }

  return days;
}

export function buildYearStats(dayIndex) {
  const years = new Map();
  for (const day of dayIndex.values()) {
    const year = Number(day.date.slice(0, 4));
    if (!Number.isFinite(year)) continue;
    if (!years.has(year)) {
      years.set(year, { months: new Set(), totalDays: 0, busiestSeconds: 0 });
    }
    const y = years.get(year);
    y.months.add(day.date.slice(0, 7));
    y.totalDays += 1;
    if (day.summary.trackedSeconds > y.busiestSeconds) {
      y.busiestSeconds = day.summary.trackedSeconds;
    }
  }
  return years;
}

function pad2(n) { return String(n).padStart(2, '0'); }

function isoDate(d) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

export function buildMonthGrid(dayIndex, yearStats, year, monthKey) {
  const [yStr, mStr] = monthKey.split('-');
  const monthIdx = Number(mStr) - 1;
  const monthStart = new Date(Number(yStr), monthIdx, 1);
  // Day-of-week with Monday as 0
  const offset = (monthStart.getDay() + 6) % 7;
  const gridStart = new Date(Number(yStr), monthIdx, 1 - offset);

  const busiestSeconds = yearStats.get(year)?.busiestSeconds ?? 0;
  const weeks = [];
  for (let w = 0; w < 6; w += 1) {
    const week = [];
    for (let d = 0; d < 7; d += 1) {
      const date = new Date(gridStart);
      date.setDate(gridStart.getDate() + w * 7 + d);
      const iso = isoDate(date);
      const inMonth = date.getMonth() === monthIdx && date.getFullYear() === Number(yStr);
      const day = dayIndex.get(iso);
      const trackedSeconds = day?.summary?.trackedSeconds ?? 0;
      week.push({
        date: iso,
        inMonth,
        heatBucket: heatBucketForDay(trackedSeconds, busiestSeconds),
        trackedSeconds,
        suggestedCount: 0,
        disabled: !inMonth || !day,
      });
    }
    weeks.push(week);
  }
  return { year, month: monthKey, weeks };
}
