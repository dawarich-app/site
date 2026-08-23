import React, { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import Head from '@docusaurus/Head';
import Layout from '@theme/Layout';
import PersonalizedCTA from '@site/src/components/PersonalizedCTA';
import RelatedTools from '@site/src/components/RelatedTools';
import SaveToAccountButton from '@site/src/components/SaveToAccountButton';
import { detectGoogleSource } from '@site/src/utils/detectGoogleSource';
import { fetchDemoRoutePoints } from '@site/src/utils/demoPosterRoute';
import { parseFile } from '@site/src/utils/heatmapUtils';
import { pointsToTrackGeoJSON } from '@site/src/utils/posterTrack';
import { detectFormat } from '@site/src/utils/timelineParser';
import styles from './route-video-maker.module.css';

const LazyVideoStudioEditor = React.lazy(
  () => import('@site/src/components/VideoStudio/VideoStudioEditor'),
);

const pageTitle = 'GPX & Google Timeline to Video — Free Route Video Maker';
const pageDescription =
  'Free GPX to video converter — turn GPX, Google Timeline, KML, FIT or TCX files into an animated route replay video in your browser. 17 map themes, MP4 export, no upload, no account.';
const pageUrl = 'https://dawarich.app/tools/route-video-maker/';
const imageUrl = 'https://dawarich.app/img/meta-image.png';

const MAX_FILE_BYTES = 100 * 1024 * 1024;

// Central Berlin: the studio opens on the demo route until a file is dropped.
const BERLIN_FALLBACK_BOUNDS = [
  [13.35, 52.49],
  [13.46, 52.55],
];

const EMPTY_TRACK = { type: 'FeatureCollection', features: [] };

const faqItems = [
  {
    question: 'How do I make a video from my GPS track?',
    answer:
      'The studio opens with a demo route through Berlin so you can try it immediately. Drop your own GPX, Google Timeline JSON, GeoJSON, KML, KMZ, FIT or TCX file to replace it, pick a map theme and format, and press Render. The route draws itself across the map, ends on a stats card, and downloads as an MP4 you can post anywhere.',
  },
  {
    question: 'Is my location data private?',
    answer:
      "Your file is parsed and the video is rendered entirely in your browser — nothing is uploaded to any server. To draw the map, tiles for the area your data covers are requested from Dawarich's tile server, the same as any online map. The only optional upload is \"Save to my account\", which imports your file during signup.",
  },
  {
    question: 'Is it free? Do I need an account?',
    answer:
      'Yes, free — no account, no signup, unlimited renders. Every video carries a small dawarich.app credit in its summary frame.',
  },
  {
    question: 'What formats and resolutions can I export?',
    answer:
      'Three formats: vertical 1080 × 1920 for Stories, Reels and TikTok, widescreen 1920 × 1080 for YouTube, and square 1080 × 1080 for feed posts. Videos are 8–30 seconds long, 30 frames per second, exported as MP4 (H.264 where the browser supports it).',
  },
  {
    question: 'Which browsers can render videos?',
    answer:
      'Rendering uses the WebCodecs API: current versions of Chrome, Edge and Safari work, as do recent Firefox releases. On unsupported browsers the preview still works — only the render step is unavailable.',
  },
  {
    question: 'Which files work with the video maker?',
    answer:
      'GPX tracks, Google Timeline exports (Records.json, Semantic Location History and phone Takeout formats), GeoJSON, KML, KMZ, FIT and TCX. You can drop several files at once — they are combined into one route, split wherever there is a gap of more than an hour.',
  },
  {
    question: 'Can I make a video from my Google Maps Timeline?',
    answer:
      'Yes — export your Timeline from the Google Maps app (Settings → Personal content → Export Timeline data) or via Google Takeout, then drop the JSON file here. The video plays your travel history day by day with dates and distance. To inspect the data first, try the Google Timeline Visualizer; to convert it into other formats, the Google Timeline Converter.',
  },
  {
    question: 'Is this an alternative to apps like Relive?',
    answer:
      'For route replay videos, yes — with no app install and no account. Relive builds 3D videos from activities tracked in its own app; this tool animates any GPS file you already have, including whole months of location history, and renders the MP4 locally in your browser instead of uploading your movements to a server.',
  },
  {
    question: 'Do Strava and Garmin exports work?',
    answer:
      'Yes. Export a single activity as GPX (or TCX) from Strava or Garmin Connect and drop it here — a FIT file straight off a Garmin device works too. One activity makes the cleanest video: the route draws itself from start to finish with your distance and dates.',
  },
];

function jsonLdWebApplication() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Route Video Maker',
    url: pageUrl,
    description: pageDescription,
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Any',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  };
}

function jsonLdHowTo() {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Create an Animated Video from Your GPS Data',
    description:
      'Turn a GPS track or your Google Timeline history into an animated route replay video, free and in the browser.',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Upload a location file',
        text: 'The studio opens with a Berlin demo route. Drag and drop a GPX, Google Timeline JSON, GeoJSON, KML, KMZ, FIT or TCX file to replace it with your own track.',
      },
      {
        '@type': 'HowToStep',
        name: 'Style your video',
        text: 'Pick one of 17 map themes, choose vertical, widescreen or square format, set the length, and decide whether the camera shows the whole route or follows the line as it draws.',
      },
      {
        '@type': 'HowToStep',
        name: 'Render and download',
        text: 'Press Render — the video is encoded in your browser and downloads as an MP4. A live HUD shows the date, distance and progress while the route draws, ending on a summary frame with the total distance and date range.',
      },
    ],
    tool: { '@type': 'HowToTool', name: 'Route Video Maker by Dawarich' },
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
      { '@type': 'ListItem', position: 3, name: 'Route Video Maker', item: pageUrl },
    ],
  };
}

export default function RouteVideoMaker() {
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
  const activePoints = uploadedTrack ? points : showDemo && demoPoints ? demoPoints : [];
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
          content="gpx to video, route video maker, google timeline video, animated route map, gpx route animation, route replay video, running route video, road trip video, travel recap video, map animation"
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
            <h1>Turn any GPS route into an animated map video</h1>
            <p>
              Your route, drawn across the map — as a video. Drop any GPX, Google Timeline, KML,
              FIT or TCX file and watch your run, ride or road trip draw itself across a styled
              map, then download it as an MP4 for Stories, Reels, TikTok or YouTube. Rendered
              entirely in your browser, no account.
            </p>
            <p className={styles.valueStrip}>
              17 map themes · vertical, widescreen &amp; square · MP4 export · €0 · no upload
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
                  data-testid="video-start-over"
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
              data-testid="video-dropzone"
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
                aria-label="Choose files to make a video from"
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
              The demo route failed to load — drop your own file to start.
            </p>
          )}

          <section className={styles.studioSection}>
            <BrowserOnly fallback={<div className={styles.loadingNote}>Loading the studio…</div>}>
              {() => (
                <Suspense fallback={<div className={styles.loadingNote}>Loading the studio…</div>}>
                  <LazyVideoStudioEditor
                    trackGeojson={activeTrack}
                    points={activePoints}
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
                  toolName="route-video-maker"
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
            toolName="route-video-maker"
            headline={
              uploadedTrack
                ? `Your video is built from <strong>${points.length.toLocaleString()}</strong> GPS points from one file. Dawarich records every route automatically — any trip in your history becomes a video. 7-day free trial, 14-day refund, cancel anytime.`
                : 'One file makes one video. Dawarich records every route automatically — any trip in your history becomes a video. 7-day free trial, 14-day refund, cancel anytime.'
            }
          />
          <RelatedTools slug="route-video-maker" />
        </div>
      </main>
    </Layout>
  );
}
