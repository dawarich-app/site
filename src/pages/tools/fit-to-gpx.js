import React, { useState, useCallback } from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import FormatConverter from '@site/src/components/FormatConverter';
import { parseFIT, getFITMetadata } from '@site/src/utils/fitParser';
import { toGPX } from '@site/src/utils/formatConverters';
import styles from './converter.module.css';

const pageTitle = "Free FIT to GPX Converter - Convert Garmin Activity Files Online";
const pageDescription = "Convert Garmin FIT files to GPX format instantly. Free, privacy-first online converter for cycling, running, and fitness activities. Works entirely in your browser - no upload required.";
const pageUrl = "https://dawarich.app/tools/fit-to-gpx";
const imageUrl = "https://dawarich.app/img/meta-image.jpg";

export default function FITToGPX() {
  const [isConverting, setIsConverting] = useState(false);
  const [converted, setConverted] = useState(false);
  const [stats, setStats] = useState(null);

  const handleConvert = useCallback(async (file) => {
    setIsConverting(true);
    setConverted(false);
    setStats(null);

    try {
      const buffer = await file.arrayBuffer();
      const [points, metadata] = await Promise.all([
        parseFIT(buffer),
        getFITMetadata(buffer),
      ]);

      if (points.length === 0) {
        throw new Error('No GPS data found in FIT file. The file may be corrupted or contain only sensor data without GPS coordinates.');
      }

      // Show stats
      const trackpoints = points.filter(p => p.type === 'trackpoint');
      setStats({
        points: trackpoints.length,
        sport: metadata.sport,
        distance: metadata.totalDistance ? (metadata.totalDistance / 1000).toFixed(2) : null,
        elevation: metadata.totalAscent,
        duration: metadata.totalTime ? formatDuration(metadata.totalTime) : null,
      });

      const gpx = toGPX(points, {
        name: metadata.name || file.name.replace(/\.fit$/i, ''),
        description: metadata.description,
      });

      // Download the result
      const blob = new Blob([gpx], { type: 'application/gpx+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name.replace(/\.fit$/i, '.gpx');
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
        <meta name="keywords" content="FIT to GPX, FIT converter, Garmin converter, Garmin FIT to GPX, fitness file converter, cycling GPX, running GPX, activity converter, Garmin watch converter, Garmin Edge converter" />
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
            "name": "FIT to GPX Converter",
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
            <h1>FIT to GPX Converter</h1>
            <p>Convert your Garmin FIT activity files to GPX format instantly. All processing happens in your browser - your fitness data never leaves your device.</p>
          </div>

          <div className={styles.mainContent}>
            <div className={styles.converterSection}>
              <FormatConverter
                fromFormat="FIT"
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
                        {stats.elevation && <span> | {stats.elevation}m elevation gain</span>}
                        {stats.duration && <span> | {stats.duration}</span>}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className={styles.infoSection}>
              <div className={styles.infoCard}>
                <h2>About FIT Format</h2>
                <p>FIT (Flexible and Interoperable Data Transfer) is Garmin's proprietary binary format for storing fitness and activity data. It's used by Garmin watches, bike computers, and other fitness devices to store workouts, routes, heart rate, power, and other metrics.</p>
              </div>

              <div className={styles.infoCard}>
                <h2>About GPX Format</h2>
                <p>GPX (GPS Exchange Format) is an open XML standard for GPS data. It's widely supported by fitness platforms (Strava, Komoot), mapping software (Google Earth, QGIS), and navigation apps.</p>
              </div>

              <div className={styles.infoCard}>
                <h2>Why Convert FIT to GPX?</h2>
                <ul>
                  <li>Import activities into platforms that don't support FIT files</li>
                  <li>Share routes with users on different platforms</li>
                  <li>View your data in mapping software like Google Earth</li>
                  <li>Create backups in an open, human-readable format</li>
                  <li>Edit or combine activities using GPX-compatible tools</li>
                </ul>
              </div>

              <div className={styles.infoCard}>
                <h2>Supported Devices</h2>
                <p>This converter works with FIT files from:</p>
                <ul>
                  <li>Garmin watches (Forerunner, Fenix, Venu, Instinct, Enduro)</li>
                  <li>Garmin bike computers (Edge series)</li>
                  <li>Wahoo devices (ELEMNT, TICKR)</li>
                  <li>Zwift exports</li>
                  <li>Bryton bike computers</li>
                  <li>Suunto devices (via FIT export)</li>
                  <li>Any device that exports standard FIT files</li>
                </ul>
              </div>

              <div className={styles.infoCard}>
                <h2>What Data Is Preserved?</h2>
                <p>The converter preserves:</p>
                <ul>
                  <li>GPS coordinates (latitude, longitude)</li>
                  <li>Timestamps</li>
                  <li>Elevation data</li>
                  <li>Lap markers (as waypoints)</li>
                  <li>Activity metadata (sport type, distance, etc.)</li>
                </ul>
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
              <a href="/?utm_source=converter&utm_medium=cta&utm_campaign=fit-to-gpx" className={styles.ctaButton}>Explore Dawarich</a>
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
