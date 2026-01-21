import React, { useState, useCallback } from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import FormatConverter from '@site/src/components/FormatConverter';
import { parseFIT, getFITMetadata } from '@site/src/utils/fitParser';
import { toKML } from '@site/src/utils/formatConverters';
import styles from './converter.module.css';

const pageTitle = "Free FIT to KML Converter - Convert Garmin Files to Google Earth Online";
const pageDescription = "Convert Garmin FIT files to KML format instantly. Free, privacy-first online converter for viewing fitness activities in Google Earth. Works entirely in your browser.";
const pageUrl = "https://dawarich.app/tools/fit-to-kml";
const imageUrl = "https://dawarich.app/img/meta-image.jpg";

export default function FITToKML() {
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
        throw new Error('No GPS data found in FIT file.');
      }

      const trackpoints = points.filter(p => p.type === 'trackpoint');
      setStats({
        points: trackpoints.length,
        sport: metadata.sport,
        distance: metadata.totalDistance ? (metadata.totalDistance / 1000).toFixed(2) : null,
      });

      const kml = toKML(points, {
        name: metadata.name || file.name.replace(/\.fit$/i, ''),
        description: metadata.description,
      });

      const blob = new Blob([kml], { type: 'application/vnd.google-earth.kml+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name.replace(/\.fit$/i, '.kml');
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
        <meta name="keywords" content="FIT to KML, Garmin to Google Earth, FIT converter, Google Earth, KML converter, fitness file converter, view Garmin in Google Earth" />
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
            "name": "FIT to KML Converter",
            "url": pageUrl,
            "description": pageDescription,
            "applicationCategory": "UtilityApplication",
            "operatingSystem": "Any",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
          })}
        </script>
      </Head>

      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          <div className={styles.header}>
            <h1>FIT to KML Converter</h1>
            <p>Convert your Garmin FIT files to KML format for viewing in Google Earth. All processing happens in your browser.</p>
          </div>

          <div className={styles.mainContent}>
            <div className={styles.converterSection}>
              <FormatConverter
                fromFormat="FIT"
                toFormat="KML"
                onConvert={handleConvert}
                isConverting={isConverting}
              />

              {converted && (
                <div className={styles.successMessage}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p>File converted successfully!</p>
                    {stats && (
                      <p className={styles.statsText}>
                        {stats.sport && <span>Activity: {stats.sport}</span>}
                        {stats.points > 0 && <span> | {stats.points.toLocaleString()} points</span>}
                        {stats.distance && <span> | {stats.distance} km</span>}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className={styles.infoSection}>
              <div className={styles.infoCard}>
                <h2>About KML Format</h2>
                <p>KML (Keyhole Markup Language) is Google's XML format for geographic data. It's used by Google Earth, Google Maps, and many other mapping applications to display points, paths, and polygons.</p>
              </div>

              <div className={styles.infoCard}>
                <h2>Why Convert FIT to KML?</h2>
                <ul>
                  <li>View your activities in Google Earth</li>
                  <li>Explore routes in 3D terrain view</li>
                  <li>Share tracks that open directly in Google Earth</li>
                  <li>Import into Google My Maps</li>
                  <li>Use with other KML-compatible applications</li>
                </ul>
              </div>

              <div className={styles.privacyCard}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <div>
                  <strong>Privacy First</strong>
                  <p>All conversion happens in your browser. Your data never leaves your device.</p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.ctaPanel}>
            <div className={styles.ctaContent}>
              <h3>Need to visualize all your GPS data?</h3>
              <p>Try Dawarich - a self-hosted platform that imports and visualizes your location history from multiple sources.</p>
              <a href="/?utm_source=converter&utm_medium=cta&utm_campaign=fit-to-kml" className={styles.ctaButton}>Explore Dawarich</a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
