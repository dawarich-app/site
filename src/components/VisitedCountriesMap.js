import React, { useEffect, useRef, useState } from 'react';
import styles from './VisitedCountriesMap.module.css';

const MAPLIBRE_CSS = 'https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css';

function ensureMaplibreCss() {
  if (document.querySelector(`link[href="${MAPLIBRE_CSS}"]`)) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = MAPLIBRE_CSS;
  document.head.appendChild(link);
}

const visitedFilter = (ids) => ['in', ['get', 'id'], ['literal', ids]];

export default function VisitedCountriesMap({ countries, loadCountries, onLoad, visitedIds }) {
  const container = useRef(null);
  const map = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!countries) loadCountries().then(onLoad).catch(() => {});
  }, [countries, loadCountries, onLoad]);

  useEffect(() => {
    if (!countries || map.current || !container.current) return undefined;
    let cancelled = false;
    ensureMaplibreCss();
    import('maplibre-gl').then(({ default: maplibregl }) => {
      if (cancelled) return;
      map.current = new maplibregl.Map({
        container: container.current,
        style: {
          version: 8,
          sources: { countries: { type: 'geojson', data: countries } },
          layers: [
            { id: 'sea', type: 'background', paint: { 'background-color': '#dbe7f3' } },
            { id: 'land', type: 'fill', source: 'countries', paint: { 'fill-color': '#f4f4f0' } },
            { id: 'visited', type: 'fill', source: 'countries', filter: visitedFilter([]), paint: { 'fill-color': '#2563eb', 'fill-opacity': 0.85 } },
            { id: 'borders', type: 'line', source: 'countries', paint: { 'line-color': '#9aa5b1', 'line-width': 0.5 } },
          ],
        },
        center: [10, 30],
        zoom: 0.8,
        attributionControl: false,
        renderWorldCopies: false,
      });
      map.current.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
      map.current.on('load', () => setReady(true));
    });
    return () => { cancelled = true; };
  }, [countries]);

  useEffect(() => () => map.current?.remove(), []);

  useEffect(() => {
    if (ready) map.current.setFilter('visited', visitedFilter(visitedIds));
  }, [ready, visitedIds]);

  return <div ref={container} className={styles.map} data-visited={visitedIds.length} />;
}
