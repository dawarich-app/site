import React, { useState, useCallback } from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import { interpolate } from '@docusaurus/Interpolate';
import RichText from '@site/src/i18n/RichText';
import { useLocalizedUrl } from '@site/src/i18n/useLocalizedUrl';
import content from '@locale-content/tools/geojson-to-kmz.json';
import shared from '@locale-content/shared/converter.json';
import FormatConverter from '@site/src/components/FormatConverter';
import { parseGeoJSON } from '@site/src/utils/formatParsers';
import { toKMZ } from '@site/src/utils/formatConverters';
import PersonalizedCTA from '@site/src/components/PersonalizedCTA';
import RelatedTools from '@site/src/components/RelatedTools';
import styles from './converter.module.css';

const imageUrl = "https://dawarich.app/img/meta-image.png";

export default function GeoJSONToKMZ() {
  const pageUrl = useLocalizedUrl('/tools/geojson-to-kmz/');
  const [isConverting, setIsConverting] = useState(false);
  const [converted, setConverted] = useState(false);

  const handleConvert = useCallback(async (file) => {
    setIsConverting(true);
    setConverted(false);

    try {
      const text = await file.text();
      const points = parseGeoJSON(text);
      const kmzBlob = await toKMZ(points, { name: file.name.replace(/\.(geojson|json)$/i, '') });

      const url = URL.createObjectURL(kmzBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name.replace(/\.(geojson|json)$/i, '.kmz');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setConverted(true);
    } catch (error) {
      console.error('Conversion error:', error);
      alert(interpolate(shared.invalidFile, { format: 'GeoJSON' }));
    } finally {
      setIsConverting(false);
    }
  }, []);

  return (
    <Layout title={content.meta.title} description={content.meta.description}>
      <Head>
        <meta name="title" content={content.meta.title} />
        <meta name="description" content={content.meta.description} />
        <meta name="keywords" content={content.meta.keywords} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content={content.meta.title} />
        <meta property="og:description" content={content.meta.description} />
        <meta property="og:image" content={imageUrl} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": content.meta.appName,
            "url": pageUrl,
            "description": content.meta.description,
            "applicationCategory": "UtilityApplication",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" }
          })}
        </script>
      </Head>
      <main>
      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          <div className={styles.header}>
            <h1>{content.h1}</h1>
            <p><RichText text={content.intro} /></p>
          </div>
          <div className={styles.mainContent}>
            <div className={styles.converterSection}>
              <FormatConverter fromFormat="GeoJSON" toFormat="KMZ" onConvert={handleConvert} isConverting={isConverting} />
              {converted && (
                <div className={styles.successMessage}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p><RichText text={shared.success} /></p>
                </div>
              )}
            </div>
            <div className={styles.infoSection}>
              <div className={styles.infoCard}>
                <h2>{content.cards[0].title}</h2>
                <p><RichText text={content.cards[0].body} /></p>
              </div>
              <div className={styles.infoCard}>
                <h2>{content.cards[1].title}</h2>
                <p><RichText text={content.cards[1].body} /></p>
              </div>
              <div className={styles.infoCard}>
                <h2>{content.cards[2].title}</h2>
                <ul>
                  <li><RichText text={content.cards[2].items[0]} /></li>
                  <li><RichText text={content.cards[2].items[1]} /></li>
                  <li><RichText text={content.cards[2].items[2]} /></li>
                  <li><RichText text={content.cards[2].items[3]} /></li>
                </ul>
              </div>
              <div className={styles.privacyCard}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <div>
                  <strong>{shared.privacyTitle}</strong>
                  <p><RichText text={content.privacyBody} /></p>
                </div>
              </div>
            </div>
          </div>
          <PersonalizedCTA
            toolName="geojson-to-kmz"
            headline={shared.ctaHeadline}
          />
        </div>
      </div>
        <RelatedTools slug="geojson-to-kmz" />
      </main>
    </Layout>
  );
}
