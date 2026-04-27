import React, { useState, useCallback, useMemo, useEffect, lazy, Suspense } from 'react';
import Layout from '@theme/Layout';
import RelatedTools from '@site/src/components/RelatedTools';
import Head from '@docusaurus/Head';
import BrowserOnly from '@docusaurus/BrowserOnly';
import FileUploader from '@site/src/components/FileUploader';
import TimelinePanel from '@site/src/components/TimelinePanel/TimelinePanel';
import { parseTimeline } from '@site/src/utils/timelineParser';
import { SAMPLE_DAY } from '@site/src/utils/sampleBerlinData';
import { buildDayIndex, buildYearStats, buildMonthGrid } from '@site/src/utils/timelineDays';
import styles from './timeline-visualizer.module.css';

const TimelineMapV2 = lazy(() => import('@site/src/components/TimelineMapV2'));

const pageTitle = "Google Timeline Visualizer - View Your Location History as a Calendar";
const pageDescription = "Free, privacy-first Google Timeline visualizer. Browse your location history day-by-day with a calendar heat-grid, visit list, journey legs, and activity replay. All processing happens in your browser.";
const pageUrl = "https://dawarich.app/tools/timeline-visualizer/";
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

function nextDateKey(currentKey, direction) {
  if (!currentKey) return null;
  const [y, m, d] = currentKey.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  date.setUTCDate(date.getUTCDate() + (direction === 'prev' ? -1 : 1));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
}

function nextMonthKey(monthKey, direction) {
  const [y, m] = monthKey.split('-').map(Number);
  const date = new Date(y, m - 1 + (direction === 'prev' ? -1 : 1), 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export default function TimelineVisualizer() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [points, setPoints] = useState([]);
  const [paths, setPaths] = useState([]);
  const [dayIndex, setDayIndex] = useState(() => new Map());
  const [yearStats, setYearStats] = useState(() => new Map());

  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [visibleMonth, setVisibleMonth] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedVisitId, setSelectedVisitId] = useState(null);
  const [hoveredEntry, setHoveredEntry] = useState(null);
  const [expandedTrackId, setExpandedTrackId] = useState(null);
  const [replayState, setReplayState] = useState(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [ctaDismissed, setCtaDismissed] = useState(false);

  const isShowingSample = uploadedFiles.length === 0 && points.length === 0;

  // Demo: synthetic dayIndex/yearStats from SAMPLE_DAY
  const demoDayIndex = useMemo(() => new Map([[SAMPLE_DAY.date, SAMPLE_DAY]]), []);
  const demoYearStats = useMemo(() => new Map([[2024, { months: new Set(['2024-06']), totalDays: 1, busiestSeconds: SAMPLE_DAY.summary.trackedSeconds }]]), []);

  const effectiveDayIndex = isShowingSample ? demoDayIndex : dayIndex;
  const effectiveYearStats = isShowingSample ? demoYearStats : yearStats;

  // Default selection on file load
  useEffect(() => {
    if (isShowingSample) {
      setSelectedYear(2024);
      setSelectedDate(SAMPLE_DAY.date);
      setVisibleMonth(SAMPLE_DAY.date.slice(0, 7));
      return;
    }
    if (yearStats.size === 0) return;
    const latestYear = Math.max(...yearStats.keys());
    const days = [...dayIndex.keys()].filter((k) => k.startsWith(String(latestYear))).sort();
    const latestDay = days[days.length - 1];
    setSelectedYear(latestYear);
    setSelectedDate(latestDay);
    setVisibleMonth(latestDay.slice(0, 7));
  }, [dayIndex, yearStats, isShowingSample]);

  const currentDay = useMemo(
    () => selectedDate ? effectiveDayIndex.get(selectedDate) : null,
    [effectiveDayIndex, selectedDate]
  );

  const monthGrid = useMemo(() => {
    if (!visibleMonth || !selectedYear) return null;
    return buildMonthGrid(effectiveDayIndex, effectiveYearStats, selectedYear, visibleMonth);
  }, [effectiveDayIndex, effectiveYearStats, selectedYear, visibleMonth]);

  const filteredEntries = useMemo(() => {
    if (!currentDay) return [];
    if (!searchQuery) return currentDay.entries;
    const q = searchQuery.toLowerCase();
    return currentDay.entries.filter((e) => e.type === 'journey' || e.searchTokens.includes(q));
  }, [currentDay, searchQuery]);

  // Raw points on the selected day (for Records.json fallback)
  const rawPointsForDay = useMemo(() => {
    if (!selectedDate) return [];
    return points.filter((p) => {
      if (p.type !== 'location_record' || !p.timestamp) return false;
      const d = new Date(p.timestamp);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      return key === selectedDate;
    });
  }, [points, selectedDate]);

  // File parsing (simplified — keep the streaming behavior of the previous implementation if desired)
  const handleFilesLoaded = useCallback(async (files) => {
    setUploadedFiles(files);
    setIsProcessing(true);
    const allPoints = [];
    const allPaths = [];
    for (const file of files) {
      try {
        const parsed = parseTimeline(file.data);
        allPoints.push(...parsed.points);
        allPaths.push(...parsed.paths);
      } catch (err) {
        console.error('[Timeline Visualizer] Parse error', err);
      }
    }
    setPoints(allPoints);
    setPaths(allPaths);
    const idx = buildDayIndex(allPoints, allPaths);
    setDayIndex(idx);
    setYearStats(buildYearStats(idx));
    setIsProcessing(false);
  }, []);

  const handleClear = useCallback(() => {
    setUploadedFiles([]);
    setPoints([]);
    setPaths([]);
    setDayIndex(new Map());
    setYearStats(new Map());
    setSelectedYear(null);
    setSelectedDate(null);
    setVisibleMonth(null);
    setSelectedVisitId(null);
    setExpandedTrackId(null);
    setReplayState(null);
    setCtaDismissed(false);
  }, []);

  // Handlers wired to TimelinePanel
  const onYearChange = useCallback((year) => {
    setSelectedYear(year);
    const monthsForYear = [...effectiveDayIndex.keys()].filter((k) => k.startsWith(String(year))).sort();
    if (monthsForYear.length > 0) {
      const latestDay = monthsForYear[monthsForYear.length - 1];
      setSelectedDate(latestDay);
      setVisibleMonth(latestDay.slice(0, 7));
    }
    setSelectedVisitId(null);
    setExpandedTrackId(null);
    setReplayState(null);
  }, [effectiveDayIndex]);

  const onSelectDay = useCallback((date) => {
    setSelectedDate(date);
    setSelectedVisitId(null);
    setExpandedTrackId(null);
    setReplayState(null);
  }, []);

  const onPrevDay = useCallback(() => {
    setSelectedDate((d) => nextDateKey(d, 'prev'));
    setSelectedVisitId(null);
    setExpandedTrackId(null);
    setReplayState(null);
  }, []);

  const onNextDay = useCallback(() => {
    setSelectedDate((d) => nextDateKey(d, 'next'));
    setSelectedVisitId(null);
    setExpandedTrackId(null);
    setReplayState(null);
  }, []);

  const onPrevMonth = useCallback(() => setVisibleMonth((m) => nextMonthKey(m, 'prev')), []);
  const onNextMonth = useCallback(() => setVisibleMonth((m) => nextMonthKey(m, 'next')), []);

  const onSelectVisit = useCallback((visitId) => setSelectedVisitId(visitId), []);
  const onHoverEntry = useCallback((entry) => setHoveredEntry(entry), []);
  const onUnhoverEntry = useCallback(() => setHoveredEntry(null), []);
  const onToggleTrack = useCallback((trackId) => {
    setExpandedTrackId((prev) => prev === trackId ? null : trackId);
    setReplayState(null);
  }, []);

  // Keyboard arrow nav
  useEffect(() => {
    const handler = (e) => {
      if (e.target.matches?.('input, textarea, select')) return;
      if (e.key === 'ArrowLeft') onPrevDay();
      else if (e.key === 'ArrowRight') onNextDay();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onPrevDay, onNextDay]);

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
        <div className={styles.heroSection}>
          <div className={styles.header}>
            <h1>Google Timeline Visualizer</h1>
            <p>Free, privacy-first tool to visualize your Google Timeline location history. Browse day by day with a calendar heat-grid, visit list, and activity replay.</p>
          </div>
          <div className={styles.uploadRow}>
            <FileUploader onFilesLoaded={handleFilesLoaded} onClear={handleClear} />
            <div className={styles.uploadMeta}>
              <div className={styles.privacyBadge}>
                <svg className={styles.privacyIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>All processing happens in your browser. Your data never leaves your device.</span>
              </div>
              <details className={styles.instructionsCollapsible}>
                <summary className={styles.instructionsSummary}>
                  Don't have your data yet? Here's how to export it
                </summary>
                <div className={styles.instructionsContent}>
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
              </details>
            </div>
          </div>
        </div>

        <div className={styles.workspaceSection}>
          <div className={styles.workspaceGrid}>
            <div className={styles.panelColumn}>
              <TimelinePanel
                monthGrid={monthGrid}
                selectedDate={selectedDate}
                selectedYear={selectedYear}
                yearStats={effectiveYearStats}
                searchQuery={searchQuery}
                day={currentDay}
                filteredEntries={filteredEntries}
                rawPointCount={rawPointsForDay.length}
                selectedVisitId={selectedVisitId}
                expandedTrackId={expandedTrackId}
                replayState={replayState}
                onYearChange={onYearChange}
                onSearchChange={setSearchQuery}
                onSelectDay={onSelectDay}
                onPrevMonth={onPrevMonth}
                onNextMonth={onNextMonth}
                onPrevDay={onPrevDay}
                onNextDay={onNextDay}
                onSelectVisit={onSelectVisit}
                onHoverEntry={onHoverEntry}
                onUnhoverEntry={onUnhoverEntry}
                onToggleTrack={onToggleTrack}
                onReplayChange={setReplayState}
              />
            </div>
            <div className={styles.mapColumn}>
              <BrowserOnly>
                {() => (
                  <Suspense fallback={<div className={styles.mapLoading}>Loading map…</div>}>
                    <TimelineMapV2
                      day={currentDay}
                      rawPoints={rawPointsForDay}
                      selectedVisitId={selectedVisitId}
                      hoveredEntry={hoveredEntry}
                      replayState={replayState}
                      isSample={isShowingSample}
                      onVisitClick={onSelectVisit}
                      onTrackClick={onToggleTrack}
                      onReplayChange={setReplayState}
                    />
                  </Suspense>
                )}
              </BrowserOnly>
            </div>
          </div>
        </div>

        {!isShowingSample && !ctaDismissed && points.length > 0 && (
          <div className={styles.postVizCta}>
            <button
              type="button"
              className={styles.postVizCtaDismiss}
              onClick={() => setCtaDismissed(true)}
              aria-label="Dismiss"
            >
              &times;
            </button>
            <p className={styles.postVizCtaText}>
              You just visualized <strong>{points.length.toLocaleString()}</strong> location points
              {yearStats.size > 0 && (
                <>
                  {' '}from <strong>{Math.min(...yearStats.keys())}</strong> to <strong>{Math.max(...yearStats.keys())}</strong>
                </>
              )}.
              {' '}This view disappears when you close this tab. Keep your location history forever — and add to it automatically.
            </p>
            <a
              href="https://my.dawarich.app/users/sign_up?utm_source=tool&utm_medium=post-viz-cta&utm_campaign=timeline-visualizer"
              className={styles.postVizCtaButton}
            >
              Start Free Trial — 7 Days &rarr;
            </a>
          </div>
        )}

        <div className={styles.bottomCtaPanel}>
          <div className={styles.ctaContent}>
            <h3>Looking for a Google Timeline Replacement?</h3>
            <p>Dawarich is an open-source location tracking platform that gives you full control over your data. Import your Google Timeline export, track ongoing location from your phone, and visualize years of movement history — all self-hosted or in the cloud.</p>
            <a href="https://my.dawarich.app/users/sign_up?utm_source=tool&utm_medium=post-map-cta&utm_campaign=timeline-visualizer" className={styles.ctaButton}>Try Dawarich Free for 7 Days</a>
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
              <p>If you exported your data before or during the transition, this visualizer lets you view it. For a long-term replacement, <a href="https://my.dawarich.app/users/sign_up?utm_source=tool&utm_medium=info-section&utm_campaign=timeline-visualizer">Dawarich</a> offers self-hosted and cloud-based location tracking with full data ownership.</p>
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

      </div>
      <RelatedTools slug="timeline-visualizer" />
    </Layout>
  );
}
