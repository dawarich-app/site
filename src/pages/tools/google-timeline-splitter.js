import React, { useState, useCallback, useMemo } from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import { detectFormat } from '@site/src/utils/timelineParser';
import { splitTimeline, packageChunksAsZip, precomputeItemSizes, estimateChunkCount } from '@site/src/utils/timelineSplitter';
import PersonalizedCTA from '@site/src/components/PersonalizedCTA';
import styles from './google-timeline-splitter.module.css';

const pageTitle = "Google Timeline Splitter - Split Large Timeline JSON Files";
const pageDescription = "Free tool to split large Google Timeline JSON files into smaller, valid chunks. Supports all export formats: Records.json, Semantic Location History, Semantic Segments, and more. Choose your target file size. Privacy-first — runs in your browser.";
const pageUrl = "https://dawarich.app/tools/google-timeline-splitter";
const imageUrl = "https://dawarich.app/img/meta-image.jpg";

const SIZE_OPTIONS = [1, 5, 10, 20, 50, 100];

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
    answer: "Yes. All data processing happens entirely in your browser using JavaScript. Your location history files are never uploaded to any server — they stay on your device. When you close the tab, the data is gone. The tool is open source so you can verify exactly what the code does."
  },
  {
    question: "What Google Timeline formats can I split?",
    answer: "This splitter supports all six Google Timeline export formats: Records.json (raw GPS location records), Semantic Location History (monthly YYYY_MONTH.json files), Semantic Segments (newer phone-based export), Location History (array format with startTime/endTime), Settings, and Timeline Edits. The tool auto-detects the format when you upload a file."
  },
  {
    question: "Will splitting damage my data?",
    answer: "No. Every entry in your original file will appear in exactly one output chunk. No data is lost, duplicated, or modified. Each chunk is a valid JSON file in the exact same format as the original, so it can be imported into any tool that accepts Google Timeline files."
  },
  {
    question: "Why would I need to split a Google Timeline file?",
    answer: "Google Timeline exports — especially Records.json — can be hundreds of megabytes or even gigabytes. Many import tools (including Dawarich) handle large files better when they are split into smaller pieces. Splitting also helps if you want to share a portion of your data or process it in batches."
  },
  {
    question: "How does the size targeting work?",
    answer: "The tool samples entries from your file to estimate average entry size, then calculates how many entries fit in each chunk to hit the target. Actual chunk sizes may vary slightly because individual entries differ in size, but the tool errs on the side of staying under the target."
  },
  {
    question: "Can I import the split files into Dawarich?",
    answer: "Yes. Each chunk is a valid Google Timeline JSON file in the original format. You can import them one by one into Dawarich or any other tool that accepts Google Timeline exports. Dawarich also handles large files directly, but splitting can speed up the import process."
  }
];

export default function GoogleTimelineSplitter() {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState(0);
  const [fileFormat, setFileFormat] = useState('');
  const [fileData, setFileData] = useState(null);
  const [itemCount, setItemCount] = useState(0);
  const [sizeInfo, setSizeInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSplitting, setIsSplitting] = useState(false);
  const [targetSizeMB, setTargetSizeMB] = useState(10);

  const handleFile = useCallback(async (file) => {
    const ext = file.name.split('.').pop().toLowerCase();
    if (ext !== 'json') {
      alert('Please upload a JSON file. Google Timeline exports are always in JSON format.');
      return;
    }

    setIsLoading(true);
    setFileData(null);
    setFileName(file.name);
    setFileSize(file.size);

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      const format = detectFormat(data);

      if (format === 'unknown') {
        throw new Error('This does not appear to be a Google Timeline export file. Supported formats: Records.json, Semantic Location History, Semantic Segments, Location History, Settings, Timeline Edits.');
      }

      // Count items to show in UI
      let count = 0;
      if (format === 'records') count = (data.locations || []).length;
      else if (format === 'semantic') count = (data.timelineObjects || []).length;
      else if (format === 'semanticSegments') count = (data.semanticSegments || []).length;
      else if (format === 'locationHistory') count = Array.isArray(data) ? data.length : 0;
      else if (format === 'settings') count = (data.deviceSettings || []).length;
      else if (format === 'timelineEdits') count = (data.timelineEdits || []).length;

      // Pre-compute item sizes once so preview + split are both accurate
      const computed = precomputeItemSizes(data);
      setSizeInfo(computed);

      setFileFormat(format);
      setFileData(data);
      setItemCount(count);
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

  const chunkPreview = useMemo(() => {
    if (!sizeInfo || itemCount === 0) return 0;
    return estimateChunkCount(sizeInfo, targetSizeMB);
  }, [sizeInfo, targetSizeMB, itemCount]);

  const handleSplit = useCallback(async () => {
    if (!fileData) return;
    setIsSplitting(true);

    try {
      const result = splitTimeline(fileData, targetSizeMB);
      const zipBlob = await packageChunksAsZip(result.chunks, fileName);
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
  }, [fileData, targetSizeMB, fileName]);

  const handleClear = useCallback(() => {
    setFileData(null); setFileName(''); setFileSize(0); setFileFormat(''); setItemCount(0); setSizeInfo(null);
  }, []);

  return (
    <Layout title={pageTitle} description={pageDescription}>
      <Head>
        <meta name="title" content={pageTitle} />
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="split google timeline json, split records.json, split large google location history, google timeline splitter, split google takeout location, break up timeline json, google timeline file too large" />
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
            "name": "Google Timeline Splitter",
            "url": pageUrl,
            "description": pageDescription,
            "applicationCategory": "UtilityApplication",
            "operatingSystem": "Any",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
            "featureList": [
              "Split large Google Timeline JSON files into smaller chunks",
              "Support for all 6 Google Timeline export formats",
              "Choose target chunk size: 1, 5, 10, 20, 50, or 100 MB",
              "Each chunk is a valid JSON file in the original format",
              "Download all chunks as a single ZIP file",
              "Privacy-first - all processing in browser",
              "No data sent to any server"
            ]
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to Split a Large Google Timeline JSON File",
            "description": "Upload your Google Timeline export and split it into smaller, valid JSON chunks.",
            "step": [
              { "@type": "HowToStep", "name": "Upload your Google Timeline JSON", "text": "Drag and drop your Records.json, Semantic Location History, or other Google Timeline export file into the splitter." },
              { "@type": "HowToStep", "name": "Choose target chunk size", "text": "Select your desired chunk size: 1 MB, 5 MB, 10 MB, 20 MB, 50 MB, or 100 MB per file." },
              { "@type": "HowToStep", "name": "Download your split files", "text": "Click Split & Download ZIP to get all chunks packaged in a single ZIP file. Each chunk is a valid JSON file in the original format." }
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
              { "@type": "ListItem", "position": 3, "name": "Google Timeline Splitter", "item": pageUrl }
            ]
          })}
        </script>
      </Head>

      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          <div className={styles.header}>
            <h1>Google Timeline Splitter</h1>
            <p>Split large Google Timeline JSON exports into smaller, valid chunks. Each chunk stays in the original format so it can be imported anywhere. Choose your target file size and download a ZIP.</p>
          </div>

          <div className={styles.topSection}>
            <div className={styles.instructions}>
              <h2>Why Split Timeline Files?</h2>
              <div className={styles.instructionsList}>
                <div className={styles.instructionItem}>
                  <strong>Import size limits:</strong>
                  <p>Many tools have file size limits for imports. Splitting a 500 MB Records.json into 10 MB chunks makes importing painless.</p>
                </div>
                <div className={styles.instructionItem}>
                  <strong>Faster batch imports:</strong>
                  <p>Importing several smaller files is often faster and more reliable than a single massive file, especially over slow connections.</p>
                </div>
                <div className={styles.instructionItem}>
                  <strong>Preserves original format:</strong>
                  <p>Unlike converters, this tool keeps your data in the exact same Google Timeline JSON format. Every chunk is a valid, standalone file.</p>
                </div>
                <div className={styles.instructionItem}>
                  <strong>All formats supported:</strong>
                  <p>Works with Records.json, Semantic Location History, Semantic Segments, Location History phone exports, Settings, and Timeline Edits.</p>
                </div>
              </div>
            </div>

            <div className={styles.uploaderWrapper}>
              <div
                className={`${styles.dropzone} ${isDragging ? styles.dragging : ''} ${fileData ? styles.hasFile : ''}`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="splitterFileInput"
                  accept=".json"
                  onChange={handleFileInput}
                  className={styles.fileInput}
                />
                <label htmlFor="splitterFileInput" style={{cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                  {isLoading ? (
                    <>
                      <div className={styles.spinner}></div>
                      <p>Parsing file...</p>
                    </>
                  ) : fileData ? (
                    <>
                      <svg className={styles.uploadIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <p>{fileName}</p>
                      <p className={styles.hint}>{itemCount.toLocaleString()} entries loaded</p>
                    </>
                  ) : (
                    <>
                      <svg className={styles.uploadIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p>Drop a Google Timeline JSON file here</p>
                      <p className={styles.hint}>or click to browse</p>
                      <p className={styles.formats}>Supports: Records.json, Semantic, Location History, and more</p>
                    </>
                  )}
                </label>
              </div>

              {fileData && (
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

          {!fileData && (
            <div className={styles.preCtaPanel}>
              <div className={styles.preCtaContent}>
                <span className={styles.preCtaIcon}>
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                <span>Working with large Google Timeline exports? <a href="/?utm_source=tool&utm_medium=inline-cta&utm_campaign=google-timeline-splitter">Dawarich</a> handles imports of any size automatically, with full data ownership and privacy.</span>
              </div>
            </div>
          )}
        </div>

        {fileData && (
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
                  <span className={styles.fileInfoValue}>{FORMAT_LABELS[fileFormat] || fileFormat}</span>
                  <span className={styles.fileInfoLabel}>Format</span>
                </div>
                <div className={styles.fileInfoItem}>
                  <span className={styles.fileInfoValue}>{itemCount.toLocaleString()}</span>
                  <span className={styles.fileInfoLabel}>Entries</span>
                </div>
              </div>
            </div>

            <div className={styles.sizeSection}>
              <h3>Target Chunk Size</h3>
              <div className={styles.sizeOptions}>
                {SIZE_OPTIONS.map((size) => (
                  <button
                    key={size}
                    className={`${styles.sizeOption} ${targetSizeMB === size ? styles.sizeOptionActive : ''}`}
                    onClick={() => setTargetSizeMB(size)}
                  >
                    {size} MB
                  </button>
                ))}
              </div>

              {chunkPreview > 0 && (
                <div className={styles.previewInfo}>
                  This will create <strong>{chunkPreview}</strong> chunk{chunkPreview !== 1 ? 's' : ''} from {itemCount.toLocaleString()} entries (~{targetSizeMB} MB each)
                </div>
              )}

              <button onClick={handleSplit} disabled={isSplitting || !fileData} className={styles.splitButton}>
                {isSplitting ? 'Splitting...' : 'Split & Download ZIP'}
              </button>
            </div>

            <PersonalizedCTA
              toolName="google-timeline-splitter"
              headline={`Your file has <strong>${itemCount.toLocaleString()}</strong> entries. Dawarich handles imports of any size automatically — no splitting needed.`}
              stats={[
                { label: 'entries', value: itemCount.toLocaleString() },
                { label: 'file size', value: `${(fileSize / 1024 / 1024).toFixed(1)} MB` },
              ]}
            />
          </div>
        )}

        <div className={styles.infoSection}>
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <h2>What Is the Google Timeline Splitter?</h2>
              <p>This tool takes a large Google Timeline JSON export and divides it into smaller files, each targeting the size you choose. Every chunk is a valid, standalone JSON file in the exact same format as the original — it preserves the full structure, not just the coordinates.</p>
              <p>Unlike format converters that extract points into GPX or CSV, this splitter keeps your data in native Google Timeline format. This means you can import each chunk into any tool that accepts Google Timeline JSON, including Dawarich.</p>
            </div>

            <div className={styles.infoCard}>
              <h2>Supported Google Timeline Formats</h2>
              <ul>
                <li><strong>Records.json</strong> — Raw GPS location records with E7 coordinates, timestamps, accuracy, and activity data. Often the largest file in a Google Takeout export.</li>
                <li><strong>Semantic Location History</strong> — Monthly files (YYYY_MONTH.json) with place visits and activity segments including names and addresses.</li>
                <li><strong>Semantic Segments</strong> — Newer phone-based export format with visit and path data.</li>
                <li><strong>Location History</strong> — Array format with startTime/endTime entries and timeline paths.</li>
                <li><strong>Settings</strong> — Device settings and configuration data.</li>
                <li><strong>Timeline Edits</strong> — Place aggregates and raw signal data from user edits.</li>
              </ul>
            </div>

            <div className={styles.infoCard}>
              <h2>Choosing the Right Chunk Size</h2>
              <ul>
                <li><strong>1 MB</strong> — Maximum number of small files. Good for tools with very low import limits or for sharing individual portions.</li>
                <li><strong>5 MB</strong> — Small chunks that work with almost any import tool. Good default for email attachments.</li>
                <li><strong>10 MB</strong> — Balanced size that works with most import tools. Recommended for Dawarich imports.</li>
                <li><strong>20 MB</strong> — Fewer files, still manageable for most tools.</li>
                <li><strong>50 MB</strong> — Large chunks for tools that handle big files well.</li>
                <li><strong>100 MB</strong> — Minimal splitting. Use when you just need to break a very large file in half or into a few pieces.</li>
              </ul>
            </div>

            <div className={styles.infoCard}>
              <h2>How It Works</h2>
              <p>The splitter detects your file's format automatically, then divides the main data array (locations, timeline objects, segments, etc.) into evenly-sized groups. Each group is wrapped in the same JSON structure as the original file.</p>
              <p>The tool samples entries from your file to estimate average entry size, then calculates how many entries fit in each chunk to hit your target size. All chunks are packaged into a single ZIP file for easy download.</p>
            </div>

            <div className={styles.infoCard}>
              <h2>Privacy and Security</h2>
              <p>Your Google Timeline data contains sensitive location information. This tool processes everything entirely in your browser — no data is ever sent to a server. The files stay on your device from upload to download.</p>
              <p>We don't use cookies, analytics, or tracking for your uploaded files. The tool is part of the open-source Dawarich project, so you can inspect the code yourself.</p>
            </div>

            <div className={styles.infoCard}>
              <h2>Related Tools</h2>
              <ul>
                <li><a href="/tools/google-timeline-converter">Google Timeline Converter</a> — Convert timeline data to GPX, KML, CSV, or GeoJSON</li>
                <li><a href="/tools/timeline-visualizer">Google Timeline Visualizer</a> — View your location history on an interactive map</li>
                <li><a href="/tools/timeline-statistics">Timeline Statistics Analyzer</a> — Get insights from your location data</li>
                <li><a href="/tools/timeline-merger">Timeline Data Merger</a> — Combine multiple timeline exports</li>
                <li><a href="/tools/gps-file-splitter">GPS File Splitter</a> — Split GPX, GeoJSON, KML, and other GPS files</li>
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
            <a href="/?utm_source=tool&utm_medium=bottom-cta&utm_campaign=google-timeline-splitter" className={styles.ctaButton}>Try Dawarich Free for 7 Days</a>
          </div>
        </div>
      </div>
    </Layout>
  );
}
