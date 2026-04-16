import React, { useEffect, useRef, useState } from 'react';
import styles from './TimelineMap.module.css';

export default function TimelineMap({ points, paths, onPointClick, selectedPointId }) {
  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const pathsLayerRef = useRef(null);
  const markersRef = useRef([]);
  const markersByIdRef = useRef(new Map());
  const polylinesRef = useRef([]);
  const layerControlRef = useRef(null);
  const fullscreenControlRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Load Leaflet dynamically (client-side only)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if Leaflet is already loaded
    if (window.L && window.L.markerClusterGroup) {
      setIsLoaded(true);
      return;
    }

    // Load Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    link.crossOrigin = '';
    document.head.appendChild(link);

    // Load MarkerCluster CSS
    const clusterCSS = document.createElement('link');
    clusterCSS.rel = 'stylesheet';
    clusterCSS.href = 'https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.css';
    document.head.appendChild(clusterCSS);

    const clusterDefaultCSS = document.createElement('link');
    clusterDefaultCSS.rel = 'stylesheet';
    clusterDefaultCSS.href = 'https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.Default.css';
    document.head.appendChild(clusterDefaultCSS);

    // Load Leaflet JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
    script.crossOrigin = '';

    // Load MarkerCluster plugin after Leaflet
    script.onload = () => {
      const clusterScript = document.createElement('script');
      clusterScript.src = 'https://unpkg.com/leaflet.markercluster@1.4.1/dist/leaflet.markercluster.js';
      clusterScript.onload = () => setIsLoaded(true);
      document.head.appendChild(clusterScript);
    };

    document.head.appendChild(script);

    return () => {
      document.head.removeChild(link);
      document.head.removeChild(clusterCSS);
      document.head.removeChild(clusterDefaultCSS);
      document.head.removeChild(script);
    };
  }, []);

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !mapRef.current || mapInstanceRef.current) return;

    const L = window.L;

    console.log('[TimelineMap] Initializing map with Canvas renderer for better performance');

    // Create Canvas renderer for better performance with large datasets
    const canvasRenderer = L.canvas({ padding: 0.5 });

    // Create map with zoom control enabled and canvas renderer
    const map = L.map(mapRef.current, {
      zoomControl: true,
      preferCanvas: true,
      renderer: canvasRenderer,
    }).setView([37.445, -0.09], 3);

    // Add OpenStreetMap as the only base layer
    const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // Create marker cluster group for better performance with many markers
    const markersLayer = L.markerClusterGroup({
      chunkedLoading: true, // Load markers in chunks to avoid blocking UI
      chunkInterval: 50,    // Faster chunk processing
      chunkDelay: 10,       // Minimal delay between chunks
      chunkProgress: null,  // Disable progress updates for speed
      maxClusterRadius: 80,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      spiderfyOnEveryZoom: true, // Always spiderfy clusters instead of zooming
      disableClusteringAtZoom: 19, // Disable clustering at max zoom
      removeOutsideVisibleBounds: true, // Remove markers outside view for better performance
      animate: false,       // Disable animations for performance
    }).addTo(map);

    // Create paths layer
    const pathsLayer = L.layerGroup().addTo(map);

    markersLayerRef.current = markersLayer;
    pathsLayerRef.current = pathsLayer;

    console.log('[TimelineMap] Marker clustering enabled for performance');

    // Add layer control for both markers and paths
    const overlayLayers = {
      'Visits & Points': markersLayer,
      'Activity Paths': pathsLayer,
    };

    const layerControl = L.control.layers(null, overlayLayers, { position: 'topright' }).addTo(map);
    layerControlRef.current = layerControl;

    // Fullscreen control — sits below the zoom control
    const FullscreenControl = L.Control.extend({
      options: { position: 'topleft' },
      onAdd: function () {
        const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        const button = L.DomUtil.create('a', 'timeline-map-fullscreen-btn', container);
        button.href = '#';
        button.role = 'button';
        button.title = 'Toggle fullscreen (F)';
        button.setAttribute('aria-label', 'Toggle fullscreen');
        button.innerHTML = fullscreenIconSVG(false);
        this._button = button;

        L.DomEvent.disableClickPropagation(container);
        L.DomEvent.on(button, 'click', L.DomEvent.stop).on(button, 'click', toggleFullscreen);

        return container;
      },
      update: function (active) {
        if (!this._button) return;
        this._button.innerHTML = fullscreenIconSVG(active);
        this._button.title = active ? 'Exit fullscreen (Esc)' : 'Toggle fullscreen (F)';
      },
    });

    const fullscreenControl = new FullscreenControl();
    fullscreenControl.addTo(map);
    fullscreenControlRef.current = fullscreenControl;

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isLoaded]);

  // Fullscreen API — toggle and sync with browser state
  function toggleFullscreen() {
    const el = containerRef.current;
    if (!el) return;

    const doc = document;
    const fsElement =
      doc.fullscreenElement ||
      doc.webkitFullscreenElement ||
      doc.msFullscreenElement;

    if (!fsElement) {
      const request =
        el.requestFullscreen ||
        el.webkitRequestFullscreen ||
        el.msRequestFullscreen;
      if (request) request.call(el);
    } else {
      const exit =
        doc.exitFullscreen ||
        doc.webkitExitFullscreen ||
        doc.msExitFullscreen;
      if (exit) exit.call(doc);
    }
  }

  function fullscreenIconSVG(active) {
    // Shrink (active) vs expand (inactive) glyph
    if (active) {
      return '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 3v4a2 2 0 0 1-2 2H3M21 9h-4a2 2 0 0 1-2-2V3M3 15h4a2 2 0 0 1 2 2v4M15 21v-4a2 2 0 0 1 2-2h4"/></svg>';
    }
    return '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 9V5a2 2 0 0 1 2-2h4M21 9V5a2 2 0 0 0-2-2h-4M3 15v4a2 2 0 0 0 2 2h4M21 15v4a2 2 0 0 1-2 2h-4"/></svg>';
  }

  // Sync React state with browser fullscreen events + resize map
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleChange = () => {
      const doc = document;
      const fsElement =
        doc.fullscreenElement ||
        doc.webkitFullscreenElement ||
        doc.msFullscreenElement;
      const active = fsElement === containerRef.current;
      setIsFullscreen(active);

      if (fullscreenControlRef.current) {
        fullscreenControlRef.current.update(active);
      }

      // Map container size changed — tell Leaflet to recalculate
      if (mapInstanceRef.current) {
        setTimeout(() => mapInstanceRef.current?.invalidateSize(), 100);
      }
    };

    const handleKey = (e) => {
      // "F" keyboard shortcut to toggle fullscreen, only when map container is focused/hovered
      if (e.key !== 'f' && e.key !== 'F') return;
      const target = e.target;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) return;
      if (!containerRef.current?.matches(':hover')) return;
      e.preventDefault();
      toggleFullscreen();
    };

    document.addEventListener('fullscreenchange', handleChange);
    document.addEventListener('webkitfullscreenchange', handleChange);
    document.addEventListener('msfullscreenchange', handleChange);
    window.addEventListener('keydown', handleKey);

    return () => {
      document.removeEventListener('fullscreenchange', handleChange);
      document.removeEventListener('webkitfullscreenchange', handleChange);
      document.removeEventListener('msfullscreenchange', handleChange);
      window.removeEventListener('keydown', handleKey);
    };
  }, [isLoaded]);

  // Track previous points/paths to avoid unnecessary full re-renders
  const prevPointsLengthRef = useRef(0);
  const prevPointsFirstIdRef = useRef(null);
  const prevPathsLengthRef = useRef(0);

  // Update markers and paths when data changes
  useEffect(() => {
    if (!mapInstanceRef.current || !isLoaded || !markersLayerRef.current || !pathsLayerRef.current) return;

    const L = window.L;
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    const pathsLayer = pathsLayerRef.current;

    // Check if this is an incremental update (same dataset growing) or full reset
    const firstId = points.length > 0 ? points[0].id : null;
    const sameDataset = firstId !== null && firstId === prevPointsFirstIdRef.current;
    const isIncrementalUpdate = sameDataset && points.length > prevPointsLengthRef.current;
    const pointsToAdd = isIncrementalUpdate ? points.slice(prevPointsLengthRef.current) : points;

    if (!isIncrementalUpdate) {
      // Full reset - clear everything
      console.log('[TimelineMap] Full reset - clearing all markers');
      markersLayer.clearLayers();
      markersRef.current = [];
      markersByIdRef.current.clear();

      // Clear existing polylines
      pathsLayer.clearLayers();
      polylinesRef.current = [];
    } else {
      console.log(`[TimelineMap] Incremental update - adding ${pointsToAdd.length} new points (total: ${points.length})`);
    }

    // Add paths to paths layer (only if paths changed)
    const pathsChanged = paths.length !== prevPathsLengthRef.current;

    if (paths && paths.length > 0 && pathsChanged) {
      console.log(`[TimelineMap] Adding ${paths.length} path(s) to map`);

      // Clear and re-add all paths when paths change
      pathsLayer.clearLayers();
      polylinesRef.current = [];

      paths.forEach(path => {
        const polyline = L.polyline(path.coordinates, {
          color: '#0000ff',
          weight: 3,
          opacity: 0.7,
          renderer: map.options.renderer, // Use canvas renderer
        });

        // Add popup for path
        if (path.activityType) {
          const popupContent = createPathPopupContent(path);
          polyline.bindPopup(popupContent);
        }

        // Add hover effect - change to yellow on mouseover
        polyline.on('mouseover', function() {
          this.setStyle({
            color: '#ffff00',
            weight: 4,
            opacity: 0.9,
          });
        });

        polyline.on('mouseout', function() {
          this.setStyle({
            color: '#0000ff',
            weight: 3,
            opacity: 0.7,
          });
        });

        pathsLayer.addLayer(polyline);
        polylinesRef.current.push(polyline);
      });
    }

    // Add markers to markers layer with smart positioning
    if (pointsToAdd && pointsToAdd.length > 0) {
      console.log(`[TimelineMap] Adding ${pointsToAdd.length} marker(s) to map`);

      // Simplified approach for performance: just add markers without complex grouping
      // The clustering library will handle overlapping markers
      const newMarkers = [];

      pointsToAdd.forEach(point => {
        const marker = L.marker([point.lat, point.lng], {
          icon: getMarkerIcon(point.type, L),
        });

        // Lazy-load popup content only when needed (on first popup open)
        let popupCreated = false;
        marker.on('popupopen', () => {
          if (!popupCreated) {
            marker.setPopupContent(createPopupContent(point));
            popupCreated = true;
          }
        });
        marker.bindPopup('Loading...'); // Placeholder

        marker.on('click', () => onPointClick(point));

        newMarkers.push(marker);
        markersRef.current.push(marker);
        markersByIdRef.current.set(point.id, marker);
      });

      // Add all markers in one batch for better performance
      markersLayer.addLayers(newMarkers);

      // Fit map to show all points when:
      // 1. Initial load (not incremental update)
      // 2. Full reset (points array changed, like year filter change)
      if (markersRef.current.length > 0 && !selectedPointId) {
        if (!isIncrementalUpdate) {
          console.log('[TimelineMap] Fitting bounds to show all points');
          const group = L.featureGroup(markersRef.current);
          const bounds = group.getBounds();

          if (bounds.isValid()) {
            map.fitBounds(bounds.pad(0.1), {
              animate: true,
              duration: 0.5,
              maxZoom: 15  // Don't zoom in too close
            });
          }
        }
      }
    }

    // Update refs at the end
    prevPointsLengthRef.current = points.length;
    prevPointsFirstIdRef.current = points.length > 0 ? points[0].id : null;
    prevPathsLengthRef.current = paths.length;
  }, [points, paths, isLoaded, onPointClick]);

  // Handle selected point change (open popup and pan to marker)
  useEffect(() => {
    if (!mapInstanceRef.current || !isLoaded || !selectedPointId) return;

    const marker = markersByIdRef.current.get(selectedPointId);
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;

    if (marker) {
      // Check if marker is in a cluster
      if (markersLayer.getVisibleParent(marker)) {
        // Marker is clustered, zoom to show it
        markersLayer.zoomToShowLayer(marker, () => {
          map.setView(marker.getLatLng(), Math.max(map.getZoom(), 16));
          marker.openPopup();
        });
      } else {
        // Marker is visible, just pan to it and open popup
        map.setView(marker.getLatLng(), Math.max(map.getZoom(), 16));
        marker.openPopup();
      }
    }
  }, [selectedPointId, isLoaded]);

  // Cache marker icons to reduce memory usage
  const markerIconCache = useRef({});

  function getMarkerIcon(type, L) {
    // Return cached icon if available
    if (markerIconCache.current[type]) {
      return markerIconCache.current[type];
    }

    const colors = {
      'place_visit': '#10b981',
      'location_record': '#3b82f6',
      'activity_start': '#f59e0b',
      'activity_end': '#ef4444',
      'place_aggregate': '#8b5cf6',
      'raw_signal': '#6b7280',
    };

    const color = colors[type] || '#3b82f6';

    // Simplified icon with minimal DOM
    const icon = L.divIcon({
      className: 'custom-marker',
      html: `<div style="background-color:${color};width:20px;height:20px;border-radius:50%;border:3px solid white;box-shadow:0 2px 4px rgba(0,0,0,0.3)"></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

    // Cache the icon
    markerIconCache.current[type] = icon;

    return icon;
  }

  function createPopupContent(point) {
    let content = `<div style="min-width: 200px;">`;

    if (point.name) {
      content += `<strong style="font-size: 1.1em;">${point.name}</strong><br>`;
    }

    if (point.address) {
      content += `<em>${point.address}</em><br>`;
    }

    content += `<br><strong>Type:</strong> ${point.type.replace(/_/g, ' ')}<br>`;

    if (point.timestamp) {
      content += `<strong>Time:</strong> ${new Date(point.timestamp).toLocaleString()}<br>`;
    }

    if (point.duration) {
      content += `<strong>Duration:</strong> ${point.duration}<br>`;
    }

    // Activity information
    if (point.activityType) {
      content += `<strong>Activity:</strong> ${point.activityType.replace(/_/g, ' ')}`;
      if (point.activityConfidence) {
        content += ` (${point.activityConfidence}% confidence)`;
      }
      content += `<br>`;
    }

    // Additional metadata for Records format
    if (point.accuracy) {
      content += `<strong>Accuracy:</strong> ${point.accuracy}m<br>`;
    }

    if (point.altitude) {
      content += `<strong>Altitude:</strong> ${point.altitude}m<br>`;
    }

    if (point.velocity !== null && point.velocity !== undefined) {
      const kmh = (point.velocity * 3.6).toFixed(1);
      content += `<strong>Speed:</strong> ${kmh} km/h<br>`;
    }

    if (point.source) {
      content += `<strong>Source:</strong> ${point.source.toUpperCase()}<br>`;
    }

    content += `</div>`;

    return content;
  }

  function createPathPopupContent(path) {
    let content = `<div style="min-width: 220px;">`;

    // Activity type
    if (path.activityType) {
      content += `<strong style="font-size: 1.1em;">Activity:</strong> ${path.activityType.replace(/_/g, ' ')}<br><br>`;
    }

    // Start time
    if (path.startTime) {
      const startDate = new Date(path.startTime);
      content += `<strong>Start:</strong> ${startDate.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })}<br>`;
    }

    // End time
    if (path.endTime) {
      const endDate = new Date(path.endTime);
      content += `<strong>End:</strong> ${endDate.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })}<br>`;
    }

    // Duration (calculate from start/end if not provided)
    if (path.startTime && path.endTime) {
      const durationMs = new Date(path.endTime) - new Date(path.startTime);
      const hours = Math.floor(durationMs / (1000 * 60 * 60));
      const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60));

      if (hours > 0) {
        content += `<strong>Duration:</strong> ${hours}h ${minutes}m<br>`;
      } else {
        content += `<strong>Duration:</strong> ${minutes}m<br>`;
      }
    }

    // Distance in km
    if (path.distance) {
      const distanceKm = (path.distance / 1000).toFixed(2);
      content += `<br><strong>Distance:</strong> ${distanceKm} km`;

      // Also show in meters if less than 1km
      if (path.distance < 1000) {
        content += ` (${path.distance.toFixed(0)} m)`;
      }
    }

    content += `</div>`;

    return content;
  }

  if (!isLoaded) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading map...</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={styles.mapContainer}
      data-fullscreen={isFullscreen ? 'true' : 'false'}
    >
      <div ref={mapRef} className={styles.map}></div>
    </div>
  );
}
