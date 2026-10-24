import React, { useState, useCallback } from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import FileUploader from '@site/src/components/FileUploader';
import { parseTimeline } from '@site/src/utils/timelineParser';
import { mergeWithDedup } from '@site/src/utils/timelineDedup';
import { timelineToConverterPoints } from '@site/src/utils/timelineToFormat';
import { toGPX } from '@site/src/utils/formatConverters';
import PersonalizedCTA from '@site/src/components/PersonalizedCTA';
import RelatedTools from '@site/src/components/RelatedTools';
import { interpolate } from '@docusaurus/Interpolate';
import { usePluralForm } from '@docusaurus/theme-common';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import RichText, { SmartLink, toPlainText } from '@site/src/i18n/RichText';
import { useLocalizedUrl } from '@site/src/i18n/useLocalizedUrl';
import content from '@locale-content/tools/timeline-merger.json';
import styles from './timeline-merger.module.css';

const pageTitle = content.meta.title;
const pageDescription = content.meta.description;
const imageUrl = "https://dawarich.app/img/meta-image.png";

const FILE_COLORS = [
  '#3b82f6',
  '#ef4444',
  '#10b981',
  '#f59e0b',
  '#8b5cf6',
  '#ec4899',
  '#14b8a6',
  '#f97316',
  '#6366f1',
  '#84cc16',
];

const faqItems = content.faq;

function formatDate(date, htmlLang) {
  if (!date) return content.results.noDate;
  return new Date(date).toLocaleDateString(htmlLang, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function getDateRangeFromPoints(points) {
  const timestamps = points
    .filter(p => p.timestamp)
    .map(p => new Date(p.timestamp).getTime())
    .filter(t => !isNaN(t));

  if (timestamps.length === 0) return { start: null, end: null };
  return {
    start: new Date(Math.min(...timestamps)),
    end: new Date(Math.max(...timestamps)),
  };
}

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function TimelineMerger() {
  const { i18n } = useDocusaurusContext();
  const htmlLang = i18n.localeConfigs[i18n.currentLocale].htmlLang;
  const { selectMessage } = usePluralForm();
  const pageUrl = useLocalizedUrl('/tools/timeline-merger/');
  const homeUrl = useLocalizedUrl('/');
  const toolsUrl = useLocalizedUrl('/tools/');
  const [parsedFiles, setParsedFiles] = useState([]);
  const [distanceThreshold, setDistanceThreshold] = useState(50);
  const [timeThreshold, setTimeThreshold] = useState(60);
  const [mergeResult, setMergeResult] = useState(null);
  const [isMerging, setIsMerging] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState(null);

  const handleFilesLoaded = useCallback(async (files) => {
    setIsParsing(true);
    setError(null);
    setMergeResult(null);

    try {
      const parsed = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        try {
          const result = parseTimeline(file.data);
          const dateRange = getDateRangeFromPoints(result.points);

          parsed.push({
            points: result.points,
            paths: result.paths,
            metadata: result.metadata,
            filename: file.filename,
            dateRange,
          });
        } catch (err) {
          console.error(`Error parsing ${file.filename}:`, err);
          setError(interpolate(content.results.parseError, { fileName: file.filename, message: err.message }));
        }
      }

      setParsedFiles(parsed);
    } catch (err) {
      setError(interpolate(content.results.processingError, { message: err.message }));
    } finally {
      setIsParsing(false);
    }
  }, []);

  const handleClear = useCallback(() => {
    setParsedFiles([]);
    setMergeResult(null);
    setError(null);
  }, []);

  const handleMerge = useCallback(async () => {
    if (parsedFiles.length < 1) return;

    setIsMerging(true);
    setError(null);

    try {
      // Yield to browser before heavy computation
      await new Promise(resolve => setTimeout(resolve, 50));

      const result = mergeWithDedup(parsedFiles, {
        distanceThreshold,
        timeThreshold,
      });

      setMergeResult(result);
    } catch (err) {
      setError(interpolate(content.results.mergeError, { message: err.message }));
    } finally {
      setIsMerging(false);
    }
  }, [parsedFiles, distanceThreshold, timeThreshold]);

  const handleDownloadJSON = useCallback(() => {
    if (!mergeResult) return;
    const json = JSON.stringify(mergeResult.points, null, 2);
    downloadFile(json, 'merged-timeline.json', 'application/json');
  }, [mergeResult]);

  const handleDownloadGPX = useCallback(() => {
    if (!mergeResult) return;
    const converterPoints = timelineToConverterPoints(mergeResult.points, mergeResult.paths);
    const gpx = toGPX(converterPoints, { name: 'Merged Timeline Data', description: 'Merged from multiple Google Timeline exports using Dawarich Timeline Merger' });
    downloadFile(gpx, 'merged-timeline.gpx', 'application/gpx+xml');
  }, [mergeResult]);

  // Calculate overall date range for timeline visualization
  const overallRange = React.useMemo(() => {
    if (parsedFiles.length === 0) return null;

    let minTime = Infinity;
    let maxTime = -Infinity;

    parsedFiles.forEach(file => {
      if (file.dateRange.start) {
        minTime = Math.min(minTime, file.dateRange.start.getTime());
      }
      if (file.dateRange.end) {
        maxTime = Math.max(maxTime, file.dateRange.end.getTime());
      }
    });

    if (minTime === Infinity || maxTime === -Infinity) return null;

    return {
      start: new Date(minTime),
      end: new Date(maxTime),
      span: maxTime - minTime,
    };
  }, [parsedFiles]);

  const hasFiles = parsedFiles.length > 0;

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
              },
              {
                "@type": "HowToStep",
                "name": content.howTo.steps[3].name,
                "text": content.howTo.steps[3].text
              },
              {
                "@type": "HowToStep",
                "name": content.howTo.steps[4].name,
                "text": content.howTo.steps[4].text
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
            <div className={styles.useCases}>
              <h2>{content.benefitsTitle}</h2>
              <p>
                {content.benefitsIntro}
              </p>
              <div className={styles.useCasesList}>
                <div className={styles.useCaseItem}>
                  <strong>{content.benefits[0].title}</strong>
                  <p>{content.benefits[0].body}</p>
                </div>
                <div className={styles.useCaseItem}>
                  <strong>{content.benefits[1].title}</strong>
                  <p>{content.benefits[1].body}</p>
                </div>
                <div className={styles.useCaseItem}>
                  <strong>{content.benefits[2].title}</strong>
                  <p>{content.benefits[2].body}</p>
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

          {!hasFiles && (
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

          {hasFiles && (
            <PersonalizedCTA
              toolName="timeline-merger"
              headline={mergeResult
                ? <RichText text={interpolate(content.cta.headline, {
                  count: mergeResult.metadata.fileCount.toLocaleString(htmlLang), points: mergeResult.metadata.totalOutputPoints.toLocaleString(htmlLang),
                })} />
                : content.cta.fallback}
              stats={mergeResult ? [
                { label: content.cta.statLabels.points, value: mergeResult.metadata.totalOutputPoints.toLocaleString(htmlLang) },
                { label: content.cta.statLabels.files, value: mergeResult.metadata.fileCount.toLocaleString(htmlLang) },
                { label: content.cta.statLabels.duplicates, value: mergeResult.metadata.duplicatesRemoved.toLocaleString(htmlLang) },
              ] : undefined}
            />
          )}
        </div>

        {isParsing && (
          <div className={styles.resultsSection}>
            <div className={styles.processingIndicator}>
              <div className={styles.spinner}></div>
              {content.results.parsing}
            </div>
          </div>
        )}

        {error && (
          <div className={styles.resultsSection}>
            <div className={styles.errorMessage}>{error}</div>
          </div>
        )}

        {hasFiles && (
          <div className={styles.resultsSection}>
            {/* File summary table */}
            <div className={styles.fileSummary}>
              <h3>{interpolate(content.results.uploadedFiles, { count: parsedFiles.length.toLocaleString(htmlLang) })}</h3>
              <table className={styles.fileSummaryTable}>
                <thead>
                  <tr>
                    <th>{content.results.file}</th>
                    <th>{content.results.format}</th>
                    <th>{content.results.points}</th>
                    <th>{content.results.paths}</th>
                    <th>{content.results.dateRange}</th>
                  </tr>
                </thead>
                <tbody>
                  {parsedFiles.map((file, index) => (
                    <tr key={index} className={styles.fileSummaryRow}>
                      <td>
                        <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, backgroundColor: FILE_COLORS[index % FILE_COLORS.length], marginRight: 8, verticalAlign: 'middle' }}></span>
                        {file.filename}
                      </td>
                      <td><span className={styles.formatBadge}>{file.metadata?.format || content.results.unknown}</span></td>
                      <td>{file.points.length.toLocaleString(htmlLang)}</td>
                      <td>{file.paths.length.toLocaleString(htmlLang)}</td>
                      <td>
                        {file.dateRange.start
                          ? `${formatDate(file.dateRange.start, htmlLang)} - ${formatDate(file.dateRange.end, htmlLang)}`
                          : content.results.noTimestamps
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Timeline overlap visualization */}
            {overallRange && (
              <div className={styles.timelineViz}>
                <h3>{content.results.dateCoverage}</h3>
                <div className={styles.timelineAxis}>
                  <span>{overallRange.start.getFullYear()}</span>
                  <span>{overallRange.end.getFullYear()}</span>
                </div>
                {parsedFiles.map((file, index) => {
                  if (!file.dateRange.start || !file.dateRange.end || overallRange.span === 0) {
                    return (
                      <div className={styles.timelineRow} key={index}>
                        <span className={styles.timelineFileName} title={file.filename}>{file.filename}</span>
                        <div className={styles.timelineBar}>
                          {/* No data to show */}
                        </div>
                      </div>
                    );
                  }

                  const leftPercent = ((file.dateRange.start.getTime() - overallRange.start.getTime()) / overallRange.span) * 100;
                  const widthPercent = ((file.dateRange.end.getTime() - file.dateRange.start.getTime()) / overallRange.span) * 100;

                  return (
                    <div className={styles.timelineRow} key={index}>
                      <span className={styles.timelineFileName} title={file.filename}>{file.filename}</span>
                      <div className={styles.timelineBar}>
                        <div
                          className={styles.timelineBarFill}
                          style={{
                            left: `${leftPercent}%`,
                            width: `${Math.max(widthPercent, 0.5)}%`,
                            backgroundColor: FILE_COLORS[index % FILE_COLORS.length],
                          }}
                        />
                        {/* Render overlap highlights for this row */}
                        {parsedFiles.map((otherFile, otherIndex) => {
                          if (otherIndex <= index) return null;
                          if (!otherFile.dateRange.start || !otherFile.dateRange.end) return null;

                          const oStart = Math.max(file.dateRange.start.getTime(), otherFile.dateRange.start.getTime());
                          const oEnd = Math.min(file.dateRange.end.getTime(), otherFile.dateRange.end.getTime());

                          if (oStart >= oEnd) return null;

                          const overlapLeft = ((oStart - overallRange.start.getTime()) / overallRange.span) * 100;
                          const overlapWidth = ((oEnd - oStart) / overallRange.span) * 100;

                          return (
                            <div
                              key={`overlap-${index}-${otherIndex}`}
                              className={styles.overlapHighlight}
                              style={{
                                left: `${overlapLeft}%`,
                                width: `${Math.max(overlapWidth, 0.3)}%`,
                              }}
                              title={interpolate(content.results.overlapWith, { fileName: otherFile.filename })}
                            />
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
                <div className={styles.timelineLegend}>
                  {parsedFiles.map((file, index) => (
                    <div className={styles.legendItem} key={index}>
                      <span
                        className={styles.legendSwatch}
                        style={{ backgroundColor: FILE_COLORS[index % FILE_COLORS.length] }}
                      ></span>
                      <span>{file.filename}</span>
                    </div>
                  ))}
                  <div className={styles.legendItem}>
                    <span className={styles.legendOverlap}></span>
                    <span>{content.results.overlap}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Dedup settings */}
            <div className={styles.dedupSettings}>
              <h3>{content.settings.title}</h3>
              <p className={styles.dedupSettingsDesc}>
                {content.settings.intro}
              </p>

              <div className={styles.sliderGroup}>
                <div className={styles.sliderLabel}>
                  <span>{content.settings.distanceLabel}</span>
                  <span className={styles.sliderValue}>{interpolate(content.results.distanceValue, { distance: distanceThreshold.toLocaleString(htmlLang) })}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="500"
                  value={distanceThreshold}
                  onChange={(e) => setDistanceThreshold(Number(e.target.value))}
                  className={styles.slider}
                />
                <p className={styles.sliderHint}>{content.settings.distanceHint}</p>
              </div>

              <div className={styles.sliderGroup}>
                <div className={styles.sliderLabel}>
                  <span>{content.settings.timeLabel}</span>
                  <span className={styles.sliderValue}>{interpolate(content.results.timeValue, { seconds: timeThreshold.toLocaleString(htmlLang) })}</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="300"
                  value={timeThreshold}
                  onChange={(e) => setTimeThreshold(Number(e.target.value))}
                  className={styles.slider}
                />
                <p className={styles.sliderHint}>{content.settings.timeHint}</p>
              </div>
            </div>

            {/* Merge button */}
            <button
              onClick={handleMerge}
              className={`${styles.mergeButton} ${isMerging ? styles.merging : ''}`}
              disabled={parsedFiles.length < 1 || isMerging}
            >
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
              {isMerging ? content.results.merging : interpolate(selectMessage(parsedFiles.length, content.results.mergeButton), {
                count: parsedFiles.length.toLocaleString(htmlLang),
              })}
            </button>

            {/* Merge results */}
            {mergeResult && (
              <>
                <div className={styles.mergeResults}>
                  <h3>{content.results.title}</h3>
                  <div className={styles.mergeStatsGrid}>
                    <div className={styles.mergeStat}>
                      <span className={styles.statValue}>{mergeResult.metadata.totalInputPoints.toLocaleString(htmlLang)}</span>
                      <span className={styles.statLabel}>{content.results.inputPoints}</span>
                    </div>
                    <div className={styles.mergeStat}>
                      <span className={styles.statValue}>{mergeResult.metadata.totalOutputPoints.toLocaleString(htmlLang)}</span>
                      <span className={styles.statLabel}>{content.results.outputPoints}</span>
                    </div>
                    <div className={styles.mergeStat}>
                      <span className={styles.statValue}>{mergeResult.metadata.duplicatesRemoved.toLocaleString(htmlLang)}</span>
                      <span className={styles.statLabel}>{content.results.duplicatesRemoved}</span>
                    </div>
                    <div className={styles.mergeStat}>
                      <span className={styles.statValue}>{mergeResult.metadata.fileCount.toLocaleString(htmlLang)}</span>
                      <span className={styles.statLabel}>{content.results.filesMerged}</span>
                    </div>
                  </div>

                  {mergeResult.metadata.overlapReports.length > 0 && (
                    <div className={styles.overlapDetails}>
                      <h4>{content.results.overlapDetails}</h4>
                      {mergeResult.metadata.overlapReports.map((report, index) => (
                        <div key={index} className={styles.overlapItem}>
                          <span
                            className={`${styles.overlapBadge} ${report.overlap.hasOverlap ? styles.overlapBadgeOverlap : styles.overlapBadgeNone}`}
                          >
                            {report.overlap.hasOverlap ? interpolate(selectMessage(report.overlap.days, content.results.dayCount), {
                              count: report.overlap.days.toLocaleString(htmlLang),
                            }) : content.results.none}
                          </span>
                          <span>
                            <RichText text={interpolate(content.results.filePair, { fileA: report.fileA, fileB: report.fileB })} />
                            {report.overlap.hasOverlap && (
                              <>{interpolate(content.results.overlapRange, {
                                startDate: formatDate(report.overlap.start, htmlLang), endDate: formatDate(report.overlap.end, htmlLang),
                              })}</>
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Export buttons */}
                <div className={styles.exportButtons}>
                  <button onClick={handleDownloadJSON} className={styles.exportButton}>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    {content.results.downloadJson}
                  </button>
                  <button onClick={handleDownloadGPX} className={styles.exportButton}>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    {content.results.downloadGpx}
                  </button>
                </div>

                {/* Post-upload CTA */}
                <div className={styles.postCtaPanel}>
                  <h3>{content.cta.postTitle}</h3>
                  <p>{content.cta.postBody}</p>
                  <SmartLink href="/?utm_source=tool&utm_medium=post-merge-cta&utm_campaign=timeline-merger" className={styles.ctaButton}>{content.cta.button}</SmartLink>
                </div>
              </>
            )}
          </div>
        )}

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
            <h3>{content.cta.bottomTitle}</h3>
            <p>{content.cta.bottomBody}</p>
            <SmartLink href="/?utm_source=tool&utm_medium=bottom-cta&utm_campaign=timeline-merger" className={styles.ctaButton}>{content.cta.button}</SmartLink>
          </div>
        </div>
      </div>
        <RelatedTools slug="timeline-merger" />
      </main>
    </Layout>
  );
}
