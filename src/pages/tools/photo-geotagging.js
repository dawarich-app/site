import React, { useState, useCallback } from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import PhotoUploader from '@site/src/components/PhotoUploader';
import PhotoMap from '@site/src/components/PhotoMap';
import PhotoList from '@site/src/components/PhotoList';
import { extractPhotoGeodata } from '@site/src/utils/exifParser';
import { generateGPX } from '@site/src/utils/gpxGenerator';
import PersonalizedCTA from '@site/src/components/PersonalizedCTA';
import RelatedTools from '@site/src/components/RelatedTools';
import { interpolate } from '@docusaurus/Interpolate';
import RichText from '@site/src/i18n/RichText';
import { useLocalizedUrl } from '@site/src/i18n/useLocalizedUrl';
import content from '@locale-content/tools/photo-geotagging.json';
import styles from './photo-geotagging.module.css';
import { useHtmlLang } from '@site/src/i18n/useHtmlLang';

const pageTitle = content.meta.title;
const pageDescription = content.meta.description;
const imageUrl = "https://dawarich.app/img/meta-image.png";

export default function PhotoGeotagging() {
  const htmlLang = useHtmlLang();
  const pageUrl = useLocalizedUrl('/tools/photo-geotagging/');
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
      alert(content.emptyExport);
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
        <meta name="keywords" content={content.meta.keywords} />

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
        <meta name="language" content={htmlLang} />
        <meta name="revisit-after" content="7 days" />

        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": content.h1,
            "url": pageUrl,
            "description": pageDescription,
            "applicationCategory": "UtilityApplication",
            "operatingSystem": "Any",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "featureList": content.meta.featureList
          })}
        </script>
      </Head>
      <main>
      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          <div className={styles.header}>
            <h1>{content.h1}</h1>
            <p>{content.intro}</p>
          </div>

          <div className={styles.topSection}>
            <div className={styles.instructions}>
              <h2>{content.howTo.title}</h2>
              <p>
                {content.howTo.intro}
              </p>
              <div className={styles.instructionsList}>
                <div className={styles.instructionItem}>
                  <strong>{content.howTo.features[0].title}</strong>
                  <p>{content.howTo.features[0].body}</p>
                </div>
                <div className={styles.instructionItem}>
                  <strong>{content.howTo.features[1].title}</strong>
                  <p>{content.howTo.features[1].body}</p>
                </div>
                <div className={styles.instructionItem}>
                  <strong>{content.howTo.features[2].title}</strong>
                  <p>{content.howTo.features[2].body}</p>
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
                    {content.privacy.title}
                  </strong>
                  <p>{content.privacy.body}</p>
                </div>
              </div>
            </div>
          </div>

          {uploadedPhotos.length > 0 && (
            <PersonalizedCTA
              toolName="photo-geotagging"
              headline={points.length > 0
                ? <RichText text={interpolate(content.results.extracted, { count: points.length.toLocaleString(htmlLang) })} />
                : <RichText text={interpolate(content.results.uploaded, { count: uploadedPhotos.length.toLocaleString(htmlLang) })} />}
              stats={points.length > 0 ? [
                { label: content.gpsPhotosLabel, value: points.length.toLocaleString(htmlLang) },
              ] : [
                { label: content.photosLabel, value: uploadedPhotos.length.toLocaleString(htmlLang) },
              ]}
            />
          )}
        </div>

        <div className={styles.mapSection}>
          {points.length > 0 && (
            <div className={styles.filterSection}>
              <span className={styles.filterLabel}>
                {interpolate(content.results.gpsPhotos, { count: points.length.toLocaleString(htmlLang) })}
              </span>
              <button
                onClick={handleExportGPX}
                className={styles.ctaButton}
                style={{ marginLeft: 'auto', padding: '0.5rem 1.5rem' }}
              >
                {content.exportButton}
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
        <RelatedTools slug="photo-geotagging" />
      </main>
    </Layout>
  );
}
