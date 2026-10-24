import React, { useState, useCallback } from 'react';
import SaveToAccountButton from '@site/src/components/SaveToAccountButton';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import { parseGPXDetailed, mergeGPXFiles, calculateMergeStats } from '@site/src/utils/gpxMerger';
import PersonalizedCTA from '@site/src/components/PersonalizedCTA';
import RelatedTools from '@site/src/components/RelatedTools';
import { interpolate } from '@docusaurus/Interpolate';
import { usePluralForm } from '@docusaurus/theme-common';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import RichText from '@site/src/i18n/RichText';
import { useLocalizedUrl } from '@site/src/i18n/useLocalizedUrl';
import content from '@locale-content/tools/gpx-merger.json';
import styles from './gpx-merger.module.css';

const pageTitle = content.meta.title;
const pageDescription = content.meta.description;
const imageUrl = "https://dawarich.app/img/meta-image.png";

export default function GPXMerger() {
  const { i18n } = useDocusaurusContext();
  const htmlLang = i18n.localeConfigs[i18n.currentLocale].htmlLang;
  const { selectMessage } = usePluralForm();
  const pageUrl = useLocalizedUrl('/tools/gpx-merger/');
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
        setError(content.errors.gpxOnly);
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
          setError(interpolate(content.errors.parse, { fileName: file.name, message: err.message }));
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
      setError(content.errors.minimumFiles);
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
      setError(interpolate(content.errors.merge, { message: err.message }));
    }
  };

  const getMergedFile = useCallback(async () => {
    if (parsedFiles.length < 2) return [];

    const mergedGpx = mergeGPXFiles(parsedFiles, options);
    const sanitized = options.outputName.replace(/[^a-z0-9]/gi, '_');
    const name = `${sanitized || 'merged_tracks'}.gpx`;
    return [{ name, blob: new Blob([mergedGpx], { type: 'application/gpx+xml' }) }];
  }, [parsedFiles, options]);

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
        <meta name="keywords" content={content.meta.keywords} />

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
            "name": content.appName,
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
      <main>

      <div className={styles.container}>
        <div className={styles.header}>
          <h1>{content.h1}</h1>
          <p>{content.intro}</p>
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
              <p>{content.upload.dropFiles}</p>
              <span className={styles.hint}>{content.upload.browse}</span>
              <input
                aria-label={content.upload.inputLabel}
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
                {content.upload.processing}
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
                <h3>{interpolate(content.results.filesToMergeHeading, { count: files.length.toLocaleString(htmlLang) })}</h3>
                <button onClick={handleClear} className={styles.clearButton}>{content.upload.clearButton}</button>
              </div>

              <p className={styles.orderHint}>{content.results.orderHint}</p>

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
                          {interpolate(content.results.fileSummary, {
                            tracks: interpolate(selectMessage(trackCount, content.results.trackCount), { count: trackCount.toLocaleString(htmlLang) }),
                            points: pointCount.toLocaleString(htmlLang),
                          })}
                        </span>
                      </div>
                      <button
                        onClick={() => handleRemoveFile(index)}
                        className={styles.removeButton}
                        title={content.results.removeFileTitle}
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
                  <h4>{content.results.summaryHeading}</h4>
                  <div className={styles.statsGrid}>
                    <div className={styles.statItem}>
                      <span className={styles.statValue}>{stats.files.toLocaleString(htmlLang)}</span>
                      <span className={styles.statLabel}>{content.results.filesLabel}</span>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statValue}>{stats.tracks.toLocaleString(htmlLang)}</span>
                      <span className={styles.statLabel}>{content.results.tracksLabel}</span>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statValue}>{stats.trackPoints.toLocaleString(htmlLang)}</span>
                      <span className={styles.statLabel}>{content.results.pointsLabel}</span>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statValue}>{stats.waypoints.toLocaleString(htmlLang)}</span>
                      <span className={styles.statLabel}>{content.results.waypointsLabel}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className={styles.optionsPanel}>
                <h4>{content.options.heading}</h4>

                <div className={styles.optionItem}>
                  <label>
                    <input
                      type="text"
                      value={options.outputName}
                      onChange={(e) => setOptions({ ...options, outputName: e.target.value })}
                      placeholder={content.options.outputPlaceholder}
                    />
                    <span className={styles.optionLabel}>{content.options.outputName}</span>
                  </label>
                </div>

                <div className={styles.optionItem}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={options.mergeTracksIntoOne}
                      onChange={(e) => setOptions({ ...options, mergeTracksIntoOne: e.target.checked })}
                    />
                    <span>{content.options.singleTrack}</span>
                  </label>
                  <p className={styles.optionHint}>{content.options.singleTrackHint}</p>
                </div>

                <div className={styles.optionItem}>
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={options.sortByTime}
                      onChange={(e) => setOptions({ ...options, sortByTime: e.target.checked })}
                      disabled={!options.mergeTracksIntoOne}
                    />
                    <span>{content.options.sortByTime}</span>
                  </label>
                  <p className={styles.optionHint}>{content.options.sortByTimeHint}</p>
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
                {content.options.mergeButton}
              </button>

              <div className={styles.saveToAccountSection}>
                <p className={styles.saveToAccountIntro}>
                  {content.saveIntro}
                </p>
                <SaveToAccountButton
                  toolName="gpx-merger"
                  sourceHint="gpx"
                  getFiles={getMergedFile}
                  disabled={files.length < 2}
                />
              </div>
            </div>
          )}

          <div className={styles.privacyNote}>
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span>{content.privacy}</span>
          </div>
        </div>

        <div className={styles.infoSection}>
          <div className={styles.infoGrid}>
            {content.cards.map((card, index) => (
              <div className={styles.infoCard} key={index}>
                <h2>{card.title}</h2>
                {card.paragraphs.map((text, index) => (
                  <p key={index}><RichText text={text} /></p>
                ))}
                {card.items && <ul>
                  {card.items.map((item, index) => (
                    <li key={index}><RichText text={item.body} /></li>
                  ))}
                </ul>}
              </div>
            ))}
          </div>
        </div>

        <PersonalizedCTA
          toolName="gpx-merger"
          headline={stats
            ? <RichText text={interpolate(content.cta.headline, {
              count: stats.files.toLocaleString(htmlLang), points: stats.trackPoints.toLocaleString(htmlLang),
            })} />
            : content.cta.fallback}
          stats={stats ? [
            { label: content.cta.statLabels.files, value: stats.files.toLocaleString(htmlLang) },
            { label: content.cta.statLabels.tracks, value: stats.tracks.toLocaleString(htmlLang) },
            { label: content.cta.statLabels.points, value: stats.trackPoints.toLocaleString(htmlLang) },
          ] : undefined}
        />
      </div>
        <RelatedTools slug="gpx-merger" />
      </main>
    </Layout>
  );
}
