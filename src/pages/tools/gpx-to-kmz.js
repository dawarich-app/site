import React, { useState, useCallback } from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import FormatConverter from '@site/src/components/FormatConverter';
import { parseGPX } from '@site/src/utils/formatParsers';
import { toKMZ } from '@site/src/utils/formatConverters';
import styles from './converter.module.css';

const pageTitle = "Free GPX to KMZ Converter - Convert GPS Track Files Online";
const pageDescription = "Convert GPX files to KMZ format instantly. Free, privacy-first online converter for GPS tracks. Works entirely in your browser - no upload required.";
const pageUrl = "https://dawarich.app/tools/gpx-to-kmz";
const imageUrl = "https://dawarich.app/img/meta-image.jpg";

export default function GPXToKMZ() {
  const [isConverting, setIsConverting] = useState(false);
  const [converted, setConverted] = useState(false);

  const handleConvert = useCallback(async (file) => {
    setIsConverting(true);
    setConverted(false);

    try {
      const text = await file.text();
      const points = parseGPX(text);
      const kmzBlob = await toKMZ(points, { name: file.name.replace(/\.gpx$/i, '') });

      const url = URL.createObjectURL(kmzBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name.replace(/\.gpx$/i, '.kmz');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setConverted(true);
    } catch (error) {
      console.error('Conversion error:', error);
      alert('Error converting file. Please ensure it is a valid GPX file.');
    } finally {
      setIsConverting(false);
    }
  }, []);

  return (
    <Layout title={pageTitle} description={pageDescription}>
      <Head>
        <meta name="title" content={pageTitle} />
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="GPX to KMZ, GPX converter, KMZ converter, GPS file converter, Google Earth converter, compressed KML" />
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
            "name": "GPX to KMZ Converter",
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
            <h1>GPX to KMZ Converter</h1>
            <p>Convert your GPX files to compressed KMZ format instantly. All processing happens in your browser.</p>
          </div>
          <div className={styles.mainContent}>
            <div className={styles.converterSection}>
              <FormatConverter fromFormat="GPX" toFormat="KMZ" onConvert={handleConvert} isConverting={isConverting} />
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
                <h2>About GPX Format</h2>
                <p>GPX is an XML-based format for GPS data, widely used by GPS devices and fitness tracking applications.</p>
              </div>
              <div className={styles.infoCard}>
                <h2>About KMZ Format</h2>
                <p>KMZ is a compressed version of KML (Keyhole Markup Language), reducing file size for easier sharing and faster loading in Google Earth.</p>
              </div>
              <div className={styles.infoCard}>
                <h2>Why Convert GPX to KMZ?</h2>
                <ul>
                  <li>Smaller file size compared to GPX and KML</li>
                  <li>Native support in Google Earth and Google Maps</li>
                  <li>Can include images and other resources in one file</li>
                  <li>Faster loading and easier to share</li>
                </ul>
              </div>
              <div className={styles.privacyCard}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <div>
                  <strong>Privacy First</strong>
                  <p>All conversion happens entirely in your browser. Your GPS data never leaves your device.</p>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.ctaPanel}>
            <div className={styles.ctaContent}>
              <h3>Need more powerful GPS data management?</h3>
              <p>Try Dawarich — a self-hosted location tracking platform with advanced visualization tools.</p>
              <a href="/?utm_source=converter&utm_medium=cta&utm_campaign=gpx-to-kmz" className={styles.ctaButton}>Explore Dawarich</a>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
