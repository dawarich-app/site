import React, { useState, useCallback } from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import { translate } from '@docusaurus/Translate';
import { interpolate } from '@docusaurus/Interpolate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import FileUploader from '@site/src/components/FileUploader';
import { parseTimeline, detectFormat } from '@site/src/utils/timelineParser';
import { timelineToConverterPoints, timelineToCSV } from '@site/src/utils/timelineToFormat';
import { toGPX, toGeoJSON, toKML, toKMZ } from '@site/src/utils/formatConverters';
import PersonalizedCTA from '@site/src/components/PersonalizedCTA';
import RelatedTools from '@site/src/components/RelatedTools';
import SaveToAccountButton from '@site/src/components/SaveToAccountButton';
import { detectGoogleSource } from '@site/src/utils/detectGoogleSource';
import RichText, { toPlainText } from '@site/src/i18n/RichText';
import { useLocalizedUrl } from '@site/src/i18n/useLocalizedUrl';
import content from '@locale-content/tools/google-timeline-converter.json';
import styles from './google-timeline-converter.module.css';

const imageUrl = "https://dawarich.app/img/meta-image.png";
const OUTPUT_FORMATS = ['gpx', 'kml', 'geojson', 'kmz', 'csv'];

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

function formatDateRange(points, paths, htmlLang) {
  const timestamps = [];

  points.forEach(p => {
    if (p.timestamp) timestamps.push(new Date(p.timestamp).getTime());
  });

  paths.forEach(p => {
    if (p.startTimestamp) timestamps.push(new Date(p.startTimestamp).getTime());
    if (p.endTimestamp) timestamps.push(new Date(p.endTimestamp).getTime());
  });

  if (timestamps.length === 0) return content.results.noTimestamps;

  const validTimestamps = timestamps.filter(t => !isNaN(t));
  if (validTimestamps.length === 0) return content.results.noValidTimestamps;

  const min = new Date(Math.min(...validTimestamps));
  const max = new Date(Math.max(...validTimestamps));

  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return `${min.toLocaleDateString(htmlLang, options)} — ${max.toLocaleDateString(htmlLang, options)}`;
}

export default function GoogleTimelineConverter() {
  const { i18n } = useDocusaurusContext();
  const htmlLang = i18n.localeConfigs[i18n.currentLocale].htmlLang;
  const pageUrl = useLocalizedUrl('/tools/google-timeline-converter/');
  const toolsUrl = useLocalizedUrl('/tools/');
  const homeUrl = useLocalizedUrl('/');
  const formatNumber = (value) => value.toLocaleString(htmlLang);
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

  const getOriginalFiles = useCallback(
    () => uploadedFiles.map((f) => ({ name: f.filename, blob: f.blob })),
    [uploadedFiles]
  );

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
      setError(interpolate(content.results.conversionFailed, { format: format.toUpperCase(), message: err.message }));
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
      title={content.meta.title}
      description={content.meta.description}
    >
      <Head>
        <meta name="title" content={content.meta.title} />
        <meta name="description" content={content.meta.description} />
        <meta name="keywords" content={content.meta.keywords} />

        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content={content.meta.title} />
        <meta property="og:description" content={content.meta.description} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:site_name" content="Dawarich" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={pageUrl} />
        <meta name="twitter:title" content={content.meta.title} />
        <meta name="twitter:description" content={content.meta.description} />
        <meta name="twitter:image" content={imageUrl} />

        <meta name="author" content="Dawarich" />
        <meta name="revisit-after" content="7 days" />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": content.meta.appName,
            "url": pageUrl,
            "description": content.meta.description,
            "applicationCategory": "UtilityApplication",
            "operatingSystem": "Any",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "featureList": content.meta.featureList
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": content.faq.map(item => ({
              "@type": "Question",
              "name": toPlainText(item.q),
              "acceptedAnswer": {
                "@type": "Answer",
                "text": toPlainText(item.a)
              }
            }))
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": translate({ id: 'shared.breadcrumb.home', message: 'Home' }),
                "item": homeUrl
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": translate({ id: 'shared.breadcrumb.tools', message: 'Free Tools' }),
                "item": toolsUrl
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": content.h1,
                "item": pageUrl
              }
            ]
          })}
        </script>
      </Head>
      <main>

      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          <div className={styles.header}>
            <h1>{content.h1}</h1>
            <p>{content.intro}</p>
          </div>

          <div className={styles.topSection}>
            <div className={styles.instructions}>
              <h2>{content.howTo.title}</h2>
              {content.howTo.paragraphs.map((text, index) => (
                <p key={index}><RichText text={text} /></p>
              ))}
              <div className={styles.instructionsList}>
                {content.howTo.methods.map((method) => (
                  <div key={method.label} className={styles.instructionItem}>
                    <strong>{method.label}</strong>
                    {method.steps.map((step, index) => (
                      <p key={index}><RichText text={step} /></p>
                    ))}
                  </div>
                ))}
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
                    {content.privacy.title}
                  </strong>
                  <p>{content.privacy.body}</p>
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
                <span><RichText text={content.preCta} /></span>
              </div>
            </div>
          )}

          {hasResults && (
            <div className={styles.resultSection}>
              <h2>{content.results.title}</h2>

              {error && (
                <div className={styles.errorMessage}>{error}</div>
              )}

              <div className={styles.fileInfoGrid}>
                {parsedResults.map((result, index) => (
                  <div key={index} className={styles.fileInfo}>
                    <div className={styles.fileInfoItem}>
                      <span className={styles.fileInfoLabel}>{content.results.file}</span>
                      <span className={styles.fileInfoValue}>{result.filename}</span>
                    </div>
                    <div className={styles.fileInfoItem}>
                      <span className={styles.fileInfoLabel}>{content.results.format}</span>
                      <span className={styles.fileInfoValue}>{content.formatLabels[result.format] || result.format}</span>
                    </div>
                    <div className={styles.fileInfoItem}>
                      <span className={styles.fileInfoLabel}>{content.results.size}</span>
                      <span className={styles.fileInfoValue}>{interpolate(content.results.sizeValue, { size: (result.size / 1024 / 1024).toLocaleString(htmlLang, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) })}</span>
                    </div>
                    <div className={styles.fileInfoItem}>
                      <span className={styles.fileInfoLabel}>{content.results.points}</span>
                      <span className={styles.fileInfoValue}>{formatNumber(result.pointCount)}</span>
                    </div>
                    <div className={styles.fileInfoItem}>
                      <span className={styles.fileInfoLabel}>{content.results.paths}</span>
                      <span className={styles.fileInfoValue}>{formatNumber(result.pathCount)}</span>
                    </div>
                    {result.error && (
                      <div className={styles.fileInfoItem}>
                        <span className={styles.fileInfoLabel}>{content.results.error}</span>
                        <span className={styles.fileInfoValueError}>{result.error}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {hasData && (
                <>
                  <div className={styles.summaryBar}>
                    <span><strong>{content.results.totalLabel}</strong> {interpolate(content.results.totalValue, { points: formatNumber(totalPoints), paths: formatNumber(totalPaths) })}</span>
                    <span><strong>{content.results.dateRangeLabel}</strong> {formatDateRange(allPoints, allPaths, htmlLang)}</span>
                  </div>

                  <div className={styles.formatSelection}>
                    <h3>{content.results.selectFormats}</h3>
                    <div className={styles.formatCheckboxes}>
                      {OUTPUT_FORMATS.map((key) => (
                        <label key={key} className={styles.formatCheckbox}>
                          <input
                            type="checkbox"
                            checked={selectedFormats[key]}
                            onChange={() => handleFormatToggle(key)}
                          />
                          <span className={styles.formatLabel}>
                            <strong>{key === 'geojson' ? 'GeoJSON' : key.toUpperCase()}</strong>
                            <span>{content.results.formats[key]}</span>
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
                            {interpolate(content.results.download, { format: format.toUpperCase() })}
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
                        {isConverting ? content.results.converting : interpolate(content.results.downloadAll, { count: selectedCount })}
                      </button>
                    )}
                  </div>

                  <div className={styles.saveToAccountSection}>
                    <p className={styles.saveToAccountIntro}>
                      {content.results.saveIntro}
                    </p>
                    <SaveToAccountButton
                      toolName="google-timeline-converter"
                      sourceHint={detectGoogleSource(parsedResults)}
                      getFiles={getOriginalFiles}
                      disabled={!hasData}
                    />
                  </div>
                </>
              )}

              <PersonalizedCTA
                toolName="google-timeline-converter"
                headline={<RichText text={interpolate(content.results.ctaHeadline, { points: formatNumber(allPoints.length) })} />}
                stats={[
                  { label: content.results.statPoints, value: formatNumber(allPoints.length) },
                  { label: content.results.statPaths, value: formatNumber(allPaths.length) },
                  { label: content.results.statFiles, value: formatNumber(parsedResults.length) },
                ]}
              />
            </div>
          )}
        </div>

        <div className={styles.infoSection}>
          <div className={styles.infoGrid}>
            {content.info.map((card) => (
              <div key={card.title} className={styles.infoCard}>
                <h2>{card.title}</h2>
                {card.paragraphs?.map((text, index) => (
                  <p key={index}><RichText text={text} /></p>
                ))}
                {card.items && (
                  <ul>
                    {card.items.map((text, index) => (
                      <li key={index}><RichText text={text} /></li>
                    ))}
                  </ul>
                )}
                {card.footer && <p><RichText text={card.footer} /></p>}
              </div>
            ))}
          </div>
        </div>

        <div className={styles.faqSection}>
          <h2>{content.faqTitle}</h2>
          <div className={styles.faqList}>
            {content.faq.map((item, index) => (
              <details key={index} className={styles.faqItem}>
                <summary className={styles.faqQuestion}>{item.q}</summary>
                <p className={styles.faqAnswer}>{item.a}</p>
              </details>
            ))}
          </div>
        </div>

        <div className={styles.bottomCtaPanel}>
          <div className={styles.ctaContent}>
            <h3>{content.bottomCta.title}</h3>
            <p>{content.bottomCta.body}</p>
            <Link to="/?utm_source=tool&utm_medium=bottom-cta&utm_campaign=google-timeline-converter" className={styles.ctaButton}>{content.bottomCta.button}</Link>
          </div>
        </div>
      </div>
        <RelatedTools slug="google-timeline-converter" />
      </main>
    </Layout>
  );
}
