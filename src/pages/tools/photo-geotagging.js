import React, { useState, useCallback } from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import PhotoUploader from '@site/src/components/PhotoUploader';
import PhotoMap from '@site/src/components/PhotoMap';
import PhotoList from '@site/src/components/PhotoList';
import { extractPhotoGeodata } from '@site/src/utils/exifParser';
import { generateGPX } from '@site/src/utils/gpxGenerator';
import styles from './timeline-visualizer.module.css';

const pageTitle = "Photo Geodata Extraction - Extract GPS Data from Photos";
const pageDescription = "Free, privacy-first tool to extract GPS coordinates from your photos and export them as GPX files. All data processing happens in your browser - no data is sent to any server.";
const pageUrl = "https://dawarich.app/tools/photo-geotagging";
const imageUrl = "https://dawarich.app/img/meta-image.jpg";

export default function PhotoGeotagging() {
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [points, setPoints] = useState([]);

  const handlePhotosLoaded = useCallback(async (files) => {
    const photoPoints = [];
    const processedPhotos = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      try {
        const geodata = await extractPhotoGeodata(file);

        if (geodata) {
          // Create object URL for the full photo
          const imageUrl = URL.createObjectURL(file);

          const point = {
            id: `photo-${i}`,
            lat: geodata.latitude,
            lng: geodata.longitude,
            altitude: geodata.altitude,
            timestamp: geodata.timestamp,
            filename: file.name,
            thumbnail: geodata.thumbnail,
            imageUrl: imageUrl,
          };

          photoPoints.push(point);
          processedPhotos.push({
            ...point,
            file: file
          });
        } else {
          console.log(`[Photo Geotagging] ✗ No GPS data found`);
        }
      } catch (error) {
        console.error(`[Photo Geotagging] ✗ Error processing ${file.name}:`, error);
      }
    }

    setPoints(photoPoints);
    setUploadedPhotos(processedPhotos);
  }, []);

  const handleClear = useCallback(() => {
    setUploadedPhotos([]);
    setSelectedPhoto(null);
    setPoints([]);
  }, []);

  const handlePointClick = useCallback((point) => {
    setSelectedPhoto(point);
  }, []);

  const handleExportGPX = useCallback(() => {
    if (points.length === 0) {
      alert('No photos with GPS data to export');
      return;
    }

    const gpxContent = generateGPX(points);
    const blob = new Blob([gpxContent], { type: 'application/gpx+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dawarich-photo-locations-${new Date().toISOString().split('T')[0]}.gpx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [points]);

  return (
    <Layout
      title={pageTitle}
      description={pageDescription}
    >
      <Head>
        {/* Primary Meta Tags */}
        <meta name="title" content={pageTitle} />
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="photo geodata extraction, GPS, EXIF, geolocation, GPX export, photo location, privacy-first, image metadata" />
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
            "name": "Photo Geodata Extraction",
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
              "Extract GPS data from photos",
              "Interactive map with photo markers",
              "Privacy-first - all processing in browser",
              "Export locations as GPX files",
              "No data sent to servers"
            ]
          })}
        </script>
      </Head>
      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          <div className={styles.header}>
            <h1>Photo Geodata Extraction</h1>
            <p>Upload your photos to extract GPS coordinates from EXIF metadata, visualize them on a map, and export as GPX files.</p>
          </div>

          <div className={styles.topSection}>
            <div className={styles.instructions}>
              <h2>How It Works</h2>
              <p>
                This tool reads EXIF metadata from your photos to extract GPS coordinates. Most smartphones automatically embed location data in photos.
              </p>
              <div className={styles.instructionsList}>
                <div className={styles.instructionItem}>
                  <strong>Supported formats:</strong>
                  <p>JPEG, PNG, HEIC, and other image formats with EXIF data</p>
                </div>
                <div className={styles.instructionItem}>
                  <strong>What you'll get:</strong>
                  <p>Interactive map showing photo locations, detailed GPS data, and GPX export for GPS devices</p>
                </div>
                <div className={styles.instructionItem}>
                  <strong>Note:</strong>
                  <p>Only photos with GPS data will appear on the map. Screenshots and edited photos may not contain location data.</p>
                </div>
              </div>
            </div>

            <div className={styles.uploaderWrapper}>
              <PhotoUploader onPhotosLoaded={handlePhotosLoaded} onClear={handleClear} />

              <div className={styles.privacyNote}>
                <div>
                  <strong>
                    <svg className={styles.privacyIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Privacy First
                  </strong>
                  <p>All photo processing happens entirely in your browser. Your photos and location data never leave your device and are not sent to any server.</p>
                </div>
              </div>
            </div>
          </div>

          {uploadedPhotos.length > 0 && (
            <div className={styles.ctaPanel}>
              <div className={styles.ctaContent}>
                <h3>Want to keep tracking your location and build your own location history?</h3>
                <p>Try Dawarich — a self-hosted location tracking platform that gives you full control over your data</p>
                <a href="/" className={styles.ctaButton}>Try Dawarich!</a>
              </div>
            </div>
          )}
        </div>

        <div className={styles.mapSection}>
          {points.length > 0 && (
            <div className={styles.filterSection}>
              <span className={styles.filterLabel}>
                Photos with GPS data: {points.length}
              </span>
              <button
                onClick={handleExportGPX}
                className={styles.ctaButton}
                style={{ marginLeft: 'auto', padding: '0.5rem 1.5rem' }}
              >
                Export as GPX
              </button>
            </div>
          )}

          <div className={styles.mapGrid}>
            <div className={styles.mapColumn}>
              <PhotoMap
                points={points}
                onPointClick={handlePointClick}
                selectedPointId={selectedPhoto?.id}
              />
            </div>

            <div className={styles.listColumn}>
              <PhotoList
                photos={points}
                selectedPhotoId={selectedPhoto?.id}
                onPhotoSelect={handlePointClick}
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
