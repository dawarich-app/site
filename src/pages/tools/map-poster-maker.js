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
import styles from './map-poster-maker.module.css';

const LazyPosterStudioEditor = React.lazy(
  () => import('@site/src/components/PosterStudio/PosterStudioEditor'),
);

const pageTitle = 'Free Map Poster Maker - Route Posters from GPS Files';
const pageDescription =
  'Turn GPX, Google Timeline, KML, FIT or TCX files into a custom map poster in your browser. 17 themes, 22 layouts, free PNG and PDF export, optional prints.';
const pageUrl = 'https://dawarich.app/tools/map-poster-maker/';
const imageUrl = 'https://dawarich.app/img/meta-image.png';

const MAX_FILE_BYTES = 100 * 1024 * 1024;

// Central Berlin: the studio opens here with the demo route until the
// visitor uploads their own file.
const BERLIN_FALLBACK_BOUNDS = [
  [13.35, 52.49],
  [13.46, 52.55],
];

const EMPTY_TRACK = { type: 'FeatureCollection', features: [] };

const faqItems = [
  {
    question: 'How do I make a poster from my GPS data?',
    answer:
      'The studio opens with a demo route through Berlin so you can try everything immediately. Drop your own GPX, Google Timeline JSON, GeoJSON, KML, KMZ, FIT or TCX file into the upload area to replace it, pick one of 17 map themes and 22 layouts, add a title, and download the finished poster as PNG or print-ready PDF.',
  },
  {
    question: 'Is my location data private?',
    answer:
      "Your file is parsed entirely in your browser and never uploaded to any server. To draw the map, tiles for the area your data covers are requested from Dawarich's tile server — that discloses the rough bounding box you are looking at, the same as any online map. Two optional actions upload data: ordering a print uploads the finished poster PDF to Dawarich's print service, and \"Save to my account\" uploads your file during signup.",
  },
  {
    question: 'Is it free? Do I need an account?',
    answer:
      'Yes, free — no account, no signup, no watermark. PNG and PDF downloads are unlimited. Only ordering a physical print costs money, and creating a Dawarich account is optional.',
  },
  {
    question: 'What resolution are the exported posters?',
    answer:
      'Print layouts export at up to 300 DPI with the physical size stamped into the PNG (pHYs) or PDF page. Social and wallpaper layouts export at their exact pixel dimensions, e.g. 1080 × 1920 for a story or 3840 × 2160 for a 4K wallpaper. Very large sizes are automatically stepped down to what your device’s graphics memory can render, and the notice tells you when that happens.',
  },
  {
    question: 'Can I order my poster as a physical print?',
    answer:
      'Yes — pick one of three print sizes (30 × 40, 50 × 70 or 70 × 100 cm), and the studio prepares a 300 DPI PDF and uploads it to Dawarich’s print service. Checkout runs on Stripe, prints ship on 200 gsm matte paper with free EU shipping. The final price is confirmed at checkout.',
  },
  {
    question: 'Which files work with the poster maker?',
    answer:
      'GPX tracks, Google Timeline exports (Records.json, Semantic Location History and phone Takeout formats), GeoJSON, KML, KMZ, FIT and TCX. You can drop several files at once — they are combined into one track, split wherever there is a gap of more than an hour.',
  },
];

function jsonLdWebApplication() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Map Poster Maker',
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
    name: 'How to Create a Map Poster from Your GPS Data',
    description:
      'Turn a GPS track or your Google Timeline history into a printable map poster, free and in the browser.',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Upload a location file',
        text: 'The studio opens with a Berlin demo route. Drag and drop a GPX, Google Timeline JSON, GeoJSON, KML, KMZ, FIT or TCX file to replace it with your own track.',
      },
      {
        '@type': 'HowToStep',
        name: 'Compose your poster',
        text: 'Pick one of 17 map themes and 22 layouts, add a title and subtitle, choose a font, and fine-tune the track color, opacity and width. Pan and zoom the preview to frame your route.',
      },
      {
        '@type': 'HowToStep',
        name: 'Export or order a print',
        text: 'Download the poster as PNG or print-ready PDF at up to 300 DPI, or order a physical print in 30×40, 50×70 or 70×100 cm.',
      },
    ],
    tool: { '@type': 'HowToTool', name: 'Map Poster Maker by Dawarich' },
  };
}

function jsonLdFaq() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

function jsonLdBreadcrumbs() {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://dawarich.app' },
      { '@type': 'ListItem', position: 2, name: 'Free Tools', item: 'https://dawarich.app/tools' },
      { '@type': 'ListItem', position: 3, name: 'Map Poster Maker', item: pageUrl },
    ],
  };
}

export default function MapPosterMaker() {
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
          setError(`${file.name} is larger than 100 MB — split it first (try the GPS File Splitter).`);
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
          setError(`Error parsing ${file.name}: ${parseError.message}`);
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
          content="map poster maker, route poster, GPX poster, city map poster, Google Timeline poster, running route poster, custom map print, map wall art, GPS art"
        />
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

        <script type="application/ld+json">{JSON.stringify(jsonLdWebApplication())}</script>
        <script type="application/ld+json">{JSON.stringify(jsonLdHowTo())}</script>
        <script type="application/ld+json">{JSON.stringify(jsonLdFaq())}</script>
        <script type="application/ld+json">{JSON.stringify(jsonLdBreadcrumbs())}</script>
      </Head>
      <main>
        <div className={styles.container}>
          <div className={styles.header}>
            <h1>Anyone can hang a map poster of Berlin. Only you have your route.</h1>
            <p>
              The poster below is the demo — one month of getting around Berlin. Drop any GPX,
              Google Timeline, KML, FIT or TCX file and it becomes a map nobody else can hang —
              your rides, your runs, your road trips. About two minutes, no account.
            </p>
            <p className={styles.valueStrip}>
              17 map themes · 22 formats, A5 to A0 and 4K · 300 DPI PNG &amp; PDF · €0 · no
              watermark
            </p>
          </div>

          <div className={styles.toolbar}>
            {uploadedTrack ? (
              <div className={styles.toolbarStatus}>
                <span className={styles.studioBarLabel}>
                  {files.length} file{files.length === 1 ? '' : 's'} ·{' '}
                  {points.length.toLocaleString()} points
                </span>
                <button
                  type="button"
                  className={styles.clearButton}
                  data-testid="poster-start-over"
                  onClick={handleClear}
                >
                  Start over
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
                <span>Show demo data</span>
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
                  {uploadedTrack ? 'Add more files' : 'Drop your location file here or click to browse'}
                </span>
                <span className={styles.supportedFormats}>
                  GPX, FIT, TCX, GeoJSON, KML, KMZ, Google Timeline JSON
                </span>
              </span>
              <input
                aria-label="Choose files to make a poster from"
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

          {isLoading && <p className={styles.loadingNote}>Processing files…</p>}
          {error && (
            <p className={styles.errorMessage} role="alert">
              {error}
            </p>
          )}
          {files.length > 0 && !uploadedTrack && !isLoading && (
            <p className={styles.errorMessage}>
              No plottable points found in the uploaded files — check that they contain location
              data.
            </p>
          )}
          {demoError && !uploadedTrack && showDemo && (
            <p className={styles.errorMessage}>
              The demo route failed to load — drop your own file to start composing.
            </p>
          )}

          <section className={styles.studioSection}>
            <BrowserOnly fallback={<div className={styles.loadingNote}>Loading the studio…</div>}>
              {() => (
                <Suspense fallback={<div className={styles.loadingNote}>Loading the studio…</div>}>
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
                  Want this data in your Dawarich account too? We&apos;ll import it during signup —
                  no second upload needed.
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
            <h2>Frequently Asked Questions</h2>
            <div className={styles.faqList}>
              {faqItems.map((item) => (
                <details key={item.question} className={styles.faqItem}>
                  <summary className={styles.faqQuestion}>{item.question}</summary>
                  <p className={styles.faqAnswer}>{item.answer}</p>
                </details>
              ))}
            </div>
          </div>

          <PersonalizedCTA
            toolName="map-poster-maker"
            headline={
              uploadedTrack
                ? `Your poster is built from <strong>${points.length.toLocaleString()}</strong> GPS points from one file. Dawarich records every route automatically — any month of your history becomes a poster. 7-day free trial, 14-day refund, cancel anytime.`
                : 'One file makes one poster. Dawarich records every route automatically — any month of your history becomes a poster. 7-day free trial, 14-day refund, cancel anytime.'
            }
          />
          <RelatedTools slug="map-poster-maker" />
        </div>
      </main>
    </Layout>
  );
}
