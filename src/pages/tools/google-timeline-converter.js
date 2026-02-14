import React, { useState, useCallback } from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import FileUploader from '@site/src/components/FileUploader';
import { parseTimeline, detectFormat } from '@site/src/utils/timelineParser';
import { timelineToConverterPoints, timelineToCSV } from '@site/src/utils/timelineToFormat';
import { toGPX, toGeoJSON, toKML, toKMZ } from '@site/src/utils/formatConverters';
import styles from './google-timeline-converter.module.css';

const pageTitle = "Google Timeline to GPX/KML/CSV Converter - Convert Location History Free";
const pageDescription = "Free, privacy-first converter for Google Timeline data. Convert your location history to GPX, KML, GeoJSON, or CSV format. All processing in your browser — no data uploaded.";
const pageUrl = "https://dawarich.app/tools/google-timeline-converter";
const imageUrl = "https://dawarich.app/img/meta-image.jpg";

const FORMAT_LABELS = {
  records: 'Records.json (Raw GPS)',
  semantic: 'Semantic Location History',
  semanticSegments: 'Semantic Segments',
  locationHistory: 'Location History (Phone Export)',
  settings: 'Settings',
  timelineEdits: 'Timeline Edits',
  unknown: 'Unknown',
};

const faqItems = [
  {
    question: "Is it safe to upload my Google Timeline data?",
    answer: "Yes. All data processing happens entirely in your browser using JavaScript. Your location history files are never uploaded to any server — they stay on your device. When you close the tab, the data is gone. There is no backend, no cookies tracking your files, and no analytics on your location data. The tool is also open source, so you can verify the code yourself."
  },
  {
    question: "What Google Timeline formats can I convert?",
    answer: "This converter supports all six Google Timeline export formats: Records.json (raw GPS location records with E7 coordinates), Semantic Location History (monthly YYYY_MONTH.json files with place visits and activity segments), Semantic Segments (the newer phone-based export format with semanticSegments), Location History (array format with startTime/endTime), Settings, and TimelineEdits. The tool auto-detects the format when you upload a file."
  },
  {
    question: "What's the best output format for my needs?",
    answer: "It depends on your use case. GPX is the most widely supported format and works with nearly every GPS application, fitness tracker, and mapping tool. KML and KMZ are ideal for Google Earth visualization. GeoJSON is the standard for web mapping libraries like Leaflet and Mapbox. CSV is best for spreadsheet analysis in Excel or Google Sheets, or for importing into databases. If unsure, start with GPX — it has the broadest compatibility."
  },
  {
    question: "Will the conversion lose any data?",
    answer: "The conversion preserves all geographic coordinates, timestamps, and elevation data. Place visit names and addresses are included as waypoint names in GPX and KML formats, and as dedicated columns in CSV. Activity type information (walking, driving, cycling) is preserved in CSV output. Some format-specific metadata like accuracy values or device identifiers may not have equivalents in all output formats, but no location data is lost."
  },
  {
    question: "Can I convert multiple files at once?",
    answer: "Yes. You can upload multiple Google Timeline JSON files at once — for example, all your monthly Semantic Location History files (2022_JANUARY.json through 2022_DECEMBER.json). The converter merges all data from all uploaded files into a single output per format. This is especially useful for Semantic exports from Google Takeout, which split your history into monthly files."
  },
  {
    question: "How do I open the converted files?",
    answer: "GPX files can be opened in apps like Strava, Garmin Connect, AllTrails, OsmAnd, Viking, and GPXSee. KML and KMZ files open directly in Google Earth and Google My Maps. GeoJSON files work with geojson.io, QGIS, Mapbox Studio, and most web mapping frameworks. CSV files open in Excel, Google Sheets, LibreOffice Calc, or any spreadsheet application. You can also import any of these formats into Dawarich for long-term storage and visualization."
  },
  {
    question: "Why should I convert my Google Timeline data?",
    answer: "Google discontinued the web version of Timeline in late 2024 and moved location data to on-device storage with limited export options. Converting your exported JSON files into standard formats like GPX or KML ensures your data remains accessible regardless of Google's future decisions. Standard formats can be opened by hundreds of applications, imported into self-hosted tools like Dawarich, and archived for decades without vendor lock-in."
  }
];

function downloadFile(content, filename, mimeType) {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function formatDateRange(points, paths) {
  const timestamps = [];

  points.forEach(p => {
    if (p.timestamp) timestamps.push(new Date(p.timestamp).getTime());
  });

  paths.forEach(p => {
    if (p.startTimestamp) timestamps.push(new Date(p.startTimestamp).getTime());
    if (p.endTimestamp) timestamps.push(new Date(p.endTimestamp).getTime());
  });

  if (timestamps.length === 0) return 'No timestamps found';

  const validTimestamps = timestamps.filter(t => !isNaN(t));
  if (validTimestamps.length === 0) return 'No valid timestamps';

  const min = new Date(Math.min(...validTimestamps));
  const max = new Date(Math.max(...validTimestamps));

  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return `${min.toLocaleDateString('en-US', options)} — ${max.toLocaleDateString('en-US', options)}`;
}

export default function GoogleTimelineConverter() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [parsedResults, setParsedResults] = useState([]);
  const [allPoints, setAllPoints] = useState([]);
  const [allPaths, setAllPaths] = useState([]);
  const [selectedFormats, setSelectedFormats] = useState({ gpx: true, kml: false, geojson: false, kmz: false, csv: false });
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState(null);

  const handleFilesLoaded = useCallback(async (files) => {
    setUploadedFiles(files);
    setError(null);

    const results = [];
    const mergedPoints = [];
    const mergedPaths = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const format = detectFormat(file.data);
        const parsed = parseTimeline(file.data);

        results.push({
          filename: file.filename,
          size: file.size,
          format,
          pointCount: parsed.points.length,
          pathCount: parsed.paths.length,
          points: parsed.points,
          paths: parsed.paths,
          metadata: parsed.metadata,
        });

        mergedPoints.push(...parsed.points);
        mergedPaths.push(...parsed.paths);
      } catch (err) {
        console.error(`Error parsing ${file.filename}:`, err);
        results.push({
          filename: file.filename,
          size: file.size,
          format: 'error',
          pointCount: 0,
          pathCount: 0,
          points: [],
          paths: [],
          error: err.message,
        });
      }
    }

    setParsedResults(results);
    setAllPoints(mergedPoints);
    setAllPaths(mergedPaths);
  }, []);

  const handleClear = useCallback(() => {
    setUploadedFiles([]);
    setParsedResults([]);
    setAllPoints([]);
    setAllPaths([]);
    setError(null);
  }, []);

  const handleFormatToggle = useCallback((format) => {
    setSelectedFormats(prev => ({ ...prev, [format]: !prev[format] }));
  }, []);

  const handleDownload = useCallback(async (format) => {
    if (allPoints.length === 0 && allPaths.length === 0) return;

    setIsConverting(true);
    setError(null);

    try {
      const converterPoints = timelineToConverterPoints(allPoints, allPaths);
      const baseName = 'google-timeline-export';

      switch (format) {
        case 'gpx': {
          const gpx = toGPX(converterPoints, { name: 'Google Timeline Export', description: 'Converted from Google Timeline data by Dawarich' });
          downloadFile(gpx, `${baseName}.gpx`, 'application/gpx+xml');
          break;
        }
        case 'kml': {
          const kml = toKML(converterPoints, { name: 'Google Timeline Export', description: 'Converted from Google Timeline data by Dawarich' });
          downloadFile(kml, `${baseName}.kml`, 'application/vnd.google-earth.kml+xml');
          break;
        }
        case 'geojson': {
          const geojson = toGeoJSON(converterPoints);
          downloadFile(geojson, `${baseName}.geojson`, 'application/geo+json');
          break;
        }
        case 'kmz': {
          const kmzBlob = await toKMZ(converterPoints, { name: 'Google Timeline Export', description: 'Converted from Google Timeline data by Dawarich' });
          downloadFile(kmzBlob, `${baseName}.kmz`, 'application/vnd.google-earth.kmz');
          break;
        }
        case 'csv': {
          const csv = timelineToCSV(allPoints, allPaths);
          downloadFile(csv, `${baseName}.csv`, 'text/csv');
          break;
        }
        default:
          break;
      }
    } catch (err) {
      console.error(`Error converting to ${format}:`, err);
      setError(`Conversion to ${format.toUpperCase()} failed: ${err.message}`);
    } finally {
      setIsConverting(false);
    }
  }, [allPoints, allPaths]);

  const handleDownloadAll = useCallback(async () => {
    const formats = Object.entries(selectedFormats)
      .filter(([, enabled]) => enabled)
      .map(([format]) => format);

    for (const format of formats) {
      await handleDownload(format);
      // Small delay between downloads to prevent browser blocking
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }, [selectedFormats, handleDownload]);

  const hasResults = parsedResults.length > 0;
  const totalPoints = allPoints.length;
  const totalPaths = allPaths.length;
  const hasData = totalPoints > 0 || totalPaths > 0;
  const selectedCount = Object.values(selectedFormats).filter(Boolean).length;

  return (
    <Layout
      title={pageTitle}
      description={pageDescription}
    >
      <Head>
        {/* Primary Meta Tags */}
        <meta name="title" content={pageTitle} />
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="convert google timeline to GPX, google takeout to KML, google location history to CSV, timeline to geojson converter, google timeline converter, google maps timeline export, location history to GPX, google takeout location converter, timeline data converter" />
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
            "name": "Google Timeline to GPX/KML/CSV Converter",
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
              "Convert Google Timeline JSON to GPX format",
              "Convert Google Timeline JSON to KML and KMZ format",
              "Convert Google Timeline JSON to GeoJSON format",
              "Convert Google Timeline JSON to CSV format",
              "Batch conversion for multi-file Semantic exports",
              "Privacy-first - all processing in browser",
              "Support for all 6 Google Timeline export formats",
              "No data sent to any server"
            ]
          })}
        </script>

        {/* JSON-LD Structured Data - HowTo */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to Convert Google Timeline Data to GPX, KML, or CSV",
            "description": "Export your Google Timeline data and convert it to standard GPS formats using this free, privacy-first tool.",
            "step": [
              {
                "@type": "HowToStep",
                "name": "Export your Google Timeline data",
                "text": "Visit takeout.google.com, select Location History (Timeline), and export. Alternatively, on Android: Google Maps → Settings → Location → Timeline → Export. On iOS: Google Maps → Settings → Personal Content → Export Timeline data."
              },
              {
                "@type": "HowToStep",
                "name": "Upload your JSON files and select output formats",
                "text": "Drag and drop your exported Google Timeline JSON files into the converter. The tool automatically detects the format. Select your desired output formats: GPX, KML, GeoJSON, KMZ, or CSV."
              },
              {
                "@type": "HowToStep",
                "name": "Download your converted files",
                "text": "Click the download button for each format or use 'Download All Selected' to get all chosen formats at once. Your converted files are ready to use in any compatible application."
              }
            ],
            "tool": {
              "@type": "HowToTool",
              "name": "Google Timeline Converter by Dawarich"
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
                "name": "Google Timeline Converter",
                "item": pageUrl
              }
            ]
          })}
        </script>
      </Head>

      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          <div className={styles.header}>
            <h1>Google Timeline Converter</h1>
            <p>Free, privacy-first tool to convert your Google Timeline location history to GPX, KML, GeoJSON, KMZ, or CSV. Upload your exported JSON files — all processing happens in your browser.</p>
          </div>

          <div className={styles.topSection}>
            <div className={styles.instructions}>
              <h2>How to Get Your Timeline Data</h2>
              <p>
                You can export your Google Timeline data using one of the following methods. If one doesn't work, try another.
              </p>
              <p>
                Unfortunately, some users might not be able to export their location data due to how Google changed its location storage policies.
              </p>
              <div className={styles.instructionsList}>
                <div className={styles.instructionItem}>
                  <strong>Google Takeout:</strong>
                  <p>Visit <a href="https://takeout.google.com/" target="_blank" rel="noopener noreferrer">takeout.google.com</a> → Choose Location History (Timeline) → Export</p>
                  <p>This way might not work for everyone because Google changed how location data is stored and exported. More details in our <a href="https://dawarich.app/blog/migrating-from-google-location-history-to-dawarich">blog</a>.</p>
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

          {!hasResults && (
            <div className={styles.preCtaPanel}>
              <div className={styles.preCtaContent}>
                <span className={styles.preCtaIcon}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <span>Looking for a long-term Google Timeline replacement? <a href="/?utm_source=tool&utm_medium=inline-cta&utm_campaign=google-timeline-converter">Dawarich</a> tracks your location history automatically, with full data ownership and privacy. <a href="/blog/migrating-from-google-location-history-to-dawarich">Learn how to migrate</a>.</span>
              </div>
            </div>
          )}

          {hasResults && (
            <div className={styles.resultSection}>
              <h2>Uploaded Files</h2>

              {error && (
                <div className={styles.errorMessage}>{error}</div>
              )}

              <div className={styles.fileInfoGrid}>
                {parsedResults.map((result, index) => (
                  <div key={index} className={styles.fileInfo}>
                    <div className={styles.fileInfoItem}>
                      <span className={styles.fileInfoLabel}>File</span>
                      <span className={styles.fileInfoValue}>{result.filename}</span>
                    </div>
                    <div className={styles.fileInfoItem}>
                      <span className={styles.fileInfoLabel}>Format</span>
                      <span className={styles.fileInfoValue}>{FORMAT_LABELS[result.format] || result.format}</span>
                    </div>
                    <div className={styles.fileInfoItem}>
                      <span className={styles.fileInfoLabel}>Size</span>
                      <span className={styles.fileInfoValue}>{(result.size / 1024 / 1024).toFixed(2)} MB</span>
                    </div>
                    <div className={styles.fileInfoItem}>
                      <span className={styles.fileInfoLabel}>Points</span>
                      <span className={styles.fileInfoValue}>{result.pointCount.toLocaleString()}</span>
                    </div>
                    <div className={styles.fileInfoItem}>
                      <span className={styles.fileInfoLabel}>Paths</span>
                      <span className={styles.fileInfoValue}>{result.pathCount.toLocaleString()}</span>
                    </div>
                    {result.error && (
                      <div className={styles.fileInfoItem}>
                        <span className={styles.fileInfoLabel}>Error</span>
                        <span className={styles.fileInfoValueError}>{result.error}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {hasData && (
                <>
                  <div className={styles.summaryBar}>
                    <span><strong>Total:</strong> {totalPoints.toLocaleString()} points, {totalPaths.toLocaleString()} paths</span>
                    <span><strong>Date Range:</strong> {formatDateRange(allPoints, allPaths)}</span>
                  </div>

                  <div className={styles.formatSelection}>
                    <h3>Select Output Formats</h3>
                    <div className={styles.formatCheckboxes}>
                      {[
                        { key: 'gpx', label: 'GPX', desc: 'Universal GPS format' },
                        { key: 'kml', label: 'KML', desc: 'Google Earth' },
                        { key: 'geojson', label: 'GeoJSON', desc: 'Web mapping' },
                        { key: 'kmz', label: 'KMZ', desc: 'Compressed KML' },
                        { key: 'csv', label: 'CSV', desc: 'Spreadsheets' },
                      ].map(({ key, label, desc }) => (
                        <label key={key} className={styles.formatCheckbox}>
                          <input
                            type="checkbox"
                            checked={selectedFormats[key]}
                            onChange={() => handleFormatToggle(key)}
                          />
                          <span className={styles.formatLabel}>
                            <strong>{label}</strong>
                            <span>{desc}</span>
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className={styles.downloadSection}>
                    <div className={styles.downloadButtons}>
                      {Object.entries(selectedFormats)
                        .filter(([, enabled]) => enabled)
                        .map(([format]) => (
                          <button
                            key={format}
                            className={styles.downloadButton}
                            onClick={() => handleDownload(format)}
                            disabled={isConverting}
                          >
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download {format.toUpperCase()}
                          </button>
                        ))}
                    </div>
                    {selectedCount > 1 && (
                      <button
                        className={styles.downloadAllButton}
                        onClick={handleDownloadAll}
                        disabled={isConverting}
                      >
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        {isConverting ? 'Converting...' : `Download All Selected (${selectedCount})`}
                      </button>
                    )}
                  </div>
                </>
              )}

              <div className={styles.ctaPanel}>
                <div className={styles.ctaContent}>
                  <h3>Your data is more than a file</h3>
                  <p>Import it into Dawarich to visualize and preserve your location history forever. See your travels on an interactive map, track daily movements, and never lose your data again.</p>
                  <a href="/?utm_source=tool&utm_medium=cta&utm_campaign=google-timeline-converter" className={styles.ctaButton}>Try Dawarich!</a>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className={styles.infoSection}>
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <h2>What Is a Google Timeline Converter?</h2>
              <p>A Google Timeline converter takes the raw JSON files from your Google location history export and transforms them into standard GPS formats that are widely supported by mapping applications, fitness trackers, and geographic information systems. Instead of being locked into Google's proprietary JSON format, you get files that work everywhere.</p>
              <p>This tool processes everything in your browser, so your sensitive location data never leaves your device. Upload your files, pick your formats, and download — it takes seconds for most exports and handles files with hundreds of thousands of location points.</p>
            </div>

            <div className={styles.infoCard}>
              <h2>Output Formats Explained</h2>
              <ul>
                <li><strong>GPX (GPS Exchange Format)</strong> — The universal standard for GPS data. Supported by virtually every GPS application including Strava, Garmin Connect, AllTrails, OsmAnd, and QGIS. Contains waypoints, tracks, and timestamps.</li>
                <li><strong>KML (Keyhole Markup Language)</strong> — Developed for Google Earth. Ideal for visualizing geographic data with placemarks, paths, and descriptions. Opens directly in Google Earth and Google My Maps.</li>
                <li><strong>GeoJSON</strong> — The standard for web-based mapping. Used by Leaflet, Mapbox, OpenLayers, and most web mapping frameworks. Human-readable JSON format that's easy to work with programmatically.</li>
                <li><strong>KMZ (Compressed KML)</strong> — A zipped version of KML that produces smaller file sizes. Useful for sharing via email or when file size matters. Opens in the same applications as KML.</li>
                <li><strong>CSV (Comma-Separated Values)</strong> — Tabular format that opens in Excel, Google Sheets, and LibreOffice. Includes latitude, longitude, timestamp, type, name, address, activity type, altitude, and accuracy columns. Best for data analysis and custom processing.</li>
              </ul>
            </div>

            <div className={styles.infoCard}>
              <h2>What Happened to Google Maps Timeline?</h2>
              <p>In late 2024, Google discontinued the web version of Google Maps Timeline and moved all location data to on-device storage. Only the last 90 days were migrated — older data was deleted unless users manually backed it up. Many people <a href="https://www.reddit.com/r/GoogleMaps/comments/1diivt3/megathread_google_maps_timeline_moving_to/" target="_blank" rel="noopener noreferrer">lost years of location history</a> in the transition.</p>
              <p>If you exported your data before or during the transition, this converter lets you transform it into standard formats for long-term preservation. Converting to GPX, KML, or CSV ensures your location history remains accessible regardless of what Google does next.</p>
            </div>

            <div className={styles.infoCard}>
              <h2>Why Convert Your Timeline Data?</h2>
              <p>Google's proprietary JSON format is not supported by most mapping applications. By converting to standard formats, you gain several advantages:</p>
              <ul>
                <li><strong>Portability</strong> — Use your location data in any application that supports GPX, KML, GeoJSON, or CSV</li>
                <li><strong>Long-term preservation</strong> — Standard formats will be readable decades from now, regardless of Google's future decisions</li>
                <li><strong>Analysis</strong> — Import CSV into spreadsheets for statistical analysis of your movement patterns</li>
                <li><strong>Visualization</strong> — View your history in Google Earth, QGIS, or web mapping tools</li>
                <li><strong>Migration</strong> — Import into self-hosted alternatives like <a href="/?utm_source=tool&utm_medium=info-section&utm_campaign=google-timeline-converter">Dawarich</a> for ongoing location tracking with full data ownership</li>
              </ul>
            </div>

            <div className={styles.infoCard}>
              <h2>Accuracy and Limitations</h2>
              <p>The converter faithfully transforms all geographic coordinates and timestamps from your Google Timeline export. However, there are some inherent limitations to be aware of:</p>
              <ul>
                <li><strong>Coordinate precision</strong> — Records.json uses E7 format (7 decimal places), which is converted to standard decimal degrees with full precision retained</li>
                <li><strong>Activity segments</strong> — Walking, driving, and cycling segments are preserved in CSV output. In GPX and KML, path coordinates are included as track segments</li>
                <li><strong>Place names</strong> — Semantic Location History includes place names and addresses, which are preserved as waypoint names. Records.json typically does not include place names</li>
                <li><strong>Large files</strong> — Files over 100 MB may take 10-30 seconds to process depending on your device. The tool processes data progressively to keep your browser responsive</li>
              </ul>
            </div>

            <div className={styles.infoCard}>
              <h2>Related Tools</h2>
              <ul>
                <li><a href="/tools/timeline-visualizer">Google Timeline Visualizer</a> — View your Google Timeline data on an interactive map without converting</li>
                <li><a href="/tools/heatmap-generator">GPS Heatmap Generator</a> — Create heatmaps from GPX, FIT, TCX, and other GPS files</li>
                <li><a href="/tools/gpx-merger">GPX Track Merger</a> — Combine multiple GPX files into one</li>
                <li><a href="/tools/photo-geotagging">Photo Geodata Extraction</a> — Extract GPS coordinates from your photos</li>
                <li><a href="/tools/geojson-to-gpx">GeoJSON to GPX Converter</a> — Convert GeoJSON files to GPX format</li>
                <li><a href="/tools/kml-to-gpx">KML to GPX Converter</a> — Convert KML files to GPX format</li>
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
            <a href="/?utm_source=tool&utm_medium=bottom-cta&utm_campaign=google-timeline-converter" className={styles.ctaButton}>Try Dawarich Free for 7 Days</a>
          </div>
        </div>
      </div>
    </Layout>
  );
}
