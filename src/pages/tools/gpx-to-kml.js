import React, { useState, useCallback } from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import { interpolate } from '@docusaurus/Interpolate';
import RichText from '@site/src/i18n/RichText';
import { useLocalizedUrl } from '@site/src/i18n/useLocalizedUrl';
import content from '@locale-content/tools/gpx-to-kml.json';
import shared from '@locale-content/shared/converter.json';
import FormatConverter from '@site/src/components/FormatConverter';
import { parseGPX } from '@site/src/utils/formatParsers';
import { toKML } from '@site/src/utils/formatConverters';
import PersonalizedCTA from '@site/src/components/PersonalizedCTA';
import RelatedTools from '@site/src/components/RelatedTools';
import ToolGuide from '@site/src/components/ToolGuide';
import toolGuideContent from '@locale-content/tool-guides/gpx-to-kml.json';
import styles from './converter.module.css';

const imageUrl = "https://dawarich.app/img/meta-image.png";

export default function GPXToKML() {
  const pageUrl = useLocalizedUrl('/tools/gpx-to-kml/');
  const [isConverting, setIsConverting] = useState(false);
  const [converted, setConverted] = useState(false);

  const handleConvert = useCallback(async (file) => {
    setIsConverting(true);
    setConverted(false);

    try {
      const text = await file.text();
      const points = parseGPX(text);
      const kml = toKML(points, { name: file.name.replace(/\.gpx$/i, '') });

      const blob = new Blob([kml], { type: 'application/vnd.google-earth.kml+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name.replace(/\.gpx$/i, '.kml');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setConverted(true);
    } catch (error) {
      console.error('Conversion error:', error);
      alert(interpolate(shared.invalidFile, { format: 'GPX' }));
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
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={content.meta.title} />
        <meta name="twitter:description" content={content.meta.description} />
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
              <FormatConverter fromFormat="GPX" toFormat="KML" onConvert={handleConvert} isConverting={isConverting} />
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
            toolName="gpx-to-kml"
            headline={shared.ctaHeadline}
          />
        </div>
      </div>
      <ToolGuide slug="gpx-to-kml" title={content.h1} content={toolGuideContent} />
      <RelatedTools slug="gpx-to-kml" />
      </main>
    </Layout>
  );
}
