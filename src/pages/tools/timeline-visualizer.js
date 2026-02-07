import React, { useState, useCallback } from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import FileUploader from '@site/src/components/FileUploader';
import TimelineMap from '@site/src/components/TimelineMap';
import PointsList from '@site/src/components/PointsList';
import { parseTimeline } from '@site/src/utils/timelineParser';
import styles from './timeline-visualizer.module.css';

const pageTitle = "Google Timeline Visualizer - View Your Location History on a Map";
const pageDescription = "Free, privacy-first Google Timeline visualizer. View your location history on an interactive map. All processing happens in your browser — no data sent to any server.";
const pageUrl = "https://dawarich.app/tools/timeline-visualizer";
const imageUrl = "https://dawarich.app/img/meta-image.jpg";

const faqItems = [
  {
    question: "Is it safe to upload my Google Timeline data here?",
    answer: "Yes. All data processing happens entirely in your browser using JavaScript. Your location history files are never uploaded to any server — they stay on your device. When you close the tab, the data is gone. The tool is also open source, so you can verify exactly what the code does."
  },
  {
    question: "What file formats does this visualizer support?",
    answer: "The visualizer supports all Google Timeline export formats: Records.json (raw GPS location records), Semantic Location History (monthly YYYY_MONTH.json files with place visits and activity segments), Location History exported from your phone (the newer format with semanticSegments), and Settings/TimelineEdits files. It auto-detects the format when you upload."
  },
  {
    question: "Why did Google shut down Timeline on the web?",
    answer: "In late 2024, Google discontinued the web-based version of Google Maps Timeline and moved all location data to on-device storage. Users' last 90 days of data were transferred to their phone, but older data was deleted unless manually backed up. Many users lost years of location history in the transition. This visualizer helps you view and explore any Google Timeline data you managed to export."
  },
  {
    question: "How do I export my Google Timeline data?",
    answer: "There are three methods: (1) Google Takeout at takeout.google.com — select Location History and export, though this no longer works for everyone. (2) On Android: Google Maps → Settings → Location → Location Services → Timeline → Export Timeline. (3) On iOS: Google Maps → Settings → Personal Content → Export Timeline data. We recommend trying all methods and exporting as soon as possible."
  },
  {
    question: "Can I visualize years of location data at once?",
    answer: "Yes. The visualizer has been tested with files containing over 630,000 location points spanning 15+ years. It processes data in batches to keep your browser responsive, and includes a year filter so you can focus on specific time periods. A 170 MB file typically takes 20-30 seconds to process on a modern computer."
  },
  {
    question: "What's the difference between Records.json and Semantic Location History?",
    answer: "Records.json contains raw GPS coordinates and timestamps — every location ping Google recorded. These files tend to be very large. Semantic Location History files (named like 2022_APRIL.json) are more structured, containing place visits with addresses, activity segments (walking, driving, cycling), and duration information. Both formats are supported by this visualizer."
  },
  {
    question: "Can I view my Google Timeline without Google Maps?",
    answer: "Yes — that's exactly what this tool does. After exporting your Google Timeline data, upload the JSON files here to view everything on an interactive OpenStreetMap-based map. No Google account or Google Maps app needed. You can filter by year, click on individual points for details, and explore your complete location history independently of Google."
  },
  {
    question: "How is this different from other Google Timeline viewers?",
    answer: "This visualizer is built with privacy as the top priority — zero data leaves your browser. It supports all Google export formats (including the newer phone-based exports that many tools don't handle), processes files progressively so large datasets don't crash your browser, and is maintained as part of the Dawarich open-source ecosystem. It's also completely free with no accounts or sign-ups required."
  }
];

export default function TimelineVisualizer() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [points, setPoints] = useState([]);
  const [paths, setPaths] = useState([]);
  const [selectedYear, setSelectedYear] = useState('all');
  const [yearStats, setYearStats] = useState({});

  const handleFilesLoaded = useCallback(async (files) => {
    console.log('='.repeat(60));
    console.log('[Timeline Visualizer] Starting to process files');
    console.log(`[Timeline Visualizer] Number of files: ${files.length}`);

    setUploadedFiles(files);

    // Parse all files and stream points in batches
    const BATCH_SIZE = 5000;
    const allPoints = [];
    const allPaths = [];

    for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
      const file = files[fileIndex];

      try {
        console.log(`\n[Timeline Visualizer] Processing file ${fileIndex + 1}/${files.length}: ${file.filename}`);
        console.log(`[Timeline Visualizer] File size: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
        console.log(`[Timeline Visualizer] File data type:`, Array.isArray(file.data) ? 'Array' : 'Object');

        if (Array.isArray(file.data)) {
          console.log(`[Timeline Visualizer] Array length: ${file.data.length}`);
        } else {
          console.log(`[Timeline Visualizer] Object keys:`, Object.keys(file.data).join(', '));
        }

        const startTime = Date.now();
        const parsed = parseTimeline(file.data);
        const endTime = Date.now();

        console.log(`[Timeline Visualizer] ✓ Parsed in ${((endTime - startTime) / 1000).toFixed(2)}s`);
        console.log(`[Timeline Visualizer]   Format: ${parsed.metadata?.format || 'unknown'}`);
        console.log(`[Timeline Visualizer]   Points extracted: ${parsed.points.length}`);
        console.log(`[Timeline Visualizer]   Paths extracted: ${parsed.paths.length}`);

        // Add paths
        if (parsed.paths.length > 0) {
          for (let i = 0; i < parsed.paths.length; i++) {
            allPaths.push(parsed.paths[i]);
          }
        }

        // Stream points to map in batches to keep UI responsive
        console.log(`[Timeline Visualizer] Streaming ${parsed.points.length} points in batches of ${BATCH_SIZE}...`);
        let batchCount = 0;

        for (let i = 0; i < parsed.points.length; i++) {
          allPoints.push(parsed.points[i]);

          // Every BATCH_SIZE points, update the UI
          if (allPoints.length % BATCH_SIZE === 0) {
            batchCount++;
            console.log(`[Timeline Visualizer]   Batch ${batchCount}: ${allPoints.length} points loaded`);

            // Update map with current points
            setPoints([...allPoints]);

            // Yield to browser to prevent freezing
            await new Promise(resolve => setTimeout(resolve, 0));
          }
        }

        // Update with any remaining points
        if (allPoints.length % BATCH_SIZE !== 0) {
          console.log(`[Timeline Visualizer]   Final: ${allPoints.length} points loaded`);
          setPoints([...allPoints]);
        }

      } catch (error) {
        console.error(`[Timeline Visualizer] ✗ Error parsing ${file.filename}:`, error);
        console.error('[Timeline Visualizer] Error stack:', error.stack);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`[Timeline Visualizer] Processing complete!`);
    console.log(`[Timeline Visualizer] Total points: ${allPoints.length}`);
    console.log(`[Timeline Visualizer] Total paths: ${allPaths.length}`);

    // Calculate year statistics
    console.log('[Timeline Visualizer] Calculating year statistics...');
    const yearCounts = {};

    for (let i = 0; i < allPoints.length; i++) {
      const point = allPoints[i];
      if (point.timestamp) {
        const year = new Date(point.timestamp).getFullYear();
        if (!isNaN(year)) {
          yearCounts[year] = (yearCounts[year] || 0) + 1;
        }
      }
    }

    console.log(`[Timeline Visualizer] Year statistics:`, yearCounts);

    // Default to the earliest year (first chronologically) for better initial performance
    const years = Object.keys(yearCounts).map(Number).sort((a, b) => a - b);
    const defaultYear = years.length > 0 ? String(years[0]) : 'all';

    console.log(`[Timeline Visualizer] Defaulting to year: ${defaultYear} (${yearCounts[defaultYear]?.toLocaleString() || 0} points)`);
    console.log('='.repeat(60));

    // Set final state
    setPoints(allPoints);
    setPaths(allPaths);
    setYearStats(yearCounts);
    setSelectedYear(defaultYear);
  }, []);

  const handleClear = useCallback(() => {
    setUploadedFiles([]);
    setSelectedPoint(null);
    setPoints([]);
    setPaths([]);
  }, []);

  const handlePointClick = useCallback((point) => {
    setSelectedPoint(point);
  }, []);

  const handleYearChange = useCallback((event) => {
    setSelectedYear(event.target.value);
    setSelectedPoint(null);
  }, []);

  // Filter points by selected year
  const filteredPoints = React.useMemo(() => {
    if (selectedYear === 'all') {
      return points;
    }

    const year = parseInt(selectedYear);
    return points.filter(point => {
      if (!point.timestamp) return false;
      const pointYear = new Date(point.timestamp).getFullYear();
      return pointYear === year;
    });
  }, [points, selectedYear]);

  // Filter paths by selected year (based on startTimestamp or endTimestamp)
  const filteredPaths = React.useMemo(() => {
    if (selectedYear === 'all') {
      return paths;
    }

    const year = parseInt(selectedYear);
    return paths.filter(path => {
      // Check if path's start or end timestamp falls in the selected year
      if (path.startTimestamp) {
        const pathYear = new Date(path.startTimestamp).getFullYear();
        if (pathYear === year) return true;
      }
      if (path.endTimestamp) {
        const pathYear = new Date(path.endTimestamp).getFullYear();
        if (pathYear === year) return true;
      }
      return false;
    });
  }, [paths, selectedYear]);

  return (
    <Layout
      title={pageTitle}
      description={pageDescription}
    >
      <Head>
        {/* Primary Meta Tags */}
        <meta name="title" content={pageTitle} />
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="Google Timeline visualizer, Google location history viewer, Google Takeout location viewer, view location history on map, Google Maps Timeline replacement, Google Timeline shutdown alternative, location history map, Google Timeline export viewer, privacy-first location visualizer" />
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
            "name": "Google Timeline Visualizer",
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
              "Visualize Google Timeline data on an interactive map",
              "Privacy-first - all processing in browser",
              "Support for Records.json, Semantic Location History, and phone exports",
              "Year-based filtering for large datasets",
              "No data sent to any server",
              "Open source and transparent"
            ]
          })}
        </script>

        {/* JSON-LD Structured Data - HowTo */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to Visualize Your Google Timeline Location History",
            "description": "Export your Google Timeline data and visualize it on an interactive map using this free, privacy-first tool.",
            "step": [
              {
                "@type": "HowToStep",
                "name": "Export your Google Timeline data",
                "text": "Visit takeout.google.com, select Location History (Timeline), and export. Alternatively, on Android: Google Maps → Settings → Location → Timeline → Export. On iOS: Google Maps → Settings → Personal Content → Export Timeline data."
              },
              {
                "@type": "HowToStep",
                "name": "Upload your JSON files",
                "text": "Drag and drop your exported Google Timeline JSON files into the visualizer. The tool automatically detects the format (Records.json, Semantic Timeline, Location History, etc.)."
              },
              {
                "@type": "HowToStep",
                "name": "Explore your location history",
                "text": "Your location data appears on an interactive map. Use the year filter to focus on specific time periods, click on points for details, and explore your complete location history."
              }
            ],
            "tool": {
              "@type": "HowToTool",
              "name": "Google Timeline Visualizer by Dawarich"
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
                "name": "Google Timeline Visualizer",
                "item": pageUrl
              }
            ]
          })}
        </script>
      </Head>
      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          <div className={styles.header}>
            <h1>Google Timeline Visualizer</h1>
            <p>Free, privacy-first tool to visualize your Google Timeline location history on an interactive map. Upload your exported JSON files — all processing happens in your browser.</p>
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
                  <p>Visit <a href="https://takeout.google.com/" target="_blank" rel="noopener noreferrer">takeout.google.com</a> → Choose Location History (Timeline) → Export</p>
                  <p>This way might not work for everyone because Google changed the way location data is being stored and exported. More details in our <a href="https://dawarich.app/blog/migrating-from-google-location-history-to-dawarich">blog</a>.</p>
                </div>
                <div className={styles.instructionItem}>
                  <strong>On Android:</strong>
                  <p>Open Google Maps → Settings → Location → Location Services → Timeline → Export Timeline</p>
                </div>
                <div className={styles.instructionItem}>
                  <strong>On iOS:</strong>
                  <p>Open Google Maps → Settings → Personal Content → Export Timeline data</p>
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

          {uploadedFiles.length > 0 && (
            <div className={styles.ctaPanel}>
              <div className={styles.ctaContent}>
                <h3>Want to keep your memories visualized on the map and track your daily movements?</h3>
                <p>Try Dawarich — a location tracking platform that gives you full control over your location data and provides key to your memories</p>
                <a href="/?utm_source=tool&utm_medium=cta&utm_campaign=timeline-visualizer" className={styles.ctaButton}>Try Dawarich!</a>
              </div>
            </div>
          )}

          {uploadedFiles.length === 0 && (
            <div className={styles.preCtaPanel}>
              <div className={styles.preCtaContent}>
                <span className={styles.preCtaIcon}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <span>Looking for a long-term Google Timeline replacement? <a href="/?utm_source=tool&utm_medium=inline-cta&utm_campaign=timeline-visualizer">Dawarich</a> tracks your location history automatically, with full data ownership and privacy. <a href="/blog/migrating-from-google-location-history-to-dawarich">Learn how to migrate</a>.</span>
              </div>
            </div>
          )}
        </div>

        <div className={styles.mapSection}>
          {points.length > 0 && (
            <div className={styles.filterSection}>
              <label htmlFor="yearFilter" className={styles.filterLabel}>
                Filter by Year:
              </label>
              <select
                id="yearFilter"
                value={selectedYear}
                onChange={handleYearChange}
                className={styles.yearSelect}
              >
                <option value="all">
                  All Years ({points.length.toLocaleString()} points)
                </option>
                {Object.keys(yearStats)
                  .sort((a, b) => b - a)
                  .map(year => (
                    <option key={year} value={year}>
                      {year} ({yearStats[year].toLocaleString()} points)
                    </option>
                  ))}
              </select>
              {selectedYear !== 'all' && (
                <span className={styles.filterInfo}>
                  Showing {filteredPoints.length.toLocaleString()} of {points.length.toLocaleString()} points
                </span>
              )}
            </div>
          )}

          <div className={styles.mapGrid}>
            <div className={styles.mapColumn}>
              <TimelineMap
                points={filteredPoints}
                paths={filteredPaths}
                onPointClick={handlePointClick}
                selectedPointId={selectedPoint?.id}
              />
            </div>

            <div className={styles.listColumn}>
              <PointsList
                points={filteredPoints}
                selectedPointId={selectedPoint?.id}
                onPointSelect={handlePointClick}
              />
            </div>
          </div>
        </div>

        <div className={styles.infoSection}>
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <h2>What Is a Google Timeline Visualizer?</h2>
              <p>A Google Timeline visualizer takes the raw JSON files from your Google location history export and turns them into an interactive map you can explore. Instead of scrolling through thousands of lines of coordinates and timestamps, you see your actual journeys plotted on a map — every trip, commute, and walk you've taken while Google was tracking your location.</p>
              <p>This tool processes everything in your browser, so your sensitive location data never leaves your device. It's the privacy-first way to explore years of location history.</p>
            </div>

            <div className={styles.infoCard}>
              <h2>What Can You Discover in Your Data?</h2>
              <ul>
                <li><strong>Travel patterns</strong> — See every trip you've taken, from daily commutes to international travel</li>
                <li><strong>Place visits</strong> — Discover which locations you've visited most, with arrival and departure times</li>
                <li><strong>Activity types</strong> — View walking, driving, cycling, and transit segments from Semantic Location History</li>
                <li><strong>Year-by-year changes</strong> — Filter by year to see how your movement patterns evolved over time</li>
                <li><strong>Forgotten memories</strong> — Rediscover that restaurant, park, or neighborhood you visited years ago</li>
              </ul>
            </div>

            <div className={styles.infoCard}>
              <h2>Supported Google Export Formats</h2>
              <ul>
                <li><strong>Records.json</strong> — Raw GPS records in E7 coordinate format. Largest file, contains every location ping</li>
                <li><strong>Semantic Location History</strong> — Monthly files (e.g. 2022_APRIL.json) with place visits, addresses, and activity segments</li>
                <li><strong>Phone Timeline Export</strong> — Newer format from Google Maps on Android/iOS with semanticSegments and timeline paths</li>
                <li><strong>Settings &amp; TimelineEdits</strong> — Additional metadata files from Google Takeout exports</li>
              </ul>
              <p>The visualizer auto-detects the format. You can upload multiple files at once to combine data from different export methods.</p>
            </div>

            <div className={styles.infoCard}>
              <h2>What Happened to Google Maps Timeline?</h2>
              <p>In late 2024, Google discontinued the web version of Google Maps Timeline and moved all location data to on-device storage. Only the last 90 days were migrated — older data was deleted unless users manually backed it up. Many people <a href="https://www.reddit.com/r/GoogleMaps/comments/1diivt3/megathread_google_maps_timeline_moving_to/" target="_blank" rel="noopener noreferrer">lost years of location history</a> in the transition.</p>
              <p>If you exported your data before or during the transition, this visualizer lets you view it. For a long-term replacement, <a href="/?utm_source=tool&utm_medium=info-section&utm_campaign=timeline-visualizer">Dawarich</a> offers self-hosted and cloud-based location tracking with full data ownership.</p>
            </div>

            <div className={styles.infoCard}>
              <h2>How This Compares to Other Visualizers</h2>
              <p>Several tools exist for viewing Google location data. Here's how this one differs:</p>
              <ul>
                <li><strong>vs LocationHistoryVisualizer.com</strong> — Focused on heatmaps only. This tool shows individual points, paths, place visits, and activity segments with detailed filtering</li>
                <li><strong>vs Google Maps Timeline</strong> — Google's web timeline was shut down. This is an independent, privacy-first alternative that works with your exported data</li>
                <li><strong>vs GitHub projects</strong> — Most open-source viewers support only older export formats. This tool handles all Google formats including the latest phone-based exports</li>
              </ul>
              <p>Need a heatmap instead? Try our <a href="/tools/heatmap-generator">GPS Heatmap Generator</a>.</p>
            </div>

            <div className={styles.infoCard}>
              <h2>Related Tools</h2>
              <ul>
                <li><a href="/tools/heatmap-generator">GPS Heatmap Generator</a> — Create heatmaps from GPX, FIT, TCX, and other GPS files</li>
                <li><a href="/tools/gpx-merger">GPX Track Merger</a> — Combine multiple GPX files into one</li>
                <li><a href="/tools/photo-geotagging">Photo Geodata Extraction</a> — Extract GPS coordinates from your photos</li>
                <li><a href="/tools/geojson-to-gpx">GeoJSON to GPX Converter</a> — Convert your location data to GPX format</li>
              </ul>
              <p>Read more: <a href="/blog/building-a-privacy-first-google-timeline-visualizer">How we built this visualizer</a> | <a href="/blog/migrating-from-google-location-history-to-dawarich">Migrating from Google Location History</a></p>
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
            <a href="/?utm_source=tool&utm_medium=bottom-cta&utm_campaign=timeline-visualizer" className={styles.ctaButton}>Try Dawarich Free for 7 Days</a>
          </div>
        </div>
      </div>
    </Layout>
  );
}
