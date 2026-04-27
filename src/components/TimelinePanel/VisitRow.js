import React from 'react';
import styles from './entries.module.css';

const ALL_DAY_THRESHOLD_MIN = 23 * 60;

function formatHHMM(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function formatDwell(minutes) {
  const m = Math.max(0, Math.round(minutes));
  if (m <= 0) return '0m';
  const h = Math.floor(m / 60);
  const mm = m % 60;
  if (h && mm) return `${h}h ${mm}m`;
  if (h) return `${h}h`;
  return `${m}m`;
}

export default function VisitRow({ entry, onSelect, onHover, onUnhover, isSelected }) {
  const isAllDay = entry.duration >= ALL_DAY_THRESHOLD_MIN;
  const className = `${styles.visitRow} ${isSelected ? styles.visitRowSelected : ''}`.trim();

  return (
    <button
      type="button"
      className={className}
      onClick={() => onSelect(entry.visitId)}
      onMouseEnter={() => onHover(entry)}
      onMouseLeave={onUnhover}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(entry.visitId);
        }
      }}
      aria-label={`${entry.name} · ${formatHHMM(entry.startedAt)}`}
      aria-pressed={isSelected}
      data-testid="visit-row"
    >
      <div className={styles.visitTime}>
        {isAllDay ? (
          <span style={{ fontSize: '0.75rem' }}>All day</span>
        ) : (
          <>
            <div className={styles.visitTimeStart}>{formatHHMM(entry.startedAt)}</div>
            <div className={styles.visitTimeEnd}>{formatHHMM(entry.endedAt)}</div>
          </>
        )}
      </div>
      <div className={styles.visitRail}>
        <span className={styles.visitDot} />
      </div>
      <div className={styles.visitContent}>
        <div className={styles.visitTitle}>{entry.name}</div>
        <div className={styles.visitMeta}>
          {formatDwell(entry.duration)} · {entry.pointCount} pts
        </div>
      </div>
    </button>
  );
}
