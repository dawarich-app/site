import React, { useState, useCallback } from 'react';
import Layout from '@theme/Layout';
import FileUploader from '@site/src/components/FileUploader';
import TimelineMap from '@site/src/components/TimelineMap';
import PointsList from '@site/src/components/PointsList';
import { parseSemantic } from '@site/src/utils/semanticParser';
import styles from './timeline-visualizer.module.css';

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
      title="Timeline Visualizer"
      description="Visualize your Google Timeline data on an interactive map"
    >
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
