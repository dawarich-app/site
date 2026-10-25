import React, { useState, useCallback, useMemo } from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import FileUploader from '@site/src/components/FileUploader';
import SaveToAccountButton from '@site/src/components/SaveToAccountButton';
import StatsCard from '@site/src/components/StatsCard';
import { parseTimeline } from '@site/src/utils/timelineParser';
import { generateMileageLog, mileageLogToCSV } from '@site/src/utils/timelineStats';
import PersonalizedCTA from '@site/src/components/PersonalizedCTA';
import RelatedTools from '@site/src/components/RelatedTools';
import { interpolate } from '@docusaurus/Interpolate';
import RichText, { SmartLink, toPlainText } from '@site/src/i18n/RichText';
import { useLocalizedUrl } from '@site/src/i18n/useLocalizedUrl';
import content from '@locale-content/tools/timeline-mileage-calculator.json';
import styles from './timeline-mileage-calculator.module.css';
import { useHtmlLang } from '@site/src/i18n/useHtmlLang';

const pageTitle = content.meta.title;
const pageDescription = content.meta.description;
const imageUrl = "https://dawarich.app/img/meta-image.png";

const faqItems = content.faq;

function downloadCSV(csvContent, filename) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function formatDuration(ms, htmlLang) {
  if (!ms || isNaN(ms)) return '-';
  const totalMinutes = Math.round(ms / 60000);
  if (totalMinutes < 60) return interpolate(content.duration.minutes, { minutes: totalMinutes.toLocaleString(htmlLang) });
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return interpolate(content.duration.hoursMinutes, { hours: hours.toLocaleString(htmlLang), minutes: minutes.toLocaleString(htmlLang) });
}

function formatActivityType(type) {
  const mapping = {
    'IN_PASSENGER_VEHICLE': content.activities.driving,
    'DRIVING': content.activities.driving,
    'IN_BUS': content.activities.bus,
    'IN_TRAIN': content.activities.train,
    'IN_SUBWAY': content.activities.subway,
    'MOTORCYCLING': content.activities.motorcycle,
  };
  return mapping[type] || type;
}

export default function TimelineMileageCalculator() {
  const htmlLang = useHtmlLang();
  const pageUrl = useLocalizedUrl('/tools/timeline-mileage-calculator/');
  const homeUrl = useLocalizedUrl('/');
  const toolsUrl = useLocalizedUrl('/tools/');
  const formatDecimal = (value, digits = 1) => value.toLocaleString(htmlLang, { minimumFractionDigits: digits, maximumFractionDigits: digits });
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [allPoints, setAllPoints] = useState([]);
  const [allPaths, setAllPaths] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [unit, setUnit] = useState('miles');
  const [mileageLog, setMileageLog] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [visibleTrips, setVisibleTrips] = useState(20);

  const getOriginalFiles = useCallback(
    () => uploadedFiles.map((f) => ({ name: f.filename, blob: f.blob })),
    [uploadedFiles]
  );

  const handleFilesLoaded = useCallback(async (files) => {
    setUploadedFiles(files);
    setIsProcessing(true);
    setMileageLog(null);

    const collectedPoints = [];
    const collectedPaths = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const parsed = parseTimeline(file.data);
        for (let j = 0; j < parsed.points.length; j++) {
          collectedPoints.push(parsed.points[j]);
        }
        for (let j = 0; j < parsed.paths.length; j++) {
          collectedPaths.push(parsed.paths[j]);
        }
        await new Promise(resolve => setTimeout(resolve, 0));
      } catch (error) {
        console.error(`Error parsing ${file.filename}:`, error);
      }
    }

    setAllPoints(collectedPoints);
    setAllPaths(collectedPaths);

    // Auto-detect date range from data
    const timestamps = collectedPoints
      .filter(p => p.timestamp)
      .map(p => new Date(p.timestamp).getTime())
      .filter(t => !isNaN(t));

    const pathTimestamps = collectedPaths
      .filter(p => p.startTimestamp)
      .map(p => new Date(p.startTimestamp).getTime())
      .filter(t => !isNaN(t));

    const allTimestamps = [...timestamps, ...pathTimestamps];

    if (allTimestamps.length > 0) {
      const minDate = new Date(Math.min(...allTimestamps));
      const maxDate = new Date(Math.max(...allTimestamps));
      setStartDate(minDate.toISOString().split('T')[0]);
      setEndDate(maxDate.toISOString().split('T')[0]);
    }

    // Auto-calculate
    const log = generateMileageLog(collectedPoints, collectedPaths, {
      unit: 'miles',
    });
    setMileageLog(log);
    setIsProcessing(false);
  }, []);

  const handleClear = useCallback(() => {
    setUploadedFiles([]);
    setAllPoints([]);
    setAllPaths([]);
    setMileageLog(null);
    setStartDate('');
    setEndDate('');
    setVisibleTrips(20);
  }, []);

  const handleCalculate = useCallback(() => {
    if (allPoints.length === 0 && allPaths.length === 0) return;

    const options = { unit };
    if (startDate) options.startDate = new Date(startDate + 'T00:00:00');
    if (endDate) options.endDate = new Date(endDate + 'T23:59:59');

    const log = generateMileageLog(allPoints, allPaths, options);
    setMileageLog(log);
    setVisibleTrips(20);
  }, [allPoints, allPaths, startDate, endDate, unit]);

  const handleDownload = useCallback(() => {
    if (!mileageLog) return;
    const csv = mileageLogToCSV(mileageLog);
    const dateStr = new Date().toISOString().split('T')[0];
    downloadCSV(csv, `mileage-log-${dateStr}.csv`);
  }, [mileageLog]);

  const averageTripDistance = useMemo(() => {
    if (!mileageLog || mileageLog.totalTrips === 0) return 0;
    return mileageLog.totalDistance / mileageLog.totalTrips;
  }, [mileageLog]);

  const sortedMonthlySummary = useMemo(() => {
    if (!mileageLog) return [];
    return Object.entries(mileageLog.monthlySummary)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([month, data]) => ({ month, ...data }));
  }, [mileageLog]);

  const visibleTripList = useMemo(() => {
    if (!mileageLog) return [];
    return mileageLog.trips.slice(0, visibleTrips);
  }, [mileageLog, visibleTrips]);

  const hasMoreTrips = mileageLog && visibleTrips < mileageLog.trips.length;

  return (
    <Layout
      title={pageTitle}
      description={pageDescription}
    >
      <Head>
        <meta name="title" content={pageTitle} />
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={content.meta.keywords} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:site_name" content="Dawarich" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={pageUrl} />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={imageUrl} />

        <meta name="author" content="Dawarich" />
        <meta name="language" content={htmlLang} />
        <meta name="revisit-after" content="7 days" />

        {/* JSON-LD Structured Data - WebApplication */}
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
              },
              {
                "@type": "HowToStep",
                "name": content.howTo.steps[3].name,
                "text": content.howTo.steps[3].text
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
                "name": content.h1,
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
              </div>
              <p className={styles.instructionNote}>
                {content.exportData.note}
              </p>
            </div>

            <div className={styles.uploaderWrapper}>
              <FileUploader onFilesLoaded={handleFilesLoaded} onClear={handleClear} />

              {uploadedFiles.length > 0 && (
                <div className={styles.saveToAccountSection}>
                  <p className={styles.saveToAccountIntro}>
                    {content.saveIntro}
                  </p>
                  <SaveToAccountButton
                    toolName="timeline-mileage-calculator"
                    sourceHint={null}
                    getFiles={getOriginalFiles}
                    disabled={uploadedFiles.length === 0}
                  />
                </div>
              )}

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

          {uploadedFiles.length > 0 && (
            <PersonalizedCTA
              toolName="timeline-mileage-calculator"
              headline={mileageLog && mileageLog.totalTrips > 0
                ? <RichText text={interpolate(content.cta.headline, {
                  count: mileageLog.totalTrips.toLocaleString(htmlLang), distance: formatDecimal(mileageLog.totalDistance), unit: content.units[mileageLog.unit],
                })} />
                : content.cta.fallback}
              stats={mileageLog && mileageLog.totalTrips > 0 ? [
                { label: content.cta.tripsLabel, value: mileageLog.totalTrips.toLocaleString(htmlLang) },
                { label: content.units[mileageLog.unit], value: formatDecimal(mileageLog.totalDistance) },
              ] : undefined}
            />
          )}
        </div>

        {/* Results area */}
        {uploadedFiles.length > 0 && (
          <div className={styles.resultsSection}>
            {/* Filters row */}
            <div className={styles.filtersRow}>
              <div className={styles.dateInputGroup}>
                <label htmlFor="startDate">{content.results.startDate}</label>
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={styles.dateInput}
                />
              </div>
              <div className={styles.dateInputGroup}>
                <label htmlFor="endDate">{content.results.endDate}</label>
                <input
                  type="date"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={styles.dateInput}
                />
              </div>
              <div className={styles.unitToggle}>
                <button
                  className={`${styles.unitOption} ${unit === 'km' ? styles.unitOptionActive : ''}`}
                  onClick={() => setUnit('km')}
                  type="button"
                >
                  {content.units.km}
                </button>
                <button
                  className={`${styles.unitOption} ${unit === 'miles' ? styles.unitOptionActive : ''}`}
                  onClick={() => setUnit('miles')}
                  type="button"
                >
                  {content.units.miles}
                </button>
              </div>
              <button
                className={styles.calculateButton}
                onClick={handleCalculate}
                disabled={isProcessing}
                type="button"
              >
                {isProcessing ? content.results.processing : content.results.calculateButton}
              </button>
            </div>

            {/* Stats overview */}
            {mileageLog && (
              <>
                <div className={styles.statsOverview}>
                  <StatsCard
                    icon={
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="28" height="28">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                      </svg>
                    }
                    label={content.results.distanceTitle}
                    value={interpolate(content.results.distanceValue, { distance: formatDecimal(mileageLog.totalDistance), unit: content.units[mileageLog.unit] })}
                    subtitle={content.results.distanceHint}
                    color="#3b82f6"
                  />
                  <StatsCard
                    icon={
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="28" height="28">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    }
                    label={content.results.tripsTitle}
                    value={mileageLog.totalTrips.toLocaleString(htmlLang)}
                    subtitle={content.results.tripsHint}
                    color="#10b981"
                  />
                  <StatsCard
                    icon={
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="28" height="28">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    }
                    label={content.results.averageTitle}
                    value={interpolate(content.results.distanceValue, { distance: formatDecimal(averageTripDistance), unit: content.units[mileageLog.unit] })}
                    subtitle={content.results.averageHint}
                    color="#f59e0b"
                  />
                </div>

                <div className={styles.disclaimer}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{content.results.disclaimer}</span>
                </div>

                {/* Monthly Summary */}
                {sortedMonthlySummary.length > 0 && (
                  <div className={styles.tableSection}>
                    <h2>{content.results.monthlyTitle}</h2>
                    <div className={styles.tableWrapper}>
                      <table className={styles.summaryTable}>
                        <thead>
                          <tr className={styles.tableHeader}>
                            <th className={styles.tableCell}>{content.results.month}</th>
                            <th className={styles.tableCell}>{interpolate(content.results.distanceHeading, { unit: content.units[mileageLog.unit] })}</th>
                            <th className={styles.tableCell}>{content.results.tripCount}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sortedMonthlySummary.map((row) => (
                            <tr key={row.month} className={styles.tableRow}>
                              <td className={styles.tableCell}>{row.month}</td>
                              <td className={styles.tableCell}>{formatDecimal(row.distance)}</td>
                              <td className={styles.tableCell}>{row.tripCount.toLocaleString(htmlLang)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Trip Log */}
                {mileageLog.trips.length > 0 && (
                  <div className={styles.tableSection}>
                    <h2>{content.results.tripLogTitle}</h2>
                    <div className={styles.tableWrapper}>
                      <table className={styles.tripLog}>
                        <thead>
                          <tr className={styles.tableHeader}>
                            <th className={styles.tableCell}>{content.results.trip}</th>
                            <th className={styles.tableCell}>{content.results.date}</th>
                            <th className={styles.tableCell}>{content.results.activity}</th>
                            <th className={styles.tableCell}>{interpolate(content.results.distanceHeading, { unit: content.units[mileageLog.unit] })}</th>
                            <th className={styles.tableCell}>{content.results.duration}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {visibleTripList.map((trip) => (
                            <tr key={trip.id} className={styles.tableRow}>
                              <td className={styles.tableCell}>{trip.id}</td>
                              <td className={styles.tableCell}>{trip.date}</td>
                              <td className={styles.tableCell}>{formatActivityType(trip.activityType)}</td>
                              <td className={styles.tableCell}>{formatDecimal(trip.distance, 2)}</td>
                              <td className={styles.tableCell}>
                                {trip.startTime && trip.endTime
                                  ? formatDuration(new Date(trip.endTime) - new Date(trip.startTime), htmlLang)
                                  : trip.duration || '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {hasMoreTrips && (
                      <button
                        className={styles.showMoreButton}
                        onClick={() => setVisibleTrips(prev => prev + 20)}
                        type="button"
                      >
                        {interpolate(content.results.showMore, { count: (mileageLog.trips.length - visibleTrips).toLocaleString(htmlLang) })}
                      </button>
                    )}
                  </div>
                )}

                {/* Download button */}
                <div className={styles.downloadSection}>
                  <button
                    className={styles.downloadButton}
                    onClick={handleDownload}
                    type="button"
                  >
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    {content.results.downloadButton}
                  </button>
                </div>
              </>
            )}

            {mileageLog && mileageLog.totalTrips === 0 && (
              <div className={styles.noResults}>
                <h3>{content.results.emptyTitle}</h3>
                <p>{content.results.emptyIntro}</p>
                <ul>
                  <li>{content.results.emptyReasons[0].body}</li>
                  <li>{content.results.emptyReasons[1].body}</li>
                  <li>{content.results.emptyReasons[2].body}</li>
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Post-upload CTA */}
        {mileageLog && mileageLog.totalTrips > 0 && (
          <div className={styles.contentWrapper}>
            <div className={styles.postCtaPanel}>
              <div className={styles.ctaContent}>
                <h3>{content.cta.postTitle}</h3>
                <p>{content.cta.postBody}</p>
                <SmartLink href="/?utm_source=tool&utm_medium=post-upload-cta&utm_campaign=timeline-mileage-calculator" className={styles.ctaButton}>{content.cta.button}</SmartLink>
              </div>
            </div>
          </div>
        )}

        {/* Info section */}
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

        {/* FAQ section */}
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
            <SmartLink href="/?utm_source=tool&utm_medium=bottom-cta&utm_campaign=timeline-mileage-calculator" className={styles.ctaButton}>{content.cta.button}</SmartLink>
          </div>
        </div>
      </div>
        <RelatedTools slug="timeline-mileage-calculator" />
      </main>
    </Layout>
  );
}
