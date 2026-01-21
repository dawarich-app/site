import React, { useState, useCallback } from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import FormatConverter from '@site/src/components/FormatConverter';
import { parseTCX, getTCXMetadata } from '@site/src/utils/tcxParser';
import { toGPX } from '@site/src/utils/formatConverters';
import styles from './converter.module.css';

const pageTitle = "Free TCX to GPX Converter - Convert Training Center XML Files Online";
const pageDescription = "Convert TCX files to GPX format instantly. Free, privacy-first online converter for Garmin, Wahoo, and fitness device activities. Works entirely in your browser - no upload required.";
const pageUrl = "https://dawarich.app/tools/tcx-to-gpx";
const imageUrl = "https://dawarich.app/img/meta-image.jpg";

export default function TCXToGPX() {
  const [isConverting, setIsConverting] = useState(false);
  const [converted, setConverted] = useState(false);
  const [stats, setStats] = useState(null);

  const handleConvert = useCallback(async (file) => {
    setIsConverting(true);
    setConverted(false);
    setStats(null);

    try {
      const text = await file.text();
      const points = parseTCX(text);
      const metadata = getTCXMetadata(text);

      if (points.length === 0) {
        throw new Error('No GPS data found in TCX file. The file may contain only sensor data without GPS coordinates.');
      }

      // Show stats
      const trackpoints = points.filter(p => p.type === 'trackpoint');
      setStats({
        points: trackpoints.length,
        sport: metadata.sport,
        distance: metadata.totalDistance ? (metadata.totalDistance / 1000).toFixed(2) : null,
        duration: metadata.totalTime ? formatDuration(metadata.totalTime) : null,
        avgHR: metadata.avgHeartRate,
      });

      const gpx = toGPX(points, {
        name: metadata.name || file.name.replace(/\.tcx$/i, ''),
        description: metadata.description,
      });

      // Download the result
      const blob = new Blob([gpx], { type: 'application/gpx+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name.replace(/\.tcx$/i, '.gpx');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setConverted(true);
    } catch (error) {
      console.error('Conversion error:', error);
      alert('Error converting file: ' + error.message);
    } finally {
      setIsConverting(false);
    }
  }, []);

  return (
    <Layout title={pageTitle} description={pageDescription}>
      <Head>
        <meta name="title" content={pageTitle} />
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="TCX to GPX, TCX converter, Training Center XML, Garmin TCX, Wahoo TCX, fitness file converter, cycling GPX, running GPX, activity converter" />
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
            "name": "TCX to GPX Converter",
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
        <div className={styles.contentWrapper}>
          <div className={styles.header}>
            <h1>TCX to GPX Converter</h1>
            <p>Convert your TCX (Training Center XML) files to GPX format instantly. All processing happens in your browser - your fitness data never leaves your device.</p>
          </div>

          <div className={styles.mainContent}>
            <div className={styles.converterSection}>
              <FormatConverter
                fromFormat="TCX"
                toFormat="GPX"
                onConvert={handleConvert}
                isConverting={isConverting}
              />

              {converted && (
                <div className={styles.successMessage}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p>File converted successfully! Your download should start automatically.</p>
                    {stats && (
                      <p className={styles.statsText}>
                        {stats.sport && <span>Activity: {stats.sport}</span>}
                        {stats.points > 0 && <span> | {stats.points.toLocaleString()} GPS points</span>}
                        {stats.distance && <span> | {stats.distance} km</span>}
                        {stats.duration && <span> | {stats.duration}</span>}
                        {stats.avgHR && <span> | Avg HR: {stats.avgHR} bpm</span>}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className={styles.infoSection}>
              <div className={styles.infoCard}>
                <h2>About TCX Format</h2>
                <p>TCX (Training Center XML) is Garmin's XML-based format for fitness activities. It's widely used by Garmin Connect, Wahoo, Polar, and many other fitness platforms to store workouts with GPS data, heart rate, cadence, and power metrics.</p>
              </div>

              <div className={styles.infoCard}>
                <h2>About GPX Format</h2>
                <p>GPX (GPS Exchange Format) is an open XML standard for GPS data. It's universally supported by fitness platforms, mapping software, and navigation apps, making it the most portable format for GPS tracks.</p>
              </div>

              <div className={styles.infoCard}>
                <h2>Why Convert TCX to GPX?</h2>
                <ul>
                  <li>Import activities into platforms that don't support TCX</li>
                  <li>Share routes with users on different fitness platforms</li>
                  <li>View tracks in Google Earth, QGIS, or other mapping tools</li>
                  <li>Create backups in a universally supported format</li>
                  <li>Combine or edit tracks using GPX-compatible tools</li>
                </ul>
              </div>

              <div className={styles.infoCard}>
                <h2>Compatible Platforms</h2>
                <p>TCX files from these platforms work with this converter:</p>
                <ul>
                  <li>Garmin Connect exports</li>
                  <li>Wahoo ELEMNT and TICKR</li>
                  <li>Polar Flow exports</li>
                  <li>Strava TCX exports</li>
                  <li>TrainingPeaks</li>
                  <li>Zwift activity exports</li>
                  <li>Any app that exports standard TCX</li>
                </ul>
              </div>

              <div className={styles.infoCard}>
                <h2>What Data Is Preserved?</h2>
                <p>The converter preserves:</p>
                <ul>
                  <li>GPS coordinates (latitude, longitude)</li>
                  <li>Timestamps</li>
                  <li>Elevation/altitude data</li>
                  <li>Lap markers (as waypoints)</li>
                  <li>Activity metadata (sport, distance, etc.)</li>
                </ul>
                <p className={styles.noteText}>Note: Heart rate, cadence, and power data are read but not included in standard GPX output as they require GPX extensions.</p>
              </div>

              <div className={styles.privacyCard}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <div>
                  <strong>Privacy First</strong>
                  <p>All conversion happens entirely in your browser. Your fitness data never leaves your device and is not sent to any server.</p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.ctaPanel}>
            <div className={styles.ctaContent}>
              <h3>Track and visualize all your activities in one place</h3>
              <p>Try Dawarich - a self-hosted location tracking platform that imports your Garmin, Strava, and other fitness data to create a complete picture of your movements over time.</p>
              <a href="/?utm_source=converter&utm_medium=cta&utm_campaign=tcx-to-gpx" className={styles.ctaButton}>Explore Dawarich</a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

/**
 * Format duration in seconds to human readable string
 */
function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
}
