import React, { useState, useCallback } from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import FileUploader from '@site/src/components/FileUploader';
import StatsCard from '@site/src/components/StatsCard';
import ShareableCard from '@site/src/components/ShareableCard';
import { parseTimeline } from '@site/src/utils/timelineParser';
import { calculateTravelStats } from '@site/src/utils/timelineStats';
import styles from './timeline-statistics.module.css';

const pageTitle = "Google Timeline Statistics Analyzer - Your Location History Insights";
const pageDescription = "Free privacy-first tool to analyze your Google Timeline data. See total distance traveled, countries visited, top places, activity breakdown, and yearly trends. All processing in your browser.";
const pageUrl = "https://dawarich.app/tools/timeline-statistics";
const imageUrl = "https://dawarich.app/img/meta-image.jpg";

const ACTIVITY_LABELS = {
  'IN_PASSENGER_VEHICLE': 'Driving',
  'WALKING': 'Walking',
  'RUNNING': 'Running',
  'CYCLING': 'Cycling',
  'IN_BUS': 'Bus',
  'IN_TRAIN': 'Train',
  'IN_SUBWAY': 'Subway',
  'FLYING': 'Flying',
  'MOTORCYCLING': 'Motorcycle',
  'SKIING': 'Skiing',
  'SAILING': 'Sailing',
  'UNKNOWN': 'Unknown',
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

const faqItems = [
  {
    question: "Is it safe to upload my Google Timeline data?",
    answer: "Yes. All data processing happens entirely in your browser using JavaScript. Your location history files are never uploaded to any server — they stay on your device. When you close the tab, the data is gone. The tool is also open source, so you can verify exactly what the code does. No accounts, no cookies, and no tracking of your location data."
  },
  {
    question: "What statistics does this tool calculate?",
    answer: "The analyzer calculates total distance traveled (in kilometers and miles), number of data points, unique places visited, countries and cities (from Semantic Location History), top visited places ranked by frequency, time spent traveling versus stationary, activity type distribution (walking, driving, cycling, transit, flying, etc.), and yearly breakdowns with monthly detail. It also generates a downloadable stats card you can share."
  },
  {
    question: "Why can't I see country or city data?",
    answer: "Country and city names are only available in Semantic Location History exports — the monthly files named like 2022_APRIL.json that contain structured place visits with addresses. If you uploaded a Records.json file, it contains raw GPS coordinates without place names or addresses. To get the full statistics including countries and cities, export your Semantic Location History from Google Takeout or your phone's Google Maps Timeline settings."
  },
  {
    question: "How accurate is the distance calculation?",
    answer: "The distance is calculated using the Haversine formula, which computes the great-circle distance between consecutive GPS points. It accounts for the curvature of the Earth. The tool filters out unreasonable jumps (greater than 500 km between consecutive points) to avoid GPS glitches inflating the total. For Semantic Location History, distances from activity segments are used when available, which tend to be more accurate than raw point-to-point calculations. Overall accuracy depends on how frequently Google recorded your location."
  },
  {
    question: "Can I analyze multiple files at once?",
    answer: "Yes. You can upload multiple JSON files simultaneously — for example, all your monthly Semantic Location History files at once, or a Records.json alongside Semantic files. The tool merges all data points and paths from every file before calculating statistics, giving you a combined view across your entire location history. Upload as many files as you like."
  },
  {
    question: "What are activity types?",
    answer: "Activity types are movement categories that Google assigns to your location data. They include WALKING, RUNNING, CYCLING, IN_PASSENGER_VEHICLE (driving), IN_BUS, IN_TRAIN, IN_SUBWAY, FLYING, MOTORCYCLING, SKIING, and SAILING. These are detected automatically by Google using your phone's sensors (accelerometer, GPS speed, altitude changes). The accuracy varies — Google sometimes misclassifies activities, especially between similar modes like bus and driving."
  },
  {
    question: "Can I share my statistics?",
    answer: "Yes. After analyzing your data, the tool generates a shareable stats card that you can download as a PNG image. The card includes your total distance, data points count, places visited, and number of countries — along with your date range. The image is generated entirely in your browser using a canvas element. No data is sent anywhere. You can share the downloaded image on social media, messaging apps, or anywhere else you like."
  }
];

function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toLocaleString();
}

function formatHours(hours) {
  if (hours >= 8760) return (hours / 8760).toFixed(1) + ' years';
  if (hours >= 720) return (hours / 720).toFixed(1) + ' months';
  if (hours >= 24) return (hours / 24).toFixed(1) + ' days';
  return hours.toFixed(1) + ' hours';
}

export default function TimelineStatistics() {
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
    ? ((stats.dateRange.end - stats.dateRange.start) / (1000 * 60 * 60 * 24 * 365.25)).toFixed(1)
    : '0';

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
        <meta name="keywords" content="google timeline statistics, location history stats, how far have I traveled, google maps timeline insights, google timeline analyzer, travel statistics, location data analysis, google takeout statistics, distance traveled calculator, places visited counter" />
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
            "name": "Google Timeline Statistics Analyzer",
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
              "Calculate total distance traveled from Google Timeline data",
              "See countries and cities visited",
              "Top visited places ranking",
              "Activity type breakdown (walking, driving, cycling, transit)",
              "Yearly and monthly data trends",
              "Downloadable shareable stats card",
              "Privacy-first - all processing in browser",
              "Supports all Google Timeline export formats"
            ]
          })}
        </script>

        {/* JSON-LD Structured Data - HowTo */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to Analyze Your Google Timeline Statistics",
            "description": "Export your Google Timeline data and get detailed travel statistics including distance, countries, places, and activity breakdown.",
            "step": [
              {
                "@type": "HowToStep",
                "name": "Export your Google Timeline data",
                "text": "Visit takeout.google.com, select Location History (Timeline), and export. Alternatively, on Android: Google Maps → Settings → Location → Timeline → Export. On iOS: Google Maps → Settings → Personal Content → Export Timeline data."
              },
              {
                "@type": "HowToStep",
                "name": "Upload your JSON files",
                "text": "Drag and drop your exported Google Timeline JSON files into the analyzer. The tool automatically detects the format (Records.json, Semantic Timeline, Location History, etc.) and parses your data."
              },
              {
                "@type": "HowToStep",
                "name": "View your travel statistics",
                "text": "See your total distance, countries visited, top places, activity breakdown, yearly trends, and more. Download a shareable stats card image to share your travel highlights."
              }
            ],
            "tool": {
              "@type": "HowToTool",
              "name": "Google Timeline Statistics Analyzer by Dawarich"
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
                "name": "Google Timeline Statistics Analyzer",
                "item": pageUrl
              }
            ]
          })}
        </script>
      </Head>

      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          <div className={styles.header}>
            <h1>Google Timeline Statistics</h1>
            <p>Your Spotify Wrapped for location history. Upload your Google Timeline data to see how far you've traveled, which countries you've visited, your most frequent places, and how you spend your time moving through the world.</p>
          </div>

          <div className={styles.topSection}>
            <div className={styles.instructions}>
              <h2>How to Get Your Timeline Data</h2>
              <p>
                Export your Google Timeline data using one of the methods below. For the richest statistics (countries, cities, place names), use the Semantic Location History export.
              </p>
              <div className={styles.instructionsList}>
                <div className={styles.instructionItem}>
                  <strong>Google Takeout (Recommended):</strong>
                  <p>Visit <a href="https://takeout.google.com/" target="_blank" rel="noopener noreferrer">takeout.google.com</a> → Select Location History (Timeline) → Export as JSON. This gives you both Records.json and Semantic Location History files.</p>
                </div>
                <div className={styles.instructionItem}>
                  <strong>On Android:</strong>
                  <p>Open Google Maps → Settings → Location → Location Services → Timeline → Export Timeline</p>
                </div>
                <div className={styles.instructionItem}>
                  <strong>On iOS:</strong>
                  <p>Open Google Maps → Settings → Personal Content → Export Timeline data</p>
                </div>
                <div className={styles.instructionItem}>
                  <strong>Tip:</strong>
                  <p>Upload all your Semantic Location History monthly files (e.g. 2022_JANUARY.json, 2022_FEBRUARY.json) for the most complete statistics. You can select multiple files at once.</p>
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
                <span>Like these insights? <a href="/?utm_source=tool&utm_medium=inline-cta&utm_campaign=timeline-statistics">Dawarich</a> generates travel statistics automatically from your ongoing location data — total distance, countries, cities, and activity breakdowns updated in real time. <a href="/blog/migrating-from-google-location-history-to-dawarich">Learn how to migrate</a>.</span>
              </div>
            </div>
          )}
        </div>

        {uploadedFiles.length > 0 && (
          <div className={styles.contentWrapper}>
            <div className={styles.ctaPanel}>
              <div className={styles.ctaContent}>
                <h3>Like these insights? Dawarich generates them automatically from your ongoing location data.</h3>
                <p>Import your Google Timeline export, track your phone's location, and get live travel statistics, maps, and yearly summaries — all self-hosted or in the cloud.</p>
                <a href="/?utm_source=tool&utm_medium=cta&utm_campaign=timeline-statistics" className={styles.ctaButton}>Try Dawarich!</a>
              </div>
            </div>
          </div>
        )}

        {isProcessing && (
          <div className={styles.contentWrapper}>
            <div className={styles.noticeBox}>
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Processing your timeline data... This may take a moment for large files.</span>
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
                label="Total Distance"
                value={`${Math.round(stats.totalDistanceKm).toLocaleString()} km`}
                subtitle={`${Math.round(stats.totalDistanceMiles).toLocaleString()} miles`}
                color="#3b82f6"
              />
              <StatsCard
                icon={
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                }
                label="Data Points"
                value={formatNumber(stats.totalPoints)}
                subtitle={`${stats.totalPaths.toLocaleString()} paths`}
                color="#10b981"
              />
              <StatsCard
                icon={
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                }
                label="Places Visited"
                value={stats.uniquePlacesCount.toLocaleString()}
                subtitle={stats.hasSemanticData ? 'unique locations' : 'from semantic data'}
                color="#f59e0b"
              />
              <StatsCard
                icon={
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="24" height="24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                }
                label="Date Range"
                value={`${dateRangeYears} years`}
                subtitle={stats.dateRange ? `${stats.dateRange.start.toLocaleDateString()} - ${stats.dateRange.end.toLocaleDateString()}` : 'N/A'}
                color="#8b5cf6"
              />
            </div>

            {/* Notice if no semantic data */}
            {!stats.hasSemanticData && (
              <div className={styles.noticeBox}>
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span>Your file contains raw location records (Records.json format). Country/city names and place visit data are only available from Semantic Location History exports — the monthly files named like 2022_APRIL.json. Upload those files for richer statistics including visited places, countries, and cities.</span>
              </div>
            )}

            {/* Countries & Cities */}
            {stats.hasSemanticData && stats.countries.length > 0 && (
              <div className={styles.tagSection}>
                <h3>Countries ({stats.countries.length})</h3>
                <div className={styles.tagList}>
                  {stats.countries.sort().map((country, idx) => (
                    <span key={idx} className={styles.tag}>{country}</span>
                  ))}
                </div>
              </div>
            )}

            {stats.hasSemanticData && stats.cities.length > 0 && (
              <div className={styles.tagSection}>
                <h3>Cities ({stats.cities.length})</h3>
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
                <h3>Top Visited Places</h3>
                <div className={styles.placesTable}>
                  <div className={styles.placesHeader}>
                    <span>Place</span>
                    <span>Visits</span>
                    <span>Address</span>
                  </div>
                  {stats.topPlaces.map((place, idx) => (
                    <div key={idx} className={styles.placesRow}>
                      <span>{place.name || 'Unnamed'}</span>
                      <span>{place.visitCount}</span>
                      <span>{place.address || '-'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Time Breakdown */}
            {(stats.timeBreakdown.travelingHours > 0 || stats.timeBreakdown.stationaryHours > 0) && (
              <div className={styles.timeBreakdown}>
                <h3>Time Breakdown</h3>
                <div className={styles.timeBar}>
                  {travelingPercent > 0 && (
                    <div
                      className={styles.timeBarTraveling}
                      style={{ width: `${Math.max(travelingPercent, 5)}%` }}
                    >
                      {travelingPercent >= 10 ? `${travelingPercent.toFixed(1)}%` : ''}
                    </div>
                  )}
                  {stationaryPercent > 0 && (
                    <div
                      className={styles.timeBarStationary}
                      style={{ width: `${Math.max(stationaryPercent, 5)}%` }}
                    >
                      {stationaryPercent >= 10 ? `${stationaryPercent.toFixed(1)}%` : ''}
                    </div>
                  )}
                </div>
                <div className={styles.timeLegend}>
                  <div className={styles.timeLegendItem}>
                    <span className={styles.timeLegendDot} style={{ background: 'var(--ifm-color-primary)' }}></span>
                    <span>Traveling: {formatHours(stats.timeBreakdown.travelingHours)}</span>
                  </div>
                  <div className={styles.timeLegendItem}>
                    <span className={styles.timeLegendDot} style={{ background: 'var(--ifm-color-emphasis-300)' }}></span>
                    <span>Stationary: {formatHours(stats.timeBreakdown.stationaryHours)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Activity Distribution */}
            {activityData.length > 0 && (
              <div className={styles.chartSection}>
                <h3>Activity Distribution</h3>
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
                        {item.count.toLocaleString()} seg.
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Yearly Breakdown */}
            {yearlyData.length > 0 && (
              <div className={styles.chartSection}>
                <h3>Yearly Breakdown</h3>
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
                        {formatNumber(item.pointCount)} pts
                        {item.distanceMeters > 0 ? ` / ${Math.round(item.distanceMeters / 1000).toLocaleString()} km` : ''}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Shareable Card */}
            <div className={styles.shareSection}>
              <h3>Share Your Stats</h3>
              <ShareableCard stats={stats} />
            </div>
          </div>
        )}

        {/* Post-upload CTA */}
        {stats && (
          <div className={styles.contentWrapper}>
            <div className={styles.ctaPanel}>
              <div className={styles.ctaContent}>
                <h3>Turn your one-time analysis into a living dashboard</h3>
                <p>Dawarich imports your full Google Timeline export, tracks your phone's location going forward, and gives you always-up-to-date statistics — distance, places, countries, heatmaps, and more. Self-hosted or cloud.</p>
                <a href="/?utm_source=tool&utm_medium=post-cta&utm_campaign=timeline-statistics" className={styles.ctaButton}>Get Started with Dawarich</a>
              </div>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className={styles.infoSection}>
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <h2>What Is the Timeline Statistics Analyzer?</h2>
              <p>The Timeline Statistics Analyzer is a free, browser-based tool that turns your raw Google Timeline export into meaningful travel statistics. Instead of staring at massive JSON files full of coordinates, you get a clear summary of your total distance traveled, the countries and cities you've been to, your most-visited places, how you split your time between different transport modes, and how your movement patterns changed year over year.</p>
              <p>Think of it as Spotify Wrapped, but for your location history. All the processing happens entirely in your browser — your data never leaves your device, and the tool is completely free with no sign-up required.</p>
            </div>

            <div className={styles.infoCard}>
              <h2>What Statistics Can You See?</h2>
              <ul>
                <li><strong>Total distance</strong> — How far you've traveled in kilometers and miles, calculated from GPS points and activity segments</li>
                <li><strong>Countries and cities</strong> — Every country and city extracted from your Semantic Location History addresses</li>
                <li><strong>Top places</strong> — Your most frequently visited locations ranked by number of visits</li>
                <li><strong>Time breakdown</strong> — A visual split of time spent traveling versus being stationary</li>
                <li><strong>Activity types</strong> — Distribution across walking, driving, cycling, transit, flying, and more</li>
                <li><strong>Yearly trends</strong> — Data points and distance per year to see how your habits changed</li>
                <li><strong>Shareable card</strong> — A downloadable image summarizing your key stats</li>
              </ul>
            </div>

            <div className={styles.infoCard}>
              <h2>Understanding Your Activity Types</h2>
              <p>Google's location tracking uses your phone's sensors to classify how you're moving. The main activity types you'll see in your data are:</p>
              <ul>
                <li><strong>Walking / Running</strong> — Detected via step count and speed from the accelerometer</li>
                <li><strong>Cycling</strong> — Moderate speed with characteristic accelerometer patterns</li>
                <li><strong>Driving</strong> — Higher speed with smooth acceleration patterns, labeled as IN_PASSENGER_VEHICLE</li>
                <li><strong>Bus / Train / Subway</strong> — Transit modes detected through speed, route patterns, and sometimes nearby transit stop data</li>
                <li><strong>Flying</strong> — Detected by rapid altitude changes and very high speeds</li>
              </ul>
              <p>These classifications are not always perfect. Google sometimes confuses bus rides with car trips, or labels slow driving as cycling. The statistics give you a good overall picture, but individual segments may be misclassified.</p>
            </div>

            <div className={styles.infoCard}>
              <h2>What Happened to Google Maps Timeline?</h2>
              <p>In late 2024, Google discontinued the web version of Google Maps Timeline and moved all location data to on-device storage. Only the last 90 days were migrated — older data was deleted unless users manually backed it up before the deadline. Many people <a href="https://www.reddit.com/r/GoogleMaps/comments/1diivt3/megathread_google_maps_timeline_moving_to/" target="_blank" rel="noopener noreferrer">lost years of location history</a> in the transition.</p>
              <p>If you managed to export your data before or during the transition, this analyzer lets you extract meaningful statistics from it. For a long-term replacement that keeps tracking your location with full data ownership, check out <a href="/?utm_source=tool&utm_medium=info-section&utm_campaign=timeline-statistics">Dawarich</a>.</p>
            </div>

            <div className={styles.infoCard}>
              <h2>Records.json vs Semantic Location History</h2>
              <p>Google exports your location data in two main formats, and they contain very different information:</p>
              <ul>
                <li><strong>Records.json</strong> — Raw GPS coordinates and timestamps. Every location ping Google recorded, usually every few seconds to minutes. These files can be hundreds of megabytes. They give you precise coordinates but no place names, addresses, or activity types.</li>
                <li><strong>Semantic Location History</strong> — Monthly files (e.g. 2022_APRIL.json) with structured data: named place visits with addresses, activity segments with classified transport modes, and duration information. These are smaller files but contain richer, more meaningful data.</li>
              </ul>
              <p>For the best statistics, upload your Semantic Location History files. Records.json will give you distance and data points, but you'll miss out on countries, cities, place names, and activity breakdowns.</p>
            </div>

            <div className={styles.infoCard}>
              <h2>Related Tools</h2>
              <ul>
                <li><a href="/tools/timeline-visualizer">Google Timeline Visualizer</a> — View your location history on an interactive map</li>
                <li><a href="/tools/heatmap-generator">GPS Heatmap Generator</a> — Create heatmaps from GPX, FIT, TCX, and other GPS files</li>
                <li><a href="/tools/gpx-merger">GPX Track Merger</a> — Combine multiple GPX files into one</li>
                <li><a href="/tools/photo-geotagging">Photo Geodata Extraction</a> — Extract GPS coordinates from your photos</li>
                <li><a href="/tools/geojson-to-gpx">GeoJSON to GPX Converter</a> — Convert your location data to GPX format</li>
              </ul>
              <p>Read more: <a href="/blog/building-a-privacy-first-google-timeline-visualizer">How we built the Timeline Visualizer</a> | <a href="/blog/migrating-from-google-location-history-to-dawarich">Migrating from Google Location History</a></p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
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

        {/* Bottom CTA */}
        <div className={styles.bottomCtaPanel}>
          <div className={styles.ctaContent}>
            <h3>Looking for a Google Timeline Replacement?</h3>
            <p>Dawarich is an open-source location tracking platform that gives you full control over your data. Import your Google Timeline export, track ongoing location from your phone, and get live travel statistics with maps, distance tracking, and yearly summaries — all self-hosted or in the cloud.</p>
            <a href="/?utm_source=tool&utm_medium=bottom-cta&utm_campaign=timeline-statistics" className={styles.ctaButton}>Try Dawarich Free for 7 Days</a>
          </div>
        </div>
      </div>
    </Layout>
  );
}
