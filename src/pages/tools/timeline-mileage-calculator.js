import React, { useState, useCallback, useMemo } from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import FileUploader from '@site/src/components/FileUploader';
import StatsCard from '@site/src/components/StatsCard';
import { parseTimeline } from '@site/src/utils/timelineParser';
import { generateMileageLog, mileageLogToCSV } from '@site/src/utils/timelineStats';
import styles from './timeline-mileage-calculator.module.css';

const pageTitle = "Google Timeline Mileage Calculator - Track Driving Distance Free";
const pageDescription = "Free mileage calculator using your Google Timeline data. Calculate driving distance, generate mileage logs, and export CSV reports for tax deductions. Privacy-first — runs in your browser.";
const pageUrl = "https://dawarich.app/tools/timeline-mileage-calculator";
const imageUrl = "https://dawarich.app/img/meta-image.jpg";

const faqItems = [
  {
    question: "Is it safe to upload my Google Timeline data?",
    answer: "Absolutely. This tool runs 100% in your browser using client-side JavaScript. Your Google Timeline files are never uploaded to any server, never leave your device, and are discarded the moment you close or refresh the page. There is no backend, no database, and no tracking of your location data. The tool is part of the Dawarich open-source ecosystem, so you can inspect the source code yourself to verify."
  },
  {
    question: "How accurate is the mileage calculation?",
    answer: "Distances are calculated using the Haversine formula, which computes the great-circle distance between GPS coordinates. This gives straight-line approximations between recorded points, which typically underestimates actual road distance by 10-30% depending on route complexity. Highways will be more accurate than winding city streets. For IRS mileage deductions, the standard practice is to use odometer readings or a dedicated mileage tracking app for precise figures, but this tool provides a solid estimate for planning and review."
  },
  {
    question: "Can I use this for tax deductions?",
    answer: "This tool generates a mileage log that can serve as a supplementary record for tax purposes. However, the IRS requires contemporaneous records — meaning mileage should ideally be logged at the time of each trip, not reconstructed later. Google Timeline data can support your records but may not be sufficient as the sole source. Consult a tax professional for guidance specific to your situation. For ongoing IRS-compliant mileage tracking, consider using Dawarich to automatically log your trips in real time."
  },
  {
    question: "What driving activities does it track?",
    answer: "The calculator identifies driving-related activity types from Google's classification system: IN_PASSENGER_VEHICLE (car trips), DRIVING, IN_BUS, IN_TRAIN, IN_SUBWAY, and MOTORCYCLING. These activity types are assigned by Google based on speed, movement patterns, and sensor data. The accuracy depends on how well Google classified your activities — occasionally walking or cycling may be misclassified as driving or vice versa."
  },
  {
    question: "Can I filter by date range?",
    answer: "Yes. After uploading your files, you can set a start date and end date to filter your mileage log to a specific period. This is useful for generating quarterly or annual mileage reports, isolating business travel periods, or comparing mileage across different timeframes. The monthly and daily summaries will also reflect only the filtered date range."
  },
  {
    question: "What format is the CSV export?",
    answer: "The CSV file includes columns for Trip #, Date, Start Time, End Time, Activity Type, Distance (in your chosen unit), and Duration. Each row represents one driving segment identified in your Timeline data. The file ends with a total row summarizing the overall distance and trip count. The CSV can be opened in Excel, Google Sheets, or any spreadsheet application for further analysis."
  },
  {
    question: "Why are some trips missing?",
    answer: "Several factors can cause missing trips: (1) Google Timeline only records data when Location History is enabled on your device — any periods where it was off will have no data. (2) Short trips or trips with poor GPS signal may not generate enough data points. (3) Google may not have classified certain movement as driving, especially at low speeds. (4) If you exported using the newer phone-based method, you may only have the last 90 days of data due to Google's 2024 policy change. (5) Some export formats contain less detail than others."
  }
];

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

function formatDuration(ms) {
  if (!ms || isNaN(ms)) return '-';
  const totalMinutes = Math.round(ms / 60000);
  if (totalMinutes < 60) return `${totalMinutes}m`;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
}

function formatActivityType(type) {
  const mapping = {
    'IN_PASSENGER_VEHICLE': 'Driving',
    'DRIVING': 'Driving',
    'IN_BUS': 'Bus',
    'IN_TRAIN': 'Train',
    'IN_SUBWAY': 'Subway',
    'MOTORCYCLING': 'Motorcycle',
  };
  return mapping[type] || type;
}

export default function TimelineMileageCalculator() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [allPoints, setAllPoints] = useState([]);
  const [allPaths, setAllPaths] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [unit, setUnit] = useState('miles');
  const [mileageLog, setMileageLog] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [visibleTrips, setVisibleTrips] = useState(20);

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
        <meta name="keywords" content="google timeline mileage, mileage calculator from location history, driving distance from google maps, mileage log google timeline, tax mileage calculator, google maps mileage tracker, IRS mileage log, driving distance calculator, google timeline driving distance, mileage reimbursement calculator" />
        <link rel="canonical" href={pageUrl} />

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
        <meta name="robots" content="index, follow" />
        <meta name="language" content="English" />
        <meta name="revisit-after" content="7 days" />

        {/* JSON-LD Structured Data - WebApplication */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Google Timeline Mileage Calculator",
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
              "Calculate driving mileage from Google Timeline data",
              "Filter trips by date range",
              "Toggle between kilometers and miles",
              "Generate downloadable CSV mileage log",
              "Daily and monthly trip summaries",
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
            "name": "How to Calculate Mileage from Google Timeline Data",
            "description": "Export your Google Timeline data and calculate driving mileage using this free, privacy-first calculator.",
            "step": [
              {
                "@type": "HowToStep",
                "name": "Export your Google Timeline data",
                "text": "Visit takeout.google.com, select Location History (Timeline), and export. Alternatively, on Android: Google Maps > Settings > Location > Timeline > Export. On iOS: Google Maps > Settings > Personal Content > Export Timeline data."
              },
              {
                "@type": "HowToStep",
                "name": "Upload your JSON files",
                "text": "Drag and drop your exported Google Timeline JSON files into the mileage calculator. The tool automatically detects the format and extracts driving segments."
              },
              {
                "@type": "HowToStep",
                "name": "Set your date range and unit preference",
                "text": "Select a start and end date to filter your mileage log, and choose between kilometers or miles."
              },
              {
                "@type": "HowToStep",
                "name": "Review and download your mileage log",
                "text": "Review the trip log, monthly summaries, and total mileage. Download the complete mileage log as a CSV file for your records."
              }
            ],
            "tool": {
              "@type": "HowToTool",
              "name": "Google Timeline Mileage Calculator by Dawarich"
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
                "name": "Google Timeline Mileage Calculator",
                "item": pageUrl
              }
            ]
          })}
        </script>
      </Head>

      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          <div className={styles.header}>
            <h1>Google Timeline Mileage Calculator</h1>
            <p>Calculate driving mileage from your Google Timeline data. Generate downloadable mileage logs with per-trip details, daily and monthly summaries. All processing happens in your browser — your data never leaves your device.</p>
          </div>

          <div className={styles.topSection}>
            <div className={styles.instructions}>
              <h2>How to Get Your Timeline Data</h2>
              <p>
                Export your Google Timeline location history using one of these methods. If one does not work, try another.
              </p>
              <div className={styles.instructionsList}>
                <div className={styles.instructionItem}>
                  <strong>Google Takeout:</strong>
                  <p>Visit <a href="https://takeout.google.com/" target="_blank" rel="noopener noreferrer">takeout.google.com</a> &rarr; Choose Location History (Timeline) &rarr; Export as JSON</p>
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
              <p className={styles.instructionNote}>
                For the most accurate mileage data, Semantic Location History files (monthly JSON files like 2023_JANUARY.json) work best, as they contain labeled activity segments with driving classifications.
              </p>
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
                  <p>All mileage calculations happen entirely in your browser. Your location data never leaves your device and is not sent to any server.</p>
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
                <span>Need ongoing mileage tracking? <a href="/?utm_source=tool&utm_medium=inline-cta&utm_campaign=timeline-mileage-calculator">Dawarich</a> records your trips automatically with full data ownership and privacy. No more manual exports — just continuous, accurate tracking.</span>
              </div>
            </div>
          )}

          {uploadedFiles.length > 0 && (
            <div className={styles.ctaPanel}>
              <div className={styles.ctaContent}>
                <h3>Need ongoing mileage tracking without manual exports?</h3>
                <p>Dawarich records your trips automatically, tracks driving mileage in real time, and gives you full control over your location data.</p>
                <a href="/?utm_source=tool&utm_medium=cta&utm_campaign=timeline-mileage-calculator" className={styles.ctaButton}>Try Dawarich!</a>
              </div>
            </div>
          )}
        </div>

        {/* Results area */}
        {uploadedFiles.length > 0 && (
          <div className={styles.resultsSection}>
            {/* Filters row */}
            <div className={styles.filtersRow}>
              <div className={styles.dateInputGroup}>
                <label htmlFor="startDate">Start Date</label>
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={styles.dateInput}
                />
              </div>
              <div className={styles.dateInputGroup}>
                <label htmlFor="endDate">End Date</label>
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
                  km
                </button>
                <button
                  className={`${styles.unitOption} ${unit === 'miles' ? styles.unitOptionActive : ''}`}
                  onClick={() => setUnit('miles')}
                  type="button"
                >
                  miles
                </button>
              </div>
              <button
                className={styles.calculateButton}
                onClick={handleCalculate}
                disabled={isProcessing}
                type="button"
              >
                {isProcessing ? 'Processing...' : 'Calculate'}
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
                    label="Total Driving Distance"
                    value={`${mileageLog.totalDistance.toFixed(1)} ${mileageLog.unit}`}
                    subtitle="All driving segments combined"
                    color="#3b82f6"
                  />
                  <StatsCard
                    icon={
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="28" height="28">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    }
                    label="Total Trips"
                    value={mileageLog.totalTrips.toLocaleString()}
                    subtitle="Driving segments detected"
                    color="#10b981"
                  />
                  <StatsCard
                    icon={
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="28" height="28">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    }
                    label="Average Trip Distance"
                    value={`${averageTripDistance.toFixed(1)} ${mileageLog.unit}`}
                    subtitle="Per driving segment"
                    color="#f59e0b"
                  />
                </div>

                <div className={styles.disclaimer}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Distances are calculated using GPS coordinates (Haversine formula) and represent straight-line approximations between recorded points. Actual road distances may be higher. This tool is for estimation purposes.</span>
                </div>

                {/* Monthly Summary */}
                {sortedMonthlySummary.length > 0 && (
                  <div className={styles.tableSection}>
                    <h2>Monthly Summary</h2>
                    <div className={styles.tableWrapper}>
                      <table className={styles.summaryTable}>
                        <thead>
                          <tr className={styles.tableHeader}>
                            <th className={styles.tableCell}>Month</th>
                            <th className={styles.tableCell}>Distance ({mileageLog.unit})</th>
                            <th className={styles.tableCell}>Trip Count</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sortedMonthlySummary.map((row) => (
                            <tr key={row.month} className={styles.tableRow}>
                              <td className={styles.tableCell}>{row.month}</td>
                              <td className={styles.tableCell}>{row.distance.toFixed(1)}</td>
                              <td className={styles.tableCell}>{row.tripCount}</td>
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
                    <h2>Trip Log</h2>
                    <div className={styles.tableWrapper}>
                      <table className={styles.tripLog}>
                        <thead>
                          <tr className={styles.tableHeader}>
                            <th className={styles.tableCell}>Trip #</th>
                            <th className={styles.tableCell}>Date</th>
                            <th className={styles.tableCell}>Activity Type</th>
                            <th className={styles.tableCell}>Distance ({mileageLog.unit})</th>
                            <th className={styles.tableCell}>Duration</th>
                          </tr>
                        </thead>
                        <tbody>
                          {visibleTripList.map((trip) => (
                            <tr key={trip.id} className={styles.tableRow}>
                              <td className={styles.tableCell}>{trip.id}</td>
                              <td className={styles.tableCell}>{trip.date}</td>
                              <td className={styles.tableCell}>{formatActivityType(trip.activityType)}</td>
                              <td className={styles.tableCell}>{trip.distance.toFixed(2)}</td>
                              <td className={styles.tableCell}>
                                {trip.startTime && trip.endTime
                                  ? formatDuration(new Date(trip.endTime) - new Date(trip.startTime))
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
                        Show More ({mileageLog.trips.length - visibleTrips} remaining)
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
                    Download Mileage Log (CSV)
                  </button>
                </div>
              </>
            )}

            {mileageLog && mileageLog.totalTrips === 0 && (
              <div className={styles.noResults}>
                <h3>No driving trips found</h3>
                <p>No driving activity segments were detected in your data for the selected date range. This can happen if:</p>
                <ul>
                  <li>Your export contains only raw GPS points (Records.json) without activity classification</li>
                  <li>The date range does not overlap with your data</li>
                  <li>Your data does not contain driving segments — try Semantic Location History files for best results</li>
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
                <h3>Tired of manually exporting and calculating mileage?</h3>
                <p>Dawarich automatically tracks every drive, calculates distances using actual GPS data, and lets you export mileage reports anytime. Self-hosted or cloud — your data, your choice.</p>
                <a href="/?utm_source=tool&utm_medium=post-upload-cta&utm_campaign=timeline-mileage-calculator" className={styles.ctaButton}>Try Dawarich Free for 7 Days</a>
              </div>
            </div>
          </div>
        )}

        {/* Info section */}
        <div className={styles.infoSection}>
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <h2>What Is the Timeline Mileage Calculator?</h2>
              <p>The Timeline Mileage Calculator is a free browser-based tool that extracts driving trip data from your Google Timeline export files and calculates the total distance traveled. It identifies driving-related activity segments — including car trips, bus rides, train journeys, and motorcycle travel — and generates a structured mileage log with per-trip details.</p>
              <p>Unlike server-based tools, everything runs in your browser. Your sensitive location data is never uploaded anywhere. You get instant results with full privacy, and the generated CSV mileage log can be used for expense reports, tax documentation, or personal record-keeping.</p>
            </div>

            <div className={styles.infoCard}>
              <h2>How Mileage Is Calculated</h2>
              <p>The calculator uses the Haversine formula to compute great-circle distances between consecutive GPS coordinates in each driving segment. This is the standard method for calculating distance between two points on a sphere (the Earth).</p>
              <p>For each driving segment identified in your Google Timeline data, the tool sums the distances between all recorded waypoints along that segment. The result is a straight-line approximation — actual road distance will typically be 10-30% higher due to road curvature, elevation changes, and detours not captured by GPS point spacing.</p>
              <p>Jumps greater than 500 km between consecutive points are automatically excluded to avoid counting GPS glitches or teleportation artifacts in the data.</p>
            </div>

            <div className={styles.infoCard}>
              <h2>Using Mileage Logs for Tax Deductions</h2>
              <p>In the United States, the IRS allows a standard mileage deduction for business use of a personal vehicle. For 2024, the rate is 67 cents per mile. To claim this deduction, you need a mileage log that records the date, destination, business purpose, and distance for each trip.</p>
              <p>While Google Timeline data can provide the date and distance for each driving segment, it does not distinguish between business and personal trips. You would need to annotate the exported CSV with business purpose and destination information. The IRS also requires that records be kept contemporaneously — meaning at or near the time of each trip — so a retrospective log from Google Timeline is best used as a supporting document rather than your sole record.</p>
              <p>For IRS-compliant mileage tracking going forward, consider using <a href="/?utm_source=tool&utm_medium=info-section&utm_campaign=timeline-mileage-calculator">Dawarich</a> to automatically log trips as they happen.</p>
            </div>

            <div className={styles.infoCard}>
              <h2>What Happened to Google Maps Timeline?</h2>
              <p>In late 2024, Google discontinued the web-based version of Google Maps Timeline and transitioned all location data to on-device storage on users' phones. Only the most recent 90 days of data were migrated — all older location history was permanently deleted unless users had manually backed it up before the deadline.</p>
              <p>This change left many users without access to years of location history that they had relied on for mileage tracking, travel memories, and expense documentation. If you managed to export your data via Google Takeout or the Timeline export feature before the transition, this calculator can help you extract the mileage information from those files.</p>
              <p>For more details, see our <a href="/blog/migrating-from-google-location-history-to-dawarich">guide on migrating from Google Location History</a>.</p>
            </div>

            <div className={styles.infoCard}>
              <h2>Accuracy and Limitations</h2>
              <ul>
                <li><strong>GPS precision</strong> — Google Timeline typically records locations every few seconds to minutes, depending on device activity. Gaps between readings mean some segments of a trip are interpolated rather than precisely measured</li>
                <li><strong>Activity classification</strong> — Google uses machine learning to classify activity types. Misclassifications happen — a slow drive in traffic might be labeled as cycling, or a bus ride as a car trip</li>
                <li><strong>Straight-line distances</strong> — The Haversine formula gives the shortest path between two points on the Earth's surface. Real roads are longer due to curves, hills, and routing</li>
                <li><strong>Missing data</strong> — Periods where your phone was off, in airplane mode, or had Location History disabled will have no data</li>
                <li><strong>Export format matters</strong> — Semantic Location History files contain the most detailed driving data. Raw Records.json files may lack activity type labels</li>
              </ul>
            </div>

            <div className={styles.infoCard}>
              <h2>Related Tools</h2>
              <ul>
                <li><a href="/tools/timeline-visualizer">Google Timeline Visualizer</a> — View your complete location history on an interactive map</li>
                <li><a href="/tools/heatmap-generator">GPS Heatmap Generator</a> — Create heatmaps from GPX, FIT, TCX, and other GPS files</li>
                <li><a href="/tools/gpx-merger">GPX Track Merger</a> — Combine multiple GPX files into one</li>
                <li><a href="/tools/photo-geotagging">Photo Geodata Extraction</a> — Extract GPS coordinates from your photos</li>
                <li><a href="/tools/geojson-to-gpx">GeoJSON to GPX Converter</a> — Convert your location data to GPX format</li>
              </ul>
              <p>Read more: <a href="/blog/migrating-from-google-location-history-to-dawarich">Migrating from Google Location History</a></p>
            </div>
          </div>
        </div>

        {/* FAQ section */}
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
            <h3>Looking for a Google Timeline Replacement with Built-in Mileage Tracking?</h3>
            <p>Dawarich is an open-source location tracking platform that automatically logs every trip, calculates driving distance, and gives you full control over your data. Import your Google Timeline export, track ongoing mileage from your phone, and generate reports anytime — all self-hosted or in the cloud.</p>
            <a href="/?utm_source=tool&utm_medium=bottom-cta&utm_campaign=timeline-mileage-calculator" className={styles.ctaButton}>Try Dawarich Free for 7 Days</a>
          </div>
        </div>
      </div>
    </Layout>
  );
}
