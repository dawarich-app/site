import React, { useState, useCallback } from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import { parseGPXDetailed, mergeGPXFiles, calculateMergeStats } from '@site/src/utils/gpxMerger';
import styles from './gpx-merger.module.css';

const pageTitle = "Free GPX Merger - Combine Multiple GPS Track Files Online";
const pageDescription = "Merge multiple GPX files into one. Free, privacy-first online tool to combine GPS tracks, waypoints, and routes. Works entirely in your browser - no upload required.";
const pageUrl = "https://dawarich.app/tools/gpx-merger";
const imageUrl = "https://dawarich.app/img/meta-image.jpg";

export default function GPXMerger() {
  const [files, setFiles] = useState([]);
  const [parsedFiles, setParsedFiles] = useState([]);
  const [stats, setStats] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [options, setOptions] = useState({
    mergeTracksIntoOne: false,
    sortByTime: false,
    outputName: 'Merged Tracks',
  });

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }, []);

  const handleFileInput = useCallback((e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  }, []);

  const handleFiles = async (newFiles) => {
    setIsProcessing(true);
    setError(null);

    try {
      const gpxFiles = newFiles.filter(f => f.name.toLowerCase().endsWith('.gpx'));
      
      if (gpxFiles.length === 0) {
        setError('Please select GPX files only.');
        setIsProcessing(false);
        return;
      }

      const parsed = [];
      for (const file of gpxFiles) {
        try {
          const text = await file.text();
          const gpxData = parseGPXDetailed(text, file.name);
          parsed.push(gpxData);
        } catch (err) {
          console.error(`Error parsing ${file.name}:`, err);
          setError(`Error parsing ${file.name}: ${err.message}`);
        }
      }

      const allParsed = [...parsedFiles, ...parsed];
      setParsedFiles(allParsed);
      setFiles([...files, ...gpxFiles.map(f => f.name)]);
      setStats(calculateMergeStats(allParsed));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    const newParsed = parsedFiles.filter((_, i) => i !== index);
    setFiles(newFiles);
    setParsedFiles(newParsed);
    setStats(newParsed.length > 0 ? calculateMergeStats(newParsed) : null);
  };

  const handleClear = () => {
    setFiles([]);
    setParsedFiles([]);
    setStats(null);
    setError(null);
  };

  const handleMerge = () => {
    if (parsedFiles.length < 2) {
      setError('Please add at least 2 GPX files to merge.');
      return;
    }

    try {
      const mergedGpx = mergeGPXFiles(parsedFiles, options);

      // Download the result
      const blob = new Blob([mergedGpx], { type: 'application/gpx+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${options.outputName.replace(/[^a-z0-9]/gi, '_')}.gpx`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(`Error merging files: ${err.message}`);
    }
  };

  const moveFile = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= files.length) return;

    const newFiles = [...files];
    const newParsed = [...parsedFiles];

    [newFiles[index], newFiles[newIndex]] = [newFiles[newIndex], newFiles[index]];
    [newParsed[index], newParsed[newIndex]] = [newParsed[newIndex], newParsed[index]];

    setFiles(newFiles);
    setParsedFiles(newParsed);
  };

  return (
    <Layout title={pageTitle} description={pageDescription}>
      <Head>
        <meta name="title" content={pageTitle} />
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content="GPX merger, merge GPX files, combine GPS tracks, GPX combiner, join GPX files, merge GPS files, GPX joiner, combine tracks" />
        <link rel="canonical" href={pageUrl} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={imageUrl} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={pageUrl} />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={imageUrl} />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "GPX Merger",
            "url": pageUrl,
            "description": pageDescription,
            "applicationCategory": "UtilityApplication",
            "operatingSystem": "Any",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          })}
        </script>
      </Head>

      <div className={styles.container}>
        <div className={styles.header}>
          <h1>GPX Track Merger</h1>
          <p>Combine multiple GPX files into a single file. Merge tracks from different activities, days, or devices into one unified GPS file.</p>
        </div>

        <div className={styles.mainContent}>
          <div className={styles.uploadPanel}>
            <div
              className={`${styles.dropZone} ${dragActive ? styles.dragActive : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <svg className={styles.uploadIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p>Drag & drop GPX files here</p>
              <span className={styles.hint}>or click to browse</span>
              <input
                type="file"
                className={styles.fileInput}
                accept=".gpx"
                multiple
                onChange={handleFileInput}
              />
            </div>

            {isProcessing && (
              <div className={styles.processingIndicator}>
                <div className={styles.spinner}></div>
                Processing files...
              </div>
            )}

            {error && (
              <div className={styles.errorMessage}>
                {error}
              </div>
            )}
          </div>

          {files.length > 0 && (
            <div className={styles.filesPanel}>
              <div className={styles.filesPanelHeader}>
                <h3>Files to Merge ({files.length})</h3>
                <button onClick={handleClear} className={styles.clearButton}>Clear All</button>
              </div>

              <p className={styles.orderHint}>Drag to reorder or use arrows. Files will be merged in this order.</p>

              <div className={styles.fileList}>
                {files.map((fileName, index) => {
                  const gpx = parsedFiles[index];
                  const trackCount = gpx?.tracks?.length || 0;
                  const pointCount = gpx?.tracks?.reduce((sum, t) => 
                    sum + t.segments.reduce((s, seg) => s + seg.length, 0), 0) || 0;

                  return (
                    <div key={index} className={styles.fileItem}>
                      <div className={styles.fileOrder}>
                        <button 
                          onClick={() => moveFile(index, -1)} 
                          disabled={index === 0}
                          className={styles.orderButton}
                        >
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </button>
                        <span className={styles.orderNumber}>{index + 1}</span>
                        <button 
                          onClick={() => moveFile(index, 1)} 
                          disabled={index === files.length - 1}
                          className={styles.orderButton}
                        >
                          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="16" height="16">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>
                      <div className={styles.fileInfo}>
                        <span className={styles.fileName}>{fileName}</span>
                        <span className={styles.fileMeta}>
                          {trackCount} track{trackCount !== 1 ? 's' : ''} | {pointCount.toLocaleString()} points
                        </span>
                      </div>
                      <button 
                        onClick={() => handleRemoveFile(index)} 
                        className={styles.removeButton}
                        title="Remove file"
                      >
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="18" height="18">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  );
                })}
              </div>

              {stats && (
                <div className={styles.statsPanel}>
                  <h4>Merge Summary</h4>
                  <div className={styles.statsGrid}>
                    <div className={styles.statItem}>
                      <span className={styles.statValue}>{stats.files}</span>
                      <span className={styles.statLabel}>Files</span>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statValue}>{stats.tracks}</span>
                      <span className={styles.statLabel}>Tracks</span>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statValue}>{stats.trackPoints.toLocaleString()}</span>
                      <span className={styles.statLabel}>Points</span>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statValue}>{stats.waypoints}</span>
                      <span className={styles.statLabel}>Waypoints</span>
                    </div>
                  </div>
                </div>
              )}

              <div className={styles.optionsPanel}>
                <h4>Merge Options</h4>
                
                <div className={styles.optionItem}>
                  <label>
                    <input
                      type="text"
                      value={options.outputName}
                      onChange={(e) => setOptions({ ...options, outputName: e.target.value })}
                      placeholder="Output file name"
                    />
                    <span className={styles.optionLabel}>Output Name</span>
                  </label>
                </div>

                <div className={styles.optionItem}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={options.mergeTracksIntoOne}
                      onChange={(e) => setOptions({ ...options, mergeTracksIntoOne: e.target.checked })}
                    />
                    <span>Merge all tracks into a single track</span>
                  </label>
                  <p className={styles.optionHint}>Combines all track segments into one continuous track</p>
                </div>

                <div className={styles.optionItem}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={options.sortByTime}
                      onChange={(e) => setOptions({ ...options, sortByTime: e.target.checked })}
                      disabled={!options.mergeTracksIntoOne}
                    />
                    <span>Sort points by timestamp</span>
                  </label>
                  <p className={styles.optionHint}>Only available when merging into single track</p>
                </div>
              </div>

              <button 
                onClick={handleMerge} 
                className={styles.mergeButton}
                disabled={files.length < 2}
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Merge & Download GPX
              </button>
            </div>
          )}

          <div className={styles.privacyNote}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>Your files stay in your browser. Nothing is uploaded to any server.</span>
          </div>
        </div>

        <div className={styles.infoSection}>
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <h2>Why Merge GPX Files?</h2>
              <ul>
                <li>Combine multi-day hikes or bike trips into one file</li>
                <li>Merge tracks from different GPS devices</li>
                <li>Create a complete route from separate segments</li>
                <li>Consolidate activities for easier sharing</li>
                <li>Build a comprehensive track for visualization</li>
              </ul>
            </div>

            <div className={styles.infoCard}>
              <h2>What Gets Merged?</h2>
              <ul>
                <li><strong>Tracks</strong> - All GPS track segments with timestamps and elevation</li>
                <li><strong>Waypoints</strong> - Named points of interest, markers</li>
                <li><strong>Routes</strong> - Planned navigation routes</li>
                <li><strong>Metadata</strong> - Combined into a new merged file description</li>
              </ul>
            </div>

            <div className={styles.infoCard}>
              <h2>Merge Options Explained</h2>
              <p><strong>Keep tracks separate:</strong> Each input file's tracks remain as individual tracks in the output. Good for maintaining activity boundaries.</p>
              <p><strong>Merge into single track:</strong> All track points are combined into one continuous track. Useful for creating a unified route visualization.</p>
            </div>

            <div className={styles.infoCard}>
              <h2>Compatible Applications</h2>
              <p>The merged GPX file works with:</p>
              <ul>
                <li>Garmin Connect, Strava, Komoot</li>
                <li>Google Earth, QGIS, CalTopo</li>
                <li>Gaia GPS, AllTrails, ViewRanger</li>
                <li>Any application that supports GPX 1.1</li>
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.ctaPanel}>
          <div className={styles.ctaContent}>
            <h3>Need to manage years of GPS data?</h3>
            <p>Try Dawarich - a self-hosted location tracking platform that automatically organizes and visualizes all your GPS activities, trips, and location history in one place.</p>
            <a href="/?utm_source=tool&utm_medium=cta&utm_campaign=gpx-merger" className={styles.ctaButton}>Explore Dawarich</a>
          </div>
        </div>
      </div>
    </Layout>
  );
}
