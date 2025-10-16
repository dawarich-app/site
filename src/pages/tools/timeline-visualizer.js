import React, { useState, useCallback } from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import FileUploader from '@site/src/components/FileUploader';
import TimelineMap from '@site/src/components/TimelineMap';
import PointsList from '@site/src/components/PointsList';
import { parseTimeline } from '@site/src/utils/timelineParser';
import styles from './timeline-visualizer.module.css';

const pageTitle = "Google Timeline Visualizer - View Your Location History on a Map";
const pageDescription = "Free, privacy-first tool to visualize your Google Timeline location history on an interactive map. All data processing happens in your browser - no data is sent to any server.";
const pageUrl = "https://dawarich.app/tools/timeline-visualizer";
const imageUrl = "https://dawarich.app/img/meta-image.jpg";

export default function TimelineVisualizer() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [points, setPoints] = useState([]);
  const [paths, setPaths] = useState([]);
  const [selectedYear, setSelectedYear] = useState('all');
  const [yearStats, setYearStats] = useState({});

  const handleFilesLoaded = useCallback(async (files) => {
    console.log('='.repeat(60));
    console.log('[Timeline Visualizer] Starting to process files');
    console.log(`[Timeline Visualizer] Number of files: ${files.length}`);

    setUploadedFiles(files);

    // Parse all files and stream points in batches
    const BATCH_SIZE = 5000;
    const allPoints = [];
    const allPaths = [];

    for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
      const file = files[fileIndex];

      try {
        console.log(`\n[Timeline Visualizer] Processing file ${fileIndex + 1}/${files.length}: ${file.filename}`);
        console.log(`[Timeline Visualizer] File size: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
        console.log(`[Timeline Visualizer] File data type:`, Array.isArray(file.data) ? 'Array' : 'Object');

        if (Array.isArray(file.data)) {
          console.log(`[Timeline Visualizer] Array length: ${file.data.length}`);
        } else {
          console.log(`[Timeline Visualizer] Object keys:`, Object.keys(file.data).join(', '));
        }

        const startTime = Date.now();
        const parsed = parseTimeline(file.data);
        const endTime = Date.now();

        console.log(`[Timeline Visualizer] ✓ Parsed in ${((endTime - startTime) / 1000).toFixed(2)}s`);
        console.log(`[Timeline Visualizer]   Format: ${parsed.metadata?.format || 'unknown'}`);
        console.log(`[Timeline Visualizer]   Points extracted: ${parsed.points.length}`);
        console.log(`[Timeline Visualizer]   Paths extracted: ${parsed.paths.length}`);

        // Add paths
        if (parsed.paths.length > 0) {
          for (let i = 0; i < parsed.paths.length; i++) {
            allPaths.push(parsed.paths[i]);
          }
        }

        // Stream points to map in batches to keep UI responsive
        console.log(`[Timeline Visualizer] Streaming ${parsed.points.length} points in batches of ${BATCH_SIZE}...`);
        let batchCount = 0;

        for (let i = 0; i < parsed.points.length; i++) {
          allPoints.push(parsed.points[i]);

          // Every BATCH_SIZE points, update the UI
          if (allPoints.length % BATCH_SIZE === 0) {
            batchCount++;
            console.log(`[Timeline Visualizer]   Batch ${batchCount}: ${allPoints.length} points loaded`);

            // Update map with current points
            setPoints([...allPoints]);

            // Yield to browser to prevent freezing
            await new Promise(resolve => setTimeout(resolve, 0));
          }
        }

        // Update with any remaining points
        if (allPoints.length % BATCH_SIZE !== 0) {
          console.log(`[Timeline Visualizer]   Final: ${allPoints.length} points loaded`);
          setPoints([...allPoints]);
        }

      } catch (error) {
        console.error(`[Timeline Visualizer] ✗ Error parsing ${file.filename}:`, error);
        console.error('[Timeline Visualizer] Error stack:', error.stack);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`[Timeline Visualizer] Processing complete!`);
    console.log(`[Timeline Visualizer] Total points: ${allPoints.length}`);
    console.log(`[Timeline Visualizer] Total paths: ${allPaths.length}`);

    // Calculate year statistics
    console.log('[Timeline Visualizer] Calculating year statistics...');
    const yearCounts = {};

    for (let i = 0; i < allPoints.length; i++) {
      const point = allPoints[i];
      if (point.timestamp) {
        const year = new Date(point.timestamp).getFullYear();
        if (!isNaN(year)) {
          yearCounts[year] = (yearCounts[year] || 0) + 1;
        }
      }
    }

    console.log(`[Timeline Visualizer] Year statistics:`, yearCounts);

    // Default to the earliest year (first chronologically) for better initial performance
    const years = Object.keys(yearCounts).map(Number).sort((a, b) => a - b);
    const defaultYear = years.length > 0 ? String(years[0]) : 'all';

    console.log(`[Timeline Visualizer] Defaulting to year: ${defaultYear} (${yearCounts[defaultYear]?.toLocaleString() || 0} points)`);
    console.log('='.repeat(60));

    // Set final state
    setPoints(allPoints);
    setPaths(allPaths);
    setYearStats(yearCounts);
    setSelectedYear(defaultYear);
  }, []);

  const handleClear = useCallback(() => {
    setUploadedFiles([]);
    setSelectedPoint(null);
    setPoints([]);
    setPaths([]);
  }, []);

  const handlePointClick = useCallback((point) => {
    setSelectedPoint(point);
  }, []);

  const handleYearChange = useCallback((event) => {
    setSelectedYear(event.target.value);
    setSelectedPoint(null);
  }, []);

  // Filter points by selected year
  const filteredPoints = React.useMemo(() => {
    if (selectedYear === 'all') {
      return points;
    }

    const year = parseInt(selectedYear);
    return points.filter(point => {
      if (!point.timestamp) return false;
      const pointYear = new Date(point.timestamp).getFullYear();
      return pointYear === year;
    });
  }, [points, selectedYear]);

  // Filter paths by selected year (based on startTimestamp or endTimestamp)
  const filteredPaths = React.useMemo(() => {
    if (selectedYear === 'all') {
      return paths;
    }

    const year = parseInt(selectedYear);
    return paths.filter(path => {
      // Check if path's start or end timestamp falls in the selected year
      if (path.startTimestamp) {
        const pathYear = new Date(path.startTimestamp).getFullYear();
        if (pathYear === year) return true;
      }
      if (path.endTimestamp) {
        const pathYear = new Date(path.endTimestamp).getFullYear();
        if (pathYear === year) return true;
      }
      return false;
    });
  }, [paths, selectedYear]);

  return (
    <Layout
      title={pageTitle}
      description={pageDescription}
    >
      <Head>
        {/* Primary Meta Tags */}
        <meta name="title" content={pageTitle} />
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="Google Timeline, location history, map visualization, privacy-first, location tracking, Google Takeout, timeline viewer, location data" />
        <link rel="canonical" href={pageUrl} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:site_name" content="Dawarich" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={pageUrl} />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={imageUrl} />

        {/* Additional Meta Tags */}
        <meta name="author" content="Dawarich" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />

        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Google Timeline Visualizer",
            "url": pageUrl,
            "description": pageDescription,
            "applicationCategory": "UtilityApplication",
            "operatingSystem": "Any",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "featureList": [
              "Visualize Google Timeline data",
              "Interactive map with location markers",
              "Privacy-first - all processing in browser",
              "Support for multiple timeline formats",
              "No data sent to servers"
            ]
          })}
        </script>
      </Head>
      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          <div className={styles.header}>
            <h1>Timeline Visualizer</h1>
            <p>Upload your Google Timeline JSON files to visualize your location history. Supports Records, Semantic, Semantic Segments, Settings, TimelineEdits, and Location History formats.</p>
          </div>

          <div className={styles.topSection}>
            <div className={styles.instructions}>
              <h2>How to Get Your Timeline Data</h2>
              <p>
                You can export your Google Timeline data using one of the following methods. If one of them doesn't work, try another.
              </p>
              <p>
                Unfortunately, some users might not be able to export their location data due to how Google went with transition to new location storage policies.
              </p>
              <div className={styles.instructionsList}>
                <div className={styles.instructionItem}>
                  <strong>Google Takeout:</strong>
                  <p>Visit <a href="https://takeout.google.com/" target="_blank" rel="noopener noreferrer">takeout.google.com</a> → Choose Location History (Timeline) → Export</p>
                  <p>This way might not work for everyone because Google changed the way location data is being stored and exported. More details in our <a href="https://dawarich.app/blog/migrating-from-google-location-history-to-dawarich">blog</a>.</p>
                </div>
                <div className={styles.instructionItem}>
                  <strong>On Android:</strong>
                  <p>Open Google Maps → Settings → Location → Location Services → Timeline → Export Timeline</p>
                </div>
                <div className={styles.instructionItem}>
                  <strong>On iOS:</strong>
                  <p>Open Google Maps → Settings → Personal Content → Export Timeline data</p>
                </div>
              </div>
            </div>

            <div className={styles.uploaderWrapper}>
              <FileUploader onFilesLoaded={handleFilesLoaded} onClear={handleClear} />

              <div className={styles.privacyNote}>
                <div>
                  <strong>
                    <svg className={styles.privacyIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Privacy First
                  </strong>
                  <p>All data processing happens entirely in your browser. Your location data never leaves your device and is not sent to any server.</p>
                </div>
              </div>
            </div>
          </div>

          {uploadedFiles.length > 0 && (
            <div className={styles.ctaPanel}>
              <div className={styles.ctaContent}>
                <h3>Want to keep your memories visualized on the map and track your daily movements?</h3>
                <p>Try Dawarich — a location tracking platform that gives you full control over your location data and provides key to your memories</p>
                <a href="/" className={styles.ctaButton}>Try Dawarich!</a>
              </div>
            </div>
          )}
        </div>

        <div className={styles.mapSection}>
          {points.length > 0 && (
            <div className={styles.filterSection}>
              <label htmlFor="yearFilter" className={styles.filterLabel}>
                Filter by Year:
              </label>
              <select
                id="yearFilter"
                value={selectedYear}
                onChange={handleYearChange}
                className={styles.yearSelect}
              >
                <option value="all">
                  All Years ({points.length.toLocaleString()} points)
                </option>
                {Object.keys(yearStats)
                  .sort((a, b) => b - a)
                  .map(year => (
                    <option key={year} value={year}>
                      {year} ({yearStats[year].toLocaleString()} points)
                    </option>
                  ))}
              </select>
              {selectedYear !== 'all' && (
                <span className={styles.filterInfo}>
                  Showing {filteredPoints.length.toLocaleString()} of {points.length.toLocaleString()} points
                </span>
              )}
            </div>
          )}

          <div className={styles.mapGrid}>
            <div className={styles.mapColumn}>
              <TimelineMap
                points={filteredPoints}
                paths={filteredPaths}
                onPointClick={handlePointClick}
                selectedPointId={selectedPoint?.id}
              />
            </div>

            <div className={styles.listColumn}>
              <PointsList
                points={filteredPoints}
                selectedPointId={selectedPoint?.id}
                onPointSelect={handlePointClick}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
