import React from 'react';
import VisitRow from './VisitRow';
import JourneyLeg from './JourneyLeg';
import styles from './DayView.module.css';
import entryStyles from './entries.module.css';

function formatDayLabel(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
}

function formatDurationShort(minutes) {
  const m = Math.max(0, Math.round(minutes));
  if (m <= 0) return '0m';
  const h = Math.floor(m / 60);
  const mm = m % 60;
  if (h && mm) return `${h}h ${mm}m`;
  if (h) return `${h}h`;
  return `${m}m`;
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
            {summary.totalDistance} {summary.distanceUnit}
          </span>
        )}
        <span className={`${styles.summaryPill} ${styles.summaryPillPlaces}`}>
          {summary.placesVisited} places
        </span>
        {moving > 0 && (
          <span className={`${styles.summaryPill} ${styles.summaryPillMoving}`}>
            {formatDurationShort(moving)} moving
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
            <span>moving</span>
            <span>stationary</span>
          </div>
        </>
      )}
    </div>
  );
}

function DayFooter({ summary, totalVisits, totalTracks, onPrev, onNext }) {
  return (
    <footer className={styles.footer}>
      <button type="button" className={styles.navButton} onClick={onPrev} aria-label="Previous day">
        <ChevronLeft />
      </button>
      <dl className={styles.footerRollup}>
        <div><dt>Visits</dt><dd>{totalVisits}</dd></div>
        <div><dt>Tracks</dt><dd>{totalTracks}</dd></div>
        {summary.totalDistance > 0 && (
          <div><dt>Distance</dt><dd>{summary.totalDistance} {summary.distanceUnit}</dd></div>
        )}
        {summary.timeMovingMinutes > 0 && (
          <div><dt>Moving</dt><dd>{formatDurationShort(summary.timeMovingMinutes)}</dd></div>
        )}
      </dl>
      <button type="button" className={styles.navButton} onClick={onNext} aria-label="Next day">
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
  if (!day) {
    return <div className={styles.empty}>Select a day to see your timeline.</div>;
  }

  const totalVisits = day.entries.filter(e => e.type === 'visit').length;
  const totalTracks = day.entries.filter(e => e.type === 'journey').length;

  return (
    <div className={styles.dayView}>
      <div className={styles.header}>
        <div className={styles.headerNav}>
          <button type="button" className={styles.navButton} onClick={onPrevDay} aria-label="Previous day">
            <ChevronLeft />
          </button>
          <div className={styles.headerLabel}>{formatDayLabel(day.date)}</div>
          <button type="button" className={styles.navButton} onClick={onNextDay} aria-label="Next day">
            <ChevronRight />
          </button>
        </div>
        <div className={styles.headerMeta}>
          {totalVisits === 1 ? '1 visit' : `${totalVisits} visits`}
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
            <p className={styles.empty}>No visits tracked this day.</p>
            {rawPointCount > 0 && (
              <div className={styles.rawHint}>
                This file contains raw GPS records only — no place visits or activity segments.
                Switch to Semantic Location History or phone-export files for the full timeline view.
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
