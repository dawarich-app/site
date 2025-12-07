import React, { useState, useCallback } from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import FormatConverter from '@site/src/components/FormatConverter';
import { parseGeoJSON } from '@site/src/utils/formatParsers';
import { toGPX } from '@site/src/utils/formatConverters';
import styles from './converter.module.css';

const pageTitle = "Free GeoJSON to GPX Converter - Convert Geographic Data Online";
const pageDescription = "Convert GeoJSON files to GPX format instantly. Free, privacy-first online converter for geographic data. Works entirely in your browser - no upload required.";
const pageUrl = "https://dawarich.app/tools/geojson-to-gpx";
const imageUrl = "https://dawarich.app/img/meta-image.jpg";

export default function GeoJSONToGPX() {
  const [isConverting, setIsConverting] = useState(false);
  const [converted, setConverted] = useState(false);

  const handleConvert = useCallback(async (file) => {
    setIsConverting(true);
    setConverted(false);

    try {
      const text = await file.text();
      const points = parseGeoJSON(text);
      const gpx = toGPX(points, { name: file.name.replace(/\.(geojson|json)$/i, '') });

      const blob = new Blob([gpx], { type: 'application/gpx+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name.replace(/\.(geojson|json)$/i, '.gpx');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setConverted(true);
    } catch (error) {
      console.error('Conversion error:', error);
      alert('Error converting file. Please ensure it is a valid GeoJSON file.');
    } finally {
      setIsConverting(false);
    }
  }, []);

  return (
    <Layout title={pageTitle} description={pageDescription}>
      <Head>
        <meta name="title" content={pageTitle} />
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="GeoJSON to GPX, GeoJSON converter, GPX converter, geographic data converter, GPS converter" />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={imageUrl} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "GeoJSON to GPX Converter",
            "url": pageUrl,
            "description": pageDescription,
            "applicationCategory": "UtilityApplication",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
          })}
        </script>
      </Head>
      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          <div className={styles.header}>
            <h1>GeoJSON to GPX Converter</h1>
            <p>Convert your GeoJSON files to GPX format instantly. All processing happens in your browser - your data never leaves your device.</p>
          </div>
          <div className={styles.mainContent}>
            <div className={styles.converterSection}>
              <FormatConverter fromFormat="GeoJSON" toFormat="GPX" onConvert={handleConvert} isConverting={isConverting} />
              {converted && (
                <div className={styles.successMessage}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>File converted successfully! Your download should start automatically.</p>
                </div>
              )}
            </div>
            <div className={styles.infoSection}>
              <div className={styles.infoCard}>
                <h2>About GeoJSON Format</h2>
                <p>GeoJSON is a JSON-based format for encoding geographic data structures, widely used in web mapping applications.</p>
              </div>
              <div className={styles.infoCard}>
                <h2>About GPX Format</h2>
                <p>GPX (GPS Exchange Format) is the standard XML format for GPS data, supported by most GPS devices and fitness trackers.</p>
              </div>
              <div className={styles.infoCard}>
                <h2>Why Convert GeoJSON to GPX?</h2>
                <ul>
                  <li>Import web-based map data into GPS devices</li>
                  <li>Use with fitness tracking apps and devices</li>
                  <li>Compatible with Garmin, Suunto, and other GPS devices</li>
                  <li>Standard format for outdoor navigation</li>
                </ul>
              </div>
              <div className={styles.privacyCard}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <div>
                  <strong>Privacy First</strong>
                  <p>All conversion happens entirely in your browser. Your data never leaves your device.</p>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.ctaPanel}>
            <div className={styles.ctaContent}>
              <h3>Need more powerful GPS data management?</h3>
              <p>Try Dawarich — a self-hosted location tracking platform with advanced visualization tools.</p>
              <a href="/?utm_source=converter&utm_medium=cta&utm_campaign=geojson-to-gpx" className={styles.ctaButton}>Explore Dawarich</a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
