import React, { useState, useCallback, useMemo } from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import { detectFormat } from '@site/src/utils/timelineParser';
import { splitTimeline, packageChunksAsZip, precomputeItemSizes, estimateChunkCount } from '@site/src/utils/timelineSplitter';
import PersonalizedCTA from '@site/src/components/PersonalizedCTA';
import RelatedTools from '@site/src/components/RelatedTools';
import { interpolate } from '@docusaurus/Interpolate';
import { usePluralForm } from '@docusaurus/theme-common';
import RichText, { SmartLink, toPlainText } from '@site/src/i18n/RichText';
import { useLocalizedUrl } from '@site/src/i18n/useLocalizedUrl';
import content from '@locale-content/tools/google-timeline-splitter.json';
import styles from './google-timeline-splitter.module.css';
import { useHtmlLang } from '@site/src/i18n/useHtmlLang';

const pageTitle = content.meta.title;
const pageDescription = content.meta.description;
const imageUrl = "https://dawarich.app/img/meta-image.png";

const SIZE_OPTIONS = [1, 5, 10, 20, 50, 100];

const FORMAT_LABELS = {
  records: content.formatLabels.records,
  semantic: content.formatLabels.semantic,
  semanticSegments: content.formatLabels.semanticSegments,
  locationHistory: content.formatLabels.locationHistory,
  settings: content.formatLabels.settings,
  timelineEdits: content.formatLabels.timelineEdits,
  unknown: content.formatLabels.unknown,
};

const faqItems = content.faq;

export default function GoogleTimelineSplitter() {
  const htmlLang = useHtmlLang();
  const { selectMessage } = usePluralForm();
  const pageUrl = useLocalizedUrl('/tools/google-timeline-splitter/');
  const homeUrl = useLocalizedUrl('/');
  const toolsUrl = useLocalizedUrl('/tools/');
  const formatSize = (size, digits) => interpolate(content.results.sizeValue, {
    size: size.toLocaleString(htmlLang, { minimumFractionDigits: digits, maximumFractionDigits: digits }),
  });
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
      alert(content.errors.jsonOnlyError);
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
        throw new Error(content.errors.unknownFormatError);
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
      alert(interpolate(content.errors.splitError, { message: error.message }));
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
                className={`${styles.dropzone} ${isDragging ? styles.dragging : ''} ${fileData ? styles.hasFile : ''}`}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <input
                  aria-label={content.upload.inputLabel}
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
                      <p>{content.upload.parsing}</p>
                    </>
                  ) : fileData ? (
                    <>
                      <svg className={styles.uploadIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <p>{fileName}</p>
                      <p className={styles.hint}>{interpolate(content.results.entriesLoaded, { count: itemCount.toLocaleString(htmlLang) })}</p>
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

              {fileData && (
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

          {!fileData && (
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

        {fileData && (
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
                  <span className={styles.fileInfoValue}>{FORMAT_LABELS[fileFormat] || fileFormat}</span>
                  <span className={styles.fileInfoLabel}>{content.results.formatLabel}</span>
                </div>
                <div className={styles.fileInfoItem}>
                  <span className={styles.fileInfoValue}>{itemCount.toLocaleString(htmlLang)}</span>
                  <span className={styles.fileInfoLabel}>{content.results.entriesLabel}</span>
                </div>
              </div>
            </div>

            <div className={styles.sizeSection}>
              <h3>{content.options.targetSizeTitle}</h3>
              <div className={styles.sizeOptions}>
                {SIZE_OPTIONS.map((size) => (
                  <button
                    key={size}
                    className={`${styles.sizeOption} ${targetSizeMB === size ? styles.sizeOptionActive : ''}`}
                    onClick={() => setTargetSizeMB(size)}
                  >
                    {formatSize(size, 0)}
                  </button>
                ))}
              </div>

              {chunkPreview > 0 && (
                <div className={styles.previewInfo}>
                  <RichText text={interpolate(selectMessage(chunkPreview, content.options.chunkPreview), {
                    count: chunkPreview.toLocaleString(htmlLang), entries: itemCount.toLocaleString(htmlLang), size: targetSizeMB.toLocaleString(htmlLang),
                  })} />
                </div>
              )}

              <button onClick={handleSplit} disabled={isSplitting || !fileData} className={styles.splitButton}>
                {isSplitting ? content.options.splitting : content.options.splitButton}
              </button>
            </div>

            <PersonalizedCTA
              toolName="google-timeline-splitter"
              headline={<RichText text={interpolate(content.cta.headline, { count: itemCount.toLocaleString(htmlLang) })} />}
              stats={[
                { label: content.cta.statLabels.entries, value: itemCount.toLocaleString(htmlLang) },
                { label: content.cta.statLabels.fileSize, value: formatSize(fileSize / 1024 / 1024, 1) },
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
            <SmartLink href="/?utm_source=tool&utm_medium=bottom-cta&utm_campaign=google-timeline-splitter" className={styles.ctaButton}>{content.cta.button}</SmartLink>
          </div>
        </div>
      </div>
        <RelatedTools slug="google-timeline-splitter" />
      </main>
    </Layout>
  );
}
