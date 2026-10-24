import React, { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import Head from '@docusaurus/Head';
import Layout from '@theme/Layout';
import PersonalizedCTA from '@site/src/components/PersonalizedCTA';
import RelatedTools from '@site/src/components/RelatedTools';
import SaveToAccountButton from '@site/src/components/SaveToAccountButton';
import { detectGoogleSource } from '@site/src/utils/detectGoogleSource';
import { parseFile } from '@site/src/utils/heatmapUtils';
import { fetchDemoRoutePoints } from '@site/src/utils/demoPosterRoute';
import { pointsToTrackGeoJSON } from '@site/src/utils/posterTrack';
import { detectFormat } from '@site/src/utils/timelineParser';
import { interpolate } from '@docusaurus/Interpolate';
import { usePluralForm } from '@docusaurus/theme-common';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import RichText, { toPlainText } from '@site/src/i18n/RichText';
import { useLocalizedUrl } from '@site/src/i18n/useLocalizedUrl';
import content from '@locale-content/tools/map-poster-maker.json';
import styles from './map-poster-maker.module.css';

const LazyPosterStudioEditor = React.lazy(
  () => import('@site/src/components/PosterStudio/PosterStudioEditor'),
);

const pageTitle = content.meta.title;
const pageDescription =
  content.meta.description;
const imageUrl = 'https://dawarich.app/img/meta-image.png';

const MAX_FILE_BYTES = 100 * 1024 * 1024;

// Central Berlin: the studio opens here with the demo route until the
// visitor uploads their own file.
const BERLIN_FALLBACK_BOUNDS = [
  [13.35, 52.49],
  [13.46, 52.55],
];

const EMPTY_TRACK = { type: 'FeatureCollection', features: [] };

const faqItems = content.faq;

function jsonLdWebApplication(pageUrl) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: content.appName,
    url: pageUrl,
    description: pageDescription,
    applicationCategory: 'DesignApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };
}

function jsonLdHowTo() {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: content.howTo.name,
    description:
      content.howTo.description,
    step: [
      {
        '@type': 'HowToStep',
        name: content.howTo.steps[0].name,
        text: content.howTo.steps[0].text,
      },
      {
        '@type': 'HowToStep',
        name: content.howTo.steps[1].name,
        text: content.howTo.steps[1].text,
      },
      {
        '@type': 'HowToStep',
        name: content.howTo.steps[2].name,
        text: content.howTo.steps[2].text,
      },
    ],
    tool: { '@type': 'HowToTool', name: content.howTo.tool },
  };
}

function jsonLdFaq() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: toPlainText(item.q),
      acceptedAnswer: { '@type': 'Answer', text: toPlainText(item.a) },
    })),
  };
}

function jsonLdBreadcrumbs(pageUrl, homeUrl, toolsUrl) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: content.homeLabel, item: homeUrl },
      { '@type': 'ListItem', position: 2, name: content.toolsLabel, item: toolsUrl },
      { '@type': 'ListItem', position: 3, name: content.appName, item: pageUrl },
    ],
  };
}

export default function MapPosterMaker() {
  const { i18n } = useDocusaurusContext();
  const htmlLang = i18n.localeConfigs[i18n.currentLocale].htmlLang;
  const { selectMessage } = usePluralForm();
  const pageUrl = useLocalizedUrl('/tools/map-poster-maker/');
  const homeUrl = useLocalizedUrl('/');
  const toolsUrl = useLocalizedUrl('/tools/');
  const [files, setFiles] = useState([]);
  const [points, setPoints] = useState([]);
  const [showDemo, setShowDemo] = useState(true);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const [demoPoints, setDemoPoints] = useState(null);
  const [demoError, setDemoError] = useState(null);

  const uploadedTrack = useMemo(
    () => (points.length > 0 ? pointsToTrackGeoJSON(points) : null),
    [points],
  );

  useEffect(() => {
    if (!showDemo || uploadedTrack || demoPoints) return undefined;
    let cancelled = false;
    fetchDemoRoutePoints()
      .then((loaded) => {
        if (!cancelled) setDemoPoints(loaded);
      })
      .catch((loadError) => {
        if (!cancelled) setDemoError(loadError);
      });
    return () => {
      cancelled = true;
    };
  }, [showDemo, uploadedTrack, demoPoints]);

  const demoTrack = useMemo(
    () => (demoPoints ? pointsToTrackGeoJSON(demoPoints) : null),
    [demoPoints],
  );
  const activeTrack = uploadedTrack ?? (showDemo && demoTrack ? demoTrack : EMPTY_TRACK);
  const trackKey = uploadedTrack
    ? files.map((f) => f.name).join('|')
    : showDemo && demoTrack
      ? 'demo'
      : 'empty';

  const handleFiles = async (newFiles) => {
    setIsLoading(true);
    setError(null);
    try {
      const nextFiles = [...files];
      const nextPoints = [...points];
      for (const file of newFiles) {
        if (file.size > MAX_FILE_BYTES) {
          setError(interpolate(content.sizeError, { fileName: file.name }));
          continue;
        }
        try {
          let format = null;
          if (file.name.toLowerCase().endsWith('.json')) {
            try {
              format = detectFormat(JSON.parse(await file.text()));
            } catch {
              format = null;
            }
          }
          const filePoints = await parseFile(file);
          nextPoints.push(...filePoints);
          nextFiles.push({ name: file.name, pointCount: filePoints.length, blob: file, format });
        } catch (parseError) {
          setError(interpolate(content.parseError, { fileName: file.name, message: parseError.message }));
        }
      }
      if (nextFiles.length > files.length) {
        setFiles(nextFiles);
        setPoints(nextPoints);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDrag = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.type === 'dragenter' || event.type === 'dragover') setDragActive(true);
    else if (event.type === 'dragleave') setDragActive(false);
  }, []);

  const handleDrop = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      setDragActive(false);
      if (event.dataTransfer.files?.length > 0) handleFiles(Array.from(event.dataTransfer.files));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [files, points],
  );

  const handleClear = () => {
    setFiles([]);
    setPoints([]);
    setShowDemo(true);
    setError(null);
  };

  const getOriginalFiles = useCallback(
    () => files.map((f) => ({ name: f.name, blob: f.blob })).filter((f) => f.blob),
    [files],
  );

  return (
    <Layout title={pageTitle} description={pageDescription}>
      <Head>
        <meta name="title" content={pageTitle} />
        <meta name="description" content={pageDescription} />
        <meta
          name="keywords"
          content={content.meta.keywords}
        />

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

        <script type="application/ld+json">{JSON.stringify(jsonLdWebApplication(pageUrl))}</script>
        <script type="application/ld+json">{JSON.stringify(jsonLdHowTo())}</script>
        <script type="application/ld+json">{JSON.stringify(jsonLdFaq())}</script>
        <script type="application/ld+json">{JSON.stringify(jsonLdBreadcrumbs(pageUrl, homeUrl, toolsUrl))}</script>
      </Head>
      <main>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1>{content.h1}</h1>
            <p>
              {content.intro}
            </p>
            <p className={styles.valueStrip}>
              {interpolate(content.valueStrip, { price: '€0' })}
            </p>
          </div>

          <div className={styles.toolbar}>
            {uploadedTrack ? (
              <div className={styles.toolbarStatus}>
                <span className={styles.studioBarLabel}>
                  {interpolate(selectMessage(files.length, content.fileSummary), {
                    count: files.length.toLocaleString(htmlLang), points: points.length.toLocaleString(htmlLang),
                  })}
                </span>
                <button
                  type="button"
                  className={styles.clearButton}
                  data-testid="poster-start-over"
                  onClick={handleClear}
                >
                  {content.startOver}
                </button>
              </div>
            ) : (
              <label className={styles.demoToggle}>
                <input
                  type="checkbox"
                  data-testid="demo-toggle"
                  checked={showDemo}
                  onChange={(event) => setShowDemo(event.target.checked)}
                />
                <span>{content.demoLabel}</span>
              </label>
            )}

            <div
              className={`${styles.dropZoneCompact} ${dragActive ? styles.dragActive : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              data-testid="poster-dropzone"
            >
              <svg
                className={styles.dropIcon}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M7 16a4 4 0 0 1-.88-7.903A5 5 0 1 1 15.9 6L16 6a5 5 0 0 1 1 9.9" />
                <path d="M15 13l-3-3m0 0l-3 3m3-3v9" />
              </svg>
              <span className={styles.dropText}>
                <span className={styles.dropTitle}>
                  {uploadedTrack ? content.addFiles : content.dropFiles}
                </span>
                <span className={styles.supportedFormats}>
                  {content.formats}
                </span>
              </span>
              <input
                aria-label={content.inputLabel}
                type="file"
                className={styles.fileInput}
                accept=".gpx,.fit,.tcx,.geojson,.json,.kml,.kmz"
                multiple
                onChange={(event) => {
                  if (event.target.files?.length > 0) handleFiles(Array.from(event.target.files));
                }}
              />
            </div>
          </div>

          {isLoading && <p className={styles.loadingNote}>{content.processing}</p>}
          {error && (
            <p className={styles.errorMessage} role="alert">
              {error}
            </p>
          )}
          {files.length > 0 && !uploadedTrack && !isLoading && (
            <p className={styles.errorMessage}>
              {content.emptyError}
            </p>
          )}
          {demoError && !uploadedTrack && showDemo && (
            <p className={styles.errorMessage}>
              {content.demoError}
            </p>
          )}

          <section className={styles.studioSection}>
            <BrowserOnly fallback={<div className={styles.loadingNote}>{content.loadingStudio}</div>}>
              {() => (
                <Suspense fallback={<div className={styles.loadingNote}>{content.loadingStudio}</div>}>
                  <LazyPosterStudioEditor
                    trackGeojson={activeTrack}
                    fallbackBounds={BERLIN_FALLBACK_BOUNDS}
                    key={trackKey}
                  />
                </Suspense>
              )}
            </BrowserOnly>
            {files.length > 0 && uploadedTrack && (
              <div className={styles.saveSection}>
                <p className={styles.saveIntro}>
                  {content.saveIntro}
                </p>
                <SaveToAccountButton
                  toolName="map-poster-maker"
                  sourceHint={detectGoogleSource(files)}
                  getFiles={getOriginalFiles}
                  disabled={files.length === 0}
                />
              </div>
            )}
          </section>

          <div className={styles.faqSection}>
            <h2>{content.faqTitle}</h2>
            <div className={styles.faqList}>
              {faqItems.map((item) => (
                <details key={item.q} className={styles.faqItem}>
                  <summary className={styles.faqQuestion}>{item.q}</summary>
                  <p className={styles.faqAnswer}><RichText text={item.a} /></p>
                </details>
              ))}
            </div>
          </div>

          <PersonalizedCTA
            toolName="map-poster-maker"
            headline={
              uploadedTrack
                ? <RichText text={interpolate(content.ctaHeadline, { points: points.length.toLocaleString(htmlLang) })} />
                : content.ctaFallback
            }
          />
          <RelatedTools slug="map-poster-maker" />
        </div>
      </main>
    </Layout>
  );
}
