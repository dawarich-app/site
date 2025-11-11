import React, { useEffect, useRef, useState } from 'react';
import styles from './TimelineMap.module.css';

export default function PhotoMap({ points, onPointClick, selectedPointId }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const markersRef = useRef([]);
  const markersByIdRef = useRef(new Map());
  const [isLoaded, setIsLoaded] = useState(false);

  // Load Leaflet dynamically (client-side only)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if Leaflet is already loaded
    if (window.L) {
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

    // Load Leaflet JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
    script.crossOrigin = '';
    script.onload = () => setIsLoaded(true);

    document.head.appendChild(script);

    return () => {
      if (document.head.contains(link)) {
        document.head.removeChild(link);
      }
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !mapRef.current || mapInstanceRef.current) return;

    const L = window.L;

    console.log('[PhotoMap] Initializing map');

    // Create map
    const map = L.map(mapRef.current, {
      zoomControl: true,
      preferCanvas: true,
    }).setView([37.445, -0.09], 3);

    // Add OpenStreetMap
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    // Create markers layer
    const markersLayer = L.layerGroup().addTo(map);

    markersLayerRef.current = markersLayer;
    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isLoaded]);

  // Update markers when data changes
  useEffect(() => {
    if (!mapInstanceRef.current || !isLoaded || !markersLayerRef.current) return;

    const L = window.L;
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;

    // Clear existing markers
    console.log('[PhotoMap] Clearing markers');
    markersLayer.clearLayers();
    markersRef.current = [];
    markersByIdRef.current.clear();

    // Add markers
    if (points && points.length > 0) {
      console.log(`[PhotoMap] Adding ${points.length} photo marker(s)`);

      points.forEach(point => {
        // Custom camera icon marker
        const marker = L.marker([point.lat, point.lng], {
          icon: L.divIcon({
            className: 'photo-marker',
            html: `<div style="background-color:#ef4444;width:24px;height:24px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;">
              <svg style="width:14px;height:14px;fill:white;" viewBox="0 0 24 24">
                <path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/>
              </svg>
            </div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          }),
        });

        // Create popup content
        const popupContent = createPopupContent(point);
        marker.bindPopup(popupContent);

        marker.on('click', () => onPointClick(point));

        markersLayer.addLayer(marker);
        markersRef.current.push(marker);
        markersByIdRef.current.set(point.id, marker);
      });

      // Fit map to show all photos
      if (markersRef.current.length > 0 && !selectedPointId) {
        console.log('[PhotoMap] Fitting bounds to show all photos');
        const group = L.featureGroup(markersRef.current);
        const bounds = group.getBounds();

        if (bounds.isValid()) {
          map.fitBounds(bounds.pad(0.1), {
            animate: true,
            duration: 0.5,
            maxZoom: 15
          });
        }
      }
    }
  }, [points, isLoaded, onPointClick, selectedPointId]);

  // Handle selected point change
  useEffect(() => {
    if (!mapInstanceRef.current || !isLoaded || !selectedPointId) return;

    const marker = markersByIdRef.current.get(selectedPointId);
    const map = mapInstanceRef.current;

    if (marker) {
      map.setView(marker.getLatLng(), Math.max(map.getZoom(), 16));
      marker.openPopup();
    }
  }, [selectedPointId, isLoaded]);

  function createPopupContent(point) {
    let content = `<div style="min-width: 300px; max-width: 400px;">`;

    // Show full photo if available (using object URL)
    if (point.imageUrl) {
      content += `<img src="${point.imageUrl}"
             style="width: 100%; max-width: 400px; height: auto; border-radius: 4px; margin-bottom: 10px; display: block;"
             alt="${point.filename || 'Photo'}" />`;
    }

    if (point.filename) {
      content += `<strong style="font-size: 1.05em;">${point.filename}</strong><br><br>`;
    }

    content += `<strong>Coordinates:</strong><br>${point.lat.toFixed(6)}, ${point.lng.toFixed(6)}<br>`;

    if (point.altitude) {
      content += `<strong>Altitude:</strong> ${point.altitude.toFixed(1)}m<br>`;
    }

    if (point.timestamp) {
      content += `<strong>Taken:</strong> ${new Date(point.timestamp).toLocaleString()}<br>`;
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
    <div className={styles.mapContainer}>
      <div ref={mapRef} className={styles.map}></div>
    </div>
  );
}
