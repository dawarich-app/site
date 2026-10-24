import React, { useState, useCallback } from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import FileUploader from '@site/src/components/FileUploader';
import { parseTimeline, detectFormat } from '@site/src/utils/timelineParser';
import PersonalizedCTA from '@site/src/components/PersonalizedCTA';
import RelatedTools from '@site/src/components/RelatedTools';
import { interpolate } from '@docusaurus/Interpolate';
import { usePluralForm } from '@docusaurus/theme-common';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import RichText, { SmartLink, toPlainText } from '@site/src/i18n/RichText';
import { useLocalizedUrl } from '@site/src/i18n/useLocalizedUrl';
import content from '@locale-content/tools/timeline-format-detector.json';
import styles from './timeline-format-detector.module.css';

const pageTitle = content.meta.title;
const pageDescription = content.meta.description;
const imageUrl = "https://dawarich.app/img/meta-image.png";

const formatNames = {
  records: content.formats.records.title,
  semantic: content.formats.semantic.title,
  settings: content.formats.settings.title,
  timelineEdits: content.formats.timelineEdits.title,
  semanticSegments: content.formats.semanticSegments.title,
  locationHistory: content.formats.locationHistory.title,
  unknown: content.formats.unknown.title,
};

const formatDescriptions = {
  records: content.formats.records.description,
  semantic: content.formats.semantic.description,
  settings: content.formats.settings.description,
  timelineEdits: content.formats.timelineEdits.description,
  semanticSegments: content.formats.semanticSegments.description,
  locationHistory: content.formats.locationHistory.description,
  unknown: content.formats.unknown.description,
};

const relatedTools = [
  {
    name: content.relatedTools[0].title,
    href: '/tools/google-timeline-converter',
    description: content.relatedTools[0].description,
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
  {
    name: content.relatedTools[1].title,
    href: '/tools/timeline-visualizer',
    description: content.relatedTools[1].description,
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
  },
  {
    name: content.relatedTools[2].title,
    href: '/tools/timeline-statistics',
    description: content.relatedTools[2].description,
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    name: content.relatedTools[3].title,
    href: '/tools/gps-file-splitter',
    description: content.relatedTools[3].description,
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
  },
  {
    name: content.relatedTools[4].title,
    href: '/tools/timeline-merger',
    description: content.relatedTools[4].description,
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16v2a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h2m10 0h4a2 2 0 012 2v8a2 2 0 01-2 2h-4m-6-4l4-4m0 0l4 4m-4-4v12" />
      </svg>
    ),
  },
  {
    name: content.relatedTools[5].title,
    href: '/tools/timeline-mileage-calculator',
    description: content.relatedTools[5].description,
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
];

const faqItems = content.faq;

function formatFileSize(bytes, htmlLang) {
  if (bytes === 0) return content.fileSize.empty;
  const k = 1024;
  const sizes = content.fileSize.units;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return interpolate(content.fileSize.value, {
    size: Number((bytes / Math.pow(k, i)).toFixed(2)).toLocaleString(htmlLang), unit: sizes[i],
  });
}

function formatDate(dateStr, htmlLang) {
  if (!dateStr) return null;
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return null;
    return date.toLocaleDateString(htmlLang, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return null;
  }
}

export default function TimelineFormatDetector() {
  const { i18n } = useDocusaurusContext();
  const htmlLang = i18n.localeConfigs[i18n.currentLocale].htmlLang;
  const { selectMessage } = usePluralForm();
  const pageUrl = useLocalizedUrl('/tools/timeline-format-detector/');
  const homeUrl = useLocalizedUrl('/');
  const toolsUrl = useLocalizedUrl('/tools/');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [results, setResults] = useState([]);

  const handleFilesLoaded = useCallback(async (files) => {
    setUploadedFiles(files);

    const fileResults = [];

    for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
      const file = files[fileIndex];

      try {
        const format = detectFormat(file.data);
        const parsed = parseTimeline(file.data);

        // Calculate date range from points
        let minDate = null;
        let maxDate = null;
        let pointsWithTimestamp = 0;
        let pointsWithAccuracy = 0;

        for (let i = 0; i < parsed.points.length; i++) {
          const point = parsed.points[i];

          if (point.timestamp) {
            pointsWithTimestamp++;
            const ts = new Date(point.timestamp);
            if (!isNaN(ts.getTime())) {
              if (!minDate || ts < minDate) minDate = ts;
              if (!maxDate || ts > maxDate) maxDate = ts;
            }
          }

          if (point.accuracy !== null && point.accuracy !== undefined) {
            pointsWithAccuracy++;
          }
        }

        // Also check paths for date range
        for (let i = 0; i < parsed.paths.length; i++) {
          const path = parsed.paths[i];
          if (path.startTimestamp) {
            const ts = new Date(path.startTimestamp);
            if (!isNaN(ts.getTime())) {
              if (!minDate || ts < minDate) minDate = ts;
              if (!maxDate || ts > maxDate) maxDate = ts;
            }
          }
          if (path.endTimestamp) {
            const ts = new Date(path.endTimestamp);
            if (!isNaN(ts.getTime())) {
              if (!minDate || ts < minDate) minDate = ts;
              if (!maxDate || ts > maxDate) maxDate = ts;
            }
          }
        }

        fileResults.push({
          filename: file.filename,
          fileSize: file.size,
          format,
          formatName: formatNames[format] || formatNames.unknown,
          formatDescription: formatDescriptions[format] || formatDescriptions.unknown,
          pointCount: parsed.points.length,
          pathCount: parsed.paths.length,
          minDate: minDate ? minDate.toISOString() : null,
          maxDate: maxDate ? maxDate.toISOString() : null,
          pointsWithTimestamp,
          pointsWithAccuracy,
          metadata: parsed.metadata,
        });
      } catch (error) {
        fileResults.push({
          filename: file.filename,
          fileSize: file.size,
          format: 'unknown',
          formatName: content.results.parseErrorTitle,
          formatDescription: interpolate(content.results.parseError, { message: error.message }),
          pointCount: 0,
          pathCount: 0,
          minDate: null,
          maxDate: null,
          pointsWithTimestamp: 0,
          pointsWithAccuracy: 0,
          metadata: {},
          error: true,
        });
      }
    }

    setResults(fileResults);
  }, []);

  const handleClear = useCallback(() => {
    setUploadedFiles([]);
    setResults([]);
  }, []);

  const totalPoints = results.reduce((sum, r) => sum + r.pointCount, 0);
  const totalPaths = results.reduce((sum, r) => sum + r.pathCount, 0);

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
              <p>
                {content.exportData.warning}
              </p>
              <div className={styles.instructionsList}>
                <div className={styles.instructionItem}>
                  <strong>{content.exportData.methods[0].title}</strong>
                  <p><RichText text={content.exportData.methods[0].steps[0]} /></p>
                  <p><RichText text={content.exportData.methods[0].steps[1]} /></p>
                </div>
                <div className={styles.instructionItem}>
                  <strong>{content.exportData.methods[1].title}</strong>
                  <p>{content.exportData.methods[1].steps[0]}</p>
                </div>
                <div className={styles.instructionItem}>
                  <strong>{content.exportData.methods[2].title}</strong>
                  <p>{content.exportData.methods[2].steps[0]}</p>
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

          {results.length > 0 && (
            <>
              <PersonalizedCTA
                toolName="timeline-format-detector"
                headline={<RichText text={interpolate(content.cta.headline, {
                  files: interpolate(selectMessage(results.length, content.cta.fileCount), { count: results.length.toLocaleString(htmlLang) }),
                  formats: interpolate(selectMessage(new Set(results.map(r => r.formatName)).size, content.cta.formatCount), {
                    count: new Set(results.map(r => r.formatName)).size.toLocaleString(htmlLang),
                  }),
                })} />}
                stats={[
                  { label: content.cta.statLabels.files, value: results.length.toLocaleString(htmlLang) },
                  { label: content.cta.statLabels.formats, value: new Set(results.map(r => r.formatName)).size.toLocaleString(htmlLang) },
                  ...(totalPoints > 0 ? [{ label: content.cta.statLabels.points, value: totalPoints.toLocaleString(htmlLang) }] : []),
                ]}
              />

              <div className={styles.resultsSection}>
                <h2>{content.results.title}</h2>

                {results.length > 1 && (
                  <div className={styles.resultsSummary}>
                    <span>{interpolate(content.results.filesAnalyzed, { count: results.length.toLocaleString(htmlLang) })}</span>
                    <span className={styles.resultsSummaryDot}>&middot;</span>
                    <span>{interpolate(content.results.totalPoints, { points: totalPoints.toLocaleString(htmlLang) })}</span>
                    <span className={styles.resultsSummaryDot}>&middot;</span>
                    <span>{interpolate(content.results.totalPaths, { paths: totalPaths.toLocaleString(htmlLang) })}</span>
                  </div>
                )}

                {results.map((result, index) => (
                  <div key={index} className={`${styles.resultCard} ${result.error ? styles.resultCardError : ''}`}>
                    <div className={styles.resultHeader}>
                      <div className={styles.resultFilename}>
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>{result.filename}</span>
                      </div>
                      <span className={`${styles.formatBadge} ${styles[`format_${result.format}`] || ''}`}>
                        {result.formatName}
                      </span>
                    </div>

                    <p className={styles.formatDescription}>{result.formatDescription}</p>

                    <div className={styles.statGrid}>
                      <div className={styles.statItem}>
                        <span className={styles.statLabel}>{content.results.points}</span>
                        <span className={styles.statValue}>{result.pointCount.toLocaleString(htmlLang)}</span>
                      </div>
                      <div className={styles.statItem}>
                        <span className={styles.statLabel}>{content.results.paths}</span>
                        <span className={styles.statValue}>{result.pathCount.toLocaleString(htmlLang)}</span>
                      </div>
                      <div className={styles.statItem}>
                        <span className={styles.statLabel}>{content.results.fileSize}</span>
                        <span className={styles.statValue}>{formatFileSize(result.fileSize, htmlLang)}</span>
                      </div>
                      <div className={styles.statItem}>
                        <span className={styles.statLabel}>{content.results.dateRange}</span>
                        <span className={styles.statValue}>
                          {result.minDate && result.maxDate
                            ? `${formatDate(result.minDate, htmlLang)} — ${formatDate(result.maxDate, htmlLang)}`
                            : content.results.noDates}
                        </span>
                      </div>
                    </div>

                    {(result.pointCount > 0 || result.pathCount > 0) && (
                      <div className={styles.qualitySection}>
                        <h4>{content.results.qualityTitle}</h4>
                        <div className={styles.qualityGrid}>
                          <div className={styles.qualityItem}>
                            <div className={styles.qualityBar}>
                              <div
                                className={styles.qualityFill}
                                style={{
                                  width: result.pointCount > 0
                                    ? `${Math.round((result.pointsWithTimestamp / result.pointCount) * 100)}%`
                                    : '0%'
                                }}
                              />
                            </div>
                            <span className={styles.qualityLabel}>
                              {result.pointCount > 0
                                ? interpolate(content.results.timestampCoverage, { percent: Math.round((result.pointsWithTimestamp / result.pointCount) * 100).toLocaleString(htmlLang) })
                                : content.results.noTimestamps}
                            </span>
                          </div>
                          <div className={styles.qualityItem}>
                            <div className={styles.qualityBar}>
                              <div
                                className={styles.qualityFill}
                                style={{
                                  width: result.pointCount > 0
                                    ? `${Math.round((result.pointsWithAccuracy / result.pointCount) * 100)}%`
                                    : '0%'
                                }}
                              />
                            </div>
                            <span className={styles.qualityLabel}>
                              {result.pointCount > 0
                                ? interpolate(content.results.accuracyCoverage, { percent: Math.round((result.pointsWithAccuracy / result.pointCount) * 100).toLocaleString(htmlLang) })
                                : content.results.noAccuracy}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {!result.error && (result.pointCount > 0 || result.pathCount > 0) && (
                      <div className={styles.recommendedTools}>
                        <h4>{content.results.toolsTitle}</h4>
                        <div className={styles.toolLinks}>
                          {relatedTools.map((tool, toolIndex) => (
                            <SmartLink
                              key={toolIndex}
                              href={`${tool.href}?utm_source=tool&utm_medium=recommendation&utm_campaign=timeline-format-detector`}
                              className={styles.toolLink}
                            >
                              <span className={styles.toolIcon}>{tool.icon}</span>
                              <div>
                                <strong>{tool.name}</strong>
                                <span>{tool.description}</span>
                              </div>
                            </SmartLink>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

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

        <div className={styles.bottomCtaPanel}>
          <div className={styles.ctaContent}>
            <h3>{content.cta.title}</h3>
            <p>{content.cta.body}</p>
            <SmartLink href="/?utm_source=tool&utm_medium=bottom-cta&utm_campaign=timeline-format-detector" className={styles.ctaButton}>{content.cta.button}</SmartLink>
          </div>
        </div>
      </div>
        <RelatedTools slug="timeline-format-detector" />
      </main>
    </Layout>
  );
}
