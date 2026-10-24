import React, { useState, useCallback, useMemo, useEffect, useRef, lazy, Suspense } from 'react';
import Layout from '@theme/Layout';
import RelatedTools from '@site/src/components/RelatedTools';
import Head from '@docusaurus/Head';
import BrowserOnly from '@docusaurus/BrowserOnly';
import FileUploader from '@site/src/components/FileUploader';
import SaveToAccountButton from '@site/src/components/SaveToAccountButton';
import TimelinePanel from '@site/src/components/TimelinePanel/TimelinePanel';
import { parseTimeline } from '@site/src/utils/timelineParser';
import { SAMPLE_DAY } from '@site/src/utils/sampleBerlinData';
import { buildDayIndex, buildYearStats, buildMonthGrid } from '@site/src/utils/timelineDays';
import { interpolate } from '@docusaurus/Interpolate';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import RichText, { SmartLink, toPlainText } from '@site/src/i18n/RichText';
import { useLocalizedUrl } from '@site/src/i18n/useLocalizedUrl';
import content from '@locale-content/tools/timeline-visualizer.json';
import styles from './timeline-visualizer.module.css';

const TimelineMapV2 = lazy(() => import('@site/src/components/TimelineMapV2'));

const pageTitle = content.meta.title;
const pageDescription = content.meta.description;
const imageUrl = "https://dawarich.app/img/meta-image.png";

const faqItems = content.faq;

function nextDateKey(currentKey, direction) {
  if (!currentKey) return null;
  const [y, m, d] = currentKey.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  date.setUTCDate(date.getUTCDate() + (direction === 'prev' ? -1 : 1));
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
}

function nextMonthKey(monthKey, direction) {
  const [y, m] = monthKey.split('-').map(Number);
  const date = new Date(y, m - 1 + (direction === 'prev' ? -1 : 1), 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export default function TimelineVisualizer() {
  const { i18n } = useDocusaurusContext();
  const htmlLang = i18n.localeConfigs[i18n.currentLocale].htmlLang;
  const pageUrl = useLocalizedUrl('/tools/timeline-visualizer/');
  const homeUrl = useLocalizedUrl('/');
  const toolsUrl = useLocalizedUrl('/tools/');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [points, setPoints] = useState([]);
  const [paths, setPaths] = useState([]);
  const [dayIndex, setDayIndex] = useState(() => new Map());
  const [yearStats, setYearStats] = useState(() => new Map());

  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [visibleMonth, setVisibleMonth] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedVisitId, setSelectedVisitId] = useState(null);
  const [hoveredEntry, setHoveredEntry] = useState(null);
  const [expandedTrackId, setExpandedTrackId] = useState(null);
  const [replayState, setReplayState] = useState(null);

  const [isProcessing, setIsProcessing] = useState(false);
  const [ctaDismissed, setCtaDismissed] = useState(false);

  const workspaceRef = useRef(null);

  const isShowingSample = uploadedFiles.length === 0 && points.length === 0;

  // Demo: synthetic dayIndex/yearStats from SAMPLE_DAY
  const demoDayIndex = useMemo(() => new Map([[SAMPLE_DAY.date, SAMPLE_DAY]]), []);
  const demoYearStats = useMemo(() => new Map([[2024, { months: new Set(['2024-06']), totalDays: 1, busiestSeconds: SAMPLE_DAY.summary.trackedSeconds }]]), []);

  const effectiveDayIndex = isShowingSample ? demoDayIndex : dayIndex;
  const effectiveYearStats = isShowingSample ? demoYearStats : yearStats;

  // Default selection on file load
  useEffect(() => {
    if (isShowingSample) {
      setSelectedYear(2024);
      setSelectedDate(SAMPLE_DAY.date);
      setVisibleMonth(SAMPLE_DAY.date.slice(0, 7));
      return;
    }
    if (yearStats.size === 0) return;
    const latestYear = Math.max(...yearStats.keys());
    const days = [...dayIndex.keys()].filter((k) => k.startsWith(String(latestYear))).sort();
    const latestDay = days[days.length - 1];
    setSelectedYear(latestYear);
    setSelectedDate(latestDay);
    setVisibleMonth(latestDay.slice(0, 7));
  }, [dayIndex, yearStats, isShowingSample]);

  const currentDay = useMemo(
    () => selectedDate ? effectiveDayIndex.get(selectedDate) : null,
    [effectiveDayIndex, selectedDate]
  );

  const monthGrid = useMemo(() => {
    if (!visibleMonth || !selectedYear) return null;
    return buildMonthGrid(effectiveDayIndex, effectiveYearStats, selectedYear, visibleMonth);
  }, [effectiveDayIndex, effectiveYearStats, selectedYear, visibleMonth]);

  const filteredEntries = useMemo(() => {
    if (!currentDay) return [];
    if (!searchQuery) return currentDay.entries;
    const q = searchQuery.toLowerCase();
    return currentDay.entries.filter((e) => e.type === 'journey' || e.searchTokens.includes(q));
  }, [currentDay, searchQuery]);

  // Raw points on the selected day (for Records.json fallback)
  const rawPointsForDay = useMemo(() => {
    if (!selectedDate) return [];
    return points.filter((p) => {
      if (p.type !== 'location_record' || !p.timestamp) return false;
      const d = new Date(p.timestamp);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      return key === selectedDate;
    });
  }, [points, selectedDate]);

  // File parsing (simplified — keep the streaming behavior of the previous implementation if desired)
  const handleFilesLoaded = useCallback(async (files) => {
    setUploadedFiles(files);
    setIsProcessing(true);
    const allPoints = [];
    const allPaths = [];
    for (const file of files) {
      try {
        const parsed = parseTimeline(file.data);
        allPoints.push(...parsed.points);
        allPaths.push(...parsed.paths);
      } catch (err) {
        console.error('[Timeline Visualizer] Parse error', err);
      }
    }
    setPoints(allPoints);
    setPaths(allPaths);
    const idx = buildDayIndex(allPoints, allPaths);
    setDayIndex(idx);
    setYearStats(buildYearStats(idx));
    setIsProcessing(false);
  }, []);

  const getOriginalFiles = useCallback(
    () => uploadedFiles.map((f) => ({ name: f.filename, blob: f.blob })),
    [uploadedFiles]
  );

  const handleClear = useCallback(() => {
    setUploadedFiles([]);
    setPoints([]);
    setPaths([]);
    setDayIndex(new Map());
    setYearStats(new Map());
    setSelectedYear(null);
    setSelectedDate(null);
    setVisibleMonth(null);
    setSelectedVisitId(null);
    setExpandedTrackId(null);
    setReplayState(null);
    setCtaDismissed(false);
  }, []);

  // Handlers wired to TimelinePanel
  const onYearChange = useCallback((year) => {
    setSelectedYear(year);
    const monthsForYear = [...effectiveDayIndex.keys()].filter((k) => k.startsWith(String(year))).sort();
    if (monthsForYear.length > 0) {
      const latestDay = monthsForYear[monthsForYear.length - 1];
      setSelectedDate(latestDay);
      setVisibleMonth(latestDay.slice(0, 7));
    }
    setSelectedVisitId(null);
    setExpandedTrackId(null);
    setReplayState(null);
  }, [effectiveDayIndex]);

  const onSelectDay = useCallback((date) => {
    setSelectedDate(date);
    setSelectedVisitId(null);
    setExpandedTrackId(null);
    setReplayState(null);
  }, []);

  const onPrevDay = useCallback(() => {
    setSelectedDate((d) => nextDateKey(d, 'prev'));
    setSelectedVisitId(null);
    setExpandedTrackId(null);
    setReplayState(null);
  }, []);

  const onNextDay = useCallback(() => {
    setSelectedDate((d) => nextDateKey(d, 'next'));
    setSelectedVisitId(null);
    setExpandedTrackId(null);
    setReplayState(null);
  }, []);

  const onPrevMonth = useCallback(() => setVisibleMonth((m) => nextMonthKey(m, 'prev')), []);
  const onNextMonth = useCallback(() => setVisibleMonth((m) => nextMonthKey(m, 'next')), []);

  const onSelectVisit = useCallback((visitId) => setSelectedVisitId(visitId), []);
  const onHoverEntry = useCallback((entry) => setHoveredEntry(entry), []);
  const onUnhoverEntry = useCallback(() => setHoveredEntry(null), []);
  const onToggleTrack = useCallback((trackId) => {
    setExpandedTrackId((prev) => prev === trackId ? null : trackId);
    setReplayState(null);
  }, []);

  // Keyboard arrow nav
  useEffect(() => {
    const handler = (e) => {
      if (e.target.matches?.('input, textarea, select')) return;
      if (e.key === 'ArrowLeft') onPrevDay();
      else if (e.key === 'ArrowRight') onNextDay();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onPrevDay, onNextDay]);

  return (
    <Layout
      title={pageTitle}
      description={pageDescription}
    >
      <Head>
        {/* Primary Meta Tags */}
        <meta name="title" content={pageTitle} />
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={content.meta.keywords} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:site_name" content="Dawarich" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={pageUrl} />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={imageUrl} />

        {/* Additional Meta Tags */}
        <meta name="author" content="Dawarich" />
        <meta name="language" content={htmlLang} />
        <meta name="revisit-after" content="7 days" />

        {/* JSON-LD Structured Data - WebApplication */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": content.h1,
            "url": pageUrl,
            "description": pageDescription,
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

        {/* JSON-LD Structured Data - HowTo */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": content.howTo.name,
            "description": content.howTo.description,
            "step": [
              {
                "@type": "HowToStep",
                "name": content.howTo.steps[0].name,
                "text": content.howTo.steps[0].text
              },
              {
                "@type": "HowToStep",
                "name": content.howTo.steps[1].name,
                "text": content.howTo.steps[1].text
              },
              {
                "@type": "HowToStep",
                "name": content.howTo.steps[2].name,
                "text": content.howTo.steps[2].text
              }
            ],
            "tool": {
              "@type": "HowToTool",
              "name": content.howTo.tool
            }
          })}
        </script>

        {/* JSON-LD Structured Data - FAQPage */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqItems.map(item => ({
              "@type": "Question",
              "name": toPlainText(item.q),
              "acceptedAnswer": {
                "@type": "Answer",
                "text": toPlainText(item.a)
              }
            }))
          })}
        </script>

        {/* JSON-LD Structured Data - BreadcrumbList */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": content.homeLabel,
                "item": homeUrl
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": content.toolsLabel,
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
        <div className={styles.heroSection}>
          <div className={styles.header}>
            <h1>{content.h1}</h1>
            <p>{content.intro}</p>
          </div>
          <div className={styles.uploadRow}>
            <FileUploader onFilesLoaded={handleFilesLoaded} onClear={handleClear} />
            {!isShowingSample && points.length > 0 && (
              <div className={styles.saveToAccountSection}>
                <p className={styles.saveToAccountIntro}>
                  {content.saveIntro}
                </p>
                <SaveToAccountButton
                  toolName="timeline-visualizer"
                  sourceHint={null}
                  getFiles={getOriginalFiles}
                  disabled={uploadedFiles.length === 0}
                />
              </div>
            )}
            <div className={styles.uploadMeta}>
              <div className={styles.privacyBadge}>
                <svg className={styles.privacyIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>{content.privacy}</span>
              </div>
              <details className={styles.instructionsCollapsible}>
                <summary className={styles.instructionsSummary}>
                  {content.exportData.title}
                </summary>
                <div className={styles.instructionsContent}>
                  <p>
                    {content.exportData.intro}
                  </p>
                  <p>
                    {content.exportData.warning}
                  </p>
                  <div className={styles.instructionsList}>
                    <div className={styles.instructionItem}>
                      <strong>{content.exportData.methods[0].title}</strong>
                      <p><RichText text={content.exportData.methods[0].steps[0]} /></p>
                      <p><RichText text={content.exportData.methods[0].steps[1]} /></p>
                    </div>
                    <div className={styles.instructionItem}>
                      <strong>{content.exportData.methods[1].title}</strong>
                      <p>{content.exportData.methods[1].steps[0]}</p>
                    </div>
                    <div className={styles.instructionItem}>
                      <strong>{content.exportData.methods[2].title}</strong>
                      <p>{content.exportData.methods[2].steps[0]}</p>
                    </div>
                  </div>
                  <p>
                    <RichText text={content.exportData.converterHint} />
                  </p>
                </div>
              </details>
            </div>
          </div>
        </div>

        <div className={styles.workspaceSection}>
          <div ref={workspaceRef} className={styles.workspaceGrid}>
            <div className={styles.panelColumn}>
              <TimelinePanel
                monthGrid={monthGrid}
                selectedDate={selectedDate}
                selectedYear={selectedYear}
                yearStats={effectiveYearStats}
                searchQuery={searchQuery}
                day={currentDay}
                filteredEntries={filteredEntries}
                rawPointCount={rawPointsForDay.length}
                selectedVisitId={selectedVisitId}
                expandedTrackId={expandedTrackId}
                replayState={replayState}
                onYearChange={onYearChange}
                onSearchChange={setSearchQuery}
                onSelectDay={onSelectDay}
                onPrevMonth={onPrevMonth}
                onNextMonth={onNextMonth}
                onPrevDay={onPrevDay}
                onNextDay={onNextDay}
                onSelectVisit={onSelectVisit}
                onHoverEntry={onHoverEntry}
                onUnhoverEntry={onUnhoverEntry}
                onToggleTrack={onToggleTrack}
                onReplayChange={setReplayState}
              />
            </div>
            <div className={styles.mapColumn}>
              <BrowserOnly>
                {() => (
                  <Suspense fallback={<div className={styles.mapLoading}>{content.loadingMap}</div>}>
                    <TimelineMapV2
                      day={currentDay}
                      rawPoints={rawPointsForDay}
                      selectedVisitId={selectedVisitId}
                      hoveredEntry={hoveredEntry}
                      replayState={replayState}
                      isSample={isShowingSample}
                      onVisitClick={onSelectVisit}
                      onTrackClick={onToggleTrack}
                      onReplayChange={setReplayState}
                      fullscreenTarget={workspaceRef}
                    />
                  </Suspense>
                )}
              </BrowserOnly>
            </div>
          </div>
        </div>

        {!isShowingSample && !ctaDismissed && points.length > 0 && (
          <div className={styles.postVizCta}>
            <button
              type="button"
              className={styles.postVizCtaDismiss}
              onClick={() => setCtaDismissed(true)}
              aria-label={content.cta.dismissLabel}
            >
              &times;
            </button>
            <p className={styles.postVizCtaText}>
              <RichText text={interpolate(content.cta.headline, {
                points: points.length.toLocaleString(htmlLang),
                dateRange: yearStats.size > 0 ? interpolate(content.cta.dateRange, {
                  startYear: Math.min(...yearStats.keys()), endYear: Math.max(...yearStats.keys()),
                }) : '',
              })} />
            </p>
            <a
              href="https://my.dawarich.app/users/sign_up?utm_source=tool&utm_medium=post-viz-cta&utm_campaign=timeline-visualizer"
              className={styles.postVizCtaButton}
            >
              {content.cta.trialButton}
            </a>
          </div>
        )}

        <div className={styles.bottomCtaPanel}>
          <div className={styles.ctaContent}>
            <h3>{content.cta.title}</h3>
            <p>{content.cta.body}</p>
            <SmartLink href="https://my.dawarich.app/users/sign_up?utm_source=tool&utm_medium=post-map-cta&utm_campaign=timeline-visualizer" className={styles.ctaButton}>{content.cta.button}</SmartLink>
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
                {card.footer?.map((text, index) => (
                  <p key={index}><RichText text={text} /></p>
                ))}
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

      </div>
      <RelatedTools slug="timeline-visualizer" />
      </main>
    </Layout>
  );
}
