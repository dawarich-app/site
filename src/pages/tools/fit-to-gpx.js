import React, { useState, useCallback } from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import { interpolate } from '@docusaurus/Interpolate';
import RichText from '@site/src/i18n/RichText';
import { useLocalizedUrl } from '@site/src/i18n/useLocalizedUrl';
import content from '@locale-content/tools/fit-to-gpx.json';
import shared from '@locale-content/shared/converter.json';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import FormatConverter from '@site/src/components/FormatConverter';
import { parseFIT, getFITMetadata } from '@site/src/utils/fitParser';
import { toGPX } from '@site/src/utils/formatConverters';
import PersonalizedCTA from '@site/src/components/PersonalizedCTA';
import RelatedTools from '@site/src/components/RelatedTools';
import styles from './converter.module.css';

const imageUrl = "https://dawarich.app/img/meta-image.png";

export default function FITToGPX() {
  const pageUrl = useLocalizedUrl('/tools/fit-to-gpx/');
  const { i18n } = useDocusaurusContext();
  const htmlLang = i18n.localeConfigs[i18n.currentLocale].htmlLang;
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
        throw new Error(content.noGpsData);
      }

      // Show stats
      const trackpoints = points.filter(p => p.type === 'trackpoint');
      setStats({
        points: trackpoints.length,
        sport: metadata.sport,
        distance: metadata.totalDistance ? (metadata.totalDistance / 1000).toFixed(2) : null,
        elevation: metadata.totalAscent,
        duration: metadata.totalTime ? formatDuration(metadata.totalTime, htmlLang) : null,
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
      alert(interpolate(shared.conversionError, { message: error.message }));
    } finally {
      setIsConverting(false);
    }
  }, [htmlLang]);

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
        <meta name="twitter:url" content={pageUrl} />
        <meta name="twitter:title" content={content.meta.title} />
        <meta name="twitter:description" content={content.meta.description} />
        <meta name="twitter:image" content={imageUrl} />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": content.meta.appName,
            "url": pageUrl,
            "description": content.meta.description,
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
      <main>

      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          <div className={styles.header}>
            <h1>{content.h1}</h1>
            <p><RichText text={content.intro} /></p>
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
                    <p><RichText text={shared.success} /></p>
                    {stats && (
                      <p className={styles.statsText}>
                        {stats.sport && <span>{interpolate(shared.stats.activity, { sport: stats.sport })}</span>}
                        {stats.points > 0 && <span>{interpolate(shared.stats.gpsPoints, { points: stats.points.toLocaleString(htmlLang) })}</span>}
                        {stats.distance && <span>{interpolate(shared.stats.distance, { distance: Number(stats.distance).toLocaleString(htmlLang, { useGrouping: false, minimumFractionDigits: 2, maximumFractionDigits: 2 }) })}</span>}
                        {stats.elevation && <span>{interpolate(shared.stats.elevation, { elevation: stats.elevation.toLocaleString(htmlLang, { useGrouping: false, maximumFractionDigits: 20 }) })}</span>}
                        {stats.duration && <span>{interpolate(shared.stats.duration, { duration: stats.duration })}</span>}
                      </p>
                    )}
                  </div>
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
                  <li><RichText text={content.cards[2].items[4]} /></li>
                </ul>
              </div>

              <div className={styles.infoCard}>
                <h2>{content.cards[3].title}</h2>
                <p><RichText text={content.cards[3].body} /></p>
                <ul>
                  <li><RichText text={content.cards[3].items[0]} /></li>
                  <li><RichText text={content.cards[3].items[1]} /></li>
                  <li><RichText text={content.cards[3].items[2]} /></li>
                  <li><RichText text={content.cards[3].items[3]} /></li>
                  <li><RichText text={content.cards[3].items[4]} /></li>
                  <li><RichText text={content.cards[3].items[5]} /></li>
                  <li><RichText text={content.cards[3].items[6]} /></li>
                </ul>
              </div>

              <div className={styles.infoCard}>
                <h2>{content.cards[4].title}</h2>
                <p><RichText text={content.cards[4].body} /></p>
                <ul>
                  <li><RichText text={content.cards[4].items[0]} /></li>
                  <li><RichText text={content.cards[4].items[1]} /></li>
                  <li><RichText text={content.cards[4].items[2]} /></li>
                  <li><RichText text={content.cards[4].items[3]} /></li>
                  <li><RichText text={content.cards[4].items[4]} /></li>
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
            toolName="fit-to-gpx"
            headline={shared.ctaHeadline}
          />
        </div>
      </div>
        <RelatedTools slug="fit-to-gpx" />
      </main>
    </Layout>
  );
}

/**
 * Format duration in seconds to human readable string
 */
function formatDuration(seconds, htmlLang) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return interpolate(shared.duration.hours, { hours: hours.toLocaleString(htmlLang, { useGrouping: false }), minutes: minutes.toLocaleString(htmlLang), seconds: secs.toLocaleString(htmlLang) });
  } else if (minutes > 0) {
    return interpolate(shared.duration.minutes, { minutes: minutes.toLocaleString(htmlLang), seconds: secs.toLocaleString(htmlLang) });
  }
  return interpolate(shared.duration.seconds, { seconds: secs.toLocaleString(htmlLang) });
}
