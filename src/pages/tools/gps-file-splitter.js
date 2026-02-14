import React, { useState, useCallback, useMemo } from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import { parseTimeline, detectFormat } from '@site/src/utils/timelineParser';
import { parseGPX, parseGeoJSON, parseKML } from '@site/src/utils/formatParsers';
import { splitBySize, splitByCount, splitByDate, packageAsZip, normalizePointsForSplit } from '@site/src/utils/fileSplitter';
import JSZip from 'jszip';
import styles from './gps-file-splitter.module.css';

const pageTitle = "GPS File Splitter - Split Large GPX, GeoJSON, KML & JSON Files";
const pageDescription = "Free tool to split large GPS and location files into smaller chunks. Split GPX, GeoJSON, KML, KMZ, and Google Timeline JSON by size, point count, or date. Download as ZIP. Privacy-first — runs in your browser.";
const pageUrl = "https://dawarich.app/tools/gps-file-splitter";
const imageUrl = "https://dawarich.app/img/meta-image.jpg";

const faqItems = [
  {
    question: "Is it safe to upload my GPS files here?",
    answer: "Yes. All data processing happens entirely in your browser using JavaScript. Your GPS files are never uploaded to any server — they stay on your device. When you close the tab, the data is gone. The tool is open source so you can verify exactly what the code does."
  },
  {
    question: "What file formats can I split?",
    answer: "This tool supports GPX, GeoJSON, KML, KMZ, and JSON (Google Timeline) files. KMZ files are automatically decompressed first since they are ZIP archives containing KML. Google Timeline JSON files in any of the six export formats are supported — Records.json, Semantic Location History, phone exports, and more."
  },
  {
    question: "How does splitting by size work?",
    answer: "When you choose the 'By Size' strategy, the tool estimates how many data points fit in each chunk based on the output format. For example, GPX uses about 180 bytes per point, so a 10MB target would hold roughly 55,000 points per chunk. The tool divides your data evenly to hit the target size."
  },
  {
    question: "Will splitting damage my data?",
    answer: "No. Every data point in your original file will appear in exactly one output chunk. No data is lost, duplicated, or modified. Each chunk is a valid standalone file with proper headers and structure for the chosen format."
  },
  {
    question: "Can I split Google Timeline JSON files?",
    answer: "Yes. Upload any Google Timeline JSON file — Records.json, Semantic Location History, or the newer phone-based export. The tool auto-detects the format, parses the location data, and splits it into chunks you can download as a ZIP file in your preferred output format."
  },
  {
    question: "Why would I need to split a GPS file?",
    answer: "Large GPS files can be difficult to work with. Many GPS apps and mapping tools have import size limits (often 10MB or 50MB). Splitting also helps when sharing portions of a track with others, organizing data by time period, or reducing file sizes for email attachments."
  }
];

export default function GPSFileSplitter() {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [fileFormat, setFileFormat] = useState('');
  const [points, setPoints] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSplitting, setIsSplitting] = useState(false);

  const [strategy, setStrategy] = useState('size');
  const [targetSizeMB, setTargetSizeMB] = useState(10);
  const [countPerChunk, setCountPerChunk] = useState(50000);
  const [dateGranularity, setDateGranularity] = useState('year');
  const [outputFormat, setOutputFormat] = useState('same');

  const handleFile = useCallback(async (file) => {
    setIsLoading(true);
    setPoints([]);
    setFileName(file.name);
    setFileSize(file.size);

    try {
      const ext = file.name.split('.').pop().toLowerCase();
      let parsedPoints = [];
      let format = ext;

      if (ext === 'json' || ext === 'geojson') {
        const text = await file.text();
        const data = JSON.parse(text);

        // Try Google Timeline format first
        const detected = detectFormat(data);
        if (detected !== 'unknown') {
          const parsed = parseTimeline(data);
          parsedPoints = normalizePointsForSplit([...parsed.points]);
          // Also add path coordinates as trackpoints
          if (parsed.paths) {
            parsed.paths.forEach(path => {
              if (path.coordinates) {
                path.coordinates.forEach(coord => {
                  parsedPoints.push({
                    type: 'trackpoint',
                    lat: coord[0],
                    lon: coord[1],
                    time: path.startTimestamp ? new Date(path.startTimestamp).toISOString() : undefined,
                  });
                });
              }
            });
          }
          format = `json (${detected})`;
        } else {
          // Try GeoJSON
          parsedPoints = parseGeoJSON(text);
          format = 'geojson';
        }
      } else if (ext === 'gpx') {
        const text = await file.text();
        parsedPoints = parseGPX(text);
        format = 'gpx';
      } else if (ext === 'kml') {
        const text = await file.text();
        parsedPoints = parseKML(text);
        format = 'kml';
      } else if (ext === 'kmz') {
        const zip = await JSZip.loadAsync(file);
        const kmlFile = zip.file(/\.kml$/i)[0];
        if (!kmlFile) throw new Error('No KML file found in KMZ archive');
        const kmlText = await kmlFile.async('string');
        parsedPoints = parseKML(kmlText);
        format = 'kml';
      } else {
        throw new Error(`Unsupported file format: .${ext}`);
      }

      setPoints(parsedPoints);
      setFileFormat(format);
    } catch (error) {
      console.error('Error parsing file:', error);
      alert(`Error parsing file: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDragEnter = useCallback((e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); }, []);
  const handleDragLeave = useCallback((e) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); }, []);
  const handleDragOver = useCallback((e) => { e.preventDefault(); e.stopPropagation(); }, []);
  const handleDrop = useCallback((e) => {
    e.preventDefault(); e.stopPropagation(); setIsDragging(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);
  const handleFileInput = useCallback((e) => {
    if (e.target.files[0]) handleFile(e.target.files[0]);
  }, [handleFile]);

  const getOutputFormat = useCallback(() => {
    if (outputFormat === 'same') {
      const f = fileFormat.split(' ')[0];
      if (['gpx', 'geojson', 'kml'].includes(f)) return f;
      return 'json';
    }
    return outputFormat;
  }, [outputFormat, fileFormat]);

  const chunkPreview = useMemo(() => {
    if (points.length === 0) return 0;
    const fmt = getOutputFormat();
    if (strategy === 'size') {
      const bytesPerPoint = { gpx: 180, geojson: 150, kml: 160, csv: 80, json: 120 }[fmt] || 150;
      const pointsPerChunk = Math.max(1, Math.floor((targetSizeMB * 1024 * 1024) / bytesPerPoint));
      return Math.ceil(points.length / pointsPerChunk);
    }
    if (strategy === 'count') return Math.ceil(points.length / Math.max(1, countPerChunk));
    if (strategy === 'date') {
      const groups = new Set();
      points.forEach(p => {
        const ts = p.time || p.timestamp;
        if (ts) {
          const d = new Date(ts);
          if (!isNaN(d.getTime())) {
            groups.add(dateGranularity === 'month' ? `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}` : String(d.getFullYear()));
          }
        }
      });
      return Math.max(1, groups.size + (points.some(p => !p.time && !p.timestamp) ? 1 : 0));
    }
    return 0;
  }, [points, strategy, targetSizeMB, countPerChunk, dateGranularity, getOutputFormat]);

  const handleSplit = useCallback(async () => {
    if (points.length === 0) return;
    setIsSplitting(true);

    try {
      const fmt = getOutputFormat();
      let chunks;

      if (strategy === 'size') {
        chunks = splitBySize(points, targetSizeMB, fmt);
      } else if (strategy === 'count') {
        chunks = splitByCount(points, countPerChunk);
      } else {
        chunks = splitByDate(points, dateGranularity);
      }

      const zipBlob = await packageAsZip(chunks, fmt, fileName);
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName.replace(/\.[^.]+$/, '')}_split.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error splitting file:', error);
      alert(`Error splitting file: ${error.message}`);
    } finally {
      setIsSplitting(false);
    }
  }, [points, strategy, targetSizeMB, countPerChunk, dateGranularity, getOutputFormat, fileName]);

  const handleClear = useCallback(() => {
    setPoints([]); setFileName(''); setFileSize(0); setFileFormat('');
  }, []);

  return (
    <Layout title={pageTitle} description={pageDescription}>
      <Head>
        <meta name="title" content={pageTitle} />
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="split large GPX file, split geojson into parts, split KML file, reduce GPS file size, split large JSON location file, GPS file splitter, split google timeline" />
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

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "GPS File Splitter",
            "url": pageUrl,
            "description": pageDescription,
            "applicationCategory": "UtilityApplication",
            "operatingSystem": "Any",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
            "featureList": [
              "Split large GPS files into smaller chunks",
              "Support for GPX, GeoJSON, KML, KMZ, and Google Timeline JSON",
              "Split by file size, point count, or date",
              "Download as ZIP archive",
              "Privacy-first - all processing in browser",
              "No data sent to any server"
            ]
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to Split a Large GPS File",
            "description": "Upload your GPS file and split it into smaller, manageable chunks.",
            "step": [
              { "@type": "HowToStep", "name": "Upload your GPS file", "text": "Drag and drop your GPX, GeoJSON, KML, KMZ, or Google Timeline JSON file into the splitter." },
              { "@type": "HowToStep", "name": "Choose split strategy", "text": "Select how to split: by target file size (default 10MB), by point count, or by date (year or month)." },
              { "@type": "HowToStep", "name": "Download your files", "text": "Click Split & Download ZIP to get all chunks packaged in a single ZIP file." }
            ]
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqItems.map(item => ({
              "@type": "Question",
              "name": item.question,
              "acceptedAnswer": { "@type": "Answer", "text": item.answer }
            }))
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://dawarich.app" },
              { "@type": "ListItem", "position": 2, "name": "Free Tools", "item": "https://dawarich.app/tools" },
              { "@type": "ListItem", "position": 3, "name": "GPS File Splitter", "item": pageUrl }
            ]
          })}
        </script>
      </Head>

      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          <div className={styles.header}>
            <h1>GPS File Splitter</h1>
            <p>Split large GPS and location files into smaller, manageable chunks. Supports GPX, GeoJSON, KML, KMZ, and Google Timeline JSON. Download all parts as a single ZIP file.</p>
          </div>

          <div className={styles.topSection}>
            <div className={styles.instructions}>
              <h2>Why Split GPS Files?</h2>
              <div className={styles.instructionsList}>
                <div className={styles.instructionItem}>
                  <strong>Import size limits:</strong>
                  <p>Many GPS apps and mapping tools have maximum file size limits (10MB, 50MB, etc.). Splitting lets you import large datasets in parts.</p>
                </div>
                <div className={styles.instructionItem}>
                  <strong>Share specific portions:</strong>
                  <p>Send only the relevant section of a large track to someone else, or split by year/month to organize your location history.</p>
                </div>
                <div className={styles.instructionItem}>
                  <strong>Improve performance:</strong>
                  <p>Large GPS files can slow down mapping applications. Working with smaller chunks keeps things responsive.</p>
                </div>
                <div className={styles.instructionItem}>
                  <strong>Google Timeline exports:</strong>
                  <p>Google Timeline Records.json files can be hundreds of megabytes. Split them into manageable pieces for import into other tools.</p>
                </div>
              </div>
            </div>

            <div className={styles.uploaderWrapper}>
              <div
                className={`${styles.dropzone} ${isDragging ? styles.dragging : ''} ${points.length > 0 ? styles.hasFile : ''}`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="splitterFileInput"
                  accept=".json,.gpx,.geojson,.kml,.kmz"
                  onChange={handleFileInput}
                  className={styles.fileInput}
                />
                <label htmlFor="splitterFileInput" style={{cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                  {isLoading ? (
                    <>
                      <div className={styles.spinner}></div>
                      <p>Parsing file...</p>
                    </>
                  ) : points.length > 0 ? (
                    <>
                      <svg className={styles.uploadIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <p>{fileName}</p>
                      <p className={styles.hint}>{points.length.toLocaleString()} points loaded</p>
                    </>
                  ) : (
                    <>
                      <svg className={styles.uploadIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p>Drop a GPS file here</p>
                      <p className={styles.hint}>or click to browse</p>
                      <p className={styles.formats}>Supports: GPX, GeoJSON, KML, KMZ, JSON (Google Timeline)</p>
                    </>
                  )}
                </label>
              </div>

              {points.length > 0 && (
                <button onClick={handleClear} style={{background: 'none', border: 'none', color: 'var(--ifm-color-primary)', cursor: 'pointer', fontSize: '0.9rem'}}>
                  Clear File
                </button>
              )}

              <div className={styles.privacyNote}>
                <div>
                  <strong>
                    <svg className={styles.privacyIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Privacy First
                  </strong>
                  <p>All data processing happens in your browser. Your files never leave your device.</p>
                </div>
              </div>
            </div>
          </div>

          {points.length === 0 && (
            <div className={styles.preCtaPanel}>
              <div className={styles.preCtaContent}>
                <span className={styles.preCtaIcon}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <span>Working with large location files? <a href="/?utm_source=tool&utm_medium=inline-cta&utm_campaign=gps-file-splitter">Dawarich</a> handles imports of any size automatically, with full data ownership and privacy.</span>
              </div>
            </div>
          )}
        </div>

        {points.length > 0 && (
          <div className={styles.resultSection}>
            <div className={styles.fileInfo}>
              <div className={styles.fileInfoGrid}>
                <div className={styles.fileInfoItem}>
                  <span className={styles.fileInfoValue}>{fileName}</span>
                  <span className={styles.fileInfoLabel}>File Name</span>
                </div>
                <div className={styles.fileInfoItem}>
                  <span className={styles.fileInfoValue}>{(fileSize / 1024 / 1024).toFixed(2)} MB</span>
                  <span className={styles.fileInfoLabel}>File Size</span>
                </div>
                <div className={styles.fileInfoItem}>
                  <span className={styles.fileInfoValue}>{fileFormat}</span>
                  <span className={styles.fileInfoLabel}>Format</span>
                </div>
                <div className={styles.fileInfoItem}>
                  <span className={styles.fileInfoValue}>{points.length.toLocaleString()}</span>
                  <span className={styles.fileInfoLabel}>Data Points</span>
                </div>
              </div>
            </div>

            <div className={styles.strategySection}>
              <h3>Split Strategy</h3>
              <div className={styles.strategyOptions}>
                <button className={`${styles.strategyOption} ${strategy === 'size' ? styles.strategyOptionActive : ''}`} onClick={() => setStrategy('size')}>By Size</button>
                <button className={`${styles.strategyOption} ${strategy === 'count' ? styles.strategyOptionActive : ''}`} onClick={() => setStrategy('count')}>By Point Count</button>
                <button className={`${styles.strategyOption} ${strategy === 'date' ? styles.strategyOptionActive : ''}`} onClick={() => setStrategy('date')}>By Date</button>
              </div>

              <div className={styles.controlsArea}>
                {strategy === 'size' && (
                  <div className={styles.sliderGroup}>
                    <div className={styles.sliderLabel}>
                      <span>Target chunk size</span>
                      <span className={styles.sliderValue}>{targetSizeMB} MB</span>
                    </div>
                    <input type="range" min="1" max="50" value={targetSizeMB} onChange={(e) => setTargetSizeMB(Number(e.target.value))} className={styles.slider} />
                  </div>
                )}

                {strategy === 'count' && (
                  <div className={styles.sliderGroup}>
                    <div className={styles.sliderLabel}>
                      <span>Points per chunk</span>
                    </div>
                    <input type="number" min="100" max="1000000" value={countPerChunk} onChange={(e) => setCountPerChunk(Math.max(1, Number(e.target.value)))} className={styles.countInput} />
                  </div>
                )}

                {strategy === 'date' && (
                  <div className={styles.dateRadios}>
                    <label>
                      <input type="radio" name="dateGranularity" value="year" checked={dateGranularity === 'year'} onChange={() => setDateGranularity('year')} />
                      Split by Year
                    </label>
                    <label>
                      <input type="radio" name="dateGranularity" value="month" checked={dateGranularity === 'month'} onChange={() => setDateGranularity('month')} />
                      Split by Month
                    </label>
                  </div>
                )}

                <div className={styles.outputSection}>
                  <label>Output format:</label>
                  <select value={outputFormat} onChange={(e) => setOutputFormat(e.target.value)} className={styles.outputFormatSelect}>
                    <option value="same">Same as input</option>
                    <option value="gpx">GPX</option>
                    <option value="geojson">GeoJSON</option>
                    <option value="kml">KML</option>
                    <option value="csv">CSV</option>
                    <option value="json">JSON</option>
                  </select>
                </div>
              </div>

              {chunkPreview > 0 && (
                <div className={styles.previewInfo}>
                  This will create <strong>{chunkPreview}</strong> chunk{chunkPreview !== 1 ? 's' : ''} from {points.length.toLocaleString()} points
                </div>
              )}

              <button onClick={handleSplit} disabled={isSplitting || points.length === 0} className={styles.splitButton}>
                {isSplitting ? 'Splitting...' : 'Split & Download ZIP'}
              </button>
            </div>

            <div className={styles.ctaPanel}>
              <div className={styles.ctaContent}>
                <h3>Working with large location files?</h3>
                <p>Dawarich handles imports of any size automatically. Import your Google Timeline, GPX, or GeoJSON data and visualize your entire location history.</p>
                <a href="/?utm_source=tool&utm_medium=cta&utm_campaign=gps-file-splitter" className={styles.ctaButton}>Try Dawarich Free</a>
              </div>
            </div>
          </div>
        )}

        <div className={styles.infoSection}>
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <h2>What Is a GPS File Splitter?</h2>
              <p>A GPS file splitter takes a large location data file and divides it into smaller, more manageable pieces. Each piece is a valid standalone file that can be opened, imported, or shared independently.</p>
              <p>This tool processes everything in your browser, so your sensitive location data never leaves your device. It supports all major GPS formats including Google Timeline exports.</p>
            </div>

            <div className={styles.infoCard}>
              <h2>Supported Input Formats</h2>
              <ul>
                <li><strong>GPX</strong> — GPS Exchange Format, the most common format for GPS tracks and waypoints</li>
                <li><strong>GeoJSON</strong> — Lightweight geographic data format used in web mapping</li>
                <li><strong>KML/KMZ</strong> — Keyhole Markup Language for Google Earth and Maps</li>
                <li><strong>JSON (Google Timeline)</strong> — All six Google Timeline export formats including Records.json and Semantic Location History</li>
              </ul>
            </div>

            <div className={styles.infoCard}>
              <h2>Split Strategies Explained</h2>
              <ul>
                <li><strong>By Size</strong> — Target a specific file size per chunk (default 10MB). The tool estimates output size per data point and divides accordingly.</li>
                <li><strong>By Point Count</strong> — Split every N data points. Useful when you know your target app's point limit.</li>
                <li><strong>By Date</strong> — Organize your data by year or month. Each time period becomes its own file.</li>
              </ul>
            </div>

            <div className={styles.infoCard}>
              <h2>Why Split Location Files?</h2>
              <p>GPS tracking apps and mapping tools often have import size limits. A Google Timeline Records.json file can be hundreds of megabytes — too large for most tools. Splitting lets you work with this data piece by piece.</p>
              <p>Splitting by date is especially useful for organizing years of location history into annual or monthly archives you can review individually.</p>
            </div>

            <div className={styles.infoCard}>
              <h2>Output Format Options</h2>
              <p>By default, output chunks use the same format as the input file. You can also convert during splitting — for example, split a Google Timeline JSON into monthly GPX files.</p>
              <p>Supported output formats: GPX, GeoJSON, KML, CSV, and JSON. All chunks are packaged into a single ZIP file for easy download.</p>
            </div>

            <div className={styles.infoCard}>
              <h2>Related Tools</h2>
              <ul>
                <li><a href="/tools/timeline-visualizer">Google Timeline Visualizer</a> — View your location history on a map</li>
                <li><a href="/tools/google-timeline-converter">Google Timeline Converter</a> — Convert timeline data to GPX, KML, CSV</li>
                <li><a href="/tools/timeline-statistics">Timeline Statistics Analyzer</a> — Get insights from your location data</li>
                <li><a href="/tools/timeline-merger">Timeline Data Merger</a> — Combine multiple timeline exports</li>
                <li><a href="/tools/gpx-merger">GPX Track Merger</a> — Merge multiple GPX files into one</li>
                <li><a href="/tools/timeline-format-detector">Timeline Format Detector</a> — Identify your export file type</li>
              </ul>
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
            <a href="/?utm_source=tool&utm_medium=bottom-cta&utm_campaign=gps-file-splitter" className={styles.ctaButton}>Try Dawarich Free for 7 Days</a>
          </div>
        </div>
      </div>
    </Layout>
  );
}
