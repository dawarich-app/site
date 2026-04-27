import React, { useEffect, useRef, useState } from 'react';
import styles from './TimelineMapV2.module.css';

const STYLE_URLS = {
  light: '/maps_maplibre/styles/light.json',
  dark: '/maps_maplibre/styles/dark.json',
};

const MODE_LINE_COLOR = {
  walking: '#10b981',
  running: '#10b981',
  cycling: '#06b6d4',
  driving: '#3b82f6',
  motorcycle: '#3b82f6',
  bus: '#f59e0b',
  train: '#8b5cf6',
  flying: '#6366f1',
  boat: '#14b8a6',
  unknown: '#6b7280',
};

function getCurrentTheme() {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

function detectWebGL() {
  if (typeof window === 'undefined') return true;
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

function emptyFC() {
  return { type: 'FeatureCollection', features: [] };
}

function visitsToGeoJSON(entries) {
  return {
    type: 'FeatureCollection',
    features: entries.map((e) => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [e.place.lng, e.place.lat] },
      properties: { visitId: e.visitId, name: e.name },
    })),
  };
}

function tracksToGeoJSON(entries) {
  return {
    type: 'FeatureCollection',
    features: entries.map((e) => ({
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: e.coordinates.map(([lat, lng]) => [lng, lat]),
      },
      properties: {
        trackId: e.trackId,
        mode: e.dominantMode,
        color: MODE_LINE_COLOR[e.dominantMode] || MODE_LINE_COLOR.unknown,
      },
    })),
  };
}

function rawPointsToGeoJSON(rawPoints) {
  return {
    type: 'FeatureCollection',
    features: (rawPoints || []).map((p) => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [p.lng, p.lat] },
      properties: {},
    })),
  };
}

function addLayers(map) {
  // Sources
  map.addSource('tl-visits', { type: 'geojson', data: emptyFC() });
  map.addSource('tl-tracks', { type: 'geojson', data: emptyFC() });
  map.addSource('tl-track-hover', { type: 'geojson', data: emptyFC() });
  map.addSource('tl-replay-marker', { type: 'geojson', data: emptyFC() });
  map.addSource('tl-points-raw', { type: 'geojson', data: emptyFC() });

  // Track hover (under tracks)
  map.addLayer({
    id: 'tl-track-hover-line',
    type: 'line',
    source: 'tl-track-hover',
    paint: { 'line-color': '#facc15', 'line-width': 5, 'line-opacity': 1 },
  });

  // Tracks
  map.addLayer({
    id: 'tl-tracks-line',
    type: 'line',
    source: 'tl-tracks',
    paint: {
      'line-color': ['get', 'color'],
      'line-width': 4,
      'line-opacity': 0.85,
    },
  });

  // Raw points (under visits)
  map.addLayer({
    id: 'tl-points-raw-circle',
    type: 'circle',
    source: 'tl-points-raw',
    paint: {
      'circle-radius': 3,
      'circle-color': '#6b7280',
      'circle-opacity': 0.5,
    },
  });

  // Visit halo (under visits)
  map.addLayer({
    id: 'tl-visits-halo',
    type: 'circle',
    source: 'tl-visits',
    filter: ['==', ['get', 'visitId'], '__none__'],
    paint: {
      'circle-radius': 14,
      'circle-color': '#22c55e',
      'circle-opacity': 0.4,
    },
  });

  // Visit pin
  map.addLayer({
    id: 'tl-visits-circle',
    type: 'circle',
    source: 'tl-visits',
    paint: {
      'circle-radius': 6,
      'circle-color': '#22c55e',
      'circle-stroke-width': 2,
      'circle-stroke-color': '#ffffff',
    },
  });

  // Replay marker (top)
  map.addLayer({
    id: 'tl-replay-marker-circle',
    type: 'circle',
    source: 'tl-replay-marker',
    paint: {
      'circle-radius': 8,
      'circle-color': '#ef4444',
      'circle-stroke-width': 2,
      'circle-stroke-color': '#ffffff',
    },
  });
}

function updateDayData(map, day, rawPoints) {
  if (!map.getSource('tl-visits')) return;
  if (!day) {
    map.getSource('tl-visits').setData(emptyFC());
    map.getSource('tl-tracks').setData(emptyFC());
    map.getSource('tl-points-raw').setData(emptyFC());
    return;
  }
  const visits = day.entries.filter((e) => e.type === 'visit');
  const journeys = day.entries.filter((e) => e.type === 'journey');
  map.getSource('tl-visits').setData(visitsToGeoJSON(visits));
  map.getSource('tl-tracks').setData(tracksToGeoJSON(journeys));
  if (visits.length === 0 && journeys.length === 0 && rawPoints?.length) {
    map.getSource('tl-points-raw').setData(rawPointsToGeoJSON(rawPoints));
  } else {
    map.getSource('tl-points-raw').setData(emptyFC());
  }

  // Fit bounds
  if (day.bounds) {
    const { swLat, swLng, neLat, neLng } = day.bounds;
    map.fitBounds([[swLng, swLat], [neLng, neLat]], { padding: 60, duration: 600, maxZoom: 15 });
  }
}

export default function TimelineMapV2({
  day,
  rawPoints,
  selectedVisitId,
  hoveredEntry,
  replayState,
  isSample = false,
  onVisitClick,
  onTrackClick,
  onReplayChange,
}) {
  const containerRef = useRef(null);
  const mapNodeRef = useRef(null);
  const mapRef = useRef(null);
  const [hasWebGL] = useState(() => detectWebGL());
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [styleReady, setStyleReady] = useState(false);

  // Initialize map
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!hasWebGL) return;
    if (!mapNodeRef.current || mapRef.current) return;

    let cancelled = false;
    (async () => {
      const maplibregl = (await import('maplibre-gl')).default;
      await import('maplibre-gl/dist/maplibre-gl.css');
      if (cancelled) return;

      const map = new maplibregl.Map({
        container: mapNodeRef.current,
        style: STYLE_URLS[getCurrentTheme()],
        center: [13.40, 52.52],
        zoom: 11,
        attributionControl: { compact: true },
      });
      map.addControl(new maplibregl.NavigationControl(), 'top-right');
      mapRef.current = map;

      const onStyleLoad = () => {
        addLayers(map);
        setStyleReady(true);
      };
      map.on('load', onStyleLoad);

      // Click handlers
      map.on('click', 'tl-visits-circle', (e) => {
        const id = e.features?.[0]?.properties?.visitId;
        if (id && onVisitClick) onVisitClick(id);
      });
      map.on('click', 'tl-tracks-line', (e) => {
        const id = e.features?.[0]?.properties?.trackId;
        if (id && onTrackClick) onTrackClick(id);
      });
      ['tl-visits-circle', 'tl-tracks-line'].forEach((layer) => {
        map.on('mouseenter', layer, () => { map.getCanvas().style.cursor = 'pointer'; });
        map.on('mouseleave', layer, () => { map.getCanvas().style.cursor = ''; });
      });
    })();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasWebGL]);

  // Theme switching
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const observer = new MutationObserver(() => {
      const map = mapRef.current;
      if (!map) return;
      setStyleReady(false);
      map.setStyle(STYLE_URLS[getCurrentTheme()], { diff: false });
      map.once('style.load', () => {
        addLayers(map);
        setStyleReady(true);
      });
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);

  // Day data swap
  useEffect(() => {
    if (!styleReady) return;
    updateDayData(mapRef.current, day, rawPoints);
  }, [day, rawPoints, styleReady]);

  // Selected visit halo
  useEffect(() => {
    if (!styleReady || !mapRef.current) return;
    const map = mapRef.current;
    const filter = selectedVisitId
      ? ['==', ['get', 'visitId'], selectedVisitId]
      : ['==', ['get', 'visitId'], '__none__'];
    if (map.getLayer('tl-visits-halo')) map.setFilter('tl-visits-halo', filter);

    if (selectedVisitId && day) {
      const visit = day.entries.find((e) => e.type === 'visit' && e.visitId === selectedVisitId);
      if (visit) {
        map.flyTo({ center: [visit.place.lng, visit.place.lat], zoom: Math.max(map.getZoom(), 14), duration: 600 });
      }
    }
  }, [selectedVisitId, day, styleReady]);

  // Hover highlight
  useEffect(() => {
    if (!styleReady || !mapRef.current) return;
    const map = mapRef.current;
    const src = map.getSource('tl-track-hover');
    if (!src) return;
    if (!hoveredEntry || hoveredEntry.type !== 'journey' || !hoveredEntry.coordinates) {
      src.setData(emptyFC());
      return;
    }
    src.setData({
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: hoveredEntry.coordinates.map(([lat, lng]) => [lng, lat]),
        },
        properties: {},
      }],
    });
  }, [hoveredEntry, styleReady]);

  // Replay loop
  const replayRafRef = useRef(null);
  const replayLastTickRef = useRef(0);
  const replayStateRef = useRef(null);

  // Keep ref in sync with prop so the rAF loop reads the latest
  useEffect(() => {
    replayStateRef.current = replayState;
  }, [replayState]);

  useEffect(() => {
    if (!styleReady || !mapRef.current) return;
    const map = mapRef.current;
    const src = map.getSource('tl-replay-marker');
    if (!src) return;

    if (!replayState || !replayState.trackId || !day) {
      src.setData(emptyFC());
      cancelAnimationFrame(replayRafRef.current);
      replayRafRef.current = null;
      return;
    }
    const entry = day.entries.find((e) => e.type === 'journey' && e.trackId === replayState.trackId);
    if (!entry || !entry.coordinates?.length) {
      src.setData(emptyFC());
      return;
    }
    const idx = Math.min(replayState.frameIndex, entry.coordinates.length - 1);
    const [lat, lng] = entry.coordinates[idx];
    src.setData({
      type: 'FeatureCollection',
      features: [{
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [lng, lat] },
        properties: {},
      }],
    });

    // Animation loop — only when playing
    if (replayState.playing && idx < entry.coordinates.length - 1) {
      const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      if (reduced) {
        onReplayChange({ trackId: replayState.trackId, frameIndex: entry.coordinates.length - 1, playing: false });
        return;
      }
      const cadence = 50; // ms per frame; constant for v1
      const tick = (now) => {
        if (now - replayLastTickRef.current >= cadence) {
          const cur = replayStateRef.current;
          if (!cur || !cur.playing) return;
          const next = cur.frameIndex + 1;
          replayLastTickRef.current = now;
          if (next >= entry.coordinates.length) {
            onReplayChange({ ...cur, frameIndex: entry.coordinates.length - 1, playing: false });
            return;
          }
          onReplayChange({ ...cur, frameIndex: next });
        }
        replayRafRef.current = requestAnimationFrame(tick);
      };
      replayRafRef.current = requestAnimationFrame(tick);
    }

    return () => {
      cancelAnimationFrame(replayRafRef.current);
      replayRafRef.current = null;
    };
  }, [replayState, day, styleReady, onReplayChange]);

  // Fullscreen toggle
  const toggleFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    const fsElement = document.fullscreenElement || document.webkitFullscreenElement;
    if (!fsElement) {
      (el.requestFullscreen || el.webkitRequestFullscreen)?.call(el);
    } else {
      (document.exitFullscreen || document.webkitExitFullscreen)?.call(document);
    }
  };

  useEffect(() => {
    const handler = () => {
      const fsElement = document.fullscreenElement || document.webkitFullscreenElement;
      setIsFullscreen(fsElement === containerRef.current);
      setTimeout(() => mapRef.current?.resize(), 100);
    };
    document.addEventListener('fullscreenchange', handler);
    document.addEventListener('webkitfullscreenchange', handler);
    return () => {
      document.removeEventListener('fullscreenchange', handler);
      document.removeEventListener('webkitfullscreenchange', handler);
    };
  }, []);

  // F-key shortcut for fullscreen — only fires when the map container is hovered
  // and the user isn't typing in an input. Mirrors the legacy Leaflet wrapper.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'f' && e.key !== 'F') return;
      const t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return;
      if (!containerRef.current?.matches(':hover')) return;
      e.preventDefault();
      toggleFullscreen();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!hasWebGL) {
    return (
      <div className={styles.mapContainer}>
        <div className={styles.webglError} role="alert">
          <h3>Map unavailable</h3>
          <p>Your browser doesn't support WebGL, which is required for the map.</p>
          <p><a href="https://get.webgl.org" target="_blank" rel="noopener noreferrer">Learn more about WebGL</a></p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={styles.mapContainer}>
      <div ref={mapNodeRef} className={styles.map} />
      <button
        type="button"
        className={styles.fullscreenButton}
        onClick={toggleFullscreen}
        aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        title={isFullscreen ? 'Exit fullscreen (Esc)' : 'Toggle fullscreen (F)'}
      >
        {isFullscreen ? '⤢' : '⤡'}
      </button>
      {isSample && <div className={styles.demoOverlay}>Demo data — drop your files above</div>}
    </div>
  );
}
