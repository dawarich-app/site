import React, { useState, useCallback } from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import FormatConverter from '@site/src/components/FormatConverter';
import { parseKML } from '@site/src/utils/formatParsers';
import { parseKMZ, toGeoJSON } from '@site/src/utils/formatConverters';
import styles from './converter.module.css';

const pageTitle = "Free KMZ to GeoJSON Converter - Extract and Convert Google Earth Files";
const pageDescription = "Convert KMZ files to GeoJSON format instantly. Free, privacy-first online converter. Works entirely in your browser - no upload required.";
const pageUrl = "https://dawarich.app/tools/kmz-to-geojson";
const imageUrl = "https://dawarich.app/img/meta-image.jpg";

export default function KMZToGeoJSON() {
  const [isConverting, setIsConverting] = useState(false);
  const [converted, setConverted] = useState(false);

  const handleConvert = useCallback(async (file) => {
    setIsConverting(true);
    setConverted(false);

    try {
      const kmlText = await parseKMZ(file);
      const points = parseKML(kmlText);
      const geojson = toGeoJSON(points);

      const blob = new Blob([geojson], { type: 'application/geo+json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name.replace(/\.kmz$/i, '.geojson');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setConverted(true);
    } catch (error) {
      console.error('Conversion error:', error);
      alert('Error converting file. Please ensure it is a valid KMZ file.');
    } finally {
      setIsConverting(false);
    }
  }, []);

  return (
    <Layout title={pageTitle} description={pageDescription}>
      <Head>
        <meta name="title" content={pageTitle} />
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="KMZ to GeoJSON, KMZ converter, GeoJSON converter, Google Earth to web, extract KMZ" />
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
            "name": "KMZ to GeoJSON Converter",
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
            <h1>KMZ to GeoJSON Converter</h1>
            <p>Convert your KMZ files to GeoJSON format instantly. All processing happens in your browser.</p>
          </div>
          <div className={styles.mainContent}>
            <div className={styles.converterSection}>
              <FormatConverter fromFormat="KMZ" toFormat="GeoJSON" onConvert={handleConvert} isConverting={isConverting} />
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
                <h2>About KMZ Format</h2>
                <p>KMZ is a compressed version of KML files, used by Google Earth to package geographic data efficiently.</p>
              </div>
              <div className={styles.infoCard}>
                <h2>About GeoJSON Format</h2>
                <p>GeoJSON is a JSON-based format widely supported by web mapping libraries and modern GIS applications.</p>
              </div>
              <div className={styles.infoCard}>
                <h2>Why Convert KMZ to GeoJSON?</h2>
                <ul>
                  <li>Better support in web mapping libraries (Leaflet, Mapbox)</li>
                  <li>Easier to parse in JavaScript applications</li>
                  <li>Use Google Earth data in web applications</li>
                  <li>Native JSON structure for modern web APIs</li>
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
              <a href="/?utm_source=converter&utm_medium=cta&utm_campaign=kmz-to-geojson" className={styles.ctaButton}>Explore Dawarich</a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
