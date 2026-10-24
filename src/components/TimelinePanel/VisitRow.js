import React from 'react';
import { interpolate } from '@docusaurus/Interpolate';
import content from '@locale-content/components/VisitRow.json';
import styles from './entries.module.css';
import { useHtmlLang } from '@site/src/i18n/useHtmlLang';

const ALL_DAY_THRESHOLD_MIN = 23 * 60;

function formatHHMM(iso, htmlLang) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleTimeString(htmlLang, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
}

function formatDwell(minutes, htmlLang) {
  const m = Math.max(0, Math.round(minutes));
  if (m <= 0) return content.duration.zero;
  const h = Math.floor(m / 60);
  const mm = m % 60;
  if (h && mm) return interpolate(content.duration.hoursMinutes, { hours: h.toLocaleString(htmlLang), minutes: mm.toLocaleString(htmlLang) });
  if (h) return interpolate(content.duration.hours, { hours: h.toLocaleString(htmlLang) });
  return interpolate(content.duration.minutes, { minutes: m.toLocaleString(htmlLang) });
}

export default function VisitRow({ entry, onSelect, onHover, onUnhover, isSelected }) {
  const htmlLang = useHtmlLang();
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
      aria-label={`${entry.name} · ${formatHHMM(entry.startedAt, htmlLang)}`}
      aria-pressed={isSelected}
      data-testid="visit-row"
    >
      <div className={styles.visitTime}>
        {isAllDay ? (
          <span style={{ fontSize: '0.75rem' }}>{content.allDay}</span>
        ) : (
          <>
            <div className={styles.visitTimeStart}>{formatHHMM(entry.startedAt, htmlLang)}</div>
            <div className={styles.visitTimeEnd}>{formatHHMM(entry.endedAt, htmlLang)}</div>
          </>
        )}
      </div>
      <div className={styles.visitRail}>
        <span className={styles.visitDot} />
      </div>
      <div className={styles.visitContent}>
        <div className={styles.visitTitle}>{entry.name}</div>
        <div className={styles.visitMeta}>
          {interpolate(content.summary, { duration: formatDwell(entry.duration, htmlLang), points: entry.pointCount.toLocaleString(htmlLang) })}
        </div>
      </div>
    </button>
  );
}
