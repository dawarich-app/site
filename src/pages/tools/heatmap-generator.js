import React, { useState, useCallback, useRef, useEffect } from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import BrowserOnly from '@docusaurus/BrowserOnly';
import { parseFile, pointsToGeoJSON, calculateBounds, calculateStats, exportMapAsImage } from '@site/src/utils/heatmapUtils';
import styles from './heatmap-generator.module.css';

const pageTitle = "Free GPS Heatmap Generator - Create Activity Heatmaps Online";
const pageDescription = "Create beautiful heatmaps from your GPS data. Upload GPX, FIT, TCX, GeoJSON, or KML files to visualize your running, cycling, and activity patterns. Free, privacy-first - works entirely in your browser.";
const pageUrl = "https://dawarich.app/tools/heatmap-generator";
const imageUrl = "https://dawarich.app/img/meta-image.jpg";

function HeatmapMap({ points, heatmapSettings }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [cssLoaded, setCssLoaded] = useState(false);

  // Load MapLibre CSS
  useEffect(() => {
    if (typeof window !== 'undefined' && !cssLoaded) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css';
      document.head.appendChild(link);
      setCssLoaded(true);
    }
  }, [cssLoaded]);

  useEffect(() => {
    if (!mapContainer.current || map.current || !cssLoaded) return;

    // Dynamically import maplibre-gl to avoid SSR issues
    import('maplibre-gl').then((maplibregl) => {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: {
          version: 8,
          sources: {
            'vector-tiles': {
              type: 'vector',
              tiles: ['https://tyles.dwri.xyz/planet/{z}/{x}/{y}.mvt'],
              minzoom: 0,
              maxzoom: 14,
            },
          },
          layers: [
            {
              id: 'background',
              type: 'background',
              paint: {
                'background-color': '#1a1a2e',
              },
            },
            {
              id: 'water',
              type: 'fill',
              source: 'vector-tiles',
              'source-layer': 'water',
              paint: {
                'fill-color': '#16213e',
              },
            },
            {
              id: 'landcover',
              type: 'fill',
              source: 'vector-tiles',
              'source-layer': 'landcover',
              paint: {
                'fill-color': '#1a1a2e',
                'fill-opacity': 0.5,
              },
            },
            {
              id: 'landuse',
              type: 'fill',
              source: 'vector-tiles',
              'source-layer': 'landuse',
              paint: {
                'fill-color': '#1f1f3a',
                'fill-opacity': 0.3,
              },
            },
            {
              id: 'park',
              type: 'fill',
              source: 'vector-tiles',
              'source-layer': 'park',
              paint: {
                'fill-color': '#1a2a1a',
                'fill-opacity': 0.4,
              },
            },
            {
              id: 'roads',
              type: 'line',
              source: 'vector-tiles',
              'source-layer': 'transportation',
              paint: {
                'line-color': '#2a2a4a',
                'line-width': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  5, 0.5,
                  10, 1,
                  15, 2,
                ],
              },
            },
            {
              id: 'buildings',
              type: 'fill',
              source: 'vector-tiles',
              'source-layer': 'building',
              minzoom: 13,
              paint: {
                'fill-color': '#2a2a4a',
                'fill-opacity': 0.6,
              },
            },
          ],
        },
        center: [0, 20],
        zoom: 2,
        preserveDrawingBuffer: true, // Required for image export
      });

      map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

      map.current.on('load', () => {
        setMapLoaded(true);
      });
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update heatmap when points or settings change
  useEffect(() => {
    if (!map.current || !mapLoaded || points.length === 0) return;

    const geojson = pointsToGeoJSON(points);
    const bounds = calculateBounds(points);

    // Remove existing heatmap layers/sources
    if (map.current.getLayer('heatmap-layer')) {
      map.current.removeLayer('heatmap-layer');
    }
    if (map.current.getSource('heatmap-data')) {
      map.current.removeSource('heatmap-data');
    }

    // Add new source
    map.current.addSource('heatmap-data', {
      type: 'geojson',
      data: geojson,
    });

    // Add heatmap layer
    map.current.addLayer({
      id: 'heatmap-layer',
      type: 'heatmap',
      source: 'heatmap-data',
      paint: {
        // Increase weight based on zoom
        'heatmap-weight': [
          'interpolate',
          ['linear'],
          ['zoom'],
          0, 1,
          15, 0.5,
        ],
        // Increase intensity based on zoom
        'heatmap-intensity': [
          'interpolate',
          ['linear'],
          ['zoom'],
          0, heatmapSettings.intensity * 0.5,
          15, heatmapSettings.intensity * 2,
        ],
        // Color ramp based on selected color scheme
        'heatmap-color': getColorRamp(heatmapSettings.colorScheme),
        // Adjust radius based on zoom and settings
        'heatmap-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          0, heatmapSettings.radius * 0.5,
          5, heatmapSettings.radius,
          10, heatmapSettings.radius * 1.5,
          15, heatmapSettings.radius * 2,
        ],
        // Opacity
        'heatmap-opacity': heatmapSettings.opacity,
      },
    });

    // Fit bounds with padding
    if (bounds) {
      map.current.fitBounds(
        [
          [bounds.minLon, bounds.minLat],
          [bounds.maxLon, bounds.maxLat],
        ],
        { padding: 50, maxZoom: 15 }
      );
    }
  }, [points, mapLoaded, heatmapSettings]);

  const handleExport = () => {
    if (map.current) {
      exportMapAsImage(map.current, 'gps-heatmap.png');
    }
  };

  return (
    <div className={styles.mapWrapper}>
      <div ref={mapContainer} className={styles.mapContainer} />
      {mapLoaded && points.length > 0 && (
        <button onClick={handleExport} className={styles.exportButton}>
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export as PNG
        </button>
      )}
    </div>
  );
}

function getColorRamp(scheme) {
  const schemes = {
    fire: [
      'interpolate',
      ['linear'],
      ['heatmap-density'],
      0, 'rgba(0, 0, 0, 0)',
      0.1, 'rgba(103, 0, 31, 0.5)',
      0.3, 'rgba(178, 24, 43, 0.7)',
      0.5, 'rgba(214, 96, 77, 0.8)',
      0.7, 'rgba(244, 165, 130, 0.9)',
      0.9, 'rgba(253, 219, 199, 0.95)',
      1, 'rgba(255, 255, 255, 1)',
    ],
    ocean: [
      'interpolate',
      ['linear'],
      ['heatmap-density'],
      0, 'rgba(0, 0, 0, 0)',
      0.1, 'rgba(8, 29, 88, 0.5)',
      0.3, 'rgba(37, 52, 148, 0.7)',
      0.5, 'rgba(34, 94, 168, 0.8)',
      0.7, 'rgba(29, 145, 192, 0.9)',
      0.9, 'rgba(65, 182, 196, 0.95)',
      1, 'rgba(199, 233, 180, 1)',
    ],
    plasma: [
      'interpolate',
      ['linear'],
      ['heatmap-density'],
      0, 'rgba(0, 0, 0, 0)',
      0.1, 'rgba(13, 8, 135, 0.5)',
      0.3, 'rgba(126, 3, 168, 0.7)',
      0.5, 'rgba(203, 71, 119, 0.8)',
      0.7, 'rgba(248, 149, 64, 0.9)',
      0.9, 'rgba(239, 248, 33, 0.95)',
      1, 'rgba(255, 255, 255, 1)',
    ],
    strava: [
      'interpolate',
      ['linear'],
      ['heatmap-density'],
      0, 'rgba(0, 0, 0, 0)',
      0.1, 'rgba(252, 76, 2, 0.3)',
      0.3, 'rgba(252, 76, 2, 0.5)',
      0.5, 'rgba(252, 76, 2, 0.7)',
      0.7, 'rgba(252, 100, 45, 0.85)',
      0.9, 'rgba(255, 140, 90, 0.95)',
      1, 'rgba(255, 200, 170, 1)',
    ],
    green: [
      'interpolate',
      ['linear'],
      ['heatmap-density'],
      0, 'rgba(0, 0, 0, 0)',
      0.1, 'rgba(0, 68, 27, 0.5)',
      0.3, 'rgba(0, 109, 44, 0.7)',
      0.5, 'rgba(35, 139, 69, 0.8)',
      0.7, 'rgba(65, 171, 93, 0.9)',
      0.9, 'rgba(116, 196, 118, 0.95)',
      1, 'rgba(199, 233, 192, 1)',
    ],
  };

  return schemes[scheme] || schemes.fire;
}

export default function HeatmapGenerator() {
  const [files, setFiles] = useState([]);
  const [points, setPoints] = useState([]);
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [heatmapSettings, setHeatmapSettings] = useState({
    intensity: 1,
    radius: 8,
    opacity: 0.8,
    colorScheme: 'fire',
  });

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handleFileInput = useCallback((e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  }, []);

  const handleFiles = async (newFiles) => {
    setIsLoading(true);
    setError(null);

    try {
      const allPoints = [...points];
      const processedFiles = [...files];

      for (const file of newFiles) {
        try {
          const filePoints = await parseFile(file);
          allPoints.push(...filePoints);
          processedFiles.push({
            name: file.name,
            pointCount: filePoints.length,
          });
        } catch (err) {
          console.error(`Error parsing ${file.name}:`, err);
          setError(`Error parsing ${file.name}: ${err.message}`);
        }
      }

      setFiles(processedFiles);
      setPoints(allPoints);
      setStats(calculateStats(allPoints));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setFiles([]);
    setPoints([]);
    setStats(null);
    setError(null);
  };

  const handleRemoveFile = (index) => {
    // Recalculate points by re-parsing remaining files
    // For simplicity, we'll clear and ask user to re-upload
    // In a more complex implementation, we'd track points per file
    handleClear();
  };

  const updateSetting = (key, value) => {
    setHeatmapSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Layout title={pageTitle} description={pageDescription}>
      <Head>
        <meta name="title" content={pageTitle} />
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="GPS heatmap, heatmap generator, running heatmap, cycling heatmap, Strava heatmap alternative, GPX heatmap, activity heatmap, fitness heatmap, free heatmap" />
        <link rel="canonical" href={pageUrl} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={imageUrl} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={pageUrl} />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={imageUrl} />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "GPS Heatmap Generator",
            "url": pageUrl,
            "description": pageDescription,
            "applicationCategory": "UtilityApplication",
            "operatingSystem": "Any",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          })}
        </script>
      </Head>

      <div className={styles.container}>
        <div className={styles.header}>
          <h1>GPS Heatmap Generator</h1>
          <p>Create beautiful heatmaps from your GPS activities. Upload multiple files to see your running, cycling, and activity patterns visualized on a map.</p>
        </div>

        <div className={styles.mainContent}>
          <div className={styles.sidebar}>
            <div className={styles.uploadSection}>
              <h3>Upload Files</h3>
              <div
                className={`${styles.dropZone} ${dragActive ? styles.dragActive : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <svg className={styles.uploadIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p>Drag & drop files here</p>
                <span className={styles.supportedFormats}>GPX, FIT, TCX, GeoJSON, KML, KMZ</span>
                <input
                  type="file"
                  className={styles.fileInput}
                  accept=".gpx,.fit,.tcx,.geojson,.json,.kml,.kmz"
                  multiple
                  onChange={handleFileInput}
                />
              </div>

              {isLoading && (
                <div className={styles.loadingIndicator}>
                  <div className={styles.spinner}></div>
                  Processing files...
                </div>
              )}

              {error && (
                <div className={styles.errorMessage}>
                  {error}
                </div>
              )}

              {files.length > 0 && (
                <div className={styles.fileList}>
                  <div className={styles.fileListHeader}>
                    <span>Loaded Files ({files.length})</span>
                    <button onClick={handleClear} className={styles.clearButton}>Clear All</button>
                  </div>
                  {files.map((file, index) => (
                    <div key={index} className={styles.fileItem}>
                      <span className={styles.fileName}>{file.name}</span>
                      <span className={styles.pointCount}>{file.pointCount.toLocaleString()} pts</span>
                    </div>
                  ))}
                </div>
              )}

              {stats && (
                <div className={styles.statsPanel}>
                  <h4>Statistics</h4>
                  <div className={styles.statItem}>
                    <span>Total Points</span>
                    <strong>{stats.totalPoints.toLocaleString()}</strong>
                  </div>
                  <div className={styles.statItem}>
                    <span>Total Distance</span>
                    <strong>{stats.totalDistance.toFixed(1)} km</strong>
                  </div>
                  {stats.timeRange && (
                    <div className={styles.statItem}>
                      <span>Date Range</span>
                      <strong>{stats.timeRange.start.toLocaleDateString()} - {stats.timeRange.end.toLocaleDateString()}</strong>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className={styles.settingsSection}>
              <h3>Heatmap Settings</h3>
              
              <div className={styles.settingItem}>
                <label>Color Scheme</label>
                <select 
                  value={heatmapSettings.colorScheme}
                  onChange={(e) => updateSetting('colorScheme', e.target.value)}
                >
                  <option value="fire">Fire (Red/Orange)</option>
                  <option value="strava">Strava (Orange)</option>
                  <option value="plasma">Plasma (Purple/Yellow)</option>
                  <option value="ocean">Ocean (Blue)</option>
                  <option value="green">Forest (Green)</option>
                </select>
              </div>

              <div className={styles.settingItem}>
                <label>Intensity: {heatmapSettings.intensity.toFixed(1)}</label>
                <input
                  type="range"
                  min="0.1"
                  max="3"
                  step="0.1"
                  value={heatmapSettings.intensity}
                  onChange={(e) => updateSetting('intensity', parseFloat(e.target.value))}
                />
              </div>

              <div className={styles.settingItem}>
                <label>Radius: {heatmapSettings.radius}</label>
                <input
                  type="range"
                  min="2"
                  max="30"
                  step="1"
                  value={heatmapSettings.radius}
                  onChange={(e) => updateSetting('radius', parseInt(e.target.value))}
                />
              </div>

              <div className={styles.settingItem}>
                <label>Opacity: {heatmapSettings.opacity.toFixed(1)}</label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={heatmapSettings.opacity}
                  onChange={(e) => updateSetting('opacity', parseFloat(e.target.value))}
                />
              </div>
            </div>

            <div className={styles.privacyNote}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Your data stays in your browser. Nothing is uploaded to any server.</span>
            </div>
          </div>

          <div className={styles.mapSection}>
            <BrowserOnly fallback={<div className={styles.mapPlaceholder}>Loading map...</div>}>
              {() => <HeatmapMap points={points} heatmapSettings={heatmapSettings} />}
            </BrowserOnly>
          </div>
        </div>

        <div className={styles.infoSection}>
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <h2>What is a GPS Heatmap?</h2>
              <p>A GPS heatmap visualizes the density of your location data on a map. Areas you've visited more frequently appear brighter and more intense, creating a visual representation of your activity patterns over time.</p>
            </div>

            <div className={styles.infoCard}>
              <h2>Supported File Formats</h2>
              <ul>
                <li><strong>GPX</strong> - GPS Exchange Format (most GPS apps)</li>
                <li><strong>FIT</strong> - Garmin activity files</li>
                <li><strong>GeoJSON</strong> - Web mapping format</li>
                <li><strong>KML/KMZ</strong> - Google Earth format</li>
              </ul>
            </div>

            <div className={styles.infoCard}>
              <h2>How to Export Your Data</h2>
              <ul>
                <li><strong>Strava:</strong> Settings &gt; My Account &gt; Download your data</li>
                <li><strong>Garmin:</strong> Copy .FIT files from device or use Garmin Connect export</li>
                <li><strong>Apple Fitness:</strong> Use third-party apps to export workouts as GPX</li>
                <li><strong>Google Maps:</strong> Use Google Takeout to export location history</li>
              </ul>
            </div>

            <div className={styles.infoCard}>
              <h2>Free Alternative to Strava Heatmap</h2>
              <p>Strava's heatmap feature requires a paid subscription. This free tool lets you create similar heatmaps from your exported data without any subscription or account required.</p>
            </div>
          </div>
        </div>

        <div className={styles.ctaPanel}>
          <div className={styles.ctaContent}>
            <h3>Want to visualize years of location history?</h3>
            <p>Try Dawarich - a self-hosted platform that automatically tracks your location and creates beautiful visualizations of your movements over time. Import data from Google, Strava, Garmin, and more.</p>
            <a href="/?utm_source=tool&utm_medium=cta&utm_campaign=heatmap-generator" className={styles.ctaButton}>Explore Dawarich</a>
          </div>
        </div>
      </div>
    </Layout>
  );
}
