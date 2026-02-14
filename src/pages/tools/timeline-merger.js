import React, { useState, useCallback } from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import FileUploader from '@site/src/components/FileUploader';
import { parseTimeline } from '@site/src/utils/timelineParser';
import { mergeWithDedup } from '@site/src/utils/timelineDedup';
import { timelineToConverterPoints } from '@site/src/utils/timelineToFormat';
import { toGPX } from '@site/src/utils/formatConverters';
import styles from './timeline-merger.module.css';

const pageTitle = "Google Timeline Data Merger - Combine Location History Exports";
const pageDescription = "Free tool to merge multiple Google Timeline exports into one file. Smart deduplication removes overlapping data points. Combine Records.json, Semantic History, and phone exports. Privacy-first.";
const pageUrl = "https://dawarich.app/tools/timeline-merger";
const imageUrl = "https://dawarich.app/img/meta-image.jpg";

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

const faqItems = [
  {
    question: "Is it safe to upload my Google Timeline data?",
    answer: "Yes. All data processing happens entirely in your browser using JavaScript. Your location history files are never uploaded to any server. The files are read locally, parsed, merged, and exported without any network requests. When you close the tab, the data is gone. The tool is also open source, so you can verify the code."
  },
  {
    question: "How does deduplication work?",
    answer: "The deduplication algorithm sorts all points by timestamp, then compares each point to the previous one. If two consecutive points are within both the distance threshold (default 50 meters) and time threshold (default 60 seconds), the duplicate is removed. When a duplicate is found, the point with more metadata (such as place names or activity types) is kept. You can adjust both thresholds using the sliders before merging."
  },
  {
    question: "Can I merge different format types?",
    answer: "Yes. The merger supports all Google Timeline export formats: Records.json from Google Takeout, Semantic Location History monthly files (like 2022_APRIL.json), and the newer phone-based Timeline exports with semanticSegments. You can mix and match any combination of these formats. The parser auto-detects each file's format and normalizes the data before merging."
  },
  {
    question: "What happens to overlapping data?",
    answer: "Overlapping data is handled by the deduplication step. When two files cover the same time period, you will likely have duplicate location points recorded at the same time and place. The merger identifies these duplicates based on proximity in both space and time, then keeps only one copy of each point (preferring the copy with richer metadata). The overlap report shows you exactly which files overlap and by how many days."
  },
  {
    question: "Will merging lose any of my data?",
    answer: "No meaningful data is lost. The deduplication only removes true duplicates, points that are essentially the same location recorded at the same time from multiple export sources. All unique points, place visits, activity segments, and paths from every file are preserved in the merged output. If you want to be safe, you can set the distance threshold to 0 to disable deduplication entirely."
  },
  {
    question: "What export formats are available?",
    answer: "You can export the merged data as JSON (an array of all deduplicated location points with full metadata) or as GPX (a standard GPS format compatible with most mapping applications, fitness trackers, and GIS tools). The JSON export preserves all original metadata like place names, addresses, and activity types. The GPX export converts place visits to waypoints and location records to track points."
  },
  {
    question: "How many files can I merge at once?",
    answer: "There is no hard limit on the number of files. The tool has been tested with over 10 files simultaneously, including large Records.json files with hundreds of thousands of points. Processing time depends on the total number of points across all files and your device's processing power. A typical merge of 3-5 files with a combined 500,000 points takes 10-30 seconds on a modern computer."
  }
];

function formatDate(date) {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString('en-US', {
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
          setError(`Error parsing ${file.filename}: ${err.message}`);
        }
      }

      setParsedFiles(parsed);
    } catch (err) {
      setError(`Error processing files: ${err.message}`);
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
      setError(`Error merging files: ${err.message}`);
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
        <meta name="keywords" content="merge google timeline exports, combine location history files, google timeline data recovery, merge Records.json, combine Google Takeout location, merge semantic location history, Google Timeline merger, location history deduplication, merge GPS data" />
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

        {/* JSON-LD Structured Data - WebApplication */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Google Timeline Data Merger",
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
              "Merge multiple Google Timeline exports into one file",
              "Smart deduplication removes overlapping data points",
              "Support for Records.json, Semantic Location History, and phone exports",
              "Adjustable distance and time thresholds for deduplication",
              "Visual timeline overlap report",
              "Export as JSON or GPX",
              "Privacy-first - all processing in browser",
              "No data sent to any server"
            ]
          })}
        </script>

        {/* JSON-LD Structured Data - HowTo */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to Merge Google Timeline Exports",
            "description": "Combine multiple Google Timeline export files into a single unified dataset with smart deduplication.",
            "step": [
              {
                "@type": "HowToStep",
                "name": "Export your Google Timeline data",
                "text": "Use Google Takeout, Android, or iOS to export your Google Timeline data. Export using multiple methods if possible to ensure you have all your data."
              },
              {
                "@type": "HowToStep",
                "name": "Upload your JSON files",
                "text": "Drag and drop all your exported Google Timeline JSON files into the merger tool. The tool auto-detects Records.json, Semantic Location History, and phone export formats."
              },
              {
                "@type": "HowToStep",
                "name": "Review file summary and overlaps",
                "text": "Check the file summary table and timeline visualization to see how your files overlap. The tool shows date ranges, point counts, and detected formats for each file."
              },
              {
                "@type": "HowToStep",
                "name": "Adjust deduplication settings",
                "text": "Set the distance threshold (10-500 meters) and time threshold (10-300 seconds) for deduplication. Points within both thresholds are considered duplicates."
              },
              {
                "@type": "HowToStep",
                "name": "Merge and export",
                "text": "Click Merge Files to combine all data with deduplication. Download the result as JSON (preserves all metadata) or GPX (compatible with mapping applications)."
              }
            ],
            "tool": {
              "@type": "HowToTool",
              "name": "Google Timeline Data Merger by Dawarich"
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
              "name": item.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer
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
                "name": "Home",
                "item": "https://dawarich.app"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Free Tools",
                "item": "https://dawarich.app/tools"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Google Timeline Data Merger",
                "item": pageUrl
              }
            ]
          })}
        </script>
      </Head>

      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          <div className={styles.header}>
            <h1>Google Timeline Data Merger</h1>
            <p>Merge multiple Google Timeline exports into one unified file. Smart deduplication removes overlapping data points while preserving all unique location records. Free, privacy-first, and entirely in your browser.</p>
          </div>

          <div className={styles.topSection}>
            <div className={styles.useCases}>
              <h2>Why Merge Timeline Exports?</h2>
              <p>
                Google provides multiple ways to export Timeline data, each capturing different information. Combining them gives you the most complete location history possible.
              </p>
              <div className={styles.useCasesList}>
                <div className={styles.useCaseItem}>
                  <strong>Multiple export methods:</strong>
                  <p>Google Takeout, phone-based export, and Semantic Location History each contain different data. Merging captures everything from every source.</p>
                </div>
                <div className={styles.useCaseItem}>
                  <strong>Data recovery:</strong>
                  <p>After Google's 2024 Timeline migration, many users have partial exports from different dates. Merge them to reconstruct as much history as possible.</p>
                </div>
                <div className={styles.useCaseItem}>
                  <strong>Combining old and new exports:</strong>
                  <p>Exported your Timeline in 2022 and again in 2024? Merge both exports to get continuous coverage without duplicate entries.</p>
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
                    Privacy First
                  </strong>
                  <p>All merging and deduplication happens entirely in your browser. Your location data never leaves your device and is not sent to any server.</p>
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
                <span>Want to visualize your Timeline data first? Try our <a href="/tools/timeline-visualizer?utm_source=tool&utm_medium=inline-cta&utm_campaign=timeline-merger">Google Timeline Visualizer</a> to explore your location history on an interactive map. Need a long-term Timeline replacement? <a href="/?utm_source=tool&utm_medium=inline-cta&utm_campaign=timeline-merger">Dawarich</a> gives you full data ownership.</span>
              </div>
            </div>
          )}

          {hasFiles && (
            <div className={styles.ctaPanel}>
              <div className={styles.ctaContent}>
                <h3>Want to keep your merged location data safe and always accessible?</h3>
                <p>Dawarich stores your complete location history securely with automatic backups, full encryption, and an interactive map you can explore anytime.</p>
                <a href="/?utm_source=tool&utm_medium=cta&utm_campaign=timeline-merger" className={styles.ctaButton}>Try Dawarich!</a>
              </div>
            </div>
          )}
        </div>

        {isParsing && (
          <div className={styles.resultsSection}>
            <div className={styles.processingIndicator}>
              <div className={styles.spinner}></div>
              Parsing uploaded files...
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
              <h3>Uploaded Files ({parsedFiles.length})</h3>
              <table className={styles.fileSummaryTable}>
                <thead>
                  <tr>
                    <th>File</th>
                    <th>Format</th>
                    <th>Points</th>
                    <th>Paths</th>
                    <th>Date Range</th>
                  </tr>
                </thead>
                <tbody>
                  {parsedFiles.map((file, index) => (
                    <tr key={index} className={styles.fileSummaryRow}>
                      <td>
                        <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, backgroundColor: FILE_COLORS[index % FILE_COLORS.length], marginRight: 8, verticalAlign: 'middle' }}></span>
                        {file.filename}
                      </td>
                      <td><span className={styles.formatBadge}>{file.metadata?.format || 'unknown'}</span></td>
                      <td>{file.points.length.toLocaleString()}</td>
                      <td>{file.paths.length.toLocaleString()}</td>
                      <td>
                        {file.dateRange.start
                          ? `${formatDate(file.dateRange.start)} - ${formatDate(file.dateRange.end)}`
                          : 'No timestamps'
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
                <h3>Date Coverage</h3>
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
                              title={`Overlap with ${otherFile.filename}`}
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
                    <span>Overlap</span>
                  </div>
                </div>
              </div>
            )}

            {/* Dedup settings */}
            <div className={styles.dedupSettings}>
              <h3>Deduplication Settings</h3>
              <p className={styles.dedupSettingsDesc}>
                Adjust how aggressively duplicate points are detected. Two points are considered duplicates if they are within both the distance and time thresholds of each other. The point with richer metadata is kept.
              </p>

              <div className={styles.sliderGroup}>
                <div className={styles.sliderLabel}>
                  <span>Distance Threshold</span>
                  <span className={styles.sliderValue}>{distanceThreshold}m</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="500"
                  value={distanceThreshold}
                  onChange={(e) => setDistanceThreshold(Number(e.target.value))}
                  className={styles.slider}
                />
                <p className={styles.sliderHint}>Points closer than this distance may be duplicates (10m = strict, 500m = aggressive)</p>
              </div>

              <div className={styles.sliderGroup}>
                <div className={styles.sliderLabel}>
                  <span>Time Threshold</span>
                  <span className={styles.sliderValue}>{timeThreshold}s</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="300"
                  value={timeThreshold}
                  onChange={(e) => setTimeThreshold(Number(e.target.value))}
                  className={styles.slider}
                />
                <p className={styles.sliderHint}>Points recorded within this time window may be duplicates (10s = strict, 300s = aggressive)</p>
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
              {isMerging ? 'Merging...' : `Merge ${parsedFiles.length} File${parsedFiles.length !== 1 ? 's' : ''}`}
            </button>

            {/* Merge results */}
            {mergeResult && (
              <>
                <div className={styles.mergeResults}>
                  <h3>Merge Results</h3>
                  <div className={styles.mergeStatsGrid}>
                    <div className={styles.mergeStat}>
                      <span className={styles.statValue}>{mergeResult.metadata.totalInputPoints.toLocaleString()}</span>
                      <span className={styles.statLabel}>Input Points</span>
                    </div>
                    <div className={styles.mergeStat}>
                      <span className={styles.statValue}>{mergeResult.metadata.totalOutputPoints.toLocaleString()}</span>
                      <span className={styles.statLabel}>Output Points</span>
                    </div>
                    <div className={styles.mergeStat}>
                      <span className={styles.statValue}>{mergeResult.metadata.duplicatesRemoved.toLocaleString()}</span>
                      <span className={styles.statLabel}>Duplicates Removed</span>
                    </div>
                    <div className={styles.mergeStat}>
                      <span className={styles.statValue}>{mergeResult.metadata.fileCount}</span>
                      <span className={styles.statLabel}>Files Merged</span>
                    </div>
                  </div>

                  {mergeResult.metadata.overlapReports.length > 0 && (
                    <div className={styles.overlapDetails}>
                      <h4>Overlap Details</h4>
                      {mergeResult.metadata.overlapReports.map((report, index) => (
                        <div key={index} className={styles.overlapItem}>
                          <span
                            className={`${styles.overlapBadge} ${report.overlap.hasOverlap ? styles.overlapBadgeOverlap : styles.overlapBadgeNone}`}
                          >
                            {report.overlap.hasOverlap ? `${report.overlap.days} day${report.overlap.days !== 1 ? 's' : ''}` : 'None'}
                          </span>
                          <span>
                            <strong>{report.fileA}</strong> and <strong>{report.fileB}</strong>
                            {report.overlap.hasOverlap && (
                              <> overlap from {formatDate(report.overlap.start)} to {formatDate(report.overlap.end)}</>
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
                    Download as JSON
                  </button>
                  <button onClick={handleDownloadGPX} className={styles.exportButton}>
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download as GPX
                  </button>
                </div>

                {/* Post-upload CTA */}
                <div className={styles.postCtaPanel}>
                  <h3>Never risk losing your location data again</h3>
                  <p>Dawarich stores everything securely with full backup, end-to-end encryption, and an interactive map. Import your merged Timeline data and keep tracking automatically.</p>
                  <a href="/?utm_source=tool&utm_medium=post-merge-cta&utm_campaign=timeline-merger" className={styles.ctaButton}>Try Dawarich Free for 7 Days</a>
                </div>
              </>
            )}
          </div>
        )}

        <div className={styles.infoSection}>
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <h2>What Is the Timeline Data Merger?</h2>
              <p>The Timeline Data Merger is a free browser-based tool that combines multiple Google Timeline export files into a single, unified dataset. When you export your Google location history using different methods (Google Takeout, phone export, Semantic History), you often end up with overlapping files containing duplicate data points. This tool intelligently merges them, removing duplicates while preserving every unique location record.</p>
              <p>All processing happens locally in your browser. Your location data is never transmitted to any server, making it safe to use even with sensitive personal location history spanning years.</p>
            </div>

            <div className={styles.infoCard}>
              <h2>How Deduplication Works</h2>
              <p>The deduplication algorithm uses a two-factor approach to identify duplicate location points:</p>
              <ul>
                <li><strong>Spatial proximity</strong> -- Points within the distance threshold (default 50 meters) are candidates for deduplication</li>
                <li><strong>Temporal proximity</strong> -- Points must also be within the time threshold (default 60 seconds) to be considered duplicates</li>
                <li><strong>Both conditions required</strong> -- A point is only removed as a duplicate if it matches on both distance AND time</li>
                <li><strong>Metadata preservation</strong> -- When duplicates are found, the version with more metadata (place names, addresses, activity types) is kept</li>
              </ul>
              <p>Points are sorted chronologically before deduplication, ensuring consistent results regardless of upload order.</p>
            </div>

            <div className={styles.infoCard}>
              <h2>Why Merge Timeline Exports?</h2>
              <p>There are several common scenarios where merging Google Timeline data is essential:</p>
              <ul>
                <li><strong>Multiple export sources</strong> -- Google Takeout, Android export, and iOS export each capture different subsets of your data</li>
                <li><strong>Recovering from Google's 2024 migration</strong> -- When Google moved Timeline to on-device storage, many users made multiple partial exports. Merging recovers the most complete history</li>
                <li><strong>Periodic backups</strong> -- If you exported in 2021 and again in 2024, merging creates a continuous dataset spanning both periods</li>
                <li><strong>Device transitions</strong> -- Switched phones? Merge exports from your old and new devices</li>
              </ul>
            </div>

            <div className={styles.infoCard}>
              <h2>What Happened to Google Maps Timeline?</h2>
              <p>In late 2024, Google discontinued the web version of Google Maps Timeline and moved all location data to on-device storage. Only the last 90 days of data were automatically transferred to users' phones. Older location history was permanently deleted unless users had manually exported it before the deadline.</p>
              <p>This left millions of users with fragmented data: partial Takeout exports, phone exports of recent data, and Semantic Location History files from different periods. The Timeline Data Merger helps piece these fragments back together into a complete location history.</p>
              <p>For ongoing location tracking with full data ownership, consider <a href="/?utm_source=tool&utm_medium=info-section&utm_campaign=timeline-merger">Dawarich</a> as a self-hosted or cloud-based replacement.</p>
            </div>

            <div className={styles.infoCard}>
              <h2>Supported Formats</h2>
              <p>The merger automatically detects and processes all Google Timeline export formats:</p>
              <ul>
                <li><strong>Records.json</strong> -- Raw GPS records from Google Takeout in E7 coordinate format. These files are typically the largest, containing every location ping</li>
                <li><strong>Semantic Location History</strong> -- Monthly files (e.g., 2022_APRIL.json) with structured place visits, addresses, and activity segments</li>
                <li><strong>Phone Timeline Export</strong> -- Newer format from Google Maps on Android/iOS with semanticSegments and timeline paths</li>
                <li><strong>Settings &amp; TimelineEdits</strong> -- Additional metadata files from Google Takeout exports</li>
              </ul>
              <p>You can mix any combination of these formats in a single merge operation.</p>
            </div>

            <div className={styles.infoCard}>
              <h2>Related Tools</h2>
              <ul>
                <li><a href="/tools/timeline-visualizer">Google Timeline Visualizer</a> -- View your location history on an interactive map</li>
                <li><a href="/tools/heatmap-generator">GPS Heatmap Generator</a> -- Create heatmaps from GPX, FIT, TCX, and other GPS files</li>
                <li><a href="/tools/gpx-merger">GPX Track Merger</a> -- Combine multiple GPX files into one</li>
                <li><a href="/tools/photo-geotagging">Photo Geodata Extraction</a> -- Extract GPS coordinates from your photos</li>
                <li><a href="/tools/geojson-to-gpx">GeoJSON to GPX Converter</a> -- Convert location data to GPX format</li>
              </ul>
              <p>Read more: <a href="/blog/migrating-from-google-location-history-to-dawarich">Migrating from Google Location History</a></p>
            </div>
          </div>
        </div>

        <div className={styles.faqSection}>
          <h2>Frequently Asked Questions</h2>
          <div className={styles.faqList}>
            {faqItems.map((item, index) => (
              <details key={index} className={styles.faqItem}>
                <summary className={styles.faqQuestion}>{item.question}</summary>
                <p className={styles.faqAnswer}>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>

        <div className={styles.bottomCtaPanel}>
          <div className={styles.ctaContent}>
            <h3>Looking for a Long-Term Google Timeline Replacement?</h3>
            <p>Dawarich is an open-source location tracking platform that gives you full control over your data. Import your merged Google Timeline export, track ongoing location from your phone, and visualize years of movement history -- all self-hosted or in the cloud.</p>
            <a href="/?utm_source=tool&utm_medium=bottom-cta&utm_campaign=timeline-merger" className={styles.ctaButton}>Try Dawarich Free for 7 Days</a>
          </div>
        </div>
      </div>
    </Layout>
  );
}
