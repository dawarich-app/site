import React, { useState, useCallback, useMemo } from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import { parseTimeline, detectFormat } from '@site/src/utils/timelineParser';
import { parseGPX, parseGeoJSON, parseKML } from '@site/src/utils/formatParsers';
import { splitBySize, splitByCount, splitByDate, packageAsZip, normalizePointsForSplit } from '@site/src/utils/fileSplitter';
import JSZip from 'jszip';
import PersonalizedCTA from '@site/src/components/PersonalizedCTA';
import RelatedTools from '@site/src/components/RelatedTools';
import { interpolate } from '@docusaurus/Interpolate';
import { usePluralForm } from '@docusaurus/theme-common';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import RichText, { SmartLink, toPlainText } from '@site/src/i18n/RichText';
import { useLocalizedUrl } from '@site/src/i18n/useLocalizedUrl';
import content from '@locale-content/tools/gps-file-splitter.json';
import styles from './gps-file-splitter.module.css';

const pageTitle = content.meta.title;
const pageDescription = content.meta.description;
const imageUrl = "https://dawarich.app/img/meta-image.png";

const faqItems = content.faq;

export default function GPSFileSplitter() {
  const { i18n } = useDocusaurusContext();
  const htmlLang = i18n.localeConfigs[i18n.currentLocale].htmlLang;
  const { selectMessage } = usePluralForm();
  const pageUrl = useLocalizedUrl('/tools/gps-file-splitter/');
  const homeUrl = useLocalizedUrl('/');
  const toolsUrl = useLocalizedUrl('/tools/');
  const formatSize = (size, digits) => interpolate(content.results.sizeValue, {
    size: size.toLocaleString(htmlLang, { minimumFractionDigits: digits, maximumFractionDigits: digits }),
  });
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
        if (!kmlFile) throw new Error(content.errors.missingKmlError);
        const kmlText = await kmlFile.async('string');
        parsedPoints = parseKML(kmlText);
        format = 'kml';
      } else {
        throw new Error(interpolate(content.errors.unsupportedFormatError, { format: ext }));
      }

      setPoints(parsedPoints);
      setFileFormat(format);
    } catch (error) {
      console.error('Error parsing file:', error);
      alert(interpolate(content.errors.parseError, { message: error.message }));
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
      alert(interpolate(content.errors.splitError, { message: error.message }));
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
        <meta name="keywords" content={content.meta.keywords} />
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

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": content.h1,
            "url": pageUrl,
            "description": pageDescription,
            "applicationCategory": "UtilityApplication",
            "operatingSystem": "Any",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
            "featureList": content.meta.featureList
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": content.howTo.name,
            "description": content.howTo.description,
            "step": [
              { "@type": "HowToStep", "name": content.howTo.steps[0].name, "text": content.howTo.steps[0].text },
              { "@type": "HowToStep", "name": content.howTo.steps[1].name, "text": content.howTo.steps[1].text },
              { "@type": "HowToStep", "name": content.howTo.steps[2].name, "text": content.howTo.steps[2].text }
            ]
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqItems.map(item => ({
              "@type": "Question",
              "name": toPlainText(item.q),
              "acceptedAnswer": { "@type": "Answer", "text": toPlainText(item.a) }
            }))
          })}
        </script>

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": content.homeLabel, "item": homeUrl },
              { "@type": "ListItem", "position": 2, "name": content.toolsLabel, "item": toolsUrl },
              { "@type": "ListItem", "position": 3, "name": content.h1, "item": pageUrl }
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
              <h2>{content.benefitsTitle}</h2>
              <div className={styles.instructionsList}>
                <div className={styles.instructionItem}>
                  <strong>{content.benefits[0].title}</strong>
                  <p>{content.benefits[0].body}</p>
                </div>
                <div className={styles.instructionItem}>
                  <strong>{content.benefits[1].title}</strong>
                  <p>{content.benefits[1].body}</p>
                </div>
                <div className={styles.instructionItem}>
                  <strong>{content.benefits[2].title}</strong>
                  <p>{content.benefits[2].body}</p>
                </div>
                <div className={styles.instructionItem}>
                  <strong>{content.benefits[3].title}</strong>
                  <p>{content.benefits[3].body}</p>
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
                  aria-label={content.upload.inputLabel}
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
                      <p>{content.upload.parsing}</p>
                    </>
                  ) : points.length > 0 ? (
                    <>
                      <svg className={styles.uploadIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <p>{fileName}</p>
                      <p className={styles.hint}>{interpolate(content.results.pointsLoaded, { points: points.length.toLocaleString(htmlLang) })}</p>
                    </>
                  ) : (
                    <>
                      <svg className={styles.uploadIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p>{content.upload.dropFile}</p>
                      <p className={styles.hint}>{content.upload.browse}</p>
                      <p className={styles.formats}>{content.upload.formats}</p>
                    </>
                  )}
                </label>
              </div>

              {points.length > 0 && (
                <button onClick={handleClear} style={{background: 'none', border: 'none', color: 'var(--ifm-color-primary)', cursor: 'pointer', fontSize: '0.9rem'}}>
                  {content.upload.clearButton}
                </button>
              )}

              <div className={styles.privacyNote}>
                <div>
                  <strong>
                    <svg className={styles.privacyIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    {content.privacyTitle}
                  </strong>
                  <p>{content.privacyBody}</p>
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
                <span><RichText text={content.preCta} /></span>
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
                  <span className={styles.fileInfoLabel}>{content.results.fileNameLabel}</span>
                </div>
                <div className={styles.fileInfoItem}>
                  <span className={styles.fileInfoValue}>{formatSize(fileSize / 1024 / 1024, 2)}</span>
                  <span className={styles.fileInfoLabel}>{content.results.fileSizeLabel}</span>
                </div>
                <div className={styles.fileInfoItem}>
                  <span className={styles.fileInfoValue}>{fileFormat}</span>
                  <span className={styles.fileInfoLabel}>{content.results.formatLabel}</span>
                </div>
                <div className={styles.fileInfoItem}>
                  <span className={styles.fileInfoValue}>{points.length.toLocaleString(htmlLang)}</span>
                  <span className={styles.fileInfoLabel}>{content.results.pointsLabel}</span>
                </div>
              </div>
            </div>

            <div className={styles.strategySection}>
              <h3>{content.options.strategyTitle}</h3>
              <div className={styles.strategyOptions}>
                <button className={`${styles.strategyOption} ${strategy === 'size' ? styles.strategyOptionActive : ''}`} onClick={() => setStrategy('size')}>{content.options.bySize}</button>
                <button className={`${styles.strategyOption} ${strategy === 'count' ? styles.strategyOptionActive : ''}`} onClick={() => setStrategy('count')}>{content.options.byCount}</button>
                <button className={`${styles.strategyOption} ${strategy === 'date' ? styles.strategyOptionActive : ''}`} onClick={() => setStrategy('date')}>{content.options.byDate}</button>
              </div>

              <div className={styles.controlsArea}>
                {strategy === 'size' && (
                  <div className={styles.sliderGroup}>
                    <div className={styles.sliderLabel}>
                      <span>{content.options.targetSizeLabel}</span>
                      <span className={styles.sliderValue}>{formatSize(targetSizeMB, 0)}</span>
                    </div>
                    <input aria-label={content.options.targetSizeAriaLabel} type="range" min="1" max="50" value={targetSizeMB} onChange={(e) => setTargetSizeMB(Number(e.target.value))} className={styles.slider} />
                  </div>
                )}

                {strategy === 'count' && (
                  <div className={styles.sliderGroup}>
                    <div className={styles.sliderLabel}>
                      <span>{content.options.pointsPerChunkLabel}</span>
                    </div>
                    <input aria-label={content.options.pointsPerChunkLabel} type="number" min="100" max="1000000" value={countPerChunk} onChange={(e) => setCountPerChunk(Math.max(1, Number(e.target.value)))} className={styles.countInput} />
                  </div>
                )}

                {strategy === 'date' && (
                  <div className={styles.dateRadios}>
                    <label>
                      <input type="radio" name="dateGranularity" value="year" checked={dateGranularity === 'year'} onChange={() => setDateGranularity('year')} />
                      {content.options.yearLabel}
                    </label>
                    <label>
                      <input type="radio" name="dateGranularity" value="month" checked={dateGranularity === 'month'} onChange={() => setDateGranularity('month')} />
                      {content.options.monthLabel}
                    </label>
                  </div>
                )}

                <div className={styles.outputSection}>
                  <label htmlFor="splitter-output-format">{content.options.outputLabel}</label>
                  <select id="splitter-output-format" value={outputFormat} onChange={(e) => setOutputFormat(e.target.value)} className={styles.outputFormatSelect}>
                    <option value="same">{content.options.sameFormat}</option>
                    <option value="gpx">{content.options.formats.gpx}</option>
                    <option value="geojson">{content.options.formats.geojson}</option>
                    <option value="kml">{content.options.formats.kml}</option>
                    <option value="csv">{content.options.formats.csv}</option>
                    <option value="json">{content.options.formats.json}</option>
                  </select>
                </div>
              </div>

              {chunkPreview > 0 && (
                <div className={styles.previewInfo}>
                  <RichText text={interpolate(selectMessage(chunkPreview, content.options.chunkPreview), {
                    count: chunkPreview.toLocaleString(htmlLang), points: points.length.toLocaleString(htmlLang),
                  })} />
                </div>
              )}

              <button onClick={handleSplit} disabled={isSplitting || points.length === 0} className={styles.splitButton}>
                {isSplitting ? content.options.splitting : content.options.splitButton}
              </button>
            </div>

            <PersonalizedCTA
              toolName="gps-file-splitter"
              headline={<RichText text={interpolate(content.cta.headline, { points: points.length.toLocaleString(htmlLang) })} />}
              stats={[
                { label: content.cta.statLabels.points, value: points.length.toLocaleString(htmlLang) },
              ]}
            />
          </div>
        )}

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

        <div className={styles.faqSection}>
          <h2>{content.faqTitle}</h2>
          <div className={styles.faqList}>
            {faqItems.map((item, index) => (
              <details key={index} className={styles.faqItem}>
                <summary className={styles.faqQuestion}>{item.q}</summary>
                <p className={styles.faqAnswer}><RichText text={item.a} /></p>
              </details>
            ))}
          </div>
        </div>

        <div className={styles.bottomCtaPanel}>
          <div className={styles.ctaContent}>
            <h3>{content.cta.title}</h3>
            <p>{content.cta.body}</p>
            <SmartLink href="/?utm_source=tool&utm_medium=bottom-cta&utm_campaign=gps-file-splitter" className={styles.ctaButton}>{content.cta.button}</SmartLink>
          </div>
        </div>
      </div>
        <RelatedTools slug="gps-file-splitter" />
      </main>
    </Layout>
  );
}
