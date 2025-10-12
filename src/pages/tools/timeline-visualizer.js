import React, { useState, useCallback } from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import FileUploader from '@site/src/components/FileUploader';
import TimelineMap from '@site/src/components/TimelineMap';
import PointsList from '@site/src/components/PointsList';
import { parseSemantic } from '@site/src/utils/semanticParser';
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

  const handleFilesLoaded = useCallback((files) => {
    setUploadedFiles(files);

    // Parse all files and merge data
    const allPoints = [];
    const allPaths = [];

    files.forEach(file => {
      try {
        const parsed = parseSemantic(file.data);
        allPoints.push(...parsed.points);
        allPaths.push(...parsed.paths);
      } catch (error) {
        console.error(`Error parsing ${file.filename}:`, error);
      }
    });

    setPoints(allPoints);
    setPaths(allPaths);
    console.log(`Total: ${allPoints.length} points, ${allPaths.length} paths`);
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
            <p>Upload your Google Timeline JSON files to visualize your location history</p>
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
          <div className={styles.mapGrid}>
            <div className={styles.mapColumn}>
              <TimelineMap
                points={points}
                paths={paths}
                onPointClick={handlePointClick}
                selectedPointId={selectedPoint?.id}
              />
            </div>

            <div className={styles.listColumn}>
              <PointsList
                points={points}
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
