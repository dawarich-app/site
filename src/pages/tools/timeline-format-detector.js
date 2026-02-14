import React, { useState, useCallback } from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import FileUploader from '@site/src/components/FileUploader';
import { parseTimeline, detectFormat } from '@site/src/utils/timelineParser';
import styles from './timeline-format-detector.module.css';

const pageTitle = "Google Timeline Format Detector - Identify Your Location Export File Type";
const pageDescription = "Free tool to detect your Google Timeline export format. Upload any Google Takeout location file to instantly see the format name, point count, date range, file size, and data quality. All processing in your browser.";
const pageUrl = "https://dawarich.app/tools/timeline-format-detector";
const imageUrl = "https://dawarich.app/img/meta-image.jpg";

const formatNames = {
  records: 'Records.json (Raw GPS Data)',
  semantic: 'Semantic Location History',
  settings: 'Settings.json (Device Info)',
  timelineEdits: 'Timeline Edits',
  semanticSegments: 'Semantic Segments',
  locationHistory: 'Location History (New Format)',
  unknown: 'Unknown Format',
};

const formatDescriptions = {
  records: 'This is the classic Google Takeout export containing raw GPS coordinates in E7 format. It includes every location ping recorded by Google, along with accuracy, altitude, velocity, and device metadata. These files can be very large (100+ MB for years of data).',
  semantic: 'This format contains structured monthly location data with place visits (including addresses and business names) and activity segments (walking, driving, cycling). Files are named like 2022_APRIL.json.',
  settings: 'This file contains device configuration information from your Google Timeline export. It lists devices that contributed location data but does not contain GPS coordinates.',
  timelineEdits: 'This format contains edits and corrections made to your Timeline data, including place aggregates and raw signals. It may contain some location points from user modifications.',
  semanticSegments: 'This is a parsed version of the location history with semantic segments containing timeline paths. It includes geo-coordinates in string format and time ranges for each segment.',
  locationHistory: 'This is the newer Google Timeline export format from Android/iOS phone exports. It contains visit and activity data with geo-coordinates in string format, timeline paths, and probability scores.',
  unknown: 'The format of this file could not be identified. It may not be a Google Timeline export, or it could be a format variant not yet supported.',
};

const relatedTools = [
  {
    name: 'Google Timeline Converter',
    href: '/tools/google-timeline-converter',
    description: 'Convert your Timeline data to GPX, GeoJSON, or KML',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
  {
    name: 'Timeline Visualizer',
    href: '/tools/timeline-visualizer',
    description: 'View your location history on an interactive map',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
  },
  {
    name: 'Statistics Analyzer',
    href: '/tools/timeline-statistics',
    description: 'Get detailed stats about your location data',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
  },
  {
    name: 'File Splitter',
    href: '/tools/gps-file-splitter',
    description: 'Split large Timeline files into smaller chunks',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
  },
  {
    name: 'Data Merger',
    href: '/tools/timeline-merger',
    description: 'Combine multiple Timeline files into one',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16v2a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h2m10 0h4a2 2 0 012 2v8a2 2 0 01-2 2h-4m-6-4l4-4m0 0l4 4m-4-4v12" />
      </svg>
    ),
  },
  {
    name: 'Mileage Calculator',
    href: '/tools/timeline-mileage-calculator',
    description: 'Calculate total distance traveled from your data',
    icon: (
      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
];

const faqItems = [
  {
    question: "What Google Timeline formats does this tool detect?",
    answer: "This tool detects all six known Google Timeline export formats: Records.json (raw GPS data from Google Takeout), Semantic Location History (monthly files with place visits and activity segments), Settings.json (device information), Timeline Edits (user corrections), Semantic Segments (parsed location history with timeline paths), and Location History (the newer phone-based export format from Android and iOS). The format is identified automatically the moment you upload a file."
  },
  {
    question: "Is my data safe when I upload it here?",
    answer: "Yes. All data processing happens entirely in your browser using JavaScript. Your Google Timeline files are never uploaded to any server — they stay on your device the entire time. When you close the tab, the data is gone. The tool is open source, so you can verify exactly what the code does. No accounts, no sign-ups, no tracking."
  },
  {
    question: "What happened to Google Maps Timeline?",
    answer: "In late 2024, Google discontinued the web-based version of Google Maps Timeline and moved all location data to on-device storage on your phone. Users were given a limited window to export their data — only the last 90 days were automatically migrated, and older data was deleted unless manually backed up through Google Takeout. Many users lost years of location history. This tool helps you understand what format your exported files are in so you can use them with the right tools."
  },
  {
    question: "How do I export my Google Timeline data?",
    answer: "There are three methods: (1) Google Takeout at takeout.google.com — select Location History and export as JSON. This produces Records.json, Semantic Location History files, Settings.json, and Timeline Edits. (2) On Android: Google Maps > Settings > Location > Location Services > Timeline > Export Timeline. This produces the newer Location History format. (3) On iOS: Google Maps > Settings > Personal Content > Export Timeline data. We recommend trying all methods and keeping all exported files."
  },
  {
    question: "What's the difference between Records.json and Semantic Location History?",
    answer: "Records.json contains raw GPS coordinates — every single location ping Google recorded, with timestamps, accuracy values, altitude, and velocity. These files are very large and contain the most granular data. Semantic Location History files (named like 2022_APRIL.json) are more structured: they contain place visits with business names and addresses, activity segments (walking, driving, cycling) with routes, and duration information. Records.json is best for precise location data; Semantic files are best for understanding where you went and how you got there."
  },
  {
    question: "Which tool should I use after detecting my format?",
    answer: "It depends on what you want to do. To see your data on a map, use the Timeline Visualizer. To convert to GPX/GeoJSON/KML for use in other apps, use the Google Timeline Converter. To understand your travel patterns and statistics, use the Statistics Analyzer. If your file is too large, the File Splitter can break it into smaller pieces. If you have multiple export files, the Data Merger can combine them. For distance calculations, use the Mileage Calculator."
  },
  {
    question: "Why can't the tool detect my file's format?",
    answer: "If the tool shows 'Unknown Format', your file may not be a Google Timeline export. Common reasons include: uploading a non-JSON file (the tool only accepts .json files), uploading a Google Takeout file from a different service (like YouTube or Chrome), or uploading a corrupted or truncated file. Make sure you're uploading files from the Location History section of your Google Takeout export."
  },
  {
    question: "Can I detect the format of multiple files at once?",
    answer: "Yes. You can upload multiple JSON files simultaneously. The tool will analyze each file individually and display the detected format, point count, path count, date range, and data quality for every file. This is useful when you have a full Google Takeout export with multiple files (Records.json, Semantic files, Settings.json, etc.)."
  }
];

function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatDate(dateStr) {
  if (!dateStr) return null;
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return null;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return null;
  }
}

export default function TimelineFormatDetector() {
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
          formatName: 'Parse Error',
          formatDescription: `Could not parse this file: ${error.message}`,
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
        <meta name="keywords" content="google timeline format, what format is my google export, google takeout location file type, google location history format, google timeline file detector, google maps timeline export format, google takeout json format, location history file type, google timeline data format, identify google export file" />
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
            "name": "Google Timeline Format Detector",
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
              "Detect Google Timeline export format instantly",
              "Support for all 6 Google Timeline formats",
              "Show point count, path count, and date range",
              "Data quality indicators",
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
            "name": "How to Identify Your Google Timeline Export Format",
            "description": "Upload your Google Timeline export file to instantly detect its format, see statistics, and get recommendations for what to do next.",
            "step": [
              {
                "@type": "HowToStep",
                "name": "Export your Google Timeline data",
                "text": "Visit takeout.google.com, select Location History (Timeline), and export. Alternatively, on Android: Google Maps > Settings > Location > Timeline > Export. On iOS: Google Maps > Settings > Personal Content > Export Timeline data."
              },
              {
                "@type": "HowToStep",
                "name": "Upload your JSON file",
                "text": "Drag and drop your exported Google Timeline JSON file into the detector. The tool automatically identifies the format within seconds."
              },
              {
                "@type": "HowToStep",
                "name": "Review your results",
                "text": "See the detected format, point count, path count, date range, file size, and data quality indicators. Then follow the recommended tool links based on your format."
              }
            ],
            "tool": {
              "@type": "HowToTool",
              "name": "Google Timeline Format Detector by Dawarich"
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
                "name": "Google Timeline Format Detector",
                "item": pageUrl
              }
            ]
          })}
        </script>
      </Head>
      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          <div className={styles.header}>
            <h1>Google Timeline Format Detector</h1>
            <p>Upload any Google Timeline export file to instantly identify its format, see data statistics, and get recommendations for what to do next. All processing happens in your browser.</p>
          </div>

          <div className={styles.topSection}>
            <div className={styles.instructions}>
              <h2>How to Get Your Timeline Data</h2>
              <p>
                You can export your Google Timeline data using one of the following methods. If one of them doesn't work, try another.
              </p>
              <p>
                Unfortunately, some users might not be able to export their location data due to how Google went with transition to new location storage policies.
              </p>
              <div className={styles.instructionsList}>
                <div className={styles.instructionItem}>
                  <strong>Google Takeout:</strong>
                  <p>Visit <a href="https://takeout.google.com/" target="_blank" rel="noopener noreferrer">takeout.google.com</a> &rarr; Choose Location History (Timeline) &rarr; Export</p>
                  <p>This way might not work for everyone because Google changed the way location data is being stored and exported. More details in our <a href="https://dawarich.app/blog/migrating-from-google-location-history-to-dawarich">blog</a>.</p>
                </div>
                <div className={styles.instructionItem}>
                  <strong>On Android:</strong>
                  <p>Open Google Maps &rarr; Settings &rarr; Location &rarr; Location Services &rarr; Timeline &rarr; Export Timeline</p>
                </div>
                <div className={styles.instructionItem}>
                  <strong>On iOS:</strong>
                  <p>Open Google Maps &rarr; Settings &rarr; Personal Content &rarr; Export Timeline data</p>
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
                  <p>All data processing happens entirely in your browser. Your location data never leaves your device and is not sent to any server.</p>
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
                <span>Not sure what to do with your Google Timeline data? Upload your file above to find out, or explore <a href="/?utm_source=tool&utm_medium=inline-cta&utm_campaign=timeline-format-detector">Dawarich</a> for automatic location tracking with full data ownership.</span>
              </div>
            </div>
          )}

          {results.length > 0 && (
            <>
              <div className={styles.ctaPanel}>
                <div className={styles.ctaContent}>
                  <h3>Now that you know your format, explore what Dawarich can do with your location data.</h3>
                  <p>Import your Google Timeline export, track ongoing location from your phone, and visualize years of movement history — all self-hosted or in the cloud.</p>
                  <a href="/?utm_source=tool&utm_medium=cta&utm_campaign=timeline-format-detector" className={styles.ctaButton}>Try Dawarich!</a>
                </div>
              </div>

              <div className={styles.resultsSection}>
                <h2>Detection Results</h2>

                {results.length > 1 && (
                  <div className={styles.resultsSummary}>
                    <span>{results.length} files analyzed</span>
                    <span className={styles.resultsSummaryDot}>&middot;</span>
                    <span>{totalPoints.toLocaleString()} total points</span>
                    <span className={styles.resultsSummaryDot}>&middot;</span>
                    <span>{totalPaths.toLocaleString()} total paths</span>
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
                        <span className={styles.statLabel}>Points</span>
                        <span className={styles.statValue}>{result.pointCount.toLocaleString()}</span>
                      </div>
                      <div className={styles.statItem}>
                        <span className={styles.statLabel}>Paths</span>
                        <span className={styles.statValue}>{result.pathCount.toLocaleString()}</span>
                      </div>
                      <div className={styles.statItem}>
                        <span className={styles.statLabel}>File Size</span>
                        <span className={styles.statValue}>{formatFileSize(result.fileSize)}</span>
                      </div>
                      <div className={styles.statItem}>
                        <span className={styles.statLabel}>Date Range</span>
                        <span className={styles.statValue}>
                          {result.minDate && result.maxDate
                            ? `${formatDate(result.minDate)} — ${formatDate(result.maxDate)}`
                            : 'No dates found'}
                        </span>
                      </div>
                    </div>

                    {(result.pointCount > 0 || result.pathCount > 0) && (
                      <div className={styles.qualitySection}>
                        <h4>Data Quality</h4>
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
                                ? `${Math.round((result.pointsWithTimestamp / result.pointCount) * 100)}% have timestamps`
                                : 'No timestamp data'}
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
                                ? `${Math.round((result.pointsWithAccuracy / result.pointCount) * 100)}% have accuracy info`
                                : 'No accuracy data'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {!result.error && (result.pointCount > 0 || result.pathCount > 0) && (
                      <div className={styles.recommendedTools}>
                        <h4>Recommended Tools</h4>
                        <div className={styles.toolLinks}>
                          {relatedTools.map((tool, toolIndex) => (
                            <a
                              key={toolIndex}
                              href={`${tool.href}?utm_source=tool&utm_medium=recommendation&utm_campaign=timeline-format-detector`}
                              className={styles.toolLink}
                            >
                              <span className={styles.toolIcon}>{tool.icon}</span>
                              <div>
                                <strong>{tool.name}</strong>
                                <span>{tool.description}</span>
                              </div>
                            </a>
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
            <div className={styles.infoCard}>
              <h2>What Is a Google Timeline Format Detector?</h2>
              <p>When you export your Google Timeline data through Google Takeout or your phone, you get JSON files in several possible formats. Each format has a different structure, different data fields, and is suited for different tools. This detector reads your file, identifies the format, and tells you exactly what you're working with — so you know which conversion tool, visualizer, or analysis method to use.</p>
              <p>The detection happens instantly in your browser. Your data never leaves your device.</p>
            </div>

            <div className={styles.infoCard}>
              <h2>Google Timeline Export Formats Explained</h2>
              <ul>
                <li><strong>Records.json</strong> — Raw GPS data in E7 coordinate format with timestamps, accuracy, altitude, and velocity. The largest and most detailed format</li>
                <li><strong>Semantic Location History</strong> — Monthly files with place visits (addresses, names) and activity segments (walking, driving)</li>
                <li><strong>Location History (New)</strong> — Phone-based export with visits, activities, and geo-coordinates in string format</li>
                <li><strong>Semantic Segments</strong> — Timeline paths with geo-coordinates and time ranges</li>
                <li><strong>Settings.json</strong> — Device metadata, no GPS coordinates</li>
                <li><strong>Timeline Edits</strong> — User corrections and place aggregates</li>
              </ul>
            </div>

            <div className={styles.infoCard}>
              <h2>Why Does the Format Matter?</h2>
              <p>Different formats contain different types of data. Records.json has the most precise location coordinates but no place names. Semantic Location History has addresses and activity types but fewer raw GPS points. The newer phone export format combines both but uses a different coordinate encoding.</p>
              <p>Knowing your format helps you choose the right tool: converters need to know the input format, visualizers handle different fields, and statistics analyzers extract different metrics depending on the format.</p>
            </div>

            <div className={styles.infoCard}>
              <h2>What Happened to Google Maps Timeline?</h2>
              <p>In late 2024, Google shut down the web version of Google Maps Timeline and moved all location data to on-device storage. Only the last 90 days were migrated — older data was deleted unless users manually backed it up. Many people <a href="https://www.reddit.com/r/GoogleMaps/comments/1diivt3/megathread_google_maps_timeline_moving_to/" target="_blank" rel="noopener noreferrer">lost years of location history</a> in the transition.</p>
              <p>If you have exported files, this detector helps you understand what you've got. For a long-term replacement, <a href="/?utm_source=tool&utm_medium=info-section&utm_campaign=timeline-format-detector">Dawarich</a> offers self-hosted and cloud-based location tracking with full data ownership.</p>
            </div>

            <div className={styles.infoCard}>
              <h2>Data Quality Indicators</h2>
              <p>The detector shows two key quality metrics for your data:</p>
              <ul>
                <li><strong>Timestamp coverage</strong> — What percentage of data points include a timestamp. High coverage means you can filter by date, calculate travel times, and build timelines</li>
                <li><strong>Accuracy coverage</strong> — What percentage of data points include GPS accuracy values. This helps you assess how precise the location data is (lower accuracy values mean more precise GPS readings)</li>
              </ul>
              <p>Records.json typically has the highest quality scores, while Semantic Location History prioritizes structured data over raw GPS precision.</p>
            </div>

            <div className={styles.infoCard}>
              <h2>Related Tools</h2>
              <ul>
                <li><a href="/tools/timeline-visualizer">Timeline Visualizer</a> — View your location history on an interactive map</li>
                <li><a href="/tools/google-timeline-converter">Google Timeline Converter</a> — Convert to GPX, GeoJSON, or KML</li>
                <li><a href="/tools/timeline-statistics">Statistics Analyzer</a> — Get detailed stats about your data</li>
                <li><a href="/tools/gps-file-splitter">File Splitter</a> — Split large files into smaller chunks</li>
                <li><a href="/tools/timeline-merger">Data Merger</a> — Combine multiple Timeline files</li>
                <li><a href="/tools/timeline-mileage-calculator">Mileage Calculator</a> — Calculate total distance traveled</li>
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
            <h3>Looking for a Google Timeline Replacement?</h3>
            <p>Dawarich is an open-source location tracking platform that gives you full control over your data. Import your Google Timeline export, track ongoing location from your phone, and visualize years of movement history — all self-hosted or in the cloud.</p>
            <a href="/?utm_source=tool&utm_medium=bottom-cta&utm_campaign=timeline-format-detector" className={styles.ctaButton}>Try Dawarich Free for 7 Days</a>
          </div>
        </div>
      </div>
    </Layout>
  );
}
