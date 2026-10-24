import React, { useState, useCallback } from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import FileUploader from '@site/src/components/FileUploader';
import StatsCard from '@site/src/components/StatsCard';
import ShareableCard from '@site/src/components/ShareableCard';
import { parseTimeline } from '@site/src/utils/timelineParser';
import { calculateTravelStats } from '@site/src/utils/timelineStats';
import PersonalizedCTA from '@site/src/components/PersonalizedCTA';
import RelatedTools from '@site/src/components/RelatedTools';
import { interpolate } from '@docusaurus/Interpolate';
import { usePluralForm } from '@docusaurus/theme-common';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import RichText, { SmartLink, toPlainText } from '@site/src/i18n/RichText';
import { useLocalizedUrl } from '@site/src/i18n/useLocalizedUrl';
import content from '@locale-content/tools/timeline-statistics.json';
import styles from './timeline-statistics.module.css';

const pageTitle = content.meta.title;
const pageDescription = content.meta.description;
const imageUrl = "https://dawarich.app/img/meta-image.png";

const ACTIVITY_LABELS = {
  'IN_PASSENGER_VEHICLE': content.activities.driving,
  'WALKING': content.activities.walking,
  'RUNNING': content.activities.running,
  'CYCLING': content.activities.cycling,
  'IN_BUS': content.activities.bus,
  'IN_TRAIN': content.activities.train,
  'IN_SUBWAY': content.activities.subway,
  'FLYING': content.activities.flying,
  'MOTORCYCLING': content.activities.motorcycle,
  'SKIING': content.activities.skiing,
  'SAILING': content.activities.sailing,
  'UNKNOWN': content.activities.unknown,
};

const ACTIVITY_COLORS = {
  'IN_PASSENGER_VEHICLE': '#3b82f6',
  'WALKING': '#10b981',
  'RUNNING': '#ef4444',
  'CYCLING': '#06b6d4',
  'IN_BUS': '#f59e0b',
  'IN_TRAIN': '#8b5cf6',
  'IN_SUBWAY': '#a855f7',
  'FLYING': '#6366f1',
  'MOTORCYCLING': '#ec4899',
  'SKIING': '#14b8a6',
  'SAILING': '#0ea5e9',
  'UNKNOWN': '#6b7280',
};

const faqItems = content.faq;

function formatNumber(num, htmlLang) {
  const decimal = (value) => value.toLocaleString(htmlLang, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  if (num >= 1000000) return interpolate(content.numbers.million, { count: decimal(num / 1000000) });
  if (num >= 1000) return interpolate(content.numbers.thousand, { count: decimal(num / 1000) });
  return num.toLocaleString(htmlLang);
}

function formatHours(hours, htmlLang, selectMessage) {
  const duration = (count, forms) => interpolate(selectMessage(count, forms), {
    count: count.toLocaleString(htmlLang, { minimumFractionDigits: 1, maximumFractionDigits: 1 }),
  });
  if (hours >= 8760) return duration(hours / 8760, content.duration.years);
  if (hours >= 720) return duration(hours / 720, content.duration.months);
  if (hours >= 24) return duration(hours / 24, content.duration.days);
  return duration(hours, content.duration.hours);
}

export default function TimelineStatistics() {
  const { i18n } = useDocusaurusContext();
  const htmlLang = i18n.localeConfigs[i18n.currentLocale].htmlLang;
  const { selectMessage } = usePluralForm();
  const pageUrl = useLocalizedUrl('/tools/timeline-statistics/');
  const homeUrl = useLocalizedUrl('/');
  const toolsUrl = useLocalizedUrl('/tools/');
  const formatDecimal = (value) => value.toLocaleString(htmlLang, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [stats, setStats] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFilesLoaded = useCallback(async (files) => {
    setUploadedFiles(files);
    setIsProcessing(true);

    const allPoints = [];
    const allPaths = [];

    for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
      const file = files[fileIndex];

      try {
        const parsed = parseTimeline(file.data);

        for (let i = 0; i < parsed.points.length; i++) {
          allPoints.push(parsed.points[i]);
        }
        for (let i = 0; i < parsed.paths.length; i++) {
          allPaths.push(parsed.paths[i]);
        }

        // Yield to browser to prevent freezing on large files
        await new Promise(resolve => setTimeout(resolve, 0));
      } catch (error) {
        console.error(`Error parsing ${file.filename}:`, error);
      }
    }

    if (allPoints.length > 0 || allPaths.length > 0) {
      const calculatedStats = calculateTravelStats(allPoints, allPaths);
      setStats(calculatedStats);
    }

    setIsProcessing(false);
  }, []);

  const handleClear = useCallback(() => {
    setUploadedFiles([]);
    setStats(null);
  }, []);

  // Compute derived chart data
  const yearlyData = stats ? Object.entries(stats.yearlyBreakdown)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([year, data]) => ({ year, ...data })) : [];

  const maxYearlyPoints = yearlyData.length > 0
    ? Math.max(...yearlyData.map(d => d.pointCount))
    : 0;

  const activityData = stats ? Object.entries(stats.activityDistribution)
    .sort(([, a], [, b]) => b.count - a.count)
    .map(([type, data]) => ({ type, label: ACTIVITY_LABELS[type] || type, ...data })) : [];

  const maxActivityCount = activityData.length > 0
    ? Math.max(...activityData.map(d => d.count))
    : 0;

  const dateRangeYears = stats && stats.dateRange
    ? formatDecimal((stats.dateRange.end - stats.dateRange.start) / (1000 * 60 * 60 * 24 * 365.25))
    : (0).toLocaleString(htmlLang);

  const travelingPercent = stats && stats.timeBreakdown
    ? (stats.timeBreakdown.travelingHours / (stats.timeBreakdown.travelingHours + stats.timeBreakdown.stationaryHours) * 100)
    : 0;

  const stationaryPercent = 100 - travelingPercent;

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

        {/* JSON-LD Structured Data - WebApplication */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": content.appName,
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

        {/* JSON-LD Structured Data - HowTo */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": content.howTo.name,
            "description": content.howTo.description,
            "step": [
              {
                "@type": "HowToStep",
                "name": content.howTo.steps[0].name,
                "text": content.howTo.steps[0].text
              },
              {
                "@type": "HowToStep",
                "name": content.howTo.steps[1].name,
                "text": content.howTo.steps[1].text
              },
              {
                "@type": "HowToStep",
                "name": content.howTo.steps[2].name,
                "text": content.howTo.steps[2].text
              }
            ],
            "tool": {
              "@type": "HowToTool",
              "name": content.howTo.tool
            }
          })}
        </script>

        {/* JSON-LD Structured Data - FAQPage */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqItems.map(item => ({
              "@type": "Question",
              "name": toPlainText(item.q),
              "acceptedAnswer": {
                "@type": "Answer",
                "text": toPlainText(item.a)
              }
            }))
          })}
        </script>

        {/* JSON-LD Structured Data - BreadcrumbList */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": content.homeLabel,
                "item": homeUrl
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": content.toolsLabel,
                "item": toolsUrl
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": content.appName,
                "item": pageUrl
              }
            ]
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
              <h2>{content.exportData.title}</h2>
              <p>
                {content.exportData.intro}
              </p>
              <div className={styles.instructionsList}>
                <div className={styles.instructionItem}>
                  <strong>{content.exportData.methods[0].title}</strong>
                  <p><RichText text={content.exportData.methods[0].body} /></p>
                </div>
                <div className={styles.instructionItem}>
                  <strong>{content.exportData.methods[1].title}</strong>
                  <p>{content.exportData.methods[1].body}</p>
                </div>
                <div className={styles.instructionItem}>
                  <strong>{content.exportData.methods[2].title}</strong>
                  <p>{content.exportData.methods[2].body}</p>
                </div>
                <div className={styles.instructionItem}>
                  <strong>{content.exportData.methods[3].title}</strong>
                  <p>{content.exportData.methods[3].body}</p>
                </div>
              </div>
            </div>

            <div className={styles.uploaderWrapper}>
              <FileUploader onFilesLoaded={handleFilesLoaded} onClear={handleClear} />

              <div className={styles.privacyNote}>
                <div>
                  <strong>
                    <svg className={styles.privacyIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    {content.privacyTitle}
                  </strong>
                  <p>{content.privacyBody}</p>
                </div>
              </div>
            </div>
          </div>

          {uploadedFiles.length === 0 && (
            <div className={styles.preCtaPanel}>
              <div className={styles.preCtaContent}>
                <span className={styles.preCtaIcon}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <span><RichText text={content.preCta} /></span>
              </div>
            </div>
          )}
        </div>

        {uploadedFiles.length > 0 && !stats && (
          <div className={styles.contentWrapper}>
            <PersonalizedCTA
              toolName="timeline-statistics"
              headline={content.cta.fallback}
            />
          </div>
        )}

        {isProcessing && (
          <div className={styles.contentWrapper}>
            <div className={styles.noticeBox}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{content.results.processing}</span>
            </div>
          </div>
        )}

        {stats && (
          <div className={styles.resultsSection}>
            {/* Stats Overview Grid */}
            <div className={styles.statsOverview}>
              <StatsCard
                icon={
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                label={content.results.distance}
                value={interpolate(content.results.kilometers, { distance: Math.round(stats.totalDistanceKm).toLocaleString(htmlLang) })}
                subtitle={interpolate(content.results.miles, { distance: Math.round(stats.totalDistanceMiles).toLocaleString(htmlLang) })}
                color="#3b82f6"
              />
              <StatsCard
                icon={
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                }
                label={content.results.points}
                value={formatNumber(stats.totalPoints, htmlLang)}
                subtitle={interpolate(content.results.pathCount, { count: stats.totalPaths.toLocaleString(htmlLang) })}
                color="#10b981"
              />
              <StatsCard
                icon={
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                }
                label={content.results.places}
                value={stats.uniquePlacesCount.toLocaleString(htmlLang)}
                subtitle={stats.hasSemanticData ? content.results.uniqueLocations : content.results.semanticHint}
                color="#f59e0b"
              />
              <StatsCard
                icon={
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                }
                label={content.results.dateRange}
                value={interpolate(content.results.yearCount, { count: dateRangeYears })}
                subtitle={stats.dateRange ? `${stats.dateRange.start.toLocaleDateString(htmlLang)} - ${stats.dateRange.end.toLocaleDateString(htmlLang)}` : content.results.noDate}
                color="#8b5cf6"
              />
            </div>

            {/* Notice if no semantic data */}
            {!stats.hasSemanticData && (
              <div className={styles.noticeBox}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span>{content.results.rawDataHint}</span>
              </div>
            )}

            {/* Countries & Cities */}
            {stats.hasSemanticData && stats.countries.length > 0 && (
              <div className={styles.tagSection}>
                <h3>{interpolate(content.results.countries, { count: stats.countries.length.toLocaleString(htmlLang) })}</h3>
                <div className={styles.tagList}>
                  {stats.countries.sort().map((country, idx) => (
                    <span key={idx} className={styles.tag}>{country}</span>
                  ))}
                </div>
              </div>
            )}

            {stats.hasSemanticData && stats.cities.length > 0 && (
              <div className={styles.tagSection}>
                <h3>{interpolate(content.results.cities, { count: stats.cities.length.toLocaleString(htmlLang) })}</h3>
                <div className={styles.tagList}>
                  {stats.cities.sort().map((city, idx) => (
                    <span key={idx} className={styles.tag}>{city}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Top Visited Places */}
            {stats.hasSemanticData && stats.topPlaces.length > 0 && (
              <div className={styles.placesSection}>
                <h3>{content.results.placesTitle}</h3>
                <div className={styles.placesTable}>
                  <div className={styles.placesHeader}>
                    <span>{content.results.place}</span>
                    <span>{content.results.visits}</span>
                    <span>{content.results.address}</span>
                  </div>
                  {stats.topPlaces.map((place, idx) => (
                    <div key={idx} className={styles.placesRow}>
                      <span>{place.name || content.results.unnamed}</span>
                      <span>{place.visitCount.toLocaleString(htmlLang)}</span>
                      <span>{place.address || '-'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Time Breakdown */}
            {(stats.timeBreakdown.travelingHours > 0 || stats.timeBreakdown.stationaryHours > 0) && (
              <div className={styles.timeBreakdown}>
                <h3>{content.results.timeTitle}</h3>
                <div className={styles.timeBar}>
                  {travelingPercent > 0 && (
                    <div
                      className={styles.timeBarTraveling}
                      style={{ width: `${Math.max(travelingPercent, 5)}%` }}
                    >
                      {travelingPercent >= 10 ? `${formatDecimal(travelingPercent)}%` : ''}
                    </div>
                  )}
                  {stationaryPercent > 0 && (
                    <div
                      className={styles.timeBarStationary}
                      style={{ width: `${Math.max(stationaryPercent, 5)}%` }}
                    >
                      {stationaryPercent >= 10 ? `${formatDecimal(stationaryPercent)}%` : ''}
                    </div>
                  )}
                </div>
                <div className={styles.timeLegend}>
                  <div className={styles.timeLegendItem}>
                    <span className={styles.timeLegendDot} style={{ background: 'var(--ifm-color-primary)' }}></span>
                    <span>{interpolate(content.results.traveling, { duration: formatHours(stats.timeBreakdown.travelingHours, htmlLang, selectMessage) })}</span>
                  </div>
                  <div className={styles.timeLegendItem}>
                    <span className={styles.timeLegendDot} style={{ background: 'var(--ifm-color-emphasis-300)' }}></span>
                    <span>{interpolate(content.results.stationary, { duration: formatHours(stats.timeBreakdown.stationaryHours, htmlLang, selectMessage) })}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Activity Distribution */}
            {activityData.length > 0 && (
              <div className={styles.chartSection}>
                <h3>{content.results.activityTitle}</h3>
                <div className={styles.barChart}>
                  {activityData.map((item) => (
                    <div key={item.type} className={styles.barRow}>
                      <span className={styles.barLabel}>{item.label}</span>
                      <div className={styles.barTrack}>
                        <div
                          className={styles.barFill}
                          style={{
                            width: `${(item.count / maxActivityCount) * 100}%`,
                            background: ACTIVITY_COLORS[item.type] || '#6b7280',
                          }}
                        ></div>
                      </div>
                      <span className={styles.barValue}>
                        {interpolate(content.results.segments, { count: item.count.toLocaleString(htmlLang) })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Yearly Breakdown */}
            {yearlyData.length > 0 && (
              <div className={styles.chartSection}>
                <h3>{content.results.yearlyTitle}</h3>
                <div className={styles.barChart}>
                  {yearlyData.map((item) => (
                    <div key={item.year} className={styles.barRow}>
                      <span className={styles.barLabel}>{item.year}</span>
                      <div className={styles.barTrack}>
                        <div
                          className={styles.barFill}
                          style={{
                            width: `${(item.pointCount / maxYearlyPoints) * 100}%`,
                            background: '#3b82f6',
                          }}
                        ></div>
                      </div>
                      <span className={styles.barValue}>
                        {interpolate(content.results.pointCount, {
                          points: formatNumber(item.pointCount, htmlLang),
                          distance: item.distanceMeters > 0 ? interpolate(content.results.distanceSuffix, {
                            distance: Math.round(item.distanceMeters / 1000).toLocaleString(htmlLang),
                          }) : '',
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Shareable Card */}
            <div className={styles.shareSection}>
              <h3>{content.results.shareTitle}</h3>
              <ShareableCard stats={stats} />
            </div>
          </div>
        )}

        {/* Post-upload CTA */}
        {stats && (
          <div className={styles.contentWrapper}>
            <PersonalizedCTA
              toolName="timeline-statistics"
              headline={<RichText text={interpolate(content.cta.headline, {
                distance: Math.round(stats.totalDistanceKm).toLocaleString(htmlLang), years: dateRangeYears,
                countries: stats.countries.length > 0 ? interpolate(content.cta.countries, { count: stats.countries.length.toLocaleString(htmlLang) }) : '',
              })} />}
              stats={[
                { label: content.cta.statLabels.points, value: formatNumber(stats.totalPoints, htmlLang) },
                ...(stats.countries.length > 0 ? [{ label: content.cta.statLabels.countries, value: stats.countries.length.toLocaleString(htmlLang) }] : []),
                ...(stats.cities.length > 0 ? [{ label: content.cta.statLabels.cities, value: stats.cities.length.toLocaleString(htmlLang) }] : []),
                { label: content.cta.statLabels.distance, value: interpolate(content.results.kilometers, { distance: Math.round(stats.totalDistanceKm).toLocaleString(htmlLang) }) },
                { label: content.cta.statLabels.years, value: dateRangeYears },
              ]}
            />
          </div>
        )}

        {/* Info Section */}
        <div className={styles.infoSection}>
          <div className={styles.infoGrid}>
            {content.cards.map((card, index) => (
              <div className={styles.infoCard} key={index}>
                <h2>{card.title}</h2>
                {card.paragraphs.map((text, index) => (
                  <p key={index}><RichText text={text} /></p>
                ))}
                {card.items && <ul>
                  {card.items.map((item, index) => (
                    <li key={index}><RichText text={item.body} /></li>
                  ))}
                </ul>}
                {card.footer?.map((text, index) => (
                  <p key={index}><RichText text={text} /></p>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className={styles.faqSection}>
          <h2>{content.faqTitle}</h2>
          <div className={styles.faqList}>
            {faqItems.map((item, index) => (
              <details key={index} className={styles.faqItem}>
                <summary className={styles.faqQuestion}>{item.q}</summary>
                <p className={styles.faqAnswer}><RichText text={item.a} /></p>
              </details>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className={styles.bottomCtaPanel}>
          <div className={styles.ctaContent}>
            <h3>{content.cta.title}</h3>
            <p>{content.cta.body}</p>
            <SmartLink href="/?utm_source=tool&utm_medium=bottom-cta&utm_campaign=timeline-statistics" className={styles.ctaButton}>{content.cta.button}</SmartLink>
          </div>
        </div>
      </div>
        <RelatedTools slug="timeline-statistics" />
      </main>
    </Layout>
  );
}
