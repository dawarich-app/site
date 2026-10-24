import React from 'react';
import { interpolate } from '@docusaurus/Interpolate';
import { usePluralForm } from '@docusaurus/theme-common';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import content from '@locale-content/components/DayView.json';
import VisitRow from './VisitRow';
import JourneyLeg from './JourneyLeg';
import styles from './DayView.module.css';
import entryStyles from './entries.module.css';

function formatDayLabel(dateStr, htmlLang) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString(htmlLang, { weekday: 'long', month: 'long', day: 'numeric' });
}

function formatDurationShort(minutes, htmlLang) {
  const m = Math.max(0, Math.round(minutes));
  if (m <= 0) return content.duration.zero;
  const h = Math.floor(m / 60);
  const mm = m % 60;
  if (h && mm) return interpolate(content.duration.hoursMinutes, { hours: h.toLocaleString(htmlLang), minutes: mm.toLocaleString(htmlLang) });
  if (h) return interpolate(content.duration.hours, { hours: h.toLocaleString(htmlLang) });
  return interpolate(content.duration.minutes, { minutes: m.toLocaleString(htmlLang) });
}

function ChevronLeft() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

function DaySummary({ summary }) {
  const { i18n } = useDocusaurusContext();
  const htmlLang = i18n.localeConfigs[i18n.currentLocale].htmlLang;
  const moving = summary.timeMovingMinutes;
  const stationary = summary.timeStationaryMinutes;
  const total = moving + stationary;
  const movingPct = total > 0 ? Math.round((moving / total) * 100) : 0;
  const stationaryPct = 100 - movingPct;

  return (
    <div className={styles.summary}>
      <div className={styles.summaryStats}>
        {summary.totalDistance > 0 && (
          <span className={`${styles.summaryPill} ${styles.summaryPillDistance}`}>
            {summary.totalDistance.toLocaleString(htmlLang)} {summary.distanceUnit}
          </span>
        )}
        <span className={`${styles.summaryPill} ${styles.summaryPillPlaces}`}>
          {interpolate(content.places, { count: summary.placesVisited.toLocaleString(htmlLang) })}
        </span>
        {moving > 0 && (
          <span className={`${styles.summaryPill} ${styles.summaryPillMoving}`}>
            {interpolate(content.movingDuration, { duration: formatDurationShort(moving, htmlLang) })}
          </span>
        )}
      </div>
      {total > 0 && (
        <>
          <div className={styles.summaryBar}>
            <div className={styles.summaryBarMoving} style={{ width: `${movingPct}%` }} />
            <div className={styles.summaryBarStationary} style={{ width: `${stationaryPct}%` }} />
          </div>
          <div className={styles.summaryBarLabels}>
            <span>{content.movingLabel}</span>
            <span>{content.stationaryLabel}</span>
          </div>
        </>
      )}
    </div>
  );
}

function DayFooter({ summary, totalVisits, totalTracks, onPrev, onNext }) {
  const { i18n } = useDocusaurusContext();
  const htmlLang = i18n.localeConfigs[i18n.currentLocale].htmlLang;
  return (
    <footer className={styles.footer}>
      <button type="button" className={styles.navButton} onClick={onPrev} aria-label={content.previousDay}>
        <ChevronLeft />
      </button>
      <dl className={styles.footerRollup}>
        <div><dt>{content.visitsLabel}</dt><dd>{totalVisits.toLocaleString(htmlLang)}</dd></div>
        <div><dt>{content.tracksLabel}</dt><dd>{totalTracks.toLocaleString(htmlLang)}</dd></div>
        {summary.totalDistance > 0 && (
          <div><dt>{content.distanceLabel}</dt><dd>{summary.totalDistance.toLocaleString(htmlLang)} {summary.distanceUnit}</dd></div>
        )}
        {summary.timeMovingMinutes > 0 && (
          <div><dt>{content.movingTitle}</dt><dd>{formatDurationShort(summary.timeMovingMinutes, htmlLang)}</dd></div>
        )}
      </dl>
      <button type="button" className={styles.navButton} onClick={onNext} aria-label={content.nextDay}>
        <ChevronRight />
      </button>
    </footer>
  );
}

export default function DayView({
  day,
  filteredEntries,
  rawPointCount = 0,
  onPrevDay,
  onNextDay,
  onSelectVisit,
  onHoverEntry,
  onUnhoverEntry,
  onToggleTrack,
  selectedVisitId,
  expandedTrackId,
  replayState,
  onReplayChange,
}) {
  const { i18n } = useDocusaurusContext();
  const htmlLang = i18n.localeConfigs[i18n.currentLocale].htmlLang;
  const { selectMessage } = usePluralForm();
  if (!day) {
    return <div className={styles.empty}>{content.selectDay}</div>;
  }

  const totalVisits = day.entries.filter(e => e.type === 'visit').length;
  const totalTracks = day.entries.filter(e => e.type === 'journey').length;

  return (
    <div className={styles.dayView}>
      <div className={styles.header}>
        <div className={styles.headerNav}>
          <button type="button" className={styles.navButton} onClick={onPrevDay} aria-label={content.previousDay}>
            <ChevronLeft />
          </button>
          <div className={styles.headerLabel}>{formatDayLabel(day.date, htmlLang)}</div>
          <button type="button" className={styles.navButton} onClick={onNextDay} aria-label={content.nextDay}>
            <ChevronRight />
          </button>
        </div>
        <div className={styles.headerMeta}>
          {interpolate(selectMessage(totalVisits, content.visitCount), { count: totalVisits.toLocaleString(htmlLang) })}
        </div>
      </div>

      <DaySummary summary={day.summary} />

      <div className={styles.entriesScroll}>
        {filteredEntries.length > 0 ? (
          <ol className={entryStyles.entriesList}>
            {filteredEntries.map((entry) => entry.type === 'visit' ? (
              <li key={entry.visitId}>
                <VisitRow
                  entry={entry}
                  onSelect={onSelectVisit}
                  onHover={onHoverEntry}
                  onUnhover={onUnhoverEntry}
                  isSelected={selectedVisitId === entry.visitId}
                />
              </li>
            ) : (
              <JourneyLeg
                key={entry.trackId}
                entry={entry}
                isExpanded={expandedTrackId === entry.trackId}
                onToggleExpand={onToggleTrack}
                onHover={onHoverEntry}
                onUnhover={onUnhoverEntry}
                replayState={replayState}
                onReplayChange={onReplayChange}
              />
            ))}
          </ol>
        ) : (
          <>
            <p className={styles.empty}>{content.emptyDay}</p>
            {rawPointCount > 0 && (
              <div className={styles.rawHint}>
                {content.rawHint}
              </div>
            )}
          </>
        )}
      </div>

      <DayFooter
        summary={day.summary}
        totalVisits={totalVisits}
        totalTracks={totalTracks}
        onPrev={onPrevDay}
        onNext={onNextDay}
      />
    </div>
  );
}
